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
  let showHighlight = $state(false);
  let highlightedCards = $state(new Set<string>());
  let noMovesMessage = $state(false);
  let stockHighlight = $state(false);
  let startTime = $state<number>(0);
  let elapsedTime = $state<number>(0);
  let displayTime = $state<number>(0); // For live timer display
  let isPaused = $state<boolean>(false);
  let pauseStartTime = $state<number>(0);

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
  
  // Update display time every second when game is running
  $effect(() => {
    if (startTime === 0 || isWon || isLost || isPaused) return;
    
    const interval = setInterval(() => {
      displayTime = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);
    
    return () => clearInterval(interval);
  });

  function initGame() {
    activeDrawCount = drawCount; // Lock in the draw count for this game
    activeMaxRecycles = maxRecycles; // Lock in the setting
    recycleCount = 0;
    gameStarted = true;
    firstGameStarted = true;
    isLost = false;
    showHighlight = false; // Reset hints
    highlightedCards = new Set<string>(); // Clear highlighted cards
    stockHighlight = false; // Reset stock highlight
    startTime = 0;
    elapsedTime = 0;
    displayTime = 0;
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

  function drawFromStock() {
    if (isPaused) return;
    
    // Start timer on first action
    if (startTime === 0) {
      startTime = Date.now();
    }
    
    showHighlight = false; // Hide hints when drawing
    stockHighlight = false; // Hide stock highlight
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
    if (!draggedCard || isPaused) return;

    // Start timer on first action
    if (startTime === 0) {
      startTime = Date.now();
    }

    const result = moveCard(gameState, draggedCard, { type: toType, index: toIndex });

    if (result.valid && result.newState) {
      showHighlight = false; // Hide hints when card is moved
      saveState();
      gameState = result.newState;
      moves++;
      checkWin();
    }
    
    draggedCard = null;
  }

  function handleDoubleClick(type: 'tableau' | 'waste', index: number, cardIndex?: number) {
    if (isWon || isLost || isPaused) return;
    // Start timer on first action
    if (startTime === 0) {
      startTime = Date.now();
    }
    
    showHighlight = false; // Hide hints when card is moved
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

  function showHint() {
    if (isPaused) return;
    
    // Find all possible moves and highlight them
    highlightedCards = new Set<string>();
    
    // Check waste card moves
    if (gameState.waste.length > 0) {
      const wasteCard = gameState.waste[gameState.waste.length - 1];
      
      // Check if can move to any foundation
      for (let i = 0; i < 4; i++) {
        const result = moveCard(gameState, { type: 'waste', index: 0 }, { type: 'foundation', index: i });
        if (result.valid) {
          highlightedCards.add(wasteCard.id);
          break;
        }
      }
      
      // Check if can move to any tableau
      for (let i = 0; i < 7; i++) {
        const result = moveCard(gameState, { type: 'waste', index: 0 }, { type: 'tableau', index: i });
        if (result.valid) {
          highlightedCards.add(wasteCard.id);
          break;
        }
      }
    }
    
    // Check tableau cards
    for (let i = 0; i < gameState.tableau.length; i++) {
      const pile = gameState.tableau[i];
      if (pile.length === 0) continue;
      
      // Find first face-up card
      const firstFaceUpIndex = pile.findIndex(card => card.faceUp);
      if (firstFaceUpIndex === -1) continue;
      
      // Check each face-up card sequence
      for (let j = firstFaceUpIndex; j < pile.length; j++) {
        const card = pile[j];
        
        // Check if can move to foundation (only top card)
        if (j === pile.length - 1) {
          for (let k = 0; k < 4; k++) {
            const result = moveCard(gameState, { type: 'tableau', index: i, cardIndex: j }, { type: 'foundation', index: k });
            if (result.valid) {
              highlightedCards.add(card.id);
              break;
            }
          }
        }
        
        // Check if can move to another tableau pile
        for (let k = 0; k < 7; k++) {
          if (k === i) continue;
          const result = moveCard(gameState, { type: 'tableau', index: i, cardIndex: j }, { type: 'tableau', index: k });
          if (result.valid) {
            // Skip if moving a king from bottom of pile to an empty tableau (pointless move)
            const targetPile = gameState.tableau[k];
            if (card.rank === 'K' && j === 0 && targetPile.length === 0) {
              continue;
            }
            highlightedCards.add(card.id);
            break;
          }
        }
      }
    }
    
    // Check if any moves were found
    if (highlightedCards.size === 0) {
      // No moves available - check if can draw more cards
      if (gameState.stock.length > 0 || gameState.waste.length > 0) {
        stockHighlight = true;
        setTimeout(() => { stockHighlight = false; }, 2500);
      } else {
        // Truly no moves
        noMovesMessage = true;
        setTimeout(() => { noMovesMessage = false; }, 2500);
      }
    } else {
      showHighlight = true;
    }
  }

  function checkWin() {
    isWon = isGameWon(gameState);
    isLost = !isWon && isGameLost(gameState, recycleCount, activeMaxRecycles);
    
    if (isWon || isLost) {
      elapsedTime = Math.floor((Date.now() - startTime) / 1000);
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
    hintDisabled={false}
    elapsedTime={displayTime}
    isPaused={isPaused}
    gameStarted={startTime > 0}
    gameEnded={isWon || isLost}
    onNewGame={initGame}
    onUndo={undo}
    onHint={showHint}
    onPause={togglePause}
  >
    {#snippet settings()}
      <DrawCountToggle bind:value={drawCount} />
      <RecycleToggle bind:value={maxRecycles} />
    {/snippet}
  </GameHeader>

  <!-- No moves message toast -->
  {#if noMovesMessage}
    <div class="no-moves-toast">
      {#if gameState.stock.length > 0 || gameState.waste.length > 0}
        Käännä lisää kortteja peliin
      {:else}
        Ei mahdollisia siirtoja
      {/if}
    </div>
  {/if}

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
    
    <!-- Stock and Waste -->
    <div class="top-row">
      <div class="stock-waste-wrapper">
        <div class="stock-area">
          {#if firstGameStarted && activeMaxRecycles !== 'unlimited'}
            <div class="stock-counter">{recycleCount + 1}/{activeMaxRecycles}</div>
          {/if}
          <button
            class="stock-pile pile"
            class:highlight={stockHighlight}
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
                  class:highlight={isLast && showHighlight && highlightedCards.has(card.id)}
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
                class:highlight={showHighlight && highlightedCards.has(gameState.waste[gameState.waste.length - 1].id)}
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
                    class:highlight={showHighlight && highlightedCards.has(card.id)}
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
    position: relative;
  }

  /* No moves toast notification */
  .no-moves-toast {
    position: absolute;
    top: 4rem;
    left: 50%;
    transform: translateX(-50%);
    background: #e3f2fd;
    color: #1565c0;
    padding: 0.6rem 1.2rem;
    border-radius: 6px;
    border: 1px solid #90caf9;
    font-size: 0.95rem;
    font-weight: 500;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    animation: slideInFadeOut 2.5s ease-in-out;
  }

  @keyframes slideInFadeOut {
    0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    10% { opacity: 1; transform: translateX(-50%) translateY(0); }
    90% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  }

  /* Klondike-specific settings styles */
  .game-area {
    position: relative;
    min-height: 650px;
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
    width: 70px;
    height: 100px;
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
  elapsedTime={elapsedTime}
  onNewGame={() => { showResultModal = false; initGame(); }}
  onClose={() => showResultModal = false}
/>
