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

  // 1. Load state from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppState;
        
        // Migrate habits to ensure they all have points
        if (parsed.habits) {
          parsed.habits = parsed.habits.map(h => ({
            ...h,
            points: typeof h.points === 'number' ? h.points : 10
          }));
        }

        // Migrate rewards list if missing
        if (!parsed.rewards) {
          parsed.rewards = [
            { id: 'reward_1', name: '看一集喜欢的动画片 📺', pointsRequired: 50, createdAt: Date.now() },
            { id: 'reward_2', name: '吃一次美味冰淇淋 🍦', pointsRequired: 80, createdAt: Date.now() + 1 },
            { id: 'reward_3', name: '买一个精美小玩具 🧸', pointsRequired: 150, createdAt: Date.now() + 2 },
            { id: 'reward_4', name: '去游乐园玩大冒险 🎡', pointsRequired: 300, createdAt: Date.now() + 3 },
            { id: 'reward_5', name: '延长30分钟游戏时间 🎮', pointsRequired: 60, createdAt: Date.now() + 4 },
          ];
        }

        if (!parsed.redemptions) {
          parsed.redemptions = [];
        }

        setAppState(parsed);
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
      console.error('Failed to load application state:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Persist state to LocalStorage whenever it changes
  const updateState = (newState: AppState) => {
    setAppState(newState);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.error('Failed to save application state:', e);
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
