/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState } from './types';
import { InitializationForm } from './components/InitializationForm';
import { KidsDashboard } from './components/KidsDashboard';
import { ParentPortal } from './components/ParentPortal';
import { SuccessCelebration } from './components/SuccessCelebration';
import { renderAvatar } from './components/SvgIcons';
import { Sparkles, Star, Moon, Calendar, HelpCircle } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'children_habit_tracker_state_v2';

export default function App() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [isParentPortalOpen, setIsParentPortalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Celebration state
  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    habitName: string;
    isGoalAchieved: boolean;
  }>({
    isOpen: false,
    habitName: '',
    isGoalAchieved: false,
  });

  // 1. Load state from server (with localStorage migration fallback) on mount
  useEffect(() => {
    async function fetchState() {
      try {
        const response = await fetch('/api/state');
        const result = await response.json();
        
        let stateToUse: AppState | null = null;
        
        if (result.success && result.state && result.state.isInitialized) {
          stateToUse = result.state;
        } else {
          // If server state is not initialized, check for legacy localStorage data to migrate
          const legacyStored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (legacyStored) {
            try {
              const legacyParsed = JSON.parse(legacyStored) as AppState;
              if (legacyParsed.isInitialized) {
                console.log('Migrating legacy localStorage state to server...');
                stateToUse = legacyParsed;
                // Save it to the server so it is persisted permanently
                await fetch('/api/state', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ state: legacyParsed }),
                });
              }
            } catch (err) {
              console.error('Failed to parse legacy state:', err);
            }
          }
        }

        if (stateToUse) {
          // Migrate habits to ensure they all have points
          if (stateToUse.habits) {
            stateToUse.habits = stateToUse.habits.map(h => ({
              ...h,
              points: typeof h.points === 'number' ? h.points : 10
            }));
          }

          // Migrate rewards list if missing
          if (!stateToUse.rewards || stateToUse.rewards.length === 0) {
            stateToUse.rewards = [
              { id: 'reward_1', name: '看一集喜欢的动画片 📺', pointsRequired: 50, createdAt: Date.now() },
              { id: 'reward_2', name: '吃一次美味冰淇淋 🍦', pointsRequired: 80, createdAt: Date.now() + 1 },
              { id: 'reward_3', name: '买一个精美小玩具 🧸', pointsRequired: 150, createdAt: Date.now() + 2 },
              { id: 'reward_4', name: '去游乐园玩大冒险 🎡', pointsRequired: 300, createdAt: Date.now() + 3 },
              { id: 'reward_5', name: '延长30分钟游戏时间 🎮', pointsRequired: 60, createdAt: Date.now() + 4 },
            ];
          }

          if (!stateToUse.redemptions) {
            stateToUse.redemptions = [];
          }

          setAppState(stateToUse);
        } else {
          // First time initialization required
          setAppState({
            children: [],
            activeChildId: null,
            habits: [],
            logs: [],
            parentPasswordHash: '',
            isInitialized: false,
            rewards: [],
            redemptions: [],
          });
        }
      } catch (e) {
        console.error('Failed to load application state from server:', e);
        // Absolute fallback to localStorage if server is down
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          try {
            setAppState(JSON.parse(stored));
          } catch {
            // ignore
          }
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchState();
  }, []);

  // 2. Persist state to Server (and backup to LocalStorage) whenever it changes
  const updateState = async (newState: AppState) => {
    // Optimistic UI update
    setAppState(newState);
    
    // Save to server
    try {
      const response = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: newState }),
      });
      const result = await response.json();
      if (!result.success) {
        console.error('Server failed to persist state:', result.error);
      }
    } catch (e) {
      console.error('Failed to save state to server:', e);
    }

    // Also write to local storage as backup
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.error('Failed to save application state backup:', e);
    }
  };

  const handleInitialize = (initialState: AppState) => {
    updateState(initialState);
  };

  const handleTriggerCelebration = (habitName: string, isGoalAchieved: boolean) => {
    setCelebration({
      isOpen: true,
      habitName,
      isGoalAchieved,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-500 font-medium">
        <div className="w-12 h-12 border-4 border-rose-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-slate-400">正在进入习惯奇妙世界...</p>
      </div>
    );
  }

  if (!appState) return null;

  // Render Initialization Flow if not initialized yet
  if (!appState.isInitialized) {
    return <InitializationForm onInitialize={handleInitialize} />;
  }

  // Active child for rendering reference
  const activeChild = appState.children.find(c => c.id === appState.activeChildId) || appState.children[0];

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col justify-between">
      
      {/* Dynamic Celebration Overlay */}
      {activeChild && (
        <SuccessCelebration
          isOpen={celebration.isOpen}
          childName={activeChild.name}
          avatarId={activeChild.avatarId}
          habitName={celebration.habitName}
          isGoalAchieved={celebration.isGoalAchieved}
          onClose={() => setCelebration(prev => ({ ...prev, isOpen: false }))}
        />
      )}

      {/* Main screen router */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          {isParentPortalOpen ? (
            <motion.div
              key="parent-portal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ParentPortal
                appState={appState}
                onUpdateState={updateState}
                onExit={() => setIsParentPortalOpen(false)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="kids-dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <KidsDashboard
                appState={appState}
                onUpdateState={updateState}
                onEnterParentPortal={() => setIsParentPortalOpen(true)}
                onTriggerCelebration={handleTriggerCelebration}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Shared Footer containing visual credits (Hiding internal paths, purely polished) */}
      <footer className="py-6 border-t border-slate-200/40 bg-white/40 backdrop-blur-sm text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium text-slate-400">
            © 2026 宝贝习惯大冒险助手 • 让成长充满惊喜 ✨
          </p>
          <div className="flex gap-4 font-semibold text-slate-400/80">
            <span>卡通手绘矢量 SVG 技术</span>
            <span>•</span>
            <span>Web Audio 趣味声效合成</span>
            <span>•</span>
            <span>家长密码保险箱</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
