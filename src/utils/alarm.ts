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
