<script lang="ts">
  interface Props {
    isWon: boolean;
    isLost: boolean;
    moves: number;
    elapsedTime: number;
  }

  let { isWon, isLost, moves, elapsedTime }: Props = $props();
</script>

{#if isWon || isLost}
  <div class="game-over-overlay">
    <div class="game-over-message">
      <div class="game-over-icon">{isWon ? '🎉' : '😔'}</div>
      <div class="game-over-title">{isWon ? 'Voitit pelin!' : 'Peli päättyi'}</div>
      <div class="game-stats">
        <div>⏱ {Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}</div>
        <div>⇆ {moves} siirtoa</div>
      </div>
    </div>
  </div>
{/if}

<style>
  .game-over-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    border-radius: 8px;
  }

  .game-over-message {
    text-align: center;
    color: white;
    font-size: 2rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8), -2px -2px 4px rgba(0, 0, 0, 0.8), 2px -2px 4px rgba(0, 0, 0, 0.8), -2px 2px 4px rgba(0, 0, 0, 0.8);
  }

  .game-over-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 1rem 0;
  }

  .game-stats {
    display: flex;
    gap: 2rem;
    justify-content: center;
    margin: 1.5rem 0;
    font-size: 1.2rem;
  }

  .game-over-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
</style>
