<script lang="ts">
  let { checked = $bindable(), label = "Laskurit" }: { checked: boolean; label?: string } = $props();
</script>

<div class="counter-toggle-container">
  <span class="toggle-label">{label}</span>
  <div class="toggle-slider" class:on={checked}>
    <div class="slider-track">
      <button 
        type="button"
        class="slider-option" 
        onclick={() => checked = false}
      >
        <span class="slider-label">✕</span>
      </button>
      <button 
        type="button"
        class="slider-option" 
        onclick={() => checked = true}
      >
        <span class="slider-label">✓</span>
      </button>
      <div class="slider-thumb"></div>
    </div>
  </div>
</div>

<style>
  .counter-toggle-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
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

  .toggle-slider.on .slider-option:first-child .slider-label {
    color: #666;
  }

  .toggle-slider:not(.on) .slider-option:first-child .slider-label,
  .toggle-slider.on .slider-option:last-child .slider-label {
    color: white;
  }

  .slider-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: calc(50% - 2px);
    height: calc(100% - 4px);
    background: #b0b0b0;
    border-radius: 14px;
    transition: transform 0.3s ease, background 0.3s ease;
    z-index: 1;
  }

  .toggle-slider.on .slider-thumb {
    transform: translateX(100%);
    background: #4CAF50;
  }
</style>
