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
    onHelp,
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
    onHelp?: () => void;
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
    <button 
      onclick={onNewGame} 
      class="new-game-btn action-btn-icon-only"
      aria-label="Uusi peli"
      title="Uusi peli"
    >
      <span class="icon">▶</span>
      <span class="label">Uusi peli</span>
    </button>
    <button 
      class="restart-btn action-btn-icon-only" 
      disabled={restartDisabled} 
      aria-label={restartDisabled ? "Uudelleen (tulossa pian)" : "Uudelleen"}
      title={restartDisabled ? "Tulossa pian" : "Aloita peli alusta samoilla korteilla"}
      onclick={onRestart}
    >
      <span class="icon">↻</span>
      <span class="label">Uudelleen</span>
    </button>
    <button 
      onclick={onUndo} 
      class="undo-btn action-btn-icon-only" 
      disabled={undoDisabled}
      aria-label="Kumoa"
      title="Kumoa viimeisin siirto"
    >
      <span class="icon">↶</span>
      <span class="label">Kumoa</span>
    </button>
    <button 
      class="hint-btn action-btn-icon-only" 
      disabled={hintDisabled} 
      aria-label={hintDisabled ? "Vihje (tulossa pian)" : "Vihje"}
      title={hintDisabled ? "Tulossa pian" : "Näytä mahdollinen siirto"}
      onclick={onHint}
    >
      <span class="icon">💡</span>
      <span class="label">Vihje</span>
    </button>
    {#if onHelp}
    <button 
      class="help-btn action-btn-icon-only" 
      onclick={onHelp}
      aria-label="Ohjeet"
      title="Näytä pelin ohjeet (paina ? tai F1)"
    >
      <span class="icon">❓</span>
      <span class="label">Ohjeet</span>
    </button>
    {/if}
    <div class="timer">
      ⏱ {formatTime(elapsedTime)}
    </div>
    {#if onPause}
    <button 
      class="pause-btn" 
      class:disabled={!gameStarted || gameEnded}
      disabled={!gameStarted || gameEnded}
      onclick={onPause}
      aria-label={isPaused ? "Jatka" : "Tauko"}
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

  .new-game-btn, .restart-btn, .undo-btn, .hint-btn, .help-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    background: #4CAF50;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
  }

  /* Icon-only button behavior */
  .action-btn-icon-only {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.5rem;
    transition: all 0.2s ease;
  }

  .action-btn-icon-only .label {
    max-width: 0;
    overflow: hidden;
    opacity: 0;
    white-space: nowrap;
    transition: max-width 0.2s ease, opacity 0.2s ease, margin 0.2s ease;
  }

  .action-btn-icon-only:hover .label,
  .action-btn-icon-only:focus .label,
  .action-btn-icon-only:focus-visible .label {
    max-width: 200px;
    opacity: 1;
    margin-left: 0.2rem;
  }

  .action-btn-icon-only:hover,
  .action-btn-icon-only:focus,
  .action-btn-icon-only:focus-visible {
    padding: 0.5rem 1rem;
  }

  /* Touch devices: show label on active state */
  @media (hover: none) and (pointer: coarse) {
    .action-btn-icon-only:active .label {
      max-width: 200px;
      opacity: 1;
      margin-left: 0.2rem;
    }
    
    .action-btn-icon-only:active {
      padding: 0.5rem 1rem;
    }
  }

  .new-game-btn:hover, 
  .restart-btn:hover:not(:disabled), 
  .undo-btn:hover:not(:disabled),
  .hint-btn:hover:not(:disabled),
  .help-btn:hover {
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
