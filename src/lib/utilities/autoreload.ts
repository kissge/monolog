import { dev } from '$app/env';

export abstract class AutoReloadable {
  constructor() {
    this.initialize();
  }

  abstract initialize(): void;
}

class AutoReloadService {
  reloadTargets = new Set<AutoReloadable>();
  lastReloadedAt = 0;
  lastReloadedTargetCount = 0;

  get propDecorator() {
    return () => this._decorate.bind(this);
  }

  reloadIfNecessary(target: AutoReloadable) {
    this.reloadTargets.add(target);

    const now = Date.now();

    if (now - this.lastReloadedAt > 10000 || this.reloadTargets.size !== this.lastReloadedTargetCount) {
      this.lastReloadedAt = now;
      this.lastReloadedTargetCount = this.reloadTargets.size;
      this.reloadTargets.forEach((t) => t.initialize());
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _decorate(_: AutoReloadable, __: string, descriptor: TypedPropertyDescriptor<any>) {
    const service = this;
    if (descriptor.value) {
      // method
      const original = descriptor.value;
      descriptor.value = function (this: AutoReloadable, ...args: unknown[]) {
        service.reloadIfNecessary(this);

        return original.apply(this, args);
      };
    } else if (descriptor.get) {
      // getter
      const original = descriptor.get;
      descriptor.get = function (this: AutoReloadable) {
        service.reloadIfNecessary(this);

        return original.apply(this);
      };
    }
  }
}

const AutoReloadDecorator = dev
  ? new AutoReloadService().propDecorator
  : () => () => {
      /** Nothing */
    };

export default AutoReloadDecorator;
