import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import HelpOverlay from './HelpOverlay.svelte';
import type { GameInstruction } from '../lib/gameInstructions';

describe('HelpOverlay', () => {
  const mockInstruction: GameInstruction = {
    title: 'Test Game',
    goal: 'Test goal',
    rules: ['Rule 1', 'Rule 2'],
    tips: ['Tip 1']
  };

  it('renders when isVisible is true', () => {
    const { container } = render(HelpOverlay, {
      props: {
        isVisible: true,
        instruction: mockInstruction,
        onClose: vi.fn()
      }
    });

    const helpContent = container.querySelector('[role="dialog"]');
    expect(helpContent).toBeTruthy();
  });

  it('does not render when isVisible is false', () => {
    const { container } = render(HelpOverlay, {
      props: {
        isVisible: false,
        instruction: mockInstruction,
        onClose: vi.fn()
      }
    });

    const helpContent = container.querySelector('[role="dialog"]');
    expect(helpContent).toBeFalsy();
  });

  it('displays game title', () => {
    render(HelpOverlay, {
      props: {
        isVisible: true,
        instruction: mockInstruction,
        onClose: vi.fn()
      }
    });

    expect(screen.getByText('Test Game')).toBeTruthy();
  });

  it('displays game goal', () => {
    render(HelpOverlay, {
      props: {
        isVisible: true,
        instruction: mockInstruction,
        onClose: vi.fn()
      }
    });

    expect(screen.getByText('Test goal')).toBeTruthy();
  });

  it('displays all rules', () => {
    render(HelpOverlay, {
      props: {
        isVisible: true,
        instruction: mockInstruction,
        onClose: vi.fn()
      }
    });

    expect(screen.getByText('Rule 1')).toBeTruthy();
    expect(screen.getByText('Rule 2')).toBeTruthy();
  });

  it('displays tips when provided', () => {
    render(HelpOverlay, {
      props: {
        isVisible: true,
        instruction: mockInstruction,
        onClose: vi.fn()
      }
    });

    expect(screen.getByText('Tip 1')).toBeTruthy();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    const { container } = render(HelpOverlay, {
      props: {
        isVisible: true,
        instruction: mockInstruction,
        onClose
      }
    });

    const backdrop = container.querySelector('.backdrop') as HTMLElement;
    await userEvent.click(backdrop);

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const onClose = vi.fn();
    render(HelpOverlay, {
      props: {
        isVisible: true,
        instruction: mockInstruction,
        onClose
      }
    });

    await userEvent.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });

  it('does not call onClose when Escape key is pressed while hidden', async () => {
    const onClose = vi.fn();
    render(HelpOverlay, {
      props: {
        isVisible: false,
        instruction: mockInstruction,
        onClose
      }
    });

    await userEvent.keyboard('{Escape}');

    expect(onClose).not.toHaveBeenCalled();
  });

  it('has accessibility attributes', () => {
    const { container } = render(HelpOverlay, {
      props: {
        isVisible: true,
        instruction: mockInstruction,
        onClose: vi.fn()
      }
    });

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
    expect(dialog?.getAttribute('aria-labelledby')).toBeTruthy();
  });

  it('does not close overlay when clicking inside content', async () => {
    const onClose = vi.fn();
    render(HelpOverlay, {
      props: {
        isVisible: true,
        instruction: mockInstruction,
        onClose
      }
    });

    const content = screen.getByText('Test goal').closest('.help-content') as HTMLElement;
    await userEvent.click(content);

    expect(onClose).not.toHaveBeenCalled();
  });
});
