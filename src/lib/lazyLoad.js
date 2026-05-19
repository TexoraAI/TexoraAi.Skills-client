// import { lazy } from 'react';

// export function lazyLoad(importFn) {
//   return lazy(importFn);
// }















import { lazy } from 'react';

export function lazyLoad(importFn) {
  return lazy(() =>
    importFn().then((module) => {
      // If default export exists, use it. Otherwise grab the first named export.
      if (module.default) return module;
      const first = Object.values(module)[0];
      return { default: first };
    })
  );
}