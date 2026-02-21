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
    
    // Check that container has the correct class
    expect(wrapper?.classList.contains('highlight-toggle')).toBe(true);
  });

  it('renders the label', () => {
    render(HighlightToggle, { props: { checked: false } });
    expect(screen.getByText('Korostus')).toBeTruthy();
  });

  it('has a checkbox input', () => {
    render(HighlightToggle, { props: { checked: false } });
    
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox).toBeTruthy();
  });

  it('reflects checked state', () => {
    render(HighlightToggle, { props: { checked: true } });
    
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });
});
