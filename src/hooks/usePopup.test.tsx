import { renderHook, act } from '@testing-library/react';
import usePopup from './usePopup';
import { createRoot } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';

// Mock dependencies
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(),
}));

jest.mock('@turf/center', () => jest.fn((feature) => ({ geometry: { coordinates: [10, 20] } })));

jest.mock('@/lib/util', () => ({
  toLngLat: jest.fn((coords) => coords),
  throwErr: jest.fn((msg) => { throw new Error(msg); }),
}));

describe('usePopup', () => {
  let mockMap: any;
  let mockAnnotation: any;
  let mockHandlers: any;
  let mockPopupInstance: any;
  let mockRender: jest.Mock;
  let mockUnmount: jest.Mock;
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

    jest.spyOn(mapboxgl, 'Popup').mockImplementation(() => mockPopupInstance);

    mockRender = jest.fn();
    mockUnmount = jest.fn();
    (createRoot as jest.Mock).mockReturnValue({ render: mockRender, unmount: mockUnmount });

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

    expect(mapboxgl.Popup).not.toHaveBeenCalled();

    rerender({ mapObj: mockMap, ann: { ...mockAnnotation, id: undefined } });
    expect(mapboxgl.Popup).not.toHaveBeenCalled();
  });

  it('should initialize Popup, create React root, and render EditableItemDisplay', () => {
    renderHook(() => usePopup(mockMap, mockAnnotation, mockHandlers, true));

    expect(mapboxgl.Popup).toHaveBeenCalledTimes(1);
    expect(mockPopupInstance.addTo).toHaveBeenCalledWith(mockMap);
    expect(mockPopupInstance.setHTML).toHaveBeenCalledWith('<div id="test-1-popup-container"/>');
    expect(createRoot).toHaveBeenCalledTimes(1);

    // Extract the element that was rendered into the root
    expect(mockRender).toHaveBeenCalledTimes(1);
    const renderedTree = mockRender.mock.calls[0][0];
    const editableDisplayElement = renderedTree.props.children;

    expect(editableDisplayElement.props.item).toEqual(mockAnnotation);
    expect(editableDisplayElement.props.editing).toBe(true);
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
    expect(mockUnmount).toHaveBeenCalledTimes(1);
  });

  it('should properly proxy handleDelete and trigger close', async () => {
    renderHook(() => usePopup(mockMap, mockAnnotation, mockHandlers));

    const renderedTree = mockRender.mock.calls[0][0];
    const editableDisplayProps = renderedTree.props.children.props;

    await act(async () => {
      await editableDisplayProps.onDelete();
    });

    expect(mockHandlers.delete).toHaveBeenCalledWith('test-1');
    expect(mockHandlers.close).toHaveBeenCalledTimes(1);
  });

  it('should correctly handle cancel and toggle closeOnCancel state on successful save', async () => {
    // Mount with editing = true
    renderHook(() => usePopup(mockMap, mockAnnotation, mockHandlers, true));

    let renderedTree = mockRender.mock.calls[mockRender.mock.calls.length - 1][0];
    let editableDisplayProps = renderedTree.props.children.props;

    // Simulate cancel while closeOnCancel is true
    act(() => {
      editableDisplayProps.onCancel();
    });
    expect(mockHandlers.close).toHaveBeenCalledWith(true);

    // Simulate save, which sets closeOnCancel = false
    await act(async () => {
      await editableDisplayProps.onSave(mockAnnotation);
    });
    expect(mockHandlers.save).toHaveBeenCalledWith(mockAnnotation);

    mockHandlers.close.mockClear();

    // Fetch latest render props after the state update
    renderedTree = mockRender.mock.calls[mockRender.mock.calls.length - 1][0];
    editableDisplayProps = renderedTree.props.children.props;

    act(() => {
      editableDisplayProps.onCancel();
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
    expect(mockUnmount).toHaveBeenCalledTimes(1);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});