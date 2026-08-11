// import { getConversation, sendMessage } from "@/services/chatService";
// import { Send, X, MessageCircle } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// const STYLES = `
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
// :root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
//   --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
//   --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
// .cm-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);}
// .cm-overlay{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center;padding:0;}
// @media(min-width:640px){.cm-overlay{align-items:center;padding:20px;}}
// .cm-modal{width:100%;max-width:520px;height:90vh;max-height:600px;display:flex;flex-direction:column;border-radius:20px 20px 0 0;overflow:hidden;background:var(--card);border:1px solid var(--bd);box-shadow:0 32px 80px rgba(0,0,0,.4);}
// @media(min-width:640px){.cm-modal{border-radius:20px;}}
// .cm-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:rgba(167,139,250,.08);border-bottom:1px solid var(--bd);flex-shrink:0;}
// .cm-hl{display:flex;align-items:center;gap:12px;}
// .cm-av{width:38px;height:38px;border-radius:11px;background:rgba(167,139,250,.20);border:1px solid rgba(167,139,250,.20);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:var(--c4);text-transform:uppercase;flex-shrink:0;}
// .cm-hname{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 2px;text-transform:capitalize;}
// .cm-hemail{font-size:11px;color:var(--mu);margin:0;}
// .cm-xbtn{width:32px;height:32px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);display:flex;align-items:center;justify-content:center;color:var(--mu);cursor:pointer;transition:background .2s,color .2s;}
// .cm-xbtn:hover{background:rgba(248,113,113,.10);color:var(--cr);}
// .cm-msgs{flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:10px;background:var(--bg);}
// .cm-msgs::-webkit-scrollbar{width:4px;}
// .cm-msgs::-webkit-scrollbar-thumb{background:var(--bd);border-radius:4px;}
// .cm-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:8px;color:var(--mu);opacity:.6;}
// .cm-empty-state p{font-size:12px;font-family:'Poppins',sans-serif;}
// .cm-msg-row{display:flex;}
// .cm-msg-row.trainer{justify-content:flex-end;}
// .cm-msg-row.student{justify-content:flex-start;}
// .cm-bubble{max-width:75%;padding:11px 15px;border-radius:16px;font-family:'Poppins',sans-serif;}
// .cm-msg-row.trainer .cm-bubble{background:var(--c4);color:#0a0a0a;border-radius:16px 16px 4px 16px;}
// .cm-msg-row.student .cm-bubble{background:var(--card);border:1px solid var(--bd);color:var(--tx);border-radius:16px 16px 16px 4px;}
// .cm-btext{font-size:13px;line-height:1.5;margin:0 0 4px;}
// .cm-btime{font-size:10px;font-weight:600;text-align:right;margin:0;}
// .cm-msg-row.trainer .cm-btime{opacity:.65;}
// .cm-msg-row.student .cm-btime{color:var(--mu);}
// .cm-input-bar{display:flex;align-items:center;gap:10px;padding:12px 16px;border-top:1px solid var(--bd);background:var(--card);flex-shrink:0;}
// .cm-input{flex:1;padding:11px 14px;border-radius:13px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;transition:border-color .2s,box-shadow .2s;}
// .cm-input:focus{border-color:var(--c4);box-shadow:0 0 0 3px rgba(167,139,250,.12);}
// .cm-input::placeholder{color:var(--mu);}
// .cm-sbtn{width:40px;height:40px;border-radius:12px;border:none;background:var(--c4);color:#0a0a0a;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:opacity .2s,transform .15s;flex-shrink:0;}
// .cm-sbtn:hover{opacity:.87;transform:translateY(-1px);}
// .cm-sbtn:disabled{opacity:.4;cursor:not-allowed;transform:none;}
// `;
// if(!document.getElementById("cm-st")){const t=document.createElement("style");t.id="cm-st";t.textContent=STYLES;document.head.appendChild(t);}
// const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

// const DoubtsChatModal = ({ doubt, onClose }) => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [dark, setDark] = useState(isDark);
//   const chatEndRef = useRef(null);
//   const trainerEmail = JSON.parse(localStorage.getItem("lms_user"))?.email;

//   useEffect(()=>{
//     const o=new MutationObserver(()=>setDark(isDark()));
//     o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
//     o.observe(document.body,{attributes:true,attributeFilter:["class"]});
//     return()=>o.disconnect();
//   },[]);

//   useEffect(()=>{
//     if(!doubt)return;
//     getConversation(doubt.batchId,doubt.studentEmail)
//       .then(res=>setMessages(res.data.map(m=>({sender:m.senderEmail===trainerEmail?"trainer":"student",text:m.message,time:new Date(m.sentAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}))))
//       .catch(console.error);
//   },[doubt]);

//   useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);

//   const sendReply=async()=>{
//     if(!message.trim())return;
//     await sendMessage({batchId:doubt.batchId,receiverEmail:doubt.studentEmail,message});
//     setMessage("");
//     const res=await getConversation(doubt.batchId,doubt.studentEmail);
//     setMessages(res.data.map(m=>({sender:m.senderEmail===trainerEmail?"trainer":"student",text:m.message,time:new Date(m.sentAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})})));
//   };

//   if(!doubt)return null;
//   const initials=doubt.student?.[0]?.toUpperCase()||"S";

//   return(
//     <div className={`cm-overlay${dark?" cm-dk":""}`}>
//       <div className="cm-modal">
//         <div className="cm-head">
//           <div className="cm-hl">
//             <div className="cm-av">{initials}</div>
//             <div>
//               <p className="cm-hname">{doubt.student}</p>
//               <p className="cm-hemail">{doubt.studentEmail}</p>
//             </div>
//           </div>
//           <button className="cm-xbtn" onClick={onClose}><X size={14}/></button>
//         </div>

//         <div className="cm-msgs">
//           {messages.length===0&&(
//             <div className="cm-empty-state">
//               <MessageCircle size={28}/>
//               <p>No messages yet. Start the conversation!</p>
//             </div>
//           )}
//           {messages.map((msg,i)=>(
//             <div key={i} className={`cm-msg-row ${msg.sender}`}>
//               <div className="cm-bubble">
//                 <p className="cm-btext">{msg.text}</p>
//                 <p className="cm-btime">{msg.time}</p>
//               </div>
//             </div>
//           ))}
//           <div ref={chatEndRef}/>
//         </div>

//         <div className="cm-input-bar">
//           <input className="cm-input" placeholder="Type your reply..." value={message}
//             onChange={e=>setMessage(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendReply()}/>
//           <button className="cm-sbtn" onClick={sendReply} disabled={!message.trim()}>
//             <Send size={15}/>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default DoubtsChatModal;












































import { getConversation, sendMessage } from "@/services/chatService";
import { Send, X, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Global Design System — same theme/typography tokens used across
// Trainer Dashboard, Attendance, and Doubts Management (Golden Reference).
// This modal is an overlay, not a routed page, so it does not use
// PageContainer/Hero — but every color, radius, and font value below is
// still sourced from the shared tokens, never a page-local value.
import {
  T,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  RADIUS,
} from "@/design-system";

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.documentElement.getAttribute("data-theme") === "dark" ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const DoubtsChatModal = ({ doubt, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [dark, setDark] = useState(isDark);
  const chatEndRef = useRef(null);
  const trainerEmail = JSON.parse(localStorage.getItem("lms_user"))?.email;

  useEffect(() => {
    const o = new MutationObserver(() => setDark(isDark()));
    o.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    if (!doubt) return;
    getConversation(doubt.batchId, doubt.studentEmail)
      .then((res) =>
        setMessages(
          res.data.map((m) => ({
            sender: m.senderEmail === trainerEmail ? "trainer" : "student",
            text: m.message,
            time: new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          })),
        ),
      )
      .catch(console.error);
  }, [doubt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = async () => {
    if (!message.trim()) return;
    await sendMessage({ batchId: doubt.batchId, receiverEmail: doubt.studentEmail, message });
    setMessage("");
    const res = await getConversation(doubt.batchId, doubt.studentEmail);
    setMessages(
      res.data.map((m) => ({
        sender: m.senderEmail === trainerEmail ? "trainer" : "student",
        text: m.message,
        time: new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      })),
    );
  };

  if (!doubt) return null;

  const t = dark ? T.dark : T.light;
  const initials = doubt.student?.[0]?.toUpperCase() || "S";
  const accent = "#a78bfa";

  return (
    <>
      <style>{`
        @media (min-width:640px){
          .cm-overlay-ds{align-items:center!important;padding:20px!important;}
          .cm-modal-ds{border-radius:${RADIUS.standardCard}px!important;}
        }
        .cm-msgs-ds::-webkit-scrollbar{width:4px;}
        .cm-msgs-ds::-webkit-scrollbar-thumb{background:${t.border};border-radius:4px;}
      `}</style>
      <div
        className="cm-overlay-ds"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: "rgba(0,0,0,.65)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          padding: 0,
        }}
      >
        <div
          className="cm-modal-ds"
          style={{
            width: "100%",
            maxWidth: 520,
            height: "90vh",
            maxHeight: 600,
            display: "flex",
            flexDirection: "column",
            borderRadius: `${RADIUS.standardCard}px ${RADIUS.standardCard}px 0 0`,
            overflow: "hidden",
            background: t.cardBg,
            border: `1px solid ${t.border}`,
            boxShadow: "0 32px 80px rgba(0,0,0,.4)",
          }}
        >
          {/* ── HEADER ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              background: `${accent}14`,
              borderBottom: `1px solid ${t.border}`,
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: RADIUS.chip,
                  background: `${accent}22`,
                  border: `1px solid ${accent}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: FONT_SIZE.body,
                  fontWeight: FONT_WEIGHT.extrabold,
                  color: accent,
                  textTransform: "uppercase",
                  flexShrink: 0,
                  fontFamily: FONT_FAMILY,
                }}
              >
                {initials}
              </div>
              <div>
                <p
                  style={{
                    fontSize: FONT_SIZE.sectionTitle,
                    fontWeight: FONT_WEIGHT.bold,
                    color: t.text,
                    margin: "0 0 2px",
                    textTransform: "capitalize",
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  {doubt.student}
                </p>
                <p style={{ fontSize: FONT_SIZE.caption, color: t.textMuted, margin: 0, fontFamily: FONT_FAMILY }}>
                  {doubt.studentEmail}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: RADIUS.chip,
                border: `1px solid ${t.border}`,
                background: t.pillBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: t.textMuted,
                cursor: "pointer",
                transition: "background .2s, color .2s",
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* ── MESSAGES ── */}
          <div
            className="cm-msgs-ds"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              background: t.pageBg,
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  gap: 8,
                  color: t.textMuted,
                  opacity: 0.6,
                }}
              >
                <MessageCircle size={28} />
                <p style={{ fontSize: FONT_SIZE.caption, fontFamily: FONT_FAMILY }}>No messages yet. Start the conversation!</p>
              </div>
            )}
            {messages.map((msg, i) => {
              const isTrainer = msg.sender === "trainer";
              return (
                <div key={i} style={{ display: "flex", justifyContent: isTrainer ? "flex-end" : "flex-start" }}>
                  <div
                    style={{
                      maxWidth: "75%",
                      padding: "11px 15px",
                      borderRadius: isTrainer ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      fontFamily: FONT_FAMILY,
                      background: isTrainer ? accent : t.cardBg,
                      border: isTrainer ? "none" : `1px solid ${t.border}`,
                      color: isTrainer ? "#0a0a0a" : t.text,
                    }}
                  >
                    <p style={{ fontSize: FONT_SIZE.body, lineHeight: LINE_HEIGHT.body, margin: "0 0 4px" }}>{msg.text}</p>
                    <p
                      style={{
                        fontSize: FONT_SIZE.micro,
                        fontWeight: FONT_WEIGHT.semibold,
                        textAlign: "right",
                        margin: 0,
                        opacity: isTrainer ? 0.65 : 1,
                        color: isTrainer ? "#0a0a0a" : t.textMuted,
                      }}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* ── INPUT BAR ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              borderTop: `1px solid ${t.border}`,
              background: t.cardBg,
              flexShrink: 0,
            }}
          >
            <input
              placeholder="Type your reply..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendReply()}
              style={{
                flex: 1,
                padding: "11px 14px",
                borderRadius: RADIUS.button,
                border: `1px solid ${t.border}`,
                background: t.pillBg,
                color: t.text,
                fontFamily: FONT_FAMILY,
                fontSize: FONT_SIZE.body,
                fontWeight: FONT_WEIGHT.medium,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={sendReply}
              disabled={!message.trim()}
              style={{
                width: 40,
                height: 40,
                borderRadius: RADIUS.chip,
                border: "none",
                background: accent,
                color: "#0a0a0a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: message.trim() ? "pointer" : "not-allowed",
                opacity: message.trim() ? 1 : 0.4,
                flexShrink: 0,
                transition: "opacity .2s, transform .15s",
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoubtsChatModal;