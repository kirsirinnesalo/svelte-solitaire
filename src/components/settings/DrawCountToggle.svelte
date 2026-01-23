<script lang="ts">
  export let value: 1 | 3;
  export let label: string = "Nosta";
</script>

<div class="draw-toggle-container">
  <span class="toggle-label">{label}</span>
  <div class="toggle-slider" class:three={value === 3}>
    <div class="slider-track">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="slider-option" on:click={() => value = 1} role="button" tabindex="0">
        <span class="slider-label">1</span>
      </div>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="slider-option" on:click={() => value = 3} role="button" tabindex="0">
        <span class="slider-label">3</span>
      </div>
      <div class="slider-thumb"></div>
    </div>
  </div>
</div>

<style>
  .draw-toggle-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
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
</style>
