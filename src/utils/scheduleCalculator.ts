import type { TimetableItem, ActiveClassState, DayKey } from '../types';

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes('PM');
  const isAM = clean.includes('AM');
  const [hourStr, minStr] = clean.replace(/[APM]/g, '').trim().split(':');
  
  let hours = parseInt(hourStr, 10) || 0;
  const minutes = parseInt(minStr, 10) || 0;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function getCurrentDayKey(): DayKey {
  const days: DayKey[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = new Date().getDay();
  return days[dayIndex];
}

export function calculateActiveSchedule(items: TimetableItem[] = []): ActiveClassState {
  if (!items || items.length === 0) {
    return {
      current: null,
      next: null,
      timeRemaining: '',
      progressPercent: 0,
      status: 'day-ended'
    };
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSeconds = now.getSeconds();

  let current: TimetableItem | null = null;
  let next: TimetableItem | null = null;
  let timeRemaining = '';
  let progressPercent = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const startM = parseTimeToMinutes(item.start);
    const endM = parseTimeToMinutes(item.end);

    // Currently happening
    if (currentMinutes >= startM && currentMinutes < endM) {
      current = item;
      const totalSeconds = (endM - startM) * 60;
      const elapsedSeconds = (currentMinutes - startM) * 60 + currentSeconds;
      const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

      const remM = Math.floor(remainingSeconds / 60);
      const remS = remainingSeconds % 60;
      timeRemaining = `${remM}m ${remS < 10 ? '0' : ''}${remS}s`;
      progressPercent = Math.min(100, Math.max(0, (elapsedSeconds / totalSeconds) * 100));

      // Next class is the one after
      for (let j = i + 1; j < items.length; j++) {
        if (items[j].type !== 'Break') {
          next = items[j];
          break;
        }
      }
      break;
    }

    // Upcoming next class if not in class right now
    if (currentMinutes < startM && !next) {
      next = item;
    }
  }

  let status: ActiveClassState['status'] = 'day-ended';
  if (current) {
    status = current.type === 'Break' ? 'break' : 'in-class';
  } else if (next) {
    const nextStartM = parseTimeToMinutes(next.start);
    const diffM = nextStartM - currentMinutes;
    timeRemaining = `Starts in ${diffM}m`;
    status = 'break';
  }

  return {
    current,
    next,
    timeRemaining,
    progressPercent,
    status
  };
}
