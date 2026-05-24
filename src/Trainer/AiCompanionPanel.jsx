// import { useState, useEffect, useCallback } from "react";
// import AiCompanionSidebar from "./ai-companion/AiCompanionSidebar";
// import AiChatPanel from "./ai-companion/AiChatPanel";
// import AiWorkflowHome from "./ai-companion/AiWorkflowHome";
// import AiActivityLogs from "./ai-companion/AiActivityLogs";
// import AiInPersonNotes from "./ai-companion/AiInPersonNotes";
// import AiHelpMeWrite from "./ai-companion/AiHelpMeWrite";
// import AiMeetings from "./ai-companion/AiMeetings"; // ← NEW

// import {
//   getAiConversations,
//   getAiConversationMessages,
//   deleteAiConversation,
// } from "../services/liveSessionService";

// function useIsDark() {
//   const [isDark, setIsDark] = useState(() => {
//     try {
//       return localStorage.getItem("theme") === "dark";
//     } catch {
//       return false;
//     }
//   });
//   useEffect(() => {
//     const handler = (e) => {
//       if (e.key === "theme") setIsDark(e.newValue === "dark");
//     };
//     window.addEventListener("storage", handler);
//     return () => window.removeEventListener("storage", handler);
//   }, []);
//   return isDark;
// }

// function isWorkflowView(v) {
//   return v && (v === "workflows" || v.startsWith("workflow"));
// }

// function getQueryParam(name) {
//   try {
//     const params = new URLSearchParams(window.location.search);
//     return params.get(name);
//   } catch {
//     return null;
//   }
// }

// export default function AiCompanionPage({
//   sessionId: sessionIdProp,
//   sessionTitle: sessionTitleProp,
// }) {
//   const isDark = useIsDark();

//   const [activeView, setActiveView] = useState("home");

//   const [conversations, setConversations] = useState([]);
//   const [conversationsLoading, setConversationsLoading] = useState(false);

//   const [activeConvId, setActiveConvId] = useState(null);
//   const [activeConvMessages, setActiveConvMessages] = useState(null);

//   const [chatKey, setChatKey] = useState(0);

//   // ── Session selection ────────────────────────────────────────────────────
//   const [selectedSessionId, setSelectedSessionId] = useState(() => {
//     if (sessionIdProp) return sessionIdProp;
//     return getQueryParam("sessionId") || null;
//   });
//   const [selectedSessionTitle, setSelectedSessionTitle] = useState(() => {
//     if (sessionTitleProp) return sessionTitleProp;
//     return null;
//   });

//   // ── Transcript info passed from AiMeetings → AiInPersonNotes ──────────────
//   const [pendingTranscript, setPendingTranscript] = useState(null);

//   // Keep in sync if prop changes
//   useEffect(() => {
//     if (sessionIdProp) {
//       setSelectedSessionId(sessionIdProp);
//     }
//   }, [sessionIdProp]);

//   useEffect(() => {
//     if (sessionTitleProp) {
//       setSelectedSessionTitle(sessionTitleProp);
//     }
//   }, [sessionTitleProp]);

//   const bg = isDark ? "#0d1117" : "#f1f5f9";

//   // ── Load conversations ────────────────────────────────────────────────────
//   const loadConversations = useCallback(async () => {
//     setConversationsLoading(true);
//     try {
//       const res = await getAiConversations();
//       const data = res.data;
//       const items = Array.isArray(data)
//         ? data
//         : Array.isArray(data?.conversations)
//           ? data.conversations
//           : Array.isArray(data?.content)
//             ? data.content
//             : [];
//       setConversations(items);
//     } catch (err) {
//       console.error("Failed to load conversations:", err);
//       setConversations([]);
//     } finally {
//       setConversationsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadConversations();
//   }, [loadConversations]);

//   // ── Select conversation from sidebar ─────────────────────────────────────
//   const handleSelectConversation = async (conv) => {
//     const id = conv.id || conv.conversationId;
//     setActiveConvId(id);
//     setActiveView("home");

//     try {
//       const res = await getAiConversationMessages(id);
//       const data = res.data;
//       const msgs = Array.isArray(data)
//         ? data
//         : Array.isArray(data?.messages)
//           ? data.messages
//           : Array.isArray(data?.content)
//             ? data.content
//             : [];
//       setActiveConvMessages(msgs);
//     } catch (err) {
//       console.error("Failed to load conversation messages:", err);
//       setActiveConvMessages([]);
//     }
//   };

//   // ── Delete conversation ───────────────────────────────────────────────────
//   const handleDeleteConversation = async (id) => {
//     try {
//       await deleteAiConversation(id);
//       setConversations((prev) =>
//         prev.filter((c) => (c.id || c.conversationId) !== id),
//       );
//       if (activeConvId === id) {
//         handleNewChat();
//       }
//     } catch (err) {
//       console.error("Failed to delete conversation:", err);
//     }
//   };

//   const handleNewChat = () => {
//     setActiveConvId(null);
//     setActiveConvMessages(null);
//     setActiveView("home");
//     setChatKey((k) => k + 1);
//   };

//   // ── Navigation ────────────────────────────────────────────────────────────
//   const handleNavigate = (view) => {
//     setActiveView(view);
//     if (view !== "home") {
//       setActiveConvId(null);
//       setActiveConvMessages(null);
//     }
//   };

//   // ── When conversation created ─────────────────────────────────────────────
//   const handleConversationCreated = (convId) => {
//     setActiveConvId(convId);
//     loadConversations();
//   };

//   // ── Meetings → transcript started → open In-Person Notes ─────────────────
//   const handleTranscriptStart = ({
//     transcriptId,
//     liveSessionId,
//     sessionTitle,
//   }) => {
//     setPendingTranscript({ transcriptId, liveSessionId, sessionTitle });
//     setActiveView("notes");
//   };

//   // ── Render main content ───────────────────────────────────────────────────
//   const renderMain = () => {
//     if (activeView === "activity") {
//       return <AiActivityLogs isDark={isDark} />;
//     }

//     if (activeView === "notes") {
//       return (
//         <AiInPersonNotes
//           isDark={isDark}
//           // Pass transcript info if coming from Meetings → only if AiInPersonNotes
//           // accepts these props. It will safely ignore them if it does not.
//           initialTranscriptId={pendingTranscript?.transcriptId}
//           initialSessionId={pendingTranscript?.liveSessionId}
//           initialSessionTitle={pendingTranscript?.sessionTitle}
//         />
//       );
//     }

//     if (activeView === "write") {
//       return <AiHelpMeWrite isDark={isDark} />;
//     }

//     // ── NEW: Meetings view ──────────────────────────────────────────────────
//     if (activeView === "meetings") {
//       return (
//         <AiMeetings
//           isDark={isDark}
//           onNavigate={handleNavigate}
//           onTranscriptStart={handleTranscriptStart}
//         />
//       );
//     }

//     if (isWorkflowView(activeView)) {
//       return (
//         <AiWorkflowHome
//           isDark={isDark}
//           activeSubView={activeView}
//           onNavigate={handleNavigate}
//         />
//       );
//     }

//     return (
//       <AiChatPanel
//         key={chatKey}
//         sessionId={selectedSessionId}
//         sessionTitle={selectedSessionTitle}
//         setSelectedSessionId={setSelectedSessionId}
//         setSelectedSessionTitle={setSelectedSessionTitle}
//         isDark={isDark}
//         conversationId={activeConvId}
//         onConversationCreated={handleConversationCreated}
//         externalMessages={activeConvMessages}
//         onNewChat={handleNewChat}
//         showHomeIfEmpty={!activeConvMessages}
//       />
//     );
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         height: "calc(100vh - 72px)",
//         minHeight: "calc(100vh - 72px)",
//         background: bg,
//         overflow: "hidden",
//         fontFamily: "'Poppins', sans-serif",
//       }}
//     >
//       <AiCompanionSidebar
//         isDark={isDark}
//         activeView={activeView}
//         onNavigate={handleNavigate}
//         onNewChat={handleNewChat}
//         conversations={conversations}
//         conversationsLoading={conversationsLoading}
//         onSelectConversation={handleSelectConversation}
//         onDeleteConversation={handleDeleteConversation}
//       />

//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//           minWidth: 0,
//         }}
//       >
//         {renderMain()}
//       </div>
//     </div>
//   );
// }
// src/trainer/AiCompanionPage.jsx
import { useState, useEffect, useCallback } from "react";
import AiCompanionSidebar from "./ai-companion/AiCompanionSidebar";
import AiChatPanel from "./ai-companion/AiChatPanel";
import AiWorkflowHome from "./ai-companion/AiWorkflowHome";
import AiWorkflowCreate from "./ai-companion/AiWorkflowCreate";
import AiWorkflowTemplates from "./ai-companion/AiWorkflowTemplates";
import AiMyWorkflows from "./ai-companion/AiMyWorkflows";
import AiActivityLogs from "./ai-companion/AiActivityLogs";
import AiInPersonNotes from "./ai-companion/AiInPersonNotes";
import AiHelpMeWrite from "./ai-companion/AiHelpMeWrite";
import AiMeetings from "./ai-companion/AiMeetings";

import {
  getAiConversations,
  getAiConversationMessages,
  deleteAiConversation,
} from "../services/liveSessionService";

function useIsDark() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "theme") setIsDark(e.newValue === "dark");
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  return isDark;
}

function getQueryParam(name) {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  } catch {
    return null;
  }
}

export default function AiCompanionPage({
  sessionId: sessionIdProp,
  sessionTitle: sessionTitleProp,
}) {
  const isDark = useIsDark();

  const [activeView, setActiveView] = useState("home");

  // ── Workflow state ────────────────────────────────────────────────────────
  const [selectedWorkflowTemplate, setSelectedWorkflowTemplate] =
    useState(null);

  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);

  const [activeConvId, setActiveConvId] = useState(null);
  const [activeConvMessages, setActiveConvMessages] = useState(null);

  const [chatKey, setChatKey] = useState(0);

  // ── Session selection ────────────────────────────────────────────────────
  const [selectedSessionId, setSelectedSessionId] = useState(() => {
    if (sessionIdProp) return sessionIdProp;
    return getQueryParam("sessionId") || null;
  });
  const [selectedSessionTitle, setSelectedSessionTitle] = useState(() => {
    if (sessionTitleProp) return sessionTitleProp;
    return null;
  });

  // ── Transcript info passed from AiMeetings → AiInPersonNotes ──────────────
  const [pendingTranscript, setPendingTranscript] = useState(null);

  useEffect(() => {
    if (sessionIdProp) setSelectedSessionId(sessionIdProp);
  }, [sessionIdProp]);

  useEffect(() => {
    if (sessionTitleProp) setSelectedSessionTitle(sessionTitleProp);
  }, [sessionTitleProp]);

  const bg = isDark ? "#0d1117" : "#f1f5f9";

  // ── Load conversations ────────────────────────────────────────────────────
  const loadConversations = useCallback(async () => {
    setConversationsLoading(true);
    try {
      const res = await getAiConversations();
      const data = res.data;
      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.conversations)
          ? data.conversations
          : Array.isArray(data?.content)
            ? data.content
            : [];
      setConversations(items);
    } catch (err) {
      console.error("Failed to load conversations:", err);
      setConversations([]);
    } finally {
      setConversationsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // ── Select conversation from sidebar ─────────────────────────────────────
  const handleSelectConversation = async (conv) => {
    const id = conv.id || conv.conversationId;
    setActiveConvId(id);
    setActiveView("home");

    try {
      const res = await getAiConversationMessages(id);
      const data = res.data;
      const msgs = Array.isArray(data)
        ? data
        : Array.isArray(data?.messages)
          ? data.messages
          : Array.isArray(data?.content)
            ? data.content
            : [];
      setActiveConvMessages(msgs);
    } catch (err) {
      console.error("Failed to load conversation messages:", err);
      setActiveConvMessages([]);
    }
  };

  // ── Delete conversation ───────────────────────────────────────────────────
  const handleDeleteConversation = async (id) => {
    try {
      await deleteAiConversation(id);
      setConversations((prev) =>
        prev.filter((c) => (c.id || c.conversationId) !== id),
      );
      if (activeConvId === id) handleNewChat();
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  const handleNewChat = () => {
    setActiveConvId(null);
    setActiveConvMessages(null);
    setActiveView("home");
    setChatKey((k) => k + 1);
  };

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleNavigate = (view) => {
    setActiveView(view);
    if (view !== "home") {
      setActiveConvId(null);
      setActiveConvMessages(null);
    }
  };

  // ── When conversation created ─────────────────────────────────────────────
  const handleConversationCreated = (convId) => {
    setActiveConvId(convId);
    loadConversations();
  };

  // ── Meetings → transcript started → open In-Person Notes ─────────────────
  const handleTranscriptStart = ({
    transcriptId,
    liveSessionId,
    sessionTitle,
  }) => {
    setPendingTranscript({ transcriptId, liveSessionId, sessionTitle });
    setActiveView("notes");
  };

  // ── Render main content ───────────────────────────────────────────────────
  const renderMain = () => {
    if (activeView === "activity") {
      return <AiActivityLogs isDark={isDark} />;
    }

    if (activeView === "notes") {
      return (
        <AiInPersonNotes
          isDark={isDark}
          initialTranscriptId={pendingTranscript?.transcriptId}
          initialSessionId={pendingTranscript?.liveSessionId}
          initialSessionTitle={pendingTranscript?.sessionTitle}
        />
      );
    }

    if (activeView === "write") {
      return <AiHelpMeWrite isDark={isDark} />;
    }

    if (activeView === "meetings") {
      return (
        <AiMeetings
          isDark={isDark}
          onNavigate={handleNavigate}
          onTranscriptStart={handleTranscriptStart}
        />
      );
    }

    // ── Workflow sub-pages ──────────────────────────────────────────────────
    if (activeView === "workflows") {
      return (
        <AiWorkflowHome
          isDark={isDark}
          onCreateWorkflow={() => {
            setSelectedWorkflowTemplate(null);
            setActiveView("workflow-create");
          }}
          onOpenTemplates={() => setActiveView("workflow-templates")}
          onOpenMyWorkflows={() => setActiveView("workflow-my")}
          onSelectTemplate={(template) => {
            setSelectedWorkflowTemplate(template);
            setActiveView("workflow-create");
          }}
        />
      );
    }

    if (activeView === "workflow-create") {
      return (
        <AiWorkflowCreate
          isDark={isDark}
          selectedTemplate={selectedWorkflowTemplate}
          onBack={() => setActiveView("workflows")}
          onOpenTemplates={() => setActiveView("workflow-templates")}
          onSaved={() => setActiveView("workflow-my")}
        />
      );
    }

    if (activeView === "workflow-my") {
      return (
        <AiMyWorkflows
          isDark={isDark}
          onCreateNew={() => {
            setSelectedWorkflowTemplate(null);
            setActiveView("workflow-create");
          }}
          onEditWorkflow={(workflow) => {
            setSelectedWorkflowTemplate(workflow);
            setActiveView("workflow-create");
          }}
        />
      );
    }

    if (activeView === "workflow-templates") {
      return (
        <AiWorkflowTemplates
          isDark={isDark}
          onSelectTemplate={(template) => {
            setSelectedWorkflowTemplate(template);
            setActiveView("workflow-create");
          }}
          onBack={() => setActiveView("workflows")}
        />
      );
    }

    // ── Default: chat ───────────────────────────────────────────────────────
    return (
      <AiChatPanel
        key={chatKey}
        sessionId={selectedSessionId}
        sessionTitle={selectedSessionTitle}
        setSelectedSessionId={setSelectedSessionId}
        setSelectedSessionTitle={setSelectedSessionTitle}
        isDark={isDark}
        conversationId={activeConvId}
        onConversationCreated={handleConversationCreated}
        externalMessages={activeConvMessages}
        onNewChat={handleNewChat}
        showHomeIfEmpty={!activeConvMessages}
      />
    );
  };

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 72px)",
        minHeight: "calc(100vh - 72px)",
        background: bg,
        overflow: "hidden",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <AiCompanionSidebar
        isDark={isDark}
        activeView={activeView}
        onNavigate={handleNavigate}
        onNewChat={handleNewChat}
        conversations={conversations}
        conversationsLoading={conversationsLoading}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {renderMain()}
      </div>
    </div>
  );
}
