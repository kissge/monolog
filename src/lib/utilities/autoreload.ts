import { dev } from '$app/env';

const AutoReload =
  () =>
  (
    target: { initialize: () => void },
    propertyKey: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor.value) {
      // method
      const original = descriptor.value;
      descriptor.value = function (this: typeof target, ...args: unknown[]) {
        this.initialize();
        return original.apply(this, args);
      };
    } else if (descriptor.get) {
      // getter
      const original = descriptor.get;
      descriptor.get = function (this: typeof target) {
        this.initialize();
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
