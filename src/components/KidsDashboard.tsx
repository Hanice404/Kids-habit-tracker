import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState, Child, Habit, PunchInLog, Reward } from '../types';
import { renderAvatar, renderHabitIcon } from './SvgIcons';
import { playClickSound, playBubbleSound } from './AudioSynthesizer';
import { 
  Lock, Settings, Sparkles, Trophy, ChevronRight, X, 
  RotateCcw, HelpCircle, Heart, Star, Compass, UserCircle2,
  Gift, Users
} from 'lucide-react';

interface KidsDashboardProps {
  appState: AppState;
  onUpdateState: (newState: AppState) => void;
  onEnterParentPortal: () => void;
  onTriggerCelebration: (habitName: string, isGoalAchieved: boolean) => void;
}

export const KidsDashboard: React.FC<KidsDashboardProps> = ({
  appState,
  onUpdateState,
  onEnterParentPortal,
  onTriggerCelebration,
}) => {
  const activeChild = appState.children.find(c => c.id === appState.activeChildId) || appState.children[0];
  
  // Modals visibility
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [habitToReset, setHabitToReset] = useState<Habit | null>(null);
  const [showParentAuth, setShowParentAuth] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [redemptionSuccess, setRedemptionSuccess] = useState<string | null>(null);

  // Zoom preview image states
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewImageName, setPreviewImageName] = useState<string>('');
  const [selectedRewardForDetail, setSelectedRewardForDetail] = useState<Reward | null>(null);

  // Helper: Get child total earned points
  const getChildEarnedPoints = (childId: string): number => {
    const childLogs = appState.logs.filter(log => log.childId === childId);
    return childLogs.reduce((acc, log) => {
      const habit = appState.habits.find(h => h.id === log.habitId);
      const pts = habit && typeof habit.points === 'number' ? habit.points : 10;
      return acc + pts;
    }, 0);
  };

  // Helper: Get child total spent points
  const getChildSpentPoints = (childId: string): number => {
    const childRedemptions = (appState.redemptions || []).filter(r => r.childId === childId);
    return childRedemptions.reduce((acc, red) => {
      const reward = (appState.rewards || []).find(rew => rew.id === red.rewardId);
      return acc + (reward ? reward.pointsRequired : 0);
    }, 0);
  };

  const currentAvailablePoints = activeChild ? (getChildEarnedPoints(activeChild.id) - getChildSpentPoints(activeChild.id)) : 0;

  // Redeem Reward!
  const handleRedeemReward = (reward: any) => {
    if (!activeChild) return;
    playClickSound();

    if (currentAvailablePoints < reward.pointsRequired) {
      alert('宝贝，积分还不够哦！继续完成好习惯打卡来赚取更多积分吧！💪');
      return;
    }

    const newRedemption = {
      id: 'redeem_' + Math.random().toString(36).substring(2, 9),
      childId: activeChild.id,
      rewardId: reward.id,
      timestamp: Date.now(),
    };

    onUpdateState({
      ...appState,
      redemptions: [...(appState.redemptions || []), newRedemption]
    });

    playBubbleSound();
    setRedemptionSuccess(`恭喜宝贝！成功兑换了【${reward.name}】🎁！快叫爸爸妈妈为你实现吧！✨`);
  };

  // Helper: Get today's date in YYYY-MM-DD
  const getTodayDateString = (): string => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayDateString();

  // Helper: Get how many times a habit was punched in today
  const getTodayCompletedCount = (habitId: string): number => {
    return appState.logs.filter(log => log.habitId === habitId && log.childId === activeChild.id && log.date === todayStr).length;
  };

  // Helper: Get how many days a habit was fully completed (punch-ins >= dailyFrequency)
  const getCompletedDaysCount = (habitId: string): number => {
    if (!activeChild) return 0;
    const habit = appState.habits.find(h => h.id === habitId);
    if (!habit) return 0;
    
    // Filter logs that occurred after the reset timestamp
    const resetKey = `${activeChild.id}_${habitId}`;
    const resetTimestamp = appState.resets?.[resetKey] || 0;
    
    const habitLogs = appState.logs.filter(
      log => log.habitId === habitId && log.childId === activeChild.id && log.timestamp > resetTimestamp
    );
    const dateCounts: Record<string, number> = {};
    habitLogs.forEach(log => {
      dateCounts[log.date] = (dateCounts[log.date] || 0) + 1;
    });
    
    let completedDays = 0;
    Object.keys(dateCounts).forEach(date => {
      if (dateCounts[date] >= habit.dailyFrequency) {
        completedDays++;
      }
    });
    return completedDays;
  };

  // Helper: Get total completed count for a habit
  const getTotalCompletedCount = (habitId: string): number => {
    return appState.logs.filter(log => log.habitId === habitId && log.childId === activeChild.id).length;
  };

  // Switch Active Child Profile
  const handleSelectChild = (childId: string) => {
    playClickSound();
    onUpdateState({
      ...appState,
      activeChildId: childId,
    });
    setShowProfileSelector(false);
  };

  // PUNCH IN ACTION!
  const handlePunchIn = (habit: Habit) => {
    playBubbleSound();
    const completedToday = getTodayCompletedCount(habit.id);
    
    // Check if daily frequency is already hit
    if (completedToday >= habit.dailyFrequency) {
      alert('宝贝，这个习惯今天已经完成全部打卡了哦！真棒！明天继续加油吧！💖');
      return;
    }

    const completedDays = getCompletedDaysCount(habit.id);
    const willCompleteToday = (completedToday + 1) === habit.dailyFrequency;
    const newCompletedDays = willCompleteToday ? completedDays + 1 : completedDays;
    const isGoalAchieved = newCompletedDays >= habit.goalValue;

    // Create punch-in log
    const newLog: PunchInLog = {
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      habitId: habit.id,
      childId: activeChild.id,
      date: todayStr,
      timestamp: Date.now(),
      encouragementText: '宝贝太棒了！打卡完成！✨',
    };

    onUpdateState({
      ...appState,
      logs: [...appState.logs, newLog],
    });

    // Close the floating punch-in overlay
    setSelectedHabit(null);

    // Trigger the success fireworks & character dialog celebration!
    setTimeout(() => {
      onTriggerCelebration(habit.name, isGoalAchieved);
    }, 150);
  };

  // Password submission for parent backend
  const handleAuthSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    playClickSound();

    if (passwordInput === appState.parentPasswordHash) {
      setAuthError('');
      setPasswordInput('');
      setShowParentAuth(false);
      onEnterParentPortal();
    } else {
      setAuthError('密码不正确哦，请家长重新输入 🔒');
      setPasswordInput('');
    }
  };

  const handleKeypadPress = (val: string) => {
    playClickSound();
    if (val === 'C') {
      setPasswordInput('');
    } else if (val === '←') {
      setPasswordInput(prev => prev.slice(0, -1));
    } else {
      setPasswordInput(prev => prev + val);
    }
  };

  // Statistics for active kid
  const activeKidLogs = appState.logs.filter(l => l.childId === activeChild.id);
  const totalCompletedPunches = activeKidLogs.length;
  const completedTodayCount = appState.habits.reduce((acc, h) => {
    const count = getTodayCompletedCount(h.id);
    return acc + (count >= h.dailyFrequency ? 1 : 0);
  }, 0);
  const activeHabitsCount = appState.habits.length;

  return (
    <div className="min-h-screen bg-sky-50/40 pb-12 relative overflow-hidden">
      {/* Playful background stars/bubbles (Soft SVGs) */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-teal-100 rounded-full blur-2xl opacity-40 -z-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-36 h-36 bg-amber-100 rounded-full blur-2xl opacity-40 -z-10"></div>
      <div className="absolute top-40 right-20 w-28 h-28 bg-rose-100 rounded-full blur-2xl opacity-40 -z-10 animate-bounce-slow"></div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        
        {/* Child Top Header Navigation Bar */}
        <header className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/60 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Active Kid Left Details */}
          <div className="flex items-center gap-4 text-left w-full sm:w-auto">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                playClickSound();
                setShowProfileSelector(!showProfileSelector);
              }}
              className="relative cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full border-2 border-rose-300 overflow-hidden shadow-md">
                {renderAvatar(activeChild.avatarId, 'w-full h-full bg-slate-50', activeChild.avatarUrl)}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-rose-400 text-white rounded-full p-1 border border-white">
                <RotateCcw className="w-3 h-3" />
              </div>
            </motion.div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-800">
                  {activeChild.name}的打卡大冒险 🌟
                </h2>
                {appState.children.length > 1 && (
                  <button
                    onClick={() => {
                      playClickSound();
                      setShowProfileSelector(true);
                    }}
                    title="切换宝贝"
                    className="p-1 bg-rose-50 hover:bg-rose-100 rounded-lg text-rose-500 transition active:scale-95 flex items-center justify-center border border-rose-100 shadow-2xs"
                  >
                    <Users className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-amber-500" />
                宝贝，今天也要收获满满的好习惯小星星哦！
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Rewards button */}
            <button
              onClick={() => {
                playClickSound();
                setShowRewardsModal(true);
                setRedemptionSuccess(null);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 via-rose-400 to-rose-500 hover:opacity-90 text-white font-extrabold text-sm flex items-center gap-2 rounded-2xl shadow-sm transition active:scale-95 min-h-[44px]"
            >
              <Gift className="w-4.5 h-4.5 text-white animate-bounce" />
              <span>奖励兑换</span>
            </button>

            {/* Parent Entry Button (Touch targets > 44px) */}
            <button
              onClick={() => {
                playClickSound();
                setShowParentAuth(true);
                setPasswordInput('');
                setAuthError('');
              }}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 rounded-2xl text-slate-600 font-extrabold text-sm flex items-center gap-2 transition active:scale-95 min-h-[44px]"
            >
              <Lock className="w-4 h-4 text-slate-500" />
              家长专区
            </button>
          </div>
        </header>

        {/* Profile Selector Overlay */}
        <AnimatePresence>
          {showProfileSelector && (
            <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setShowProfileSelector(false)}></div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl relative z-10 text-center"
              >
                <h3 className="text-lg font-black text-slate-800 mb-4">切换当前打卡宝贝 👶</h3>
                <div className="space-y-2 mb-4">
                  {appState.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => handleSelectChild(child.id)}
                      className={`w-full p-3 rounded-2xl border flex items-center gap-3 transition ${
                        activeChild.id === child.id 
                          ? 'border-indigo-400 bg-indigo-50/50' 
                          : 'border-slate-200 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        {renderAvatar(child.avatarId, 'w-full h-full', child.avatarUrl)}
                      </div>
                      <span className="font-bold text-sm text-slate-700">{child.name}</span>
                      {activeChild.id === child.id && (
                        <span className="ml-auto text-xs font-bold text-indigo-500 bg-indigo-100 px-2 py-0.5 rounded-full">当前</span>
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowProfileSelector(false)}
                  className="w-full py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm"
                >
                  关闭
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Overall Adventure Progress Dashboard Map */}
        <section className="bg-white/90 border border-slate-200/50 rounded-3xl p-6 shadow-sm mb-8 relative overflow-hidden">
          {/* Wave/Cute accent decoration */}
          <div className="absolute right-0 bottom-0 top-0 w-24 bg-gradient-to-l from-rose-50 to-transparent -z-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Summary counters */}
            <div className="text-left md:col-span-1">
              <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                我的习惯冒险进度条
              </h3>
              <p className="text-2xl font-black text-slate-800 mt-2">
                今日目标：<span className="text-rose-500">{completedTodayCount}</span> / {activeHabitsCount}
              </p>
              <p className="text-xs text-slate-400 mt-2.5">
                你已经累计完成了 <strong className="text-slate-700 font-extrabold">{totalCompletedPunches}</strong> 次好习惯。超级棒！
              </p>
            </div>

            {/* Overall progress gauge */}
            <div className="md:col-span-2 text-left">
              <span className="text-xs font-bold text-slate-500 mb-2 block">今日打卡大满贯进度：</span>
              
              <div className="flex items-center gap-4">
                {/* Outer soft gauge */}
                <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40 p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activeHabitsCount > 0 ? (completedTodayCount / activeHabitsCount) * 100 : 0}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-teal-400 via-amber-400 to-rose-400 rounded-full"
                  />
                </div>
                
                {/* Enlarged and vertically centered percentage */}
                <span className="text-2xl md:text-3xl text-indigo-600 font-black tracking-tight leading-none select-none flex-shrink-0 min-w-[4rem] text-right">
                  {activeHabitsCount > 0 ? Math.round((completedTodayCount / activeHabitsCount) * 100) : 0}%
                </span>
              </div>

              {/* Encouragement message */}
              <p className="text-[11px] text-teal-600 font-extrabold mt-2 animate-pulse">
                {completedTodayCount === activeHabitsCount && activeHabitsCount > 0
                  ? '🌈 哇！今天的所有小习惯全都完成啦！你是最闪耀的习惯小能手！'
                  : '✨ 再完成剩下的习惯，就可以集齐今天的全部太阳徽章哦！冲鸭！'}
              </p>
            </div>

          </div>
        </section>

        {/* Habits flat list grid */}
        {activeHabitsCount === 0 ? (
          <div className="bg-white/80 border border-slate-200/50 rounded-3xl py-16 px-6 text-center shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mx-auto mb-4 border border-indigo-100">
              <HelpCircle className="w-8 h-8" />
            </div>
            <p className="text-slate-800 font-black text-base">目前还没有设置任何习惯打卡项目哦</p>
            <p className="text-slate-400 text-xs mt-1.5 max-w-sm mx-auto">
              请点击右上角的「家长专区」，设置管理密码，然后帮宝贝创建一些有趣的早起、刷牙、整理玩具等好习惯吧。
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-base font-extrabold text-slate-700 mb-4 text-left flex items-center gap-1.5">
              <Star className="w-4.5 h-4.5 text-amber-400 fill-amber-400" />
              点一下卡片就可以打卡哦 🎯
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {appState.habits.map((habit) => {
                const completedToday = getTodayCompletedCount(habit.id);
                const completedDays = getCompletedDaysCount(habit.id);
                const isFullyCompletedToday = completedToday >= habit.dailyFrequency;
                const distanceToGoal = Math.max(0, habit.goalValue - completedDays);

                // Percentage toward overall goal
                const progressPercentage = Math.min(100, Math.round((completedDays / habit.goalValue) * 100));

                return (
                  <motion.div
                    key={habit.id}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      playClickSound();
                      setSelectedHabit(habit);
                    }}
                    className={`rounded-3xl border p-5 shadow-sm hover:shadow-md transition bg-gradient-to-br cursor-pointer flex flex-col justify-between relative overflow-hidden text-left min-h-[190px] ${habit.themeColor}`}
                  >
                    {/* Glowing completion checkmark indicator on top right */}
                    {isFullyCompletedToday && (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow-sm flex items-center justify-center animate-bounce">
                        <svg className="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}

                    {/* Header: Habit Title & SVG Icon */}
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 bg-white/90 rounded-2xl p-2.5 flex items-center justify-center shadow-sm flex-shrink-0">
                        {renderHabitIcon(habit.iconId, 'w-full h-full')}
                      </div>
                      <div className="overflow-hidden pr-2">
                        <h4 className="font-extrabold text-slate-800 text-base leading-tight truncate">{habit.name}</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/70 border border-slate-100 text-[10px] text-slate-500 font-bold">
                            {habit.category === 'hygiene' ? '卫生习惯 🧼' :
                             habit.category === 'sleep' ? '起居习惯 🌙' :
                             habit.category === 'eating' ? '饮食习惯 🍎' :
                             habit.category === 'learning' ? '阅读学习 📚' :
                             habit.category === 'sports' ? '运动/整理 🧸' : '大冒险 ⭐'}
                          </span>
                          <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100/85 border border-amber-200 text-[10px] text-amber-700 font-extrabold">
                            +{habit.points !== undefined ? habit.points : 10} 分 ⭐
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Daily completion visual stars */}
                    <div className="my-3 py-1.5 border-t border-b border-slate-200/30 flex items-center justify-between gap-1.5">
                      <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap flex-shrink-0">今日打卡：</span>
                      <div className="flex flex-wrap gap-1 items-center justify-start flex-1 min-w-0">
                        {Array.from({ length: habit.dailyFrequency }).map((_, i) => {
                          const isLit = i < completedToday;
                          return (
                            <Star
                              key={i}
                              className={`w-4 h-4 transition flex-shrink-0 ${
                                isLit ? 'text-amber-400 fill-amber-400 filter drop-shadow-sm scale-110' : 'text-slate-300'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 font-mono flex-shrink-0 ml-1">
                        {completedToday}/{habit.dailyFrequency}
                      </span>
                    </div>

                    {/* Footer: Progress and target information */}
                    <div>
                      <div className="flex justify-between items-center text-[11px] font-extrabold text-slate-500 mb-1">
                        <span>总进度累计:</span>
                        <span className="font-mono text-slate-700">{completedDays} 天 / {habit.goalValue} 天</span>
                      </div>

                      {/* Micro progress gauge */}
                      <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden p-0.5">
                        <div
                          style={{ width: `${progressPercentage}%` }}
                          className="h-full bg-indigo-400 rounded-full"
                        />
                      </div>

                      {/* Info & optional reset button below progress bar */}
                      <div className="mt-1 flex justify-between items-center min-h-[22px]">
                        <div className="flex-shrink-0">
                          {completedDays >= habit.goalValue && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playClickSound();
                                setHabitToReset(habit);
                              }}
                              className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-[10px] rounded-lg shadow-sm transition active:scale-95 flex items-center gap-0.5 z-10"
                            >
                              <RotateCcw className="w-2.5 h-2.5" />
                              重新开始
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium text-right ml-2 truncate">
                          {distanceToGoal > 0 ? `还差 ${distanceToGoal} 天即可达成终极勋章！` : '🎉 已达成终极目标！太棒了！'}
                        </p>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* FLOATING ACTION MODAL FOR CLICKED HABIT (打卡按钮浮窗) */}
        <AnimatePresence>
          {selectedHabit && (() => {
            const completedToday = getTodayCompletedCount(selectedHabit.id);
            const completedDays = getCompletedDaysCount(selectedHabit.id);
            const isFullyCompletedToday = completedToday >= selectedHabit.dailyFrequency;
            const progressPercentage = Math.min(100, Math.round((completedDays / selectedHabit.goalValue) * 100));

            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop shadow */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedHabit(null)}
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                />

                {/* Floating overlay card */}
                <motion.div
                  initial={{ y: 50, scale: 0.9, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 50, scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-[32px] shadow-2xl border border-slate-100 max-w-sm w-full p-6 relative overflow-hidden z-10 text-center"
                >
                  {/* Decorative bubbles */}
                  <div className="absolute -top-12 -left-12 w-28 h-28 bg-indigo-50 rounded-full blur-xl opacity-80"></div>
                  
                  {/* Close button */}
                  <button
                    onClick={() => {
                      playClickSound();
                      setSelectedHabit(null);
                    }}
                    className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition min-h-[44px]"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Habit Category Banner */}
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 text-slate-500 font-extrabold text-xs mb-4">
                    {selectedHabit.category === 'hygiene' ? '个人卫生大作战 🧼' :
                     selectedHabit.category === 'sleep' ? '作息习惯打擂台 🌙' :
                     selectedHabit.category === 'eating' ? '健康饮食冲冲冲 🍎' :
                     selectedHabit.category === 'learning' ? '绘本知识大闯关 📚' :
                     selectedHabit.category === 'sports' ? '运动自理棒棒哒 🧸' : '好习惯习惯岛屿 ⭐'}
                  </span>

                  {/* Icon illustration */}
                  <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-3xl p-4 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    {renderHabitIcon(selectedHabit.iconId, 'w-full h-full')}
                  </div>

                  <h3 className="text-xl font-black text-slate-800 mb-1">{selectedHabit.name}</h3>
                  <p className="text-xs text-slate-400 mb-2">
                    每日打卡目标：{selectedHabit.dailyFrequency}次 / 今天已成功打卡：{completedToday}次
                  </p>
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-xs text-amber-600 font-extrabold mb-5">
                    <span>每次打卡可得:</span>
                    <strong className="text-amber-500 text-sm font-black animate-pulse font-mono">+{selectedHabit.points !== undefined ? selectedHabit.points : 10}分</strong>
                    <span>⭐</span>
                  </div>

                  {/* Today completion progress graphic */}
                  <div className="flex justify-center gap-3 mb-6">
                    {Array.from({ length: selectedHabit.dailyFrequency }).map((_, i) => {
                      const isLit = i < completedToday;
                      return (
                        <motion.div
                          key={i}
                          animate={isLit ? { scale: [1, 1.2, 1] } : {}}
                          className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all ${
                            isLit ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <Star className={`w-6 h-6 ${isLit ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Giant kid friendly touch button (PUNCH IN ACTION) */}
                  <div className="mb-4">
                    {isFullyCompletedToday ? (
                      <div className="py-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 font-extrabold text-sm px-4">
                        🎉 太赞了！今日任务已完美全部打卡完毕！明天记得再来和我们见面哦！
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => handlePunchIn(selectedHabit)}
                        className="w-full py-4 bg-rose-400 hover:bg-rose-500 text-white text-lg font-black rounded-2xl shadow-lg transition active:scale-95"
                      >
                        我完成了，我要打卡！ 👉 🌟
                      </motion.button>
                    )}
                  </div>

                  {/* Small progress meter detail */}
                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3 text-left">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1">
                      <span>我的总大目标进度条：</span>
                      <span>{completedDays} / {selectedHabit.goalValue} 天</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div style={{ width: `${progressPercentage}%` }} className="h-full bg-rose-400" />
                    </div>
                  </div>

                  {completedDays >= selectedHabit.goalValue && (
                    <div className="mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playClickSound();
                          setHabitToReset(selectedHabit);
                          setSelectedHabit(null); // Close the detail modal
                        }}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        重新开始大冒险
                      </button>
                    </div>
                  )}

                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>

        {/* REWARDS EXCHANGE MODAL */}
        <AnimatePresence>
          {showRewardsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowRewardsModal(false)}></div>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-[32px] max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl relative z-10 flex flex-col border border-slate-100 animate-fade-in"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-rose-500 p-6 text-white text-center relative flex-shrink-0">
                  <button
                    onClick={() => {
                      playClickSound();
                      setShowRewardsModal(false);
                    }}
                    className="absolute right-4 top-4 p-1.5 hover:bg-white/20 rounded-full transition text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl animate-spin-slow">
                      🎁
                    </div>
                  </div>
                  <h3 className="text-lg font-black">{activeChild.name} 的习惯奖励兑换中心</h3>
                  <p className="text-xs text-white/90 mt-1">用累积的习惯打卡积分，兑换爸爸妈妈为你准备的神奇奖励吧！</p>
                </div>

                {/* Body Content - Scrollable */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
                  {/* Scoreboard Info */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        {renderAvatar(activeChild.avatarId, 'w-full h-full', activeChild.avatarUrl)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">{activeChild.name}</h4>
                        <p className="text-xs text-slate-400">目前可用星星总分</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-amber-500 flex items-center gap-1 justify-end">
                        <span>{currentAvailablePoints}</span>
                        <span className="text-xs font-bold text-slate-400">分</span>
                      </p>
                      <p className="text-[10px] text-amber-400 font-bold">小积分兑换大梦想 ✨</p>
                    </div>
                  </div>

                  {/* Redemption success message alert */}
                  {redemptionSuccess && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-50 border border-emerald-200/60 p-4 rounded-2xl text-emerald-700 text-xs font-bold text-center leading-relaxed"
                    >
                      {redemptionSuccess}
                    </motion.div>
                  )}

                  {/* Rewards items list */}
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                      梦想礼物列表
                    </h4>

                    {(!appState.rewards || appState.rewards.length === 0) ? (
                      <div className="text-center py-8 bg-white border border-slate-150 rounded-2xl">
                        <p className="text-xs font-bold text-slate-400">
                          爸爸妈妈还没有配置奖励列表哦，<br />
                          快提醒他们在“家长专区 - 奖励清单”里添加吧！💖
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {appState.rewards.map((reward) => {
                          const canRedeem = currentAvailablePoints >= reward.pointsRequired;
                          return (
                            <div
                              key={reward.id}
                              onClick={() => {
                                playClickSound();
                                setSelectedRewardForDetail(reward);
                              }}
                              className={`p-4 rounded-2xl border bg-white flex flex-col justify-between gap-3 shadow-xs transition hover:border-amber-200 cursor-pointer hover:shadow-sm ${
                                canRedeem ? 'border-slate-150' : 'border-slate-100 opacity-90'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {reward.imageUrl ? (
                                  <div 
                                    className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0 shadow-xs bg-white"
                                  >
                                    <img 
                                      src={reward.imageUrl} 
                                      alt={reward.name} 
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                ) : (
                                  <span className="text-2xl flex-shrink-0 p-1.5 bg-rose-50 rounded-2xl">🎁</span>
                                )}
                                <div className="text-left overflow-hidden flex-1">
                                  <h5 className="font-extrabold text-sm text-slate-800 truncate">{reward.name}</h5>
                                  <p className="text-xs text-amber-500 font-extrabold mt-1">
                                    所需积分: {reward.pointsRequired} 分
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playClickSound();
                                  handleRedeemReward(reward);
                                }}
                                className={`w-full py-2 rounded-xl text-xs font-extrabold transition-all transform active:scale-95 ${
                                  canRedeem
                                    ? 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white shadow-xs cursor-pointer'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed font-medium'
                                }`}
                              >
                                {canRedeem ? '我要兑换 🎁' : `还差 ${reward.pointsRequired - currentAvailablePoints} 分`}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Redemptions History */}
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-rose-400" />
                      已兑换的魔法记录
                    </h4>
                    {(!appState.redemptions || appState.redemptions.filter(r => r.childId === activeChild.id).length === 0) ? (
                      <p className="text-center py-6 text-xs font-medium text-slate-400 bg-white border border-slate-100 rounded-2xl">
                        还没有兑换记录哦，快去赚积分兑换你的第一个愿望吧！✨
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                        {appState.redemptions
                          .filter(red => red.childId === activeChild.id)
                          .sort((a, b) => b.timestamp - a.timestamp)
                          .map((red) => {
                            const reward = (appState.rewards || []).find(rew => rew.id === red.rewardId);
                            const rewardName = reward ? reward.name : '已删除奖励';
                            const rewardPoints = reward ? reward.pointsRequired : 0;
                            const timeStr = new Date(red.timestamp).toLocaleDateString() + ' ' + new Date(red.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                            return (
                              <div
                                key={red.id}
                                className="px-3.5 py-2.5 bg-white border border-slate-100 rounded-xl flex items-center justify-between text-xs gap-3"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {reward && reward.imageUrl ? (
                                    <div 
                                      onClick={() => {
                                        playClickSound();
                                        setPreviewImageUrl(reward.imageUrl || null);
                                        setPreviewImageName(rewardName);
                                      }}
                                      className="w-7 h-7 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0 cursor-zoom-in hover:scale-110 active:scale-95 transition-all duration-200"
                                      title="点击放大预览"
                                    >
                                      <img src={reward.imageUrl} alt={rewardName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    </div>
                                  ) : (
                                    <span className="text-sm">🎁</span>
                                  )}
                                  <div className="text-left min-w-0">
                                    <p className="font-extrabold text-slate-700 truncate">{rewardName}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{timeStr}</p>
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 font-extrabold text-[10px] rounded-full">
                                    兑换成功 🎊
                                  </span>
                                  <p className="text-[10px] text-slate-400 mt-0.5 font-bold">-{rewardPoints} 分</p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
                  <button
                    onClick={() => {
                      playClickSound();
                      setShowRewardsModal(false);
                    }}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-2xl text-sm transition"
                  >
                    我知道啦，继续好习惯之旅！🚀
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* PARENTAL PASSWORD SECURITY MODAL */}
        <AnimatePresence>
          {showParentAuth && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowParentAuth(false)}></div>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-2xl relative z-10 text-center border border-slate-100"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center border border-indigo-100">
                    <Lock className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-base font-black text-slate-800">密码安全锁 🔑</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">为了保护数据安全，本功能仅限宝贝的爸爸妈妈进入。</p>

                {authError && (
                  <p className="text-xs text-rose-500 font-bold mb-3">{authError}</p>
                )}

                {/* Simulated Parent Password Input Display */}
                <div className="flex justify-center gap-2 mb-4">
                  {Array.from({ length: Math.max(4, passwordInput.length) }).map((_, i) => {
                    const char = passwordInput[i];
                    return (
                      <div
                        key={i}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono text-base font-black ${
                          char ? 'border-indigo-400 bg-indigo-50/20 text-indigo-600' : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        {char ? '●' : ''}
                      </div>
                    );
                  })}
                </div>

                {/* Parent Numeric Keypad Grid for Tablet Screens */}
                <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto mb-5">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '←'].map((key) => (
                    <button
                      key={key}
                      onClick={() => handleKeypadPress(key)}
                      className={`h-11 rounded-xl text-sm font-black transition flex items-center justify-center ${
                        key === 'C' || key === '←'
                          ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-150 shadow-sm'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowParentAuth(false)}
                    className="w-1/2 py-2.5 bg-slate-100 text-slate-600 font-extrabold rounded-xl text-xs transition"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => handleAuthSubmit()}
                    className="w-1/2 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold rounded-xl text-xs shadow-md transition"
                  >
                    确定进入
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* REWARD DETAIL VIEW MODAL */}
        <AnimatePresence>
          {selectedRewardForDetail && (() => {
            const canRedeem = currentAvailablePoints >= selectedRewardForDetail.pointsRequired;
            const progressRatio = Math.min(1, currentAvailablePoints / selectedRewardForDetail.pointsRequired);
            const progressPercentage = Math.round(progressRatio * 100);

            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedRewardForDetail(null)}
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                />

                {/* Floating card */}
                <motion.div
                  initial={{ y: 50, scale: 0.9, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 50, scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-[32px] shadow-2xl border border-slate-100 max-w-sm w-full p-6 relative overflow-hidden z-10 text-center"
                >
                  {/* Decorative background stars */}
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-amber-50 to-transparent -z-10" />

                  {/* Close button */}
                  <button
                    onClick={() => {
                      playClickSound();
                      setSelectedRewardForDetail(null);
                    }}
                    className="absolute top-4 right-4 p-2 bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full transition active:scale-95"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="mt-3 flex flex-col items-center">
                    {/* Reward Image or Emoji */}
                    {selectedRewardForDetail.imageUrl ? (
                      <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-amber-200 shadow-md bg-white mb-4">
                        <img
                          src={selectedRewardForDetail.imageUrl}
                          alt={selectedRewardForDetail.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-5xl shadow-sm mb-4">
                        🎁
                      </div>
                    )}

                    <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-black mb-2">
                      🏆 梦想礼物详情
                    </span>

                    <h4 className="text-xl font-black text-slate-800 mb-1 px-4 leading-snug">
                      {selectedRewardForDetail.name}
                    </h4>

                    <p className="text-base font-extrabold text-amber-500 mb-4">
                      兑换所需积分：{selectedRewardForDetail.pointsRequired} 分
                    </p>

                    {/* Progress representation */}
                    <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
                        <span>{activeChild.name} 的当前积分:</span>
                        <span className="text-slate-700 font-extrabold">{currentAvailablePoints} 分</span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-3 bg-slate-200/60 rounded-full overflow-hidden p-0.5 mb-2">
                        <div
                          style={{ width: `${progressPercentage}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            canRedeem ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-indigo-400'
                          }`}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                        <span>进度: {progressPercentage}%</span>
                        <span>
                          {canRedeem 
                            ? '🎉 积分已足够，可以兑换啦！' 
                            : `还差 ${selectedRewardForDetail.pointsRequired - currentAvailablePoints} 分`
                          }
                        </span>
                      </div>
                    </div>

                    {/* Action button */}
                    <button
                      onClick={() => {
                        setSelectedRewardForDetail(null);
                        handleRedeemReward(selectedRewardForDetail);
                      }}
                      className={`w-full py-3 rounded-2xl text-sm font-extrabold shadow-sm transition-all transform active:scale-95 ${
                        canRedeem
                          ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 hover:opacity-95 text-white cursor-pointer'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed font-medium'
                      }`}
                    >
                      {canRedeem ? '确认兑换此奖励 🎁' : `努力赚取积分中 (还差 ${selectedRewardForDetail.pointsRequired - currentAvailablePoints} 分)`}
                    </button>
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>

        {/* REWARD IMAGE ZOOM PREVIEW MODAL */}
        <AnimatePresence>
          {previewImageUrl && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                onClick={() => setPreviewImageUrl(null)}
              />
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 15 }}
                className="bg-white rounded-[32px] p-4 max-w-md w-full shadow-2xl relative z-10 border border-slate-100 flex flex-col items-center animate-fade-in"
              >
                {/* Header/Close button */}
                <div className="w-full flex justify-between items-center mb-3 px-2">
                  <h4 className="font-extrabold text-sm text-slate-800 truncate max-w-[80%]">
                    ✨ {previewImageName || '礼物图片预览'}
                  </h4>
                  <button 
                    onClick={() => {
                      playClickSound();
                      setPreviewImageUrl(null);
                    }}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full transition active:scale-95"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Main image */}
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center relative">
                  <img 
                    src={previewImageUrl} 
                    alt={previewImageName || '礼物大图'} 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <p className="text-[10px] text-slate-400 mt-3 text-center">
                  点击背景或右上角按钮即可关闭预览 🎈
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* CUSTOM CONFIRMATION FOR HABIT RESTART (重新开始二次确认) */}
        <AnimatePresence>
          {habitToReset && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                onClick={() => setHabitToReset(null)}
              />
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 15 }}
                className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-2xl relative z-10 border border-slate-100 text-center flex flex-col items-center animate-fade-in"
              >
                {/* Thinking mascot icon */}
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center border border-amber-200/50 mb-4 text-3xl shadow-sm">
                  🤔
                </div>

                <h3 className="text-lg font-black text-slate-800 mb-2">
                  确定要重新开始大冒险吗？
                </h3>
                
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  重新开始【<span className="font-bold text-indigo-600">{habitToReset.name}</span>】后，宝贝在这个习惯的<span className="font-extrabold text-amber-600">“总进度累计”将重置</span>。
                  <br />
                  <span className="text-[11px] block mt-2 text-emerald-600 font-bold">✨ 放心：积分、兑换礼物和今日已打卡记录都会保留！</span>
                </p>

                {/* Confirm & Cancel buttons */}
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => {
                      playClickSound();
                      setHabitToReset(null);
                    }}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-sm rounded-2xl transition active:scale-95"
                  >
                    保留进度
                  </button>
                  <button
                    onClick={() => {
                      playBubbleSound();
                      const key = `${activeChild.id}_${habitToReset.id}`;
                      const updatedResets = {
                        ...(appState.resets || {}),
                        [key]: Date.now(),
                      };
                      onUpdateState({
                        ...appState,
                        resets: updatedResets,
                      });
                      setHabitToReset(null);
                    }}
                    className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm rounded-2xl shadow-md transition active:scale-95"
                  >
                    确定重新开始
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
