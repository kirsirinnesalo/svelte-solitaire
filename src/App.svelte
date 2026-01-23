<script lang="ts">
  import GameSelector from './components/GameSelector.svelte';
  import Klondike from './games/klondike/Klondike.svelte';
  import Napoleon from './games/napoleon/Napoleon.svelte';
  import AcesUp from './games/acesup/AcesUp.svelte';
  import Clock from './games/clock/Clock.svelte';
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
    <h1>
      <svg class="logo" width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <!-- Vasen kortti (10) - käännetty vasemmalle -->
        <g transform="translate(10,15) rotate(-15)">
          <rect width="35" height="50" rx="3" fill="white" stroke="#333" stroke-width="1.5"/>
          <text x="17.5" y="30" font-size="16" font-weight="bold" fill="#d32f2f" text-anchor="middle">10</text>
          <text x="17.5" y="40" font-size="12" fill="#d32f2f" text-anchor="middle">♥</text>
        </g>
        <!-- Keskimmäinen kortti (Ässä) - suorassa -->
        <g transform="translate(42.5,10)">
          <rect width="35" height="50" rx="3" fill="white" stroke="#333" stroke-width="1.5"/>
          <text x="17.5" y="30" font-size="20" font-weight="bold" fill="#000" text-anchor="middle">A</text>
          <text x="17.5" y="42" font-size="14" fill="#000" text-anchor="middle">♠</text>
        </g>
        <!-- Oikea kortti (Jokeri) - käännetty oikealle -->
        <g transform="translate(75,15) rotate(15)">
          <rect width="35" height="50" rx="3" fill="white" stroke="#333" stroke-width="1.5"/>
          <text x="17.5" y="34" font-size="28" text-anchor="middle">🃏</text>
          <text x="17.5" y="45" font-size="7" fill="#9c27b0" font-weight="600" text-anchor="middle">JOKER</text>
        </g>
      </svg>
      <span class="title-text">Pasianssit</span>
    </h1>
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
  
  {#if selectedGame !== null}
    <div class="game-nav">
      <button on:click={handleBackToMenu} class="back-btn">← Takaisin</button>
      <h2 class="game-title">
        {#if selectedGame === 'klondike'}
          Klondike
        {:else if selectedGame === 'napoleon'}
          Napoleon's Tomb
        {:else if selectedGame === 'acesup'}
          Aces Up
        {:else if selectedGame === 'clock'}
          Kello
        {/if}
      </h2>
    </div>
  {/if}
  
  {#if selectedGame === null}
    <GameSelector on:selectGame={handleGameSelect} />
  {:else if selectedGame === 'klondike'}
    <Klondike on:back={handleBackToMenu} />
  {:else if selectedGame === 'napoleon'}
    <Napoleon on:back={handleBackToMenu} />
  {:else if selectedGame === 'acesup'}
    <AcesUp on:back={handleBackToMenu} />
  {:else if selectedGame === 'clock'}
    <Clock on:back={handleBackToMenu} />
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
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo {
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
  }

  .title-text {
    font-size: 2.5rem;
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

  .game-nav {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .game-nav .back-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    background: #4CAF50;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
  }

  .game-nav .back-btn:hover {
    background: #45a049;
  }

  .game-nav .game-title {
    font-size: 2rem;
    color: #2c3e50;
    margin: 0;
    text-align: center;
    width: 100%;
  }
</style>
