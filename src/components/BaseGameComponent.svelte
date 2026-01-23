<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import '../styles/shared.css';

  export let gameTitle: string;
  export let showUndo: boolean = true;
  export let canUndo: boolean = false;
  export let onBack: (() => void) | undefined = undefined;
  export let onNewGame: (() => void) | undefined = undefined;
  export let onUndo: (() => void) | undefined = undefined;
  export let isWon: boolean = false;
  export let isLost: boolean = false;

  const dispatch = createEventDispatcher();

  function handleBack() {
    if (onBack) {
      onBack();
    } else {
      dispatch('back');
    }
  }

  function handleNewGame() {
    if (onNewGame) {
      onNewGame();
    } else {
      dispatch('newGame');
    }
  }

  function handleUndo() {
    if (onUndo) {
      onUndo();
    } else {
      dispatch('undo');
    }
  }

  // Show win/loss alerts
  $: if (isWon) {
    setTimeout(() => alert('Voitit pelin! 🎉'), 100);
  }

  $: if (isLost) {
    setTimeout(() => alert('Peli päättyi. Ei enää siirtoja. 😔'), 100);
  }
</script>

<div class="game-container">
  <h1 class="game-title">{gameTitle}</h1>
  
  <div class="game-header">
    <button on:click={handleBack} class="back-btn">← Takaisin</button>
    
    <slot name="header-center" />
    
    <div class="header-right">
      {#if showUndo}
        <button 
          on:click={handleUndo} 
          class="undo-btn"
          disabled={!canUndo}
        >
          ↶ Kumoa
        </button>
      {/if}
      <button on:click={handleNewGame} class="new-game-btn">Uusi peli</button>
    </div>
  </div>

  <div class="game-area">
    <slot />
  </div>
</div>

<style>
  .game-container {
    padding: 1rem;
  }

  .header-right {
    display: flex;
    gap: 0.5rem;
  }
</style>
