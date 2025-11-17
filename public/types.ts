

export enum CardType {
  BASIC = 'basic',
  UNIQUE = 'unique',
  NEUTRAL = 'neutral',
  MONSTER = 'monster',
  FORBIDDEN = 'forbidden',
}

export enum CardState {
  NONE = 'none',
  EPIPHANY = 'epiphany',
  DIVINE_EPIPHANY = 'divine_epiphany',
}

export enum CardEffect {
  UNIQUE = 'unique', // Cannot be duplicated
  REMOVE = 'remove', // Has a remove effect
}

export interface Card {
  id: number;
  type: CardType;
  originalType: CardType;
  state: CardState;
  name?: string;
  effects?: CardEffect[];
  isUltimate?: boolean;
  isDuplicate?: boolean;
  imageUrl?: string;
}

export interface ActionLogEntry {
  id: number;
  description: string;
  points: number;
}

export interface Combatant {
  id: string;
  name: string;
  deck: Card[];
}