<script lang="ts">
  import { createDeck, shuffleDeck } from '../../lib/cardUtils';
  import type { Card } from '../../types/game';
  import CardComponent from '../../components/CardComponent.svelte';
  import GameHeader from '../../components/GameHeader.svelte';
  import GameResultModal from '../../components/GameResultModal.svelte';
  import { 
    dealCards, 
    removeCard, 
    moveCard, 
    canRemoveCard,
    isGameWon, 
    isGameLost,
    type AcesUpState 
  } from './acesUpRules';
  import { allowDrop } from '../../lib/dragUtils';
  import '../../styles/shared.css';

  let gameState: AcesUpState = $state({
    piles: [[], [], [], []],
    stock: [],
    discarded: []
  });
  let moves = $state(0);
  let isWon = $state(false);
  let isLost = $state(false);
  let showResultModal = $state(false);
  let draggedPile: number | null = $state(null);
  let showHighlight = $state(false);
  let history: AcesUpState[] = $state([]);
  let startTime = $state<number>(0);
  let elapsedTime = $state<number>(0);
  let displayTime = $state<number>(0); // For live timer display
  let isPaused = $state<boolean>(false);
  let pauseStartTime = $state<number>(0);

  // Derived state for undo button
  let undoDisabled = $derived(history.length === 0 || isWon || isLost);
  
  // Update display time every second when game is running
  $effect(() => {
    if (startTime === 0 || isWon || isLost || isPaused) return;
    
    const interval = setInterval(() => {
      displayTime = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);
    
    return () => clearInterval(interval);
  });

  function initGame() {
    const deck = shuffleDeck(createDeck());
    
    // All cards go to stock initially
    gameState = {
      piles: [[], [], [], []],
      stock: deck.map(card => ({ ...card, faceUp: false })),
      discarded: []
    };
    
    moves = 0;
    isWon = false;
    isLost = false;
    showResultModal = false;
    draggedPile = null;
    history = [];
    startTime = 0;
    elapsedTime = 0;
    displayTime = 0;
  }

  function saveState() {
    // Deep clone current gameState
    history = [...history, {
      piles: gameState.piles.map((pile: Card[]) => pile.map((card: Card) => ({ ...card }))),
      stock: gameState.stock.map((card: Card) => ({ ...card })),
      discarded: gameState.discarded.map((card: Card) => ({ ...card }))
    }];
  }

  function handleDeal() {
    if (isPaused) return;
    
    // Start timer on first action
    if (startTime === 0) {
      startTime = Date.now();
    }
    
    const result = dealCards(gameState);
    if (result.valid && result.newState) {
      saveState();
      gameState = result.newState;
      showHighlight = false; // Hide hint after dealing
      moves++;
      checkGameStatus();
    }
  }

  function handleRemoveCard(pileIndex: number) {
    if (isPaused) return;
    
    // Start timer on first action
    if (startTime === 0) {
      startTime = Date.now();
    }
    
    const result = removeCard(gameState, pileIndex);
    if (result.valid && result.newState) {
      saveState();
      gameState = result.newState;
      moves++;
      checkGameStatus();
    }
  }

  function handlePileClick(pileIndex: number) {
    if (isPaused) return;
    
    const pile = gameState.piles[pileIndex];
    
    if (pile.length === 0) {
      // Empty pile - do nothing on click
      return;
    }
    
    // Non-empty pile - try to remove or move to empty pile
    const topCard = pile[pile.length - 1];
    
    // First priority: remove if possible
    if (canRemoveCard(topCard, gameState.piles)) {
      handleRemoveCard(pileIndex);
      return;
    }
    
    // Second priority: move to empty pile if one exists
    const emptyPileIndex = gameState.piles.findIndex((p: Card[], i: number) => p.length === 0 && i !== pileIndex);
    if (emptyPileIndex !== -1) {
      // Start timer on first action
      if (startTime === 0) {
        startTime = Date.now();
      }
      
      const result = moveCard(gameState, pileIndex, emptyPileIndex);
      if (result.valid && result.newState) {
        saveState();
        gameState = result.newState;
        moves++;
        checkGameStatus();
      }
    }
  }

  function handleDragStart(event: DragEvent, pileIndex: number) {
    if (isPaused) return;
    if (gameState.piles[pileIndex].length === 0) return;
    draggedPile = pileIndex;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', '');
    }
  }

  function handleDrop(event: DragEvent, pileIndex: number) {
    event.preventDefault();
    if (draggedPile === null) return;

    const result = moveCard(gameState, draggedPile, pileIndex);
    if (result.valid && result.newState) {
      saveState();
      gameState = result.newState;
      moves++;
      checkGameStatus();
    }

    draggedPile = null;
  }

  function undo() {
    if (history.length === 0) return;
    
    gameState = history[history.length - 1];
    history = history.slice(0, -1);
    moves = Math.max(0, moves - 1);
    isWon = false;
    isLost = false;
  }

  function togglePause() {
    if (isWon || isLost || startTime === 0) return;
    
    if (isPaused) {
      // Resume: add pause duration to startTime
      const pauseDuration = Date.now() - pauseStartTime;
      startTime += pauseDuration;
      isPaused = false;
    } else {
      // Pause: record pause start time
      pauseStartTime = Date.now();
      isPaused = true;
    }
  }

  function showHint() {
    // Show highlights temporarily - next deal will hide them
    showHighlight = true;
  }

  function checkGameStatus() {
    isWon = isGameWon(gameState);
    isLost = !isWon && isGameLost(gameState);
    
    if (isWon) {
      elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      setTimeout(() => { showResultModal = true; }, 100);
    } else if (isLost) {
      elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      setTimeout(() => { showResultModal = true; }, 100);
    }
  }

  initGame();
</script>

<div class="acesup">
  <GameHeader
    {undoDisabled}
    restartDisabled={true}
    hintDisabled={false}
    elapsedTime={displayTime}
    {isPaused}    gameStarted={startTime > 0}
    gameEnded={isWon || isLost}    onNewGame={initGame}
    onUndo={undo}
    onHint={showHint}
    onPause={togglePause}
  />

  <div class="game-area">
    {#if isPaused}
      <div class="pause-overlay">
        <div class="pause-message">
          <div class="pause-icon">⏸</div>
          <div>Peli tauolla</div>
          <button class="resume-btn" onclick={togglePause}>▶ Jatka</button>
        </div>
      </div>
    {/if}
    
    <!-- Stock -->
    <div class="stock-section">
      <button
        class="stock-pile pile"
        onclick={handleDeal}
        disabled={gameState.stock.length < 4}
      >
        {#if gameState.stock.length >= 4}
          <CardComponent card={gameState.stock[gameState.stock.length - 1]} />
          <div class="stock-count">{gameState.stock.length}</div>
        {:else}
          <div class="empty-pile stock-empty">✕</div>
        {/if}
      </button>
    </div>

    <!-- Piles -->
    <div class="piles-section">
      {#each gameState.piles as pile, i}
        <div class="pile-container">
          <div
            role="button"
            tabindex="0"
            class="play-pile pile"
            onclick={() => handlePileClick(i)}
            onkeydown={(e) => e.key === 'Enter' && handlePileClick(i)}
            ondrop={(e) => handleDrop(e, i)}
            ondragover={allowDrop}
          >
            {#if pile.length > 0}
              {#each pile as card, cardIndex}
                {@const isLast = cardIndex === pile.length - 1}
                {@const canRemove = isLast && canRemoveCard(card, gameState.piles)}
                <div
                  role="button"
                  tabindex="0"
                  draggable={isLast}
                  ondragstart={(e) => isLast && handleDragStart(e, i)}
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
        {#if gameState.discarded.length > 0}
          {#if gameState.discarded.length > 2}
            <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
          {/if}
          {#if gameState.discarded.length > 1}
            <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
          {/if}
          <div style="position: relative; z-index: 2;">
            <CardComponent card={{...gameState.discarded[gameState.discarded.length - 1], faceUp: false}} />
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

  .game-area {
    position: relative;
    min-height: 400px;
    display: flex;
    gap: 5rem;
    align-items: flex-start;
    justify-content: center;
  }
  
  .pause-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    border-radius: 8px;
  }
  
  .pause-message {
    text-align: center;
    color: white;
    font-size: 2rem;
    font-weight: bold;
  }
  
  .pause-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .resume-btn {
    margin-top: 2rem;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .resume-btn:hover {
    background: #45a049;
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

<GameResultModal 
  isOpen={showResultModal}
  isWon={isWon} 
  moves={moves}
  elapsedTime={elapsedTime}
  onNewGame={initGame} 
  onClose={() => { showResultModal = false; }} 
/>
