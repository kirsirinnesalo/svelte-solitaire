<script lang="ts">
  import GameSelector from './components/GameSelector.svelte';
  import Klondike from './games/klondike/Klondike.svelte';
  import Napoleon from './games/napoleon/Napoleon.svelte';
  import AcesUp from './games/acesup/AcesUp.svelte';
  import type { GameType } from './types/game';
  import { cardBackType, type CardBackType } from './lib/cardBackStore';

  let selectedGame: GameType | null = null;

  function handleGameSelect(event: CustomEvent<GameType>) {
    selectedGame = event.detail;
  }

  function handleBackToMenu() {
    selectedGame = null;
  }
</script>

<main>
  <div class="header">
    <h1>🃏 Pasianssit</h1>
    <div class="card-back-selector">
      <label for="cardBack">Kortin tausta:</label>
      <select id="cardBack" bind:value={$cardBackType}>
        <option value="classic-blue">Klassinen sininen</option>
        <option value="red-grid">Punainen ruudukko</option>
        <option value="green-ornament">Vihreä ornamentti</option>
        <option value="four-suits">Neljä maata</option>
      </select>
    </div>
  </div>
  
  {#if selectedGame === null}
    <GameSelector on:selectGame={handleGameSelect} />
  {:else if selectedGame === 'klondike'}
    <Klondike on:back={handleBackToMenu} />
  {:else if selectedGame === 'napoleon'}
    <Napoleon on:back={handleBackToMenu} />
  {:else if selectedGame === 'acesup'}
    <AcesUp on:back={handleBackToMenu} />
  {/if}
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.5rem 2rem 2rem;
    text-align: center;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  h1 {
    color: #2c3e50;
    font-size: 2.5rem;
    margin: 0;
  }

  .card-back-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .card-back-selector label {
    font-size: 0.95rem;
    color: #2c3e50;
    font-weight: 500;
  }

  .card-back-selector select {
    padding: 0.4rem 0.8rem;
    font-size: 0.95rem;
    border: 2px solid #4CAF50;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    color: #2c3e50;
  }

  .card-back-selector select:hover {
    background: #f0f0f0;
  }
</style>
