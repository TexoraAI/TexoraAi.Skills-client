import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useToast } from "../Toast";
import EventForm from "./EventForm";
import ScheduleForm from "./ScheduleForm";
import EmailComposer from "./EmailComposer";
import ContactForm from "./ContactForm";
import MeetingSetup from "./MeetingSetup";
import JoinMeetingModal from "./JoinMeetingModal";
import { createSchedule } from "../../../../../services/scheduleService";
// import { createEvent, updateEvent } from "../../../../../services/eventService";
// import auth from "../../../../../auth";
import { createEvent, updateEvent } from "../../../../../services/eventService";
import { draftEmail, sendEmail } from "../../../../../services/emailService";
import {
  createContact,
  updateContact,
  deleteContact,
} from "../../../../../services/contactService";
import auth from "../../../../../auth";
const REMINDER_MAP = {
  "No reminder": "NO_REMINDER",
  "5 minutes before": "5MIN",
  "10 minutes before": "10MIN",
  "30 minutes before": "30MIN",
  "1 hour before": "1HOUR",
  "1 day before": "1DAY",
};

const REPEAT_MAP = {
  "Does not repeat": "DOES_NOT_REPEAT",
  Daily: "DAILY",
  Weekly: "WEEKLY",
  Monthly: "MONTHLY",
  "Custom...": "CUSTOM",
};

const AVAILABILITY_MAP = {
  Busy: "BUSY",
  Free: "FREE",
  Tentative: "TENTATIVE",
  "Out of office": "OUT_OF_OFFICE",
};

const WorkspaceModalContext = createContext(null);

export function useWorkspaceModal() {
  const ctx = useContext(WorkspaceModalContext);
  if (!ctx) {
    throw new Error(
      "useWorkspaceModal must be used within a WorkspaceModalProvider",
    );
  }
  return ctx;
}

export function WorkspaceModalProvider({ children }) {
  const [modal, setModal] = useState(null); // { type, props }
  const showToast = useToast();

  const close = useCallback(() => setModal(null), []);

  const openEventForm = useCallback(
    (eventToEdit, onCreated) =>
      setModal({ type: "event", props: { eventToEdit, onCreated } }),
    [],
  );
  const openScheduleForm = useCallback(
    (props) => setModal({ type: "schedule", props: props || {} }),
    [],
  );
  // const openEmailComposer = useCallback(
  //   (props) => setModal({ type: "email", props: props || {} }),
  //   [],
  // );
  const openEmailComposer = useCallback(
    (onSent) => setModal({ type: "email", props: { onSent } }),
    [],
  );
  const openContactForm = useCallback(
    (contactToEdit, onCreated) =>
      setModal({ type: "contact", props: { contactToEdit, onCreated } }),
    [],
  );
  const openMeetingSetup = useCallback(
    (props) => setModal({ type: "meeting", props: props || {} }),
    [],
  );
  const openJoinMeeting = useCallback(
    (props) => setModal({ type: "join", props: props || {} }),
    [],
  );

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
    [
      openEventForm,
      openScheduleForm,
      openEmailComposer,
      openContactForm,
      openMeetingSetup,
      openJoinMeeting,
      close,
    ],
  );

  let node = null;

  if (modal?.type === "event") {
    node = (
      <EventForm
        eventToEdit={modal.props.eventToEdit}
        onClose={close}
        onSubmit={(data) => {
          const currentUser = auth.getCurrentUser();

          const payload = {
            title: data.title,
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            location: data.location,
            mode: data.mode === "Online" ? "ONLINE" : "IN_PERSON",
            description: data.description,
            purpose: data.purpose,
            reminder: REMINDER_MAP[data.reminder] || "NO_REMINDER",
            repeat: REPEAT_MAP[data.repeat] || "DOES_NOT_REPEAT",
            availability: AVAILABILITY_MAP[data.availability] || "BUSY",
            requiredAttendees: data.required,
            optionalAttendees: data.optional,
            creatorName: currentUser.name || currentUser.email || "Unknown",
            organizationId: currentUser.organizationId || null,
          };
          createEvent(payload)
            .then((res) => {
              close();
              showToast(`Event "${data.title}" created successfully`);
              modal.props.onCreated?.(res.data);
            })
            .catch((err) => {
              console.error("Failed to create event:", err);
              showToast(
                err.response?.data?.error ||
                  "Could not create event. Please try again.",
              );
            });
        }}
      />
    );
  } else if (modal?.type === "schedule") {
    node = (
      <ScheduleForm
        onClose={close}
        onSubmit={(data) => {
          createSchedule(data)
            .then((res) => {
              close();
              const created = res.data;
              showToast(
                created?.meetingUrl
                  ? `Schedule "${data.title}" created — meeting link ready`
                  : `Schedule "${data.title}" created successfully`,
              );
              modal.props.onCreated?.(created);
            })
            .catch((err) => {
              console.error("Failed to create schedule:", err);
              showToast(
                err.response?.data?.error ||
                  "Could not create schedule. Please try again.",
              );
            });
        }}
      />
    );
  } else if (modal?.type === "email") {
    node = (
      <EmailComposer
        onClose={close}
        onSubmit={(data) => {
          const form = new FormData();
          form.append("subject", data.subject || "");
          form.append("body", data.message || "");
          (data.to || []).forEach((email) => form.append("toEmails", email));
          (data.cc || []).forEach((email) => form.append("ccEmails", email));
          (data.bcc || []).forEach((email) => form.append("bccEmails", email));
          (data.attachments || []).forEach((file) =>
            form.append("files", file),
          );

          const request =
            data.action === "draft" ? draftEmail(form) : sendEmail(form);

          request
            .then((res) => {
              close();
              if (data.action === "draft") {
                showToast("Draft saved successfully");
              } else if (data.scheduleSend) {
                showToast("Email scheduled successfully");
              } else {
                showToast("Email sent successfully");
              }
              modal.props.onSent?.(res.data);
            })
            .catch((err) => {
              console.error("Failed to save/send email:", err);
              showToast(
                err.response?.data?.error ||
                  "Could not save or send this email. Please try again.",
              );
            });
        }}
      />
    );
  } else if (modal?.type === "contact") {
    node = (
      <ContactForm
        contactToEdit={modal.props.contactToEdit}
        onClose={close}
        onSubmit={(data) => {
          const nameParts = data.name.trim().split(" ");
          const payload = {
            firstName: nameParts[0],
            lastName: nameParts.slice(1).join(" ") || "",
            email: data.email,
            phone: data.phone,
            role: data.role,
            organization: data.organization,
            notes: data.notes,
          };

          const isEdit = Boolean(modal.props.contactToEdit);
          const request = isEdit
            ? updateContact(modal.props.contactToEdit.id, payload)
            : createContact(payload);

          request
            .then((res) => {
              close();
              showToast(
                isEdit
                  ? `Contact "${data.name}" updated successfully`
                  : `Contact "${data.name}" added successfully`,
              );
              modal.props.onCreated?.(res.data);
            })
            .catch((err) => {
              console.error(
                isEdit
                  ? "Failed to update contact:"
                  : "Failed to create contact:",
                err,
              );
              showToast(
                err.response?.data?.error ||
                  (isEdit
                    ? "Could not update contact. Please try again."
                    : "Could not add contact. Please try again."),
              );
            });
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
