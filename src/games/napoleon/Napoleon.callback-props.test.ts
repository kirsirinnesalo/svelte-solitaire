import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import App from '../../App.svelte';

/**
 * @covers BUG-002
 * @constrainedBy ADR-003, ADR-002
 */
describe('Napoleon callback props', () => {
  it('returns to the game selector after leaving Napoleon', async () => {
    render(App);

    await screen.getByRole('button', { name: /napoleonin hauta/i }).click();
    expect(screen.getByRole('button', { name: /takaisin/i })).toBeTruthy();

    await screen.getByRole('button', { name: /takaisin/i }).click();

    expect(screen.getByRole('button', { name: /napoleonin hauta/i })).toBeTruthy();
  });
});
