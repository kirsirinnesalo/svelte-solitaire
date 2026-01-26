<script lang="ts">
  import type { Snippet } from 'svelte';

  let { 
    undoDisabled = true, 
    restartDisabled = true, 
    hintDisabled = true,
    elapsedTime = 0,
    isPaused = false,
    gameStarted = false,
    gameEnded = false,
    onNewGame,
    onRestart,
    onUndo,
    onHint,
    onPause,
    settings
  }: { 
    undoDisabled?: boolean; 
    restartDisabled?: boolean; 
    hintDisabled?: boolean;
    elapsedTime?: number;
    isPaused?: boolean;
    gameStarted?: boolean;
    gameEnded?: boolean;
    onNewGame: () => void;
    onRestart?: () => void;
    onUndo?: () => void;
    onHint?: () => void;
    onPause?: () => void;
    settings?: Snippet;
  } = $props();
  
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
</script>

<div class="game-header">
  <div class="action-buttons">
    <button onclick={onNewGame} class="new-game-btn">
      ▶ Uusi peli
    </button>
    <button 
      class="restart-btn" 
      disabled={restartDisabled} 
      title={restartDisabled ? "Tulossa pian" : "Aloita peli alusta samoilla korteilla"}
      onclick={onRestart}
    >
      ↻ Uudelleen
    </button>
    <button 
      onclick={onUndo} 
      class="undo-btn" 
      disabled={undoDisabled}
    >
      ↶ Kumoa
    </button>
    <button 
      class="hint-btn" 
      disabled={hintDisabled} 
      title={hintDisabled ? "Tulossa pian" : "Näytä mahdollinen siirto"}
      onclick={onHint}
    >
      💡 Vihje
    </button>
    <div class="timer">
      ⏱ {formatTime(elapsedTime)}
    </div>
    {#if onPause}
    <button 
      class="pause-btn" 
      class:disabled={!gameStarted || gameEnded}
      disabled={!gameStarted || gameEnded}
      onclick={onPause}
      title={isPaused ? "Jatka peliä" : "Tauko"}
    >
      {isPaused ? '▶' : '⏸'}
    </button>
    {/if}
  </div>
  <div class="game-settings">
    {#if settings}
      {@render settings()}
    {/if}
  </div>
</div>

<style>
  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .timer {
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 4px;
    font-variant-numeric: tabular-nums;
  }
  
  .pause-btn {
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    font-weight: bold;
    background: #fff;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .pause-btn:hover:not(:disabled) {
    background: #f0f0f0;
  }
  
  .pause-btn.disabled,
  .pause-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .game-settings {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .new-game-btn, .restart-btn, .undo-btn, .hint-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    background: #4CAF50;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
  }

  .new-game-btn:hover, 
  .restart-btn:hover:not(:disabled), 
  .undo-btn:hover:not(:disabled),
  .hint-btn:hover:not(:disabled) {
    background: #45a049;
  }

  .restart-btn:disabled, 
  .undo-btn:disabled,
  .hint-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
  }
</style>
