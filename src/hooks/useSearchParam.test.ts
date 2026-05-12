import { renderHook, act } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSearchParam from './useSearchParam';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('useSearchParam', () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('should return the current value of the search parameter if it exists', () => {
    // Simulate a URL like `?myParam=hello`
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('?myParam=hello'));
    
    const { result } = renderHook(() => useSearchParam('myParam'));

    expect(result.current[0]).toBe('hello');
  });

  it('should return null if the search parameter does not exist', () => {
    // Simulate a URL missing the requested param
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('?otherParam=123'));
    
    const { result } = renderHook(() => useSearchParam('myParam'));

    expect(result.current[0]).toBeNull();
  });

  it('should update the URL with the new parameter value while preserving other parameters', () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('?otherParam=123'));
    const { result } = renderHook(() => useSearchParam('myParam'));

    act(() => {
      result.current[1]('world');
    });

    // URLSearchParams cleanly appends the new parameter without dropping the old one
    expect(mockPush).toHaveBeenCalledWith('?otherParam=123&myParam=world');
  });

  it('should delete the parameter from the URL when the setter is called with null', () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('?myParam=hello&otherParam=123'));
    const { result } = renderHook(() => useSearchParam('myParam'));

    act(() => {
      result.current[1](null);
    });

    expect(mockPush).toHaveBeenCalledWith('?otherParam=123');
  });

  it('EDGE CASE: should handle setting a value safely when the URL has no query parameters at all', () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(''));
    const { result } = renderHook(() => useSearchParam('myParam'));

    act(() => {
      result.current[1]('world');
    });
    expect(mockPush).toHaveBeenCalledWith('?myParam=world');
  });

  it('EDGE CASE: should safely format the query string if the last remaining parameter is deleted', () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('?myParam=hello'));
    const { result } = renderHook(() => useSearchParam('myParam'));

    act(() => {
      result.current[1](null);
    });
    
    // Deleting the only parameter leaves an empty string, which the hook formats safely as `?`
    expect(mockPush).toHaveBeenCalledWith('?');
  });
});