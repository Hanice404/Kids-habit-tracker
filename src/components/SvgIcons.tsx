import React from 'react';

// ==========================================
// 1. CARTOON AVATARS (卡通形象 / 宝贝头像)
// ==========================================

export const BabySharkAvatar: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background Circle */}
    <circle cx="50" cy="50" r="48" fill="#E0F2FE" />
    
    {/* Shark Body (Yellow/Gold Baby Shark style - soft and warm) */}
    <path d="M50 15C32 15 20 32 20 50C20 62 26 75 38 80C36 74 38 68 42 66C38 65 32 58 35 48C38 38 50 35 55 42C58 38 64 36 68 40C72 44 70 52 65 56C68 59 72 63 70 68C66 77 56 82 50 85C65 85 80 75 80 50C80 32 68 15 50 15Z" fill="#FBBF24" />
    
    {/* Shark Belly (Soft Cream White) */}
    <path d="M38 80C42 82 48 83 52 83C62 82 68 76 72 68C70 63 66 59 65 56C60 52 50 50 44 56C40 60 36 68 38 80Z" fill="#FFFBEB" />
    
    {/* Big Shiny Eye 1 */}
    <circle cx="42" cy="40" r="8" fill="white" />
    <circle cx="42" cy="40" r="4" fill="#1E293B" />
    <circle cx="44" cy="38" r="2" fill="white" /> {/* Sparkle */}

    {/* Big Shiny Eye 2 */}
    <circle cx="58" cy="42" r="8" fill="white" />
    <circle cx="58" cy="42" r="4" fill="#1E293B" />
    <circle cx="60" cy="40" r="2" fill="white" /> {/* Sparkle */}

    {/* Rosy Cheeks */}
    <ellipse cx="34" cy="48" rx="5" ry="3" fill="#F472B6" fillOpacity="0.6" />
    <ellipse cx="64" cy="50" rx="5" ry="3" fill="#F472B6" fillOpacity="0.6" />

    {/* Cute smiling mouth with baby shark teeth */}
    <path d="M40 54C42 58 52 59 56 55" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
    {/* Cute tiny triangle teeth */}
    <path d="M44 55.5L46 58L48 56.5" fill="white" stroke="#1E293B" strokeWidth="1.5" />
    <path d="M50 56.5L52 58L54 55.5" fill="white" stroke="#1E293B" strokeWidth="1.5" />

    {/* Snout lines */}
    <path d="M48 46C49 45 50 45 51 46" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />

    {/* Little fin on top */}
    <path d="M50 15C53 8 58 6 62 10C59 13 55 14 50 15Z" fill="#FBBF24" />
    {/* Side fin */}
    <path d="M22 52C14 53 10 57 12 60C15 59 19 56 22 52Z" fill="#FBBF24" />
  </svg>
);

export const SuperJettAvatar: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background Circle */}
    <circle cx="50" cy="50" r="48" fill="#FEE2E2" />

    {/* Airplane Body (Red Jett style) */}
    <path d="M50 15C25 15 15 32 15 55C15 72 32 85 50 85C68 85 85 72 85 55C85 32 75 15 50 15Z" fill="#EF4444" />
    
    {/* White Windshield / Face area */}
    <path d="M50 25C35 25 28 35 28 52C28 64 35 72 50 72C65 72 72 64 72 52C72 35 65 25 50 25Z" fill="white" />
    
    {/* Cute Airplane Eyes */}
    <circle cx="40" cy="45" r="7" fill="#38BDF8" />
    <circle cx="40" cy="45" r="3.5" fill="#0369A1" />
    <circle cx="42" cy="43" r="1.5" fill="white" /> {/* Sparkle */}

    <circle cx="60" cy="45" r="7" fill="#38BDF8" />
    <circle cx="60" cy="45" r="3.5" fill="#0369A1" />
    <circle cx="62" cy="43" r="1.5" fill="white" /> {/* Sparkle */}

    {/* Rosy blush */}
    <ellipse cx="32" cy="54" rx="4" ry="2.5" fill="#F472B6" fillOpacity="0.5" />
    <ellipse cx="68" cy="54" rx="4" ry="2.5" fill="#F472B6" fillOpacity="0.5" />

    {/* Yellow nose badge (Super Wings logo style) */}
    <polygon points="50,48 54,54 50,58 46,54" fill="#FBBF24" />
    
    {/* Friendly smile */}
    <path d="M42 62C46 66 54 66 58 62" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />

    {/* Cute red wings on the sides */}
    <path d="M15 50C5 50 2 44 8 42C12 44 14 47 15 50Z" fill="#EF4444" />
    <path d="M85 50C95 50 98 44 92 42C88 44 86 47 85 50Z" fill="#EF4444" />

    {/* White wing tip decorations */}
    <path d="M12 43C7 43 5 40 8 39C10 40 11 41 12 43Z" fill="white" />
    <path d="M88 43C93 43 95 40 92 39C90 40 89 41 88 43Z" fill="white" />

    {/* Cute forehead communicator fin */}
    <path d="M50 15C52 8 50 5 48 5C46 5 44 10 46 15H50Z" fill="#FBBF24" />
  </svg>
);

export const CosmicTigerAvatar: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background Circle */}
    <circle cx="50" cy="50" r="48" fill="#ECFDF5" />

    {/* Cosmic Helmet (Translucent outer dome) */}
    <circle cx="50" cy="50" r="38" fill="#38BDF8" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="2.5" />
    
    {/* Helmet Ear pieces */}
    <rect x="8" y="44" width="6" height="12" rx="3" fill="#64748B" />
    <rect x="86" y="44" width="6" height="12" rx="3" fill="#64748B" />

    {/* Tiger Head (Cosmicrew Tiger style - friendly, orange) */}
    <circle cx="50" cy="52" r="26" fill="#F97316" />
    
    {/* Tiger white cheeks/snout */}
    <ellipse cx="44" cy="60" rx="9" ry="7" fill="white" />
    <ellipse cx="56" cy="60" rx="9" ry="7" fill="white" />

    {/* Tiger ears */}
    <path d="M30 34C24 30 22 40 28 44Z" fill="#F97316" />
    <path d="M31 36C27 34 26 40 30 42Z" fill="#FEE2E2" /> {/* Inner ear */}
    
    <path d="M70 34C76 30 78 40 72 44Z" fill="#F97316" />
    <path d="M69 36C73 34 74 40 70 42Z" fill="#FEE2E2" />

    {/* Eyes */}
    <circle cx="42" cy="48" r="4" fill="#1E293B" />
    <circle cx="43" cy="46" r="1.5" fill="white" />
    
    <circle cx="58" cy="48" r="4" fill="#1E293B" />
    <circle cx="59" cy="46" r="1.5" fill="white" />

    {/* Little tiger stripes (Cute and round) */}
    <path d="M50 28L50 36" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
    <path d="M44 30L46 35" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M56 30L54 35" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Side stripes */}
    <path d="M26 52L32 53" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M74 52L68 53" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />

    {/* Snout / Nose */}
    <polygon points="50,56 53,53 47,53" fill="#451A03" />

    {/* Smiling mouth */}
    <path d="M46 58C48 60 50 60 50 58C50 60 52 60 54 58" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />

    {/* Space Sparkle/Stars inside Helmet */}
    <path d="M72 26L73 29L76 30L73 31L72 34L71 31L68 30L71 29L72 26Z" fill="#FBBF24" />
    <circle cx="28" cy="28" r="1.5" fill="#60A5FA" />
  </svg>
);

export const SpaceBunnyAvatar: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background Circle */}
    <circle cx="50" cy="50" r="48" fill="#FAF5FF" />

    {/* Space Helmet Dome */}
    <circle cx="50" cy="52" r="36" fill="#A855F7" fillOpacity="0.15" stroke="#D8B4FE" strokeWidth="2" />

    {/* Long Bunny Ears */}
    <path d="M38 32C38 12 46 12 46 32V42H38V32Z" fill="white" stroke="#E9D5FF" strokeWidth="2" />
    <path d="M40 32C40 18 44 18 44 32V40H40V32Z" fill="#FDF2F8" /> {/* Pink inside */}

    <path d="M62 32C62 12 54 12 54 32V42H62V32Z" fill="white" stroke="#E9D5FF" strokeWidth="2" />
    <path d="M60 32C60 18 56 18 56 32V40H60V32Z" fill="#FDF2F8" />

    {/* Bunny Head */}
    <circle cx="50" cy="56" r="22" fill="white" />

    {/* Shiny Big Eyes */}
    <circle cx="43" cy="52" r="3.5" fill="#1E293B" />
    <circle cx="44.5" cy="50.5" r="1.2" fill="white" />

    <circle cx="57" cy="52" r="3.5" fill="#1E293B" />
    <circle cx="58.5" cy="50.5" r="1.2" fill="white" />

    {/* Cute Pink Cheeks */}
    <ellipse cx="37" cy="58" rx="4" ry="2" fill="#F472B6" fillOpacity="0.6" />
    <ellipse cx="63" cy="58" rx="4" ry="2" fill="#F472B6" fillOpacity="0.6" />

    {/* Bunny Nose & Mouth */}
    <polygon points="50,56 52,54 48,54" fill="#F472B6" />
    <path d="M47 58C49 59.5 50 59.5 50 58C50 59.5 51 59.5 53 58" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />

    {/* Small Space Badge on Head */}
    <circle cx="50" cy="41" r="3" fill="#FBBF24" />
    <path d="M47 41H53" stroke="white" strokeWidth="1" />
  </svg>
);

export const DolphinAvatar: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background Circle */}
    <circle cx="50" cy="50" r="48" fill="#FDF2F8" />

    {/* Dolphin Body (Cute jumping pink/purple dolphin) */}
    <path d="M50 15C32 15 22 25 22 45C22 55 28 65 38 72C35 76 34 82 28 85C38 83 45 78 50 76C62 78 78 72 78 45C78 25 68 15 50 15Z" fill="#F472B6" />
    
    {/* Dolphin Soft Pink Belly */}
    <path d="M38 72C35 76 34 82 28 85C38 83 45 78 50 76C62 78 70 72 72 64C68 58 56 52 46 58C38 64 38 70 38 72Z" fill="#FFF1F2" />

    {/* Shiny eye */}
    <circle cx="40" cy="40" r="6" fill="white" />
    <circle cx="40" cy="40" r="3" fill="#1E293B" />
    <circle cx="41.5" cy="38.5" r="1.5" fill="white" />

    {/* Cute blowhole steam / water squirt */}
    <path d="M52 14C52 10 56 8 58 10C56 12 54 13 52 14Z" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
    <path d="M50 14C48 9 44 8 42 10C44 12 46 13 50 14Z" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />

    {/* Dolphin Snout */}
    <path d="M22 42C15 42 12 45 15 48C18 50 21 47 22 45Z" fill="#F472B6" />

    {/* Rosy Cheeks */}
    <ellipse cx="32" cy="46" rx="4" ry="2" fill="#EC4899" fillOpacity="0.6" />

    {/* Happy curved smile line */}
    <path d="M26 47C29 49 32 48 33 46" stroke="#4D0022" strokeWidth="2" strokeLinecap="round" />

    {/* Star badge on forehead */}
    <path d="M50 26L52 30L56 31L53 34L54 38L50 36L46 38L47 34L44 31L48 30L50 26Z" fill="#FBBF24" />
  </svg>
);

// Helper function to render avatar by ID
export const renderAvatar = (avatarId: string, className = 'w-16 h-16', avatarUrl?: string) => {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt="avatar"
        className={`${className} object-cover rounded-full border border-slate-100 shadow-sm`}
        referrerPolicy="no-referrer"
      />
    );
  }
  switch (avatarId) {
    case 'babyshark':
      return <BabySharkAvatar className={className} />;
    case 'superjett':
      return <SuperJettAvatar className={className} />;
    case 'cosmictiger':
      return <CosmicTigerAvatar className={className} />;
    case 'spacebunny':
      return <SpaceBunnyAvatar className={className} />;
    case 'dolphin':
      return <DolphinAvatar className={className} />;
    default:
      return <BabySharkAvatar className={className} />;
  }
};


// ==========================================
// 2. HABIT ICONS (习惯项目卡片图标)
// ==========================================

export const ToothbrushIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sparkles */}
    <path d="M25 20L27 24L31 25L27 26L25 30L23 26L19 25L23 24L25 20Z" fill="#FBBF24" />
    <path d="M78 15L79 18L82 19L79 20L78 23L77 20L74 19L77 18L78 15Z" fill="#FBBF24" />

    {/* Bubbles */}
    <circle cx="35" cy="30" r="5" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />
    <circle cx="45" cy="22" r="3" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />
    <circle cx="65" cy="25" r="4" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />

    {/* Toothbrush Handle */}
    <rect x="42" y="35" width="16" height="55" rx="8" transform="rotate(-30 42 35)" fill="#F43F5E" />
    {/* Inner grip pattern */}
    <rect x="47" y="55" width="6" height="20" rx="3" transform="rotate(-30 47 55)" fill="#FECDD3" />

    {/* Bristles Head */}
    <rect x="23" y="18" width="22" height="15" rx="4" transform="rotate(-30 23 18)" fill="#FFFBEB" stroke="#F43F5E" strokeWidth="2" />
    {/* Soft Foam/Paste */}
    <path d="M22 17C26 12 32 15 36 12C40 9 46 13 47 16" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" />
    
    {/* Smiley on handle */}
    <circle cx="56" cy="65" r="1.5" fill="white" />
    <circle cx="62" cy="61" r="1.5" fill="white" />
    <path d="M57 68C59 69 61 68 62 66" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const SleepyMoonIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Fluffy Sleeping Cloud */}
    <path d="M20 70C20 62 26 58 32 58C34 50 42 45 50 45C58 45 66 50 68 58C74 58 80 62 80 70C80 77 74 82 68 82H32C26 82 20 77 20 70Z" fill="#F1F5F9" />
    <path d="M20 70C20 62 26 58 32 58C34 50 42 45 50 45C58 45 66 50 68 58C74 58 80 62 80 70C80 77 74 82 68 82H32C26 82 20 77 20 70Z" stroke="#E2E8F0" strokeWidth="2" />

    {/* Sleeping Moon */}
    <path d="M68 22C68 38 54 48 38 48C34 48 31 46 28 44.5C31 56 42 64 54 64C70 64 82 51 82 35C82 29 80 23 77 18C74.5 21 71.5 22 68 22Z" fill="#FCD34D" />
    
    {/* Sleep Cap (Nightcap) */}
    <path d="M68 22C66 18 60 16 56 20C52 24 48 24 45 28C42 32 41 35 45 35C52 35 60 30 68 22Z" fill="#818CF8" />
    <circle cx="43" cy="30" r="3" fill="white" /> {/* Cap pompom */}

    {/* Peaceful Sleep Eyes */}
    <path d="M56 46C58 49 61 49 63 46" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
    <path d="M68 43.5C70 46.5 73 46.5 75 43.5" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />

    {/* Rosy Cheeks */}
    <ellipse cx="56" cy="51" rx="3.5" ry="2" fill="#F472B6" fillOpacity="0.6" />
    <ellipse cx="73" cy="48" rx="3.5" ry="2" fill="#F472B6" fillOpacity="0.6" />

    {/* Sleepy ZZZs */}
    <text x="18" y="32" fill="#818CF8" fontSize="12" fontWeight="bold" fontFamily="monospace">Z</text>
    <text x="28" y="24" fill="#6366F1" fontSize="16" fontWeight="bold" fontFamily="monospace">Z</text>
    <text x="42" y="16" fill="#4F46E5" fontSize="20" fontWeight="bold" fontFamily="monospace">Z</text>
  </svg>
);

export const CheerfulSunIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sun Rays (Cute round petal-like rays) */}
    <circle cx="50" cy="50" r="28" fill="#F59E0B" />
    
    <path d="M50 10C53 18 47 18 50 10Z" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
    <circle cx="50" cy="14" r="5" fill="#FBBF24" />
    <circle cx="50" cy="86" r="5" fill="#FBBF24" />
    <circle cx="14" cy="50" r="5" fill="#FBBF24" />
    <circle cx="86" cy="50" r="5" fill="#FBBF24" />
    
    <circle cx="25" cy="25" r="5" fill="#FBBF24" />
    <circle cx="75" cy="75" r="5" fill="#FBBF24" />
    <circle cx="25" cy="75" r="5" fill="#FBBF24" />
    <circle cx="75" cy="25" r="5" fill="#FBBF24" />

    {/* Sun Face (Main circle) */}
    <circle cx="50" cy="50" r="23" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />

    {/* Cute Sunglasses or Big Happy Eyes */}
    <circle cx="42" cy="46" r="4.5" fill="#1E293B" />
    <circle cx="44" cy="44" r="1.5" fill="white" />
    <circle cx="58" cy="46" r="4.5" fill="#1E293B" />
    <circle cx="60" cy="44" r="1.5" fill="white" />

    {/* Rosy Cheeks */}
    <ellipse cx="37" cy="52" rx="3" ry="1.5" fill="#EF4444" fillOpacity="0.6" />
    <ellipse cx="63" cy="52" rx="3" ry="1.5" fill="#EF4444" fillOpacity="0.6" />

    {/* Gigantic Smile */}
    <path d="M44 55C46 60 54 60 56 55" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
    <path d="M44 55C44 55 49 61 50 61C51 61 56 55 56 55H44Z" fill="#EF4444" />
  </svg>
);

export const MagicBookIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Open Book Cover (Soft Purple/Indigo) */}
    <path d="M12 76C25 76 35 79 50 82C65 79 75 76 88 76V22C75 22 65 25 50 28C35 25 25 22 12 22V76Z" fill="#6366F1" />
    
    {/* Book Pages (Soft Cream White) */}
    <path d="M15 73C27 73 38 75 50 78C62 75 73 73 85 73V18C73 18 62 20 50 23C38 20 27 18 15 18V73Z" fill="#FFFDF5" />
    <path d="M50 23V78" stroke="#E2E8F0" strokeWidth="2.5" />

    {/* Story lines / Drawings (Abstract blocks) */}
    <path d="M22 30H38M22 38H35M22 46H38M22 54H32" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M62 30H78M62 38H75M62 46H78M62 54H68" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />

    {/* Magic stars coming out */}
    <path d="M50 20L51 15L54 14L51 13L50 8L49 13L46 14L49 15L50 20Z" fill="#FBBF24" />
    <path d="M38 14L39 11L41 10L39 9L38 6L37 9L35 10L37 11L38 14Z" fill="#38BDF8" />
    <path d="M62 14L63 11L65 10L63 9L62 6L61 9L59 10L61 11L62 14Z" fill="#F472B6" />

    {/* Smiling face inside page */}
    <circle cx="32" cy="62" r="1.5" fill="#475569" />
    <circle cx="38" cy="62" r="1.5" fill="#475569" />
    <path d="M33 65C34 66 36 66 37 65" stroke="#475569" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const SmileyAppleIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Apple Body */}
    <path d="M50 82C35 82 22 75 22 52C22 32 35 28 50 32C65 28 78 32 78 52C78 75 65 82 50 82Z" fill="#10B981" />
    <path d="M50 82C35 82 22 75 22 52C22 32 35 28 50 32C65 28 78 32 78 52C78 75 65 82 50 82Z" fill="#EF4444" /> {/* Overwrite with warm Red */}

    {/* Leaf and Stem */}
    <path d="M50 32C50 22 48 16 48 16" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 24C58 20 62 22 64 26C62 28 56 28 50 24Z" fill="#22C55E" />

    {/* Shiny highlight */}
    <path d="M28 42C26 48 28 52 28 52" stroke="white" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.6" />

    {/* Happy Face */}
    <circle cx="42" cy="48" r="4.5" fill="#1E293B" />
    <circle cx="44" cy="46" r="1" fill="white" />
    
    <circle cx="58" cy="48" r="4.5" fill="#1E293B" />
    <circle cx="60" cy="46" r="1" fill="white" />

    {/* Cute Tongue Out Smile */}
    <path d="M44 56C44 64 56 64 56 56H44Z" fill="#F43F5E" />
    <path d="M44 56C46 59 54 59 56 56" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />

    {/* Rosy Cheeks */}
    <ellipse cx="34" cy="53" rx="4.5" ry="2.5" fill="#F472B6" fillOpacity="0.7" />
    <ellipse cx="66" cy="53" rx="4.5" ry="2.5" fill="#F472B6" fillOpacity="0.7" />
  </svg>
);

export const ToyBoxIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Toys coming out (Teddy Bear Ear and Ball) */}
    <circle cx="42" cy="30" r="10" fill="#F59E0B" /> {/* Teddy head */}
    <path d="M34 22C32 20 30 24 32 26" stroke="#78350F" strokeWidth="3" /> {/* Teddy Ear */}
    <path d="M50 22C52 20 54 24 52 26" stroke="#78350F" strokeWidth="3" /> {/* Teddy Ear */}
    <circle cx="39" cy="28" r="1" fill="#78350F" /> {/* Teddy eye */}
    <circle cx="45" cy="28" r="1" fill="#78350F" /> {/* Teddy eye */}
    <ellipse cx="42" cy="31" rx="2" ry="1.2" fill="#FEE2E2" /> {/* Snout */}

    <circle cx="62" cy="34" r="12" fill="#38BDF8" /> {/* Cute Ball */}
    <path d="M50 34C55 26 62 34 62 34C62 34 69 42 74 34" stroke="#FFF" strokeWidth="2.5" />

    {/* The Wooden Toy Box Chest */}
    <rect x="20" y="44" width="60" height="40" rx="6" fill="#D97706" />
    {/* Chest Lid open border */}
    <rect x="15" y="40" width="70" height="8" rx="3" fill="#B45309" />

    {/* Lock/Badge on Box */}
    <rect x="44" y="52" width="12" height="12" rx="2" fill="#FBBF24" />
    <circle cx="50" cy="58" r="2.5" fill="#78350F" />

    {/* Smiley on Toybox */}
    <circle cx="34" cy="66" r="2" fill="#78350F" />
    <circle cx="66" cy="66" r="2" fill="#78350F" />
    <path d="M46 72C48 74 52 74 54 72" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const HappyWaterGlassIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Straw */}
    <path d="M55 12L68 12L52 50" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
    <path d="M55 12L68 12" stroke="white" strokeWidth="2" strokeDasharray="3 3" />

    {/* Glass Cup Body (Semi-transparent teal/blue) */}
    <path d="M30 25L36 82C36 86 40 90 45 90H55C60 90 64 86 64 82L70 25" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />

    {/* Water inside (Wavy top) */}
    <path d="M32 45C38 42 42 48 50 45C58 42 62 48 68 45V81C68 85 64 88 59 88H41C36 88 32 85 32 81V45Z" fill="#38BDF8" />

    {/* Water bubbles */}
    <circle cx="42" cy="56" r="3" fill="white" fillOpacity="0.6" />
    <circle cx="58" cy="62" r="2" fill="white" fillOpacity="0.6" />
    <circle cx="48" cy="74" r="4" fill="white" fillOpacity="0.6" />

    {/* Cup Face */}
    <circle cx="42" cy="62" r="3.5" fill="#1E293B" />
    <circle cx="43.5" cy="60.5" r="1" fill="white" />
    
    <circle cx="58" cy="62" r="3.5" fill="#1E293B" />
    <circle cx="59.5" cy="60.5" r="1" fill="white" />

    <path d="M47 68C49 71 51 71 53 68" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
    
    {/* Cute water splash outside */}
    <circle cx="20" cy="38" r="2" fill="#38BDF8" />
    <circle cx="78" cy="42" r="2.5" fill="#38BDF8" />
  </svg>
);

export const CheerfulSoapBubbleIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Big Soap Bubbles */}
    <circle cx="28" cy="32" r="10" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />
    <circle cx="26" cy="30" r="3" fill="white" fillOpacity="0.8" />

    <circle cx="75" cy="28" r="8" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />
    <circle cx="73" cy="26" r="2" fill="white" fillOpacity="0.8" />

    {/* Bar of Soap (Soft pink/peach) */}
    <rect x="25" y="44" width="50" height="32" rx="12" fill="#FCE7F3" stroke="#F472B6" strokeWidth="3" />
    
    {/* Inner decorative oval */}
    <rect x="33" y="50" width="34" height="20" rx="8" fill="white" fillOpacity="0.5" stroke="#F472B6" strokeWidth="1" strokeDasharray="2 2" />

    {/* Bubbles foaming on top of Soap */}
    <circle cx="40" cy="42" r="6" fill="white" stroke="#38BDF8" strokeWidth="1" />
    <circle cx="50" cy="38" r="7" fill="white" stroke="#38BDF8" strokeWidth="1" />
    <circle cx="60" cy="42" r="5" fill="white" stroke="#38BDF8" strokeWidth="1" />

    {/* Cute soap eyes and rosy blush */}
    <circle cx="44" cy="58" r="3" fill="#4D0022" />
    <circle cx="56" cy="58" r="3" fill="#4D0022" />
    <path d="M48 64C50 66 52 66 54 64" stroke="#4D0022" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="38" cy="61" rx="3.5" ry="1.5" fill="#EC4899" fillOpacity="0.6" />
    <ellipse cx="62" cy="61" rx="3.5" ry="1.5" fill="#EC4899" fillOpacity="0.6" />
  </svg>
);

export const BouncyBallIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Speed lines */}
    <path d="M12 40H22" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
    <path d="M8 52H18" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
    <path d="M14 64H22" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />

    {/* Dynamic star bursts */}
    <path d="M82 22L84 25L87 26L84 27L82 30L80 27L77 26L80 25L82 22Z" fill="#FBBF24" />
    
    {/* Bouncy Starry Soccer Ball */}
    <circle cx="50" cy="52" r="30" fill="#34D399" stroke="#059669" strokeWidth="3" />
    
    {/* Ball Star Designs */}
    <path d="M50 34L53 40L60 41L55 45L57 51L50 47L43 51L45 45L40 41L47 40L50 34Z" fill="white" />
    <path d="M26 50L29 53L34 53L31 55L32 59L29 57L26 59L27 55L24 53L29 53" fill="white" />
    <path d="M74 50L72 53L68 53L71 55L70 59L72 57L75 59L74 55L77 53L72 53" fill="white" />

    {/* Cheerful face on the ball */}
    <circle cx="44" cy="58" r="3.5" fill="#1E293B" />
    <circle cx="45.5" cy="56.5" r="1" fill="white" />
    <circle cx="56" cy="58" r="3.5" fill="#1E293B" />
    <circle cx="57.5" cy="56.5" r="1" fill="white" />

    <path d="M47 64C49 67 51 67 53 64" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const CustomHabitIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Golden Glowing Star Badge */}
    <path d="M50 12L61 35L86 38L67 55L72 80L50 67L28 80L33 55L14 38L39 35L50 12Z" fill="#FBBF24" stroke="#D97706" strokeWidth="3" strokeLinejoin="round" />
    
    {/* Shiny inner star */}
    <path d="M50 22L57 38L75 40L62 52L65 70L50 60L35 70L38 52L25 40L43 38L50 22Z" fill="#FFFBEB" opacity="0.5" />

    {/* Sparkles around */}
    <circle cx="20" cy="22" r="3" fill="#FBBF24" />
    <circle cx="80" cy="22" r="2" fill="#FBBF24" />
    <circle cx="15" cy="62" r="2.5" fill="#38BDF8" />
    <circle cx="85" cy="62" r="3" fill="#F472B6" />

    {/* Happy Star Face */}
    <circle cx="44" cy="46" r="3" fill="#78350F" />
    <circle cx="56" cy="46" r="3" fill="#78350F" />
    <path d="M46 52C48 55 52 55 54 52" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
    <ellipse cx="38" cy="49" rx="3" ry="1.5" fill="#EF4444" fillOpacity="0.6" />
    <ellipse cx="62" cy="49" rx="3" ry="1.5" fill="#EF4444" fillOpacity="0.6" />
  </svg>
);

export const UniversalRocketIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background soft circle */}
    <circle cx="50" cy="50" r="46" fill="#F0FDF4" />
    
    {/* Rocket Thruster Flame */}
    <path d="M50 72L42 85C42 85 50 82 50 78C50 82 58 85 58 85L50 72Z" fill="#F97316" />
    <path d="M50 72L45 80C45 80 50 78 50 76C50 78 55 80 55 80L50 72Z" fill="#FBBF24" />

    {/* Rocket Wings */}
    <path d="M30 65C30 55 24 70 18 72C24 74 32 72 32 72L30 65Z" fill="#F43F5E" />
    <path d="M70 65C70 55 76 70 82 72C76 74 68 72 68 72L70 65Z" fill="#F43F5E" />

    {/* Rocket Body */}
    <path d="M50 15C38 32 36 50 36 68H64C64 50 62 32 50 15Z" fill="#3B82F6" />
    {/* Rocket Nose Cone */}
    <path d="M50 15C42 27 40 35 40 40H60C60 35 58 27 50 15Z" fill="#EF4444" />

    {/* Rocket Window */}
    <circle cx="50" cy="48" r="7" fill="#E0F2FE" stroke="#1E293B" strokeWidth="2.5" />
    {/* Happy Face inside Window */}
    <circle cx="48" cy="47" r="1.5" fill="#1E293B" />
    <circle cx="52" cy="47" r="1.5" fill="#1E293B" />
    <path d="M48 50C49 51 51 51 52 50" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />

    {/* Little sparkles */}
    <path d="M22 25L24 28L27 29L24 30L22 33L20 30L17 29L20 28L22 25Z" fill="#FBBF24" />
    <path d="M78 28L80 31L83 32L80 33L78 36L76 33L73 32L76 31L78 28Z" fill="#FBBF24" />
  </svg>
);

export const renderHabitIcon = (iconId: string, className = 'w-12 h-12') => {
  switch (iconId) {
    case 'universal':
      return <UniversalRocketIcon className={className} />;
    case 'toothbrush':
      return <ToothbrushIcon className={className} />;
    case 'moon':
      return <SleepyMoonIcon className={className} />;
    case 'sun':
      return <CheerfulSunIcon className={className} />;
    case 'book':
      return <MagicBookIcon className={className} />;
    case 'apple':
      return <SmileyAppleIcon className={className} />;
    case 'toybox':
      return <ToyBoxIcon className={className} />;
    case 'water':
      return <HappyWaterGlassIcon className={className} />;
    case 'running':
      return <BouncyBallIcon className={className} />;
    case 'custom':
    default:
      return <CustomHabitIcon className={className} />;
  }
};


// ==========================================
// 3. SPECIAL REWARD BADGES (奖励勋章)
// ==========================================

export const RewardBadgeGold: React.FC<{ className?: string, text?: string }> = ({ className = 'w-24 h-24', text = '棒!' }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ribbon (Blue & Purple) */}
    <path d="M45 75L30 110L50 102L60 110L45 75Z" fill="#F43F5E" />
    <path d="M75 75L90 110L70 102L60 110L75 75Z" fill="#3B82F6" />

    {/* Outer Gold Circle with ridges */}
    <circle cx="60" cy="55" r="45" fill="#FCD34D" stroke="#D97706" strokeWidth="4" />
    <circle cx="60" cy="55" r="38" fill="#FBBF24" />

    {/* Star */}
    <path d="M60 25L69 42L88 45L74 58L78 78L60 68L42 78L46 58L32 45L51 42L60 25Z" fill="#FFFBEB" />

    {/* Badge text inside */}
    <text x="60" y="60" fill="#B45309" fontSize="14" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" dominantBaseline="middle">
      {text}
    </text>

    {/* Sparkle effects */}
    <circle cx="24" cy="24" r="3" fill="#FBBF24" />
    <circle cx="96" cy="24" r="3" fill="#FBBF24" />
    <circle cx="94" cy="80" r="2.5" fill="#38BDF8" />
  </svg>
);
