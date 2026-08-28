import React from "react";
import WorkspaceApp from "./pages/WorkspaceApp";
import { ToastProvider } from "./components/Toast";
import "./workspace-styles.css";

export default function StudentMeeting({ theme } = {}) {
  return (
    <ToastProvider>
      <WorkspaceApp theme={theme} />
    </ToastProvider>
  );
}