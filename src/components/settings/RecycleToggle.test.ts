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
    
    const styles = window.getComputedStyle(wrapper!);
    expect(styles.flexDirection).toBe('column');
  });

  it('renders the label', () => {
    render(RecycleToggle, { props: { value: 1 } });
    expect(screen.getByText('Jakoja:')).toBeTruthy();
  });

  it('toggles between options', async () => {
    const user = userEvent.setup();
    const { component } = render(RecycleToggle, { props: { value: 1, options: [1, 2, 3, 'unlimited'] } });
    
    const button3 = screen.getByText('3');
    await user.click(button3);
    
    expect(component.value).toBe(3);
  });

  it('shows active state on selected option', () => {
    const { container } = render(RecycleToggle, { props: { value: 'unlimited' } });
    
    const buttons = container.querySelectorAll('button');
    const activeButtons = Array.from(buttons).filter(btn => 
      btn.classList.contains('active')
    );
    
    expect(activeButtons.length).toBe(1);
  });
});
