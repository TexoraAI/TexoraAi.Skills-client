// Zero-touch compatibility shim.
//
// App.jsx can import it like:
//   const TrainerMeetings = lazyLoad(
//     () => import("./Trainer/TrainerMeetings"),
//   );
//
// The real, split-into-files implementation lives in the sibling
// folder ./TrainerMeeting/ (index.jsx + components/pages/data). This file
// just re-exports it under this path, so no other file in the project
// needs to change. Mirrors the existing SuperAdminMeetings.jsx /
// AdminMeetings.jsx pattern.
//
// ⚠️ PATH ASSUMPTION: this shim assumes TrainerMeeting/ is a direct sibling
// of this file (e.g. src/Trainer/TrainerMeetings.jsx + src/Trainer/TrainerMeeting/...),
// matching AdminMeeting's confirmed real structure. If your actual path is
// different, adjust the "../../../../" prefix in TrainerMeeting's
// services/auth/components imports accordingly — see accompanying notes.
export { default } from "./TrainerMeeting/index.jsx";
