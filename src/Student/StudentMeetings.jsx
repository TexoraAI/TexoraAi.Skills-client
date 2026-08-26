// Zero-touch compatibility shim.
//
// App.jsx should import it like:
//   import StudentMeeting from "./Student/StudentMeeting.jsx";
//
// The real, split-into-files implementation lives in the sibling
// folder ./StudentMeeting/ (index.jsx + components/pages/data). This file
// just re-exports it under this path, so no other file in the project
// needs to change.
export { default } from "./StudentMeeting/index.jsx";
