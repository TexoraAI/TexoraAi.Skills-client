// // ═══════════════════════════════════════════════════════════════════════
// // ILM DEMO — GLOBAL WRITE GUARD
// //
// // Problem: the app has no single shared axios instance. batchService.js,
// // chatService.js, courseService.js, assessmentService.js — every service
// // file calls `axios.create({...})` on its own. That means there is no one
// // file to add a "block writes in demo mode" interceptor to.
// //
// // Fix: every axios instance, no matter how many `axios.create()` calls
// // exist across the codebase, is still an instance of `axios.Axios` and
// // still runs its requests through `axios.Axios.prototype.request`. So we
// // patch that ONE shared prototype method, once, here. This affects every
// // service file automatically — present and future — with zero edits to
// // any of them.
// //
// // Reads (GET) are never touched. Only mutating methods are intercepted,
// // and only while demo mode is actually active (i.e. while /ilm-demo is
// // mounted — see setDemoModeActive() calls in IlmOraDemoPage.jsx).
// // ═══════════════════════════════════════════════════════════════════════

// import axios from "axios";

// const WRITE_METHODS = new Set(["post", "put", "patch", "delete"]);
// const BLOCK_EVENT = "ilm-demo:write-blocked";

// let demoModeActive = false;
// let installed = false;

// /** Turn the write guard on/off. Called by IlmOraDemoPage on mount/unmount. */
// export function setDemoModeActive(value) {
//   demoModeActive = !!value;
// }

// export function isDemoModeActive() {
//   return demoModeActive;
// }

// /**
//  * Subscribe to "a write was blocked" events (used to drive the Demo
//  * Action Modal). Returns an unsubscribe function.
//  */
// export function onDemoWriteBlocked(handler) {
//   const listener = (e) => handler(e.detail);
//   window.addEventListener(BLOCK_EVENT, listener);
//   return () => window.removeEventListener(BLOCK_EVENT, listener);
// }

// function notifyDemoWriteBlocked(detail) {
//   window.dispatchEvent(new CustomEvent(BLOCK_EVENT, { detail }));
// }

// /**
//  * Installs the guard exactly once, no matter how many times/where it's
//  * imported from (ilmDemoContentRegistry-driven pages, IlmOraDemoPage
//  * itself, etc.) — safe to call at the top of any module.
//  */
// export function installDemoWriteGuard() {
//   if (installed) return;
//   installed = true;

//   const originalRequest = axios.Axios.prototype.request;

//   axios.Axios.prototype.request = function patchedRequest(configOrUrl, config) {
//     // axios supports both request(config) and request(url, config)
//     const resolvedConfig =
//       typeof configOrUrl === "string"
//         ? { ...(config || {}), url: configOrUrl }
//         : { ...(configOrUrl || {}) };

//     const method = (resolvedConfig.method || "get").toLowerCase();

//     if (demoModeActive && WRITE_METHODS.has(method)) {
//       notifyDemoWriteBlocked({
//         method,
//         url: resolvedConfig.url,
//         baseURL: resolvedConfig.baseURL ?? this?.defaults?.baseURL,
//       });

//       const blockedError = new Error(
//         "Blocked: ILM ORA demo mode is read-only.",
//       );
//       blockedError.isDemoBlocked = true;
//       blockedError.config = resolvedConfig;
//       return Promise.reject(blockedError);
//     }

//     return originalRequest.call(this, configOrUrl, config);
//   };
// }


















































// ═══════════════════════════════════════════════════════════════════════
// ILM DEMO — GLOBAL WRITE GUARD  [DEPRECATED / NO LONGER WIRED UP]
//
// /ilm-demo is now the single real dashboard route — reached only after
// genuine authentication (onboarding completion, or email/password
// register/login) — so there is no more read-only "sandbox" state to
// enforce, and IlmOraDemoPage.jsx no longer imports or calls anything
// in this file. Left in place only in case another surface still wants
// a demo-style write guard in the future; safe to delete otherwise.
//
// Problem: the app has no single shared axios instance. batchService.js,
// chatService.js, courseService.js, assessmentService.js — every service
// file calls `axios.create({...})` on its own. That means there is no one
// file to add a "block writes in demo mode" interceptor to.
//
// Fix: every axios instance, no matter how many `axios.create()` calls
// exist across the codebase, is still an instance of `axios.Axios` and
// still runs its requests through `axios.Axios.prototype.request`. So we
// patch that ONE shared prototype method, once, here. This affects every
// service file automatically — present and future — with zero edits to
// any of them.
//
// Reads (GET) are never touched. Only mutating methods are intercepted,
// and only while demo mode is actually active (i.e. while /ilm-demo is
// mounted — see setDemoModeActive() calls in IlmOraDemoPage.jsx).
// ═══════════════════════════════════════════════════════════════════════

import axios from "axios";

const WRITE_METHODS = new Set(["post", "put", "patch", "delete"]);
const BLOCK_EVENT = "ilm-demo:write-blocked";

let demoModeActive = false;
let installed = false;

/** Turn the write guard on/off. Called by IlmOraDemoPage on mount/unmount. */
export function setDemoModeActive(value) {
  demoModeActive = !!value;
}

export function isDemoModeActive() {
  return demoModeActive;
}

/**
 * Subscribe to "a write was blocked" events (used to drive the Demo
 * Action Modal). Returns an unsubscribe function.
 */
export function onDemoWriteBlocked(handler) {
  const listener = (e) => handler(e.detail);
  window.addEventListener(BLOCK_EVENT, listener);
  return () => window.removeEventListener(BLOCK_EVENT, listener);
}

function notifyDemoWriteBlocked(detail) {
  window.dispatchEvent(new CustomEvent(BLOCK_EVENT, { detail }));
}

/**
 * Installs the guard exactly once, no matter how many times/where it's
 * imported from (ilmDemoContentRegistry-driven pages, IlmOraDemoPage
 * itself, etc.) — safe to call at the top of any module.
 */
export function installDemoWriteGuard() {
  if (installed) return;
  installed = true;

  const originalRequest = axios.Axios.prototype.request;

  axios.Axios.prototype.request = function patchedRequest(configOrUrl, config) {
    // axios supports both request(config) and request(url, config)
    const resolvedConfig =
      typeof configOrUrl === "string"
        ? { ...(config || {}), url: configOrUrl }
        : { ...(configOrUrl || {}) };

    const method = (resolvedConfig.method || "get").toLowerCase();

    if (demoModeActive && WRITE_METHODS.has(method)) {
      notifyDemoWriteBlocked({
        method,
        url: resolvedConfig.url,
        baseURL: resolvedConfig.baseURL ?? this?.defaults?.baseURL,
      });

      const blockedError = new Error(
        "Blocked: ILM ORA demo mode is read-only.",
      );
      blockedError.isDemoBlocked = true;
      blockedError.config = resolvedConfig;
      return Promise.reject(blockedError);
    }

    return originalRequest.call(this, configOrUrl, config);
  };
}