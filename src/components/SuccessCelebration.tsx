import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { renderAvatar, RewardBadgeGold } from './SvgIcons';
import { playSuccessSound, playGoalAchievedSound } from './AudioSynthesizer';
import { Sparkles, Trophy } from 'lucide-react';

interface SuccessCelebrationProps {
  isOpen: boolean;
  childName: string;
  avatarId: string;
  habitName: string;
  isGoalAchieved: boolean; // True if hitting the totalGoal count with this punch-in
  onClose: () => void;
}

const CHARACTER_REMARKS: Record<string, string[]> = {
  babyshark: [
    '鲨鱼宝宝觉得你今天超级棒！Doo-Doo-Doo！🦈',
    '哇！像快乐的小鲨鱼一样，充满元气地前进吧！🌊',
    '你太厉害啦！我们今天游得真快，完成任务！✨',
  ],
  superjett: [
    '乐迪说：你就像超级飞侠一样，准时又帅气地完成了任务！🚀',
    '任务成功！你是世界上最棒的宝贝，冲鸭！🌍',
    '呼呼——飞向理想，今天的打卡顺利送达！✈️',
  ],
  cosmictiger: [
    '闪电队长夸你是个勇敢、有恒心的小英雄！🐯',
    '宇宙护卫队，保护你的好习惯！我们太棒啦！⭐',
    '星空闪烁，你今天的表现得到了宇宙最高奖章！🏅',
  ],
  spacebunny: [
    '太空兔兔向你发来星际点赞！今天表现特棒！🐰',
    '在好习惯的太空中，你又是最闪耀的那颗星星！✨',
    '好棒呀，我们又在习惯星球上盖了一个快乐小印章！🌸',
  ],
  dolphin: [
    '粉红海豚开心地跃出水面为你欢呼！🐬',
    '呼啦啦——你真是有耐心又聪明的宝贝！💖',
    '今天的好心情和好习惯，海豚宝宝都为你记录下来啦！🌈',
  ],
};

export const SuccessCelebration: React.FC<SuccessCelebrationProps> = ({
  isOpen,
  childName,
  avatarId,
  habitName,
  isGoalAchieved,
  onClose,
}) => {
  const [remarkText, setRemarkText] = useState('');
  
  // Randomly select remarks on open
  useEffect(() => {
    if (isOpen) {
      const remarks = CHARACTER_REMARKS[avatarId] || CHARACTER_REMARKS.babyshark;
      const idx = Math.floor(Math.random() * remarks.length);
      setRemarkText(remarks[idx]);

      // Play synthesized audio rewards
      if (isGoalAchieved) {
        playGoalAchievedSound();
      } else {
        playSuccessSound();
      }
    }
  }, [isOpen, avatarId, isGoalAchieved]);

  // Generate little stars positions
  const starsArray = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 320 - 160,
    y: Math.random() * -300 - 50,
    size: Math.random() * 18 + 8,
    delay: Math.random() * 0.4,
    color: ['#FBBF24', '#F472B6', '#38BDF8', '#34D399', '#A855F7'][i % 5],
  }));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        />

        {/* Outer Celebration Box */}
        <motion.div
          initial={{ scale: 0.3, y: 100, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1, type: 'spring', damping: 15 }}
          exit={{ scale: 0.5, y: 50, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 text-center relative overflow-hidden z-10"
        >
          {/* Top arch decoration */}
          <div className="absolute -top-12 -left-12 w-28 h-28 bg-amber-100 rounded-full blur-xl opacity-70"></div>
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-rose-100 rounded-full blur-xl opacity-70"></div>

          {/* Floating animated particles */}
          {starsArray.map((star) => (
            <motion.div
              key={star.id}
              initial={{ x: 0, y: 100, opacity: 0, scale: 0.2 }}
              animate={{ 
                x: star.x, 
                y: star.y, 
                opacity: [0, 1, 1, 0], 
                scale: [0.2, 1.2, 1, 0.5],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 1.8, 
                delay: star.delay, 
                ease: 'easeOut',
                repeat: Infinity,
                repeatDelay: 0.5
              }}
              style={{ position: 'absolute', left: '50%', bottom: '20%' }}
              className="pointer-events-none"
            >
              <svg viewBox="0 0 24 24" width={star.size} height={star.size} fill={star.color}>
                <path d="M12 2L14.8 9L22 9.8L16.8 14.8L18.2 22L12 18.2L5.8 22L7.2 14.8L2 9.8L9.2 9L12 2Z" />
              </svg>
            </motion.div>
          ))}

          {/* Congratulations Title */}
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-sm mb-4"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            超级棒！打卡成功
            <Sparkles className="w-4 h-4 text-amber-500" />
          </motion.div>

          {/* Main Visuals: Avatar & Glowing Ribbon */}
          <div className="relative flex justify-center items-center h-36 mb-6 mt-2">
            {/* Spinning background halo */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute w-36 h-36 border-4 border-dashed border-rose-200 rounded-full"
            />
            
            {/* Cute Avatar displaying in focus */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 z-10"
            >
              {renderAvatar(avatarId, 'w-full h-full shadow-lg rounded-full')}
            </motion.div>

            {/* Glowing gold badge overlapping slightly */}
            <motion.div
              initial={{ scale: 0, x: 20 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ type: 'spring', delay: 0.4 }}
              className="absolute -bottom-2 right-12 z-20"
            >
              <RewardBadgeGold className="w-16 h-16 drop-shadow-md" text="真棒!" />
            </motion.div>
          </div>

          {/* Interactive Dialogue Speech Bubble */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 mb-6 relative"
          >
            {/* Speech bubble pointer */}
            <div className="absolute top-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-50 border-t border-l border-slate-200/60 rotate-45"></div>
            
            <p className="text-slate-800 font-semibold text-base leading-relaxed">
              &ldquo;{remarkText}&rdquo;
            </p>
          </motion.div>

          {/* Habit Completion Stats Details */}
          <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 text-rose-500 rounded-xl">
                {isGoalAchieved ? <Trophy className="w-6 h-6 animate-bounce" /> : <Sparkles className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-[11px] text-rose-400 font-bold uppercase tracking-wider">今日习惯成就</p>
                <p className="text-slate-800 font-extrabold text-sm truncate">{habitName}</p>
                {isGoalAchieved ? (
                  <p className="text-rose-600 font-bold text-xs mt-0.5">
                    ✨ 宝贝太牛啦！你已经达到了这个习惯的终极目标！
                  </p>
                ) : (
                  <p className="text-slate-500 text-xs mt-0.5">
                    每天坚持一点点，积累更多的小徽章！
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Huge Child friendly close button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-rose-400 to-amber-400 hover:from-rose-500 hover:to-amber-500 text-white font-black rounded-2xl shadow-lg transition text-lg tracking-wider"
          >
            我很棒，继续努力！ 🌟
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
