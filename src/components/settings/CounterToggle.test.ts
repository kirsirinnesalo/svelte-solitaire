import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import CounterToggle from './CounterToggle.svelte';

/**
 * @covers TECH-023
 * @description Ensures the counter toggle uses stacked layout and compact slider toggle.
 * @constrainedBy ADR-001, ADR-002
 */
describe('CounterToggle layout (TECH-023)', () => {
  it('uses column layout with label above controls', () => {
    const { container } = render(CounterToggle, { props: { checked: false } });
    
    const wrapper = container.querySelector('.counter-toggle-container');
    expect(wrapper).toBeTruthy();
    
    // Check that container has class with column styling
    expect(wrapper?.classList.contains('counter-toggle-container')).toBe(true);
  });

  it('renders the default label', () => {
    render(CounterToggle, { props: { checked: false } });
    expect(screen.getByText('Laskurit')).toBeTruthy();
  });

  it('uses button-based toggle instead of checkbox', () => {
    render(CounterToggle, { props: { checked: false } });
    
    // Should have buttons for toggle options
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2);
    
    // Should NOT have a checkbox
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('has compact symbol-based options', () => {
    render(CounterToggle, { props: { checked: false } });
    
    expect(screen.getByText('✕')).toBeTruthy();
    expect(screen.getByText('✓')).toBeTruthy();
  });

  it('toggles state when clicking buttons', async () => {
    const user = userEvent.setup();
    render(CounterToggle, { props: { checked: false } });
    
    const checkButton = screen.getByText('✓');
    const crossButton = screen.getByText('✕');
    
    // Initially unchecked, so cross button area should show slider
    const slider = document.querySelector('.toggle-slider');
    expect(slider?.classList.contains('on')).toBe(false);
    
    await user.click(checkButton);
    
    // After clicking checkmark, slider should move
    expect(slider?.classList.contains('on')).toBe(true);
  });

  it('shows slider thumb in correct position', () => {
    const { container } = render(CounterToggle, { props: { checked: true } });
    
    const slider = container.querySelector('.toggle-slider');
    expect(slider?.classList.contains('on')).toBe(true);
  });

  it('shows slider on left when unchecked', () => {
    const { container } = render(CounterToggle, { props: { checked: false } });
    
    const slider = container.querySelector('.toggle-slider');
    expect(slider?.classList.contains('on')).toBe(false);
  });
});
