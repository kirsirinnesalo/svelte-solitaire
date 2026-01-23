<script lang="ts">
  import { createDeck, shuffleDeck } from '../../lib/cardUtils';
  import type { Card } from '../../types/game';
  import CardComponent from '../../components/CardComponent.svelte';
  import GameHeader from '../../components/GameHeader.svelte';
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
  import '../../styles/shared.css';

  let state = $state<NapoleonState>({
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
  let maxRecycles = $state<1 | 2 | 'unlimited'>(1); // Setting for next game
  let activeMaxRecycles = $state<1 | 2 | 'unlimited'>(1); // Locked for current game
  let showCounters = $state(false); // Toggle for counter badges
  let history = $state<{ state: NapoleonState; recycleCount: number; moves: number }[]>([]);
  let draggedFromWaste = $state(false);
  let draggedFromHelper = $state<number | null>(null);
  let draggedFromSixPile = $state(false);
  let dragOverTarget = $state<string | null>(null);

  function initGame() {
    const deck = shuffleDeck(createDeck());
    
    activeMaxRecycles = maxRecycles; // Lock in the setting
    
    state = {
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
      state: structuredClone(state),
      recycleCount,
      moves
    }];
  }

  function undo() {
    if (history.length === 0 || isWon) return;
    const previous = history[history.length - 1];
    state = structuredClone(previous.state);
    recycleCount = previous.recycleCount;
    moves = previous.moves;
    history = history.slice(0, -1);
    isWon = false;
  }

  function drawCard() {
    // If stock is empty, recycle waste back to stock
    if (state.stock.length === 0) {
      if (state.waste.length === 0) return; // Nothing to recycle
      if (activeMaxRecycles !== 'unlimited' && recycleCount >= activeMaxRecycles - 1) return; // Max recycles reached
      
      saveState();
      // Move all waste cards back to stock (face down)
      while (state.waste.length > 0) {
        const card = state.waste.pop()!;
        card.faceUp = false;
        state.stock.push(card);
      }
      recycleCount++;
      state = state;
      return;
    }
    
    saveState();
    // Normal draw: take one card from stock to waste
    const card = state.stock.pop()!;
    card.faceUp = true;
    state.waste.push(card);
    state = state;
  }

  function placeWasteCard(target: 'center' | 'corner' | 'helper' | 'sixPile', index?: number) {
    if (state.waste.length === 0) return;
    
    const card = state.waste[state.waste.length - 1];
    let placed = false;
    
    if (target === 'center' && canMoveToCenter(card, state.center)) {
      saveState();
      state.center.push(state.waste.pop()!);
      placed = true;
    } else if (target === 'corner' && index !== undefined && canMoveToCorner(card, state.corners[index])) {
      saveState();
      state.corners[index].push(state.waste.pop()!);
      placed = true;
    } else if (target === 'helper' && index !== undefined && canMoveToHelper(state.helpers[index])) {
      saveState();
      state.helpers[index] = state.waste.pop()!;
      placed = true;
    } else if (target === 'sixPile' && canMoveToSixPile(card)) {
      saveState();
      state.sixPile.push(state.waste.pop()!);
      placed = true;
    }
    
    if (placed) {
      moves++;
      checkWin();
    }
    
    state = state;
  }

  function placeCurrentCard(target: 'center' | 'corner' | 'helper' | 'sixPile', index?: number) {
    // Alias for placeWasteCard
    placeWasteCard(target, index);
  }

  function moveFromHelper(helperIndex: number) {
    const card = state.helpers[helperIndex];
    if (!card) return;
    
    // Try to place automatically
    const result = tryAutoPlace(state, card);
    if (result.success && result.newState) {
      saveState();
      state = result.newState;
      state.helpers[helperIndex] = null;
      moves++;
      checkWin();
    }
    
    state = state;
  }

  function placeHelperCard(target: 'center' | 'corner' | 'sixPile', index?: number) {
    // Not used anymore - kept for compatibility
  }

  function moveFromSixPile() {
    if (state.sixPile.length === 0) return;
    const card = state.sixPile[state.sixPile.length - 1];
    
    // Only try to move to center (6s should primarily go to center)
    if (canMoveToCenter(card, state.center)) {
      saveState();
      state.center.push(card);
      state.sixPile.pop();
      moves++;
      checkWin();
    }
    
    state = state;
  }

  function tryAutoPlaceCard() {
    if (state.waste.length === 0) return;
    
    const card = state.waste[state.waste.length - 1];
    const result = tryAutoPlace(state, card);
    if (result.success && result.newState) {
      saveState();
      state = result.newState;
      state.waste.pop();
      moves++;
      checkWin();
    }
  }

  function checkWin() {
    isWon = isGameWon(state);
    isLost = !isWon && isGameLost(state);
    
    if (isWon) {
      setTimeout(() => alert('Napoleonin hauta on valmis! 🎉'), 100);
    } else if (isLost) {
      setTimeout(() => alert('Peli päättyi. Ei enää siirtoja. 😔'), 100);
    }
  }

  function handleDragStart(e: DragEvent, source: 'waste' | 'helper' | 'sixPile' = 'waste', helperIndex?: number) {
    if (source === 'waste' && state.waste.length === 0) return;
    if (source === 'helper' && (helperIndex === undefined || !state.helpers[helperIndex])) return;
    if (source === 'sixPile' && state.sixPile.length === 0) return;
    
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
    e.preventDefault();
    dragOverTarget = null;
    
    if (draggedFromWaste && state.waste.length > 0) {
      const card = state.waste[state.waste.length - 1];
      let placed = false;
      
      if (target === 'center' && canMoveToCenter(card, state.center)) {
        state.center.push(card);
        state.waste.pop();
        placed = true;
      } else if (target === 'corner' && index !== undefined && canMoveToCorner(card, state.corners[index])) {
        state.corners[index].push(card);
        state.waste.pop();
        placed = true;
      } else if (target === 'helper' && index !== undefined && canMoveToHelper(state.helpers[index])) {
        state.helpers[index] = card;
        state.waste.pop();
        placed = true;
      } else if (target === 'sixPile' && canMoveToSixPile(card)) {
        state.sixPile.push(card);
        state.waste.pop();
        placed = true;
      }
      
      if (placed) {
        moves++;
        checkWin();
        state = state;
      }
      draggedFromWaste = false;
    } else if (draggedFromHelper !== null && state.helpers[draggedFromHelper]) {
      const card = state.helpers[draggedFromHelper];
      if (!card) return; // Type guard
      let placed = false;
      
      if (target === 'center' && canMoveToCenter(card, state.center)) {
        state.center.push(card);
        state.helpers[draggedFromHelper] = null;
        placed = true;
      } else if (target === 'corner' && index !== undefined && canMoveToCorner(card, state.corners[index])) {
        state.corners[index].push(card);
        state.helpers[draggedFromHelper] = null;
        placed = true;
      } else if (target === 'sixPile' && canMoveToSixPile(card)) {
        state.sixPile.push(card);
        state.helpers[draggedFromHelper] = null;
        placed = true;
      }
      
      if (placed) {
        moves++;
        checkWin();
        state = state;
      }
      draggedFromHelper = null;
    } else if (draggedFromSixPile && state.sixPile.length > 0) {
      const card = state.sixPile[state.sixPile.length - 1];
      let placed = false;
      
      if (target === 'center' && canMoveToCenter(card, state.center)) {
        state.center.push(card);
        state.sixPile.pop();
        placed = true;
      } else if (target === 'corner' && index !== undefined && canMoveToCorner(card, state.corners[index])) {
        state.corners[index].push(card);
        state.sixPile.pop();
        placed = true;
      }
      
      if (placed) {
        moves++;
        checkWin();
        state = state;
      }
      draggedFromSixPile = false;
    }
  }

  initGame();
</script>

<div class="napoleon">
  <GameHeader
    undoDisabled={history.length === 0 || isWon || isLost}
    restartDisabled={true}
    hintDisabled={true}
    onNewGame={initGame}
    onUndo={undo}
  >
    {#snippet settings()}
      <RecycleToggle bind:value={maxRecycles} options={[1, 2, 'unlimited']} />
      <CounterToggle bind:checked={showCounters} />
    {/snippet}
  </GameHeader>

  <div class="game-area">
    <div class="play-field">
      <!-- Row 1: Top corner + Top helper + Top corner -->
      <div class="row row-1">
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="corner-slot {dragOverTarget === 'corner-0' ? 'drag-over' : ''}" 
           ondragover={(e) => handleDragOver(e, 'corner-0')}
           ondragleave={handleDragLeave}
           ondrop={(e) => handleDrop(e, 'corner', 0)}>
        {#if state.corners[0].length > 0}
          {#if state.corners[0].length > 2}
            <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
          {/if}
          {#if state.corners[0].length > 1}
            <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
          {/if}
          <div style="position: relative; z-index: 2;">
            <CardComponent card={state.corners[0][state.corners[0].length - 1]} />
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
        {#if state.helpers[0]}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <div class="helper-card-wrapper" 
               draggable="true"
               ondragstart={(e) => handleDragStart(e, 'helper', 0)}
               ondragend={handleDragEnd}
               onclick={() => moveFromHelper(0)}>
            <CardComponent card={state.helpers[0]} />
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
        {#if state.corners[1].length > 0}
          {#if state.corners[1].length > 2}
            <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
          {/if}
          {#if state.corners[1].length > 1}
            <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
          {/if}
          <div style="position: relative; z-index: 2;">
            <CardComponent card={state.corners[1][state.corners[1].length - 1]} />
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
        {#if state.helpers[1]}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <div class="helper-card-wrapper" 
               draggable="true"
               ondragstart={(e) => handleDragStart(e, 'helper', 1)}
               ondragend={handleDragEnd}
               onclick={() => moveFromHelper(1)}>
            <CardComponent card={state.helpers[1]} />
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
        {#if state.center.length > 0}
          {#if state.center.length > 2}
            <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
          {/if}
          {#if state.center.length > 1}
            <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
          {/if}
          <div style="position: relative; z-index: 2;">
            <CardComponent card={state.center[state.center.length - 1]} />
          </div>
          {#if showCounters}
            <div class="cycle-count">{countCycles(state.center)}</div>
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
        {#if state.helpers[2]}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <div class="helper-card-wrapper" 
               draggable="true"
               ondragstart={(e) => handleDragStart(e, 'helper', 2)}
               ondragend={handleDragEnd}
               onclick={() => moveFromHelper(2)}>
            <CardComponent card={state.helpers[2]} />
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
        {#if state.corners[2].length > 0}
          {#if state.corners[2].length > 2}
            <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
          {/if}
          {#if state.corners[2].length > 1}
            <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
          {/if}
          <div style="position: relative; z-index: 2;">
            <CardComponent card={state.corners[2][state.corners[2].length - 1]} />
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
        {#if state.helpers[3]}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <div class="helper-card-wrapper" 
               draggable="true"
               ondragstart={(e) => handleDragStart(e, 'helper', 3)}
               ondragend={handleDragEnd}
               onclick={() => moveFromHelper(3)}>
            <CardComponent card={state.helpers[3]} />
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
        {#if state.corners[3].length > 0}
          {#if state.corners[3].length > 2}
            <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
          {/if}
          {#if state.corners[3].length > 1}
            <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
          {/if}
          <div style="position: relative; z-index: 2;">
            <CardComponent card={state.corners[3][state.corners[3].length - 1]} />
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
        {#if state.sixPile.length > 0}
          {#if state.sixPile.length > 2}
            <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
          {/if}
          {#if state.sixPile.length > 1}
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
            <CardComponent card={state.sixPile[state.sixPile.length - 1]} />
          </div>
        {:else}
          <div class="empty-pile">6★</div>
        {/if}
      </div>
    </div>

    <!-- Kääntöpakka keskellä -->
    <div class="control-group">
      <div class="current-card-slot">
        {#if state.waste.length > 0}
          {#if state.waste.length > 2}
            <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
          {/if}
          {#if state.waste.length > 1}
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
            <CardComponent card={state.waste[state.waste.length - 1]} />
            {#if showCounters}
              <div class="waste-count">{state.waste.length}</div>
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
                aria-label="{state.stock.length > 0 ? 'Nosta kortti jakopakasta' : state.waste.length > 0 && (activeMaxRecycles === 'unlimited' || recycleCount < activeMaxRecycles - 1) ? 'Kierrätä kääntöpakka takaisin' : 'Jakopakka tyhjä'}"
                onclick={drawCard} 
                disabled={state.stock.length === 0 && (state.waste.length === 0 || (activeMaxRecycles !== 'unlimited' && recycleCount >= activeMaxRecycles - 1))}>
        {#if state.stock.length > 0}
          {#if state.stock.length > 2}
            <div class="stack-card" style="top: 4px; left: -2px; z-index: 0;"></div>
          {/if}
          {#if state.stock.length > 1}
            <div class="stack-card" style="top: 2px; left: -1px; z-index: 1;"></div>
          {/if}
          <div style="position: relative; z-index: 2;">
            <CardComponent card={state.stock[state.stock.length - 1]} />
          </div>
          {#if showCounters}
            <div class="stock-count">{state.stock.length}</div>
          {/if}
        {:else if state.waste.length > 0 && (activeMaxRecycles === 'unlimited' || recycleCount < activeMaxRecycles - 1)}
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
