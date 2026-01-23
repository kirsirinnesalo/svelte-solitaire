<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { createDeck, shuffleDeck } from '../../lib/cardUtils';
  import type { Card } from '../../types/game';
  import CardComponent from '../../components/CardComponent.svelte';
  import { 
    dealCards, 
    removeCard, 
    moveCard, 
    canRemoveCard,
    isGameWon, 
    isGameLost,
    type AcesUpState 
  } from './acesUpRules';
  import '../../styles/shared.css';

  const dispatch = createEventDispatcher();

  let state: AcesUpState = {
    piles: [[], [], [], []],
    stock: [],
    discarded: []
  };
  let moves = 0;
  let isWon = false;
  let isLost = false;
  let draggedPile: number | null = null;
  let showHighlight = false;
  let history: AcesUpState[] = [];

  function initGame() {
    const deck = shuffleDeck(createDeck());
    
    // All cards go to stock initially
    state = {
      piles: [[], [], [], []],
      stock: deck.map(card => ({ ...card, faceUp: false })),
      discarded: []
    };
    
    moves = 0;
    isWon = false;
    isLost = false;
    draggedPile = null;
    history = [];
  }

  function saveState() {
    // Deep clone current state
    history = [...history, {
      piles: state.piles.map(pile => pile.map(card => ({ ...card }))),
      stock: state.stock.map(card => ({ ...card })),
      discarded: state.discarded.map(card => ({ ...card }))
    }];
  }

  function handleDeal() {
    const result = dealCards(state);
    if (result.valid && result.newState) {
      saveState();
      state = result.newState;
      moves++;
      checkGameStatus();
    }
  }

  function handleRemoveCard(pileIndex: number) {
    const result = removeCard(state, pileIndex);
    if (result.valid && result.newState) {
      saveState();
      state = result.newState;
      moves++;
      checkGameStatus();
    }
  }

  function handlePileClick(pileIndex: number) {
    const pile = state.piles[pileIndex];
    
    if (pile.length === 0) {
      // Empty pile - do nothing on click
      return;
    }
    
    // Non-empty pile - try to remove or move to empty pile
    const topCard = pile[pile.length - 1];
    
    // First priority: remove if possible
    if (canRemoveCard(topCard, state.piles)) {
      handleRemoveCard(pileIndex);
      return;
    }
    
    // Second priority: move to empty pile if one exists
    const emptyPileIndex = state.piles.findIndex((p, i) => p.length === 0 && i !== pileIndex);
    if (emptyPileIndex !== -1) {
      const result = moveCard(state, pileIndex, emptyPileIndex);
      if (result.valid && result.newState) {
        saveState();
        state = result.newState;
        moves++;
        checkGameStatus();
      }
    }
  }

  function handleDragStart(event: DragEvent, pileIndex: number) {
    if (state.piles[pileIndex].length === 0) return;
    draggedPile = pileIndex;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', '');
    }
  }

  function handleDrop(event: DragEvent, pileIndex: number) {
    event.preventDefault();
    if (draggedPile === null) return;

    const result = moveCard(state, draggedPile, pileIndex);
    if (result.valid && result.newState) {
      saveState();
      state = result.newState;
      moves++;
      checkGameStatus();
    }

    draggedPile = null;
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  function undo() {
    if (history.length === 0) return;
    
    state = history[history.length - 1];
    history = history.slice(0, -1);
    moves = Math.max(0, moves - 1);
    isWon = false;
    isLost = false;
  }

  function checkGameStatus() {
    isWon = isGameWon(state);
    isLost = !isWon && isGameLost(state);
    
    if (isWon) {
      setTimeout(() => alert('Voitit pelin! 🎉 Vain 4 ässää jäljellä!'), 100);
    } else if (isLost) {
      setTimeout(() => alert('Peli hävitty. Ei enää siirtoja. 😔'), 100);
    }
  }

  initGame();
</script>

<div class="acesup">
  <div class="game-header">
    <button on:click={undo} disabled={history.length === 0 || isWon || isLost} class="undo-btn">↺ Kumoa</button>
    <div class="header-right">
      <label class="highlight-toggle">
        <input type="checkbox" bind:checked={showHighlight} />
        Korostus
      </label>
      <button on:click={initGame} class="new-game-btn">Uusi peli</button>
    </div>
  </div>

  <div class="game-area">
    <!-- Stock -->
    <div class="stock-section">
      <button
        class="stock-pile pile"
        on:click={handleDeal}
        disabled={state.stock.length < 4}
      >
        {#if state.stock.length >= 4}
          <CardComponent card={state.stock[state.stock.length - 1]} />
          <div class="stock-count">{state.stock.length}</div>
        {:else}
          <div class="empty-pile stock-empty">✕</div>
        {/if}
      </button>
    </div>

    <!-- Piles -->
    <div class="piles-section">
      {#each state.piles as pile, i}
        <div class="pile-container">
          <div
            role="button"
            tabindex="0"
            class="play-pile pile"
            on:click={() => handlePileClick(i)}
            on:keydown={(e) => e.key === 'Enter' && handlePileClick(i)}
            on:drop={(e) => handleDrop(e, i)}
            on:dragover={handleDragOver}
          >
            {#if pile.length > 0}
              {#each pile as card, cardIndex}
                {@const isLast = cardIndex === pile.length - 1}
                {@const canRemove = isLast && canRemoveCard(card, state.piles)}
                <div
                  role="button"
                  tabindex="0"
                  draggable={isLast}
                  on:dragstart={(e) => isLast && handleDragStart(e, i)}
                  class="card-in-pile"
                  class:draggable-wrapper={isLast}
                  class:can-remove={showHighlight && canRemove}
                  style="top: {cardIndex * 20}px;"
                >
                  <CardComponent card={card} />
                </div>
              {/each}
            {:else}
              <div class="empty-pile"></div>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <!-- Discard pile (visual only) -->
    <div class="discard-section">
      <div class="discard-pile pile">
        {#if state.discarded.length > 0}
          {#if state.discarded.length > 2}
            <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
          {/if}
          {#if state.discarded.length > 1}
            <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
          {/if}
          <div style="position: relative; z-index: 2;">
            <CardComponent card={{...state.discarded[state.discarded.length - 1], faceUp: false}} />
          </div>
        {:else}
          <div class="empty-pile discard-icon">🗑️</div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .acesup {
    padding: 1rem;
  }

  /* AcesUp-specific overrides */
  .game-header {
    margin-bottom: 1rem;
    gap: 1rem;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .highlight-toggle {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.9rem;
    color: #2c3e50;
    cursor: pointer;
  }

  .highlight-toggle input[type="checkbox"] {
    cursor: pointer;
    width: 16px;
    height: 16px;
  }

  .game-area {
    min-height: 400px;
    display: flex;
    gap: 5rem;
    align-items: flex-start;
    justify-content: center;
  }

  .stock-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .discard-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .stock-pile {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    position: relative;
  }

  .stock-pile:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .stock-count {
    position: absolute;
    top: -10px;
    right: -10px;
    background: #ff5722;
    color: white;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.85rem;
    border: 2px solid white;
    pointer-events: none;
  }

  .piles-section {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
  }

  .pile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .play-pile {
    position: relative;
    width: 70px;
    min-height: 100px;
    border-radius: 8px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .card-in-pile {
    position: absolute;
    left: 0;
    width: 70px;
    height: 100px;
    transition: box-shadow 0.2s;
  }

  .card-in-pile.can-remove {
    box-shadow: 0 0 0 3px #4CAF50;
  }

  .pile {
    width: 70px;
    height: 100px;
  }

  .empty-pile.discard-icon {
    font-size: 2.5rem;
  }

  .empty-pile.stock-empty {
    font-size: 3rem;
    color: #ff4444;
    border-color: rgba(255, 0, 0, 0.6);
    font-weight: bold;
  }

  .discard-section {
    position: relative;
  }

  .discard-pile {
    position: relative;
    width: 70px;
    height: 100px;
    background: transparent;
    border: none;
    padding: 0;
  }

  .draggable-wrapper {
    cursor: grab;
  }

  .draggable-wrapper:active {
    cursor: grabbing;
  }
</style>
