import { renderHook, act } from '@testing-library/react';
import useSort, {
  sortItems,
  SortCriterion,
  criterionSort,
  categoryMatch,
  categorizeItems,
  extractNames
} from './useSort';

describe('sortItems', () => {
  it('sorts items in ascending and descending order based on a simple property', () => {
    // 1. Arrange: Create our dummy items and sorting rules
    type DummyItem = { name: string };
    
    const items: DummyItem[] = [
      { name: 'Zebra' },
      { name: 'Apple' },
      { name: 'Mango' },
    ];

    const criteria: SortCriterion<DummyItem>[] = [
      { name: 'Sort by Name', field: 'name' }
    ];

    // 2. Act: Run the function for both ascending and descending directions
    const ascendingResult = sortItems(items, criteria, 'ascending');
    const descendingResult = sortItems(items, criteria, 'descending');

    // 3. Assert: Verify the resulting arrays are ordered exactly as expected
    expect(ascendingResult).toEqual([
      { name: 'Apple' },
      { name: 'Mango' },
      { name: 'Zebra' },
    ]);
    expect(descendingResult).toEqual([
      { name: 'Zebra' },
      { name: 'Mango' },
      { name: 'Apple' },
    ]);
  });

  it('handles an empty array without crashing', () => {
    const criteria: SortCriterion<{ name: string }>[] = [
      { name: 'Name', field: 'name' }
    ];
    
    expect(sortItems([], criteria, 'ascending')).toEqual([]);
  });

  it('sorts based on multiple criteria when there are matching values (tie-breaking)', () => {
    type Person = { role: string; name: string };
    const items: Person[] = [
      { role: 'Admin', name: 'Zebra' },
      { role: 'User', name: 'Apple' },
      { role: 'Admin', name: 'Mango' },
    ];

    // Sort by role first, then by name to break the tie between the two Admins
    const criteria: SortCriterion<Person>[] = [
      { name: 'Sort by Role', field: 'role' },
      { name: 'Sort by Name', field: 'name' }
    ];

    expect(sortItems(items, criteria, 'ascending')).toEqual([
      { role: 'Admin', name: 'Mango' }, // Admin comes before User. Mango comes before Zebra.
      { role: 'Admin', name: 'Zebra' },
      { role: 'User', name: 'Apple' },
    ]);
  });

  it('handles capitalization according to standard JavaScript string comparison', () => {
    type DummyItem = { name: string };
    const items: DummyItem[] = [
      { name: 'apple' }, // lowercase 'a'
      { name: 'Zebra' }, // uppercase 'Z'
    ];

    const criteria: SortCriterion<DummyItem>[] = [{ name: 'Name', field: 'name' }];
    
    // In standard JS, uppercase letters come before lowercase letters
    expect(sortItems(items, criteria, 'ascending')).toEqual([
      { name: 'Zebra' },
      { name: 'apple' },
    ]);
  });
});

describe('useSort', () => {
  type Item = { id: number; name: string };
  const items: Item[] = [
    { id: 1, name: 'Zebra' },
    { id: 2, name: 'Apple' },
    { id: 3, name: 'Mango' },
  ];

  const criteria = {
    name: { name: 'Name', field: 'name' as const },
  };

  it('initializes with default state and sorts ascending', () => {
    // renderHook creates a fake React component environment for our hook
    const { result } = renderHook(() => useSort(items, criteria));

    expect(result.current.sortDirection).toBe('ascending');
    expect(result.current.sortCriteriaOrder).toEqual(['name']);
    
    // Because there are no categories defined in our mock criteria, 
    // categorizeItems puts everything under an empty string name fallback.
    expect(result.current.sorted).toEqual([
      {
        name: '',
        items: [
          { id: 2, name: 'Apple' },
          { id: 3, name: 'Mango' },
          { id: 1, name: 'Zebra' },
        ],
      }
    ]);
  });

  it('updates sort direction and re-sorts items', () => {
    const { result } = renderHook(() => useSort(items, criteria));

    // `act` simulates a user triggering a state change in React
    act(() => {
      result.current.setSortDirection('descending');
    });

    expect(result.current.sortDirection).toBe('descending');
    expect(result.current.sorted[0].items).toEqual([
      { id: 1, name: 'Zebra' },
      { id: 3, name: 'Mango' },
      { id: 2, name: 'Apple' },
    ]);
  });

  it('updates criteria order state', () => {
    const multiCriteria = {
      name: { name: 'Name', field: 'name' as const },
      id: { name: 'ID', field: 'id' as const },
    };
    const { result } = renderHook(() => useSort(items, multiCriteria));

    act(() => {
      result.current.setSortCriteriaOrder(['id', 'name']);
    });

    expect(result.current.sortCriteriaOrder).toEqual(['id', 'name']);
  });

  it('throws an error if an invalid criteria order is set', () => {
    // Suppress console.error temporarily so the expected error doesn't clutter our test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useSort(items, criteria));

    expect(() => {
      act(() => {
        result.current.setSortCriteriaOrder(['does-not-exist']);
      });
    }).toThrow('invalid sort criteria order');

    consoleSpy.mockRestore();
  });

  it('applies the fallback criterion when primary criteria result in a tie', () => {
    const tieItems = [
      { id: 2, group: 'A' },
      { id: 1, group: 'A' },
    ];
    const tieCriteria = { group: { name: 'Group', field: 'group' as const } };
    const fallback = { name: 'Fallback ID', field: 'id' as const };
    
    const { result } = renderHook(() => useSort(tieItems, tieCriteria, fallback));
    
    expect(result.current.sorted[0].items).toEqual([
      { id: 1, group: 'A' },
      { id: 2, group: 'A' },
    ]);
  });

  it('recalculates when the input items array changes', () => {
    const { result, rerender } = renderHook(
      ({ currentItems }) => useSort(currentItems, criteria),
      { initialProps: { currentItems: items } }
    );

    expect(result.current.sorted[0].items).toHaveLength(3);

    // Simulating the parent component passing down new data
    rerender({ currentItems: [{ id: 4, name: 'Banana' }] });

    expect(result.current.sorted[0].items).toHaveLength(1);
    expect(result.current.sorted[0].items[0].name).toBe('Banana');
  });
});

describe('criterionSort', () => {
  it('uses a custom sort function when provided', () => {
    const criterion: SortCriterion<{ length: number }> = {
      name: 'By Length',
      sort: (a, b) => a.length - b.length,
    };
    expect(criterionSort(criterion, { length: 5 }, { length: 10 })).toBe(-5);
  });

  it('uses order array for enum sorting', () => {
    const criterion: SortCriterion<{ role: string }> = {
      name: 'By Role',
      field: 'role',
      order: ['Admin', 'Manager', 'User'],
    };
    expect(criterionSort(criterion, { role: 'Admin' }, { role: 'User' })).toBeLessThan(0);
    expect(criterionSort(criterion, { role: 'User' }, { role: 'Manager' })).toBeGreaterThan(0);
    expect(criterionSort(criterion, { role: 'Admin' }, { role: 'Admin' })).toBe(0);
  });

  it('uses standard property comparison when no custom sort or order is provided', () => {
    const criterion: SortCriterion<{ name: string }> = { name: 'By Name', field: 'name' };
    expect(criterionSort(criterion, { name: 'Apple' }, { name: 'Banana' })).toBe(-1);
    expect(criterionSort(criterion, { name: 'Zebra' }, { name: 'Apple' })).toBe(1);
    expect(criterionSort(criterion, { name: 'Mango' }, { name: 'Mango' })).toBe(0);
  });
});

describe('categoryMatch', () => {
  it('uses custom match function when provided', () => {
    const cat = { name: 'Adults', match: (p: { age: number }) => p.age >= 18 };
    expect(categoryMatch(cat, { age: 20 })).toBe(true);
    expect(categoryMatch(cat, { age: 15 })).toBe(false);
  });

  it('matches by exact property value', () => {
    const cat = { name: 'Admins', field: 'role', value: 'Admin' as const };
    expect(categoryMatch(cat, { role: 'Admin' })).toBe(true);
    expect(categoryMatch(cat, { role: 'User' })).toBe(false);
  });
});

describe('categorizeItems', () => {
  type Item = { status: string; id: number };
  const items: Item[] = [
    { status: 'Done', id: 1 },
    { status: 'Pending', id: 2 },
    { status: 'Done', id: 3 },
  ];
  
  const categories = [
    { name: 'Completed', field: 'status', value: 'Done' as const },
    { name: 'Remaining', field: 'status', value: 'Pending' as const },
  ];

  it('groups items into categories in ascending order', () => {
    const result = categorizeItems(items, categories, 'ascending');
    expect(result).toEqual([
      { name: 'Completed', items: [{ status: 'Done', id: 1 }, { status: 'Done', id: 3 }] },
      { name: 'Remaining', items: [{ status: 'Pending', id: 2 }] },
    ]);
  });

  it('reverses the categories in descending order', () => {
    const result = categorizeItems(items, categories, 'descending');
    expect(result).toEqual([
      { name: 'Remaining', items: [{ status: 'Pending', id: 2 }] },
      { name: 'Completed', items: [{ status: 'Done', id: 1 }, { status: 'Done', id: 3 }] },
    ]);
  });

  it('returns items under an empty name if no categories matched and array is not empty', () => {
    const noMatchCats = [{ name: 'Failed', field: 'status', value: 'Failed' as const }];
    const result = categorizeItems(items, noMatchCats, 'ascending');
    
    // Expected because the items didn't match the 'Failed' category
    // and categorizeItems provides a fallback catch-all grouping.
    expect(result).toEqual([{ name: '', items }]);
  });
});

describe('extractNames', () => {
  it('creates a mapping of criteria IDs to their display names', () => {
    const criteria = {
      nameSort: { name: 'Name', field: 'name' as const },
      roleSort: { name: 'Role', field: 'role' as const },
    };
    
    expect(extractNames(criteria)).toEqual({
      nameSort: 'Name',
      roleSort: 'Role',
    });
  });
});