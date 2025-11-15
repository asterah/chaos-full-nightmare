
import React from 'react';
import { UndoIcon, ResetIcon } from './Icons';

interface ScoreDisplayProps {
  score: number;
  scoreLimit: number;
  onReset: () => void;
  onUndo: () => void;
  isUndoDisabled: boolean;
  isResetDisabled: boolean;
  isFreeRemoveUsed: boolean;
  isFreeDuplicateUsed: boolean;
}

const Indicator: React.FC<{ label: string; isUsed: boolean }> = ({ label, isUsed }) => (
  <div className="flex items-center gap-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 px-3 py-1.5 rounded-md">
    <span className="text-gray-800 dark:text-gray-300">{label}:</span>
    <span className={`font-bold ${isUsed ? 'text-red-500' : 'text-green-500 dark:text-green-400'}`}>
      {isUsed ? 'Used' : 'Available'}
    </span>
  </div>
);


const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  scoreLimit, 
  onReset, 
  onUndo, 
  isUndoDisabled,
  isResetDisabled,
  isFreeRemoveUsed,
  isFreeDuplicateUsed
}) => {
  const progressPercentage = Math.min((score / scoreLimit) * 100, 100);
  const isOverLimit = score > scoreLimit;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="w-full flex-grow">
        <div className="relative h-8 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
          <div 
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${isOverLimit ? 'bg-red-500' : 'bg-cyan-500'}`}
            style={{ width: `${isOverLimit ? 100 : progressPercentage}%` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-mono font-bold text-gray-900 dark:text-white tracking-wider">
              {score} / {scoreLimit}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Indicator label="Free Remove" isUsed={isFreeRemoveUsed} />
          <Indicator label="Free Duplicate" isUsed={isFreeDuplicateUsed} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onUndo}
            disabled={isUndoDisabled}
            className="px-3 py-2 bg-yellow-500 text-black font-semibold rounded-md flex items-center gap-2 transition-opacity duration-200 disabled:opacity-50 hover:enabled:bg-yellow-400"
            aria-label="Undo last action"
          >
            <UndoIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Undo</span>
          </button>
          <button
            onClick={onReset}
            disabled={isResetDisabled}
            className="px-3 py-2 bg-red-600 text-white font-semibold rounded-md flex items-center gap-2 transition-opacity duration-200 disabled:opacity-50 hover:enabled:bg-red-500"
            aria-label="Reset calculator"
          >
            <ResetIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;