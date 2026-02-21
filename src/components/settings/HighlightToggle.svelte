<script lang="ts">
  let { checked = $bindable(), label = "Korostus" }: { checked: boolean; label?: string } = $props();
</script>

<label class="highlight-toggle">
  <input type="checkbox" bind:checked />
  {label}
</label>

<style>
  .highlight-toggle {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.9rem;
    color: #2c3e50;
    cursor: pointer;
  }

  .highlight-toggle input[type="checkbox"] {
    cursor: pointer;
    width: 16px;
    height: 16px;
  }
</style>
