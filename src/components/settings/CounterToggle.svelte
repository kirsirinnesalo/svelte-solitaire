<script lang="ts">
  export let checked: boolean;
  export let label: string = "Laskurit";
</script>

<label class="counter-checkbox">
  <input type="checkbox" bind:checked />
  <span>{label}</span>
</label>

<style>
  .counter-checkbox {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.9rem;
    color: #2c3e50;
    cursor: pointer;
    user-select: none;
  }

  .counter-checkbox input[type="checkbox"] {
    cursor: pointer;
    width: 16px;
    height: 16px;
  }
</style>
