const ThinSpace = '\u2009';

export function date(date: Date | string | undefined) {
  return date ? new Date(date).toLocaleString('sv', { timeZone: 'Asia/Tokyo', dateStyle: 'short' }) : '????-??-??';
}

export function datetime(date: Date | string | undefined) {
  return date
    ? new Date(date).toLocaleString('sv', { timeZone: 'Asia/Tokyo', dateStyle: 'short', timeStyle: 'medium' })
    : '????-??-?? ??:??:??';
}

export function relative(date: Date | string | undefined) {
  if (!date) {
    return '';
  }

  const seconds = (new Date().getTime() - new Date(date).getTime()) / 1000;

  if (seconds < 0) {
    return '未来';
  }

  for (const { unit, by } of [
    { unit: '年', by: 365.2425 * 24 * 60 * 60 },
    { unit: 'か月', by: 30.4 * 24 * 60 * 60 },
    { unit: '日', by: 24 * 60 * 60 },
    { unit: '時間', by: 60 * 60 },
  ]) {
    if (seconds >= by) {
      const rounded = Math.round((seconds / by) * 2) / 2;
      return `${Math.floor(rounded)}${ThinSpace}${unit}${rounded > Math.floor(rounded) ? '半' : ''}前`;
    }
  }

  return 'ついさっき';
}
