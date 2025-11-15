
import React, { useState, useMemo, useEffect } from 'react';
import { GameState, getInitialGameState } from './state';
import CombatantLayout from './components/CombatantLayout';
import { GitHubIcon, ThemeIcon } from './components/Icons';
import { COMBATANTS } from './database';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  // Global UI state
  const [combatantCount, setCombatantCount] = useState<number>(1);
  const [tier, setTier] = useState<number>(1);
  const [buttonTextSize, setButtonTextSize] = useState<number>(12); // in pixels
  const [theme, setTheme] = useState<Theme>(() => 
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  // Per-combatant game state
  const [combatantsHistories, setCombatantsHistories] = useState<GameState[][]>([
    [getInitialGameState()]
  ]);
  const [selectedCombatants, setSelectedCombatants] = useState<string[]>(['default']);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  useEffect(() => {
    const diff = combatantCount - combatantsHistories.length;
    if (diff > 0) {
      const newHistories = [...combatantsHistories];
      const newSelections = [...selectedCombatants];
      for (let i = 0; i < diff; i++) {
        newHistories.push([getInitialGameState()]);
        newSelections.push('default');
      }
      setCombatantsHistories(newHistories);
      setSelectedCombatants(newSelections);
    } else if (diff < 0) {
      setCombatantsHistories(current => current.slice(0, combatantCount));
      setSelectedCombatants(current => current.slice(0, combatantCount));
    }
  }, [combatantCount]);

  const scoreLimit = useMemo(() => 30 + (tier - 1) * 10, [tier]);
  
  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleHistoryChange = (index: number, newHistory: GameState[]) => {
    setCombatantsHistories(currentHistories => {
      const newHistories = [...currentHistories];
      newHistories[index] = newHistory;
      return newHistories;
    });
  };

  const handleCharacterChange = (index: number, combatantId: string) => {
    const selectedCombatant = COMBATANTS.find(c => c.id === combatantId);
    if (!selectedCombatant) return;

    setSelectedCombatants(current => {
        const newSelections = [...current];
        newSelections[index] = combatantId;
        return newSelections;
    });

    handleHistoryChange(index, [getInitialGameState(selectedCombatant.deck)]);
  };

  const combatantGridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 xl:grid-cols-3',
  };

  return (
    <div className="min-h-screen">
      {/* Global Controls Header */}
      <div className="sticky top-0 z-10 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm py-3 mb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold whitespace-nowrap">Save Data Calculator</h1>
            </div>
            
            <div className="flex-1 flex justify-center items-center flex-wrap gap-x-6 gap-y-2">
              {/* Tier Selector */}
              <div className="flex items-center gap-2">
                <label htmlFor="tier-select" className="font-bold text-sm text-black dark:text-white whitespace-nowrap">Tier</label>
                <select 
                  id="tier-select"
                  value={tier}
                  onChange={(e) => setTier(parseInt(e.target.value, 10))}
                  className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-16 p-1.5 text-center"
                >
                  {[...Array(20)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              {/* Combatant Selector */}
              <div className="flex items-center gap-2">
                <label htmlFor="combatant-select" className="font-bold text-sm text-black dark:text-white whitespace-nowrap">Combatants</label>
                <select 
                  id="combatant-select"
                  value={combatantCount}
                  onChange={(e) => setCombatantCount(parseInt(e.target.value, 10))}
                  className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-16 p-1.5 text-center"
                >
                  {[1, 2, 3].map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              
              {/* Text Size Slider */}
              <div className="flex items-center gap-2">
                <label htmlFor="text-size-slider" className="font-bold text-sm text-black dark:text-white whitespace-nowrap">Button Text</label>
                <input
                  id="text-size-slider"
                  type="range"
                  min="10"
                  max="16"
                  step="0.5"
                  value={buttonTextSize}
                  onChange={(e) => setButtonTextSize(parseFloat(e.target.value))}
                  className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            </div>

            <div className="flex-1 flex justify-end items-center gap-2">
               <a
                href="https://github.com/asterah/chaos-full-nightmare"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label="View source on GitHub"
              >
                <GitHubIcon className="h-5 w-5" />
              </a>
              <button
                onClick={handleThemeToggle}
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label="Toggle theme"
              >
                <ThemeIcon theme={theme} className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className={`w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 grid ${combatantGridClasses[combatantCount]} gap-8`}>
        {combatantsHistories.map((history, index) => (
          <CombatantLayout 
            key={index}
            combatantIndex={index}
            history={history}
            onHistoryChange={(newHistory) => handleHistoryChange(index, newHistory)}
            scoreLimit={scoreLimit}
            combatantCount={combatantCount}
            buttonTextSize={buttonTextSize}
            combatants={COMBATANTS}
            selectedCombatantId={selectedCombatants[index]}
            onCharacterChange={handleCharacterChange}
          />
        ))}
      </main>
    </div>
  );
};

export default App;
