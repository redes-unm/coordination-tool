import { renderHook, act } from '@testing-library/react';
import useSearch from './useSearch';

const mockThings = [
  { id: '1', name: 'Apple', category: 'Fruit' },
  { id: '2', name: 'Banana', category: 'Fruit' },
  { id: '3', name: 'Carrot', category: 'Vegetable' },
];

describe('useSearch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should initialize with all items and an empty search text', () => {
    const fields = ['name', 'category'] as any;
    const { result } = renderHook(() => useSearch(mockThings, fields));

    expect(result.current.searchText).toBe('');
    expect(result.current.searched).toEqual(mockThings);
  });

  it('should update searchText immediately but delay the search filtering via debounce', () => {
    const fields = ['name'] as any;
    const { result } = renderHook(() => useSearch(mockThings, fields));

    act(() => {
      result.current.setSearchText('app');
    });

    // 1. Text should update instantly for a responsive UI
    expect(result.current.searchText).toBe('app');

    // 2. The filter should NOT have fired yet
    expect(result.current.searched).toEqual(mockThings);

    // 3. Fast-forward the debounce timer
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // 4. Now the filter should be applied
    expect(result.current.searched).toEqual([
      { id: '1', name: 'Apple', category: 'Fruit' },
    ]);
  });

  it('should perform case-insensitive searches across multiple fields', () => {
    const fields = ['name', 'category'] as any;
    const { result } = renderHook(() => useSearch(mockThings, fields));

    act(() => {
      // Mixed case testing
      result.current.setSearchText('fRuIt');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should match both items that have 'Fruit' in their category field
    expect(result.current.searched).toEqual([
      { id: '1', name: 'Apple', category: 'Fruit' },
      { id: '2', name: 'Banana', category: 'Fruit' },
    ]);
  });

  it('should trigger the onSearch callback after the debounce period if provided', () => {
    const mockOnSearch = jest.fn();
    // Testing with a custom debounce timing of 500ms
    const fields = ['name'] as any;
    const { result } = renderHook(() => useSearch(mockThings, fields, mockOnSearch, 500));

    act(() => {
      result.current.setSearchText('banana');
    });

    expect(mockOnSearch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('banana');
  });

  it('EDGE CASE: should safely ignore empty string searches for the onSearch tracking callback', () => {
    const mockOnSearch = jest.fn();
    const fields = ['name'] as any;
    const { result } = renderHook(() => useSearch(mockThings, fields, mockOnSearch));

    act(() => result.current.setSearchText(''));
    act(() => { jest.advanceTimersByTime(300); });

    // onSearch shouldn't execute if the string evaluates to falsy
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('EDGE CASE: should cleanup and cancel debounced calls on unmount to prevent memory leaks', () => {
    const mockOnSearch = jest.fn();
    const fields = ['name'] as any;
    const { result, unmount } = renderHook(() => useSearch(mockThings, fields, mockOnSearch));

    act(() => result.current.setSearchText('car'));

    // Force the component to unmount BEFORE the debounce timer finishes
    unmount();
    act(() => { jest.advanceTimersByTime(300); });

    // The debounce timer should have been safely cleared via the cleanup effect
    expect(mockOnSearch).not.toHaveBeenCalled();
  });
});
