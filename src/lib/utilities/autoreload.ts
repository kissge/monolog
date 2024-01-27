import { dev } from '$app/environment';

abstract class AutoReloadable {
  abstract initialize(): void;
  static readonly autoReloadTargets: string[];
}

function _autoReload<T extends AutoReloadable>(service: T) {
  const autoReloadTargets = (service.constructor as typeof AutoReloadable).autoReloadTargets;
  let lastReloadedAt = 0;

  return new Proxy(service, {
    get(target, prop, receiver) {
      if (autoReloadTargets.includes(prop as string)) {
        const now = Date.now();
        if (now - lastReloadedAt > 5000) {
          lastReloadedAt = now;
          service.initialize();
        }
      }

      const value = target[prop as keyof typeof target] as unknown;

      if (value instanceof Function) {
        return function (this: unknown, ...args: unknown[]) {
          return value.apply(this === receiver ? target : this, args);
        };
      } else {
        return value;
      }
    },
  });
}

function loadOnce<T extends AutoReloadable>(service: T) {
  service.initialize();

  return service;
}

const autoReload = dev ? _autoReload : loadOnce;

export { AutoReloadable, autoReload };
