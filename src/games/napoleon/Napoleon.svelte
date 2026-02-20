<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { createDeck, shuffleDeck } from '../../lib/cardUtils';
  import type { Card } from '../../types/game';
  import CardComponent from '../../components/CardComponent.svelte';
  import GameHeader from '../../components/GameHeader.svelte';
  import GameOverOverlay from '../../components/GameOverOverlay.svelte';
  import PauseOverlay from '../../components/PauseOverlay.svelte';
  import HelpOverlay from '../../components/HelpOverlay.svelte';
  import RecycleToggle from '../../components/settings/RecycleToggle.svelte';
  import CounterToggle from '../../components/settings/CounterToggle.svelte';
  import { 
    canMoveToCenter, 
    canMoveToCorner,
    canMoveToHelper,
    canMoveToSixPile,
    tryAutoPlace,
    isGameWon,
    isGameLost,
    countCycles,
    type NapoleonState 
  } from './napoleonRules';
  import { allowDrop } from '../../lib/dragUtils';
  import { napoleonInstructions } from '../../lib/gameInstructions';
  import '../../styles/shared.css';

  let gameState: NapoleonState = $state({
    center: [],
    corners: [[], [], [], []],
    helpers: [null, null, null, null],
    sixPile: [],
    stock: [],
    waste: []
  });
  let moves = $state(0);
  let isWon = $state(false);
  let isLost = $state(false);
  let recycleCount = $state(0);
  let maxRecycles: 1 | 2 | 'unlimited' = $state(1); // Setting for next game
  let activeMaxRecycles: 1 | 2 | 'unlimited' = $state(1); // Locked for current game
  let showCounters = $state(false); // Toggle for counter badges
  let history: { gameState: NapoleonState; recycleCount: number; moves: number }[] = $state([]);
  let draggedFromWaste = $state(false);
  let draggedFromHelper: number | null = $state(null);
  let draggedFromSixPile = $state(false);
  let dragOverTarget: string | null = $state(null);
  let startTime = $state<number>(0);
  let elapsedTime = $state<number>(0);
  let displayTime = $state<number>(0); // For live timer display
  let isPaused = $state<boolean>(false);
  let pauseStartTime = $state<number>(0);
  let isHelpVisible = $state<boolean>(false);

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
    
    startTime = 0;
    elapsedTime = 0;
    displayTime = 0;
    
    activeMaxRecycles = maxRecycles; // Lock in the setting
    
    gameState = {
      center: [],
      corners: [[], [], [], []],
      helpers: [null, null, null, null],
      sixPile: [],
      stock: deck.map(card => ({ ...card, faceUp: false })),
      waste: []
    };
    
    moves = 0;
    isWon = false;
    isLost = false;
    recycleCount = 0;
    history = [];
  }

  function saveState() {
    history = [...history, {
      gameState: JSON.parse(JSON.stringify(gameState)),
      recycleCount,
      moves
    }];
  }

  function undo() {
    if (history.length === 0 || isWon) return;
    const previous = history[history.length - 1];
    gameState = JSON.parse(JSON.stringify(previous.gameState));
    recycleCount = previous.recycleCount;
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

  function toggleHelp() {
    isHelpVisible = !isHelpVisible;
  }

  function drawCard() {
    if (isPaused) return;
    
    // Start timer on first action
    if (startTime === 0) {
      startTime = Date.now();
    }
    
    // If stock is empty, recycle waste back to stock
    if (gameState.stock.length === 0) {
      if (gameState.waste.length === 0) return; // Nothing to recycle
      if (activeMaxRecycles !== 'unlimited' && recycleCount >= activeMaxRecycles - 1) return; // Max recycles reached
      
      saveState();
      // Move all waste cards back to stock (face down)
      const newStock = [...gameState.waste.reverse()].map(card => ({ ...card, faceUp: false }));
      
      gameState = {
        ...gameState,
        stock: newStock,
        waste: []
      };
      recycleCount++;
      return;
    }
    
    saveState();
    // Normal draw: take one card from stock to waste
    const newStock = [...gameState.stock];
    const card = newStock.pop()!;
    card.faceUp = true;
    
    gameState = {
      ...gameState,
      stock: newStock,
      waste: [...gameState.waste, card]
    };
    
    // Check for game over after drawing
    checkWin();
  }

  function placeWasteCard(target: 'center' | 'corner' | 'helper' | 'sixPile', index?: number) {
    if (isPaused) return;
    if (gameState.waste.length === 0) return;
    
    // Start timer on first action
    if (startTime === 0) {
      startTime = Date.now();
    }
    
    const card = gameState.waste[gameState.waste.length - 1];
    let newState = null;
    
    // Start timer on first action
    if (startTime === 0) {
      startTime = Date.now();
    }
    
    if (target === 'center' && canMoveToCenter(card, gameState.center)) {
      saveState();
      const newWaste = [...gameState.waste];
      newWaste.pop();
      newState = {
        ...gameState,
        center: [...gameState.center, card],
        waste: newWaste
      };
    } else if (target === 'corner' && index !== undefined && canMoveToCorner(card, gameState.corners[index])) {
      saveState();
      const newWaste = [...gameState.waste];
      newWaste.pop();
      const newCorners = gameState.corners.map((c: Card[], i: number) => i === index ? [...c, card] : [...c]);
      newState = {
        ...gameState,
        corners: newCorners,
        waste: newWaste
      };
    } else if (target === 'helper' && index !== undefined && canMoveToHelper(gameState.helpers[index])) {
      saveState();
      const newWaste = [...gameState.waste];
      newWaste.pop();
      const newHelpers = [...gameState.helpers];
      newHelpers[index] = card;
      newState = {
        ...gameState,
        helpers: newHelpers,
        waste: newWaste
      };
    } else if (target === 'sixPile' && canMoveToSixPile(card)) {
      saveState();
      const newWaste = [...gameState.waste];
      newWaste.pop();
      newState = {
        ...gameState,
        sixPile: [...gameState.sixPile, card],
        waste: newWaste
      };
    }
    
    if (newState) {
      gameState = newState;
      moves++;
      checkWin();
    }
  }

  function placeCurrentCard(target: 'center' | 'corner' | 'helper' | 'sixPile', index?: number) {
    // Alias for placeWasteCard
    placeWasteCard(target, index);
  }

  function moveFromHelper(helperIndex: number) {
    const card = gameState.helpers[helperIndex];
    if (!card) return;
    
    // Try to place automatically
    const result = tryAutoPlace(gameState, card);
    if (result.success && result.newState) {
      saveState();
      // Clear the source helper pile in the new state
      const newHelpers = [...result.newState.helpers];
      newHelpers[helperIndex] = null;
      gameState = {
        ...result.newState,
        helpers: newHelpers
      };
      moves++;
      checkWin();
    }
  }

  function placeHelperCard(target: 'center' | 'corner' | 'sixPile', index?: number) {
    // Not used anymore - kept for compatibility
  }

  function moveFromSixPile() {
    if (gameState.sixPile.length === 0) return;
    const card = gameState.sixPile[gameState.sixPile.length - 1];
    
    // Only try to move to center (6s should primarily go to center)
    if (canMoveToCenter(card, gameState.center)) {
      saveState();
      const newSixPile = [...gameState.sixPile];
      newSixPile.pop();
      gameState = {
        ...gameState,
        center: [...gameState.center, card],
        sixPile: newSixPile
      };
      moves++;
      checkWin();
    }
  }

  function tryAutoPlaceCard() {
    if (gameState.waste.length === 0) return;
    
    const card = gameState.waste[gameState.waste.length - 1];
    const result = tryAutoPlace(gameState, card);
    if (result.success && result.newState) {
      saveState();
      const newWaste = [...gameState.waste];
      newWaste.pop();
      gameState = {
        ...result.newState,
        waste: newWaste
      };
      moves++;
      checkWin();
    }
  }

  function checkWin() {
    isWon = isGameWon(gameState);
    isLost = !isWon && isGameLost(gameState, recycleCount, activeMaxRecycles);
    
    if (isWon) {
      elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    } else if (isLost) {
      elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    }
  }

  function handleDragStart(e: DragEvent, source: 'waste' | 'helper' | 'sixPile' = 'waste', helperIndex?: number) {
    if (isPaused) return;
    if (source === 'waste' && gameState.waste.length === 0) return;
    if (source === 'helper' && (helperIndex === undefined || !gameState.helpers[helperIndex])) return;
    if (source === 'sixPile' && gameState.sixPile.length === 0) return;
    
    if (source === 'waste') {
      draggedFromWaste = true;
    } else if (source === 'helper' && helperIndex !== undefined) {
      draggedFromHelper = helperIndex;
    } else if (source === 'sixPile') {
      draggedFromSixPile = true;
    }
    
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', source);
    }
  }

  function handleDragEnd() {
    draggedFromWaste = false;
    draggedFromHelper = null;
    draggedFromSixPile = false;
    dragOverTarget = null;
  }

  function handleDragOver(e: DragEvent, target: string) {
    if (!draggedFromWaste && draggedFromHelper === null && !draggedFromSixPile) return;
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    dragOverTarget = target;
  }

  function handleDragLeave() {
    dragOverTarget = null;
  }

  function handleDrop(e: DragEvent, target: 'center' | 'corner' | 'helper' | 'sixPile', index?: number) {
    if (isPaused) return;
    e.preventDefault();
    dragOverTarget = null;
    
    if (draggedFromWaste && gameState.waste.length > 0) {
      const card = gameState.waste[gameState.waste.length - 1];
      let newState = null;
      
      if (target === 'center' && canMoveToCenter(card, gameState.center)) {
        const newWaste = [...gameState.waste];
        newWaste.pop();
        newState = {
          ...gameState,
          center: [...gameState.center, card],
          waste: newWaste
        };
      } else if (target === 'corner' && index !== undefined && canMoveToCorner(card, gameState.corners[index])) {
        const newWaste = [...gameState.waste];
        newWaste.pop();
        const newCorners = gameState.corners.map((c: Card[], i: number) => i === index ? [...c, card] : [...c]);
        newState = {
          ...gameState,
          corners: newCorners,
          waste: newWaste
        };
      } else if (target === 'helper' && index !== undefined && canMoveToHelper(gameState.helpers[index])) {
        const newWaste = [...gameState.waste];
        newWaste.pop();
        const newHelpers = [...gameState.helpers];
        newHelpers[index] = card;
        newState = {
          ...gameState,
          helpers: newHelpers,
          waste: newWaste
        };
      } else if (target === 'sixPile' && canMoveToSixPile(card)) {
        const newWaste = [...gameState.waste];
        newWaste.pop();
        newState = {
          ...gameState,
          sixPile: [...gameState.sixPile, card],
          waste: newWaste
        };
      }
      
      if (newState) {
        gameState = newState;
        moves++;
        checkWin();
      }
      draggedFromWaste = false;
    } else if (draggedFromHelper !== null && gameState.helpers[draggedFromHelper]) {
      const card = gameState.helpers[draggedFromHelper];
      if (!card) return; // Type guard
      let newState = null;
      
      if (target === 'center' && canMoveToCenter(card, gameState.center)) {
        const newHelpers = [...gameState.helpers];
        newHelpers[draggedFromHelper] = null;
        newState = {
          ...gameState,
          center: [...gameState.center, card],
          helpers: newHelpers
        };
      } else if (target === 'corner' && index !== undefined && canMoveToCorner(card, gameState.corners[index])) {
        const newHelpers = [...gameState.helpers];
        newHelpers[draggedFromHelper] = null;
        const newCorners = gameState.corners.map((c: Card[], i: number) => i === index ? [...c, card] : [...c]);
        newState = {
          ...gameState,
          corners: newCorners,
          helpers: newHelpers
        };
      } else if (target === 'sixPile' && canMoveToSixPile(card)) {
        const newHelpers = [...gameState.helpers];
        newHelpers[draggedFromHelper] = null;
        newState = {
          ...gameState,
          sixPile: [...gameState.sixPile, card],
          helpers: newHelpers
        };
      }
      
      if (newState) {
        gameState = newState;
        moves++;
        checkWin();
      }
      draggedFromHelper = null;
    } else if (draggedFromSixPile && gameState.sixPile.length > 0) {
      const card = gameState.sixPile[gameState.sixPile.length - 1];
      let newState = null;
      
      if (target === 'center' && canMoveToCenter(card, gameState.center)) {
        const newSixPile = [...gameState.sixPile];
        newSixPile.pop();
        newState = {
          ...gameState,
          center: [...gameState.center, card],
          sixPile: newSixPile
        };
      } else if (target === 'corner' && index !== undefined && canMoveToCorner(card, gameState.corners[index])) {
        const newSixPile = [...gameState.sixPile];
        newSixPile.pop();
        const newCorners = gameState.corners.map((c: Card[], i: number) => i === index ? [...c, card] : [...c]);
        newState = {
          ...gameState,
          corners: newCorners,
          sixPile: newSixPile
        };
      }
      
      if (newState) {
        gameState = newState;
        moves++;
        checkWin();
      }
      draggedFromSixPile = false;
    }
  }

  initGame();
</script>

<svelte:window onkeydown={(e) => {
  if ((e.key === '?' || e.key === 'F1') && !isHelpVisible) {
    e.preventDefault();
    toggleHelp();
  }
}} />

<div class="napoleon">
  <GameHeader
    {undoDisabled}
    restartDisabled={true}
    hintDisabled={true}
    elapsedTime={displayTime}
    {isPaused}
    gameStarted={startTime > 0}
    gameEnded={isWon || isLost}
    onNewGame={initGame}
    onUndo={undo}
    onPause={togglePause}
    onHelp={toggleHelp}
  >
    {#snippet settings()}
      <RecycleToggle bind:value={maxRecycles} options={[1, 2, 'unlimited']} />
      <CounterToggle bind:checked={showCounters} />
    {/snippet}
  </GameHeader>

  <div class="game-area">
    <HelpOverlay isVisible={isHelpVisible} instruction={napoleonInstructions} onClose={toggleHelp} />
    <PauseOverlay {isPaused} onResume={togglePause} />
    <GameOverOverlay {isWon} {isLost} {moves} {elapsedTime} />
    
    <div class="play-field">
      <!-- Row 1: Top corner + Top helper + Top corner -->
      <div class="row row-1">
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="corner-slot {dragOverTarget === 'corner-0' ? 'drag-over' : ''}" 
           ondragover={(e) => handleDragOver(e, 'corner-0')}
           ondragleave={handleDragLeave}
           ondrop={(e) => handleDrop(e, 'corner', 0)}>
        {#if gameState.corners[0].length > 0}
          {#if gameState.corners[0].length > 2}
            <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
          {/if}
          {#if gameState.corners[0].length > 1}
            <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
          {/if}
          <div style="position: relative; z-index: 2;">
            <CardComponent card={gameState.corners[0][gameState.corners[0].length - 1]} />
          </div>
        {:else}
          <div class="empty-pile">7</div>
        {/if}
      </div>

      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="helper-slot {dragOverTarget === 'helper-0' ? 'drag-over' : ''}" 
           ondragover={(e) => handleDragOver(e, 'helper-0')}
           ondragleave={handleDragLeave}
           ondrop={(e) => handleDrop(e, 'helper', 0)}>
        {#if gameState.helpers[0]}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <div class="helper-card-wrapper" 
               draggable="true"
               ondragstart={(e) => handleDragStart(e, 'helper', 0)}
               ondragend={handleDragEnd}
               onclick={() => moveFromHelper(0)}>
            <CardComponent card={gameState.helpers[0]} />
          </div>
        {:else}
          <div class="empty-pile small"></div>
        {/if}
      </div>

      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="corner-slot {dragOverTarget === 'corner-1' ? 'drag-over' : ''}" 
           ondragover={(e) => handleDragOver(e, 'corner-1')}
           ondragleave={handleDragLeave}
           ondrop={(e) => handleDrop(e, 'corner', 1)}>
        {#if gameState.corners[1].length > 0}
          {#if gameState.corners[1].length > 2}
            <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
          {/if}
          {#if gameState.corners[1].length > 1}
            <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
          {/if}
          <div style="position: relative; z-index: 2;">
            <CardComponent card={gameState.corners[1][gameState.corners[1].length - 1]} />
          </div>
        {:else}
          <div class="empty-pile">7</div>
        {/if}
      </div>
    </div>

    <!-- Row 2: Left helper + Center tomb + Right helper -->
    <div class="row row-2">
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="helper-slot {dragOverTarget === 'helper-1' ? 'drag-over' : ''}" 
           ondragover={(e) => handleDragOver(e, 'helper-1')}
           ondragleave={handleDragLeave}
           ondrop={(e) => handleDrop(e, 'helper', 1)}>
        {#if gameState.helpers[1]}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <div class="helper-card-wrapper" 
               draggable="true"
               ondragstart={(e) => handleDragStart(e, 'helper', 1)}
               ondragend={handleDragEnd}
               onclick={() => moveFromHelper(1)}>
            <CardComponent card={gameState.helpers[1]} />
          </div>
        {:else}
          <div class="empty-pile small"></div>
        {/if}
      </div>

      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="center-slot {dragOverTarget === 'center' ? 'drag-over' : ''}" 
           ondragover={(e) => handleDragOver(e, 'center')}
           ondragleave={handleDragLeave}
           ondrop={(e) => handleDrop(e, 'center')}>
        {#if gameState.center.length > 0}
          {#if gameState.center.length > 2}
            <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
          {/if}
          {#if gameState.center.length > 1}
            <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
          {/if}
          <div style="position: relative; z-index: 2;">
            <CardComponent card={gameState.center[gameState.center.length - 1]} />
          </div>
          {#if showCounters}
            <div class="cycle-count">{countCycles(gameState.center)}</div>
          {/if}
        {:else}
          <div class="empty-pile">6</div>
        {/if}
      </div>

      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="helper-slot {dragOverTarget === 'helper-2' ? 'drag-over' : ''}" 
           ondragover={(e) => handleDragOver(e, 'helper-2')}
           ondragleave={handleDragLeave}
           ondrop={(e) => handleDrop(e, 'helper', 2)}>
        {#if gameState.helpers[2]}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <div class="helper-card-wrapper" 
               draggable="true"
               ondragstart={(e) => handleDragStart(e, 'helper', 2)}
               ondragend={handleDragEnd}
               onclick={() => moveFromHelper(2)}>
            <CardComponent card={gameState.helpers[2]} />
          </div>
        {:else}
          <div class="empty-pile small"></div>
        {/if}
      </div>
    </div>

    <!-- Row 3: Bottom corner + Bottom helper + Bottom corner -->
    <div class="row row-3">
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="corner-slot {dragOverTarget === 'corner-2' ? 'drag-over' : ''}" 
           ondragover={(e) => handleDragOver(e, 'corner-2')}
           ondragleave={handleDragLeave}
           ondrop={(e) => handleDrop(e, 'corner', 2)}>
        {#if gameState.corners[2].length > 0}
          {#if gameState.corners[2].length > 2}
            <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
          {/if}
          {#if gameState.corners[2].length > 1}
            <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
          {/if}
          <div style="position: relative; z-index: 2;">
            <CardComponent card={gameState.corners[2][gameState.corners[2].length - 1]} />
          </div>
        {:else}
          <div class="empty-pile">7</div>
        {/if}
      </div>

      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="helper-slot {dragOverTarget === 'helper-3' ? 'drag-over' : ''}" 
           ondragover={(e) => handleDragOver(e, 'helper-3')}
           ondragleave={handleDragLeave}
           ondrop={(e) => handleDrop(e, 'helper', 3)}>
        {#if gameState.helpers[3]}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <div class="helper-card-wrapper" 
               draggable="true"
               ondragstart={(e) => handleDragStart(e, 'helper', 3)}
               ondragend={handleDragEnd}
               onclick={() => moveFromHelper(3)}>
            <CardComponent card={gameState.helpers[3]} />
          </div>
        {:else}
          <div class="empty-pile small"></div>
        {/if}
      </div>

      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="corner-slot {dragOverTarget === 'corner-3' ? 'drag-over' : ''}" 
           ondragover={(e) => handleDragOver(e, 'corner-3')}
           ondragleave={handleDragLeave}
           ondrop={(e) => handleDrop(e, 'corner', 3)}>
        {#if gameState.corners[3].length > 0}
          {#if gameState.corners[3].length > 2}
            <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
          {/if}
          {#if gameState.corners[3].length > 1}
            <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
          {/if}
          <div style="position: relative; z-index: 2;">
            <CardComponent card={gameState.corners[3][gameState.corners[3].length - 1]} />
          </div>
        {:else}
          <div class="empty-pile">7</div>
        {/if}
      </div>
    </div>
    </div>

    <!-- Controls (right side) -->
    <div class="controls">
      <!-- Kutosvarasto ylimpänä -->
      <div class="control-group">
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="pile-wrapper {dragOverTarget === 'sixPile' ? 'drag-over' : ''}" 
             ondragover={(e) => handleDragOver(e, 'sixPile')}
             ondragleave={handleDragLeave}
             ondrop={(e) => handleDrop(e, 'sixPile')}>
        {#if gameState.sixPile.length > 0}
          {#if gameState.sixPile.length > 2}
            <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
          {/if}
          {#if gameState.sixPile.length > 1}
            <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
          {/if}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <div class="sixpile-card-wrapper" 
               draggable="true"
               ondragstart={(e) => handleDragStart(e, 'sixPile')}
               ondragend={handleDragEnd}
               onclick={moveFromSixPile}
               style="position: relative; z-index: 2;">
            <CardComponent card={gameState.sixPile[gameState.sixPile.length - 1]} />
          </div>
        {:else}
          <div class="empty-pile">6★</div>
        {/if}
      </div>
    </div>

    <!-- Kääntöpakka keskellä -->
    <div class="control-group">
      <div class="current-card-slot">
        {#if gameState.waste.length > 0}
          {#if gameState.waste.length > 2}
            <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
          {/if}
          {#if gameState.waste.length > 1}
            <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
          {/if}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <div class="current-card-wrapper" 
               draggable="true"
               ondragstart={handleDragStart}
               ondragend={handleDragEnd}
               onclick={tryAutoPlaceCard}
               style="position: relative; z-index: 2;">
            <CardComponent card={gameState.waste[gameState.waste.length - 1]} />
            {#if showCounters}
              <div class="waste-count">{gameState.waste.length}</div>
            {/if}
          </div>
        {:else}
          <div class="empty-pile"></div>
        {/if}
      </div>
    </div>

    <!-- Jakopakka alimpana -->
    <div class="control-group">
      <button class="stock-btn" 
                aria-label="{gameState.stock.length > 0 ? 'Nosta kortti jakopakasta' : gameState.waste.length > 0 && (activeMaxRecycles === 'unlimited' || recycleCount < activeMaxRecycles - 1) ? 'Kierrätä kääntöpakka takaisin' : 'Jakopakka tyhjä'}"
                onclick={drawCard} 
                disabled={gameState.stock.length === 0 && (gameState.waste.length === 0 || (activeMaxRecycles !== 'unlimited' && recycleCount >= activeMaxRecycles - 1))}>
        {#if gameState.stock.length > 0}
          {#if gameState.stock.length > 2}
            <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
          {/if}
          {#if gameState.stock.length > 1}
            <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
          {/if}
          <div style="position: relative; z-index: 2;">
            <CardComponent card={gameState.stock[gameState.stock.length - 1]} />
          </div>
          {#if showCounters}
            <div class="stock-count">{gameState.stock.length}</div>
          {/if}
        {:else if gameState.waste.length > 0 && (activeMaxRecycles === 'unlimited' || recycleCount < activeMaxRecycles - 1)}
          <div class="empty-pile recycle">↻</div>
        {:else}
          <div class="empty-pile game-over">✕</div>
        {/if}
      </button>
      {#if activeMaxRecycles !== 'unlimited'}
        <div class="draw-count">{recycleCount + 1}/{activeMaxRecycles}</div>
      {/if}
    </div>
    </div>
  </div>
</div>

<style>
  .napoleon {
    padding: 1rem;
  }

  .draw-count {
    text-align: center;
    margin-top: 0.5rem;
    font-size: 0.95rem;
    font-weight: bold;
    color: white;
  }

  .game-area {
    position: relative;
    display: flex;
    gap: 0;
    align-items: flex-start;
    min-height: 500px;
    justify-content: center;
  }

  .play-field {
    flex: 0 0 auto;
    padding-right: 5rem;
    /*border-right: 2px solid rgba(255, 255, 255, 0.2);*/
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    margin-bottom: 3rem;
  }

  /* Move corner piles closer to center row */
  .row-1 .corner-slot:first-child {
    transform: translateY(15px) rotate(-40deg);
  }

  .row-1 .corner-slot:last-child {
    transform: translateY(15px) rotate(40deg);
  }

  .row-3 .corner-slot:first-child {
    transform: translateY(-15px) rotate(40deg);
  }

  .row-3 .corner-slot:last-child {
    transform: translateY(-15px) rotate(-40deg);
  }

  .corner-slot, .helper-slot, .center-slot {
    width: 70px;
    height: 100px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stack-card {
    position: absolute;
    width: 70px;
    height: 100px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    pointer-events: none;
  }

  .pile-wrapper {
    position: relative;
  }

  .stack-card {
    position: absolute;
    width: 70px;
    height: 100px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    pointer-events: none;
  }

  .pile-wrapper {
    position: relative;
  }

  .corner-slot.drag-over, .helper-slot.drag-over, .center-slot.drag-over {
    background: rgba(76, 175, 80, 0.3);
    border-radius: 8px;
  }

  /* Napoleon-specific empty pile overrides */
  .helper-slot .empty-pile.small {
    width: 80%;
    height: 80%;
    margin: auto;
    font-size: 0.75rem;
    border-width: 1.5px;
  }

  .empty-pile.recycle {
    font-size: 2.5rem;
    color: rgba(76, 175, 80, 0.8);
    border-color: rgba(76, 175, 80, 0.6);
    cursor: pointer;
    animation: pulse 2s infinite;
  }

  .empty-pile.game-over {
    font-size: 2.5rem;
    color: rgba(244, 67, 54, 0.9);
    border-color: rgba(244, 67, 54, 0.6);
    cursor: not-allowed;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  .cycle-count {
    position: absolute;
    top: -10px;
    right: -10px;
    background: rgba(255, 215, 0, 0.95);
    color: #1a1a1a;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.9rem;
    border: 2px solid white;
    pointer-events: none;
    z-index: 10;
  }

  .stock-count, .waste-count {
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
    z-index: 10;
  }

  /* Controls section */
  .controls {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 0;
    padding-top: 0;
    padding-left: 3rem;
    margin-top: 0;
  }

  .controls .control-group:nth-child(1) {
    margin-bottom: 4rem; /* Kutosvarasto - enemmän väliä alas */
  }

  .controls .control-group:nth-child(2) {
    margin-bottom: 1.5rem; /* Kääntöpakka - vähän väliä alas */
  }

  .control-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .stock-btn, .pile-wrapper {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    width: 70px;
    height: 100px;
    position: relative;
  }

  .pile-wrapper.drag-over {
    background: rgba(76, 175, 80, 0.3);
    border-radius: 8px;
  }

  .current-card-slot {
    position: relative;
    width: 70px;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .current-card-wrapper {
    position: relative;
    cursor: grab;
    transition: transform 0.1s, box-shadow 0.2s;
  }

  .current-card-wrapper:active {
    cursor: grabbing;
  }

  .current-card-wrapper:hover {
    transform: scale(1.05);
  }

  .helper-card-wrapper {
    cursor: grab;
    transition: transform 0.1s, box-shadow 0.2s;
  }

  .helper-card-wrapper:active {
    cursor: grabbing;
  }

  .helper-card-wrapper:hover {
    transform: scale(1.05);
  }

  .sixpile-card-wrapper {
    cursor: grab;
    transition: transform 0.1s, box-shadow 0.2s;
    position: relative;
  }

  .sixpile-card-wrapper:active {
    cursor: grabbing;
  }

  .sixpile-card-wrapper:hover {
    transform: scale(1.05);
  }
</style>
