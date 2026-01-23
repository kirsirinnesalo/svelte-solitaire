import { writable, derived, type Writable, type Readable } from 'svelte/store';

export interface GameStateManager<T> {
  state: Writable<T>;
  history: Writable<GameHistoryEntry<T>[]>;
  moves: Writable<number>;
  isWon: Writable<boolean>;
  isLost: Writable<boolean>;
  canUndo: Readable<boolean>;
  
  saveState: () => void;
  undo: () => void;
  reset: (initialState: T) => void;
  incrementMoves: () => void;
  setWon: () => void;
  setLost: () => void;
}

export interface GameHistoryEntry<T> {
  state: T;
  moves: number;
}

/**
 * Create a game state manager with undo functionality
 * @param initialState - Initial game state
 * @param cloneFn - Function to deep clone the state
 * @returns Game state manager with stores and functions
 */
export function createGameState<T>(
  initialState: T,
  cloneFn: (state: T) => T
): GameStateManager<T> {
  const state = writable<T>(cloneFn(initialState));
  const history = writable<GameHistoryEntry<T>[]>([]);
  const moves = writable<number>(0);
  const isWon = writable<boolean>(false);
  const isLost = writable<boolean>(false);
  
  const canUndo = derived(
    [history, isWon],
    ([$history, $isWon]) => $history.length > 0 && !$isWon
  );

  function saveState() {
    let currentState = cloneFn(initialState);
    state.subscribe(s => { currentState = cloneFn(s); })();
    
    let currentMoves = 0;
    moves.subscribe(m => { currentMoves = m; })();
    
    history.update(h => [
      ...h,
      { state: currentState, moves: currentMoves }
    ]);
  }

  function undo() {
    let canPerformUndo = false;
    let historyEntries: GameHistoryEntry<T>[] = [];
    
    canUndo.subscribe(can => { canPerformUndo = can; })();
    
    if (!canPerformUndo) return;
    
    history.subscribe(h => { historyEntries = h; })();
    
    if (historyEntries.length === 0) return;
    
    const previous = historyEntries[historyEntries.length - 1];
    state.set(cloneFn(previous.state));
    moves.set(previous.moves);
    history.update(h => h.slice(0, -1));
    isWon.set(false);
    isLost.set(false);
  }

  function reset(newInitialState: T) {
    state.set(cloneFn(newInitialState));
    history.set([]);
    moves.set(0);
    isWon.set(false);
    isLost.set(false);
  }

  function incrementMoves() {
    moves.update(m => m + 1);
  }

  function setWon() {
    isWon.set(true);
  }

  function setLost() {
    isLost.set(true);
  }

  return {
    state,
    history,
    moves,
    isWon,
    isLost,
    canUndo,
    saveState,
    undo,
    reset,
    incrementMoves,
    setWon,
    setLost
  };
}
