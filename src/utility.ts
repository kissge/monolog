export const toJSTISOHTMLString = (date: string) =>
  new Date(date)
    // @ts-expect-error https://github.com/microsoft/TypeScript/pull/48467 がリリースされるのを待っている
    .toLocaleString('sv', { timeZone: 'Asia/Tokyo', timeZoneName: 'longOffset' })
    .replace(/(\S+) (\S+) GMT(\S*)/, '$1<span class="date-weak">T</span>$2<span class="date-weak">$3</span>');

export const toJSTISODateString = (date: string | undefined) =>
  date ? new Date(date).toLocaleString('sv', { timeZone: 'Asia/Tokyo', dateStyle: 'short' }) : '????-??-??';
