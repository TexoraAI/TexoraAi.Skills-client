// //// src/trainer/ai-companion/AiCompanionSidebar.jsx
// import { useState } from "react";
// import {
//   Plus,
//   FileText,
//   PenLine,
//   Video,
//   Zap,
//   Activity,
//   ChevronDown,
//   ChevronRight,
//   Search,
//   Trash2,
//   MessageSquare,
//   LayoutTemplate,
//   History,
//   Bot,
// } from "lucide-react";

// const NAV_ITEMS = [
//   { id: "notes", label: "In-Person Notes", icon: FileText, view: "notes" },
//   { id: "write", label: "Help Me Write", icon: PenLine, view: "write" },
//   { id: "meetings", label: "Meetings", icon: Video, view: "meetings" },
// ];

// const WORKFLOW_SUB = [
//   { id: "workflow-create", label: "Create", icon: Plus },
//   { id: "workflow-my", label: "My Workflows", icon: LayoutTemplate },
//   { id: "workflow-templates", label: "Templates", icon: FileText },
// ];

// export default function AiCompanionSidebar({
//   isDark,
//   activeView,
//   onNavigate,
//   onNewChat,
//   conversations = [],
//   conversationsLoading,
//   onSelectConversation,
//   onDeleteConversation,
// }) {
//   const [workflowOpen, setWorkflowOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchOpen, setSearchOpen] = useState(false);

//   const bg = isDark ? "#111827" : "#ffffff";
//   const border = isDark ? "rgba(255,255,255,0.07)" : "#e5e7eb";
//   const textPrimary = isDark ? "#f9fafb" : "#111827";
//   const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
//   const hoverBg = isDark ? "rgba(255,255,255,0.05)" : "#f3f4f6";
//   const activeBg = isDark ? "rgba(37,99,235,0.15)" : "#eff6ff";
//   const activeColor = "#2563eb";

//   const filteredConvs = conversations.filter((c) => {
//     const title = c.title || c.sessionTitle || c.lastMessage || "Conversation";
//     return title.toLowerCase().includes(searchQuery.toLowerCase());
//   });

//   const NavBtn = ({ item, sub = false }) => {
//     const Icon = item.icon;
//     const isActive = activeView === item.view;
//     return (
//       <button
//         onClick={() => item.view && onNavigate(item.view)}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 10,
//           width: "100%",
//           padding: sub ? "7px 12px 7px 36px" : "8px 12px",
//           border: "none",
//           borderRadius: 8,
//           background: isActive ? activeBg : "transparent",
//           color: isActive ? activeColor : textPrimary,
//           cursor: "pointer",
//           fontSize: 13,
//           fontWeight: isActive ? 600 : 400,
//           fontFamily: "'Poppins', sans-serif",
//           textAlign: "left",
//           transition: "all 0.15s",
//         }}
//         onMouseEnter={(e) => {
//           if (!isActive) e.currentTarget.style.background = hoverBg;
//         }}
//         onMouseLeave={(e) => {
//           if (!isActive) e.currentTarget.style.background = "transparent";
//         }}
//       >
//         <Icon size={15} color={isActive ? activeColor : textSecondary} />
//         {item.label}
//       </button>
//     );
//   };

//   return (
//     <div
//       style={{
//         width: 280,
//         minWidth: 280,
//         maxWidth: 280,
//         height: "100%",
//         background: bg,
//         borderRight: `1px solid ${border}`,
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//         fontFamily: "'Poppins', sans-serif",
//       }}
//     >
//       {/* Logo */}
//       <div
//         style={{
//           padding: "18px 16px 12px",
//           borderBottom: `1px solid ${border}`,
//           display: "flex",
//           alignItems: "center",
//           gap: 10,
//           flexShrink: 0,
//         }}
//       >
//         <div
//           style={{
//             width: 32,
//             height: 32,
//             borderRadius: 9,
//             background: "linear-gradient(135deg, #2563eb, #60a5fa)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
//           }}
//         >
//           <Bot size={16} color="#fff" />
//         </div>
//         <span
//           style={{
//             fontSize: 14,
//             fontWeight: 700,
//             color: textPrimary,
//             letterSpacing: "-0.01em",
//           }}
//         >
//           AI Companion
//         </span>
//       </div>

//       {/* Nav */}
//       <div style={{ padding: "10px 8px 4px", flexShrink: 0 }}>
//         {/* BUG 2 FIX: New Chat button now calls onNewChat() which resets
//             messages, mode, input, conversationId and shows the home screen.
//             It no longer just calls onNavigate("home") alone. */}
//         <button
//           onClick={() => {
//             if (onNewChat) onNewChat(); // reset chat state fully
//             onNavigate("home"); // also switch view to home
//           }}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//             width: "100%",
//             padding: "8px 12px",
//             border: "none",
//             borderRadius: 8,
//             background: activeView === "home" ? activeBg : "transparent",
//             color: activeView === "home" ? activeColor : textPrimary,
//             cursor: "pointer",
//             fontSize: 13,
//             fontWeight: activeView === "home" ? 600 : 400,
//             fontFamily: "'Poppins', sans-serif",
//             textAlign: "left",
//             transition: "all 0.15s",
//           }}
//           onMouseEnter={(e) => {
//             if (activeView !== "home")
//               e.currentTarget.style.background = hoverBg;
//           }}
//           onMouseLeave={(e) => {
//             if (activeView !== "home")
//               e.currentTarget.style.background = "transparent";
//           }}
//         >
//           <Plus
//             size={15}
//             color={activeView === "home" ? activeColor : textSecondary}
//           />
//           New Chat
//         </button>

//         {NAV_ITEMS.map((item) => (
//           <NavBtn key={item.id} item={item} />
//         ))}

//         {/* Workflows expandable */}
//         <button
//           onClick={() => setWorkflowOpen((p) => !p)}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//             width: "100%",
//             padding: "8px 12px",
//             border: "none",
//             borderRadius: 8,
//             background: activeView?.startsWith("workflow")
//               ? activeBg
//               : "transparent",
//             color: activeView?.startsWith("workflow")
//               ? activeColor
//               : textPrimary,
//             cursor: "pointer",
//             fontSize: 13,
//             fontFamily: "'Poppins', sans-serif",
//             textAlign: "left",
//             transition: "all 0.15s",
//           }}
//           onMouseEnter={(e) => {
//             if (!activeView?.startsWith("workflow"))
//               e.currentTarget.style.background = hoverBg;
//           }}
//           onMouseLeave={(e) => {
//             if (!activeView?.startsWith("workflow"))
//               e.currentTarget.style.background = "transparent";
//           }}
//         >
//           <Zap size={15} color={textSecondary} />
//           <span style={{ flex: 1, fontWeight: 400 }}>Workflows</span>
//           {workflowOpen ? (
//             <ChevronDown size={13} color={textSecondary} />
//           ) : (
//             <ChevronRight size={13} color={textSecondary} />
//           )}
//         </button>

//         {workflowOpen &&
//           WORKFLOW_SUB.map((s) => (
//             <button
//               key={s.id}
//               onClick={() => onNavigate(s.id)}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 10,
//                 width: "100%",
//                 padding: "7px 12px 7px 36px",
//                 border: "none",
//                 borderRadius: 8,
//                 background: activeView === s.id ? activeBg : "transparent",
//                 color: activeView === s.id ? activeColor : textPrimary,
//                 cursor: "pointer",
//                 fontSize: 12,
//                 fontFamily: "'Poppins', sans-serif",
//                 textAlign: "left",
//                 transition: "all 0.15s",
//               }}
//               onMouseEnter={(e) => {
//                 if (activeView !== s.id)
//                   e.currentTarget.style.background = hoverBg;
//               }}
//               onMouseLeave={(e) => {
//                 if (activeView !== s.id)
//                   e.currentTarget.style.background = "transparent";
//               }}
//             >
//               <s.icon size={13} color={textSecondary} />
//               {s.label}
//             </button>
//           ))}

//         <button
//           onClick={() => onNavigate("activity")}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//             width: "100%",
//             padding: "8px 12px",
//             border: "none",
//             borderRadius: 8,
//             background: activeView === "activity" ? activeBg : "transparent",
//             color: activeView === "activity" ? activeColor : textPrimary,
//             cursor: "pointer",
//             fontSize: 13,
//             fontFamily: "'Poppins', sans-serif",
//             textAlign: "left",
//             transition: "all 0.15s",
//           }}
//           onMouseEnter={(e) => {
//             if (activeView !== "activity")
//               e.currentTarget.style.background = hoverBg;
//           }}
//           onMouseLeave={(e) => {
//             if (activeView !== "activity")
//               e.currentTarget.style.background = "transparent";
//           }}
//         >
//           <Activity size={15} color={textSecondary} />
//           Activity Logs
//         </button>
//       </div>

//       {/* Divider */}
//       <div
//         style={{
//           height: 1,
//           background: border,
//           margin: "6px 12px",
//           flexShrink: 0,
//         }}
//       />

//       {/* History header */}
//       <div
//         style={{
//           padding: "6px 12px 4px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           flexShrink: 0,
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//           <History size={13} color={textSecondary} />
//           <span
//             style={{
//               fontSize: 11,
//               fontWeight: 600,
//               color: textSecondary,
//               letterSpacing: "0.06em",
//               textTransform: "uppercase",
//             }}
//           >
//             History
//           </span>
//         </div>
//         <button
//           onClick={() => setSearchOpen((p) => !p)}
//           style={{
//             background: "none",
//             border: "none",
//             cursor: "pointer",
//             padding: 4,
//             borderRadius: 6,
//             color: textSecondary,
//           }}
//         >
//           <Search size={13} />
//         </button>
//       </div>

//       {searchOpen && (
//         <div style={{ padding: "0 12px 6px", flexShrink: 0 }}>
//           <input
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search conversations..."
//             style={{
//               width: "100%",
//               boxSizing: "border-box",
//               padding: "6px 10px",
//               borderRadius: 7,
//               border: `1px solid ${border}`,
//               background: isDark ? "#1f2937" : "#f9fafb",
//               color: textPrimary,
//               fontSize: 12,
//               fontFamily: "'Poppins', sans-serif",
//               outline: "none",
//             }}
//           />
//         </div>
//       )}

//       {/* Conversation list */}
//       <div
//         style={{
//           flex: 1,
//           overflowY: "auto",
//           padding: "0 8px 12px",
//         }}
//       >
//         {conversationsLoading ? (
//           <div
//             style={{
//               padding: "16px",
//               textAlign: "center",
//               color: textSecondary,
//               fontSize: 12,
//             }}
//           >
//             Loading...
//           </div>
//         ) : filteredConvs.length === 0 ? (
//           <div
//             style={{
//               padding: "16px 12px",
//               textAlign: "center",
//               color: textSecondary,
//               fontSize: 12,
//             }}
//           >
//             No conversations yet
//           </div>
//         ) : (
//           filteredConvs.map((conv) => {
//             const id = conv.id || conv.conversationId;
//             const title =
//               conv.title ||
//               conv.sessionTitle ||
//               conv.lastMessage ||
//               "Conversation";
//             return (
//               <div
//                 key={id}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 6,
//                   padding: "7px 10px",
//                   borderRadius: 8,
//                   cursor: "pointer",
//                   transition: "all 0.12s",
//                 }}
//                 onMouseEnter={(e) =>
//                   (e.currentTarget.style.background = hoverBg)
//                 }
//                 onMouseLeave={(e) =>
//                   (e.currentTarget.style.background = "transparent")
//                 }
//               >
//                 <MessageSquare size={13} color={textSecondary} />
//                 <span
//                   onClick={() => onSelectConversation(conv)}
//                   style={{
//                     flex: 1,
//                     fontSize: 12,
//                     color: textPrimary,
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     whiteSpace: "nowrap",
//                     fontFamily: "'Poppins', sans-serif",
//                   }}
//                 >
//                   {title}
//                 </span>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onDeleteConversation(id);
//                   }}
//                   style={{
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     padding: 3,
//                     borderRadius: 4,
//                     color: textSecondary,
//                     opacity: 0,
//                     transition: "opacity 0.15s",
//                     flexShrink: 0,
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.opacity = "1";
//                     e.currentTarget.style.color = "#ef4444";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.opacity = "0";
//                     e.currentTarget.style.color = textSecondary;
//                   }}
//                 >
//                   <Trash2 size={12} />
//                 </button>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }
// src/trainer/ai-companion/AiCompanionSidebar.jsx
import { useState, useEffect } from "react";
import {
  Plus,
  FileText,
  PenLine,
  Video,
  Zap,
  Activity,
  ChevronDown,
  ChevronRight,
  Search,
  Trash2,
  MessageSquare,
  LayoutTemplate,
  History,
  Bot,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "notes", label: "In-Person Notes", icon: FileText, view: "notes" },
  { id: "write", label: "Help Me Write", icon: PenLine, view: "write" },
  { id: "meetings", label: "Meetings", icon: Video, view: "meetings" },
];

const WORKFLOW_SUB = [
  { id: "workflow-create", label: "Create", icon: Plus },
  { id: "workflow-my", label: "My Workflows", icon: LayoutTemplate },
  { id: "workflow-templates", label: "Templates", icon: FileText },
];

const WORKFLOW_VIEWS = [
  "workflows",
  "workflow-create",
  "workflow-my",
  "workflow-templates",
];

export default function AiCompanionSidebar({
  isDark,
  activeView,
  onNavigate,
  onNewChat,
  conversations = [],
  conversationsLoading,
  onSelectConversation,
  onDeleteConversation,
}) {
  // Auto-expand workflow section whenever a workflow view is active
  const isWorkflowActive = WORKFLOW_VIEWS.includes(activeView);
  const [workflowOpen, setWorkflowOpen] = useState(isWorkflowActive);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // Keep expanded in sync if activeView changes externally
  useEffect(() => {
    if (isWorkflowActive) setWorkflowOpen(true);
  }, [isWorkflowActive]);

  const bg = isDark ? "#111827" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  const hoverBg = isDark ? "rgba(255,255,255,0.05)" : "#f3f4f6";
  const activeBg = isDark ? "rgba(37,99,235,0.15)" : "#eff6ff";
  const activeColor = "#2563eb";

  const filteredConvs = conversations.filter((c) => {
    const title = c.title || c.sessionTitle || c.lastMessage || "Conversation";
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const NavBtn = ({ item }) => {
    const Icon = item.icon;
    const isActive = activeView === item.view;
    return (
      <button
        onClick={() => item.view && onNavigate(item.view)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          padding: "8px 12px",
          border: "none",
          borderRadius: 8,
          background: isActive ? activeBg : "transparent",
          color: isActive ? activeColor : textPrimary,
          cursor: "pointer",
          fontSize: 13,
          fontWeight: isActive ? 600 : 400,
          fontFamily: "'Poppins', sans-serif",
          textAlign: "left",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.background = hoverBg;
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.background = "transparent";
        }}
      >
        <Icon size={15} color={isActive ? activeColor : textSecondary} />
        {item.label}
      </button>
    );
  };

  return (
    <div
      style={{
        width: 280,
        minWidth: 280,
        maxWidth: 280,
        height: "100%",
        background: bg,
        borderRight: `1px solid ${border}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "18px 16px 12px",
          borderBottom: `1px solid ${border}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: "linear-gradient(135deg, #2563eb, #60a5fa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
          }}
        >
          <Bot size={16} color="#fff" />
        </div>
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: textPrimary,
            letterSpacing: "-0.01em",
          }}
        >
          AI Companion
        </span>
      </div>

      {/* Nav */}
      <div style={{ padding: "10px 8px 4px", flexShrink: 0 }}>
        <button
          onClick={() => {
            if (onNewChat) onNewChat();
            onNavigate("home");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "8px 12px",
            border: "none",
            borderRadius: 8,
            background: activeView === "home" ? activeBg : "transparent",
            color: activeView === "home" ? activeColor : textPrimary,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: activeView === "home" ? 600 : 400,
            fontFamily: "'Poppins', sans-serif",
            textAlign: "left",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (activeView !== "home")
              e.currentTarget.style.background = hoverBg;
          }}
          onMouseLeave={(e) => {
            if (activeView !== "home")
              e.currentTarget.style.background = "transparent";
          }}
        >
          <Plus
            size={15}
            color={activeView === "home" ? activeColor : textSecondary}
          />
          New Chat
        </button>

        {NAV_ITEMS.map((item) => (
          <NavBtn key={item.id} item={item} />
        ))}

        {/* Workflows expandable — clicking parent navigates to "workflows" AND toggles expand */}
        <button
          onClick={() => {
            onNavigate("workflows");
            setWorkflowOpen(true); // always open when clicking parent
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "8px 12px",
            border: "none",
            borderRadius: 8,
            background: isWorkflowActive ? activeBg : "transparent",
            color: isWorkflowActive ? activeColor : textPrimary,
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "'Poppins', sans-serif",
            textAlign: "left",
            transition: "all 0.15s",
            fontWeight: isWorkflowActive ? 600 : 400,
          }}
          onMouseEnter={(e) => {
            if (!isWorkflowActive) e.currentTarget.style.background = hoverBg;
          }}
          onMouseLeave={(e) => {
            if (!isWorkflowActive)
              e.currentTarget.style.background = "transparent";
          }}
        >
          <Zap
            size={15}
            color={isWorkflowActive ? activeColor : textSecondary}
          />
          <span style={{ flex: 1 }}>Workflows</span>
          {/* Chevron toggles the submenu without navigating */}
          <span
            onClick={(e) => {
              e.stopPropagation();
              setWorkflowOpen((p) => !p);
            }}
            style={{ display: "flex", alignItems: "center" }}
          >
            {workflowOpen ? (
              <ChevronDown size={13} color={textSecondary} />
            ) : (
              <ChevronRight size={13} color={textSecondary} />
            )}
          </span>
        </button>

        {workflowOpen &&
          WORKFLOW_SUB.map((s) => {
            const isSubActive = activeView === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onNavigate(s.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "7px 12px 7px 36px",
                  border: "none",
                  borderRadius: 8,
                  background: isSubActive ? activeBg : "transparent",
                  color: isSubActive ? activeColor : textPrimary,
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "'Poppins', sans-serif",
                  textAlign: "left",
                  transition: "all 0.15s",
                  fontWeight: isSubActive ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!isSubActive) e.currentTarget.style.background = hoverBg;
                }}
                onMouseLeave={(e) => {
                  if (!isSubActive)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <s.icon
                  size={13}
                  color={isSubActive ? activeColor : textSecondary}
                />
                {s.label}
              </button>
            );
          })}

        <button
          onClick={() => onNavigate("activity")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "8px 12px",
            border: "none",
            borderRadius: 8,
            background: activeView === "activity" ? activeBg : "transparent",
            color: activeView === "activity" ? activeColor : textPrimary,
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "'Poppins', sans-serif",
            textAlign: "left",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (activeView !== "activity")
              e.currentTarget.style.background = hoverBg;
          }}
          onMouseLeave={(e) => {
            if (activeView !== "activity")
              e.currentTarget.style.background = "transparent";
          }}
        >
          <Activity size={15} color={textSecondary} />
          Activity Logs
        </button>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: border,
          margin: "6px 12px",
          flexShrink: 0,
        }}
      />

      {/* History header */}
      <div
        style={{
          padding: "6px 12px 4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <History size={13} color={textSecondary} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: textSecondary,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            History
          </span>
        </div>
        <button
          onClick={() => setSearchOpen((p) => !p)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            borderRadius: 6,
            color: textSecondary,
          }}
        >
          <Search size={13} />
        </button>
      </div>

      {searchOpen && (
        <div style={{ padding: "0 12px 6px", flexShrink: 0 }}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "6px 10px",
              borderRadius: 7,
              border: `1px solid ${border}`,
              background: isDark ? "#1f2937" : "#f9fafb",
              color: textPrimary,
              fontSize: 12,
              fontFamily: "'Poppins', sans-serif",
              outline: "none",
            }}
          />
        </div>
      )}

      {/* Conversation list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 12px" }}>
        {conversationsLoading ? (
          <div
            style={{
              padding: "16px",
              textAlign: "center",
              color: textSecondary,
              fontSize: 12,
            }}
          >
            Loading...
          </div>
        ) : filteredConvs.length === 0 ? (
          <div
            style={{
              padding: "16px 12px",
              textAlign: "center",
              color: textSecondary,
              fontSize: 12,
            }}
          >
            No conversations yet
          </div>
        ) : (
          filteredConvs.map((conv) => {
            const id = conv.id || conv.conversationId;
            const title =
              conv.title ||
              conv.sessionTitle ||
              conv.lastMessage ||
              "Conversation";
            return (
              <div
                key={id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 10px",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.12s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = hoverBg)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <MessageSquare size={13} color={textSecondary} />
                <span
                  onClick={() => onSelectConversation(conv)}
                  style={{
                    flex: 1,
                    fontSize: 12,
                    color: textPrimary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {title}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(id);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 3,
                    borderRadius: 4,
                    color: textSecondary,
                    opacity: 0,
                    transition: "opacity 0.15s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.color = "#ef4444";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "0";
                    e.currentTarget.style.color = textSecondary;
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
