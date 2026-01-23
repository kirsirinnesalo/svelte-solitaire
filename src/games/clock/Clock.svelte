<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { createDeck, shuffleDeck } from '../../lib/cardUtils';
  import type { Card } from '../../types/game';
  import CardComponent from '../../components/CardComponent.svelte';
  import { revealCard, moveRevealedCard, isGameWon, isGameLost, type ClockState } from './clockRules';
  import '../../styles/shared.css';

  const dispatch = createEventDispatcher();

  let state: ClockState = {
    piles: Array(13).fill([]).map(() => []),
    revealedCardPileIndex: null
  };
  let isWon = false;
  let isLost = false;
  let gameStarted = false;
  let draggedFromPileIndex: number | null = null;

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
    
    state = {
      piles,
      revealedCardPileIndex: null
    };
    
    isWon = false;
    isLost = false;
    gameStarted = true;
  }

  function handlePileClick(pileIndex: number) {
    if (isWon || isLost || !gameStarted) return;
    
    // If there's already a revealed card, ignore clicks
    if (state.revealedCardPileIndex !== null) return;
    
    const result = revealCard(state, pileIndex);
    
    if (result.valid && result.newState) {
      state = result.newState;
    }
  }

  function handleDragStart(event: DragEvent, pileIndex: number) {
    if (isWon || isLost) return;
    
    const pile = state.piles[pileIndex];
    if (pile.length === 0 || !pile[pile.length - 1].faceUp) return;
    
    draggedFromPileIndex = pileIndex;
    
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', '');
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  function handleDrop(event: DragEvent, toPileIndex: number) {
    event.preventDefault();
    
    if (draggedFromPileIndex === null) return;
    
    const result = moveRevealedCard(state, toPileIndex);
    
    if (result.valid && result.newState) {
      state = result.newState;
      
      if (result.isWon) {
        isWon = true;
        setTimeout(() => alert('Voitit pelin! 🎉'), 100);
      } else if (result.isLost) {
        isLost = true;
        setTimeout(() => alert('Peli hävitty. Kaikki kuninkaat paljastettiin liian aikaisin. 😔'), 100);
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

<div class="clock-game">
  <div class="game-header">
    <button on:click={initGame} class="new-game-btn">
      {gameStarted ? 'Uusi peli' : 'Aloita peli'}
    </button>
  </div>

  <div class="game-area">
    <div class="clock-container" style="position: relative; width: 500px; height: 500px; margin: 2rem auto;">
      <!-- Clock face piles (12 positions) -->
      {#each clockPositions as pos, i}
        {@const position = getClockPosition(i)}
        {@const pile = state.piles[i]}
        {@const hasRevealedCard = pile.length > 0 && pile[pile.length - 1].faceUp}
        {@const rotation = i * 30}
        
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div 
          class="clock-pile"
          on:click={() => handlePileClick(i)}
          on:dragover={handleDragOver}
          on:drop={(e) => handleDrop(e, i)}
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
              on:dragstart={(e) => handleDragStart(e, i)}
              on:dragend={handleDragEnd}
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
      {#if state.piles[12]}
        {@const centerPile = state.piles[12]}
        {@const hasRevealedCard = centerPile.length > 0 && centerPile[centerPile.length - 1].faceUp}
        
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div 
          class="clock-pile center-pile"
          on:click={() => handlePileClick(12)}
          on:dragover={handleDragOver}
          on:drop={(e) => handleDrop(e, 12)}
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
              on:dragstart={(e) => handleDragStart(e, 12)}
              on:dragend={handleDragEnd}
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

  /* Clock-specific overrides */
  .game-header {
    margin-bottom: 1rem;
  }

  .game-area {
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
