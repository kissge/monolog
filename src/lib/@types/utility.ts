export type JSON<T> = T extends Date
  ? string
  : T extends string | number | boolean
  ? T
  : T extends (infer U)[]
  ? JSON<U>[]
  : {
      [key in keyof T]: JSON<T[key]>;
    };
