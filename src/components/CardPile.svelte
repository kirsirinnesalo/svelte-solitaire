<script lang="ts">
  import CardComponent from './CardComponent.svelte';
  import type { Card } from '../types/game';

  export let cards: Card[] = [];
  export let label: string = '';
  export let emptyLabel: string = '';
  export let onClick: (() => void) | undefined = undefined;
  export let onDragStart: ((event: DragEvent) => void) | undefined = undefined;
  export let onDragOver: ((event: DragEvent) => void) | undefined = undefined;
  export let onDrop: ((event: DragEvent) => void) | undefined = undefined;
  export let showStack: boolean = true;
  export let stackDepth: number = 3; // How many stack layers to show
  export let draggable: boolean = false;
  export let additionalClass: string = '';
  
  $: topCard = cards.length > 0 ? cards[cards.length - 1] : null;
  $: hasCards = cards.length > 0;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="card-pile {additionalClass}"
  on:click={onClick}
  on:dragover={onDragOver}
  on:drop={onDrop}
>
  {#if hasCards && topCard}
    {#if showStack && cards.length > stackDepth}
      <div class="stack-card" style="top: 6px; left: -3px; z-index: 0;"></div>
    {/if}
    {#if showStack && cards.length > 2}
      <div class="stack-card" style="top: 4px; left: -2px; z-index: 1;"></div>
    {/if}
    {#if showStack && cards.length > 1}
      <div class="stack-card" style="top: 2px; left: -1px; z-index: 2;"></div>
    {/if}
    <div
      class="top-card"
      style="position: relative; z-index: 3;"
      draggable={draggable}
      on:dragstart={onDragStart}
    >
      <CardComponent card={topCard} />
    </div>
  {:else}
    <div class="empty-pile">
      {#if emptyLabel}
        {emptyLabel}
      {:else if label}
        <span class="pile-label">{label}</span>
      {/if}
    </div>
  {/if}
</div>

<style>
  .card-pile {
    position: relative;
    width: 70px;
    height: 100px;
  }

  .top-card[draggable='true'] {
    cursor: grab;
  }

  .top-card[draggable='true']:active {
    cursor: grabbing;
  }

  .pile-label {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.6);
  }
</style>
