import { sortItems, SortCriterion } from './useSort';

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