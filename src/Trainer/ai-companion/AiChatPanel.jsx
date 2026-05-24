// import { useState, useRef, useEffect, useCallback } from "react";
// import {
//   Send,
//   Plus,
//   Bot,
//   User,
//   Copy,
//   Check,
//   ChevronDown,
//   Sparkles,
//   AlertCircle,
// } from "lucide-react";

// import { sendAiCompanionMessage } from "../../services/liveSessionService";
// import AiModeCards, { MODES_BY_TAB } from "./AiModeCards";
// import AiSourceDropdown from "./AiSourceDropdown";
// import AiContextResourceModal from "./AiContextResourceModal";

// const SESSION_REQUIRED_MODES = new Set([
//   "POST_MEETING_FOLLOWUP",
//   "SUMMARIZER",
//   "DAILY_REPORT",
//   "GENERATE_QUIZ",
//   "ACTION_ITEMS",
//   "OPEN_QUESTIONS",
//   "STUDENT_DOUBTS",
//   "ENGAGEMENT_REPORT",
//   "CHAT_SUMMARY",
//   "WHITEBOARD_SUMMARY",
//   "RECORDING_SUMMARY",
//   "MEETING_PREP",
// ]);

// function useTypewriter(text, speed = 6) {
//   const [displayed, setDisplayed] = useState("");
//   const [done, setDone] = useState(false);
//   useEffect(() => {
//     if (!text) {
//       setDisplayed("");
//       setDone(false);
//       return;
//     }
//     setDisplayed("");
//     setDone(false);
//     let i = 0;
//     const timer = setInterval(() => {
//       i += Math.ceil(text.length / 180);
//       setDisplayed(text.slice(0, i));
//       if (i >= text.length) {
//         setDisplayed(text);
//         setDone(true);
//         clearInterval(timer);
//       }
//     }, speed);
//     return () => clearInterval(timer);
//   }, [text]);
//   return { displayed, done };
// }

// function MessageBubble({ msg, isDark }) {
//   const [copied, setCopied] = useState(false);
//   const isUser = msg.role === "user";
//   const { displayed, done } = useTypewriter(isUser ? null : msg.content);
//   const content = isUser ? msg.content : done ? msg.content : displayed;
//   const border = isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb";

//   const copy = () => {
//     navigator.clipboard.writeText(msg.content);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         gap: 10,
//         padding: "8px 0",
//         flexDirection: isUser ? "row-reverse" : "row",
//         alignItems: "flex-start",
//       }}
//     >
//       <div
//         style={{
//           width: 32,
//           height: 32,
//           borderRadius: "50%",
//           flexShrink: 0,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           background: isUser
//             ? "linear-gradient(135deg, #10b981, #059669)"
//             : "linear-gradient(135deg, #2563eb, #60a5fa)",
//           boxShadow: isUser
//             ? "0 2px 8px rgba(16,185,129,0.3)"
//             : "0 2px 8px rgba(37,99,235,0.3)",
//         }}
//       >
//         {isUser ? (
//           <User size={14} color="#fff" />
//         ) : (
//           <Bot size={14} color="#fff" />
//         )}
//       </div>

//       <div
//         style={{
//           maxWidth: "76%",
//           display: "flex",
//           flexDirection: "column",
//           gap: 4,
//           alignItems: isUser ? "flex-end" : "flex-start",
//         }}
//       >
//         {!isUser && msg.mode && (
//           <span
//             style={{
//               fontSize: 9,
//               fontWeight: 700,
//               letterSpacing: "0.08em",
//               color: "#2563eb",
//               background: "rgba(37,99,235,0.08)",
//               border: "1px solid rgba(37,99,235,0.18)",
//               padding: "2px 8px",
//               borderRadius: 99,
//               fontFamily: "'Poppins', sans-serif",
//               textTransform: "uppercase",
//             }}
//           >
//             {msg.mode.replace(/_/g, " ")}
//           </span>
//         )}

//         <div
//           style={{
//             padding: "10px 14px",
//             borderRadius: isUser ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
//             background: isUser
//               ? "linear-gradient(135deg, #2563eb, #3b82f6)"
//               : isDark
//                 ? "#1f2937"
//                 : "#f8fafc",
//             border: isUser ? "none" : `1px solid ${border}`,
//             boxShadow: isUser
//               ? "0 4px 12px rgba(37,99,235,0.25)"
//               : "0 1px 4px rgba(0,0,0,0.04)",
//           }}
//         >
//           {!isUser && !done && (
//             <span
//               style={{
//                 display: "inline-block",
//                 width: 2,
//                 height: 14,
//                 background: "#2563eb",
//                 marginRight: 4,
//                 animation: "blink 1s infinite",
//                 borderRadius: 1,
//                 verticalAlign: "middle",
//               }}
//             />
//           )}
//           <div
//             style={{
//               fontSize: 13,
//               lineHeight: 1.7,
//               color: isUser
//                 ? "#fff"
//                 : isDark
//                   ? "rgba(255,255,255,0.88)"
//                   : "#1f2937",
//               fontFamily: "'Poppins', sans-serif",
//               fontWeight: 400,
//               whiteSpace: "pre-wrap",
//               wordBreak: "break-word",
//             }}
//           >
//             {content}
//           </div>
//         </div>

//         {!isUser && done && (
//           <button
//             onClick={copy}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 4,
//               padding: "3px 8px",
//               borderRadius: 6,
//               border: `1px solid ${border}`,
//               background: "transparent",
//               cursor: "pointer",
//               color: copied
//                 ? "#10b981"
//                 : isDark
//                   ? "rgba(255,255,255,0.3)"
//                   : "#9ca3af",
//               fontSize: 10,
//               fontFamily: "'Poppins', sans-serif",
//               fontWeight: 600,
//               transition: "all 0.15s",
//             }}
//           >
//             {copied ? <Check size={9} /> : <Copy size={9} />}
//             {copied ? "Copied!" : "Copy"}
//           </button>
//         )}

//         <span
//           style={{
//             fontSize: 9,
//             color: isDark ? "rgba(255,255,255,0.2)" : "#d1d5db",
//             fontFamily: "'Poppins', sans-serif",
//           }}
//         >
//           {msg.time}
//         </span>
//       </div>
//     </div>
//   );
// }

// const TABS = ["Suggested", "Meeting", "Coaching"];

// function ModeCardItem({
//   m,
//   isDark,
//   border,
//   textPrimary,
//   textSecondary,
//   onSelect,
// }) {
//   const [hov, setHov] = useState(false);
//   const Icon = m.icon;
//   return (
//     <div
//       onClick={onSelect}
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         padding: "14px 16px",
//         borderRadius: 12,
//         cursor: "pointer",
//         border: `1px solid ${hov ? m.color + "55" : border}`,
//         background: hov
//           ? `${m.color}08`
//           : isDark
//             ? "rgba(255,255,255,0.02)"
//             : "#ffffff",
//         transition: "all 0.18s",
//         boxShadow: hov ? `0 4px 20px ${m.color}14` : "none",
//         display: "flex",
//         alignItems: "flex-start",
//         gap: 12,
//       }}
//     >
//       <div
//         style={{
//           width: 36,
//           height: 36,
//           borderRadius: 9,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           background: `${m.color}14`,
//           border: `1px solid ${m.color}22`,
//           flexShrink: 0,
//         }}
//       >
//         <Icon size={16} color={m.color} />
//       </div>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div
//           style={{
//             fontSize: 13,
//             fontWeight: 600,
//             color: textPrimary,
//             fontFamily: "'Poppins', sans-serif",
//             marginBottom: 4,
//             lineHeight: 1.3,
//           }}
//         >
//           {m.label}
//         </div>
//         <p
//           style={{
//             fontSize: 11,
//             color: textSecondary,
//             fontFamily: "'Poppins', sans-serif",
//             margin: 0,
//             lineHeight: 1.5,
//           }}
//         >
//           {m.description}
//         </p>
//       </div>
//     </div>
//   );
// }

// function PromptInputBox({
//   isDark,
//   input,
//   setInput,
//   loading,
//   onSend,
//   onKeyDown,
//   inputRef,
//   selectedMode,
//   setModeMenuOpen,
//   modeMenuOpen,
//   allModes,
//   setSelectedMode,
//   selectedSources,
//   setSelectedSources,
//   additionalContext,
//   setShowContextModal,
//   border,
//   textSecondary,
//   inputBg,
// }) {
//   return (
//     <div
//       style={{
//         borderRadius: 16,
//         border: `1.5px solid ${border}`,
//         background: inputBg,
//         boxShadow: isDark
//           ? "0 4px 24px rgba(0,0,0,0.35)"
//           : "0 4px 24px rgba(37,99,235,0.08)",
//         overflow: "visible",
//         transition: "border-color 0.2s, box-shadow 0.2s",
//         width: "100%",
//       }}
//       onFocusCapture={(e) => {
//         e.currentTarget.style.borderColor = "#2563eb";
//         e.currentTarget.style.boxShadow = "0 4px 28px rgba(37,99,235,0.18)";
//       }}
//       onBlurCapture={(e) => {
//         e.currentTarget.style.borderColor = border;
//         e.currentTarget.style.boxShadow = isDark
//           ? "0 4px 24px rgba(0,0,0,0.35)"
//           : "0 4px 24px rgba(37,99,235,0.08)";
//       }}
//     >
//       <textarea
//         ref={inputRef}
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyDown={onKeyDown}
//         placeholder={
//           selectedMode
//             ? `Mode: ${selectedMode.label} — Write a message or type @ for context`
//             : "Write a message or type @ for context"
//         }
//         rows={2}
//         disabled={loading}
//         style={{
//           width: "100%",
//           boxSizing: "border-box",
//           padding: "16px 20px 10px",
//           border: "none",
//           background: "transparent",
//           resize: "none",
//           color: isDark ? "#f9fafb" : "#111827",
//           fontSize: 14,
//           outline: "none",
//           fontFamily: "'Poppins', sans-serif",
//           lineHeight: 1.6,
//           maxHeight: 120,
//           overflowY: "auto",
//           display: "block",
//           borderRadius: "16px 16px 0 0",
//         }}
//         onInput={(e) => {
//           e.target.style.height = "auto";
//           e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
//         }}
//       />

//       <div
//         style={{
//           padding: "10px 14px 12px",
//           display: "flex",
//           alignItems: "center",
//           gap: 8,
//           borderTop: `1px solid ${border}`,
//           background: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.015)",
//           borderRadius: "0 0 16px 16px",
//         }}
//       >
//         {/* + context */}
//         <button
//           onClick={() => setShowContextModal(true)}
//           title="Add context & resources"
//           style={{
//             width: 30,
//             height: 30,
//             borderRadius: 7,
//             border: `1px solid ${border}`,
//             background: additionalContext
//               ? "rgba(37,99,235,0.08)"
//               : "transparent",
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: additionalContext ? "#2563eb" : textSecondary,
//             flexShrink: 0,
//             transition: "all 0.15s",
//           }}
//         >
//           <Plus size={14} />
//         </button>

//         <AiSourceDropdown isDark={isDark} onChange={setSelectedSources} />

//         {/* Mode dropdown */}
//         <div style={{ position: "relative" }}>
//           <button
//             onClick={() => setModeMenuOpen((p) => !p)}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//               padding: "6px 10px",
//               borderRadius: 7,
//               border: `1px solid ${selectedMode ? "#2563eb" : border}`,
//               background: selectedMode ? "rgba(37,99,235,0.08)" : "transparent",
//               color: selectedMode ? "#2563eb" : textSecondary,
//               cursor: "pointer",
//               fontSize: 12,
//               fontFamily: "'Poppins', sans-serif",
//               fontWeight: 500,
//               transition: "all 0.15s",
//             }}
//           >
//             {selectedMode
//               ? selectedMode.label.split(" ").slice(0, 2).join(" ")
//               : "Mode"}
//             <ChevronDown size={12} />
//           </button>

//           {modeMenuOpen && (
//             <div
//               style={{
//                 position: "absolute",
//                 bottom: "calc(100% + 8px)",
//                 left: 0,
//                 width: 220,
//                 background: isDark ? "#1f2937" : "#ffffff",
//                 border: `1px solid ${border}`,
//                 borderRadius: 12,
//                 boxShadow: isDark
//                   ? "0 8px 32px rgba(0,0,0,0.5)"
//                   : "0 8px 32px rgba(0,0,0,0.12)",
//                 zIndex: 200,
//                 maxHeight: 260,
//                 overflowY: "auto",
//               }}
//             >
//               <button
//                 onClick={() => {
//                   setSelectedMode(null);
//                   setModeMenuOpen(false);
//                 }}
//                 style={{
//                   width: "100%",
//                   padding: "9px 14px",
//                   border: "none",
//                   background: "transparent",
//                   textAlign: "left",
//                   fontSize: 12,
//                   color: textSecondary,
//                   cursor: "pointer",
//                   fontFamily: "'Poppins', sans-serif",
//                   borderBottom: `1px solid ${border}`,
//                 }}
//               >
//                 No mode (Custom)
//               </button>
//               {allModes.map((m) => (
//                 <button
//                   key={m.mode}
//                   onClick={() => {
//                     setSelectedMode(m);
//                     setModeMenuOpen(false);
//                   }}
//                   style={{
//                     width: "100%",
//                     padding: "9px 14px",
//                     border: "none",
//                     background:
//                       selectedMode?.mode === m.mode
//                         ? "rgba(37,99,235,0.08)"
//                         : "transparent",
//                     textAlign: "left",
//                     fontSize: 12,
//                     color:
//                       selectedMode?.mode === m.mode
//                         ? "#2563eb"
//                         : isDark
//                           ? "#f9fafb"
//                           : "#111827",
//                     cursor: "pointer",
//                     fontFamily: "'Poppins', sans-serif",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 8,
//                     transition: "background 0.1s",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (selectedMode?.mode !== m.mode)
//                       e.currentTarget.style.background = isDark
//                         ? "rgba(255,255,255,0.04)"
//                         : "#f9fafb";
//                   }}
//                   onMouseLeave={(e) => {
//                     if (selectedMode?.mode !== m.mode)
//                       e.currentTarget.style.background = "transparent";
//                   }}
//                 >
//                   <m.icon size={13} color={m.color} />
//                   {m.label}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         <div style={{ flex: 1 }} />

//         <button
//           onClick={() => input.trim() && onSend(null, input.trim())}
//           disabled={!input.trim() || loading}
//           style={{
//             width: 36,
//             height: 36,
//             borderRadius: 10,
//             border: "none",
//             background:
//               input.trim() && !loading
//                 ? "#2563eb"
//                 : isDark
//                   ? "rgba(255,255,255,0.08)"
//                   : "#e5e7eb",
//             cursor: input.trim() && !loading ? "pointer" : "not-allowed",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             transition: "all 0.15s",
//             flexShrink: 0,
//             boxShadow:
//               input.trim() && !loading
//                 ? "0 2px 10px rgba(37,99,235,0.4)"
//                 : "none",
//           }}
//         >
//           {loading ? (
//             <span
//               style={{
//                 width: 14,
//                 height: 14,
//                 border: "2px solid rgba(255,255,255,0.3)",
//                 borderTop: "2px solid #fff",
//                 borderRadius: "50%",
//                 animation: "spin 0.8s linear infinite",
//                 display: "block",
//               }}
//             />
//           ) : (
//             <Send
//               size={14}
//               color={
//                 input.trim() && !loading
//                   ? "#fff"
//                   : isDark
//                     ? "rgba(255,255,255,0.25)"
//                     : "#9ca3af"
//               }
//             />
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

// // ── MAIN COMPONENT ──────────────────────────────────────────────────────────
// export default function AiChatPanel({
//   sessionId,
//   sessionTitle,
//   isDark,
//   conversationId: externalConvId,
//   onConversationCreated,
//   externalMessages,
//   onNewChat,
//   showHomeIfEmpty = true,
// }) {
//   const [activeTab, setActiveTab] = useState("suggested");
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [chatStarted, setChatStarted] = useState(false);
//   const [conversationId, setConversationId] = useState(null);
//   const [selectedSources, setSelectedSources] = useState([
//     "MEETINGS",
//     "CHAT",
//     "WHITEBOARD",
//   ]);
//   const [showContextModal, setShowContextModal] = useState(false);
//   const [additionalContext, setAdditionalContext] = useState("");
//   const [resourceIds, setResourceIds] = useState([]);
//   const [selectedMode, setSelectedMode] = useState(null);
//   const [modeMenuOpen, setModeMenuOpen] = useState(false);

//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);
//   const homeInputRef = useRef(null);

//   const bg = isDark ? "#0d1117" : "#f0f4f8";
//   const border = isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0";
//   const textPrimary = isDark ? "#f9fafb" : "#111827";
//   const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
//   const inputBg = isDark ? "#1a2233" : "#ffffff";

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   useEffect(() => {
//     if (externalMessages && externalMessages.length > 0) {
//       const mapped = externalMessages.map((m, i) => ({
//         id: m.id || i,
//         role: m.role || m.sender || "assistant",
//         content: m.content || m.message || m.response || "",
//         mode: m.mode || null,
//         time: m.createdAt
//           ? new Date(m.createdAt).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })
//           : "",
//       }));
//       setMessages(mapped);
//       setChatStarted(true);
//     }
//   }, [externalMessages]);

//   useEffect(() => {
//     if (externalConvId) setConversationId(externalConvId);
//   }, [externalConvId]);

//   const now = () =>
//     new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//   const sendMessage = useCallback(
//     async (modeObj, customMessage) => {
//       const msgText = customMessage || input.trim();
//       const modeKey = modeObj?.mode || selectedMode?.mode || "CUSTOM_QUESTION";

//       if (!msgText && !modeObj) return;

//       if (SESSION_REQUIRED_MODES.has(modeKey) && !sessionId) {
//         setError("Please select a meeting/session first to use this mode.");
//         return;
//       }

//       setError(null);
//       setChatStarted(true);

//       const userMsg = {
//         id: Date.now(),
//         role: "user",
//         content: msgText || `Run: ${modeObj?.label || modeKey}`,
//         time: now(),
//       };
//       setMessages((prev) => [...prev, userMsg]);
//       setInput("");
//       setLoading(true);

//       try {
//         const res = await sendAiCompanionMessage(
//           sessionId || null,
//           modeKey,
//           msgText,
//           additionalContext || null,
//           selectedSources,
//           resourceIds,
//           conversationId,
//           true,
//         );

//         const data = res.data || {};
//         const responseText =
//           data.response ||
//           data.message ||
//           data.content ||
//           "No response from AI.";
//         const newConvId =
//           data.conversationId || data.conversation?.id || conversationId;

//         if (newConvId && newConvId !== conversationId) {
//           setConversationId(newConvId);
//           if (onConversationCreated) onConversationCreated(newConvId);
//         }

//         setMessages((prev) => [
//           ...prev,
//           {
//             id: Date.now() + 1,
//             role: "assistant",
//             content: responseText,
//             mode: modeKey,
//             time: now(),
//           },
//         ]);
//       } catch (err) {
//         console.error("AI Companion error:", err);
//         const errMsg =
//           err?.response?.data?.error ||
//           err?.response?.data?.message ||
//           "AI service unavailable. Please check your configuration.";
//         setError(errMsg);
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: Date.now() + 1,
//             role: "assistant",
//             content: `⚠️ ${errMsg}`,
//             time: now(),
//           },
//         ]);
//       } finally {
//         setLoading(false);
//         setTimeout(() => inputRef.current?.focus(), 50);
//       }
//     },
//     [
//       input,
//       sessionId,
//       additionalContext,
//       selectedSources,
//       resourceIds,
//       conversationId,
//       selectedMode,
//       onConversationCreated,
//     ],
//   );

//   const handleNewChat = () => {
//     setMessages([]);
//     setChatStarted(false);
//     setConversationId(null);
//     setError(null);
//     setSelectedMode(null);
//     setInput("");
//     if (onNewChat) onNewChat();
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       if (input.trim()) sendMessage(null, input.trim());
//     }
//   };

//   const allModes = [
//     ...MODES_BY_TAB.suggested,
//     ...MODES_BY_TAB.meeting,
//     ...MODES_BY_TAB.coaching,
//   ].filter((m, i, arr) => arr.findIndex((x) => x.mode === m.mode) === i);

//   const inputBoxProps = {
//     isDark,
//     input,
//     setInput,
//     loading,
//     onSend: sendMessage,
//     onKeyDown: handleKeyDown,
//     selectedMode,
//     setModeMenuOpen,
//     modeMenuOpen,
//     allModes,
//     setSelectedMode,
//     selectedSources,
//     setSelectedSources,
//     additionalContext,
//     setShowContextModal,
//     border,
//     textSecondary,
//     inputBg,
//   };

//   return (
//     <div
//       style={{
//         flex: 1,
//         display: "flex",
//         flexDirection: "column",
//         background: bg,
//         overflow: "hidden",
//         fontFamily: "'Poppins', sans-serif",
//         position: "relative",
//         minHeight: 0,
//       }}
//     >
//       <style>{`
//         @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
//         @keyframes spin { to{transform:rotate(360deg)} }
//         @keyframes dotPulse { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
//         @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
//       `}</style>

//       {/* ══════════════════════════════════════════════════════
//           HOME VIEW
//          ══════════════════════════════════════════════════════ */}
//       {!chatStarted && showHomeIfEmpty && (
//         <div
//           style={{
//             flex: 1,
//             overflowY: "auto",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             padding: "44px 24px 48px",
//             animation: "fadeInUp 0.3s ease",
//             minHeight: 0,
//           }}
//         >
//           {/* 1 ── HEADING */}
//           <div
//             style={{
//               textAlign: "center",
//               marginBottom: 28,
//               width: "100%",
//               maxWidth: 600,
//             }}
//           >
//             <div
//               style={{
//                 width: 52,
//                 height: 52,
//                 borderRadius: 14,
//                 background: "linear-gradient(135deg, #2563eb, #60a5fa)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 margin: "0 auto 14px",
//                 boxShadow: "0 8px 24px rgba(37,99,235,0.28)",
//               }}
//             >
//               <Sparkles size={24} color="#fff" />
//             </div>
//             <h1
//               style={{
//                 fontSize: 26,
//                 fontWeight: 800,
//                 color: textPrimary,
//                 margin: "0 0 6px",
//                 letterSpacing: "-0.02em",
//                 fontFamily: "'Poppins', sans-serif",
//               }}
//             >
//               AI Companion
//             </h1>
//             <p
//               style={{
//                 fontSize: 13,
//                 color: textSecondary,
//                 margin: 0,
//                 fontFamily: "'Poppins', sans-serif",
//                 lineHeight: 1.6,
//               }}
//             >
//               Ask questions, summarize sessions, generate reports, and get
//               coaching insights.
//             </p>
//           </div>

//           {/* 2 ── PROMPT BOX */}
//           <div style={{ width: "100%", maxWidth: 600, marginBottom: 24 }}>
//             {!sessionId && (
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                   padding: "9px 14px",
//                   borderRadius: 10,
//                   background: "rgba(245,158,11,0.08)",
//                   border: "1px solid rgba(245,158,11,0.2)",
//                   marginBottom: 12,
//                   fontSize: 12,
//                   color: "#b45309",
//                   fontFamily: "'Poppins', sans-serif",
//                 }}
//               >
//                 <AlertCircle size={13} />
//                 Some modes require a session. Select a meeting/session to unlock
//                 all features.
//               </div>
//             )}

//             {error && (
//               <div
//                 style={{
//                   marginBottom: 12,
//                   padding: "9px 14px",
//                   borderRadius: 10,
//                   background: "rgba(239,68,68,0.08)",
//                   border: "1px solid rgba(239,68,68,0.2)",
//                   fontSize: 12,
//                   color: "#dc2626",
//                   fontFamily: "'Poppins', sans-serif",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                 }}
//               >
//                 <AlertCircle size={13} />
//                 <span style={{ flex: 1 }}>{error}</span>
//                 <button
//                   onClick={() => setError(null)}
//                   style={{
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     color: "#dc2626",
//                     padding: 2,
//                   }}
//                 >
//                   ×
//                 </button>
//               </div>
//             )}

//             <PromptInputBox {...inputBoxProps} inputRef={homeInputRef} />

//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 marginTop: 7,
//                 padding: "0 2px",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: 10,
//                   color: isDark ? "rgba(255,255,255,0.2)" : "#c4cdd6",
//                   fontFamily: "'Poppins',sans-serif",
//                 }}
//               >
//                 Press Enter to send · Shift+Enter for new line
//               </span>
//               <span
//                 style={{
//                   fontSize: 10,
//                   color: isDark ? "rgba(255,255,255,0.2)" : "#c4cdd6",
//                   fontFamily: "'Poppins',sans-serif",
//                 }}
//               >
//                 Powered by GPT-4o
//               </span>
//             </div>
//           </div>

//           {/* 3 ── TABS */}
//           <div
//             style={{
//               width: "100%",
//               maxWidth: 600,
//               display: "flex",
//               alignItems: "center",
//               borderBottom: `1px solid ${border}`,
//               marginBottom: 20,
//             }}
//           >
//             {TABS.map((tab) => {
//               const isActive = activeTab === tab.toLowerCase();
//               return (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab.toLowerCase())}
//                   style={{
//                     padding: "10px 16px",
//                     border: "none",
//                     background: "transparent",
//                     borderBottom: isActive
//                       ? "2px solid #2563eb"
//                       : "2px solid transparent",
//                     color: isActive ? "#2563eb" : textSecondary,
//                     fontSize: 13,
//                     fontWeight: isActive ? 700 : 500,
//                     cursor: "pointer",
//                     fontFamily: "'Poppins', sans-serif",
//                     marginBottom: -1,
//                     transition: "all 0.15s",
//                   }}
//                 >
//                   {tab}
//                 </button>
//               );
//             })}
//             <div style={{ flex: 1 }} />
//             <button
//               onClick={() => setActiveTab("suggested")}
//               style={{
//                 padding: "10px 14px",
//                 border: "none",
//                 background: "transparent",
//                 color: "#2563eb",
//                 fontSize: 12,
//                 fontWeight: 600,
//                 cursor: "pointer",
//                 fontFamily: "'Poppins', sans-serif",
//                 marginBottom: -1,
//               }}
//             >
//               View all →
//             </button>
//           </div>

//           {/* 4 ── MODE CARDS */}
//           <div style={{ width: "100%", maxWidth: 600 }}>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(2, 1fr)",
//                 gap: 12,
//               }}
//             >
//               {(MODES_BY_TAB[activeTab] || MODES_BY_TAB.suggested).map((m) => (
//                 <ModeCardItem
//                   key={m.mode}
//                   m={m}
//                   isDark={isDark}
//                   border={border}
//                   textPrimary={textPrimary}
//                   textSecondary={textSecondary}
//                   onSelect={() => {
//                     setSelectedMode(m);
//                     if (SESSION_REQUIRED_MODES.has(m.mode) && !sessionId) {
//                       setError(
//                         "Please select a meeting/session first to use this mode.",
//                       );
//                       return;
//                     }
//                     sendMessage(m, null);
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ══════════════════════════════════════════════════════
//           CHAT VIEW — BUG 1 FIX: centered max-width layout
//                       BUG 3 FIX: removed top-right "New chat" button
//          ══════════════════════════════════════════════════════ */}
//       {chatStarted && (
//         <>
//           {/* Top bar — BUG 3: removed the "New chat" RefreshCw button entirely */}
//           <div
//             style={{
//               padding: "12px 24px",
//               borderBottom: `1px solid ${border}`,
//               background: isDark ? "#111827" : "#ffffff",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center" /* center the title */,
//               flexShrink: 0,
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <Sparkles size={15} color="#2563eb" />
//               <span
//                 style={{ fontSize: 13, fontWeight: 600, color: textPrimary }}
//               >
//                 {sessionTitle || "AI Companion Chat"}
//               </span>
//               {sessionId && (
//                 <span
//                   style={{
//                     fontSize: 10,
//                     padding: "2px 8px",
//                     background: "rgba(37,99,235,0.08)",
//                     color: "#2563eb",
//                     borderRadius: 99,
//                     border: "1px solid rgba(37,99,235,0.18)",
//                     fontWeight: 600,
//                   }}
//                 >
//                   Session linked
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Messages area — BUG 1 FIX: centered container with max-width */}
//           <div
//             style={{
//               flex: 1,
//               overflowY: "auto",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center" /* center horizontally */,
//               minHeight: 0,
//             }}
//           >
//             <div
//               style={{
//                 width: "100%",
//                 maxWidth: 960 /* max-width like Zoom AI */,
//                 padding: "20px 32px",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: 2,
//                 boxSizing: "border-box",
//               }}
//             >
//               {/* Quick mode pills */}
//               <div
//                 style={{
//                   display: "flex",
//                   gap: 6,
//                   overflowX: "auto",
//                   paddingBottom: 10,
//                   marginBottom: 10,
//                   borderBottom: `1px solid ${border}`,
//                   flexShrink: 0,
//                 }}
//               >
//                 {(MODES_BY_TAB[activeTab] || MODES_BY_TAB.suggested)
//                   .slice(0, 5)
//                   .map((m) => (
//                     <button
//                       key={m.mode}
//                       onClick={() => {
//                         if (SESSION_REQUIRED_MODES.has(m.mode) && !sessionId) {
//                           setError(
//                             "Please select a meeting/session first to use this mode.",
//                           );
//                           return;
//                         }
//                         sendMessage(m, null);
//                       }}
//                       disabled={loading}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 5,
//                         padding: "5px 11px",
//                         borderRadius: 7,
//                         border: `1px solid ${border}`,
//                         background: isDark
//                           ? "rgba(255,255,255,0.03)"
//                           : "#f9fafb",
//                         cursor: loading ? "not-allowed" : "pointer",
//                         flexShrink: 0,
//                         color: m.color,
//                         fontSize: 10,
//                         fontWeight: 700,
//                         fontFamily: "'Poppins', sans-serif",
//                         opacity: loading ? 0.5 : 1,
//                         transition: "all 0.15s",
//                       }}
//                     >
//                       <m.icon size={11} />
//                       {m.label.split(" ").slice(0, 2).join(" ")}
//                     </button>
//                   ))}
//               </div>

//               {messages.map((msg) => (
//                 <MessageBubble key={msg.id} msg={msg} isDark={isDark} />
//               ))}

//               {loading && (
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 10,
//                     padding: "8px 0",
//                     alignItems: "flex-start",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 32,
//                       height: 32,
//                       borderRadius: "50%",
//                       background: "linear-gradient(135deg, #2563eb, #60a5fa)",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       flexShrink: 0,
//                     }}
//                   >
//                     <Bot size={14} color="#fff" />
//                   </div>
//                   <div
//                     style={{
//                       padding: "12px 16px",
//                       borderRadius: "4px 14px 14px 14px",
//                       background: isDark ? "#1f2937" : "#f8fafc",
//                       border: `1px solid ${border}`,
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 5,
//                     }}
//                   >
//                     {[0, 1, 2].map((i) => (
//                       <span
//                         key={i}
//                         style={{
//                           width: 7,
//                           height: 7,
//                           borderRadius: "50%",
//                           background: "#2563eb",
//                           display: "inline-block",
//                           animation: `dotPulse 1.4s ${i * 0.2}s ease-in-out infinite`,
//                         }}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>
//           </div>

//           {/* Error banner — also centered */}
//           {error && (
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 padding: "0 24px 10px",
//                 flexShrink: 0,
//               }}
//             >
//               <div
//                 style={{
//                   width: "100%",
//                   maxWidth: 960,
//                   padding: "10px 14px",
//                   borderRadius: 10,
//                   background: "rgba(239,68,68,0.08)",
//                   border: "1px solid rgba(239,68,68,0.2)",
//                   fontSize: 12,
//                   color: "#dc2626",
//                   fontFamily: "'Poppins', sans-serif",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                 }}
//               >
//                 <AlertCircle size={14} />
//                 <span style={{ flex: 1 }}>{error}</span>
//                 <button
//                   onClick={() => setError(null)}
//                   style={{
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     color: "#dc2626",
//                     padding: 2,
//                   }}
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Bottom input — BUG 1 FIX: centered with max-width */}
//           <div
//             style={{
//               padding: "14px 24px 18px",
//               flexShrink: 0,
//               background: isDark ? "#111827" : "#ffffff",
//               borderTop: `1px solid ${border}`,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center" /* center the input box */,
//             }}
//           >
//             <div style={{ width: "100%", maxWidth: 960 }}>
//               <PromptInputBox {...inputBoxProps} inputRef={inputRef} />
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   marginTop: 7,
//                   padding: "0 2px",
//                 }}
//               >
//                 <span
//                   style={{
//                     fontSize: 10,
//                     color: isDark ? "rgba(255,255,255,0.2)" : "#d1d5db",
//                     fontFamily: "'Poppins',sans-serif",
//                   }}
//                 >
//                   Press Enter to send · Shift+Enter for new line
//                 </span>
//                 <span
//                   style={{
//                     fontSize: 10,
//                     color: isDark ? "rgba(255,255,255,0.2)" : "#d1d5db",
//                     fontFamily: "'Poppins',sans-serif",
//                   }}
//                 >
//                   Powered by GPT-4o
//                 </span>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Context modal */}
//       {showContextModal && (
//         <AiContextResourceModal
//           isDark={isDark}
//           initialContext={additionalContext}
//           initialResourceIds={resourceIds.join(", ")}
//           onSave={({ additionalContext: ctx, resourceIds: ids }) => {
//             setAdditionalContext(ctx);
//             setResourceIds(ids);
//           }}
//           onClose={() => setShowContextModal(false)}
//         />
//       )}
//     </div>
//   );
// }
// src/trainer/ai-companion/AiChatPanel.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Plus,
  Bot,
  User,
  Copy,
  Check,
  ChevronDown,
  Sparkles,
  AlertCircle,
  Calendar,
  X,
} from "lucide-react";

import {
  sendAiCompanionMessage,
  getSessionHistory,
} from "../../services/liveSessionService";
import AiModeCards, { MODES_BY_TAB } from "./AiModeCards";
import AiSourceDropdown from "./AiSourceDropdown";
import AiContextResourceModal from "./AiContextResourceModal";

const SESSION_REQUIRED_MODES = new Set([
  "POST_MEETING_FOLLOWUP",
  "DAILY_REFLECTION",
  "CROSS_MEETING_ANALYST",
  "TOP_5_THINGS",
  "SUMMARIZER",
  "DAILY_REPORT",
  "MEETING_PREP",
  "ACTION_ITEMS",
  "OPEN_QUESTIONS",
  "STUDENT_DOUBTS",
  "ENGAGEMENT_REPORT",
  "RECORDING_SUMMARY",
  "WHITEBOARD_SUMMARY",
  "CHAT_SUMMARY",
  "GENERATE_QUIZ",
  "COACHING",
  "WEEKLY_BATCH_REPORT",
  "STUDENT_PROGRESS_REPORT",
  "ATTENDANCE_REPORT",
]);

function useTypewriter(text, speed = 6) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!text) {
      setDisplayed("");
      setDone(false);
      return;
    }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i += Math.ceil(text.length / 180);
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text]);
  return { displayed, done };
}

function MessageBubble({ msg, isDark }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";
  const { displayed, done } = useTypewriter(isUser ? null : msg.content);
  const content = isUser ? msg.content : done ? msg.content : displayed;
  const border = isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb";

  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        padding: "8px 0",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isUser
            ? "linear-gradient(135deg, #10b981, #059669)"
            : "linear-gradient(135deg, #2563eb, #60a5fa)",
          boxShadow: isUser
            ? "0 2px 8px rgba(16,185,129,0.3)"
            : "0 2px 8px rgba(37,99,235,0.3)",
        }}
      >
        {isUser ? (
          <User size={14} color="#fff" />
        ) : (
          <Bot size={14} color="#fff" />
        )}
      </div>

      <div
        style={{
          maxWidth: "76%",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        {!isUser && msg.mode && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#2563eb",
              background: "rgba(37,99,235,0.08)",
              border: "1px solid rgba(37,99,235,0.18)",
              padding: "2px 8px",
              borderRadius: 99,
              fontFamily: "'Poppins', sans-serif",
              textTransform: "uppercase",
            }}
          >
            {msg.mode.replace(/_/g, " ")}
          </span>
        )}

        <div
          style={{
            padding: "10px 14px",
            borderRadius: isUser ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
            background: isUser
              ? "linear-gradient(135deg, #2563eb, #3b82f6)"
              : isDark
                ? "#1f2937"
                : "#f8fafc",
            border: isUser ? "none" : `1px solid ${border}`,
            boxShadow: isUser
              ? "0 4px 12px rgba(37,99,235,0.25)"
              : "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          {!isUser && !done && (
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: 14,
                background: "#2563eb",
                marginRight: 4,
                animation: "blink 1s infinite",
                borderRadius: 1,
                verticalAlign: "middle",
              }}
            />
          )}
          <div
            style={{
              fontSize: 13,
              lineHeight: 1.7,
              color: isUser
                ? "#fff"
                : isDark
                  ? "rgba(255,255,255,0.88)"
                  : "#1f2937",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {content}
          </div>
        </div>

        {!isUser && done && (
          <button
            onClick={copy}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 8px",
              borderRadius: 6,
              border: `1px solid ${border}`,
              background: "transparent",
              cursor: "pointer",
              color: copied
                ? "#10b981"
                : isDark
                  ? "rgba(255,255,255,0.3)"
                  : "#9ca3af",
              fontSize: 10,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              transition: "all 0.15s",
            }}
          >
            {copied ? <Check size={9} /> : <Copy size={9} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        )}

        <span
          style={{
            fontSize: 9,
            color: isDark ? "rgba(255,255,255,0.2)" : "#d1d5db",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {msg.time}
        </span>
      </div>
    </div>
  );
}

const TABS = ["Suggested", "Meeting", "Coaching"];

function ModeCardItem({
  m,
  isDark,
  border,
  textPrimary,
  textSecondary,
  onSelect,
}) {
  const [hov, setHov] = useState(false);
  const Icon = m.icon;
  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "14px 16px",
        borderRadius: 12,
        cursor: "pointer",
        border: `1px solid ${hov ? m.color + "55" : border}`,
        background: hov
          ? `${m.color}08`
          : isDark
            ? "rgba(255,255,255,0.02)"
            : "#ffffff",
        transition: "all 0.18s",
        boxShadow: hov ? `0 4px 20px ${m.color}14` : "none",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${m.color}14`,
          border: `1px solid ${m.color}22`,
          flexShrink: 0,
        }}
      >
        <Icon size={16} color={m.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: textPrimary,
            fontFamily: "'Poppins', sans-serif",
            marginBottom: 4,
            lineHeight: 1.3,
          }}
        >
          {m.label}
        </div>
        <p
          style={{
            fontSize: 11,
            color: textSecondary,
            fontFamily: "'Poppins', sans-serif",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {m.description}
        </p>
      </div>
    </div>
  );
}

// ── Session Selector UI ─────────────────────────────────────────────────────
function SessionSelector({ isDark, onSelect, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const border = isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0";
  const bg = isDark ? "#1f2937" : "#ffffff";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    getSessionHistory()
      .then((res) => {
        if (cancelled) return;
        const data = res.data;
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : Array.isArray(data?.sessions)
              ? data.sessions
              : [];
        setSessions(items);
      })
      .catch(() => {
        if (!cancelled)
          setFetchError("Unable to load sessions. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (val) => {
    if (!val) return "";
    try {
      return new Date(val).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return val;
    }
  };

  return (
    <div
      style={{
        border: `1px solid ${border}`,
        borderRadius: 12,
        background: bg,
        boxShadow: isDark
          ? "0 8px 32px rgba(0,0,0,0.5)"
          : "0 8px 32px rgba(0,0,0,0.12)",
        overflow: "hidden",
        marginBottom: 12,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderBottom: `1px solid ${border}`,
          background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Calendar size={13} color="#2563eb" />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: textPrimary,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Select a Session
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: textSecondary,
            padding: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <X size={13} />
        </button>
      </div>

      {/* Body */}
      <div style={{ maxHeight: 200, overflowY: "auto" }}>
        {loading && (
          <div
            style={{
              padding: "16px 14px",
              fontSize: 12,
              color: textSecondary,
              fontFamily: "'Poppins', sans-serif",
              textAlign: "center",
            }}
          >
            Loading sessions…
          </div>
        )}

        {!loading && fetchError && (
          <div
            style={{
              padding: "12px 14px",
              fontSize: 12,
              color: "#dc2626",
              fontFamily: "'Poppins', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <AlertCircle size={12} />
            {fetchError}
          </div>
        )}

        {!loading && !fetchError && sessions.length === 0 && (
          <div
            style={{
              padding: "16px 14px",
              fontSize: 12,
              color: textSecondary,
              fontFamily: "'Poppins', sans-serif",
              textAlign: "center",
            }}
          >
            No sessions found.
          </div>
        )}

        {!loading &&
          !fetchError &&
          sessions.map((s) => {
            const id = s.id || s.sessionId;
            const title = s.title || s.name || s.topic || `Session ${id}`;
            const dateVal =
              s.scheduledAt || s.startedAt || s.createdAt || s.date;
            return (
              <button
                key={id}
                onClick={() => onSelect(id, title)}
                style={{
                  width: "100%",
                  padding: "9px 14px",
                  border: "none",
                  borderBottom: `1px solid ${border}`,
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDark
                    ? "rgba(37,99,235,0.08)"
                    : "#f0f4ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: textPrimary,
                    fontFamily: "'Poppins', sans-serif",
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </span>
                {dateVal && (
                  <span
                    style={{
                      fontSize: 10,
                      color: textSecondary,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {formatDate(dateVal)}
                  </span>
                )}
              </button>
            );
          })}
      </div>
    </div>
  );
}

function PromptInputBox({
  isDark,
  input,
  setInput,
  loading,
  onSend,
  onKeyDown,
  inputRef,
  selectedMode,
  setModeMenuOpen,
  modeMenuOpen,
  allModes,
  setSelectedMode,
  selectedSources,
  setSelectedSources,
  additionalContext,
  setShowContextModal,
  border,
  textSecondary,
  inputBg,
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: `1.5px solid ${border}`,
        background: inputBg,
        boxShadow: isDark
          ? "0 4px 24px rgba(0,0,0,0.35)"
          : "0 4px 24px rgba(37,99,235,0.08)",
        overflow: "visible",
        transition: "border-color 0.2s, box-shadow 0.2s",
        width: "100%",
      }}
      onFocusCapture={(e) => {
        e.currentTarget.style.borderColor = "#2563eb";
        e.currentTarget.style.boxShadow = "0 4px 28px rgba(37,99,235,0.18)";
      }}
      onBlurCapture={(e) => {
        e.currentTarget.style.borderColor = border;
        e.currentTarget.style.boxShadow = isDark
          ? "0 4px 24px rgba(0,0,0,0.35)"
          : "0 4px 24px rgba(37,99,235,0.08)";
      }}
    >
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={
          selectedMode
            ? `Mode: ${selectedMode.label} — Write a message or type @ for context`
            : "Write a message or type @ for context"
        }
        rows={2}
        disabled={loading}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "16px 20px 10px",
          border: "none",
          background: "transparent",
          resize: "none",
          color: isDark ? "#f9fafb" : "#111827",
          fontSize: 14,
          outline: "none",
          fontFamily: "'Poppins', sans-serif",
          lineHeight: 1.6,
          maxHeight: 120,
          overflowY: "auto",
          display: "block",
          borderRadius: "16px 16px 0 0",
        }}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
        }}
      />

      <div
        style={{
          padding: "10px 14px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderTop: `1px solid ${border}`,
          background: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.015)",
          borderRadius: "0 0 16px 16px",
        }}
      >
        {/* + context */}
        <button
          onClick={() => setShowContextModal(true)}
          title="Add context & resources"
          style={{
            width: 30,
            height: 30,
            borderRadius: 7,
            border: `1px solid ${border}`,
            background: additionalContext
              ? "rgba(37,99,235,0.08)"
              : "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: additionalContext ? "#2563eb" : textSecondary,
            flexShrink: 0,
            transition: "all 0.15s",
          }}
        >
          <Plus size={14} />
        </button>

        <AiSourceDropdown isDark={isDark} onChange={setSelectedSources} />

        {/* Mode dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setModeMenuOpen((p) => !p)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 10px",
              borderRadius: 7,
              border: `1px solid ${selectedMode ? "#2563eb" : border}`,
              background: selectedMode ? "rgba(37,99,235,0.08)" : "transparent",
              color: selectedMode ? "#2563eb" : textSecondary,
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              transition: "all 0.15s",
            }}
          >
            {selectedMode
              ? selectedMode.label.split(" ").slice(0, 2).join(" ")
              : "Mode"}
            <ChevronDown size={12} />
          </button>

          {modeMenuOpen && (
            <div
              style={{
                position: "absolute",
                bottom: "calc(100% + 8px)",
                left: 0,
                width: 220,
                background: isDark ? "#1f2937" : "#ffffff",
                border: `1px solid ${border}`,
                borderRadius: 12,
                boxShadow: isDark
                  ? "0 8px 32px rgba(0,0,0,0.5)"
                  : "0 8px 32px rgba(0,0,0,0.12)",
                zIndex: 200,
                maxHeight: 260,
                overflowY: "auto",
              }}
            >
              <button
                onClick={() => {
                  setSelectedMode(null);
                  setModeMenuOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "9px 14px",
                  border: "none",
                  background: "transparent",
                  textAlign: "left",
                  fontSize: 12,
                  color: textSecondary,
                  cursor: "pointer",
                  fontFamily: "'Poppins', sans-serif",
                  borderBottom: `1px solid ${border}`,
                }}
              >
                No mode (Custom)
              </button>
              {allModes.map((m) => (
                <button
                  key={m.mode}
                  onClick={() => {
                    setSelectedMode(m);
                    setModeMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "9px 14px",
                    border: "none",
                    background:
                      selectedMode?.mode === m.mode
                        ? "rgba(37,99,235,0.08)"
                        : "transparent",
                    textAlign: "left",
                    fontSize: 12,
                    color:
                      selectedMode?.mode === m.mode
                        ? "#2563eb"
                        : isDark
                          ? "#f9fafb"
                          : "#111827",
                    cursor: "pointer",
                    fontFamily: "'Poppins', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedMode?.mode !== m.mode)
                      e.currentTarget.style.background = isDark
                        ? "rgba(255,255,255,0.04)"
                        : "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    if (selectedMode?.mode !== m.mode)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <m.icon size={13} color={m.color} />
                  {m.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={() => input.trim() && onSend(null, input.trim())}
          disabled={!input.trim() || loading}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: "none",
            background:
              input.trim() && !loading
                ? "#2563eb"
                : isDark
                  ? "rgba(255,255,255,0.08)"
                  : "#e5e7eb",
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
            flexShrink: 0,
            boxShadow:
              input.trim() && !loading
                ? "0 2px 10px rgba(37,99,235,0.4)"
                : "none",
          }}
        >
          {loading ? (
            <span
              style={{
                width: 14,
                height: 14,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid #fff",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                display: "block",
              }}
            />
          ) : (
            <Send
              size={14}
              color={
                input.trim() && !loading
                  ? "#fff"
                  : isDark
                    ? "rgba(255,255,255,0.25)"
                    : "#9ca3af"
              }
            />
          )}
        </button>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function AiChatPanel({
  sessionId: sessionIdProp,
  sessionTitle: sessionTitleProp,
  setSelectedSessionId,
  setSelectedSessionTitle,
  isDark,
  conversationId: externalConvId,
  onConversationCreated,
  externalMessages,
  onNewChat,
  showHomeIfEmpty = true,
}) {
  const [activeTab, setActiveTab] = useState("suggested");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatStarted, setChatStarted] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [selectedSources, setSelectedSources] = useState([
    "MEETINGS",
    "CHAT",
    "WHITEBOARD",
  ]);
  const [showContextModal, setShowContextModal] = useState(false);
  const [additionalContext, setAdditionalContext] = useState("");
  const [resourceIds, setResourceIds] = useState([]);
  const [selectedMode, setSelectedMode] = useState(null);
  const [modeMenuOpen, setModeMenuOpen] = useState(false);

  // Session selector state
  const [showSessionSelector, setShowSessionSelector] = useState(false);

  // Local session state (mirrors props but can be updated by selector)
  const [sessionId, setSessionId] = useState(sessionIdProp || null);
  const [sessionTitle, setSessionTitle] = useState(sessionTitleProp || null);

  // Keep local in sync with props
  useEffect(() => {
    if (sessionIdProp !== undefined) setSessionId(sessionIdProp);
  }, [sessionIdProp]);
  useEffect(() => {
    if (sessionTitleProp !== undefined) setSessionTitle(sessionTitleProp);
  }, [sessionTitleProp]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const homeInputRef = useRef(null);

  const bg = isDark ? "#0d1117" : "#f0f4f8";
  const border = isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  const inputBg = isDark ? "#1a2233" : "#ffffff";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (externalMessages && externalMessages.length > 0) {
      const mapped = externalMessages.map((m, i) => ({
        id: m.id || i,
        role: m.role || m.sender || "assistant",
        content: m.content || m.message || m.response || "",
        mode: m.mode || null,
        time: m.createdAt
          ? new Date(m.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
      }));
      setMessages(mapped);
      setChatStarted(true);
    }
  }, [externalMessages]);

  useEffect(() => {
    if (externalConvId) setConversationId(externalConvId);
  }, [externalConvId]);

  const now = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleSessionSelect = (id, title) => {
    setSessionId(id);
    setSessionTitle(title || null);
    setShowSessionSelector(false);
    setError(null);
    // Bubble up to parent
    if (setSelectedSessionId) setSelectedSessionId(id);
    if (setSelectedSessionTitle) setSelectedSessionTitle(title || null);
  };

  const sendMessage = useCallback(
    async (modeObj, customMessage) => {
      const msgText = customMessage || input.trim();
      const modeKey = modeObj?.mode || selectedMode?.mode || "CUSTOM_QUESTION";

      if (!msgText && !modeObj) return;

      if (SESSION_REQUIRED_MODES.has(modeKey) && !sessionId) {
        setError("Please select a meeting/session first.");
        setShowSessionSelector(true);
        return;
      }

      setError(null);
      setShowSessionSelector(false);
      setChatStarted(true);

      const userMsg = {
        id: Date.now(),
        role: "user",
        content: msgText || `Run: ${modeObj?.label || modeKey}`,
        time: now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const res = await sendAiCompanionMessage(
          sessionId || null,
          modeKey,
          msgText,
          additionalContext || null,
          selectedSources,
          resourceIds,
          conversationId,
          true,
        );

        const data = res.data || {};
        const responseText =
          data.response ||
          data.message ||
          data.content ||
          "No response from AI.";
        const newConvId =
          data.conversationId || data.conversation?.id || conversationId;

        if (newConvId && newConvId !== conversationId) {
          setConversationId(newConvId);
          if (onConversationCreated) onConversationCreated(newConvId);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: responseText,
            mode: modeKey,
            time: now(),
          },
        ]);
      } catch (err) {
        console.error("AI Companion error:", err);
        const errMsg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "AI service unavailable. Please check your configuration.";
        setError(errMsg);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: `⚠️ ${errMsg}`,
            time: now(),
          },
        ]);
      } finally {
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [
      input,
      sessionId,
      additionalContext,
      selectedSources,
      resourceIds,
      conversationId,
      selectedMode,
      onConversationCreated,
    ],
  );

  const handleNewChat = () => {
    setMessages([]);
    setChatStarted(false);
    setConversationId(null);
    setError(null);
    setSelectedMode(null);
    setInput("");
    setShowSessionSelector(false);
    if (onNewChat) onNewChat();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) sendMessage(null, input.trim());
    }
  };

  const allModes = [
    ...MODES_BY_TAB.suggested,
    ...MODES_BY_TAB.meeting,
    ...MODES_BY_TAB.coaching,
  ].filter((m, i, arr) => arr.findIndex((x) => x.mode === m.mode) === i);

  const inputBoxProps = {
    isDark,
    input,
    setInput,
    loading,
    onSend: sendMessage,
    onKeyDown: handleKeyDown,
    selectedMode,
    setModeMenuOpen,
    modeMenuOpen,
    allModes,
    setSelectedMode,
    selectedSources,
    setSelectedSources,
    additionalContext,
    setShowContextModal,
    border,
    textSecondary,
    inputBg,
  };

  // Shared session warning + selector block
  const renderSessionWarning = () => (
    <>
      {!sessionId && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 14px",
            borderRadius: 10,
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.2)",
            marginBottom: 12,
            fontSize: 12,
            color: "#b45309",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <AlertCircle size={13} />
          Some modes require a session. Select a meeting/session to unlock all
          features.
        </div>
      )}
      {sessionId && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 14px",
            borderRadius: 10,
            background: "rgba(37,99,235,0.06)",
            border: "1px solid rgba(37,99,235,0.18)",
            marginBottom: 12,
            fontSize: 12,
            color: "#2563eb",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <Calendar size={13} />
          <span style={{ flex: 1 }}>
            Session: <strong>{sessionTitle || sessionId}</strong>
          </span>
          <button
            onClick={() => setShowSessionSelector((p) => !p)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#2563eb",
              fontSize: 11,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              padding: "2px 6px",
              borderRadius: 6,
              textDecoration: "underline",
            }}
          >
            Change
          </button>
        </div>
      )}
    </>
  );

  const renderErrorBanner = (maxWidth) =>
    error && (
      <div
        style={{
          marginBottom: 12,
          padding: "9px 14px",
          borderRadius: 10,
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.2)",
          fontSize: 12,
          color: "#dc2626",
          fontFamily: "'Poppins', sans-serif",
          display: "flex",
          alignItems: "center",
          gap: 8,
          ...(maxWidth ? { maxWidth, width: "100%" } : {}),
        }}
      >
        <AlertCircle size={13} />
        <span style={{ flex: 1 }}>{error}</span>
        <button
          onClick={() => {
            setError(null);
            setShowSessionSelector(false);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#dc2626",
            padding: 2,
          }}
        >
          ×
        </button>
      </div>
    );

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: bg,
        overflow: "hidden",
        fontFamily: "'Poppins', sans-serif",
        position: "relative",
        minHeight: 0,
      }}
    >
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes dotPulse { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ══════════════════════════════════════════════════════
          HOME VIEW
         ══════════════════════════════════════════════════════ */}
      {!chatStarted && showHomeIfEmpty && (
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "44px 24px 48px",
            animation: "fadeInUp 0.3s ease",
            minHeight: 0,
          }}
        >
          {/* 1 ── HEADING */}
          <div
            style={{
              textAlign: "center",
              marginBottom: 28,
              width: "100%",
              maxWidth: 600,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "linear-gradient(135deg, #2563eb, #60a5fa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
                boxShadow: "0 8px 24px rgba(37,99,235,0.28)",
              }}
            >
              <Sparkles size={24} color="#fff" />
            </div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: textPrimary,
                margin: "0 0 6px",
                letterSpacing: "-0.02em",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              AI Companion
            </h1>
            <p
              style={{
                fontSize: 13,
                color: textSecondary,
                margin: 0,
                fontFamily: "'Poppins', sans-serif",
                lineHeight: 1.6,
              }}
            >
              Ask questions, summarize sessions, generate reports, and get
              coaching insights.
            </p>
          </div>

          {/* 2 ── PROMPT BOX */}
          <div style={{ width: "100%", maxWidth: 600, marginBottom: 24 }}>
            {renderSessionWarning()}

            {showSessionSelector && (
              <SessionSelector
                isDark={isDark}
                onSelect={handleSessionSelect}
                onClose={() => setShowSessionSelector(false)}
              />
            )}

            {!showSessionSelector && !sessionId && (
              <button
                onClick={() => setShowSessionSelector(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 8,
                  border: "1px solid rgba(37,99,235,0.3)",
                  background: "rgba(37,99,235,0.06)",
                  color: "#2563eb",
                  fontSize: 12,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginBottom: 12,
                  transition: "all 0.15s",
                }}
              >
                <Calendar size={12} />
                Select a session
              </button>
            )}

            {renderErrorBanner(null)}

            <PromptInputBox {...inputBoxProps} inputRef={homeInputRef} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 7,
                padding: "0 2px",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: isDark ? "rgba(255,255,255,0.2)" : "#c4cdd6",
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                Press Enter to send · Shift+Enter for new line
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: isDark ? "rgba(255,255,255,0.2)" : "#c4cdd6",
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                Powered by GPT-4o
              </span>
            </div>
          </div>

          {/* 3 ── TABS */}
          <div
            style={{
              width: "100%",
              maxWidth: 600,
              display: "flex",
              alignItems: "center",
              borderBottom: `1px solid ${border}`,
              marginBottom: 20,
            }}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.toLowerCase();
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  style={{
                    padding: "10px 16px",
                    border: "none",
                    background: "transparent",
                    borderBottom: isActive
                      ? "2px solid #2563eb"
                      : "2px solid transparent",
                    color: isActive ? "#2563eb" : textSecondary,
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    cursor: "pointer",
                    fontFamily: "'Poppins', sans-serif",
                    marginBottom: -1,
                    transition: "all 0.15s",
                  }}
                >
                  {tab}
                </button>
              );
            })}
            <div style={{ flex: 1 }} />
            <button
              onClick={() => setActiveTab("suggested")}
              style={{
                padding: "10px 14px",
                border: "none",
                background: "transparent",
                color: "#2563eb",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Poppins', sans-serif",
                marginBottom: -1,
              }}
            >
              View all →
            </button>
          </div>

          {/* 4 ── MODE CARDS */}
          <div style={{ width: "100%", maxWidth: 600 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 12,
              }}
            >
              {(MODES_BY_TAB[activeTab] || MODES_BY_TAB.suggested).map((m) => (
                <ModeCardItem
                  key={m.mode}
                  m={m}
                  isDark={isDark}
                  border={border}
                  textPrimary={textPrimary}
                  textSecondary={textSecondary}
                  onSelect={() => {
                    setSelectedMode(m);
                    if (SESSION_REQUIRED_MODES.has(m.mode) && !sessionId) {
                      setError("Please select a meeting/session first.");
                      setShowSessionSelector(true);
                      return;
                    }
                    sendMessage(m, null);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          CHAT VIEW
         ══════════════════════════════════════════════════════ */}
      {chatStarted && (
        <>
          <div
            style={{
              padding: "12px 24px",
              borderBottom: `1px solid ${border}`,
              background: isDark ? "#111827" : "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={15} color="#2563eb" />
              <span
                style={{ fontSize: 13, fontWeight: 600, color: textPrimary }}
              >
                {sessionTitle || "AI Companion Chat"}
              </span>
              {sessionId && (
                <span
                  style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    background: "rgba(37,99,235,0.08)",
                    color: "#2563eb",
                    borderRadius: 99,
                    border: "1px solid rgba(37,99,235,0.18)",
                    fontWeight: 600,
                  }}
                >
                  Session linked
                </span>
              )}
              {!sessionId && (
                <button
                  onClick={() => setShowSessionSelector((p) => !p)}
                  style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    background: "rgba(245,158,11,0.08)",
                    color: "#b45309",
                    borderRadius: 99,
                    border: "1px solid rgba(245,158,11,0.25)",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  + Link session
                </button>
              )}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: 0,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 960,
                padding: "20px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                boxSizing: "border-box",
              }}
            >
              {/* Quick mode pills */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  overflowX: "auto",
                  paddingBottom: 10,
                  marginBottom: 10,
                  borderBottom: `1px solid ${border}`,
                  flexShrink: 0,
                }}
              >
                {(MODES_BY_TAB[activeTab] || MODES_BY_TAB.suggested)
                  .slice(0, 5)
                  .map((m) => (
                    <button
                      key={m.mode}
                      onClick={() => {
                        if (SESSION_REQUIRED_MODES.has(m.mode) && !sessionId) {
                          setError("Please select a meeting/session first.");
                          setShowSessionSelector(true);
                          return;
                        }
                        sendMessage(m, null);
                      }}
                      disabled={loading}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "5px 11px",
                        borderRadius: 7,
                        border: `1px solid ${border}`,
                        background: isDark
                          ? "rgba(255,255,255,0.03)"
                          : "#f9fafb",
                        cursor: loading ? "not-allowed" : "pointer",
                        flexShrink: 0,
                        color: m.color,
                        fontSize: 10,
                        fontWeight: 700,
                        fontFamily: "'Poppins', sans-serif",
                        opacity: loading ? 0.5 : 1,
                        transition: "all 0.15s",
                      }}
                    >
                      <m.icon size={11} />
                      {m.label.split(" ").slice(0, 2).join(" ")}
                    </button>
                  ))}
              </div>

              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} isDark={isDark} />
              ))}

              {loading && (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "8px 0",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #2563eb, #60a5fa)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Bot size={14} color="#fff" />
                  </div>
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: "4px 14px 14px 14px",
                      background: isDark ? "#1f2937" : "#f8fafc",
                      border: `1px solid ${border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "#2563eb",
                          display: "inline-block",
                          animation: `dotPulse 1.4s ${i * 0.2}s ease-in-out infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Error + session selector in chat view */}
          {(error || showSessionSelector) && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "0 24px 10px",
                flexShrink: 0,
              }}
            >
              <div style={{ width: "100%", maxWidth: 960 }}>
                {renderErrorBanner(null)}
                {showSessionSelector && (
                  <SessionSelector
                    isDark={isDark}
                    onSelect={handleSessionSelect}
                    onClose={() => setShowSessionSelector(false)}
                  />
                )}
              </div>
            </div>
          )}

          <div
            style={{
              padding: "14px 24px 18px",
              flexShrink: 0,
              background: isDark ? "#111827" : "#ffffff",
              borderTop: `1px solid ${border}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ width: "100%", maxWidth: 960 }}>
              <PromptInputBox {...inputBoxProps} inputRef={inputRef} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 7,
                  padding: "0 2px",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: isDark ? "rgba(255,255,255,0.2)" : "#d1d5db",
                    fontFamily: "'Poppins',sans-serif",
                  }}
                >
                  Press Enter to send · Shift+Enter for new line
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: isDark ? "rgba(255,255,255,0.2)" : "#d1d5db",
                    fontFamily: "'Poppins',sans-serif",
                  }}
                >
                  Powered by GPT-4o
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {showContextModal && (
        <AiContextResourceModal
          isDark={isDark}
          initialContext={additionalContext}
          initialResourceIds={resourceIds.join(", ")}
          onSave={({ additionalContext: ctx, resourceIds: ids }) => {
            setAdditionalContext(ctx);
            setResourceIds(ids);
          }}
          onClose={() => setShowContextModal(false)}
        />
      )}
    </div>
  );
}
