
import { Card, CardType, CardState, Combatant, CardEffect } from './types';

// Helper to generate dummy SVG images as base64 data URIs
const generateDummyImage = (text: string, bgColor: string = '#4A5568', textColor: string = '#FFFFFF'): string => {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240">
            <rect width="100%" height="100%" fill="${bgColor}" />
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="${textColor}" font-weight="bold">
                ${text.split(' ').map((word, i) => `<tspan x="50%" dy="${i === 0 ? '0' : '1.2em'}">${word}</tspan>`).join('')}
            </text>
        </svg>
    `.trim();
    // In a browser environment, btoa is available globally.
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};


// Factory function to reduce boilerplate when creating cards
const createCard = (
  id: number,
  type: CardType,
  name: string,
  options: { isUltimate?: boolean; effects?: CardEffect[]; imageUrl?: string } = {}
): Card => {
  return {
    id,
    type,
    name,
    originalType: type,
    state: CardState.NONE,
    ...options,
  };
};

export const DEFAULT_DECK: Card[] = [
  createCard(1, CardType.BASIC, 'Basic Card'),
  createCard(2, CardType.BASIC, 'Basic Card'),
  createCard(3, CardType.BASIC, 'Basic Card'),
  createCard(4, CardType.UNIQUE, 'Unique Card'),
  createCard(5, CardType.UNIQUE, 'Unique Card'),
  createCard(6, CardType.UNIQUE, 'Unique Card'),
  createCard(7, CardType.UNIQUE, 'Unique Card'),
  createCard(8, CardType.UNIQUE, 'Ultimate Card', { isUltimate: true }),
];

const MIKA_DECK_CARDS_DATA = [
    { id: 1, type: CardType.BASIC, name: 'Water Arrow', image: './cards/water-arrow.png' },
    { id: 2, type: CardType.BASIC, name: 'Water Arrow', image: './cards/water-arrow.png' },
    { id: 3, type: CardType.BASIC, name: 'Water Barrier', image: './cards/water-barrier.png' },
    { id: 4, type: CardType.UNIQUE, name: 'Source of Water', image: './cards/source-of-water.png' },
    { id: 5, type: CardType.UNIQUE, name: 'Blessing of Waves', image: './cards/blessing-of-waves.png' },
    { id: 6, type: CardType.UNIQUE, name: 'Tactical Analysis', image: './cards/tactical-analysis.png' },
    { id: 7, type: CardType.UNIQUE, name: 'Whirlpool', image: './cards/whirlpool.png' },
    { id: 8, type: CardType.UNIQUE, name: 'Deluge', isUltimate: true, image: './cards/deluge.png' },
];

const MIKA_DECK: Card[] = MIKA_DECK_CARDS_DATA.map(cardData =>
    createCard(cardData.id, cardData.type, cardData.name, {
        isUltimate: cardData.isUltimate,
        imageUrl: cardData.image,
    })
);


export const COMBATANTS: Combatant[] = [
    {
        id: 'default',
        name: 'Default',
        deck: DEFAULT_DECK,
    },
    {
        id: 'mika',
        name: 'Mika',
        deck: MIKA_DECK,
    },
];