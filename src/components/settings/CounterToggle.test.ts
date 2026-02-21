import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import CounterToggle from './CounterToggle.svelte';

/**
 * @covers TECH-022
 * @description Ensures the counter toggle renders and updates its checkbox state.
 * @constrainedBy ADR-001, ADR-002
 */
describe('CounterToggle', () => {
  it('renders the default label', () => {
    render(CounterToggle, { props: { checked: false } });

    expect(screen.getByText('Laskurit')).toBeTruthy();
  });

  it('toggles the checkbox state', async () => {
    const user = userEvent.setup();
    render(CounterToggle, { props: { checked: false } });

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    await user.click(checkbox);

    expect(checkbox.checked).toBe(true);
  });
});

/**
 * @covers TECH-023
 * @description Ensures the counter toggle uses stacked layout and button-based toggle.
 * @constrainedBy ADR-001, ADR-002
 */
describe('CounterToggle layout (TECH-023)', () => {
  it('uses column layout with label above controls', () => {
    const { container } = render(CounterToggle, { props: { checked: false } });
    
    const wrapper = container.querySelector('.counter-toggle-container');
    expect(wrapper).toBeTruthy();
    
    const styles = window.getComputedStyle(wrapper!);
    expect(styles.flexDirection).toBe('column');
  });

  it('uses button-based toggle instead of checkbox', () => {
    render(CounterToggle, { props: { checked: false } });
    
    // Should have buttons for toggle options
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    // Should NOT have a checkbox
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('has On/Off button options', () => {
    render(CounterToggle, { props: { checked: false } });
    
    expect(screen.getByText('Pois')).toBeTruthy();
    expect(screen.getByText('Päällä')).toBeTruthy();
  });

  it('toggles state when clicking buttons', async () => {
    const user = userEvent.setup();
    const { component } = render(CounterToggle, { props: { checked: false } });
    
    const onButton = screen.getByText('Päällä');
    await user.click(onButton);
    
    // Component should update the bindable prop
    expect(component.checked).toBe(true);
  });

  it('shows active state styling on selected button', () => {
    const { container } = render(CounterToggle, { props: { checked: true } });
    
    const buttons = container.querySelectorAll('button');
    const activeButtons = Array.from(buttons).filter(btn => 
      btn.classList.contains('active')
    );
    
    expect(activeButtons.length).toBe(1);
  });
});
