export function formatSeconds(n) {
  if (!Number.isFinite(n)) return '00';
  const clamped = Math.max(0, Math.min(99, Math.floor(n)));
  return String(clamped).padStart(2, '0');
}

export function createCountdown({ duration, onTick, onEnd }) {
  let timerId = null;

  function clearTimer() {
    if (timerId !== null) {
      clearTimeout(timerId);
      clearInterval(timerId);
      timerId = null;
    }
  }

  function scheduleEnd() {
    timerId = setTimeout(() => {
      timerId = null;
      onEnd?.();
    }, 1000);
  }

  return {
    start() {
      if (timerId !== null) return;
      let remaining = duration;
      onTick?.(remaining);
      remaining -= 1;
      if (remaining < 1) {
        scheduleEnd();
        return;
      }
      timerId = setInterval(() => {
        onTick?.(remaining);
        remaining -= 1;
        if (remaining < 1) {
          clearTimer();
          scheduleEnd();
        }
      }, 1000);
    },
    cancel: clearTimer,
  };
}
