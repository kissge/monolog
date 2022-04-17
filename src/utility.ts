export const toJSTISOHTMLString = (date: string) =>
  new Date(date)
    // @ts-expect-error https://github.com/microsoft/TypeScript/pull/48467 がリリースされるのを待っている
    .toLocaleString('sv', { timeZone: 'Asia/Tokyo', timeZoneName: 'longOffset' })
    .replace(/(\S+) (\S+) GMT(\S*)/, '$1<span class="date-weak">T</span>$2<span class="date-weak">$3</span>');

export const toJSTISODateString = (date: string | undefined) =>
  date ? new Date(date).toLocaleString('sv', { timeZone: 'Asia/Tokyo', dateStyle: 'short' }) : '????-??-??';

export const toRelative = (date: string) => {
  const seconds = (new Date().getTime() - new Date(date).getTime()) / 1000;

  for (const { unit, by } of [
    { unit: '年', by: 365.2425 * 24 * 60 * 60 },
    { unit: 'か月', by: 30.4 * 24 * 60 * 60 },
    { unit: '日', by: 24 * 60 * 60 },
    { unit: '時間', by: 60 * 60 },
  ]) {
    if (seconds >= by) {
      const rounded = Math.round((seconds / by) * 2) / 2;
      return `${Math.floor(rounded)} ${unit}${rounded > Math.floor(rounded) ? '半' : ''}前`;
    }
  }

  return 'ついさっき';
};
