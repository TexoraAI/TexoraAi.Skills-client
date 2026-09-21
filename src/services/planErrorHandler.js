// planErrorHandler.js
//
// Every gated feature across the 11 services throws one of the codes below
// when a limit is hit. A page's catch() block calls parsePlanError(error) —
// if it returns non-null, pass the result straight into <UpgradeModal />.
//
// Usage in a page:
//
//   try {
//     await someService.doGatedThing(...);
//   } catch (err) {
//     const planError = parsePlanError(err);
//     if (planError) {
//       setUpgradeModalConfig(planError);
//       setUpgradeModalOpen(true);
//     } else {
//       // normal error toast
//     }
//   }

// planType tells UpgradeModal which preview endpoint to call:
//   "org"        -> getOrgUpgradePreview(orgId, ...)
//   "individual" -> getIndividualUpgradePreview(userId, ...)
//   "resume"     -> getResumePlanUpgradePreview(userId, ...)
const ERROR_CODE_META = {
  // ---- auth-service / batch-service: seat limits (org capacity) ----
  SEAT_LIMIT_REACHED: {
    planType: "org",
    message: "You've reached your organization's seat limit.",
  },

  // ---- user-service: resume ----
  TEMPLATE_LOCKED: {
    planType: "resume",
    message: "This resume template is locked on your current plan.",
  },
  AI_GENERATION_LIMIT_REACHED: {
    planType: "resume",
    message: "You've used all your AI resume generations for this month.",
  },

  // ---- video-service / file-service ----
  VIDEO_SIZE_LIMIT_EXCEEDED: {
    planType: "individual",
    message: "This video is larger than your plan's upload limit.",
  },
  STORAGE_LIMIT_EXCEEDED: {
    planType: "individual",
    message: "You've reached your storage limit.",
  },
  VIDEO_COUNT_LIMIT_EXCEEDED: {
    planType: "individual",
    message: "You've reached your video count limit.",
  },
  FILE_SIZE_LIMIT_EXCEEDED: {
    planType: "individual",
    message: "This file is larger than your plan's upload limit.",
  },
  FILE_COUNT_LIMIT_EXCEEDED: {
    planType: "individual",
    message: "You've reached your file count limit.",
  },

  // ---- course-service ----
  COURSE_LIMIT_EXCEEDED: {
    planType: "individual",
    message: "You've reached your course creation limit.",
  },
  MODULE_LIMIT_EXCEEDED: {
    planType: "individual",
    message: "You've reached the module limit for this course.",
  },

  // ---- chat-service: notebook AI ----
  NOTEBOOK_USAGE_LIMIT_REACHED: {
    planType: "individual",
    message: "You've used all your Notebook AI actions for this month.",
  },

  // ---- progress-service: roadmap ----
  ROADMAP_LIMIT_EXCEEDED: {
    planType: "individual",
    message: "You've used all your AI roadmap generations for this month.",
  },

  // ---- assessment-service (shared shape, action varies) ----
  ASSESSMENT_USAGE_LIMIT_EXCEEDED: {
    planType: "individual",
    message: null, // built dynamically below from the response body
  },

  // ---- live-session-service: trainer live classes ----
  // ---- live-session-service: trainer live classes ----
  CLASS_LIMIT_EXCEEDED: {
    planType: "individual",
    message: "You've used all your live classes for this month.",
  },
  AI_COMPANION_NOT_AVAILABLE: {
    planType: "individual",
    message: "AI Companion isn't available on your current plan.",
  },
  AI_COMPANION_LIMIT_EXCEEDED: {
    planType: "individual",
    message: "You've used all your AI Companion sessions this month.",
  },
  RECORDING_DURATION_LIMIT_EXCEEDED: {
    planType: "individual",
    message: "This recording exceeds your plan's duration limit.",
  },
  WHITEBOARD_NOT_AVAILABLE: {
    planType: "individual",
    message: "Whiteboard saving isn't available on your current plan.",
  },

  // ---- live-session-service: universal meetings ----
  MEETING_LIMIT_EXCEEDED: {
    planType: "individual",
    message:
      "You've reached your meeting/event/schedule creation limit this month.",
  },
  EMAIL_DISPATCH_LIMIT_EXCEEDED: {
    planType: "individual",
    message: "You've reached your email send limit this month.",
  },
};

// NOTE: STORAGE_LIMIT_EXCEEDED and COUNT/SIZE codes are reused identically
// by video-service and file-service, both normal-upload and course-module
// pools. The message above is generic on purpose — pass a more specific
// featureLabel prop to <UpgradeModal /> from the calling page when you want
// finer wording (e.g. "course video" vs "personal video").

export function parsePlanError(error) {
  const body = error?.response?.data;
  if (!body) return null;

  const code = body.error || body.code;
  if (!code || !ERROR_CODE_META[code]) return null;

  const meta = ERROR_CODE_META[code];

  // assessment-service ships a richer body — build the message from it.
  let message = meta.message;
  if (code === "ASSESSMENT_USAGE_LIMIT_EXCEEDED") {
    message = `You've used ${body.currentCount}/${body.maxAllowed} ${body.action} actions this ${body.period}.`;
  }

  return {
    code,
    planType: meta.planType,
    message,
    httpStatus: error?.response?.status ?? null,
  };
}
