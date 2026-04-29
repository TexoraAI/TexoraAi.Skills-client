import {
  getConversation, sendMessage, getStudentContext,
} from "@/services/chatService";
import { GraduationCap, Send, MessageSquare, Info } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.dq-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}

.dq{font-family:'Poppins',sans-serif;width:100%;height:calc(100vh - 64px);display:flex;background:var(--bg);overflow:hidden;color:var(--tx);}

/* LEFT - chat panel */
.dq-left{display:flex;flex-direction:column;height:100%;min-width:30%;}

.dq-chat-head{flex-shrink:0;padding:16px 20px;display:flex;align-items:center;gap:12px;
  background:var(--card);border-bottom:1px solid var(--bd);border-right:1px solid var(--bd);box-shadow:var(--sh);}
.dq-head-av{width:44px;height:44px;border-radius:12px;background:rgba(34,211,238,.12);
  border:1px solid rgba(34,211,238,.20);display:flex;align-items:center;justify-content:center;
  color:var(--c1);flex-shrink:0;}
.dq-head-name{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 3px;}
.dq-head-online{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--mu);}
.dq-head-dot{width:7px;height:7px;border-radius:50%;background:var(--c3);}

.dq-msgs{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:14px;background:var(--bg);}
.dq-msgs::-webkit-scrollbar{width:4px;}
.dq-msgs::-webkit-scrollbar-thumb{background:var(--bd);border-radius:4px;}

.dq-empty{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;opacity:.45;}
.dq-empty-ico{width:52px;height:52px;border-radius:15px;background:var(--card);border:1px solid var(--bd);
  display:flex;align-items:center;justify-content:center;color:var(--mu);}
.dq-empty-txt{font-size:13px;color:var(--mu);}

.dq-msg-row{display:flex;}
.dq-msg-row.student{justify-content:flex-end;}
.dq-msg-row.teacher{justify-content:flex-start;}
.dq-teacher-av{width:30px;height:30px;border-radius:9px;background:rgba(34,211,238,.10);
  border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;
  color:var(--c1);flex-shrink:0;margin-right:8px;}
.dq-bubble{max-width:70%;padding:11px 15px;border-radius:16px;font-family:'Poppins',sans-serif;}
.dq-msg-row.student .dq-bubble{background:var(--c1);color:#0a0a0a;border-radius:16px 16px 4px 16px;}
.dq-msg-row.teacher .dq-bubble{background:var(--card);border:1px solid var(--bd);color:var(--tx);border-radius:16px 16px 16px 4px;}
.dq-btext{font-size:13px;line-height:1.5;margin:0 0 4px;}
.dq-btime{font-size:10px;font-weight:600;text-align:right;margin:0;}
.dq-msg-row.student .dq-btime{opacity:.65;}
.dq-msg-row.teacher .dq-btime{color:var(--mu);}

.dq-input-bar{flex-shrink:0;display:flex;align-items:center;gap:10px;padding:14px 16px;
  background:var(--card);border-top:1px solid var(--bd);border-right:1px solid var(--bd);}
.dq-textarea{flex:1;resize:none;border-radius:13px;padding:11px 14px;
  background:var(--bg);border:1px solid var(--bd);color:var(--tx);
  font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;
  transition:border-color .2s,box-shadow .2s;}
.dq-textarea::placeholder{color:var(--mu);}
.dq-textarea:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.dq-send-btn{width:42px;height:42px;border-radius:12px;border:none;background:var(--c1);
  color:#0a0a0a;display:flex;align-items:center;justify-content:center;
  cursor:pointer;flex-shrink:0;transition:opacity .2s,transform .15s;}
.dq-send-btn:hover{opacity:.87;transform:translateY(-1px);}
.dq-send-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;}

/* DRAG HANDLE */
.dq-handle{flex-shrink:0;width:12px;display:flex;align-items:center;justify-content:center;
  cursor:col-resize;background:var(--bg);border-left:1px solid var(--bd);border-right:1px solid var(--bd);
  transition:background .2s;position:relative;}
.dq-handle:hover{background:rgba(34,211,238,.06);}
.dq-handle-pill{position:absolute;display:flex;align-items:center;gap:2px;
  padding:6px 5px;border-radius:8px;background:var(--card);border:1px solid var(--bd);
  box-shadow:var(--sh);transition:border-color .2s,box-shadow .2s;}
.dq-handle:hover .dq-handle-pill{border-color:rgba(34,211,238,.35);box-shadow:0 4px 16px rgba(34,211,238,.12);}
.dq-handle-line{width:1px;height:14px;background:var(--bd);transition:background .2s;}
.dq-handle:hover .dq-handle-line{background:var(--c1);}

/* RIGHT - info panel */
.dq-right{flex:1;display:flex;flex-direction:column;overflow-y:auto;
  background:var(--card);border-left:1px solid var(--bd);min-width:20%;}
.dq-right-head{display:flex;align-items:center;gap:8px;padding:16px 20px;
  border-bottom:1px solid var(--bd);flex-shrink:0;}
.dq-right-title{font-size:13px;font-weight:700;color:var(--tx);}
.dq-right-body{padding:20px;display:flex;flex-direction:column;gap:20px;}

.dq-section-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;
  color:var(--mu);margin:0 0 8px;}

.dq-trainer-card{display:flex;align-items:center;gap:10px;padding:12px 14px;
  border-radius:13px;background:var(--bg);border:1px solid var(--bd);}
.dq-trainer-av{width:36px;height:36px;border-radius:10px;background:rgba(34,211,238,.10);
  border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;
  color:var(--c1);flex-shrink:0;}
.dq-trainer-name{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;}
.dq-trainer-email{font-size:11px;color:var(--mu);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

.dq-stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.dq-stat-cell{padding:12px 13px;border-radius:12px;background:var(--bg);border:1px solid var(--bd);}
.dq-stat-lbl{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--mu);margin:0 0 4px;}
.dq-stat-val{font-size:18px;font-weight:800;color:var(--tx);margin:0;}

.dq-status-card{display:flex;align-items:center;gap:8px;padding:12px 14px;
  border-radius:13px;background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.20);}
.dq-status-dot{width:8px;height:8px;border-radius:50%;background:var(--c3);flex-shrink:0;}
.dq-status-txt{font-size:13px;font-weight:600;color:var(--c3);}
`;
if(!document.getElementById("dq-st")){const t=document.createElement("style");t.id="dq-st";t.textContent=STYLES;document.head.appendChild(t);}
const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

const Doubts = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);
  const [dark, setDark] = useState(isDark);

  const studentEmail = JSON.parse(localStorage.getItem("lms_user"))?.email;
  const [batchId, setBatchId] = useState(null);
  const [trainerEmail, setTrainerEmail] = useState(null);

  const [leftWidth, setLeftWidth] = useState(65);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  useEffect(()=>{
    const o=new MutationObserver(()=>setDark(isDark()));
    o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
    o.observe(document.body,{attributes:true,attributeFilter:["class"]});
    return()=>o.disconnect();
  },[]);

  useEffect(()=>{
    const load=async()=>{
      try{const ctx=await getStudentContext();setBatchId(ctx.data.batchId);setTrainerEmail(ctx.data.trainerEmail);}
      catch(e){console.log("No classroom assigned");}
    };
    load();
  },[]);

  useEffect(()=>{
    if(!batchId||!trainerEmail)return;
    getConversation(batchId,trainerEmail).then(res=>setChat(res.data.map(m=>({sender:m.senderEmail===studentEmail?"student":"teacher",text:m.message,time:new Date(m.sentAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}))));
  },[batchId,trainerEmail]);

  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[chat]);

  const sendMessageHandler=async()=>{
    if(!message.trim())return;
    await sendMessage({batchId,receiverEmail:trainerEmail,message});
    setMessage("");
    const res=await getConversation(batchId,trainerEmail);
    setChat(res.data.map(m=>({sender:m.senderEmail===studentEmail?"student":"teacher",text:m.message,time:new Date(m.sentAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})})));
  };

  const onMouseDown=useCallback(()=>{isDragging.current=true;document.body.style.cursor="col-resize";document.body.style.userSelect="none";},[]);
  const onMouseMove=useCallback(e=>{
    if(!isDragging.current||!containerRef.current)return;
    const rect=containerRef.current.getBoundingClientRect();
    const nl=((e.clientX-rect.left)/rect.width)*100;
    if(nl>30&&nl<80)setLeftWidth(nl);
  },[]);
  const onMouseUp=useCallback(()=>{isDragging.current=false;document.body.style.cursor="";document.body.style.userSelect="";},[]);
  useEffect(()=>{
    window.addEventListener("mousemove",onMouseMove);window.addEventListener("mouseup",onMouseUp);
    return()=>{window.removeEventListener("mousemove",onMouseMove);window.removeEventListener("mouseup",onMouseUp);};
  },[onMouseMove,onMouseUp]);

  const stats=[
    {label:"Messages",value:chat.length},
    {label:"From You",value:chat.filter(m=>m.sender==="student").length},
    {label:"From Trainer",value:chat.filter(m=>m.sender==="teacher").length},
    {label:"Batch ID",value:batchId||"—"},
  ];

  return(
    <div ref={containerRef} className={`dq${dark?" dq-dk":""}`}>

      {/* LEFT */}
      <div className="dq-left" style={{width:`${leftWidth}%`}}>
        <div className="dq-chat-head">
          <div className="dq-head-av"><GraduationCap size={20}/></div>
          <div>
            <p className="dq-head-name">Trainer Support</p>
            <div className="dq-head-online"><div className="dq-head-dot"/><span>Online</span></div>
          </div>
        </div>

        <div className="dq-msgs">
          {chat.length===0&&(
            <div className="dq-empty">
              <div className="dq-empty-ico"><MessageSquare size={22}/></div>
              <p className="dq-empty-txt">No messages yet. Start a conversation!</p>
            </div>
          )}
          {chat.map((msg,idx)=>(
            <div key={idx} className={`dq-msg-row ${msg.sender}`}>
              {msg.sender==="teacher"&&<div className="dq-teacher-av"><GraduationCap size={14}/></div>}
              <div className="dq-bubble">
                <p className="dq-btext">{msg.text}</p>
                <p className="dq-btime">{msg.time}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef}/>
        </div>

        <div className="dq-input-bar">
          <textarea
            className="dq-textarea"
            rows={1}
            placeholder="Type a message..."
            value={message}
            onChange={e=>setMessage(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),sendMessageHandler())}
          />
          <button className="dq-send-btn" onClick={sendMessageHandler} disabled={!message.trim()}>
            <Send size={16}/>
          </button>
        </div>
      </div>

      {/* DRAG HANDLE */}
      <div className="dq-handle" onMouseDown={onMouseDown}>
        <div className="dq-handle-pill">
          <svg width="5" height="12" viewBox="0 0 6 12" fill="none">
            <path d="M1 1L0 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{color:"var(--mu)"}}/>
          </svg>
          <div className="dq-handle-line"/>
          <svg width="5" height="12" viewBox="0 0 6 12" fill="none">
            <path d="M5 1L6 6L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{color:"var(--mu)"}}/>
          </svg>
        </div>
      </div>

      {/* RIGHT */}
      <div className="dq-right">
        <div className="dq-right-head">
          <Info size={15} style={{color:"var(--c1)"}}/>
          <span className="dq-right-title">Session Info</span>
        </div>
        <div className="dq-right-body">

          <div>
            <p className="dq-section-lbl">Trainer</p>
            <div className="dq-trainer-card">
              <div className="dq-trainer-av"><GraduationCap size={16}/></div>
              <div style={{minWidth:0}}>
                <p className="dq-trainer-name">{trainerEmail?.split("@")[0]||"—"}</p>
                <p className="dq-trainer-email">{trainerEmail||"Not assigned"}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="dq-section-lbl">Overview</p>
            <div className="dq-stats-grid">
              {stats.map((s,i)=>(
                <div key={i} className="dq-stat-cell">
                  <p className="dq-stat-lbl">{s.label}</p>
                  <p className="dq-stat-val">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="dq-section-lbl">Status</p>
            <div className="dq-status-card">
              <div className="dq-status-dot"/>
              <span className="dq-status-txt">Session Active</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default Doubts;





















