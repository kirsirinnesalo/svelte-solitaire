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
