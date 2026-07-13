import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState, Child, Habit, HabitCategory, PunchInLog } from '../types';
import { renderAvatar, renderHabitIcon } from './SvgIcons';
import { playClickSound, playSuccessSound } from './AudioSynthesizer';
import { 
  Plus, Trash2, Edit3, Save, ArrowLeft, Users, CheckSquare, 
  History, Settings, Star, AlertTriangle, Search, Info, Lock,
  Trophy, Gift, X
} from 'lucide-react';

interface ParentPortalProps {
  appState: AppState;
  onUpdateState: (newState: AppState) => void;
  onExit: () => void;
}

const PRESET_ICONS = ['toothbrush', 'moon', 'sun', 'book', 'apple', 'toybox', 'water', 'running', 'custom'];
const THEME_COLORS = [
  { class: 'from-sky-100 to-blue-50 border-sky-200', name: '温柔晴空蓝' },
  { class: 'from-rose-100 to-pink-50 border-rose-200', name: '梦幻草莓粉' },
  { class: 'from-purple-100 to-indigo-50 border-purple-200', name: '宁静薰衣紫' },
  { class: 'from-emerald-100 to-green-50 border-emerald-200', name: '清新薄荷绿' },
  { class: 'from-amber-100 to-orange-50 border-amber-200', name: '温暖蜜桔橙' },
  { class: 'from-indigo-100 to-violet-50 border-indigo-200', name: '奇妙太空白' },
];

export const ParentPortal: React.FC<ParentPortalProps> = ({ appState, onUpdateState, onExit }) => {
  const [activeTab, setActiveTab] = useState<'habits' | 'rewards' | 'children' | 'logs' | 'password'>('habits');
  
  // Password form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // Habit form states
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [habitName, setHabitName] = useState('');
  const [habitCategory, setHabitCategory] = useState<HabitCategory>('custom');
  const [habitIconId, setHabitIconId] = useState('custom');
  const [habitGoalValue, setHabitGoalValue] = useState(21);
  const [habitDailyFrequency, setHabitDailyFrequency] = useState(1);
  const [habitThemeColor, setHabitThemeColor] = useState(THEME_COLORS[0].class);
  const [habitPoints, setHabitPoints] = useState(10);
  const [habitError, setHabitError] = useState('');

  // Reward form states
  const [editingRewardId, setEditingRewardId] = useState<string | null>(null);
  const [rewardName, setRewardName] = useState('');
  const [rewardPointsRequired, setRewardPointsRequired] = useState(50);
  const [rewardImageUrl, setRewardImageUrl] = useState('');
  const [isDraggingRewardIcon, setIsDraggingRewardIcon] = useState(false);
  const [rewardError, setRewardError] = useState('');

  // Custom iframe-friendly confirm and alert states
  const [childToDelete, setChildToDelete] = useState<string | null>(null);
  const [rewardToDelete, setRewardToDelete] = useState<string | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const processRewardIconFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setRewardError('请上传有效的图片文件哦 📸');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setRewardError('图片文件太大啦，不能超过 10MB 哦！');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setRewardImageUrl(e.target.result as string);
        setRewardError('');
      }
    };
    reader.onerror = () => {
      setRewardError('读取图片文件失败，请重试');
    };
    reader.readAsDataURL(file);
  };

  const handleRewardIconDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingRewardIcon(true);
  };

  const handleRewardIconDragLeave = () => {
    setIsDraggingRewardIcon(false);
  };

  const handleRewardIconDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingRewardIcon(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processRewardIconFile(e.dataTransfer.files[0]);
    }
  };

  const handleRewardIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processRewardIconFile(e.target.files[0]);
    }
  };

  // Child form states
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [childName, setChildName] = useState('');
  const [childAvatarId, setChildAvatarId] = useState('babyshark');
  const [childError, setChildError] = useState('');

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // ==========================================
  // HABIT ACTIONS
  // ==========================================
  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();

    if (!habitName.trim()) {
      setHabitError('请输入习惯名称，例如：按时午睡');
      return;
    }

    let updatedHabits = [...appState.habits];

    if (editingHabitId) {
      // Edit mode
      updatedHabits = updatedHabits.map(h => h.id === editingHabitId ? {
        ...h,
        name: habitName.trim(),
        category: habitCategory,
        iconId: habitIconId,
        goalValue: Number(habitGoalValue),
        dailyFrequency: Number(habitDailyFrequency),
        themeColor: habitThemeColor,
        points: Number(habitPoints),
      } : h);
    } else {
      // Add mode
      const newHabit: Habit = {
        id: 'habit_' + Math.random().toString(36).substring(2, 9),
        name: habitName.trim(),
        category: habitCategory,
        iconId: habitIconId,
        goalValue: Number(habitGoalValue),
        dailyFrequency: Number(habitDailyFrequency),
        themeColor: habitThemeColor,
        createdAt: Date.now(),
        points: Number(habitPoints),
      };
      updatedHabits.push(newHabit);
    }

    onUpdateState({
      ...appState,
      habits: updatedHabits,
    });

    // Reset Form
    resetHabitForm();
  };

  const handleEditHabit = (habit: Habit) => {
    playClickSound();
    setEditingHabitId(habit.id);
    setHabitName(habit.name);
    setHabitCategory(habit.category);
    setHabitIconId(habit.iconId);
    setHabitGoalValue(habit.goalValue);
    setHabitDailyFrequency(habit.dailyFrequency);
    setHabitThemeColor(habit.themeColor);
    setHabitPoints(habit.points !== undefined ? habit.points : 10);
    setHabitError('');
  };

  const handleDeleteHabit = (id: string) => {
    playClickSound();
    setHabitToDelete(id);
  };

  const confirmDeleteHabit = () => {
    if (!habitToDelete) return;
    playClickSound();
    const id = habitToDelete;
    const filteredHabits = appState.habits.filter(h => h.id !== id);
    const filteredLogs = appState.logs.filter(l => l.habitId !== id);

    onUpdateState({
      ...appState,
      habits: filteredHabits,
      logs: filteredLogs,
    });
    setHabitToDelete(null);
  };

  const resetHabitForm = () => {
    setEditingHabitId(null);
    setHabitName('');
    setHabitCategory('custom');
    setHabitIconId('custom');
    setHabitGoalValue(21);
    setHabitDailyFrequency(1);
    setHabitThemeColor(THEME_COLORS[0].class);
    setHabitPoints(10);
    setHabitError('');
  };

  // ==========================================
  // REWARD ACTIONS
  // ==========================================
  const handleSaveReward = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();

    if (!rewardName.trim()) {
      setRewardError('请输入奖励名称');
      return;
    }

    if (Number(rewardPointsRequired) <= 0) {
      setRewardError('所需分值必须大于0分');
      return;
    }

    let updatedRewards = [...(appState.rewards || [])];

    if (editingRewardId) {
      // Edit mode
      updatedRewards = updatedRewards.map(r => r.id === editingRewardId ? {
        ...r,
        name: rewardName.trim(),
        pointsRequired: Number(rewardPointsRequired),
        imageUrl: rewardImageUrl || undefined,
      } : r);
    } else {
      // Add mode
      const newReward = {
        id: 'reward_' + Math.random().toString(36).substring(2, 9),
        name: rewardName.trim(),
        pointsRequired: Number(rewardPointsRequired),
        createdAt: Date.now(),
        imageUrl: rewardImageUrl || undefined,
      };
      updatedRewards.push(newReward);
    }

    onUpdateState({
      ...appState,
      rewards: updatedRewards,
    });

    resetRewardForm();
  };

  const handleEditReward = (reward: any) => {
    playClickSound();
    setEditingRewardId(reward.id);
    setRewardName(reward.name);
    setRewardPointsRequired(reward.pointsRequired);
    setRewardImageUrl(reward.imageUrl || '');
    setRewardError('');
  };

  const handleDeleteReward = (id: string) => {
    playClickSound();
    setRewardToDelete(id);
  };

  const confirmDeleteReward = () => {
    if (!rewardToDelete) return;
    playClickSound();
    const filteredRewards = (appState.rewards || []).filter(r => r.id !== rewardToDelete);

    onUpdateState({
      ...appState,
      rewards: filteredRewards,
    });
    setRewardToDelete(null);
  };

  const resetRewardForm = () => {
    setEditingRewardId(null);
    setRewardName('');
    setRewardPointsRequired(50);
    setRewardImageUrl('');
    setRewardError('');
  };

  // ==========================================
  // CHILD ACTIONS
  // ==========================================
  const handleSaveChild = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();

    if (!childName.trim()) {
      setChildError('请输入宝贝的昵称');
      return;
    }

    let updatedChildren = [...appState.children];
    let activeId = appState.activeChildId;

    if (editingChildId) {
      // Edit child
      updatedChildren = updatedChildren.map(c => c.id === editingChildId ? {
        ...c,
        name: childName.trim(),
        avatarId: childAvatarId,
      } : c);
    } else {
      // Add child
      const childId = 'child_' + Math.random().toString(36).substring(2, 9);
      const newChild: Child = {
        id: childId,
        name: childName.trim(),
        avatarId: childAvatarId,
      };
      updatedChildren.push(newChild);
      if (!activeId) activeId = childId;
    }

    onUpdateState({
      ...appState,
      children: updatedChildren,
      activeChildId: activeId,
    });

    resetChildForm();
  };

  const handleEditChild = (child: Child) => {
    playClickSound();
    setEditingChildId(child.id);
    setChildName(child.name);
    setChildAvatarId(child.avatarId);
    setChildError('');
  };

  const handleDeleteChild = (id: string) => {
    playClickSound();
    if (appState.children.length <= 1) {
      setAlertMessage('必须保留至少一名宝贝档案哦！');
      return;
    }
    setChildToDelete(id);
  };

  const confirmDeleteChild = () => {
    if (!childToDelete) return;
    playClickSound();
    const id = childToDelete;
    const filteredChildren = appState.children.filter(c => c.id !== id);
    const filteredLogs = appState.logs.filter(l => l.childId !== id);
    let activeId = appState.activeChildId;
    if (activeId === id) {
      activeId = filteredChildren[0]?.id || '';
    }

    onUpdateState({
      ...appState,
      children: filteredChildren,
      activeChildId: activeId,
      logs: filteredLogs,
    });
    setChildToDelete(null);
  };

  const confirmDeleteLog = () => {
    if (!logToDelete) return;
    playClickSound();
    onUpdateState({
      ...appState,
      logs: appState.logs.filter(l => l.id !== logToDelete),
    });
    setLogToDelete(null);
  };

  const handleFactoryReset = () => {
    playClickSound();
    onUpdateState({
      children: [],
      activeChildId: null,
      habits: [],
      logs: [],
      parentPasswordHash: '',
      isInitialized: false,
      rewards: [],
      redemptions: [],
    });
    setShowResetConfirm(false);
    onExit();
  };

  const resetChildForm = () => {
    setEditingChildId(null);
    setChildName('');
    setChildAvatarId('babyshark');
    setChildError('');
  };

  // ==========================================
  // PASSWORD ACTIONS
  // ==========================================
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('请输入当前家长密码');
      playClickSound();
      return;
    }
    if (currentPassword !== appState.parentPasswordHash) {
      setPasswordError('当前家长密码不正确，请重新输入');
      playClickSound();
      return;
    }
    if (!newPassword) {
      setPasswordError('请输入新密码');
      playClickSound();
      return;
    }
    if (!/^\d+$/.test(newPassword)) {
      setPasswordError('新密码只允许包含 0-9 的纯数字哦！');
      playClickSound();
      return;
    }
    if (newPassword.length < 4) {
      setPasswordError('新密码长度不能少于 4 位');
      playClickSound();
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError('新密码不能与当前密码相同');
      playClickSound();
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('两次输入的新密码不一致，请重新检查');
      playClickSound();
      return;
    }

    // Save password
    onUpdateState({
      ...appState,
      parentPasswordHash: newPassword
    });

    playSuccessSound();
    setPasswordSuccess('家长管理密码已成功修改！✨');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  // ==========================================
  // RENDER HELPERS & STATS
  // ==========================================
  const totalLogs = appState.logs.length;
  const uniqueHabitsCount = appState.habits.length;
  const childrenCount = appState.children.length;

  const filteredLogsList = appState.logs
    .filter(log => {
      const child = appState.children.find(c => c.id === log.childId);
      const habit = appState.habits.find(h => h.id === log.habitId);
      const searchStr = `${child?.name || ''} ${habit?.name || ''} ${log.date}`.toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      {/* Admin Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playClickSound();
                onExit();
              }}
              className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-600 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-semibold hidden sm:inline">返回宝贝打卡</span>
            </button>
            <div className="h-6 w-[1px] bg-slate-200"></div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                <Settings className="w-5 h-5 text-indigo-500 animate-spin-slow" />
                家长管理后台
              </h1>
              <p className="text-xs text-slate-400">专为家长设计的参数控制与打卡审计中心</p>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-slate-400 font-medium">累计打卡次数</p>
              <p className="text-lg font-black text-emerald-500">{totalLogs} <span className="text-xs font-normal text-slate-400">次</span></p>
            </div>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-medium">配置习惯项目</p>
              <p className="text-lg font-black text-indigo-500">{uniqueHabitsCount} <span className="text-xs font-normal text-slate-400">个</span></p>
            </div>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-medium">宝贝成员</p>
              <p className="text-lg font-black text-rose-500">{childrenCount} <span className="text-xs font-normal text-slate-400">人</span></p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap sm:flex-nowrap bg-slate-200/60 p-1 rounded-2xl max-w-2xl mb-8 gap-1 sm:gap-0">
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('habits');
            }}
            className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 ${
              activeTab === 'habits' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            习惯管理
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('rewards');
            }}
            className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 ${
              activeTab === 'rewards' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Gift className="w-4 h-4" />
            奖励清单
          </button>
          
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('children');
            }}
            className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 ${
              activeTab === 'children' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            宝贝档案
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('logs');
            }}
            className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 ${
              activeTab === 'logs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <History className="w-4 h-4" />
            打卡明细
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('password');
            }}
            className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 ${
              activeTab === 'password' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Settings className="w-4 h-4" />
            系统设置
          </button>
        </div>

        {/* Tab 1: HABITS MANAGEMENT */}
        {activeTab === 'habits' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-1 h-fit">
              <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Edit3 className="w-4 h-4 text-indigo-500" />
                {editingHabitId ? '编辑习惯项目' : '增加全新习惯'}
              </h3>

              {habitError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl mb-4">
                  {habitError}
                </div>
              )}

              <form onSubmit={handleSaveHabit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">习惯项目名称</label>
                  <input
                    type="text"
                    placeholder="输入习惯名称，如: 认真洗手 🧼"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    maxLength={30}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">日常大类</label>
                    <select
                      value={habitCategory}
                      onChange={(e) => setHabitCategory(e.target.value as HabitCategory)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    >
                      <option value="hygiene">个人卫生 🧼</option>
                      <option value="sleep">起居作息 🌙</option>
                      <option value="eating">健康饮食 🍎</option>
                      <option value="learning">学习绘本 📚</option>
                      <option value="sports">运动劳动 🧸</option>
                      <option value="custom">其他习惯 ⭐</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">每日打卡频次</label>
                    <select
                      value={habitDailyFrequency}
                      onChange={(e) => setHabitDailyFrequency(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    >
                      <option value={1}>每天 1 次</option>
                      <option value={2}>每天 2 次</option>
                      <option value={3}>每天 3 次</option>
                      <option value={4}>每天 4 次</option>
                      <option value={5}>每天 5 次</option>
                      <option value={6}>每天 6 次</option>
                      <option value={7}>每天 7 次</option>
                      <option value={8}>每天 8 次</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">总目标打卡天数</label>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={habitGoalValue}
                      onChange={(e) => setHabitGoalValue(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">精美图标</label>
                    <select
                      value={habitIconId}
                      onChange={(e) => setHabitIconId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    >
                      <option value="universal">🚀 通用航天火箭</option>
                      <option value="toothbrush">智能牙刷</option>
                      <option value="moon">瞌睡月亮</option>
                      <option value="sun">灿烂太阳</option>
                      <option value="book">魔力课本</option>
                      <option value="apple">快乐苹果</option>
                      <option value="toybox">神奇玩具箱</option>
                      <option value="water">小水杯</option>
                      <option value="running">弹力球</option>
                      <option value="custom">黄金星星徽章</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">打卡奖励积分分值 (手动输入) ⭐</label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={habitPoints}
                    onChange={(e) => setHabitPoints(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none font-bold text-indigo-600"
                    placeholder="输入该习惯每次打卡可以获得的分值，例如: 10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">视觉背景风格（护眼软色）</label>
                  <div className="grid grid-cols-3 gap-2">
                    {THEME_COLORS.map((tc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setHabitThemeColor(tc.class);
                        }}
                        className={`p-2 border rounded-xl text-left text-[10px] truncate transition font-medium bg-gradient-to-br ${tc.class} ${
                          habitThemeColor === tc.class ? 'ring-2 ring-indigo-500 border-transparent shadow-sm' : ''
                        }`}
                      >
                        {tc.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {editingHabitId && (
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        resetHabitForm();
                      }}
                      className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-sm transition"
                    >
                      取消
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`py-2.5 text-white font-semibold rounded-xl text-sm transition-all transform active:scale-95 flex items-center justify-center gap-1.5 ${
                      editingHabitId ? 'w-2/3 bg-indigo-500 hover:bg-indigo-600 shadow-md' : 'w-full bg-teal-500 hover:bg-teal-600 shadow-md'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    {editingHabitId ? '保存修改' : '确认添加'}
                  </button>
                </div>
              </form>
            </div>

            {/* List Column */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
              <h3 className="text-base font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <CheckSquare className="w-4.5 h-4.5 text-teal-500" />
                当前配置的打卡项目
              </h3>
              <p className="text-xs text-slate-400 mb-6">可对小朋友的日常打卡项目进行更新、参数微调或直接删除。</p>

              {appState.habits.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                  <Info className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-400">目前没有习惯项目哦，赶快在左侧新建一个吧！</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appState.habits.map((habit) => (
                    <div
                      key={habit.id}
                      className={`p-4 rounded-2xl border bg-gradient-to-r flex items-center justify-between gap-4 transition ${habit.themeColor}`}
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-14 h-14 bg-white/80 rounded-2xl border border-slate-200/50 p-2 flex items-center justify-center shadow-sm flex-shrink-0">
                          {renderHabitIcon(habit.iconId, 'w-full h-full')}
                        </div>
                        <div className="text-left overflow-hidden">
                          <h4 className="font-bold text-sm text-slate-800 truncate">{habit.name}</h4>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500">
                            <span>大类: <strong>{
                              habit.category === 'hygiene' ? '个人卫生 🧼' :
                              habit.category === 'sleep' ? '起居作息 🌙' :
                              habit.category === 'eating' ? '健康饮食 🍎' :
                              habit.category === 'learning' ? '学习绘本 📚' :
                              habit.category === 'sports' ? '运动劳动 🧸' : '其他习惯 ⭐'
                            }</strong></span>
                            <span>•</span>
                            <span>日频次: <strong>{habit.dailyFrequency}次/日</strong></span>
                            <span>•</span>
                            <span>目标总期数: <strong>{habit.goalValue}次</strong></span>
                            <span>•</span>
                            <span>单次打卡奖励: <strong className="text-amber-600 font-extrabold">{habit.points !== undefined ? habit.points : 10} 分</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleEditHabit(habit)}
                          className="p-2 hover:bg-white/80 rounded-lg text-indigo-600 transition"
                          title="编辑项目"
                        >
                          <Edit3 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteHabit(habit.id)}
                          className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition"
                          title="删除项目"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: REWARDS MANAGEMENT */}
        {activeTab === 'rewards' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-1 h-fit">
              <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Gift className="w-4 h-4 text-rose-400" />
                {editingRewardId ? '编辑奖励项目' : '增加全新奖励'}
              </h3>

              {rewardError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl mb-4">
                  {rewardError}
                </div>
              )}

              <form onSubmit={handleSaveReward} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">奖励名称</label>
                  <input
                    type="text"
                    placeholder="输入奖励，如: 看一集动画片 📺"
                    value={rewardName}
                    onChange={(e) => setRewardName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    maxLength={30}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">奖励专属配图（支持点击上传 或 拖拽图片）📸</label>
                  <div
                    onDragOver={handleRewardIconDragOver}
                    onDragLeave={handleRewardIconDragLeave}
                    onDrop={handleRewardIconDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-4 transition text-center flex flex-col items-center justify-center cursor-pointer min-h-[110px] ${
                      isDraggingRewardIcon 
                        ? 'border-rose-400 bg-rose-50/50' 
                        : rewardImageUrl 
                          ? 'border-indigo-200 bg-indigo-50/10' 
                          : 'border-slate-200 hover:border-slate-350 bg-slate-50/40'
                    }`}
                    onClick={() => document.getElementById('reward-file-input')?.click()}
                  >
                    <input
                      type="file"
                      id="reward-file-input"
                      className="hidden"
                      accept="image/*"
                      onChange={handleRewardIconChange}
                    />
                    
                    {rewardImageUrl ? (
                      <div className="flex items-center gap-3.5 w-full justify-start text-left">
                        <div className="w-14 h-14 rounded-2xl border border-slate-200 overflow-hidden flex-shrink-0 bg-white shadow-xs">
                          <img 
                            src={rewardImageUrl} 
                            alt="奖励配图" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="overflow-hidden flex-1">
                          <p className="text-xs font-bold text-slate-700">已成功添加配图 🌟</p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playClickSound();
                              setRewardImageUrl('');
                            }}
                            className="text-[10px] text-rose-500 hover:text-rose-600 font-extrabold underline mt-1 block"
                          >
                            移除图片并使用默认图标
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="text-xl">✨</div>
                        <p className="text-xs font-black text-slate-600">
                          {isDraggingRewardIcon ? '放开鼠标以上传配图 🎉' : '点击上传 或 拖拽图片到这里'}
                        </p>
                        <p className="text-[10px] text-slate-400">支持 PNG, JPG, WEBP，不超过 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">兑换所需分值 🌟</label>
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={rewardPointsRequired}
                    onChange={(e) => setRewardPointsRequired(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none font-bold text-amber-500"
                    placeholder="例如: 50"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  {editingRewardId && (
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        resetRewardForm();
                      }}
                      className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-sm transition"
                    >
                      取消
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`py-2.5 text-white font-semibold rounded-xl text-sm transition-all transform active:scale-95 flex items-center justify-center gap-1.5 ${
                      editingRewardId ? 'w-2/3 bg-indigo-500 hover:bg-indigo-600 shadow-md' : 'w-full bg-rose-400 hover:bg-rose-500 shadow-md'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    {editingRewardId ? '保存修改' : '确认添加'}
                  </button>
                </div>
              </form>
            </div>

            {/* List Column */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
              <h3 className="text-base font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Gift className="w-4.5 h-4.5 text-rose-400" />
                当前配置的奖励清单
              </h3>
              <p className="text-xs text-slate-400 mb-6">可对小朋友的愿望/奖励兑换配置进行增加、修改或直接删除。</p>

              {(!appState.rewards || appState.rewards.length === 0) ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                  <Info className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-400">目前没有奖励项哦，赶快在左侧新建一个吧！</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appState.rewards.map((reward) => (
                    <div
                      key={reward.id}
                      className="p-4 rounded-2xl border border-slate-150 bg-slate-50/50 flex items-center justify-between gap-4 transition hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl p-2 flex items-center justify-center shadow-sm flex-shrink-0 overflow-hidden">
                          {reward.imageUrl ? (
                            <img 
                              src={reward.imageUrl} 
                              alt={reward.name} 
                              className="w-full h-full object-cover rounded-xl"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Gift className="w-6 h-6 text-rose-400 animate-pulse" />
                          )}
                        </div>
                        <div className="text-left overflow-hidden">
                          <h4 className="font-bold text-sm text-slate-800 truncate">{reward.name}</h4>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <span>兑换分值: </span>
                            <strong className="text-amber-500 font-black">{reward.pointsRequired} 分</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleEditReward(reward)}
                          className="p-2 hover:bg-white rounded-lg text-indigo-600 transition"
                          title="编辑奖励"
                        >
                          <Edit3 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteReward(reward.id)}
                          className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition"
                          title="删除奖励"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: CHILDREN PROFILES MANAGEMENT */}
        {activeTab === 'children' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-1 h-fit">
              <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Users className="w-4 h-4 text-rose-500" />
                {editingChildId ? '编辑宝贝档案' : '增加宝贝成员'}
              </h3>

              {childError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl mb-4">
                  {childError}
                </div>
              )}

              <form onSubmit={handleSaveChild} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">宝贝昵称</label>
                  <input
                    type="text"
                    placeholder="输入名字，如: 小樱桃、满满"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    maxLength={15}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">选择代表卡通形象</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['babyshark', 'superjett', 'cosmictiger', 'spacebunny', 'dolphin'].map((avId) => (
                      <button
                        key={avId}
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setChildAvatarId(avId);
                        }}
                        className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition ${
                          childAvatarId === avId ? 'ring-2 ring-rose-400 bg-rose-50/50 border-transparent' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-10 h-10">
                          {renderAvatar(avId, 'w-full h-full')}
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {avId === 'babyshark' ? '鲨鱼宝宝' :
                           avId === 'superjett' ? '超级飞侠' :
                           avId === 'cosmictiger' ? '雷霆老虎' :
                           avId === 'spacebunny' ? '太空兔子' : '粉红海豚'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {editingChildId && (
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        resetChildForm();
                      }}
                      className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-sm transition"
                    >
                      取消
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`py-2.5 text-white font-semibold rounded-xl text-sm transition-all transform active:scale-95 flex items-center justify-center gap-1.5 ${
                      editingChildId ? 'w-2/3 bg-indigo-500 hover:bg-indigo-600 shadow-md' : 'w-full bg-rose-400 hover:bg-rose-500 shadow-md'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    {editingChildId ? '保存档案' : '确认添加'}
                  </button>
                </div>
              </form>
            </div>

            {/* List Column */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
              <h3 className="text-base font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Users className="w-4.5 h-4.5 text-rose-500" />
                宝贝家庭成员档案列表
              </h3>
              <p className="text-xs text-slate-400 mb-6">用于管理家中的二胎、三胎或切换宝贝身份，为每位宝贝量身记录成长历程。</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {appState.children.map((child) => {
                  const isActive = appState.activeChildId === child.id;
                  const childLogsCount = appState.logs.filter(l => l.childId === child.id).length;

                  return (
                    <div
                      key={child.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition ${
                        isActive ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-12 h-12 flex-shrink-0">
                          {renderAvatar(child.avatarId, 'w-full h-full shadow-sm rounded-full')}
                        </div>
                        <div className="text-left overflow-hidden">
                          <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                            {child.name}
                            {isActive && (
                              <span className="px-1.5 py-0.5 rounded-full bg-indigo-100 text-[9px] font-black text-indigo-600 uppercase">
                                当前选中
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">累计打卡: <strong className="text-slate-600">{childLogsCount}次</strong></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {!isActive && (
                          <button
                            onClick={() => {
                              playClickSound();
                              onUpdateState({
                                ...appState,
                                activeChildId: child.id,
                              });
                            }}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition"
                          >
                            切换
                          </button>
                        )}
                        <button
                          onClick={() => handleEditChild(child)}
                          className="p-1.5 hover:bg-white rounded-lg text-indigo-500 transition"
                          title="编辑名字/形象"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteChild(child.id)}
                          className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-500 transition"
                          title="删除宝贝"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: HISTORICAL LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                  <History className="w-4.5 h-4.5 text-amber-500" />
                  打卡审计历史明细明细
                </h3>
                <p className="text-xs text-slate-400">记录了所有宝贝真实的打卡动作与当时的鼓励语。</p>
              </div>

              {/* Filter search box */}
              <div className="relative w-full sm:w-64 flex-shrink-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索宝贝、习惯、日期..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
            </div>

            {filteredLogsList.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-2xl">
                <Info className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-400">没有找到任何匹配的打卡记录哦！</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold tracking-wider">
                      <th className="py-3 px-4">打卡宝贝</th>
                      <th className="py-3 px-4">打卡时间</th>
                      <th className="py-3 px-4">习惯名称</th>
                      <th className="py-3 px-4">大类</th>
                      <th className="py-3 px-4">获得的鼓励语</th>
                      <th className="py-3 px-4 text-right">管理动作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredLogsList.map((log) => {
                      const child = appState.children.find(c => c.id === log.childId);
                      const habit = appState.habits.find(h => h.id === log.habitId);
                      const formattedTime = new Date(log.timestamp).toLocaleString();

                      return (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-3.5 px-4 flex items-center gap-2">
                            <div className="w-6 h-6">
                              {child ? renderAvatar(child.avatarId, 'w-full h-full rounded-full') : <span className="text-slate-300">已删</span>}
                            </div>
                            <span className="font-bold text-slate-700">{child?.name || '未知宝贝'}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-mono">{formattedTime}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">{habit?.name || '已删除习惯'}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-500 font-bold border border-slate-200/50">
                              {habit?.category === 'hygiene' ? '卫生' :
                               habit?.category === 'sleep' ? '起居' :
                               habit?.category === 'eating' ? '饮食' :
                               habit?.category === 'learning' ? '阅读' :
                               habit?.category === 'sports' ? '运动/整理' : '其他'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-rose-500 max-w-xs truncate" title={log.encouragementText}>
                            {log.encouragementText}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                playClickSound();
                                setLogToDelete(log.id);
                              }}
                              className="px-2 py-1 hover:bg-rose-50 text-rose-500 hover:text-rose-600 rounded-lg transition"
                            >
                              撤销打卡
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: SYSTEM SETTINGS (PASSWORD & RESET) */}
        {activeTab === 'password' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Password section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-indigo-100">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">修改家长管理密码</h3>
                  <p className="text-xs text-slate-400 mt-1">进入家长管理后台需要验证此密码，请妥善保管。</p>
                </div>

                {passwordError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
                    <Star className="w-4 h-4 flex-shrink-0 text-amber-500 fill-amber-500" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                      当前家长密码 (仅限0-9数字)
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="请输入当前正在使用的密码"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                      新密码 (仅限0-9数字)
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="设置一个新密码 (不少于 4 位)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                      确认新密码 (仅限0-9数字)
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="请再次输入新密码"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs transition-all transform active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100"
                    >
                      <Save className="w-4 h-4" />
                      保存修改
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 text-[10px] text-slate-400">
                <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  温馨提示：家长密码用于防止小朋友误入家长后台。修改成功后请牢记新密码。
                </p>
              </div>
            </div>

            {/* Factory Reset Danger Zone */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-rose-100">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <h3 className="text-base font-bold text-rose-600">重置 / 恢复出厂设置</h3>
                  <p className="text-xs text-slate-400 mt-1">清空当前所有设置和数据，让系统重新开始配置。</p>
                </div>

                <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 mb-6">
                  <h4 className="text-xs font-bold text-rose-700 flex items-center gap-1.5 mb-2">
                    ⚠️ 此操作将彻底清空以下内容：
                  </h4>
                  <ul className="text-xs text-rose-600/90 list-disc list-inside space-y-1.5 leading-relaxed pl-1">
                    <li>所有宝贝的姓名、头像、档案信息</li>
                    <li>所有的习惯配置以及历史打卡进度流水</li>
                    <li>所有的奖励清单项目以及历史兑换明细记录</li>
                    <li>已保存的家长管理密码安全锁</li>
                  </ul>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  点击下方的按钮后，系统将彻底擦除所有的浏览器缓存，并带您和宝贝重新回到第一步的“新手注册向导”。
                  请确保您已知晓该后果且无法撤销。
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setShowResetConfirm(true);
                  }}
                  className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition-all transform active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-rose-100"
                >
                  <AlertTriangle className="w-4 h-4" />
                  擦除全部数据并重置系统
                </button>

                <div className="mt-4 p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex items-start gap-2 text-[10px] text-amber-700/80 font-medium">
                  <Info className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    安全提示：如果您只是想修改单个宝贝、打卡项目或奖励商品，请在对应的菜单项中点击“编辑”或“删除”按钮，无需全局重置哦。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CUSTOM OVERLAY DIALOGS (100% IFRAME-SAFE & BEAUTIFUL) */}
      <AnimatePresence>
        {/* Delete Child Confirm */}
        {childToDelete && (() => {
          const targetChild = appState.children.find(c => c.id === childToDelete);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/45 backdrop-blur-xs"
                onClick={() => setChildToDelete(null)}
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative z-10 border border-slate-100 text-center"
              >
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3.5 border border-rose-100">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-base font-black text-slate-800">确认删除宝贝档案吗？ 👶</h3>
                <p className="text-xs text-slate-500 mt-2 mb-5 leading-relaxed">
                  确定要删除 <strong className="text-slate-800">{targetChild?.name || '该宝贝'}</strong> 的档案吗？<br />
                  <span className="text-rose-500 font-bold">删除后其所有的打卡记录也将被彻底清空，此操作不可恢复哦！</span>
                </p>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setChildToDelete(null)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs transition"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmDeleteChild}
                    className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-100 transition"
                  >
                    确认删除
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}

        {/* Delete Reward Confirm */}
        {rewardToDelete && (() => {
          const targetReward = (appState.rewards || []).find(r => r.id === rewardToDelete);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/45 backdrop-blur-xs"
                onClick={() => setRewardToDelete(null)}
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative z-10 border border-slate-100 text-center"
              >
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3.5 border border-amber-100">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-slate-800">确认删除奖励礼物吗？ 🎁</h3>
                <p className="text-xs text-slate-500 mt-2 mb-5 leading-relaxed">
                  确定要从清单中移除礼物 <strong className="text-slate-800">{targetReward?.name}</strong> 吗？<br />
                  小朋友将无法继续在兑换中心看到该选项。
                </p>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setRewardToDelete(null)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs transition"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmDeleteReward}
                    className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-100 transition"
                  >
                    确认删除
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}

        {/* Delete Habit Confirm */}
        {habitToDelete && (() => {
          const targetHabit = appState.habits.find(h => h.id === habitToDelete);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/45 backdrop-blur-xs"
                onClick={() => setHabitToDelete(null)}
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative z-10 border border-slate-100 text-center"
              >
                <div className="w-12 h-12 bg-rose-50 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-3.5 border border-rose-100">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-slate-800">确认删除习惯项目吗？ 🧼</h3>
                <p className="text-xs text-slate-500 mt-2 mb-5 leading-relaxed">
                  确定要删除打卡习惯 <strong className="text-slate-800">{targetHabit?.name}</strong> 吗？<br />
                  <span className="text-rose-500">删除后，宝贝的相关历史打卡记录也会随之无法正常显示。</span>
                </p>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setHabitToDelete(null)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs transition"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmDeleteHabit}
                    className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-100 transition"
                  >
                    确认删除
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}

        {/* Delete Log Confirm */}
        {logToDelete && (() => {
          const targetLog = appState.logs.find(l => l.id === logToDelete);
          const associatedHabit = appState.habits.find(h => h.id === targetLog?.habitId);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/45 backdrop-blur-xs"
                onClick={() => setLogToDelete(null)}
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative z-10 border border-slate-100 text-center"
              >
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3.5 border border-amber-100">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-base font-black text-slate-800">确认撤销本条打卡记录吗？ ⏰</h3>
                <p className="text-xs text-slate-500 mt-2 mb-5 leading-relaxed">
                  确定要撤销这笔关于 <strong className="text-slate-800">{associatedHabit?.name || '打卡'}</strong> 的流水记录吗？<br />
                  <span className="text-rose-500">这将扣减宝贝已获得的该打卡进度和分数！</span>
                </p>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setLogToDelete(null)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs transition"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmDeleteLog}
                    className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-100 transition"
                  >
                    确认撤销
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}

        {/* Global Reset Confirm */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setShowResetConfirm(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative z-10 border border-slate-100 text-center"
            >
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3.5 border border-rose-200">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="text-base font-black text-slate-800">❗❗ 极其重要确认 ❗❗</h3>
              <p className="text-xs text-slate-500 mt-2 mb-5 leading-relaxed">
                您确定要对本打卡系统进行 <strong className="text-rose-600">“恢复出厂设置”</strong> 吗？<br />
                此操作将擦除 <span className="font-extrabold text-rose-500">所有的宝贝、习惯、奖励和历史累计记录</span>，无法撤销！
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition"
                >
                  取消
                </button>
                <button
                  onClick={handleFactoryReset}
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-100 transition"
                >
                  确认擦除并重置
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Informational Alert Modal */}
        {alertMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/45 backdrop-blur-xs"
              onClick={() => setAlertMessage(null)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative z-10 border border-slate-100 text-center"
            >
              <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3.5 border border-indigo-100">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-800">提示</h3>
              <p className="text-xs text-slate-500 mt-2 mb-5 leading-relaxed">
                {alertMessage}
              </p>
              <button
                onClick={() => setAlertMessage(null)}
                className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-100"
              >
                我知道啦
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
