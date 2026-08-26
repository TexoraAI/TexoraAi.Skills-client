// Zero-touch compatibility shim.
//
// App.jsx should import it exactly as before, e.g.:
//   import TrainerLiveClasses from "./trainer/TrainerLiveClasses.jsx";
//
// The real, split-into-files implementation now lives in the sibling
// folder ./TrainerLiveClasses/ (index.jsx + components/pages/data/hooks).
// This file just re-exports it under this path, so no other file in the
// project needs to change.
export { default } from "./TrainerLiveClasses/index.jsx";
