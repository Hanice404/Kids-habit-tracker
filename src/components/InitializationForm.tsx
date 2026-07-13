import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AppState, Child, Habit } from '../types';
import { renderAvatar, BabySharkAvatar, SuperJettAvatar, CosmicTigerAvatar, SpaceBunnyAvatar, DolphinAvatar } from './SvgIcons';
import { playClickSound, playSuccessSound } from './AudioSynthesizer';
import { Check, Shield, User, Heart, Star } from 'lucide-react';

interface InitializationFormProps {
  onInitialize: (state: AppState) => void;
}

const AVATAR_OPTIONS = [
  { id: 'babyshark', name: '鲨鱼宝宝', desc: '活泼好动，热爱海洋' },
  { id: 'superjett', name: '超级飞侠乐迪', desc: '准时送达，勇往直前' },
  { id: 'cosmictiger', name: '宇宙护卫队闪电', desc: '智慧勇敢，保卫星空' },
  { id: 'spacebunny', name: '太空兔兔', desc: '温柔可爱，探索宇宙' },
  { id: 'dolphin', name: '粉红海豚', desc: '聪明伶俐，天天开心' },
];

export const InitializationForm: React.FC<InitializationFormProps> = ({ onInitialize }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [childName, setChildName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('babyshark');
  const [error, setError] = useState('');

  const handleNextStep = () => {
    playClickSound();
    if (!password.trim()) {
      setError('请输入家长管理密码');
      return;
    }
    if (!/^\d+$/.test(password)) {
      setError('密码只允许包含 0-9 的纯数字哦！');
      return;
    }
    if (password.length < 4) {
      setError('密码不能少于4位，以便安全保护');
      return;
    }
    if (password !== passwordConfirm) {
      setError('两次输入的密码不一致，请重新检查');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleCompleteSetup = () => {
    playSuccessSound();
    if (!childName.trim()) {
      setError('请输入小朋友的名字，例如：小美、悦悦');
      return;
    }
    setError('');

    // Generate unique IDs
    const childId = 'child_' + Math.random().toString(36).substring(2, 9);
    
    // Create new Child profile
    const newChild: Child = {
      id: childId,
      name: childName.trim(),
      avatarId: selectedAvatar,
    };

    // Pre-create standard default habits tailored for a 5-year-old girl in kindergarten
    const defaultHabits: Habit[] = [
      {
        id: 'habit_brush_teeth',
        name: '早晚认真刷牙 🪥',
        category: 'hygiene',
        iconId: 'toothbrush',
        goalValue: 21, // 21-day habit loop
        dailyFrequency: 2, // Morning and night
        themeColor: 'from-sky-100 to-blue-50 hover:to-sky-200 border-sky-200',
        createdAt: Date.now(),
        points: 10,
      },
      {
        id: 'habit_sleep_early',
        name: '乖乖按时睡觉 🌙',
        category: 'sleep',
        iconId: 'moon',
        goalValue: 21,
        dailyFrequency: 1,
        themeColor: 'from-purple-100 to-indigo-50 hover:to-purple-200 border-purple-200',
        createdAt: Date.now() + 1,
        points: 15,
      },
      {
        id: 'habit_read_book',
        name: '听/读一个绘本故事 📚',
        category: 'learning',
        iconId: 'book',
        goalValue: 21,
        dailyFrequency: 1,
        themeColor: 'from-indigo-100 to-violet-50 hover:to-indigo-200 border-indigo-200',
        createdAt: Date.now() + 2,
        points: 15,
      },
      {
        id: 'habit_drink_water',
        name: '多喝温开水 🥤',
        category: 'eating',
        iconId: 'water',
        goalValue: 30,
        dailyFrequency: 3, // 3 times a day
        themeColor: 'from-cyan-100 to-teal-50 hover:to-cyan-200 border-cyan-200',
        createdAt: Date.now() + 3,
        points: 5,
      },
      {
        id: 'habit_eat_fruits',
        name: '好好吃饭吃水果 🍎',
        category: 'eating',
        iconId: 'apple',
        goalValue: 21,
        dailyFrequency: 2,
        themeColor: 'from-emerald-100 to-green-50 hover:to-emerald-200 border-emerald-200',
        createdAt: Date.now() + 4,
        points: 10,
      },
      {
        id: 'habit_tidy_toys',
        name: '自己动手整理玩具 🧸',
        category: 'sports',
        iconId: 'toybox',
        goalValue: 21,
        dailyFrequency: 1,
        themeColor: 'from-amber-100 to-orange-50 hover:to-amber-200 border-amber-200',
        createdAt: Date.now() + 5,
        points: 20,
      },
    ];

    const defaultRewards = [
      { id: 'reward_1', name: '看一集喜欢的动画片 📺', pointsRequired: 50, createdAt: Date.now() },
      { id: 'reward_2', name: '吃一次美味冰淇淋 🍦', pointsRequired: 80, createdAt: Date.now() + 1 },
      { id: 'reward_3', name: '买一个精美小玩具 🧸', pointsRequired: 150, createdAt: Date.now() + 2 },
      { id: 'reward_4', name: '去游乐园玩大冒险 🎡', pointsRequired: 300, createdAt: Date.now() + 3 },
      { id: 'reward_5', name: '延长30分钟游戏时间 🎮', pointsRequired: 60, createdAt: Date.now() + 4 },
    ];

    const initialAppState: AppState = {
      children: [newChild],
      activeChildId: childId,
      habits: defaultHabits,
      logs: [],
      parentPasswordHash: password, // For mock simple applet, password is plain-stored locally
      isInitialized: true,
      rewards: defaultRewards,
      redemptions: [],
    };

    onInitialize(initialAppState);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Background soft decorative bubbles */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-rose-100 rounded-full blur-xl opacity-60"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-sky-100 rounded-full blur-xl opacity-60"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-100 max-w-lg w-full p-8 relative overflow-hidden"
      >
        {/* Playful top badge banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-amber-400 to-rose-400"></div>

        {step === 1 ? (
          <div>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shadow-sm border border-teal-100">
                <Shield className="w-8 h-8" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
              第一步：设置家长控制密码 🔐
            </h2>
            <p className="text-slate-500 text-center text-sm mb-6">
              为了避免小朋友误操作习惯配置，请先设置一个属于家长的管理密码。
            </p>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-2.5 rounded-xl mb-4 text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-slate-600 font-medium text-sm mb-1.5">设置管理密码 (仅限0-9数字)</label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="请输入您的管理密码 (仅限数字)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                />
              </div>
              
              <div>
                <label className="block text-slate-600 font-medium text-sm mb-1.5">确认管理密码 (仅限0-9数字)</label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="请再次输入相同密码确认"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                />
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              下一步：填写宝贝档案 👉
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
                <Heart className="w-8 h-8" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
              第二步：宝贝档案配置 🌸
            </h2>
            <p className="text-slate-500 text-center text-sm mb-6">
              请和孩子一起输入名字，并挑选一个她最喜欢的卡通形象吧！
            </p>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-2.5 rounded-xl mb-4 text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-slate-600 font-medium text-sm mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-rose-400" />
                  宝贝的名字
                </label>
                <input
                  type="text"
                  placeholder="怎么称呼宝贝呢？例如：依依、多多"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
                  maxLength={10}
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium text-sm mb-3 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400" />
                  选择一个喜欢的小伙伴形象：
                </label>
                
                {/* Visual Avatar Grid */}
                <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                  {AVATAR_OPTIONS.map((opt) => (
                    <motion.div
                      key={opt.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        playClickSound();
                        setSelectedAvatar(opt.id);
                      }}
                      className={`flex items-center gap-3 p-2.5 rounded-2xl border cursor-pointer transition ${
                        selectedAvatar === opt.id 
                          ? 'border-rose-400 bg-rose-50/50 shadow-sm' 
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-12 h-12 flex-shrink-0">
                        {renderAvatar(opt.id, 'w-full h-full')}
                      </div>
                      <div className="text-left overflow-hidden">
                        <p className="font-bold text-xs text-slate-800 truncate">{opt.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{opt.desc}</p>
                      </div>
                      {selectedAvatar === opt.id && (
                        <div className="ml-auto w-4 h-4 rounded-full bg-rose-400 flex items-center justify-center text-white flex-shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[4]" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  playClickSound();
                  setStep(1);
                }}
                className="w-1/3 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl transition"
              >
                上一步
              </button>
              
              <button
                onClick={handleCompleteSetup}
                className="w-2/3 py-3 bg-rose-400 hover:bg-rose-500 text-white font-semibold rounded-xl shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2"
              >
                开启习惯大冒险 🎉
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
