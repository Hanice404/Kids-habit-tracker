/**
 * Custom Cartoon Sound Effects synthesizer using the browser's Web Audio API.
 * This guarantees zero external assets, fast and reliable offline loading.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    // Standard AudioContext initialization
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

/**
 * Play a cute, short, bouncy click sound.
 */
export function playClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

  osc.start();
  osc.stop(ctx.currentTime + 0.12);
}

/**
 * Play a magical, rising chime sound for successful punch-in.
 */
export function playSuccessSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;
  const playNote = (freq: number, delay: number, duration: number, type: 'sine' | 'triangle' = 'sine') => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now + delay);
    
    // Slight vibrato
    osc.frequency.linearRampToValueAtTime(freq * 1.05, now + delay + duration * 0.5);
    osc.frequency.linearRampToValueAtTime(freq, now + delay + duration);

    gain.gain.setValueAtTime(0.12, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.005, now + delay + duration);

    osc.start(now + delay);
    osc.stop(now + delay + duration + 0.05);
  };

  // Play a beautiful, rapid pentatonic major arpeggio
  // C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.50Hz), E6 (1318.51Hz)
  playNote(523.25, 0.00, 0.15, 'sine');
  playNote(659.25, 0.08, 0.15, 'sine');
  playNote(783.99, 0.16, 0.18, 'sine');
  playNote(1046.50, 0.24, 0.22, 'sine');
  playNote(1318.51, 0.32, 0.40, 'triangle');
}

/**
 * Play a bubble-pop cascade.
 */
export function playBubbleSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;
  
  // Create 4 bubbles with slightly different pitches and timing
  const bubbleTimes = [0, 0.08, 0.15, 0.22];
  const bubbleFreqs = [600, 750, 900, 1100];

  bubbleTimes.forEach((time, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    const baseFreq = bubbleFreqs[index];
    osc.frequency.setValueAtTime(baseFreq, now + time);
    // Bubble sound sweeps upward rapidly
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + time + 0.06);

    gain.gain.setValueAtTime(0.1, now + time);
    gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.06);

    osc.start(now + time);
    osc.stop(now + time + 0.07);
  });
}

/**
 * Play a grand victory arpeggio for achieving a total goal.
 */
export function playGoalAchievedSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;
  const chord = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major scale notes

  chord.forEach((freq, idx) => {
    const delay = idx * 0.1;
    const duration = 0.6 - (idx * 0.05);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, now + delay);

    gain.gain.setValueAtTime(0.08, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);

    osc.start(now + delay);
    osc.stop(now + delay + duration + 0.05);
  });
}
