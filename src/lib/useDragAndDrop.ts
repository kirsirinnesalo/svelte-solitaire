import { writable, type Writable } from 'svelte/store';

export interface DragState {
  isDragging: boolean;
  draggedFrom: any;
}

export interface DragHandlers {
  dragState: Writable<DragState>;
  
  handleDragStart: (event: DragEvent, from: any) => void;
  handleDragOver: (event: DragEvent) => void;
  handleDragEnd: () => void;
  handleDrop: (event: DragEvent, onDropCallback: (from: any) => void) => void;
}

/**
 * Create drag and drop handlers for card movement
 * @returns Drag handlers and state
 */
export function createDragHandlers(): DragHandlers {
  const dragState = writable<DragState>({
    isDragging: false,
    draggedFrom: null
  });

  function handleDragStart(event: DragEvent, from: any) {
    dragState.set({
      isDragging: true,
      draggedFrom: from
    });
    
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', ''); // Required for Firefox
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  function handleDragEnd() {
    dragState.set({
      isDragging: false,
      draggedFrom: null
    });
  }

  function handleDrop(event: DragEvent, onDropCallback: (from: any) => void) {
    event.preventDefault();
    
    let currentDragState: DragState = { isDragging: false, draggedFrom: null };
    const unsubscribe = dragState.subscribe(state => {
      currentDragState = state;
    });
    unsubscribe();
    
    if (currentDragState.draggedFrom !== null) {
      onDropCallback(currentDragState.draggedFrom);
    }
    
    handleDragEnd();
  }

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop
  };
}
