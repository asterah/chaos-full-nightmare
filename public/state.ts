
import { Card, CardType, CardState, ActionLogEntry } from './types';
import { DEFAULT_DECK } from './database';

// State related to the core game logic that can be undone
export interface GameState {
  cards: Card[];
  removedCards: Card[];
  duplicationCount: number;
  conversionCount: number;
  nextId: number;
  actionLog: ActionLogEntry[];
  nextLogId: number;
}

// Function to generate a fresh, deep-copied initial GAME state
export const getInitialGameState = (initialCards: Card[] = DEFAULT_DECK): GameState => ({
  cards: JSON.parse(JSON.stringify(initialCards)), // Full deep copy
  removedCards: [],
  duplicationCount: 0,
  conversionCount: 0,
  nextId: Math.max(...initialCards.map(c => c.id)) + 1,
  actionLog: [],
  nextLogId: 1,
});

export function getLadderCost(ladder: number[], count: number): number {
  const index = Math.min(count, ladder.length - 1);
  return ladder[index];
}
