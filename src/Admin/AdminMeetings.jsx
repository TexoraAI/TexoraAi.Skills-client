// Zero-touch compatibility shim.
//
// App.jsx imports it like:
//   import AdminMeetings from "./Admin/AdminMeetings.jsx";
//   const AdminMeetings = lazyLoad(() => import("./Admin/AdminMeetings.jsx"));
//
// The real, split-into-files implementation lives in the sibling
// folder ./AdminMeeting/ (index.jsx + components/pages/data). This file
// just re-exports it under this path, so no other file in the project
// needs to change.
export { default } from "./AdminMeeting/index.jsx";
