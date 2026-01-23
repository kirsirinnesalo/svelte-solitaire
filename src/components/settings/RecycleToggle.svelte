<script lang="ts">
  let { value = $bindable(), options = [1, 2, 3, 'unlimited'] }: { 
    value: 1 | 2 | 3 | 'unlimited'; 
    options?: (1 | 2 | 3 | 'unlimited')[] 
  } = $props();
  
  function getLabel(option: typeof value): string {
    return option === 'unlimited' ? '∞' : String(option);
  }
</script>

<div class="recycle-toggle-container">
  <span class="toggle-label">Jakoja:</span>
  <div class="recycle-toggle">
    {#each options as option}
      <button 
        class="recycle-option" 
        class:active={value === option}
        onclick={() => value = option}
      >
        {getLabel(option)}
      </button>
    {/each}
  </div>
</div>

<style>
  .recycle-toggle-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .toggle-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #2c3e50;
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
</style>
