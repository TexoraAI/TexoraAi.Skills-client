// src/trainer/AiCompanionPage.jsx
import { useState, useEffect, useCallback } from "react";
import AiCompanionSidebar from "./ai-companion/AiCompanionSidebar";
import AiChatPanel from "./ai-companion/AiChatPanel";
import AiWorkflowHome from "./ai-companion/AiWorkflowHome";
import AiActivityLogs from "./ai-companion/AiActivityLogs";

import {
  getAiConversations,
  getAiConversationMessages,
  deleteAiConversation,
} from "../services/liveSessionService";

// ── Resolve isDark from context/localStorage/prop ─────────────────────────
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

// ── Which view is "workflow"-ish ───────────────────────────────────────────
function isWorkflowView(v) {
  return v && (v === "workflows" || v.startsWith("workflow"));
}

export default function AiCompanionPage({ sessionId, sessionTitle }) {
  const isDark = useIsDark();

  // Navigation
  const [activeView, setActiveView] = useState("home");

  // Conversation history
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);

  // Currently loaded conversation (for history click)
  const [activeConvId, setActiveConvId] = useState(null);
  const [activeConvMessages, setActiveConvMessages] = useState(null);

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
    setActiveView("home"); // show chat panel

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
      if (activeConvId === id) {
        setActiveConvId(null);
        setActiveConvMessages(null);
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  // ── New chat ──────────────────────────────────────────────────────────────
  const handleNewChat = () => {
    setActiveConvId(null);
    setActiveConvMessages(null);
    setActiveView("home");
  };

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleNavigate = (view) => {
    setActiveView(view);
    // Clear loaded conversation when navigating away from chat
    if (view !== "home") {
      setActiveConvId(null);
      setActiveConvMessages(null);
    }
  };

  // ── When conversation created (new conv from AiChatPanel) ─────────────────
  const handleConversationCreated = (convId) => {
    setActiveConvId(convId);
    // Refresh sidebar conversations
    loadConversations();
  };

  // ── Render main content ───────────────────────────────────────────────────
  const renderMain = () => {
    if (activeView === "activity") {
      return <AiActivityLogs isDark={isDark} />;
    }

    if (isWorkflowView(activeView)) {
      return (
        <AiWorkflowHome
          isDark={isDark}
          activeSubView={activeView}
          onNavigate={handleNavigate}
        />
      );
    }

    // home / notes / write / meetings → all show chat panel
    return (
      <AiChatPanel
        sessionId={sessionId}
        sessionTitle={sessionTitle}
        isDark={isDark}
        conversationId={activeConvId}
        onConversationCreated={handleConversationCreated}
        externalMessages={activeConvMessages}
        onNewChat={handleNewChat}
        showHomeIfEmpty={!activeConvMessages}
      />
    );
  };

  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         height: "100vh",
  //         background: bg,
  //         overflow: "hidden",
  //         fontFamily: "'Poppins', sans-serif",
  //       }}
  //     >
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
      {/* Sidebar */}
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

      {/* Main */}
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
