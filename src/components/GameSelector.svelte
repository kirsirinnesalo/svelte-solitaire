<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { GameType } from '../types/game';

  const dispatch = createEventDispatcher<{ selectGame: GameType }>();

  const games = [
    {
      id: 'klondike' as GameType,
      name: 'Klondike',
      description: 'Klassinen pasianssi: rakenna pinot ässästä kuninkaaseen'
    },
    {
      id: 'napoleon' as GameType,
      name: 'Napoleonin hauta',
      description: 'Rakenna kulmapakat 7→K ja keskuspakka 6→A'
    },
    {
      id: 'acesup' as GameType,
      name: 'Aces Up',
      description: 'Poista kaikki kortit paitsi ässät'
    },
    {
      id: 'clock' as GameType,
      name: 'Kellopasianssi',
      description: 'Käännä kortit kellotauluun: Q→klo 12, A→klo 1, kuningas→keskelle'
    }
  ];

  function selectGame(gameId: GameType) {
    dispatch('selectGame', gameId);
  }
</script>

<div class="game-selector">
  <h2>Valitse peli</h2>
  <div class="games-grid">
    {#each games as game}
      <button
        class="game-card"
        class:disabled={game.disabled}
        on:click={() => selectGame(game.id)}
        disabled={game.disabled}
      >
        <h3>{game.name}</h3>
        <p class="description">{game.description}</p>
        {#if game.disabled}
          <span class="coming-soon">Tulossa pian</span>
        {/if}
      </button>
    {/each}
  </div>
</div>

<style>
  .game-selector {
    padding: 2rem;
  }

  h2 {
    font-size: 1.8rem;
    margin-bottom: 2rem;
    color: #2c3e50;
  }

  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .game-card {
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
  }

  .game-card:hover:not(.disabled) {
    border-color: #4CAF50;
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .game-card.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  h3 {
    font-size: 1.4rem;
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
  }

  .description {
    color: #666;
    font-size: 0.95rem;
    margin: 0.5rem 0;
    line-height: 1.4;
  }

  .coming-soon {
    display: block;
    color: #ff9800;
    font-style: italic;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
</style>
