// Zero-touch compatibility shim.
//
// App.jsx can import it like:
//   const AdminMeetings = lazyLoad(
//     () => import("./Admin/AdminMeetings"),
//   );
//
// The real, split-into-files implementation lives in the sibling
// folder ./AdminMeeting/ (index.jsx + components/pages/data). This file
// just re-exports it under this path, so no other file in the project
// needs to change. Mirrors the existing SuperAdminMeetings.jsx pattern.
export { default } from "./AdminMeeting/index.jsx";
