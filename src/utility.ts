export const toJSTISOString = (date: Date | string) => {
  date = new Date(date);
  date.setTime(date.getTime() + 9 * 60 * 60 * 1000);
  return date
    .toISOString()
    .replace(/\..+/, '+09:00')
    .replace(/(T|\+09:00)/g, '<span class="date-weak">$1</span>');
};
