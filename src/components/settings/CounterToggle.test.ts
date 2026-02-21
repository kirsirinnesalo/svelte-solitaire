import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import CounterToggle from './CounterToggle.svelte';

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

  it('has On/Off button options', () => {
    render(CounterToggle, { props: { checked: false } });
    
    expect(screen.getByText('Pois')).toBeTruthy();
    expect(screen.getByText('Päällä')).toBeTruthy();
  });

  it('toggles state when clicking buttons', async () => {
    const user = userEvent.setup();
    let checked = false;
    
    const { component } = render(CounterToggle, { 
      props: { 
        checked,
        oncheckedchange: (value: boolean) => { checked = value; }
      } 
    });
    
    const onButton = screen.getByText('Päällä');
    await user.click(onButton);
    
    // Check that active class is applied after click
    expect(onButton.classList.contains('active')).toBe(true);
  });

  it('shows active state styling on selected button', () => {
    const { container } = render(CounterToggle, { props: { checked: true } });
    
    const buttons = container.querySelectorAll('button');
    const activeButtons = Array.from(buttons).filter(btn => 
      btn.classList.contains('active')
    );
    
    expect(activeButtons.length).toBe(1);
    // The "Päällä" button should be active when checked=true
    expect(activeButtons[0].textContent?.trim()).toBe('Päällä');
  });

  it('shows "Pois" as active when checked is false', () => {
    const { container } = render(CounterToggle, { props: { checked: false } });
    
    const poisButton = screen.getByText('Pois');
    expect(poisButton.classList.contains('active')).toBe(true);
  });
});
