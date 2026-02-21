import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import DrawCountToggle from './DrawCountToggle.svelte';

/**
 * @covers TECH-023
 * @description Ensures the draw count toggle uses stacked column layout.
 * @constrainedBy ADR-001, ADR-002
 */
describe('DrawCountToggle layout (TECH-023)', () => {
  it('uses column layout with label above controls', () => {
    const { container } = render(DrawCountToggle, { props: { value: 1 } });
    
    const wrapper = container.querySelector('.draw-toggle-container');
    expect(wrapper).toBeTruthy();
    
    const styles = window.getComputedStyle(wrapper!);
    expect(styles.flexDirection).toBe('column');
  });

  it('renders the label', () => {
    render(DrawCountToggle, { props: { value: 1 } });
    expect(screen.getByText('Nosta')).toBeTruthy();
  });

  it('toggles between options', async () => {
    const user = userEvent.setup();
    const { component } = render(DrawCountToggle, { props: { value: 1 } });
    
    const buttons = screen.getAllByRole('button');
    // Second button should be for value 3
    await user.click(buttons[1]);
    
    expect(component.value).toBe(3);
  });

  it('shows active state on selected option', () => {
    const { container } = render(DrawCountToggle, { props: { value: 3 } });
    
    const slider = container.querySelector('.toggle-slider');
    expect(slider?.classList.contains('three')).toBe(true);
  });
});
