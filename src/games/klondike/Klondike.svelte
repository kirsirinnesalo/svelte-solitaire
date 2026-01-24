<script lang="ts">
  import { createDeck, shuffleDeck } from '../../lib/cardUtils';
  import type { Card } from '../../types/game';
  import CardComponent from '../../components/CardComponent.svelte';
  import GameHeader from '../../components/GameHeader.svelte';
  import GameResultModal from '../../components/GameResultModal.svelte';
  import DrawCountToggle from '../../components/settings/DrawCountToggle.svelte';
  import RecycleToggle from '../../components/settings/RecycleToggle.svelte';
  import { moveCard, isGameWon, isGameLost, type KlondikeState } from './klondikeRules';
  import { allowDrop } from '../../lib/dragUtils';
  import '../../styles/shared.css';

  let gameState: KlondikeState = $state({
    tableau: [],
    foundations: [[], [], [], []],
    stock: [],
    waste: []
  });
  let moves = $state(0);
  let isWon = $state(false);
  let isLost = $state(false);
  let showResultModal = $state(false);
  let gameStarted = $state(false);
  let firstGameStarted = $state(false); // Track if first game has been started
  let drawCount: 1 | 3 = $state(1); // Number of cards to draw from stock (setting)
  let activeDrawCount: 1 | 3 = $state(1); // Active draw count for current game
  let recycleCount = $state(0); // Track stock recycling
  let maxRecycles: 1 | 2 | 3 | 'unlimited' = $state(3); // Setting for next game
  let activeMaxRecycles: 1 | 2 | 3 | 'unlimited' = $state(3); // Locked for current game
  let history: { gameState: KlondikeState; moves: number }[] = $state([]);
  let draggedCard: { type: 'tableau' | 'waste' | 'foundation', index: number, cardIndex?: number } | null = $state(null);

  // Derived state for undo button
  let undoDisabled = $derived(history.length === 0 || isWon || isLost || !gameStarted);

  // Automatically update maxRecycles when drawCount changes
  $effect(() => {
    if (drawCount === 1) {
      maxRecycles = 3;
    } else if (drawCount === 3) {
      maxRecycles = 'unlimited';
    }
  });

  function initGame() {
    activeDrawCount = drawCount; // Lock in the draw count for this game
    activeMaxRecycles = maxRecycles; // Lock in the setting
    recycleCount = 0;
    gameStarted = true;
    firstGameStarted = true;
    isLost = false;
    const deck = shuffleDeck(createDeck());
    const tableau: Card[][] = [];
    
    // Deal cards to tableau (7 piles)
    let cardIndex = 0;
    for (let i = 0; i < 7; i++) {
      const pile: Card[] = [];
      for (let j = 0; j <= i; j++) {
        const card = deck[cardIndex++];
        card.faceUp = j === i;
        pile.push(card);
      }
      tableau.push(pile);
    }
    
    // Remaining cards go to stock
    gameState = {
      tableau,
      stock: deck.slice(cardIndex).map(card => ({ ...card, faceUp: false })),
      waste: [],
      foundations: [[], [], [], []]
    };
    moves = 0;
    isWon = false;
    recycleCount = 0;
    history = [];
    draggedCard = null;
  }

  function saveState() {
    history = [...history, {
      gameState: JSON.parse(JSON.stringify(gameState)),
      moves
    }];
  }

  function undo() {
    if (history.length === 0 || isWon) return;
    const previous = history[history.length - 1];
    gameState = JSON.parse(JSON.stringify(previous.gameState));
    moves = previous.moves;
    history = history.slice(0, -1);
    isWon = false;
  }

  function drawFromStock() {
    saveState();
    if (gameState.stock.length === 0) {
      // Check recycle limit
      if (activeMaxRecycles !== 'unlimited' && recycleCount >= activeMaxRecycles - 1) {
        checkWin(); // Check for loss when can't recycle anymore
        return;
      }
      if (gameState.waste.length === 0) {
        checkWin(); // Check for loss when nothing to recycle
        return;
      }
      
      // Reset stock from waste
      gameState = {
        ...gameState,
        stock: gameState.waste.reverse().map((card: Card) => ({ ...card, faceUp: false })),
        waste: []
      };
      recycleCount++;
    } else {
      // Draw 1 or 3 cards based on activeDrawCount setting
      const cardsToDraw = Math.min(activeDrawCount, gameState.stock.length);
      const newStock = [...gameState.stock];
      const newWaste = [...gameState.waste];
      
      for (let i = 0; i < cardsToDraw; i++) {
        const card = newStock.pop()!;
        card.faceUp = true;
        newWaste.push(card);
      }
      
      gameState = {
        ...gameState,
        stock: newStock,
        waste: newWaste
      };
    }
    moves++;
    checkWin(); // Check for win/loss after drawing cards
  }

  function handleDragStart(event: DragEvent, type: 'tableau' | 'waste' | 'foundation', index: number, cardIndex?: number) {
    if (isWon || isLost) return;
    draggedCard = { type, index, cardIndex };
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', ''); // Required for Firefox
    }
  }

  function handleDrop(event: DragEvent, toType: 'tableau' | 'foundation', toIndex: number) {
    event.preventDefault();
    if (!draggedCard) return;

    const result = moveCard(gameState, draggedCard, { type: toType, index: toIndex });

    if (result.valid && result.newState) {
      saveState();
      gameState = result.newState;
      moves++;
      checkWin();
    }
    
    draggedCard = null;
  }

  function handleDoubleClick(type: 'tableau' | 'waste', index: number, cardIndex?: number) {
    if (isWon || isLost) return;
    // Try to move card to foundation first (priority)
    for (let i = 0; i < 4; i++) {
      const result = moveCard(
        gameState,
        { type, index, cardIndex },
        { type: 'foundation', index: i }
      );
      
      if (result.valid && result.newState) {
        saveState();
        gameState = result.newState;
        moves++;
        checkWin();
        return;
      }
    }
    
    // If foundation didn't work, try tableau piles
    for (let i = 0; i < 7; i++) {
      // Skip moving to same pile
      if (type === 'tableau' && i === index) continue;
      
      const result = moveCard(
        gameState,
        { type, index, cardIndex },
        { type: 'tableau', index: i }
      );
      
      if (result.valid && result.newState) {
        saveState();
        gameState = result.newState;
        moves++;
        checkWin();
        return;
      }
    }
  }

  function checkWin() {
    isWon = isGameWon(gameState);
    isLost = !isWon && isGameLost(gameState, recycleCount, activeMaxRecycles);
    
    if (isWon || isLost) {
      setTimeout(() => { showResultModal = true; }, 100);
    }
  }

  // Calculate dynamic card spacing based on pile length
  function getCardSpacing(pileLength: number): number {
    const maxHeight = 420; // Max available height for tableau cards
    const cardHeight = 100; // Height of one card
    const minSpacing = 10; // Minimum spacing between cards
    const maxSpacing = 20; // Maximum spacing between cards
    
    if (pileLength <= 1) return maxSpacing;
    
    // Calculate required total height: (n-1) * spacing + cardHeight
    const requiredHeight = cardHeight + (pileLength - 1) * maxSpacing;
    
    if (requiredHeight <= maxHeight) {
      return maxSpacing;
    }
    
    // Calculate adjusted spacing to fit within maxHeight
    const spacing = Math.max(minSpacing, (maxHeight - cardHeight) / (pileLength - 1));
    return Math.floor(spacing);
  }
</script>

<div class="klondike">
  <GameHeader
    undoDisabled={undoDisabled}
    restartDisabled={true}
    hintDisabled={true}
    onNewGame={initGame}
    onUndo={undo}
  >
    {#snippet settings()}
      <DrawCountToggle bind:value={drawCount} />
      <RecycleToggle bind:value={maxRecycles} />
    {/snippet}
  </GameHeader>

  <div class="game-area">
    <!-- Stock and Waste -->
    <div class="top-row">
      <div class="stock-waste-wrapper">
        <div class="stock-area">
          {#if firstGameStarted && activeMaxRecycles !== 'unlimited'}
            <div class="stock-counter">{recycleCount + 1}/{activeMaxRecycles}</div>
          {/if}
          <button
            class="stock-pile pile"
            onclick={drawFromStock}
            disabled={gameState.stock.length === 0 && gameState.waste.length === 0 || isWon || isLost}
          >
            {#if !firstGameStarted}
              <div class="empty-pile">↻</div>
            {:else if gameState.stock.length === 0 && (gameState.waste.length === 0 || (activeMaxRecycles !== 'unlimited' && recycleCount >= activeMaxRecycles - 1))}
              <div class="empty-pile no-more-draws">✕</div>
            {:else if gameState.stock.length > 0}
              {#if gameState.stock.length > 2}
                <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
              {/if}
              {#if gameState.stock.length > 1}
                <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
              {/if}
              <div style="position: relative; z-index: 2;">
                <CardComponent card={gameState.stock[gameState.stock.length - 1]} />
              </div>
            {:else}
              <div class="empty-pile">↻</div>
            {/if}
          </button>
        </div>
        
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="waste-pile pile">
          {#if gameState.waste.length > 0}
            {#if activeDrawCount === 3}
              <!-- Show last 3 cards fanned out in 3-card mode -->
              {#each gameState.waste.slice(-3) as card, i}
                {@const isLast = i === gameState.waste.slice(-3).length - 1}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div
                  role="button"
                  tabindex={isLast ? 0 : -1}
                  draggable={isLast && !isWon && !isLost}
                  ondragstart={(e) => isLast && handleDragStart(e, 'waste', 0)}
                  onclick={() => isLast && handleDoubleClick('waste', 0)}
                  class="waste-card"
                  class:draggable={isLast && !isWon && !isLost}
                  style="left: {i * 15}px"
                >
                  <CardComponent {card} />
                </div>
              {/each}
            {:else}
              <!-- Show only top card in 1-card mode -->
              {#if gameState.waste.length > 2}
                <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
              {/if}
              {#if gameState.waste.length > 1}
                <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
              {/if}
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <div
                role="button"
                tabindex="0"
                draggable={!isWon && !isLost}
              ondragstart={(e) => handleDragStart(e, 'waste', 0)}
                onclick={() => handleDoubleClick('waste', 0)}
                class="waste-card"
                class:draggable={!isWon && !isLost}
                style="position: relative; z-index: 2;"
              >
                <CardComponent card={gameState.waste[gameState.waste.length - 1]} />
              </div>
            {/if}
          {:else}
            <div class="empty-pile"></div>
          {/if}

      </div>
      </div>

      <!-- Foundations -->
      <div class="foundations">
        {#each gameState.foundations as foundation, i}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="foundation pile"
            ondrop={(e) => handleDrop(e, 'foundation', i)}
            ondragover={allowDrop}
          >
            {#if foundation.length > 0}
              <!-- Background cards to show stack depth -->
              {#if foundation.length > 2}
                <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
              {/if}
              {#if foundation.length > 1}
                <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
              {/if}
              <div
                role="button"
                tabindex="0"
                draggable={!isWon && !isLost}
                ondragstart={(e) => handleDragStart(e, 'foundation', i)}
                class="draggable-wrapper"
                class:draggable={!isWon && !isLost}
                style="position: relative; z-index: 2;"
              >
                <CardComponent card={foundation[foundation.length - 1]} />
              </div>
            {:else}
              <div class="empty-pile foundation-empty">
                {['♥', '♦', '♣', '♠'][i]}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- Tableau -->
    <div class="tableau">
      {#if !firstGameStarted}
        <!-- Show empty piles before game starts -->
        {#each Array(7) as _, i}
          <div class="tableau-pile">
            <div class="empty-pile tableau-empty"></div>
          </div>
        {/each}
      {:else}
        {#each gameState.tableau as pile, i}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="tableau-pile"
            ondrop={(e) => handleDrop(e, 'tableau', i)}
            ondragover={allowDrop}
          >
            {#if pile.length === 0}
              <div class="empty-pile tableau-empty"></div>
            {:else}
              {#each pile as card, j}
                <div class="card-position" style="top: {j * getCardSpacing(pile.length)}px">
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <div
                    role="button"
                    tabindex={card.faceUp ? 0 : -1}
                    draggable={card.faceUp && !isWon && !isLost}
                    ondragstart={(e) => handleDragStart(e, 'tableau', i, j)}
                    onclick={() => handleDoubleClick('tableau', i, j)}
                    class="draggable-wrapper"
                    class:draggable={card.faceUp && !isWon && !isLost}
                  >
                    <CardComponent {card} />
                  </div>
                </div>
              {/each}
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>

<style>
  .klondike {
    padding: 1rem;
  }

  /* Klondike-specific settings styles */
  .game-area {
    min-height: 650px;
  }

  .top-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 3rem;
  }

  .stock-waste-wrapper {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .stock-area {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .foundations {
    display: flex;
    gap: 1rem;
  }

  .foundation {
    position: relative;
  }

  .pile {
    width: 70px;
    height: 100px;
  }

  .stock-pile {
    position: relative;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .stock-pile:disabled {
    cursor: default;
  }

  .stock-counter {
    position: absolute;
    top: -1.5rem;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    font-size: 0.9rem;
    font-weight: bold;
    color: white;
    white-space: nowrap;
  }

  .waste-pile {
    position: relative;
    min-width: 120px;
  }

  .waste-card {
    position: absolute;
    top: 0;
    left: 0;
  }

  .waste-card.draggable {
    cursor: grab;
  }

  .waste-card.draggable:active {
    cursor: grabbing;
  }

  .empty-pile.no-more-draws {
    font-size: 2.5rem;
    color: rgba(244, 67, 54, 0.9);
    border-color: rgba(244, 67, 54, 0.6);
    cursor: not-allowed;
  }

  .draggable-wrapper {
    display: inline-block;
  }

  .draggable-wrapper.draggable {
    cursor: grab;
  }

  .draggable-wrapper.draggable:active {
    cursor: grabbing;
  }

  .foundation-empty {
    font-size: 2.5rem;
  }

  .tableau {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .tableau-pile {
    position: relative;
    width: 70px;
    min-height: 100px;
  }

  .card-position {
    position: absolute;
    left: 0;
  }

  .tableau-empty {
    border: 2px dashed rgba(255, 255, 255, 0.3);
  }
</style>

<GameResultModal
  isOpen={showResultModal}
  isWon={isWon}
  moves={moves}
  onNewGame={() => { showResultModal = false; initGame(); }}
  onClose={() => showResultModal = false}
/>
