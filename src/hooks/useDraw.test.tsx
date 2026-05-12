import { renderHook, act } from '@testing-library/react';
import useDraw from './useDraw';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

// Mock the MapboxDraw dependency
jest.mock('@mapbox/mapbox-gl-draw', () => {
  return jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn().mockReturnValue({ features: [] }),
    changeMode: jest.fn(),
  }));
});

// Mock internal utilities and constants used by the hook
jest.mock('@/lib/drawStyles', () => ([]));
jest.mock('@/lib/mapboxDrawModes', () => ({
  __esModule: true,
  default: {},
  assertMode: jest.fn(),
}));
jest.mock('@/lib/util', () => ({
  throwErr: jest.fn(() => { throw new Error('mock error'); }),
}));

describe('useDraw', () => {
  let mockMap: any;
  let mockOnSelect: jest.Mock;
  let mockOnCreate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Create a mock Mapbox GL map instance
    mockMap = {
      addControl: jest.fn(),
      removeControl: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    };
    mockOnSelect = jest.fn();
    mockOnCreate = jest.fn();
  });

  it('should initialize MapboxDraw and add to map', () => {
    const { result } = renderHook(() => useDraw(mockMap, [], mockOnSelect, mockOnCreate));
    
    expect(MapboxDraw).toHaveBeenCalledTimes(1);
    expect(mockMap.addControl).toHaveBeenCalledTimes(1);
    
    const drawInstance = (MapboxDraw as unknown as jest.Mock).mock.results[0].value;
    expect(mockMap.addControl).toHaveBeenCalledWith(drawInstance);
    
    expect(result.current[0]).toBe('simple_select');
  });

  it('should bind event listeners on the map', () => {
    renderHook(() => useDraw(mockMap, [], mockOnSelect, mockOnCreate));

    expect(mockMap.on).toHaveBeenCalledWith('draw.modechange', expect.any(Function));
    expect(mockMap.on).toHaveBeenCalledWith('draw.selectionchange', expect.any(Function));
    expect(mockMap.on).toHaveBeenCalledWith('draw.create', expect.any(Function));
  });

  it('should trigger onSelect when selection changes', () => {
    renderHook(() => useDraw(mockMap, [], mockOnSelect, mockOnCreate));

    // Extract the mock handler bound to map events and simulate the selection change
    const selectionChangeHandler = mockMap.on.mock.calls.find((call: any[]) => call[0] === 'draw.selectionchange')[1];
    
    const mockFeature = { id: 'test-id' };
    selectionChangeHandler({ features: [mockFeature] });
    
    expect(mockOnSelect).toHaveBeenCalledWith(mockFeature);
  });

  it('should trigger onCreate when feature is created', () => {
    renderHook(() => useDraw(mockMap, [], mockOnSelect, mockOnCreate));

    // Extract the mock handler bound to map events and simulate the create event
    const createHandler = mockMap.on.mock.calls.find((call: any[]) => call[0] === 'draw.create')[1];
    
    const mockFeature = { id: 'test-id' };
    createHandler({ features: [mockFeature] });
    
    expect(mockOnCreate).toHaveBeenCalledWith(mockFeature);
  });

  it('should allow mode changes via returned setter', () => {
    const { result } = renderHook(() => useDraw(mockMap, [], mockOnSelect, mockOnCreate));
    const drawInstance = (MapboxDraw as unknown as jest.Mock).mock.results[0].value;
    
    act(() => {
      result.current[1]('draw_polygon' as any);
    });

    expect(drawInstance.changeMode).toHaveBeenCalledWith('draw_polygon');
    expect(result.current[0]).toBe('draw_polygon');
  });

  it('should sync features with MapboxDraw instance and remove deleted ones', () => {
    const initialFeatures = [{ id: '1', type: 'Feature' }, { id: '2', type: 'Feature' }];
    const nextFeatures = [{ id: '1', type: 'Feature' }];
    
    const { rerender } = renderHook(
      ({ features }) => useDraw(mockMap, features as any, mockOnSelect, mockOnCreate),
      { initialProps: { features: initialFeatures } }
    );
    
    const drawInstance = (MapboxDraw as unknown as jest.Mock).mock.results[0].value;
    
    // Simulate that the MapboxDraw instance currently has both features before the render
    drawInstance.getAll.mockReturnValue({ features: initialFeatures });
    
    // Rerender the hook with one feature removed
    rerender({ features: nextFeatures });
    
    expect(drawInstance.add).toHaveBeenCalledWith({ type: 'FeatureCollection', features: nextFeatures });
    expect(drawInstance.delete).toHaveBeenCalledWith(['2']);
  });

  it('should clean up map controls and events on unmount', () => {
    const { unmount } = renderHook(() => useDraw(mockMap, [], mockOnSelect, mockOnCreate));
    const drawInstance = (MapboxDraw as unknown as jest.Mock).mock.results[0].value;

    unmount();
    
    expect(mockMap.removeControl).toHaveBeenCalledWith(drawInstance);
    expect(mockMap.off).toHaveBeenCalledWith('draw.modechange', expect.any(Function));
    expect(mockMap.off).toHaveBeenCalledWith('draw.selectionchange', expect.any(Function));
    expect(mockMap.off).toHaveBeenCalledWith('draw.create', expect.any(Function));
  });

  it('should delay initialization until the map is provided', () => {
    const { rerender } = renderHook(
      ({ mapObj }) => useDraw(mapObj, [], mockOnSelect, mockOnCreate),
      { initialProps: { mapObj: null as any } }
    );

    // MapboxDraw shouldn't initialize while the map is null
    expect(MapboxDraw).not.toHaveBeenCalled();

    // Provide the valid map object
    rerender({ mapObj: mockMap });

    expect(MapboxDraw).toHaveBeenCalledTimes(1);
    expect(mockMap.addControl).toHaveBeenCalledTimes(1);
  });

  it('should swallow errors during cleanup if the map is already destroyed', () => {
    const { unmount } = renderHook(() => useDraw(mockMap, [], mockOnSelect, mockOnCreate));

    // Simulate the map throwing an error because it was already removed/destroyed
    mockMap.removeControl.mockImplementation(() => {
      throw new Error('Map already removed');
    });

    expect(() => unmount()).not.toThrow();
  });

  it('should safely handle mode changes even if draw instance is not yet ready', () => {
    const { result } = renderHook(() => useDraw(null, [], mockOnSelect, mockOnCreate));

    act(() => {
      // Try to change the mode while the map/draw object is still null
      result.current[1]('draw_polygon' as any);
    });

    // State should update, but no crashes should occur on the null `draw.current` ref
    expect(result.current[0]).toBe('draw_polygon');
  });
});