<script lang="ts">
  let {
    isOpen = false,
    isWon = false,
    moves = 0,
    elapsedTime = 0,
    onNewGame,
    onClose
  }: {
    isOpen: boolean;
    isWon: boolean;
    moves: number;
    elapsedTime?: number;
    onNewGame: () => void;
    onClose: () => void;
  } = $props();
  
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
</script>

{#if isOpen}
  <div class="modal-overlay" 
       onclick={onClose}
       onkeydown={(e) => e.key === 'Escape' && onClose()}
       role="button"
       tabindex="-1"
       aria-label="Sulje dialogi">
    <div class="modal-content" 
         onclick={(e) => e.stopPropagation()}
         onkeydown={(e) => e.stopPropagation()}
         role="dialog"
         aria-modal="true"
         aria-labelledby="modal-title"
         tabindex="0">
      <div class="modal-header">
        <h2 id="modal-title" class="modal-title">
          {isWon ? '🎉 Onneksi olkoon!' : '😔 Peli päättyi'}
        </h2>
      </div>
      
      <div class="modal-body">
        <p class="result-message">
          {#if isWon}
            Voitit pelin!
          {:else}
            Ei enää mahdollisia siirtoja.
          {/if}
        </p>
        
        <div class="stats">
          <div class="stat-item">
            <span class="stat-label">Siirtoja:</span>
            <span class="stat-value">{moves}</span>
          </div>
          {#if elapsedTime !== undefined && elapsedTime > 0}
          <div class="stat-item">
            <span class="stat-label">Aika:</span>
            <span class="stat-value">{formatTime(elapsedTime)}</span>
          </div>
          {/if}
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick={onClose}>
          Sulje
        </button>
        <button class="btn btn-primary" onclick={onNewGame}>
          Uusi peli
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal-content {
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    min-width: 320px;
    max-width: 480px;
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-header {
    padding: 1.5rem 2rem 1rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .modal-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
    text-align: center;
  }

  .modal-body {
    padding: 2rem;
  }

  .result-message {
    text-align: center;
    font-size: 1.1rem;
    color: #555;
    margin: 0 0 1.5rem 0;
  }

  .stats {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stat-label {
    font-weight: 600;
    color: #666;
  }

  .stat-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #4CAF50;
  }

  .modal-footer {
    padding: 1rem 2rem 1.5rem;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-secondary {
    background: #e0e0e0;
    color: #555;
  }

  .btn-secondary:hover {
    background: #d0d0d0;
  }

  .btn-primary {
    background: #4CAF50;
    color: white;
  }

  .btn-primary:hover {
    background: #45a049;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  }

  .btn:active {
    transform: translateY(0);
  }
</style>
