<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let undoDisabled = true;
  export let restartDisabled = true;
  export let hintDisabled = true;

  const dispatch = createEventDispatcher<{
    newGame: void;
    restart: void;
    undo: void;
    hint: void;
  }>();
</script>

<div class="game-header">
  <div class="action-buttons">
    <button on:click={() => dispatch('newGame')} class="new-game-btn">
      ▶ Uusi peli
    </button>
    <button 
      class="restart-btn" 
      disabled={restartDisabled} 
      title={restartDisabled ? "Tulossa pian" : "Aloita peli alusta samoilla korteilla"}
      on:click={() => dispatch('restart')}
    >
      ↻ Uudelleen
    </button>
    <button 
      on:click={() => dispatch('undo')} 
      class="undo-btn" 
      disabled={undoDisabled}
    >
      ↶ Kumoa
    </button>
    <button 
      class="hint-btn" 
      disabled={hintDisabled} 
      title={hintDisabled ? "Tulossa pian" : "Näytä mahdollinen siirto"}
      on:click={() => dispatch('hint')}
    >
      💡 Vihje
    </button>
  </div>
  <div class="game-settings">
    <slot name="settings" />
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
