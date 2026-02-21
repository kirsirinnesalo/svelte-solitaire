import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import AcesUp from './AcesUp.svelte';

/**
 * @covers TECH-022
 * @description Allows hiding the stock counter via the shared counter setting.
 * @constrainedBy ADR-001, ADR-002
 */
describe('AcesUp counter setting', () => {
  it('hides the stock counter when toggled off', async () => {
    const user = userEvent.setup();
    const { container } = render(AcesUp);

    const checkbox = screen.getByLabelText('Laskurit') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    expect(container.querySelector('.stock-count')).toBeNull();

    await user.click(checkbox);

    expect(checkbox.checked).toBe(true);
    expect(container.querySelector('.stock-count')).toBeTruthy();
  });
});
