import { renderHook, act } from '@testing-library/react';
import useFilter, { Filter, toggleAllEnabled, toggleSingleEnabled } from './useFilter';

type TestItem = { id: string; category: string; value: number };

const mockThings: TestItem[] = [
  { id: '1', category: 'A', value: 10 },
  { id: '2', category: 'B', value: 20 },
  { id: '3', category: 'A', value: 30 },
];

// Our mock filter includes both `ValueFilterItem` (matching via `field` / `value`)
// and `FunctionFilterItem` (matching via `match` function) to thoroughly test the typing and logic.
const mockFilter: Filter<TestItem> = {
  categoryFilter: {
    name: 'Category',
    items: {
      catA: { name: 'Cat A', field: 'category', value: 'A' },
      catB: { name: 'Cat B', field: 'category', value: 'B' },
    },
  },
  valueFilter: {
    name: 'Value',
    items: {
      high: { name: 'High', match: (t) => t.value > 15 },
      low: { name: 'Low', match: (t) => t.value <= 15 },
    },
  },
};

describe('useFilter', () => {
  it('should initialize with all filters enabled and return all items matching the filter logic', () => {
    const { result } = renderHook(() => useFilter(mockThings, mockFilter));

    expect(result.current.filtered).toEqual(mockThings);
    
    expect(result.current.filterEnabled).toEqual({
      categoryFilter: { catA: true, catB: true },
      valueFilter: { high: true, low: true },
    });
    
    expect(result.current.filterNames).toEqual({
      categoryFilter: {
        name: 'Category',
        items: { catA: 'Cat A', catB: 'Cat B' },
      },
      valueFilter: {
        name: 'Value',
        items: { high: 'High', low: 'Low' },
      },
    });
  });

  it('should correctly reduce the filtered items array when a filter is disabled', () => {
    const { result } = renderHook(() => useFilter(mockThings, mockFilter));

    act(() => {
      const newState = toggleSingleEnabled(result.current.filterEnabled, 'categoryFilter', 'catA', false);
      result.current.setFilterEnabled(newState);
    });

    expect(result.current.filterEnabled.categoryFilter.catA).toBe(false);
    expect(result.current.filterEnabled.categoryFilter.catB).toBe(true);
    
    // With Cat A disabled, only Cat B items should remain
    expect(result.current.filtered).toEqual([{ id: '2', category: 'B', value: 20 }]);
  });

  it('should support batch toggling via toggleAllEnabled', () => {
    const { result } = renderHook(() => useFilter(mockThings, mockFilter));

    act(() => {
      const newState = toggleAllEnabled(result.current.filterEnabled, false);
      result.current.setFilterEnabled(newState);
    });

    expect(result.current.filterEnabled).toEqual({
      categoryFilter: { catA: false, catB: false },
      valueFilter: { high: false, low: false },
    });
    
    // Since all are disabled, no items can match
    expect(result.current.filtered).toEqual([]);

    act(() => {
      // Bring them all back
      const newState = toggleAllEnabled(result.current.filterEnabled, true);
      result.current.setFilterEnabled(newState);
    });

    expect(result.current.filtered).toEqual(mockThings);
  });

  it('should correctly preserve active states when a new filter is added dynamically over time', () => {
    let currentFilter = mockFilter;
    const { result, rerender } = renderHook(() => useFilter(mockThings, currentFilter));

    // Disable Cat A initially
    act(() => {
      const newState = toggleSingleEnabled(result.current.filterEnabled, 'categoryFilter', 'catA', false);
      result.current.setFilterEnabled(newState);
    });

    expect(result.current.filterEnabled.categoryFilter.catA).toBe(false);

    // Update the external filter dependency by simulating a new category item being fetched/added
    currentFilter = {
      ...mockFilter,
      categoryFilter: {
        ...mockFilter.categoryFilter,
        items: {
          ...mockFilter.categoryFilter.items,
          catC: { name: 'Cat C', field: 'category', value: 'C' },
        },
      },
    };

    rerender();

    // The hook should keep 'catA' disabled but intelligently default 'catC' to true
    expect(result.current.filterEnabled.categoryFilter).toEqual({
      catA: false,
      catB: true,
      catC: true,
    });
  });

  it('should re-evaluate filtering when the external items array changes', () => {
    let currentThings = mockThings;
    const { result, rerender } = renderHook(() => useFilter(currentThings, mockFilter));

    act(() => {
      const newState = toggleSingleEnabled(result.current.filterEnabled, 'valueFilter', 'low', false);
      result.current.setFilterEnabled(newState);
    });

    expect(result.current.filtered).toHaveLength(2); // Only IDs '2' and '3' (> 15) remain

    // Add a new thing that matches the active filters
    currentThings = [
      ...mockThings,
      { id: '4', category: 'A', value: 40 },
    ];

    rerender();

    // The new item should be immediately evaluated and included in the filtered array
    expect(result.current.filtered).toEqual([
      { id: '2', category: 'B', value: 20 },
      { id: '3', category: 'A', value: 30 },
      { id: '4', category: 'A', value: 40 },
    ]);
  });

  it('EDGE CASE: should evaluate safely and cleanly when things and filter config are completely empty', () => {
    const emptyThings: any[] = [];
    const emptyFilter = {};
    const { result } = renderHook(() => useFilter(emptyThings, emptyFilter));

    expect(result.current.filtered).toEqual([]);
    expect(result.current.filterEnabled).toEqual({});
    expect(result.current.filterNames).toEqual({});
  });

  it('EDGE CASE: should garbage-collect and remove old filter group states if the group is dynamically removed', () => {
    let currentFilter = mockFilter;
    const { result, rerender } = renderHook(() => useFilter(mockThings, currentFilter));

    // Completely remove the `categoryFilter` object
    currentFilter = {
      valueFilter: mockFilter.valueFilter,
    };

    rerender();

    // `categoryFilter` should be cleanly purged from the hook's internal tracking
    expect(result.current.filterEnabled).toEqual({
      valueFilter: { high: true, low: true },
    });
  });

  it('EDGE CASE: should safely support functional updates when executing setFilterEnabled', () => {
    const { result } = renderHook(() => useFilter(mockThings, mockFilter));

    act(() => {
      result.current.setFilterEnabled((old) => toggleSingleEnabled(old, 'categoryFilter', 'catB', false));
    });

    expect(result.current.filterEnabled.categoryFilter.catB).toBe(false);
  });
});