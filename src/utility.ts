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

export const debugPrint: JSON['stringify'] = (value, replacer?, space?) => {
  const n = JSON.stringify(value)?.length || String(value).length;
  return postprocess(
    JSON.stringify(
      preprocess(value, n),
      replacer as any /** https://twitter.com/p_km/status/1515599859897999361 */,
      space,
    ),
    n,
  );

  function isPOJO(object: any) {
    return typeof object === 'object' && !object.__proto__.__proto__;
  }

  function preprocess(object: any, n: number): any {
    return object === null
      ? null
      : object === undefined
      ? '@'.repeat(n)
      : Array.isArray(object)
      ? object.map((item) => preprocess(item, n))
      : isPOJO(object)
      ? Object.fromEntries(Array.from(Object.entries(object)).map(([k, v]) => [k, preprocess(v, n)]))
      : object.toJSON || [undefined, '{}'].includes(JSON.stringify(object))
      ? '@'.repeat(n) +
        JSON.stringify({
          name: object.constructor.name,
          toString: object.toString(),
          ...(object.toJSON ? { toJSON: object.toJSON() } : {}),
        })
      : object;
  }

  function postprocess(str: string, n: number) {
    return str.replace(new RegExp(`"@{${n}}(.*?)(?<!\\\\)"`, 'g'), (_, b) => {
      if (b) {
        const v = JSON.parse(JSON.parse('"' + b + '"'));
        return `<${v.name}${'toJSON' in v ? ` (${v.toJSON})` : ''}> ${JSON.stringify(v.toString)}`;
      } else {
        return '<undefined>';
      }
    });
  }
};
