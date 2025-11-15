import { Card, CardType, CardState, Combatant, CardEffect } from './types';

// Helper to generate dummy SVG images as base64 data URIs
export const generateDummyImage = (text: string, bgColor: string = '#4A5568', textColor: string = '#FFFFFF'): string => {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240">
            <rect width="100%" height="100%" fill="${bgColor}" />
        </svg>
    `.trim();
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Helper to generate a standardized image path from a card name
const nameToImagePath = (name: string): string => {
    const fileName = name.toLowerCase().replace(/ /g, '-');
    return `./cards/${fileName}.png`;
};

export const cardImageColors: Record<CardType, string> = {
    [CardType.BASIC]: '#718096', // gray
    [CardType.UNIQUE]: '#3182CE', // blue
    [CardType.NEUTRAL]: '#A0AEC0', // stone
    [CardType.MONSTER]: '#6B46C1', // purple
    [CardType.FORBIDDEN]: '#E53E3E', // red
};

// Factory function to reduce boilerplate when creating cards
const createCard = (
  id: number,
  type: CardType,
  name: string,
  options: { isUltimate?: boolean; effects?: CardEffect[]; imageUrl?: string } = {}
): Card => ({
    id,
    type,
    name,
    originalType: type,
    state: CardState.NONE,
    ...options,
});

// Helper to create a full deck from a simplified data array
type CardData = { id: number; type: CardType; name: string; isUltimate?: boolean; effects?: CardEffect[], imageUrl?: string };

const createDeckFromData = (data: CardData[]): Card[] => {
    return data.map(cardData => {
        const isUltimate = !!cardData.isUltimate;
        const color = isUltimate ? '#805AD5' : cardImageColors[cardData.type];
        const imageUrl = cardData.imageUrl || generateDummyImage(cardData.name, color);

        return createCard(cardData.id, cardData.type, cardData.name, {
            isUltimate: cardData.isUltimate,
            effects: cardData.effects,
            imageUrl,
        });
    });
};


const DEFAULT_DECK_DATA: CardData[] = [
    { id: 1, type: CardType.BASIC, name: 'Basic Card', imageUrl: './cards/name.png' },
    { id: 2, type: CardType.BASIC, name: 'Basic Card', imageUrl: './cards/name.png' },
    { id: 3, type: CardType.BASIC, name: 'Basic Card', imageUrl: './cards/name.png' },
    { id: 4, type: CardType.UNIQUE, name: 'Unique Card', imageUrl: './cards/name.png' },
    { id: 5, type: CardType.UNIQUE, name: 'Unique Card', imageUrl: './cards/name.png' },
    { id: 6, type: CardType.UNIQUE, name: 'Unique Card', imageUrl: './cards/name.png' },
    { id: 7, type: CardType.UNIQUE, name: 'Unique Card', imageUrl: './cards/name.png' },
    { id: 8, type: CardType.UNIQUE, name: 'Ultimate Card', isUltimate: true, './cards/name.png' },
];

const MIKA_DECK_DATA: CardData[] = [
    { id: 1, type: CardType.BASIC, name: 'Water Arrow', imageUrl: './cards/water-arrow.png' },
    { id: 2, type: CardType.BASIC, name: 'Water Arrow', imageUrl: './cards/water-arrow.png' },
    { id: 3, type: CardType.BASIC, name: 'Water Barrier', imageUrl: './cards/water-barrier.png' },
    { id: 4, type: CardType.UNIQUE, name: 'Source of Water', imageUrl: './cards/source-of-water.png' },
    { id: 5, type: CardType.UNIQUE, name: 'Blessing of Waves', imageUrl: './cards/blessing-of-waves.png' },
    { id: 6, type: CardType.UNIQUE, name: 'Tactical Analysis', imageUrl: './cards/tactical-analysis.png' },
    { id: 7, type: CardType.UNIQUE, name: 'Whirlpool', imageUrl: './cards/whirlpool.png' },
    { id: 8, type: CardType.UNIQUE, name: 'Deluge', isUltimate: true, imageUrl: './cards/deluge.png' },
];

const HARU_DECK_DATA: CardData[] = [
    { id: 1, type: CardType.BASIC, name: 'Anchor', imageUrl: './cards/name.png' },
    { id: 2, type: CardType.BASIC, name: 'Power Anchor', imageUrl: './cards/name.png' },
    { id: 3, type: CardType.BASIC, name: 'Anchor Drop', imageUrl: './cards/name.png' },
    { id: 4, type: CardType.UNIQUE, name: 'Anchor Shot', imageUrl: './cards/name.png' },
    { id: 5, type: CardType.UNIQUE, name: 'Anchor Pointer', imageUrl: './cards/name.png' },
    { id: 6, type: CardType.UNIQUE, name: 'Power Charge', imageUrl: './cards/name.png' },
    { id: 7, type: CardType.UNIQUE, name: 'Charge Energy', imageUrl: './cards/name.png' },
    { id: 8, type: CardType.UNIQUE, name: 'Lift Anchor', isUltimate: true, imageUrl: './cards/name.png' },
];

export const DEFAULT_DECK: Card[] = createDeckFromData(DEFAULT_DECK_DATA);
const MIKA_DECK: Card[] = createDeckFromData(MIKA_DECK_DATA);
const HARU_DECK: Card[] = createDeckFromData(HARU_DECK_DATA);

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
    {
        id: 'haru',
        name: 'Haru',
        deck: HARU_DECK,
    },
];
