import { renderHook, act } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import useAutoCampaignFilter from './useAutoCampaignFilter';
import { FilterEnabled } from './useFilter';

// Mock the Next.js useSearchParams hook
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

describe('useAutoCampaignFilter', () => {
  const mockSetFilterEnabled = jest.fn();
  const mockCampaignFilter = {
    items: {
      'camp-1': { name: 'Campaign One' },
      'camp-2': { name: 'Campaign Two' },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with an empty message when no campaign is selected', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: () => null,
    });

    const { result } = renderHook(() =>
      useAutoCampaignFilter(mockSetFilterEnabled, mockCampaignFilter as any)
    );

    expect(result.current.message).toBe('');
    expect(mockSetFilterEnabled).not.toHaveBeenCalled();
  });

  it('should set message and enable the filter when a valid campaign is present in URL', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (param: string) => (param === 'campaignFilter' ? 'camp-1' : null),
    });

    const { result } = renderHook(() =>
      useAutoCampaignFilter(mockSetFilterEnabled, mockCampaignFilter as any)
    );

    expect(result.current.message).toBe('Filtered to campaign Campaign One.');
    expect(mockSetFilterEnabled).toHaveBeenCalledTimes(1);

    // Extract the state updater function passed to setFilterEnabled
    const updaterFunction = mockSetFilterEnabled.mock.calls[0][0];
    
    // Test the state updater function behavior
    const oldState: FilterEnabled = { campaign: { 'camp-1': false, 'camp-2': true } };
    const newState = updaterFunction(oldState);

    expect(newState).toEqual({
      campaign: {
        'camp-1': true,
        'camp-2': false,
      },
    });
  });

  it('should clear message and call setFilterEnabled on handleFilterEnabled', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: () => null,
    });

    const { result } = renderHook(() =>
      useAutoCampaignFilter(mockSetFilterEnabled, mockCampaignFilter as any)
    );

    act(() => {
      result.current.handleFilterEnabled({ campaign: { 'camp-2': true } } as any);
    });

    expect(result.current.message).toBe('');
    expect(mockSetFilterEnabled).toHaveBeenCalledWith({ campaign: { 'camp-2': true } });
  });

  it('should not set message or enable filter if an invalid campaign is present in URL', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (param: string) => (param === 'campaignFilter' ? 'invalid-camp' : null),
    });

    const { result } = renderHook(() =>
      useAutoCampaignFilter(mockSetFilterEnabled, mockCampaignFilter as any)
    );

    expect(result.current.message).toBe('');
    expect(mockSetFilterEnabled).not.toHaveBeenCalled();
  });

  it('should clear the message if the URL campaign filter is subsequently removed', () => {
    let currentParam: string | null = 'camp-1';
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: (param: string) => (param === 'campaignFilter' ? currentParam : null),
    }));

    const { result, rerender } = renderHook(() =>
      useAutoCampaignFilter(mockSetFilterEnabled, mockCampaignFilter as any)
    );

    expect(result.current.message).toBe('Filtered to campaign Campaign One.');
    
    // Simulate URL parameter removal and re-render
    currentParam = null;
    rerender();

    expect(result.current.message).toBe('');
  });
});