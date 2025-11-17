
import React, { useMemo } from 'react';
import { Card, CardType, CardState, ActionLogEntry, Combatant } from '../types';
import { POINTS, REMOVAL_COST_LADDER, DUPLICATION_COST_LADDER } from '../constants';
import { GameState, getLadderCost, getInitialGameState } from '../state';
import CalculatorCard from './CalculatorCard';
import ScoreDisplay from './ScoreDisplay';

interface CombatantLayoutProps {
  combatantIndex: number;
  history: GameState[];
  onHistoryChange: (newHistory: GameState[]) => void;
  scoreLimit: number;
  combatantCount: number;
  buttonTextSize: number;
  combatants: Combatant[];
  selectedCombatantId: string;
  onCharacterChange: (index: number, combatantId: string) => void;
}

const calculateTotalScore = (state: GameState, initialCardIds: Set<number>): number => {
  const { cards, removedCards, duplicationCount, conversionCount } = state;
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
}


const CombatantLayout: React.FC<CombatantLayoutProps> = ({ 
  combatantIndex, 
  history, 
  onHistoryChange, 
  scoreLimit, 
  combatantCount, 
  buttonTextSize,
  combatants,
  selectedCombatantId,
  onCharacterChange,
}) => {
  const currentGameState = history[history.length - 1];
  const { cards, removedCards, duplicationCount, actionLog } = currentGameState;

  const initialCardIds = useMemo(() => new Set(history[0].cards.map(c => c.id)), [history[0]]);

  const handleReset = () => {
    const selectedCombatant = combatants.find(c => c.id === selectedCombatantId);
    onHistoryChange([getInitialGameState(selectedCombatant?.deck)]);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      onHistoryChange(history.slice(0, -1));
    }
  };
  
  const updateGameStateAndLog = (updater: (current: GameState) => Partial<GameState>, description: string, overridePoints?: number) => {
    const oldState = history[history.length - 1];
    const oldScore = calculateTotalScore(oldState, initialCardIds);

    const changes = updater(oldState);
    const tempNewState: GameState = { ...oldState, ...changes };
    const newScore = calculateTotalScore(tempNewState, initialCardIds);
    const pointChange = overridePoints !== undefined ? overridePoints : newScore - oldScore;

    const newLogEntry: ActionLogEntry = {
        id: oldState.nextLogId,
        description: description,
        points: pointChange,
    };
    
    const finalState: GameState = {
        ...tempNewState,
        actionLog: [...oldState.actionLog, newLogEntry],
        nextLogId: oldState.nextLogId + 1,
    }

    onHistoryChange([...history, finalState]);
  }

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const formatStateName = (s: CardState) => s.replace(/_/g, ' ').split(' ').map(capitalize).join(' ');
  
  const getCardBaseName = (card: Card) => {
    if (card.name) return card.name;
    return `${card.isUltimate ? 'Ultimate' : capitalize(card.type)} Card`;
  };

  const formatCardName = (card: Card) => {
      const baseName = getCardBaseName(card);
      if (card.state !== CardState.NONE) {
          return `${formatStateName(card.state)} ${baseName}`;
      }
      return baseName;
  };

  const handleAddCard = (type: CardType) => {
    const updater = (current: GameState) => {
      const newCard: Card = {
        id: current.nextId,
        type: type,
        originalType: type,
        state: CardState.NONE,
        name: `${capitalize(type)} Card`
      };
      return {
        cards: [...current.cards, newCard],
        nextId: current.nextId + 1,
      };
    }
    const description = `Add ${capitalize(type)} Card`;
    updateGameStateAndLog(updater, description);
  };

  const handleUpdateCard = (updatedCard: Card) => {
    const oldState = history[history.length - 1];
    const oldCard = oldState.cards.find(c => c.id === updatedCard.id);
    if (!oldCard) return;

    const updater = (current: GameState) => ({
      cards: current.cards.map(card => (card.id === updatedCard.id ? updatedCard : card)),
    });
    
    let description = `Update ${formatCardName(oldCard)}`;
    if (oldCard.state !== updatedCard.state) {
        const cardBaseName = getCardBaseName(oldCard);

        if (updatedCard.state === CardState.NONE) {
            description = `Remove ${formatStateName(oldCard.state)} from ${cardBaseName}`;
        } else if (oldCard.state === CardState.NONE) {
            description = `Add ${formatStateName(updatedCard.state)} to ${cardBaseName}`;
        } else {
            description = `Change ${cardBaseName} to ${formatStateName(updatedCard.state)}`;
        }
    }
    updateGameStateAndLog(updater, description);
  };

  const handleConvertCard = (cardId: number) => {
    const oldState = history[history.length - 1];
    const cardToConvert = oldState.cards.find(c => c.id === cardId);
    if (!cardToConvert) return;
    
    const updater = (current: GameState) => ({
      cards: current.cards.map(card =>
        card.id === cardId ? { ...card, type: CardType.NEUTRAL, state: CardState.NONE, name: 'Neutral Card' } : card
      ),
      conversionCount: current.conversionCount + 1,
    });

    const description = `Convert ${formatCardName(cardToConvert)} to Neutral`;
    updateGameStateAndLog(updater, description);
  };

  const handleRemoveCard = (cardId: number) => {
    const oldState = history[history.length - 1];
    const cardToRemove = oldState.cards.find(card => card.id === cardId);
    if (!cardToRemove) return;

    const updater = (current: GameState) => ({
      cards: current.cards.filter(card => card.id !== cardId),
      removedCards: [...current.removedCards, cardToRemove],
    });
    
    const description = `Remove ${formatCardName(cardToRemove)}`;
    updateGameStateAndLog(updater, description);
  };

  const handleDiscardCard = (cardId: number) => {
    const oldState = history[history.length - 1];
    const cardToDiscard = oldState.cards.find(c => c.id === cardId);
    if (!cardToDiscard || cardToDiscard.type !== CardType.NEUTRAL) return;

    const updater = (current: GameState) => ({
        cards: current.cards.filter(card => card.id !== cardId),
    });
    // This action has no point cost by definition, so we don't calculate it.
    updateGameStateAndLog(updater, 'Remove Neutral Card by [Remove] effect', 0);
  };

  const handleDuplicateCard = (cardToDuplicate: Card) => {
    const updater = (current: GameState) => {
      const newCard: Card = {
        ...cardToDuplicate,
        id: current.nextId,
        state: CardState.NONE, 
        isUltimate: false,
        isDuplicate: true,
      };
      return {
        cards: [...current.cards, newCard],
        duplicationCount: current.duplicationCount + 1,
        nextId: current.nextId + 1,
      };
    }
    const description = `Duplicate ${formatCardName(cardToDuplicate)}`;
    updateGameStateAndLog(updater, description);
  };

  const totalScore = useMemo(() => {
    return calculateTotalScore(currentGameState, initialCardIds);
  }, [currentGameState, initialCardIds]);

  const cardGridClasses = combatantCount === 3
    ? 'grid-cols-4'
    : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';

  return (
    <div className="flex flex-col gap-4 bg-gray-100 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center gap-2">
        <label htmlFor={`combatant-character-select-${combatantIndex}`} className="text-lg font-bold">
          Combatant {combatantIndex + 1}:
        </label>
        <select
          id={`combatant-character-select-${combatantIndex}`}
          value={selectedCombatantId}
          onChange={(e) => onCharacterChange(combatantIndex, e.target.value)}
          className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-lg font-bold rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-auto p-1.5"
        >
          {combatants.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <ScoreDisplay
        score={totalScore}
        scoreLimit={scoreLimit}
        onReset={handleReset}
        onUndo={handleUndo}
        isUndoDisabled={history.length <= 1}
        isResetDisabled={history.length <= 1}
        isFreeRemoveUsed={removedCards.length > 0}
        isFreeDuplicateUsed={duplicationCount > 0}
      />
      <div className={combatantCount === 1 ? "lg:grid lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)] gap-4" : "contents"}>
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
              onDiscard={handleDiscardCard}
              buttonTextSize={buttonTextSize}
              combatantCount={combatantCount}
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
        <div>
          <h3 className="text-md font-bold mb-2 text-center sm:text-left">Action Log</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 max-h-48 lg:max-h-[calc(100vh-240px)] overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-sm">
            {actionLog.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm">No actions yet.</p>
            ) : (
              <ul className="space-y-1">
              {actionLog.slice().reverse().map(log => (
                <li key={log.id} className="flex justify-between items-center text-sm py-1 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <span className="capitalize-first">{log.description}</span>
                  <span className={`font-bold font-mono ${log.points > 0 ? 'text-green-500' : log.points < 0 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    {log.points > 0 ? `+${log.points}` : log.points}
                  </span>
                </li>
              ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombatantLayout;