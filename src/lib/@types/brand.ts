interface _Brand {
  __brand: never;
}
type Brand<T> = T & _Brand;

export type HTMLString = Brand<string>;
