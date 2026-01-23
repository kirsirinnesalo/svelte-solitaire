<script lang="ts">
  export let checked: boolean;
  export let label: string = "Korostus";
</script>

<label class="highlight-toggle">
  <input type="checkbox" bind:checked />
  {label}
</label>

<style>
  .highlight-toggle {
    display: flex;
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
