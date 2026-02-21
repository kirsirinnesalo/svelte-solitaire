<script lang="ts">
  import { createDeck, shuffleDeck } from '../../lib/cardUtils';
  import type { Card } from '../../types/game';
  import CardComponent from '../../components/CardComponent.svelte';
  import GameHeader from '../../components/GameHeader.svelte';
  import GameOverOverlay from '../../components/GameOverOverlay.svelte';
  import PauseOverlay from '../../components/PauseOverlay.svelte';
  import HelpOverlay from '../../components/HelpOverlay.svelte';
  import { revealCard, moveRevealedCard, isGameWon, isGameLost, type ClockState } from './clockRules';
  import { allowDrop } from '../../lib/dragUtils';
  import { clockInstructions } from '../../lib/gameInstructions';
  import '../../styles/shared.css';

  let gameState: ClockState = $state({
    piles: Array(13).fill([]).map(() => []),
    revealedCardPileIndex: null
  });
  let isWon = $state(false);
  let isLost = $state(false);
  let gameStarted = $state(false);
  let draggedFromPileIndex: number | null = $state(null);
  let moves = $state(0);
  let startTime = $state<number>(0);
  let elapsedTime = $state<number>(0);
  let displayTime = $state<number>(0); // For live timer display
  let isPaused = $state<boolean>(false);
  let pauseStartTime = $state<number>(0);
  let isHelpVisible = $state<boolean>(false);
  
  // Update display time every second when game is running
  $effect(() => {
    if (startTime === 0 || isWon || isLost || isPaused) return;
    
    const interval = setInterval(() => {
      displayTime = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);
    
    return () => clearInterval(interval);
  });

  // Clock positions: angles for each hour (0=12 o'clock, going clockwise)
  const clockPositions = [
    { angle: 0, label: 'Q' },    // 12 o'clock (Queen)
    { angle: 30, label: 'A' },   // 1 o'clock (Ace)
    { angle: 60, label: '2' },   // 2 o'clock
    { angle: 90, label: '3' },   // 3 o'clock
    { angle: 120, label: '4' },  // 4 o'clock
    { angle: 150, label: '5' },  // 5 o'clock
    { angle: 180, label: '6' },  // 6 o'clock
    { angle: 210, label: '7' },  // 7 o'clock
    { angle: 240, label: '8' },  // 8 o'clock
    { angle: 270, label: '9' },  // 9 o'clock
    { angle: 300, label: '10' }, // 10 o'clock
    { angle: 330, label: 'J' }   // 11 o'clock (Jack)
  ];

  function initGame() {
    const deck = shuffleDeck(createDeck());
    
    // Deal 4 cards to each of 13 piles
    const piles: Card[][] = Array(13).fill(null).map(() => []);
    
    for (let i = 0; i < 52; i++) {
      const pileIndex = i % 13;
      piles[pileIndex].push({ ...deck[i], faceUp: false });
    }
    
    gameState = {
      piles,
      revealedCardPileIndex: null
    };
    
    isWon = false;
    isLost = false;
    gameStarted = true;
    moves = 0;
    startTime = 0;
    elapsedTime = 0;
    displayTime = 0;
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

  function toggleHelp() {
    isHelpVisible = !isHelpVisible;
  }

  function handlePileClick(pileIndex: number) {
    if (isPaused) return;
    if (isWon || isLost || !gameStarted) return;
    
    // If there's already a revealed card, ignore clicks
    if (gameState.revealedCardPileIndex !== null) return;
    
    const result = revealCard(gameState, pileIndex);
    
    if (result.valid && result.newState) {
      // Start timer on first valid action
      if (startTime === 0) {
        startTime = Date.now();
      }
      
      gameState = result.newState;
    }
  }

  function handleDragStart(event: DragEvent, pileIndex: number) {
    if (isPaused) return;
    if (isWon || isLost) return;
    
    const pile = gameState.piles[pileIndex];
    if (pile.length === 0 || !pile[pile.length - 1].faceUp) return;
    
    draggedFromPileIndex = pileIndex;
    
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', '');
    }
  }

  function handleDrop(event: DragEvent, toPileIndex: number) {
    event.preventDefault();
    
    if (draggedFromPileIndex === null) return;
    
    const result = moveRevealedCard(gameState, toPileIndex);
    
    if (result.valid && result.newState) {
      gameState = result.newState;
      moves++;
      
      if (result.isWon) {
        isWon = true;
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      } else if (result.isLost) {
        isLost = true;
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      }
    }
    
    draggedFromPileIndex = null;
  }

  function handleDragEnd() {
    draggedFromPileIndex = null;
  }

  // Calculate position on clock face
  function getClockPosition(index: number) {
    const radius = 200; // Distance from center
    const centerX = 250; // Center of clock
    const centerY = 250;
    
    // Use exact 30-degree intervals for even spacing
    const angleRad = (index * 30 - 90) * Math.PI / 180;
    const x = centerX + radius * Math.cos(angleRad);
    const y = centerY + radius * Math.sin(angleRad);
    
    return { x: x - 35, y: y - 50 }; // Adjust for card size (70x100)
  }
</script>

<svelte:window onkeydown={(e) => {
  if ((e.key === '?' || e.key === 'F1') && !isHelpVisible) {
    e.preventDefault();
    toggleHelp();
  }
}} />

<div class="clock-game">
  <GameHeader
    undoDisabled={true}
    restartDisabled={true}
    hintDisabled={true}
    elapsedTime={displayTime}
    {isPaused}
    gameStarted={startTime > 0}
    gameEnded={isWon || isLost}
    onNewGame={initGame}
    onPause={togglePause}
    onHelp={toggleHelp}
  >
    {#snippet settings()}
      <!-- Ei asetuksia tällä hetkellä -->
    {/snippet}
  </GameHeader>

  <div class="game-area">
    <HelpOverlay isVisible={isHelpVisible} instruction={clockInstructions} onClose={toggleHelp} />
    <PauseOverlay {isPaused} onResume={togglePause} />
    <GameOverOverlay {isWon} {isLost} {moves} {elapsedTime} />
    
    <div class="clock-container" style="position: relative; width: 500px; height: 500px; margin: 2rem auto;">
      <!-- Clock face piles (12 positions) -->
      {#each clockPositions as pos, i}
        {@const position = getClockPosition(i)}
        {@const pile = gameState.piles[i]}
        {@const hasRevealedCard = pile.length > 0 && pile[pile.length - 1].faceUp}
        {@const rotation = i * 30}
        
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div 
          class="clock-pile"
          onclick={() => handlePileClick(i)}
          ondragover={allowDrop}
          ondrop={(e) => handleDrop(e, i)}
          style="position: absolute; left: {position.x}px; top: {position.y}px; transform: rotate({rotation}deg); transform-origin: center;"
        >
          {#if pile.length > 0}
            {#if pile.length > 3}
              <div class="stack-card" style="top: 6px; left: -3px; z-index: 0;"></div>
            {/if}
            {#if pile.length > 2}
              <div class="stack-card" style="top: 4px; left: -2px; z-index: 1;"></div>
            {/if}
            {#if pile.length > 1}
              <div class="stack-card" style="top: 2px; left: -1px; z-index: 2;"></div>
            {/if}
            <div 
              style="position: relative; z-index: 3;"
              draggable={hasRevealedCard && !isWon && !isLost}
              ondragstart={(e) => handleDragStart(e, i)}
              ondragend={handleDragEnd}
              class:draggable={hasRevealedCard && !isWon && !isLost}
            >
              <CardComponent card={pile[pile.length - 1]} />
            </div>
          {:else}
            <div class="empty-pile clock-label">{pos.label}</div>
          {/if}
        </div>
      {/each}

      <!-- Center pile (Kings) -->
      {#if gameState.piles[12]}
        {@const centerPile = gameState.piles[12]}
        {@const hasRevealedCard = centerPile.length > 0 && centerPile[centerPile.length - 1].faceUp}
        
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div 
          class="clock-pile center-pile"
          onclick={() => handlePileClick(12)}
          ondragover={allowDrop}
          ondrop={(e) => handleDrop(e, 12)}
          style="position: absolute; left: 215px; top: 200px;"
        >
          {#if centerPile.length > 0}
            {#if centerPile.length > 3}
              <div class="stack-card" style="top: 6px; left: -3px; z-index: 0;"></div>
            {/if}
            {#if centerPile.length > 2}
              <div class="stack-card" style="top: 4px; left: -2px; z-index: 1;"></div>
            {/if}
            {#if centerPile.length > 1}
              <div class="stack-card" style="top: 2px; left: -1px; z-index: 2;"></div>
            {/if}
            <div 
              style="position: relative; z-index: 3;"
              draggable={hasRevealedCard && !isWon && !isLost}
              ondragstart={(e) => handleDragStart(e, 12)}
              ondragend={handleDragEnd}
              class:draggable={hasRevealedCard && !isWon && !isLost}
            >
              <CardComponent card={centerPile[centerPile.length - 1]} />
            </div>
          {:else}
            <div class="empty-pile clock-label">K</div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .clock-game {
    padding: 1rem;
  }

  /* Clock-specific styles */
  .game-area {
    position: relative;
    min-height: 600px;
  }

  .clock-container {
    position: relative;
  }

  .clock-pile {
    position: relative;
    width: 70px;
    height: 100px;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .clock-pile:hover {
    transform: scale(1.02);
  }

  .draggable {
    cursor: grab;
  }

  .draggable:active {
    cursor: grabbing;
  }

  .clock-label {
    font-size: 1.8rem;
  }
</style>
