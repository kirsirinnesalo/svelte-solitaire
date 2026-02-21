import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import RecycleToggle from './RecycleToggle.svelte';

/**
 * @covers TECH-023
 * @description Ensures the recycle toggle uses stacked column layout.
 * @constrainedBy ADR-001, ADR-002
 */
describe('RecycleToggle layout (TECH-023)', () => {
  it('uses column layout with label above controls', () => {
    const { container } = render(RecycleToggle, { props: { value: 1 } });
    
    const wrapper = container.querySelector('.recycle-toggle-container');
    expect(wrapper).toBeTruthy();
    
    // Check that container has the correct class
    expect(wrapper?.classList.contains('recycle-toggle-container')).toBe(true);
  });

  it('renders the label', () => {
    render(RecycleToggle, { props: { value: 1 } });
    expect(screen.getByText('Jakoja:')).toBeTruthy();
  });

  it('toggles between options', async () => {
    const user = userEvent.setup();
    render(RecycleToggle, { props: { value: 1, options: [1, 2, 3, 'unlimited'] } });
    
    const button3 = screen.getByText('3');
    await user.click(button3);
    
    // Check that button has active class after click
    expect(button3.classList.contains('active')).toBe(true);
  });

  it('shows active state on selected option', () => {
    const { container } = render(RecycleToggle, { props: { value: 'unlimited' } });
    
    const buttons = container.querySelectorAll('button');
    const activeButtons = Array.from(buttons).filter(btn => 
      btn.classList.contains('active')
    );
    
    expect(activeButtons.length).toBe(1);
    // The unlimited button should be active
    expect(activeButtons[0].textContent?.trim()).toBe('∞');
  });

  it('displays options correctly', () => {
    render(RecycleToggle, { props: { value: 1, options: [1, 2, 3, 'unlimited'] } });
    
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('∞')).toBeTruthy();
  });
});
