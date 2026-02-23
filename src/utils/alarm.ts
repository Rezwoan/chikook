/**
 * Looping alarm using Web Audio API — no audio files required.
 * Plays a repeating beep pattern until stopAlarm() is called.
 */

let alarmCtx: AudioContext | null = null;
let alarmIntervalId: ReturnType<typeof setInterval> | null = null;

const playBeep = (ctx: AudioContext, time: number, freq: number, duration: number) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'square';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.25, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
  osc.start(time);
  osc.stop(time + duration);
};

/** Play one "ding-ding" double beep burst. */
const playBurst = (ctx: AudioContext) => {
  const t = ctx.currentTime;
  playBeep(ctx, t,        880, 0.18); // first beep
  playBeep(ctx, t + 0.25, 880, 0.18); // second beep
};

export const startAlarm = () => {
  stopAlarm(); // clear any previous instance

  try {
    alarmCtx = new AudioContext();
    playBurst(alarmCtx); // immediate first burst
    alarmIntervalId = setInterval(() => {
      if (alarmCtx) playBurst(alarmCtx);
    }, 900); // repeat every 0.9s
  } catch (e) {
    console.warn('Web Audio alarm error:', e);
  }

  // Vibrate in a repeating pattern
  if ('vibrate' in navigator) {
    navigator.vibrate([400, 200, 400, 200, 400, 600]);
  }
};

/**
 * Play a satisfying chime when a cooking step is checked off.
 * Two ascending sine tones (C5 → E5) with soft bell-like decay.
 */
export const playChime = () => {
  if (localStorage.getItem('sound-enabled') === 'false') return;
  try {
    const ctx = new AudioContext();
    const playTone = (freq: number, startTime: number, duration: number, gain: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    const t = ctx.currentTime;
    // C5 (523 Hz) then E5 (659 Hz) — pleasant ascending major-third chime
    playTone(523.25, t,        0.55, 0.28);
    playTone(659.25, t + 0.12, 0.6,  0.22);
    playTone(783.99, t + 0.24, 0.7,  0.16); // G5 for a full major chord bloom
    setTimeout(() => ctx.close().catch(() => {}), 1200);
  } catch (e) {
    // Web Audio not available, silently skip
  }
};

export const stopAlarm = () => {
  if (alarmIntervalId !== null) {
    clearInterval(alarmIntervalId);
    alarmIntervalId = null;
  }
  if (alarmCtx) {
    alarmCtx.close().catch(() => {});
    alarmCtx = null;
  }
  if ('vibrate' in navigator) {
    navigator.vibrate(0); // cancel vibration
  }
};
