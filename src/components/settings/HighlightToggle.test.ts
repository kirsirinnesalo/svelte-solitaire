import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import HighlightToggle from './HighlightToggle.svelte';

/**
 * @covers TECH-023
 * @description Ensures the highlight toggle uses stacked column layout.
 * @constrainedBy ADR-001, ADR-002
 */
describe('HighlightToggle layout (TECH-023)', () => {
  it('uses column layout with label above controls', () => {
    const { container } = render(HighlightToggle, { props: { checked: false } });
    
    const wrapper = container.querySelector('.highlight-toggle');
    expect(wrapper).toBeTruthy();
    
    const styles = window.getComputedStyle(wrapper!);
    expect(styles.flexDirection).toBe('column');
  });

  it('renders the label', () => {
    render(HighlightToggle, { props: { checked: false } });
    expect(screen.getByText('Korostus')).toBeTruthy();
  });
});
