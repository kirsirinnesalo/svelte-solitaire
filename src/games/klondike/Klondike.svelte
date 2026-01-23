<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { createDeck, shuffleDeck } from '../../lib/cardUtils';
  import type { Card } from '../../types/game';
  import CardComponent from '../../components/CardComponent.svelte';
  import { moveCard, isGameWon, isGameLost, type KlondikeState } from './klondikeRules';
  import '../../styles/shared.css';

  const dispatch = createEventDispatcher();

  let state: KlondikeState = {
    tableau: [],
    foundations: [[], [], [], []],
    stock: [],
    waste: []
  };
  let moves = 0;
  let isWon = false;
  let isLost = false;
  let gameStarted = false;
  let firstGameStarted = false; // Track if first game has been started
  let drawCount: 1 | 3 = 1; // Number of cards to draw from stock (setting)
  let activeDrawCount: 1 | 3 = 1; // Active draw count for current game
  let recycleCount = 0; // Track stock recycling
  let maxRecycles: 1 | 2 | 3 | 'unlimited' = 3; // Setting for next game
  let activeMaxRecycles: 1 | 2 | 3 | 'unlimited' = 3; // Locked for current game
  let history: { state: KlondikeState; moves: number }[] = [];
  let draggedCard: { type: 'tableau' | 'waste' | 'foundation', index: number, cardIndex?: number } | null = null;

  // Automatically update maxRecycles when drawCount changes
  $: {
    if (drawCount === 1) {
      maxRecycles = 3;
    } else if (drawCount === 3) {
      maxRecycles = 'unlimited';
    }
  }

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
    state = {
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
      state: JSON.parse(JSON.stringify(state)),
      moves
    }];
  }

  function undo() {
    if (history.length === 0 || isWon) return;
    const previous = history[history.length - 1];
    state = JSON.parse(JSON.stringify(previous.state));
    moves = previous.moves;
    history = history.slice(0, -1);
    isWon = false;
  }

  function drawFromStock() {
    saveState();
    if (state.stock.length === 0) {
      // Check recycle limit
      if (activeMaxRecycles !== 'unlimited' && recycleCount >= activeMaxRecycles - 1) return; // Max recycles reached
      if (state.waste.length === 0) return; // Nothing to recycle
      
      // Reset stock from waste
      state.stock = state.waste.reverse().map(card => ({ ...card, faceUp: false }));
      state.waste = [];
      recycleCount++;
    } else {
      // Draw 1 or 3 cards based on activeDrawCount setting
      const cardsToDraw = Math.min(activeDrawCount, state.stock.length);
      for (let i = 0; i < cardsToDraw; i++) {
        const card = state.stock.pop()!;
        card.faceUp = true;
        state.waste.push(card);
      }
    }
    state = state; // Trigger reactivity
    moves++;
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

    const result = moveCard(state, draggedCard, { type: toType, index: toIndex });

    if (result.valid && result.newState) {
      saveState();
      state = result.newState;
      moves++;
      checkWin();
    }
    
    draggedCard = null;
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  function handleDoubleClick(type: 'tableau' | 'waste', index: number, cardIndex?: number) {
    if (isWon || isLost) return;
    // Try to move card to foundation first (priority)
    for (let i = 0; i < 4; i++) {
      const result = moveCard(
        state,
        { type, index, cardIndex },
        { type: 'foundation', index: i }
      );
      
      if (result.valid && result.newState) {
        saveState();
        state = result.newState;
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
        state,
        { type, index, cardIndex },
        { type: 'tableau', index: i }
      );
      
      if (result.valid && result.newState) {
        saveState();
        state = result.newState;
        moves++;
        checkWin();
        return;
      }
    }
  }

  function checkWin() {
    isWon = isGameWon(state);
    isLost = !isWon && isGameLost(state, recycleCount, activeMaxRecycles);
    
    if (isWon) {
      setTimeout(() => alert('Voitit pelin! 🎉'), 100);
    } else if (isLost) {
      setTimeout(() => alert('Peli päättyi. Ei enää siirtoja. 😔'), 100);
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
  <div class="game-header">
    <div class="action-buttons">
      <button 
        on:click={initGame} 
        class="new-game-btn"
      >
        ▶ Uusi peli
      </button>
      <button class="restart-btn" disabled title="Tulossa pian">↻ Uudelleen</button>
      <button on:click={undo} class="undo-btn" disabled={history.length === 0 || isWon || isLost || !gameStarted}>↶ Kumoa</button>
      <button class="hint-btn" disabled title="Tulossa pian">💡 Vihje</button>
    </div>
    <div class="game-settings">
      <div class="draw-toggle-container">
        <span class="toggle-label">Nosta</span>
        <div class="toggle-slider" class:three={drawCount === 3}>
          <div class="slider-track">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="slider-option" on:click={() => drawCount = 1} role="button" tabindex="0">
              <span class="slider-label">1</span>
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="slider-option" on:click={() => drawCount = 3} role="button" tabindex="0">
              <span class="slider-label">3</span>
            </div>
            <div class="slider-thumb"></div>
          </div>
        </div>
      </div>
      <div class="recycle-toggle-container">
        <span class="toggle-label">Jakoja:</span>
        <div class="recycle-toggle">
          <button 
            class="recycle-option" 
            class:active={maxRecycles === 1}
            on:click={() => maxRecycles = 1}
          >
            1
          </button>
          <button 
            class="recycle-option" 
            class:active={maxRecycles === 2}
            on:click={() => maxRecycles = 2}
          >
            2
          </button>
          <button 
            class="recycle-option" 
            class:active={maxRecycles === 3}
            on:click={() => maxRecycles = 3}
          >
            3
          </button>
          <button 
            class="recycle-option" 
            class:active={maxRecycles === 'unlimited'}
            on:click={() => maxRecycles = 'unlimited'}
          >
            ∞
          </button>
        </div>
      </div>
    </div>
  </div>

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
            on:click={drawFromStock}
            disabled={state.stock.length === 0 && state.waste.length === 0 || isWon || isLost}
          >
            {#if !firstGameStarted}
              <div class="empty-pile">↻</div>
            {:else if state.stock.length === 0 && (state.waste.length === 0 || (activeMaxRecycles !== 'unlimited' && recycleCount >= activeMaxRecycles - 1))}
              <div class="empty-pile no-more-draws">✕</div>
            {:else if state.stock.length > 0}
              {#if state.stock.length > 2}
                <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
              {/if}
              {#if state.stock.length > 1}
                <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
              {/if}
              <div style="position: relative; z-index: 2;">
                <CardComponent card={state.stock[state.stock.length - 1]} />
              </div>
            {:else}
              <div class="empty-pile">↻</div>
            {/if}
          </button>
        </div>
        
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="waste-pile pile">
          {#if state.waste.length > 0}
            {#if activeDrawCount === 3}
              <!-- Show last 3 cards fanned out in 3-card mode -->
              {#each state.waste.slice(-3) as card, i}
                {@const isLast = i === state.waste.slice(-3).length - 1}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                  role="button"
                  tabindex={isLast ? 0 : -1}
                  draggable={isLast && !isWon && !isLost}
                  on:dragstart={(e) => isLast && handleDragStart(e, 'waste', 0)}
                  on:click={() => isLast && handleDoubleClick('waste', 0)}
                  class="waste-card"
                  class:draggable={isLast && !isWon && !isLost}
                  style="left: {i * 15}px"
                >
                  <CardComponent {card} />
                </div>
              {/each}
            {:else}
              <!-- Show only top card in 1-card mode -->
              {#if state.waste.length > 2}
                <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
              {/if}
              {#if state.waste.length > 1}
                <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
              {/if}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div
                role="button"
                tabindex="0"
                draggable={!isWon && !isLost}
                on:dragstart={(e) => handleDragStart(e, 'waste', 0)}
                on:click={() => handleDoubleClick('waste', 0)}
                class="waste-card"
                class:draggable={!isWon && !isLost}
                style="position: relative; z-index: 2;"
              >
                <CardComponent card={state.waste[state.waste.length - 1]} />
              </div>
            {/if}
          {:else}
            <div class="empty-pile"></div>
          {/if}

      </div>
      </div>

      <!-- Foundations -->
      <div class="foundations">
        {#each state.foundations as foundation, i}
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            class="foundation pile"
            on:drop={(e) => handleDrop(e, 'foundation', i)}
            on:dragover={handleDragOver}
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
                on:dragstart={(e) => handleDragStart(e, 'foundation', i)}
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
        {#each state.tableau as pile, i}
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            class="tableau-pile"
            on:drop={(e) => handleDrop(e, 'tableau', i)}
            on:dragover={handleDragOver}
          >
            {#if pile.length === 0}
              <div class="empty-pile tableau-empty"></div>
            {:else}
              {#each pile as card, j}
                <div class="card-position" style="top: {j * getCardSpacing(pile.length)}px">
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <div
                    role="button"
                    tabindex={card.faceUp ? 0 : -1}
                    draggable={card.faceUp && !isWon && !isLost}
                    on:dragstart={(e) => handleDragStart(e, 'tableau', i, j)}
                    on:click={() => handleDoubleClick('tableau', i, j)}
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

  /* Klondike-specific overrides and additions */
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
    gap: 0.5rem;
    align-items: center;
  }

  .restart-btn, .hint-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    background: #4CAF50;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
  }

  .restart-btn:disabled, .hint-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .draw-toggle-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }

  .recycle-toggle-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .recycle-toggle {
    display: flex;
    gap: 0.25rem;
    background: #e0e0e0;
    padding: 2px;
    border-radius: 6px;
  }

  .recycle-option {
    padding: 0.3rem 0.6rem;
    border: none;
    background: transparent;
    color: #666;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .recycle-option:hover {
    background: rgba(76, 175, 80, 0.1);
  }

  .recycle-option.active {
    background: #4CAF50;
    color: white;
  }

  .toggle-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #2c3e50;
  }

  .toggle-slider {
    position: relative;
  }

  .slider-track {
    position: relative;
    display: flex;
    background: #e0e0e0;
    border-radius: 16px;
    padding: 2px;
    width: 70px;
    height: 32px;
  }

  .slider-option {
    flex: 1;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 2;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .slider-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #666;
    transition: color 0.3s;
  }

  .toggle-slider.three .slider-option:first-child .slider-label {
    color: #666;
  }

  .toggle-slider:not(.three) .slider-option:first-child .slider-label,
  .toggle-slider.three .slider-option:last-child .slider-label {
    color: white;
  }

  .slider-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: calc(50% - 2px);
    height: calc(100% - 4px);
    background: #4CAF50;
    border-radius: 14px;
    transition: transform 0.3s ease;
    z-index: 1;
  }

  .toggle-slider.three .slider-thumb {
    transform: translateX(100%);
  }

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
