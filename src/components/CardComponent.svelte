<script lang="ts">
  import type { Card } from '../types/game';
  import { isRed } from '../lib/cardUtils';
  import { cardBackType } from '../lib/cardBackStore';

  export let card: Card;
  export let draggable = false;

  const suitSymbols = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
  };
</script>

<div
  class="card"
  class:face-up={card.faceUp}
  class:red={isRed(card.suit)}
  class:draggable
  draggable={draggable}
>
  {#if card.faceUp}
    <div class="card-content">
      <div class="corner top-left">
        <div class="rank">{card.rank}</div>
      </div>
      <div class="corner top-right">
        <div class="suit-small">{suitSymbols[card.suit]}</div>
      </div>
      <div class="center">
        <div class="suit-large">{suitSymbols[card.suit]}</div>
      </div>
    </div>
  {:else}
    <div class="card-back" data-back-type={$cardBackType}>
      <div class="back-inner">
        {#if $cardBackType === 'four-suits'}
          <div class="suits-grid">
            <span class="suit-black">♠</span>
            <span class="suit-red">♥</span>
            <span class="suit-red">♦</span>
            <span class="suit-black">♣</span>
          </div>
        {:else}
          <div class="back-pattern"></div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .card {
    width: 70px;
    height: 100px;
    background: white;
    border: 2px solid #333;
    border-radius: 8px;
    position: relative;
    user-select: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .card.draggable {
    cursor: grab;
  }

  .card.draggable:active {
    cursor: grabbing;
  }

  .card-back {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 3px;
  }

  .back-inner {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
  }

  /* Classic Blue */
  .card-back[data-back-type="classic-blue"] {
    background: white;
  }

  .card-back[data-back-type="classic-blue"] .back-inner {
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%);
  }

  .card-back[data-back-type="classic-blue"] .back-pattern {
    background-image: 
      repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px),
      repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px);
  }

  .card-back[data-back-type="classic-blue"] .back-pattern::before {
    content: '♠';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: rgba(255, 255, 255, 0.3);
  }

  /* Red Grid */
  .card-back[data-back-type="red-grid"] {
    background: white;
  }

  .card-back[data-back-type="red-grid"] .back-inner {
    background: linear-gradient(135deg, #b71c1c 0%, #d32f2f 50%, #b71c1c 100%);
  }

  .card-back[data-back-type="red-grid"] .back-pattern {
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(255,255,255,0.15) 15px, rgba(255,255,255,0.15) 16px),
      repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(255,255,255,0.15) 15px, rgba(255,255,255,0.15) 16px);
  }

  .card-back[data-back-type="red-grid"] .back-pattern::before {
    content: '♦';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: rgba(255, 255, 255, 0.3);
  }

  /* Green Ornament */
  .card-back[data-back-type="green-ornament"] {
    background: white;
  }

  .card-back[data-back-type="green-ornament"] .back-inner {
    background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #1b5e20 100%);
  }

  .card-back[data-back-type="green-ornament"] .back-pattern {
    background-image:
      radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
      radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 2px, transparent 2px),
      radial-gradient(circle at 25% 75%, rgba(255,255,255,0.1) 2px, transparent 2px),
      radial-gradient(circle at 75% 25%, rgba(255,255,255,0.1) 2px, transparent 2px);
    background-size: 20px 20px;
  }

  .card-back[data-back-type="green-ornament"] .back-pattern::before {
    content: '♣';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: rgba(255, 255, 255, 0.3);
  }

  /* Four Suits */
  .card-back[data-back-type="four-suits"] {
    background: white;
  }

  .card-back[data-back-type="four-suits"] .back-inner {
    background: #d0d0d0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #333;
  }

  .suits-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 3px;
    font-size: 1.8rem;
    padding: 2px;
  }

  .suits-grid .suit-black {
    color: #000;
  }

  .suits-grid .suit-red {
    color: #d32f2f;
  }

  .back-pattern {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .card-content {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .corner {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
  }

  .top-left {
    top: 4px;
    left: 4px;
  }

  .top-right {
    top: 4px;
    right: 4px;
  }

  .rank {
    font-size: 0.9rem;
    font-weight: bold;
  }

  .suit-small {
    font-size: 0.8rem;
  }

  .center {
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .suit-large {
    font-size: 4rem;
  }

  .red {
    color: #d32f2f;
  }

  .card:not(.red) {
    color: #000;
  }
</style>
