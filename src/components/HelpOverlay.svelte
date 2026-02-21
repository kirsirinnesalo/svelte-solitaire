<script lang="ts">
  interface GameInstruction {
    title: string;
    goal: string;
    rules: string[];
    tips?: string[];
  }

  interface Props {
    isVisible: boolean;
    instruction: GameInstruction;
    onClose: () => void;
  }

  let { isVisible, instruction, onClose }: Props = $props();

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isVisible) {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isVisible}
  <div
    class="backdrop"
    role="button"
    tabindex="0"
    aria-label="Sulje ohjeet"
    onclick={onClose}
    onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && onClose()}
  ></div>
  <div class="help-content" role="dialog" aria-modal="true" aria-labelledby="help-title" tabindex="-1">
    <div class="help-header">
      <h2 id="help-title">{instruction.title}</h2>
      <button class="close-btn" onclick={onClose} aria-label="Sulje ohjeet">✕</button>
    </div>
    
    <div class="help-body">
      <section>
        <h3>🎯 Tavoite</h3>
        <p>{instruction.goal}</p>
      </section>

      <section>
        <h3>📋 Säännöt</h3>
        <ul>
          {#each instruction.rules as rule}
            <li>{rule}</li>
          {/each}
        </ul>
      </section>

      {#if instruction.tips && instruction.tips.length > 0}
        <section>
          <h3>💡 Vinkkejä</h3>
          <ul>
            {#each instruction.tips as tip}
              <li>{tip}</li>
            {/each}
          </ul>
        </section>
      {/if}
    </div>

    <div class="help-footer">
      <p class="keyboard-hint">Paina <kbd>ESC</kbd> sulkeaksesi</p>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    z-index: 2000;
    cursor: pointer;
  }

  .help-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 12px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    z-index: 2001;
  }

  .help-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .help-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    padding: 0.25rem 0.5rem;
    line-height: 1;
    transition: color 0.2s;
  }

  .close-btn:hover {
    color: #000;
  }

  .help-body {
    padding: 1.5rem;
    text-align: left;
  }

  .help-body section {
    margin-bottom: 1.5rem;
  }

  .help-body section:last-child {
    margin-bottom: 0;
  }

  .help-body h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1.1rem;
    color: #444;
  }

  .help-body p {
    margin: 0;
    line-height: 1.6;
    color: #555;
  }

  .help-body ul {
    margin: 0;
    padding-left: 1.75rem;
    list-style: disc;
    text-align: left;
  }

  .help-body li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
    color: #555;
    text-align: left;
  }

  .help-body li:last-child {
    margin-bottom: 0;
  }

  .help-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e0e0e0;
    background: #f9f9f9;
    border-radius: 0 0 12px 12px;
  }

  .keyboard-hint {
    margin: 0;
    font-size: 0.875rem;
    color: #666;
    text-align: center;
  }

  kbd {
    display: inline-block;
    padding: 0.125rem 0.375rem;
    font-size: 0.875rem;
    font-family: monospace;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  @media (prefers-reduced-motion: reduce) {
    .backdrop {
      backdrop-filter: none;
    }
  }
</style>
