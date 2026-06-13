import { renderHook, act } from '@testing-library/react';
import React from 'react';
import useControl from './useMapControl';

describe('useControl', () => {
  let mockMap: any;
  const MockComponent = jest.fn(({ text }: { text: string }) => <div>{text}</div>);

  beforeEach(() => {
    jest.clearAllMocks();
    mockMap = {
      addControl: jest.fn(),
      removeControl: jest.fn(),
    };
  });

  it('should initialize and add map control without rendering initially', () => {
    renderHook(() => useControl(mockMap, 'top-left', MockComponent, { text: 'hello' }));

    expect(mockMap.addControl).toHaveBeenCalledTimes(1);
    expect(MockComponent).not.toHaveBeenCalled();
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
    expect(MockComponent).toHaveBeenCalledTimes(1);
    expect(MockComponent).toHaveBeenCalledWith(expect.objectContaining({ text: 'hello' }), expect.any(Object));
  });

  it('should reuse root and trigger a re-render when props change', () => {
    const currentProps = { text: 'initial' };
    const { rerender } = renderHook(
      ({ props }) => useControl(mockMap, 'bottom-left', MockComponent, props),
      { initialProps: { props: currentProps } },
    );

    const control = mockMap.addControl.mock.calls[0][0];

    act(() => {
      control.onAdd();
    });

    expect(MockComponent).toHaveBeenCalledTimes(1);

    // Update props and rerender the hook
    rerender({ props: { text: 'updated' } });

    expect(MockComponent).toHaveBeenCalledTimes(2);
    expect(MockComponent).toHaveBeenLastCalledWith(expect.objectContaining({ text: 'updated' }), expect.any(Object));
  });

  it('should gracefully skip initialization if the map is null or undefined', () => {
    const { rerender } = renderHook(
      ({ mapObj }) => useControl(mapObj, 'bottom-right', MockComponent, { text: 'test' }),
      { initialProps: { mapObj: null as any } },
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
    expect(container!.parentNode).toBeNull();
  });
});
