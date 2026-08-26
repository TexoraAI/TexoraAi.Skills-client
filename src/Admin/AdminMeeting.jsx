// Zero-touch compatibility shim.
//
// App.jsx should import it like:
//   import AdminMeeting from "./Admin/AdminMeeting.jsx";
//
// The real, split-into-files implementation lives in the sibling
// folder ./AdminMeeting/ (index.jsx + components/pages/data). This file
// just re-exports it under this path, so no other file in the project
// needs to change.
export { default } from "./AdminMeeting/index.jsx";
