// Zero-touch compatibility shim.
//
// App.jsx imports it like:
//   const SuperAdminMeetings = lazyLoad(
//     () => import("./SuperAdmin/meetings/SuperAdminMeetings"),
//   );
//
// The real, split-into-files implementation lives in the sibling
// folder ./SuperAdminMeeting/ (index.jsx + components/pages/data). This file
// just re-exports it under this path, so no other file in the project
// needs to change.
export { default } from "./SuperAdminMeeting/index.jsx";
