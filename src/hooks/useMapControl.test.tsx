import { renderHook, act } from '@testing-library/react';
import useControl from './useMapControl';
import { createRoot } from 'react-dom/client';
import React from 'react';

// Mock react-dom/client
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(),
}));

describe('useControl', () => {
  let mockMap: any;
  let mockRender: jest.Mock;
  let mockUnmount: jest.Mock;
  const MockComponent = ({ text }: { text: string }) => <div>{text}</div>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMap = {
      addControl: jest.fn(),
      removeControl: jest.fn(),
    };
    mockRender = jest.fn();
    mockUnmount = jest.fn();
    (createRoot as jest.Mock).mockReturnValue({ render: mockRender, unmount: mockUnmount });
  });

  it('should initialize and add map control without rendering initially', () => {
    renderHook(() => useControl(mockMap, 'top-left', MockComponent, { text: 'hello' }));

    expect(mockMap.addControl).toHaveBeenCalledTimes(1);
    expect(createRoot).not.toHaveBeenCalled();
    expect(mockRender).not.toHaveBeenCalled();
  });

  it('should set container, initialize root, and render when onAdd is called by mapbox', () => {
    renderHook(() => useControl(mockMap, 'top-right', MockComponent, { text: 'hello' }));
    
    const control = mockMap.addControl.mock.calls[0][0];
    let container: HTMLDivElement;

    // Simulate Mapbox GL calling onAdd
    act(() => {
      container = control.onAdd();
    });

    expect(container!.className).toBe('mapboxgl-ctrl mapboxgl-ctrl-group');
    expect(createRoot).toHaveBeenCalledWith(container!);
    expect(mockRender).toHaveBeenCalledTimes(1);

    // Verify the correct component and props were rendered
    const renderedElement = mockRender.mock.calls[0][0];
    expect(renderedElement.type).toBe(MockComponent);
    expect(renderedElement.props.text).toBe('hello');
  });

  it('should reuse root and trigger a re-render when props change', () => {
    let currentProps = { text: 'initial' };
    const { rerender } = renderHook(() => useControl(mockMap, 'bottom-left', MockComponent, currentProps));

    const control = mockMap.addControl.mock.calls[0][0];
    
    act(() => {
      control.onAdd();
    });

    expect(createRoot).toHaveBeenCalledTimes(1);
    expect(mockRender).toHaveBeenCalledTimes(1);

    // Update props and rerender the hook
    currentProps = { text: 'updated' };
    rerender();

    expect(createRoot).toHaveBeenCalledTimes(1); // Should not call createRoot again
    expect(mockRender).toHaveBeenCalledTimes(2); // Should call render again

    const renderedElement = mockRender.mock.calls[1][0];
    expect(renderedElement.props.text).toBe('updated');
  });

  it('should gracefully skip initialization if the map is null or undefined', () => {
    const { rerender } = renderHook(
      ({ mapObj }) => useControl(mapObj, 'bottom-right', MockComponent, { text: 'test' }),
      { initialProps: { mapObj: null as any } }
    );

    expect(mockMap.addControl).not.toHaveBeenCalled();

    // Now supply the map
    rerender({ mapObj: mockMap });

    expect(mockMap.addControl).toHaveBeenCalledTimes(1);
  });

  it('EDGE CASE: should swallow errors during cleanup if the map is already destroyed', () => {
    const { unmount } = renderHook(() => useControl(mockMap, 'top-left', MockComponent, { text: 'test' }));

    // Force removeControl to throw
    mockMap.removeControl.mockImplementation(() => {
      throw new Error('Map already removed');
    });

    // Unmounting should not throw an error
    expect(() => unmount()).not.toThrow();
  });

  it('EDGE CASE: should clear the DOM container and nullify root on onRemove', () => {
    renderHook(() => useControl(mockMap, 'top-left', MockComponent, { text: 'test' }));
    
    const control = mockMap.addControl.mock.calls[0][0];
    
    let container: HTMLDivElement;
    act(() => {
      container = control.onAdd();
    });

    // Attach container to a mock parent to simulate real DOM attachment by mapbox
    const mockParent = document.createElement('div');
    mockParent.appendChild(container!);

    expect(container!.parentNode).toBe(mockParent);

    act(() => {
      control.onRemove();
    });

    // It should strip the element from the DOM
    expect(mockUnmount).toHaveBeenCalledTimes(1);
    expect(container!.parentNode).toBeNull();
  });
});