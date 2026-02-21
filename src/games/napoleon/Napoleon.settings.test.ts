import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Napoleon from './Napoleon.svelte';

/**
 * @covers TECH-022, TECH-023
 * @description Allows hiding the stock counter via the shared counter setting.
 * @constrainedBy ADR-001, ADR-002
 */
describe('Napoleon counter setting', () => {
  it('hides the stock counter when toggled off', async () => {
    const user = userEvent.setup();
    const { container } = render(Napoleon);

    // Counter is off by default (checked=false), so stock-count should be hidden
    expect(container.querySelector('.stock-count')).toBeNull();

    // Find the checkmark button (✓) and click it to enable counters
    const onButton = screen.getByText('✓');
    await user.click(onButton);

    // Now stock counter should be visible
    expect(container.querySelector('.stock-count')).toBeTruthy();
    
    // Click cross (✕) to disable again
    const offButton = screen.getByText('✕');
    await user.click(offButton);
    
    // Stock counter should be hidden again
    expect(container.querySelector('.stock-count')).toBeNull();
  });
});
