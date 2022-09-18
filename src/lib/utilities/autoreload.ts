import { dev } from '$app/env';

export abstract class AutoReloadable {
  constructor() {
    this.initialize();
  }

  abstract initialize(): void;
}

let lastReloaded = 0;

const AutoReload =
  () =>
  (
    target: AutoReloadable,
    propertyKey: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor.value) {
      // method
      const original = descriptor.value;
      descriptor.value = function (this: AutoReloadable, ...args: unknown[]) {
        if (Date.now() - lastReloaded > 10000) {
          lastReloaded = Date.now();
          this.initialize();
        }
        return original.apply(this, args);
      };
    } else if (descriptor.get) {
      // getter
      const original = descriptor.get;
      descriptor.get = function (this: AutoReloadable) {
        if (Date.now() - lastReloaded > 10000) {
          lastReloaded = Date.now();
          this.initialize();
        }
        return original.apply(this);
      };
    }
  };

const _AutoReload = dev
  ? AutoReload
  : () => () => {
      /** Nothing */
    };

export default _AutoReload;
