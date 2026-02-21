<script lang="ts">
  let { checked = $bindable(), label = "Laskurit" }: { checked: boolean; label?: string } = $props();
</script>

<div class="counter-toggle-container">
  <span class="toggle-label">{label}</span>
  <div class="counter-toggle">
    <button 
      type="button"
      class="counter-option" 
      class:active={!checked}
      onclick={() => checked = false}
    >
      Pois
    </button>
    <button 
      type="button"
      class="counter-option" 
      class:active={checked}
      onclick={() => checked = true}
    >
      Päällä
    </button>
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

  .counter-toggle {
    display: flex;
    gap: 0.25rem;
    background: #e0e0e0;
    padding: 2px;
    border-radius: 6px;
  }

  .counter-option {
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

  .counter-option:hover {
    background: rgba(76, 175, 80, 0.1);
  }

  .counter-option.active {
    background: #4CAF50;
    color: white;
  }
</style>
