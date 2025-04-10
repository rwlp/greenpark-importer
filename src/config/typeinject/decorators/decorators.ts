import 'reflect-metadata';
import container, { KeysForTypeInject } from '@/config/typeinject/generatedFiles/container';

export function Provider<T extends string>(key: T) {
  return function (target: any, propertyKey?: string) {
    const targetClass = target.constructor;

    if (propertyKey) {
      Reflect.defineMetadata('provider', key, targetClass.prototype, propertyKey);
    } else {
      Reflect.defineMetadata('provider', key, target.prototype)
    }
  }
}

export function Singleton() {
  return function (target: any, propertyKey?: string) {
    const targetClass = target.constructor;

    if (propertyKey) {
      Reflect.defineMetadata('singleton', 'true', targetClass.prototype, propertyKey);
    } else {
      Reflect.defineMetadata('singleton', 'true', target.prototype)
    }
  }
}

export function Inject() {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    const autoWireds = constructor['Autowired'];

    if (autoWireds) {
      const cls = class extends constructor {
        constructor(...args: any[]) {
          super(...args);
          for (const { key, property } of autoWireds) {
            if (container[key]) {
              this[property] = container[key]();
            }
          }
        }
      }

      const other = Object.getOwnPropertyNames(constructor.prototype);

      Object.defineProperty(cls, 'name', { value: constructor.name });

      for (const method of other) {
        if (method === "constructor") continue;
        

        Object.defineProperty(cls.prototype, method, { value: constructor.prototype[method], writable: true, configurable: true })
      }
      return cls;
    }
  }
}

export function Autowired(key: KeysForTypeInject) {
  return function (target: any, propertyKey: string) {
    let constructor = target.constructor;

    if (!constructor['Autowired']) {
      Object.defineProperty(constructor, 'Autowired', { value: [] as { property: string, key: KeysForTypeInject }[] });
    }

    constructor['Autowired'].push({ property: propertyKey, key: key });
  }
}