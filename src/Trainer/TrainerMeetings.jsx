// Zero-touch compatibility shim.
//
// App.jsx already does:
//   import TrainerMeetings from "./Trainer/TrainerMeetings.jsx";
//
// The real, split-into-files implementation now lives in the sibling
// folder ./TrainerMeetings/ (index.jsx + components/pages/data). This file
// just re-exports it under the exact path App.jsx already imports, so no
// other file in the project needs to change.
export { default } from "./TrainerMeetings/index.jsx";
