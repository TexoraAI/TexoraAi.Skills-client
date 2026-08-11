// import { useState } from "react";
// import { MessageCircle, X } from "lucide-react";
// import Doubts from "./Doubts";

// const STYLES = `
// .cwb-btn{position:fixed;bottom:28px;right:28px;width:56px;height:56px;border-radius:50%;
//   background:#22d3ee;border:none;display:flex;align-items:center;justify-content:center;
//   color:#0a0a0a;cursor:pointer;box-shadow:0 8px 24px rgba(34,211,238,0.35);
//   z-index:1000;transition:transform .15s ease,box-shadow .2s ease;}
// .cwb-btn:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(34,211,238,0.45);}
// .cwb-btn:active{transform:translateY(0);}

// .cwb-panel{position:fixed;bottom:98px;right:28px;width:680px;height:600px;
//   max-width:calc(100vw - 40px);max-height:calc(100vh - 140px);
//   z-index:999;border-radius:20px;overflow:hidden;
//   box-shadow:0 16px 48px rgba(0,0,0,0.22);
//   animation:cwb-pop .18s ease-out;}
// @keyframes cwb-pop{
//   from{opacity:0;transform:translateY(12px) scale(.98);}
//   to{opacity:1;transform:translateY(0) scale(1);}
// }

// @media (max-width:820px){
//   .cwb-panel{width:calc(100vw - 40px);}
// }
// @media (max-width:480px){
//   .cwb-panel{right:12px;bottom:88px;width:calc(100vw - 24px);height:calc(100vh - 160px);}
//   .cwb-btn{right:16px;bottom:16px;}
// }
// `;
// if(!document.getElementById("cwb-st")){const t=document.createElement("style");t.id="cwb-st";t.textContent=STYLES;document.head.appendChild(t);}

// const ChatWidgetButton = () => {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       {open && (
//         <div className="cwb-panel">
//           <Doubts compact />
//         </div>
//       )}
//       <button
//         className="cwb-btn"
//         onClick={() => setOpen(o => !o)}
//         aria-label={open ? "Close chat" : "Open chat"}
//       >
//         {open ? <X size={24} /> : <MessageCircle size={24} />}
//       </button>
//     </>
//   );
// };

// export default ChatWidgetButton;






























import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import Doubts from "./Doubts";

const STYLES = `
.cwb-btn{position:fixed;bottom:28px;right:28px;width:56px;height:56px;border-radius:50%;
  background:#22d3ee;border:none;display:flex;align-items:center;justify-content:center;
  color:#0a0a0a;cursor:pointer;box-shadow:0 8px 24px rgba(34,211,238,0.35);
  z-index:1000;transition:transform .15s ease,box-shadow .2s ease;}
.cwb-btn:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(34,211,238,0.45);}
.cwb-btn:active{transform:translateY(0);}

.cwb-panel{position:fixed;bottom:98px;right:28px;width:680px;
  height:min(600px, calc(100vh - 180px));
  max-width:calc(100vw - 40px);
  z-index:999;border-radius:20px;overflow:hidden;
  box-shadow:0 16px 48px rgba(0,0,0,0.22);
  animation:cwb-pop .18s ease-out;}
@keyframes cwb-pop{
  from{opacity:0;transform:translateY(12px) scale(.98);}
  to{opacity:1;transform:translateY(0) scale(1);}
}

@media (max-width:820px){
  .cwb-panel{width:calc(100vw - 40px);}
}
@media (max-width:480px){
  .cwb-panel{right:12px;bottom:88px;width:calc(100vw - 24px);height:calc(100vh - 160px);}
  .cwb-btn{right:16px;bottom:16px;}
}
`;
if(!document.getElementById("cwb-st")){const t=document.createElement("style");t.id="cwb-st";t.textContent=STYLES;document.head.appendChild(t);}

const ChatWidgetButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="cwb-panel">
          <Doubts compact />
        </div>
      )}
      <button
        className="cwb-btn"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
};

export default ChatWidgetButton;