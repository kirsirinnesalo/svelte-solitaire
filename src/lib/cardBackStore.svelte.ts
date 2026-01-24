export type CardBackType = 'classic-blue' | 'red-grid' | 'green-ornament' | 'four-suits';

// Svelte 5 rune-based reactive state
let cardBackValue = $state<CardBackType>('classic-blue');

export const cardBackType = {
  get value() {
    return cardBackValue;
  },
  set value(newValue: CardBackType) {
    cardBackValue = newValue;
  }
};
