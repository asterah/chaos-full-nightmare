import React, { useMemo } from 'react';
import { Card, CardType, CardState } from '../types';
import { POINTS, REMOVAL_COST_LADDER, DUPLICATION_COST_LADDER, INITIAL_CARDS } from '../constants';
import { GameState, getLadderCost } from '../state';
import CalculatorCard from './CalculatorCard';
import ScoreDisplay from './ScoreDisplay';

interface CombatantLayoutProps {
  combatantIndex: number;
  history: GameState[];
  onHistoryChange: (newHistory: GameState[]) => void;
  scoreLimit: number;
  combatantCount: number;
  buttonTextSize: number;
}

const CombatantLayout: React.FC<CombatantLayoutProps> = ({ combatantIndex, history, onHistoryChange, scoreLimit, combatantCount, buttonTextSize }) => {
  const currentGameState = history[history.length - 1];
  const { cards, removedCards, duplicationCount, conversionCount } = currentGameState;

  const initialCardIds = useMemo(() => new Set(INITIAL_CARDS.map(c => c.id)), []);

  const handleReset = () => {
    onHistoryChange([{
      cards: JSON.parse(JSON.stringify(INITIAL_CARDS)),
      removedCards: [],
      duplicationCount: 0,
      conversionCount: 0,
      nextId: INITIAL_CARDS.length + 1,
    }]);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      onHistoryChange(history.slice(0, -1));
    }
  };

  const updateGameState = (newGameState: Partial<GameState>) => {
    onHistoryChange([...history, { ...history[history.length - 1], ...newGameState }]);
  };

  const handleAddCard = (type: CardType) => {
    const current = history[history.length - 1];
    const newCard: Card = {
      id: current.nextId,
      type: type,
      originalType: type,
      state: CardState.NONE,
    };
    updateGameState({
      cards: [...current.cards, newCard],
      nextId: current.nextId + 1,
    });
  };

  const handleUpdateCard = (updatedCard: Card) => {
    const current = history[history.length - 1];
    updateGameState({
      cards: current.cards.map(card => (card.id === updatedCard.id ? updatedCard : card)),
    });
  };

  const handleConvertCard = (cardId: number) => {
    const current = history[history.length - 1];
    updateGameState({
      cards: current.cards.map(card =>
        card.id === cardId ? { ...card, type: CardType.NEUTRAL, state: CardState.NONE } : card
      ),
      conversionCount: current.conversionCount + 1,
    });
  };

  const handleRemoveCard = (cardId: number) => {
    const current = history[history.length - 1];
    const cardToRemove = current.cards.find(card => card.id === cardId);
    if (cardToRemove) {
      updateGameState({
        cards: current.cards.filter(card => card.id !== cardId),
        removedCards: [...current.removedCards, cardToRemove],
      });
    }
  };

  const handleDuplicateCard = (cardToDuplicate: Card) => {
    const current = history[history.length - 1];
    const newCard: Card = {
      ...cardToDuplicate,
      id: current.nextId,
      isUltimate: false,
      isDuplicate: true,
    };
    updateGameState({
      cards: [...current.cards, newCard],
      duplicationCount: current.duplicationCount + 1,
      nextId: current.nextId + 1,
    });
  };

  const totalScore = useMemo(() => {
    let score = 0;
    cards.forEach(card => {
      const isNewlyAdded = !initialCardIds.has(card.id) && !card.isDuplicate;
      const isConvertedToNeutral = card.type === CardType.NEUTRAL && card.originalType !== CardType.NEUTRAL;
      
      if (isNewlyAdded) {
        if (card.type === CardType.UNIQUE) score += POINTS.UNIQUE_CARD;
        else if (card.type === CardType.MONSTER) score += POINTS.MONSTER_CARD;
        else if (card.type === CardType.NEUTRAL) score += POINTS.NEUTRAL_CARD;
        else if (card.type === CardType.FORBIDDEN) score += POINTS.FORBIDDEN_CARD;
      } else if (isConvertedToNeutral) {
        score += POINTS.NEUTRAL_CARD;
      }

      if (card.type !== CardType.BASIC) {
        if (card.state === CardState.EPIPHANY && card.type !== CardType.UNIQUE) {
          score += POINTS.EPIPHANY_BONUS;
        } else if (card.state === CardState.DIVINE_EPIPHANY) {
          score += POINTS.DIVINE_EPIPHANY_BONUS;
        }
      }
    });
    score += conversionCount * POINTS.CONVERSION_COST;
    let totalDuplicationCost = 0;
    for (let i = 0; i < duplicationCount; i++) {
      totalDuplicationCost += getLadderCost(DUPLICATION_COST_LADDER, i);
    }
    score += totalDuplicationCost;
    let totalRemovalCost = 0;
    removedCards.forEach((card, index) => {
      totalRemovalCost += getLadderCost(REMOVAL_COST_LADDER, index);
      if (card.originalType === CardType.BASIC && card.type === CardType.BASIC) {
        score += POINTS.BASIC_REMOVAL_BONUS;
      }
    });
    score += totalRemovalCost;
    return score;
  }, [cards, removedCards, duplicationCount, conversionCount, initialCardIds]);

  const cardGridClasses = combatantCount === 3
    ? 'grid-cols-4'
    : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';

  return (
    <div className="flex flex-col gap-4 bg-gray-100 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-bold text-center">Combatant {combatantIndex + 1}</h2>
      <ScoreDisplay
        score={totalScore}
        scoreLimit={scoreLimit}
        onReset={handleReset}
        onUndo={handleUndo}
        isUndoDisabled={history.length <= 1}
        isFreeRemoveUsed={removedCards.length > 0}
        isFreeDuplicateUsed={duplicationCount > 0}
      />
      <div className={`grid ${cardGridClasses} gap-4`}>
        {cards.map((card) => (
          <CalculatorCard
            key={card.id}
            card={card}
            isLast={!!card.isUltimate}
            onUpdate={handleUpdateCard}
            onRemove={handleRemoveCard}
            onDuplicate={handleDuplicateCard}
            onConvert={handleConvertCard}
            buttonTextSize={buttonTextSize}
          />
        ))}
        <div className="aspect-[2/3] w-full max-w-[280px] mx-auto rounded-lg border-2 border-dashed border-gray-400 dark:border-gray-600 flex flex-col items-center justify-center p-3 gap-2">
          <button
            onClick={() => handleAddCard(CardType.NEUTRAL)}
            className="w-full text-center text-sm font-semibold py-2 px-3 rounded-md transition-colors duration-200 bg-stone-500 text-white hover:bg-stone-600 dark:bg-stone-600 dark:hover:bg-stone-500"
            aria-label="Add new neutral card"
          >
            Add Neutral
          </button>
          <button
            onClick={() => handleAddCard(CardType.MONSTER)}
            className="w-full text-center text-sm font-semibold py-2 px-3 rounded-md transition-colors duration-200 bg-purple-600 text-white hover:bg-purple-700"
            aria-label="Add new monster card"
          >
            Add Monster
          </button>
          <button
            onClick={() => handleAddCard(CardType.FORBIDDEN)}
            className="w-full text-center text-sm font-semibold py-2 px-3 rounded-md transition-colors duration-200 bg-red-600 text-white hover:bg-red-700"
            aria-label="Add new forbidden card"
          >
            Add Forbidden
          </button>
        </div>
      </div>
    </div>
  );
};

export default CombatantLayout;
