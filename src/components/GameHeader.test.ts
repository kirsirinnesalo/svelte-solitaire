import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import GameHeader from './GameHeader.svelte';

describe('GameHeader', () => {
  it('renders action buttons with icons', () => {
    const onNewGame = vi.fn();
    
    const { container } = render(GameHeader, {
      props: {
        onNewGame
      }
    });

    // All action buttons should be present
    const newGameBtn = screen.getByRole('button', { name: /uusi peli/i });
    const restartBtn = screen.getByRole('button', { name: /uudelleen/i });
    const undoBtn = screen.getByRole('button', { name: /kumoa/i });
    const hintBtn = screen.getByRole('button', { name: /vihje/i });

    expect(newGameBtn).toBeTruthy();
    expect(restartBtn).toBeTruthy();
    expect(undoBtn).toBeTruthy();
    expect(hintBtn).toBeTruthy();
  });

  it('marks new game as primary and others as secondary', () => {
    const onNewGame = vi.fn();

    render(GameHeader, {
      props: {
        onNewGame
      }
    });

    const newGameBtn = screen.getByRole('button', { name: /uusi peli/i });
    const restartBtn = screen.getByRole('button', { name: /uudelleen/i });
    const undoBtn = screen.getByRole('button', { name: /kumoa/i });
    const hintBtn = screen.getByRole('button', { name: /vihje/i });

    expect(newGameBtn.classList.contains('action-btn-primary')).toBe(true);
    expect(restartBtn.classList.contains('action-btn-secondary')).toBe(true);
    expect(undoBtn.classList.contains('action-btn-secondary')).toBe(true);
    expect(hintBtn.classList.contains('action-btn-secondary')).toBe(true);
  });

  it('renders help button when onHelp is provided', () => {
    const onNewGame = vi.fn();
    const onHelp = vi.fn();

    render(GameHeader, {
      props: {
        onNewGame,
        onHelp
      }
    });

    const helpBtn = screen.getByRole('button', { name: /ohjeet/i });
    expect(helpBtn).toBeTruthy();
  });

  it('does not render help button when onHelp is not provided', () => {
    const onNewGame = vi.fn();

    render(GameHeader, {
      props: {
        onNewGame
      }
    });

    const helpBtn = screen.queryByRole('button', { name: /ohjeet/i });
    expect(helpBtn).toBeFalsy();
  });

  it('renders pause button when onPause is provided', () => {
    const onNewGame = vi.fn();
    const onPause = vi.fn();

    render(GameHeader, {
      props: {
        onNewGame,
        onPause,
        gameStarted: true
      }
    });

    const pauseBtn = screen.getByRole('button', { name: /tauko/i });
    expect(pauseBtn).toBeTruthy();
  });

  it('displays elapsed time', () => {
    const onNewGame = vi.fn();

    render(GameHeader, {
      props: {
        onNewGame,
        elapsedTime: 125 // 2:05
      }
    });

    expect(screen.getByText(/2:05/)).toBeTruthy();
  });

  it('calls onNewGame when new game button is clicked', async () => {
    const onNewGame = vi.fn();

    render(GameHeader, {
      props: {
        onNewGame
      }
    });

    const newGameBtn = screen.getByRole('button', { name: /uusi peli/i });
    await newGameBtn.click();

    expect(onNewGame).toHaveBeenCalledOnce();
  });

  it('disables undo button when undoDisabled is true', () => {
    const onNewGame = vi.fn();

    render(GameHeader, {
      props: {
        onNewGame,
        undoDisabled: true
      }
    });

    const undoBtn = screen.getByRole('button', { name: /kumoa/i }) as HTMLButtonElement;
    expect(undoBtn.disabled).toBe(true);
  });

  it('disables restart button when restartDisabled is true', () => {
    const onNewGame = vi.fn();

    render(GameHeader, {
      props: {
        onNewGame,
        restartDisabled: true
      }
    });

    const restartBtn = screen.getByRole('button', { name: /uudelleen/i }) as HTMLButtonElement;
    expect(restartBtn.disabled).toBe(true);
  });

  it('disables hint button when hintDisabled is true', () => {
    const onNewGame = vi.fn();

    render(GameHeader, {
      props: {
        onNewGame,
        hintDisabled: true
      }
    });

    const hintBtn = screen.getByRole('button', { name: /vihje/i }) as HTMLButtonElement;
    expect(hintBtn.disabled).toBe(true);
  });

  describe('Icon-only action buttons', () => {
    it('buttons have aria-labels for accessibility', () => {
      const onNewGame = vi.fn();

      const { container } = render(GameHeader, {
        props: {
          onNewGame
        }
      });

      // Check that buttons have accessible names (either from text content or aria-label)
      const newGameBtn = screen.getByRole('button', { name: /uusi peli/i });
      const restartBtn = screen.getByRole('button', { name: /uudelleen/i });
      const undoBtn = screen.getByRole('button', { name: /kumoa/i });
      const hintBtn = screen.getByRole('button', { name: /vihje/i });

      expect(newGameBtn).toBeTruthy();
      expect(restartBtn).toBeTruthy();
      expect(undoBtn).toBeTruthy();
      expect(hintBtn).toBeTruthy();
    });

    it('buttons have title attributes for hover tooltips', () => {
      const onNewGame = vi.fn();
      const onHelp = vi.fn();

      const { container } = render(GameHeader, {
        props: {
          onNewGame,
          onHelp
        }
      });

      const newGameBtn = container.querySelector('.new-game-btn') as HTMLElement;
      const undoBtn = container.querySelector('.undo-btn') as HTMLElement;
      const helpBtn = container.querySelector('.help-btn') as HTMLElement;

      // Some buttons should have title attributes
      expect(newGameBtn.hasAttribute('title') || newGameBtn.textContent?.includes('Uusi peli')).toBe(true);
      expect(undoBtn.hasAttribute('title') || undoBtn.textContent?.includes('Kumoa')).toBe(true);
      expect(helpBtn.hasAttribute('title') || helpBtn.textContent?.includes('Ohjeet')).toBe(true);
    });
  });
});
