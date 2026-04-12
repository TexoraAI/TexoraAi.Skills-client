import { lazy } from 'react';

export function lazyLoad(importFn) {
  return lazy(importFn);
}