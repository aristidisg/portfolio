'use client';

import { useCallback, useState } from 'react';

interface ReorderState {
  draggingFrom: number | null;
  hoverIndex: number | null;
}

export function useReorder<T>(
  items: T[],
  onChange: (next: T[]) => void,
) {
  const [state, setState] = useState<ReorderState>({
    draggingFrom: null,
    hoverIndex: null,
  });

  const onDragStart = useCallback(
    (idx: number) => (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(idx));
      setState({ draggingFrom: idx, hoverIndex: idx });
    },
    [],
  );

  const onDragOver = useCallback(
    (idx: number) => (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setState((s) => (s.hoverIndex === idx ? s : { ...s, hoverIndex: idx }));
    },
    [],
  );

  const onDrop = useCallback(
    (idx: number) => (e: React.DragEvent) => {
      e.preventDefault();
      const from = Number(e.dataTransfer.getData('text/plain'));
      if (Number.isNaN(from) || from === idx) {
        setState({ draggingFrom: null, hoverIndex: null });
        return;
      }
      const copy = [...items];
      const [moved] = copy.splice(from, 1);
      copy.splice(idx, 0, moved);
      onChange(copy);
      setState({ draggingFrom: null, hoverIndex: null });
    },
    [items, onChange],
  );

  const onDragEnd = useCallback(() => {
    setState({ draggingFrom: null, hoverIndex: null });
  }, []);

  const getItemProps = useCallback(
    (idx: number) => ({
      draggable: true,
      onDragStart: onDragStart(idx),
      onDragOver: onDragOver(idx),
      onDrop: onDrop(idx),
      onDragEnd,
      'data-dragging': state.draggingFrom === idx ? 'true' : undefined,
      'data-drop-target':
        state.draggingFrom !== null &&
        state.hoverIndex === idx &&
        state.draggingFrom !== idx
          ? 'true'
          : undefined,
    }),
    [onDragStart, onDragOver, onDrop, onDragEnd, state],
  );

  return { getItemProps, isDragging: state.draggingFrom !== null };
}
