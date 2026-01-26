<script lang="ts">
  interface Props {
    isPaused: boolean;
    onResume: () => void;
  }

  let { isPaused, onResume }: Props = $props();
</script>

{#if isPaused}
  <div class="pause-overlay">
    <div class="pause-message">
      <div class="pause-icon">⏸</div>
      <div>Peli tauolla</div>
      <button class="resume-btn" onclick={onResume}>▶ Jatka</button>
    </div>
  </div>
{/if}

<style>
  .pause-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    border-radius: 8px;
  }

  .pause-message {
    text-align: center;
    color: white;
    font-size: 2rem;
    font-weight: bold;
  }

  .pause-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .resume-btn {
    margin-top: 2rem;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .resume-btn:hover {
    background: #45a049;
  }
</style>
