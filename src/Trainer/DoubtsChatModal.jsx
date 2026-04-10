
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { getConversation, sendMessage } from "@/services/chatService";
// import { Send, X, MessageCircle } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// const DoubtsChatModal = ({ doubt, onClose }) => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const chatEndRef = useRef(null);

//   const trainerEmail = JSON.parse(localStorage.getItem("lms_user"))?.email;

//   /* ── Fetch conversation ── */
//   useEffect(() => {
//     if (!doubt) return;
//     getConversation(doubt.batchId, doubt.studentEmail)
//       .then((res) => {
//         setMessages(
//           res.data.map((m) => ({
//             sender: m.senderEmail === trainerEmail ? "trainer" : "student",
//             text: m.message,
//             time: new Date(m.sentAt).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//           }))
//         );
//       })
//       .catch(console.error);
//   }, [doubt]);

//   /* ── Auto scroll ── */
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   /* ── Send ── */
//   const sendReply = async () => {
//     if (!message.trim()) return;
//     await sendMessage({
//       batchId: doubt.batchId,
//       receiverEmail: doubt.studentEmail,
//       message,
//     });
//     setMessage("");
//     const res = await getConversation(doubt.batchId, doubt.studentEmail);
//     setMessages(
//       res.data.map((m) => ({
//         sender: m.senderEmail === trainerEmail ? "trainer" : "student",
//         text: m.message,
//         time: new Date(m.sentAt).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       }))
//     );
//   };

//   if (!doubt) return null;

//   const initials = doubt.student?.[0]?.toUpperCase() || "S";

//   return (
//     <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
//       <div className="w-full sm:max-w-lg h-[90vh] sm:h-[600px] flex flex-col rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">

//         {/* ── Header ── */}
//         <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shrink-0">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold uppercase select-none">
//               {initials}
//             </div>
//             <div>
//               <p className="text-sm font-semibold leading-tight capitalize">{doubt.student}</p>
//               <p className="text-[11px] opacity-70 leading-tight">{doubt.studentEmail}</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         {/* ── Messages ── */}
//         <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#f6f7fb] dark:bg-slate-950">
//           {messages.length === 0 && (
//             <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 opacity-60">
//               <MessageCircle className="w-8 h-8" />
//               <p className="text-xs">No messages yet. Start the conversation!</p>
//             </div>
//           )}
//           {messages.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`flex ${msg.sender === "trainer" ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
//                   msg.sender === "trainer"
//                     ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-br-sm"
//                     : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-sm"
//                 }`}
//               >
//                 <p className="leading-snug">{msg.text}</p>
//                 <p
//                   className={`text-[10px] mt-1 text-right ${
//                     msg.sender === "trainer" ? "opacity-60" : "text-slate-400"
//                   }`}
//                 >
//                   {msg.time}
//                 </p>
//               </div>
//             </div>
//           ))}
//           <div ref={chatEndRef} />
//         </div>

//         {/* ── Input Bar ── */}
//         <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex items-center gap-2">
//           <Input
//             className="flex-1 h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-400"
//             placeholder="Type your reply..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendReply()}
//           />
//           <Button
//             onClick={sendReply}
//             disabled={!message.trim()}
//             className="h-10 w-10 p-0 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 transition shadow-sm"
//           >
//             <Send size={15} />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoubtsChatModal;

























import { getConversation, sendMessage } from "@/services/chatService";
import { Send, X, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.cm-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);}
.cm-overlay{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center;padding:0;}
@media(min-width:640px){.cm-overlay{align-items:center;padding:20px;}}
.cm-modal{width:100%;max-width:520px;height:90vh;max-height:600px;display:flex;flex-direction:column;border-radius:20px 20px 0 0;overflow:hidden;background:var(--card);border:1px solid var(--bd);box-shadow:0 32px 80px rgba(0,0,0,.4);}
@media(min-width:640px){.cm-modal{border-radius:20px;}}
.cm-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:rgba(167,139,250,.08);border-bottom:1px solid var(--bd);flex-shrink:0;}
.cm-hl{display:flex;align-items:center;gap:12px;}
.cm-av{width:38px;height:38px;border-radius:11px;background:rgba(167,139,250,.20);border:1px solid rgba(167,139,250,.20);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:var(--c4);text-transform:uppercase;flex-shrink:0;}
.cm-hname{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 2px;text-transform:capitalize;}
.cm-hemail{font-size:11px;color:var(--mu);margin:0;}
.cm-xbtn{width:32px;height:32px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);display:flex;align-items:center;justify-content:center;color:var(--mu);cursor:pointer;transition:background .2s,color .2s;}
.cm-xbtn:hover{background:rgba(248,113,113,.10);color:var(--cr);}
.cm-msgs{flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:10px;background:var(--bg);}
.cm-msgs::-webkit-scrollbar{width:4px;}
.cm-msgs::-webkit-scrollbar-thumb{background:var(--bd);border-radius:4px;}
.cm-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:8px;color:var(--mu);opacity:.6;}
.cm-empty-state p{font-size:12px;font-family:'Poppins',sans-serif;}
.cm-msg-row{display:flex;}
.cm-msg-row.trainer{justify-content:flex-end;}
.cm-msg-row.student{justify-content:flex-start;}
.cm-bubble{max-width:75%;padding:11px 15px;border-radius:16px;font-family:'Poppins',sans-serif;}
.cm-msg-row.trainer .cm-bubble{background:var(--c4);color:#0a0a0a;border-radius:16px 16px 4px 16px;}
.cm-msg-row.student .cm-bubble{background:var(--card);border:1px solid var(--bd);color:var(--tx);border-radius:16px 16px 16px 4px;}
.cm-btext{font-size:13px;line-height:1.5;margin:0 0 4px;}
.cm-btime{font-size:10px;font-weight:600;text-align:right;margin:0;}
.cm-msg-row.trainer .cm-btime{opacity:.65;}
.cm-msg-row.student .cm-btime{color:var(--mu);}
.cm-input-bar{display:flex;align-items:center;gap:10px;padding:12px 16px;border-top:1px solid var(--bd);background:var(--card);flex-shrink:0;}
.cm-input{flex:1;padding:11px 14px;border-radius:13px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;transition:border-color .2s,box-shadow .2s;}
.cm-input:focus{border-color:var(--c4);box-shadow:0 0 0 3px rgba(167,139,250,.12);}
.cm-input::placeholder{color:var(--mu);}
.cm-sbtn{width:40px;height:40px;border-radius:12px;border:none;background:var(--c4);color:#0a0a0a;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:opacity .2s,transform .15s;flex-shrink:0;}
.cm-sbtn:hover{opacity:.87;transform:translateY(-1px);}
.cm-sbtn:disabled{opacity:.4;cursor:not-allowed;transform:none;}
`;
if(!document.getElementById("cm-st")){const t=document.createElement("style");t.id="cm-st";t.textContent=STYLES;document.head.appendChild(t);}
const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

const DoubtsChatModal = ({ doubt, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [dark, setDark] = useState(isDark);
  const chatEndRef = useRef(null);
  const trainerEmail = JSON.parse(localStorage.getItem("lms_user"))?.email;

  useEffect(()=>{
    const o=new MutationObserver(()=>setDark(isDark()));
    o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
    o.observe(document.body,{attributes:true,attributeFilter:["class"]});
    return()=>o.disconnect();
  },[]);

  useEffect(()=>{
    if(!doubt)return;
    getConversation(doubt.batchId,doubt.studentEmail)
      .then(res=>setMessages(res.data.map(m=>({sender:m.senderEmail===trainerEmail?"trainer":"student",text:m.message,time:new Date(m.sentAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}))))
      .catch(console.error);
  },[doubt]);

  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  const sendReply=async()=>{
    if(!message.trim())return;
    await sendMessage({batchId:doubt.batchId,receiverEmail:doubt.studentEmail,message});
    setMessage("");
    const res=await getConversation(doubt.batchId,doubt.studentEmail);
    setMessages(res.data.map(m=>({sender:m.senderEmail===trainerEmail?"trainer":"student",text:m.message,time:new Date(m.sentAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})})));
  };

  if(!doubt)return null;
  const initials=doubt.student?.[0]?.toUpperCase()||"S";

  return(
    <div className={`cm-overlay${dark?" cm-dk":""}`}>
      <div className="cm-modal">
        <div className="cm-head">
          <div className="cm-hl">
            <div className="cm-av">{initials}</div>
            <div>
              <p className="cm-hname">{doubt.student}</p>
              <p className="cm-hemail">{doubt.studentEmail}</p>
            </div>
          </div>
          <button className="cm-xbtn" onClick={onClose}><X size={14}/></button>
        </div>

        <div className="cm-msgs">
          {messages.length===0&&(
            <div className="cm-empty-state">
              <MessageCircle size={28}/>
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
          {messages.map((msg,i)=>(
            <div key={i} className={`cm-msg-row ${msg.sender}`}>
              <div className="cm-bubble">
                <p className="cm-btext">{msg.text}</p>
                <p className="cm-btime">{msg.time}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef}/>
        </div>

        <div className="cm-input-bar">
          <input className="cm-input" placeholder="Type your reply..." value={message}
            onChange={e=>setMessage(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendReply()}/>
          <button className="cm-sbtn" onClick={sendReply} disabled={!message.trim()}>
            <Send size={15}/>
          </button>
        </div>
      </div>
    </div>
  );
};
export default DoubtsChatModal;