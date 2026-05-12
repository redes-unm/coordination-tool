import { renderHook, act } from '@testing-library/react';
import usePopup from './usePopup';
import { Popup } from 'mapbox-gl';
import EditableItemDisplay from '../components/EditableItemDisplay';

// Mock dependencies
jest.mock('mapbox-gl', () => {
  const PopupMock = jest.fn();
  return {
    __esModule: true,
    default: { Popup: PopupMock },
    Popup: PopupMock,
  };
});

jest.mock('../components/EditableItemDisplay', () => jest.fn(() => null));

jest.mock('@turf/center', () => jest.fn((feature) => ({ geometry: { coordinates: [10, 20] } })));

jest.mock('../lib/util', () => ({
  toLngLat: jest.fn((coords) => coords),
  throwErr: jest.fn((msg) => { throw new Error(msg); }),
}));

describe('usePopup', () => {
  let mockMap: any;
  let mockAnnotation: any;
  let mockHandlers: any;
  let mockPopupInstance: any;
  let resizeCallback: ResizeObserverCallback;
  let mockObserve: jest.Mock;
  let mockDisconnect: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';

    mockMap = {
      panBy: jest.fn(),
    };

    mockAnnotation = {
      id: 'test-1',
      geometry: { type: 'Point', coordinates: [0, 0] },
    };

    mockHandlers = {
      save: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      close: jest.fn(),
    };

    // Mock Mapbox Popup behavior, including simulating the injection of the HTML container into the document
    mockPopupInstance = {
      addTo: jest.fn().mockReturnThis(),
      remove: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      setLngLat: jest.fn().mockReturnThis(),
      setHTML: jest.fn((html: string) => {
        document.body.innerHTML += html;
        return mockPopupInstance;
      }),
    };

    (Popup as unknown as jest.Mock).mockImplementation(() => mockPopupInstance);

    // Mock global ResizeObserver
    mockObserve = jest.fn();
    mockDisconnect = jest.fn();
    global.ResizeObserver = class {
      constructor(cb: ResizeObserverCallback) {
        resizeCallback = cb;
      }
      observe = mockObserve;
      unobserve = jest.fn();
      disconnect = mockDisconnect;
    } as any;
  });

  it('should not initialize the popup if map or annotation.id is missing', () => {
    const { rerender } = renderHook(
      ({ mapObj, ann }) => usePopup(mapObj, ann, mockHandlers),
      { initialProps: { mapObj: null, ann: mockAnnotation } }
    );

    expect(Popup).not.toHaveBeenCalled();

    rerender({ mapObj: mockMap, ann: { ...mockAnnotation, id: undefined } });
    expect(Popup).not.toHaveBeenCalled();
  });

  it('should initialize Popup, create React root, and render EditableItemDisplay', () => {
    renderHook(() => usePopup(mockMap, mockAnnotation, mockHandlers, true));

    expect(Popup).toHaveBeenCalledTimes(1);
    expect(mockPopupInstance.addTo).toHaveBeenCalledWith(mockMap);
    expect(mockPopupInstance.setHTML).toHaveBeenCalledWith('<div id="test-1-popup-container"/>');

    expect(EditableItemDisplay).toHaveBeenCalledTimes(1);
    const props = (EditableItemDisplay as jest.Mock).mock.calls[0][0];

    expect(props.item).toEqual(mockAnnotation);
    expect(props.editing).toBe(true);
  });

  it('should register Mapbox close event and trigger close handler', () => {
    renderHook(() => usePopup(mockMap, mockAnnotation, mockHandlers));

    expect(mockPopupInstance.on).toHaveBeenCalledWith('close', expect.any(Function));

    // Extract and trigger the bound close event
    const closeHandler = mockPopupInstance.on.mock.calls.find((call: any[]) => call[0] === 'close')[1];
    
    act(() => {
      closeHandler();
    });

    expect(mockHandlers.close).toHaveBeenCalledTimes(1);
  });

  it('should properly proxy handleDelete and trigger close', async () => {
    renderHook(() => usePopup(mockMap, mockAnnotation, mockHandlers));

    const props = (EditableItemDisplay as jest.Mock).mock.calls[0][0];

    await act(async () => {
      await props.onDelete();
    });

    expect(mockHandlers.delete).toHaveBeenCalledWith('test-1');
    expect(mockHandlers.close).toHaveBeenCalledTimes(1);
  });

  it('should correctly handle cancel and toggle closeOnCancel state on successful save', async () => {
    // Mount with editing = true
    renderHook(() => usePopup(mockMap, mockAnnotation, mockHandlers, true));

    const mockCalls = (EditableItemDisplay as jest.Mock).mock.calls;
    let props = mockCalls[mockCalls.length - 1][0];

    // Simulate cancel while closeOnCancel is true
    act(() => {
      props.onCancel();
    });
    expect(mockHandlers.close).toHaveBeenCalledWith(true);

    // Simulate save, which sets closeOnCancel = false
    await act(async () => {
      await props.onSave(mockAnnotation);
    });
    expect(mockHandlers.save).toHaveBeenCalledWith(mockAnnotation);

    mockHandlers.close.mockClear();

    // Fetch latest render props after the state update
    props = mockCalls[mockCalls.length - 1][0];

    act(() => {
      props.onCancel();
    });
    // Because we just saved, closeOnCancel is false, so it shouldn't trigger closeHandler
    expect(mockHandlers.close).not.toHaveBeenCalled();
  });

  it('EDGE CASE: should pan the map by [0,0] when the ResizeObserver detects a size change', () => {
    renderHook(() => usePopup(mockMap, mockAnnotation, mockHandlers));

    expect(mockObserve).toHaveBeenCalled();

    // Simulate the observer triggering
    act(() => {
      resizeCallback([{ target: { id: 'test-1-popup-container' } }] as any, {} as any);
    });

    expect(mockMap.panBy).toHaveBeenCalledWith([0, 0]);
  });

  it('should clean up popup, root, and observer on unmount', () => {
    const { unmount } = renderHook(() => usePopup(mockMap, mockAnnotation, mockHandlers, true));

    unmount();

    expect(mockPopupInstance.remove).toHaveBeenCalledTimes(1);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});