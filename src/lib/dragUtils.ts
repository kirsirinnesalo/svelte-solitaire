/**
 * Shared drag-and-drop utility functions for solitaire games
 */

/**
 * Standard drag over handler that allows dropping
 * Use with: ondragover={allowDrop}
 */
export function allowDrop(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
}
