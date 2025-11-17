
import React from 'react';
import { Card, CardEffect, CardState, CardType } from '../types';
import { ArrowPathIcon, DivineEpiphanyIcon, EpiphanyIcon, MinusCircleIcon, Square2StackIcon, XIcon } from './Icons';

interface CalculatorCardProps {
  card: Card;
  isLast: boolean;
  onUpdate: (card: Card) => void;
  onRemove: (cardId: number) => void;
  onDuplicate: (card: Card) => void;
  onConvert: (cardId: number) => void;
  onDiscard: (cardId: number) => void;
  buttonTextSize: number;
  combatantCount: number;
}

const cardStyles = {
  base: 'aspect-[2/3] w-full max-w-[280px] mx-auto rounded-lg shadow-lg p-3 flex flex-col justify-between transition-all duration-300 border-2 relative',
  [CardType.BASIC]: 'bg-gray-200 border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white',
  [CardType.UNIQUE]: 'bg-blue-200 border-blue-400 text-blue-900 dark:bg-blue-900/50 dark:border-blue-700 dark:text-white',
  [CardType.NEUTRAL]: 'bg-stone-300 border-stone-400 text-stone-900 dark:bg-stone-600 dark:border-stone-500 dark:text-white',
  [CardType.MONSTER]: 'bg-gradient-to-br from-purple-400 to-blue-400 border-purple-500 text-white dark:from-purple-800 dark:to-blue-800 dark:border-purple-600',
  [CardType.FORBIDDEN]: 'bg-red-200 border-red-400 text-red-900 dark:bg-red-900/50 dark:border-red-700 dark:text-white',
  ULTIMATE: 'bg-purple-200 border-purple-400 text-purple-900 dark:bg-purple-900/50 dark:border-purple-700 dark:text-white',
};

const stateStyles = {
  [CardState.NONE]: 'border-opacity-50',
  [CardState.EPIPHANY]: 'border-yellow-500 dark:border-yellow-400 shadow-yellow-500/40 dark:shadow-yellow-400/30 shadow-[0_0_15px]',
  [CardState.DIVINE_EPIPHANY]: 'border-cyan-500 dark:border-cyan-400 shadow-cyan-500/40 dark:shadow-cyan-400/30 shadow-[0_0_15px]',
};

const buttonStyles = {
  base: 'font-semibold py-1.5 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center gap-1.5',
  enabled: 'hover:bg-opacity-80',
  disabled: 'opacity-50 cursor-not-allowed',
};

const ActionButton: React.FC<{
  onClick: () => void;
  label: string;
  color: string;
  icon: React.ReactNode;
  textSize: number;
  disabled?: boolean;
  className?: string;
  showLabel: boolean;
}> = ({ onClick, label, color, disabled = false, icon, textSize, className, showLabel }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{ fontSize: `${textSize}px` }}
    className={`${buttonStyles.base} ${color} ${
      disabled ? buttonStyles.disabled : buttonStyles.enabled
    } ${showLabel ? 'px-2' : 'px-1.5'} ${className || ''}`}
  >
    {icon}
    {showLabel && <span className="min-w-0 truncate">{label}</span>}
  </button>
);


const CalculatorCard: React.FC<CalculatorCardProps> = ({ card, isLast, onUpdate, onRemove, onDuplicate, onConvert, onDiscard, buttonTextSize, combatantCount }) => {
  const showLabel = combatantCount === 1;
  const isEpiphanyDisabled = card.type === CardType.BASIC || isLast;
  const isDuplicatable = card.type !== CardType.BASIC && !card.effects?.includes(CardEffect.UNIQUE);
  const isStateLocked = card.state === CardState.EPIPHANY || card.state === CardState.DIVINE_EPIPHANY;

  const handleStateChange = (newState: CardState) => {
    if (isStateLocked) {
      return; // State is locked, do nothing
    }
    onUpdate({
      ...card,
      state: newState,
    });
  };
  
  const handleConvert = () => {
    onConvert(card.id);
  };

  const cardTitle = card.name || (isLast ? 'Ultimate' : card.type);

  const actionButtons = [];
  actionButtons.push(
    <ActionButton 
      key="convert"
      label="Convert"
      color="bg-gray-300 text-black"
      onClick={handleConvert}
      disabled={card.type === CardType.NEUTRAL}
      icon={<ArrowPathIcon className="w-4 h-4 flex-shrink-0" />}
      textSize={buttonTextSize}
      showLabel={showLabel}
    />
  );
  if (isDuplicatable) {
    actionButtons.push(
      <ActionButton 
        key="duplicate"
        label="Duplicate"
        color="bg-purple-600 text-white"
        onClick={() => onDuplicate(card)}
        icon={<Square2StackIcon className="w-4 h-4 flex-shrink-0" />}
        textSize={buttonTextSize}
        showLabel={showLabel}
      />
    );
  }
  actionButtons.push(
    <ActionButton 
      key="remove"
      label="Remove"
      color="bg-red-600 text-white"
      onClick={() => onRemove(card.id)}
      icon={<MinusCircleIcon className="w-4 h-4 flex-shrink-0" />}
      textSize={buttonTextSize}
      showLabel={showLabel}
    />
  );
  
  const hasImage = !!card.imageUrl;

  const backgroundStyle = hasImage ? {
      backgroundImage: `transparent, url(${card.imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
  } : {};

  const imageTextClasses = hasImage ? 'text-black': '';

  return (
    <div 
      className={`${cardStyles.base} ${isLast ? cardStyles.ULTIMATE : cardStyles[card.type]} ${stateStyles[card.state]} ${imageTextClasses}`}
      style={backgroundStyle}
    >
      {card.type === CardType.NEUTRAL && (
        <div className="group absolute top-2 right-2 z-20">
          <button
            onClick={() => onDiscard(card.id)}
            className="p-0.5 bg-gray-600/50 hover:bg-red-600 rounded-full text-white transition-colors"
            aria-label="Discard Neutral Card"
          >
            <XIcon className="w-4 h-4" />
          </button>
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 w-max max-w-xs p-2 text-xs text-white bg-gray-900/90 dark:bg-black/90 rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none">
            Only click this if Neutral card has [Remove] effect
          </div>
        </div>
      )}
      <div className="text-center min-h-[3rem]">
        <p className="font-bold text-sm sm:text-base">{cardTitle}</p>
        <p className={`text-xs capitalize ${card.state === CardState.NONE ? 'opacity-50' : ''}`}>
          {card.state.replace('_', ' ')}
        </p>
      </div>

      <div className="flex-grow my-2 flex items-center justify-center min-h-0">
        {/* This div is now just for spacing, keeping the layout consistent */}
      </div>
      
      <div className="flex flex-col gap-1.5">
        {!isEpiphanyDisabled && (
          <div className="grid grid-cols-2 gap-1.5">
            <ActionButton 
              label="Epiphany"
              color="bg-yellow-500 text-black"
              onClick={() => handleStateChange(CardState.EPIPHANY)}
              icon={<EpiphanyIcon className="w-4 h-4 flex-shrink-0" />}
              textSize={buttonTextSize}
              disabled={isStateLocked}
              showLabel={showLabel}
            />
            <ActionButton 
              label="Divine"
              color="bg-cyan-500 text-black"
              onClick={() => handleStateChange(CardState.DIVINE_EPIPHANY)}
              icon={<DivineEpiphanyIcon className="w-4 h-4 flex-shrink-0" />}
              textSize={buttonTextSize}
              disabled={isStateLocked}
              showLabel={showLabel}
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-1.5">
          {actionButtons.map((button, index) => {
            if (actionButtons.length % 2 !== 0 && index === actionButtons.length - 1) {
              return React.cloneElement(button, { className: 'col-span-2' });
            }
            return button;
          })}
        </div>
      </div>
    </div>
  );
};

export default CalculatorCard;