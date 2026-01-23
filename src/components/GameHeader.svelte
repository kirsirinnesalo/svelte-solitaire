<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  let { 
    undoDisabled = true, 
    restartDisabled = true, 
    hintDisabled = true,
    settings
  }: { 
    undoDisabled?: boolean; 
    restartDisabled?: boolean; 
    hintDisabled?: boolean;
    settings?: Snippet;
  } = $props();

  const dispatch = createEventDispatcher<{
    newGame: void;
    restart: void;
    undo: void;
    hint: void;
  }>();
</script>

<div class="game-header">
  <div class="action-buttons">
    <button onclick={() => dispatch('newGame')} class="new-game-btn">
      ▶ Uusi peli
    </button>
    <button 
      class="restart-btn" 
      disabled={restartDisabled} 
      title={restartDisabled ? "Tulossa pian" : "Aloita peli alusta samoilla korteilla"}
      onclick={() => dispatch('restart')}
    >
      ↻ Uudelleen
    </button>
    <button 
      onclick={() => dispatch('undo')} 
      class="undo-btn" 
      disabled={undoDisabled}
    >
      ↶ Kumoa
    </button>
    <button 
      class="hint-btn" 
      disabled={hintDisabled} 
      title={hintDisabled ? "Tulossa pian" : "Näytä mahdollinen siirto"}
      onclick={() => dispatch('hint')}
    >
      💡 Vihje
    </button>
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
