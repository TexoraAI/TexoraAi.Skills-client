import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useToast } from "../Toast";
import EventForm from "./EventForm";
import ScheduleForm from "./ScheduleForm";
import EmailComposer from "./EmailComposer";
import ContactForm from "./ContactForm";
import MeetingSetup from "./MeetingSetup";
import JoinMeetingModal from "./JoinMeetingModal";

/* -----------------------------------------------------------------------
 * WorkspaceModalProvider — single source of truth for which real Workspace
 * form modal (if any) is open. Replaces every "X form opened" toast: pages
 * call the open* functions from useWorkspaceModal() instead of showToast.
 * A success toast is only fired once the user actually completes the form.
 * ----------------------------------------------------------------------- */

const WorkspaceModalContext = createContext(null);

export function useWorkspaceModal() {
  const ctx = useContext(WorkspaceModalContext);
  if (!ctx) {
    throw new Error("useWorkspaceModal must be used within a WorkspaceModalProvider");
  }
  return ctx;
}

export function WorkspaceModalProvider({ children }) {
  const [modal, setModal] = useState(null); // { type, props }
  const showToast = useToast();

  const close = useCallback(() => setModal(null), []);

  const openEventForm = useCallback((props) => setModal({ type: "event", props: props || {} }), []);
  const openScheduleForm = useCallback((props) => setModal({ type: "schedule", props: props || {} }), []);
  const openEmailComposer = useCallback((props) => setModal({ type: "email", props: props || {} }), []);
  const openContactForm = useCallback((props) => setModal({ type: "contact", props: props || {} }), []);
  const openMeetingSetup = useCallback((props) => setModal({ type: "meeting", props: props || {} }), []);
  const openJoinMeeting = useCallback((props) => setModal({ type: "join", props: props || {} }), []);

  const value = useMemo(
    () => ({
      openEventForm,
      openScheduleForm,
      openEmailComposer,
      openContactForm,
      openMeetingSetup,
      openJoinMeeting,
      closeModal: close,
    }),
    [openEventForm, openScheduleForm, openEmailComposer, openContactForm, openMeetingSetup, openJoinMeeting, close]
  );

  let node = null;

  if (modal?.type === "event") {
    node = (
      <EventForm
        onClose={close}
        onSubmit={(data) => {
          close();
          showToast(`Event "${data.title}" created successfully`);
          modal.props.onCreated?.(data);
        }}
      />
    );
  } else if (modal?.type === "schedule") {
    node = (
      <ScheduleForm
        onClose={close}
        onSubmit={(data) => {
          close();
          showToast(`Schedule "${data.title}" created successfully`);
          modal.props.onCreated?.(data);
        }}
      />
    );
  } else if (modal?.type === "email") {
    node = (
      <EmailComposer
        onClose={close}
        onSubmit={(data) => {
          close();
          if (data.action === "draft") {
            showToast("Draft saved successfully");
          } else if (data.scheduleSend) {
            showToast("Email scheduled successfully");
          } else {
            showToast("Email sent successfully");
          }
          modal.props.onSent?.(data);
        }}
      />
    );
  } else if (modal?.type === "contact") {
    node = (
      <ContactForm
        onClose={close}
        onSubmit={(data) => {
          close();
          showToast(`Contact "${data.name}" added successfully`);
          modal.props.onCreated?.(data);
        }}
      />
    );
  } else if (modal?.type === "meeting") {
    node = (
      <MeetingSetup
        onClose={close}
        onSubmit={(data) => {
          close();
          showToast(`Meeting "${data.title}" started successfully`);
          modal.props.onStarted?.(data);
        }}
      />
    );
  } else if (modal?.type === "join") {
    node = (
      <JoinMeetingModal
        initialValue={modal.props.initialValue || ""}
        onClose={close}
        onSubmit={(data) => {
          close();
          showToast(`Joined meeting "${data.meetingRef}" successfully`);
          modal.props.onJoined?.(data);
        }}
      />
    );
  }

  return (
    <WorkspaceModalContext.Provider value={value}>
      {children}
      {node}
    </WorkspaceModalContext.Provider>
  );
}
