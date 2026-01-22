import { writable } from 'svelte/store';

export type CardBackType = 'classic-blue' | 'red-grid' | 'green-ornament' | 'four-suits';

export const cardBackType = writable<CardBackType>('classic-blue');
