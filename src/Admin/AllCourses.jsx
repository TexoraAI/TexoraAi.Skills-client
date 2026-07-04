// export default AllCourses;
import { courseService } from "@/services/courseService";
import {
  BookOpen,
  Folder,
  Mail,
  Plus,
  Search,
  Tag,
  Users,
  X,
  UserCheck,
  GripVertical,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Styles ─────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap');
:root{
  --bg:#f6f3fb;--card:#ffffff;--tx:#1e1533;--mu:#6b6180;--bd:#e9e2f5;
  --blue:#7c3aed;--blue2:#db2777;
  --c1:#818cf8;--c1b:#4f46e5;
  --c2:#fbbf24;--c2b:#d97706;
  --c3:#34d399;--c3b:#059669;
  --c4:#f472b6;--c4b:#db2777;
  --c5:#60a5fa;--c5b:#2563eb;
  --cr:#f87171;
  --sh:0 4px 20px rgba(30,21,51,.07);--shl:0 10px 40px rgba(30,21,51,.14);--r:20px;--r-sm:14px;
}
.ac-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#a89fc0;--bd:rgba(255,255,255,0.07);
  --sh:0 4px 24px rgba(0,0,0,.45);--shl:0 10px 40px rgba(0,0,0,.6);}

*{box-sizing:border-box;}
.ac{font-family:'Plus Jakarta Sans','Poppins',sans-serif;min-height:100vh;
  background:linear-gradient(180deg,#f6f2fc 0%,#fbf6fb 100%);color:var(--tx);}
.ac-dk.ac{background:var(--bg);}

.ac-split{display:flex;align-items:stretch;width:100%;min-height:auto;}
.ac-split-left{flex:1 1 auto;min-width:0;padding:24px;overflow-y:auto;}
.ac-split-left-inner{max-width:1320px;margin:0 auto;display:flex;flex-direction:column;gap:18px;}

.ac-divider{width:6px;flex:0 0 6px;cursor:col-resize;background:transparent;position:relative;align-self:stretch;display:flex;align-items:center;justify-content:center;touch-action:none;z-index:2;}
.ac-divider::before{content:'';position:absolute;left:50%;top:0;bottom:0;width:1px;background:var(--bd);transition:background .15s,width .15s;}
.ac-divider:hover::before,.ac-divider.ac-dragging::before{background:var(--c1);width:2px;}
.ac-divider-grip{width:16px;height:36px;border-radius:8px;background:var(--card);border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;color:var(--mu);opacity:0;transition:opacity .15s,color .15s,border-color .15s;box-shadow:var(--sh);}
.ac-divider:hover .ac-divider-grip,.ac-divider.ac-dragging .ac-divider-grip{opacity:1;color:var(--c1);border-color:rgba(129,140,248,.35);}

.ac-panel{flex:0 0 auto;height:100vh;position:sticky;top:0;align-self:flex-start;background:var(--card);border-left:1px solid var(--bd);box-shadow:-8px 0 28px rgba(30,21,51,.06);display:flex;flex-direction:column;overflow:hidden;animation:ac-panel-in .28s cubic-bezier(.16,1,.3,1);}
@keyframes ac-panel-in{from{flex-basis:0;opacity:.4;}to{opacity:1;}}
.ac-panel.ac-closing{animation:ac-panel-out .2s cubic-bezier(.4,0,1,1) forwards;}
@keyframes ac-panel-out{to{flex-basis:0!important;width:0!important;opacity:0;}}

.ac-hdr{position:relative;overflow:hidden;background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 55%,#db2777 100%);border:1px solid rgba(124,58,237,.25);border-radius:var(--r);padding:14px 18px;box-shadow:0 12px 32px rgba(124,58,237,.28);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.ac-hdr::after{content:'';position:absolute;top:-60px;right:-40px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,.10);pointer-events:none;}
.ac-hdr::before{content:'';position:absolute;bottom:-70px;left:12%;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,.06);pointer-events:none;}
.ac-dk .ac-hdr{background:linear-gradient(135deg,#3730a3 0%,#6d28d9 55%,#be185d 100%);box-shadow:0 12px 32px rgba(190,24,93,.35);}
.ac-hdr-l{display:flex;align-items:center;gap:12px;min-width:0;position:relative;z-index:1;}
.ac-hdr-ico{width:38px;height:38px;border-radius:11px;background:rgba(255,255,255,.20);border:1px solid rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;backdrop-filter:blur(6px);}
.ac-bdg{display:inline-flex;align-items:center;gap:6px;padding:3px 9px;border-radius:50px;background:rgba(255,255,255,.22);color:#fff;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;}
.ac-h1{font-size:17px;font-weight:800;color:#fff;margin:0 0 1px;letter-spacing:-.01em;word-break:break-word;}
.ac-h1 span{color:#ffe3f3;}
.ac-sub{font-size:11.5px;color:rgba(255,255,255,.9);margin:0;word-break:break-word;}

.ac-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.ac-stat{position:relative;overflow:hidden;border-radius:14px;padding:14px 16px;color:#fff;box-shadow:var(--sh);min-height:78px;display:flex;flex-direction:column;justify-content:space-between;}
.ac-stat::after{content:'';position:absolute;top:-30px;right:-30px;width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,.12);}
.ac-stat-top{display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1;}
.ac-stat-ico{width:26px;height:26px;border-radius:8px;background:rgba(255,255,255,.20);display:flex;align-items:center;justify-content:center;}
.ac-stat-num{font-size:20px;font-weight:800;line-height:1;margin-top:6px;position:relative;z-index:1;}
.ac-stat-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;opacity:.9;margin-top:3px;position:relative;z-index:1;}
.ac-stat-c1{background:linear-gradient(135deg,var(--c1),var(--c1b));}
.ac-stat-c3{background:linear-gradient(135deg,var(--c3),var(--c3b));}
.ac-stat-c4{background:linear-gradient(135deg,var(--c4),var(--c4b));}
.ac-stat-c2{background:linear-gradient(135deg,var(--c2),var(--c2b));}

.ac-abar{display:flex;align-items:center;align-content:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap;background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:10px 12px;box-shadow:var(--sh);}
.ac-search{position:relative;flex:1 1 260px;min-width:0;max-width:280px;}
.ac-search svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
.ac-search input{width:100%;min-width:0;box-sizing:border-box;padding:8px 12px 8px 34px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:inherit;font-size:12.5px;font-weight:500;outline:none;transition:border-color .2s,box-shadow .2s;}
.ac-search input::placeholder{color:var(--mu);}
.ac-search input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(129,140,248,.14);}
.ac-abar-r{display:flex;gap:8px;flex-wrap:wrap;min-width:0;}
.ac-btn{display:inline-flex;align-items:center;gap:5px;padding:8px 14px;border-radius:11px;border:none;font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s,box-shadow .2s;white-space:nowrap;}
.ac-btn:hover{opacity:.92;transform:translateY(-1px);}
.ac-btn-outline{background:var(--bg);border:1px solid var(--bd)!important;color:var(--mu);}
.ac-btn-outline:hover{border-color:rgba(124,58,237,.30)!important;color:var(--blue);}
.ac-btn-cyan{background:linear-gradient(135deg,var(--c1),var(--c1b));color:#fff;box-shadow:0 6px 18px rgba(79,70,229,.30);}
.ac-btn-cyan:hover{box-shadow:0 8px 22px rgba(79,70,229,.40);}
.ac-btn-cyan.ac-active{background:var(--bg);color:var(--c1b);box-shadow:none;border:1.5px solid rgba(129,140,248,.35);}

.ac-tcard{background:var(--card);border:1px solid var(--bd);border-radius:16px;box-shadow:var(--sh);overflow:hidden;}
.ac-thead-row{display:flex;align-items:center;justify-content:space-between;padding:11px 16px;border-bottom:1px solid var(--bd);background:var(--bg);}
.ac-thead-title{font-size:12px;font-weight:700;color:var(--tx);margin:0 0 1px;}
.ac-thead-sub{font-size:10.5px;color:var(--mu);margin:0;}

.ac-skel-row{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--bd);}
.ac-skel-l{display:flex;align-items:center;gap:10px;}
.ac-skel-sq{width:32px;height:32px;border-radius:10px;background:var(--bd);}
.ac-skel-line{height:9px;border-radius:6px;background:var(--bd);}
.ac-skel-pill{height:20px;width:70px;border-radius:30px;background:var(--bd);}
@keyframes ac-pulse{0%,100%{opacity:1}50%{opacity:.45}}
.ac-skel-row{animation:ac-pulse 1.4s ease-in-out infinite;}

.ac-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:26px 18px;min-height:180px;gap:8px;text-align:center;}
.ac-empty-ico{width:46px;height:46px;border-radius:14px;background:rgba(129,140,248,.10);border:1px solid rgba(129,140,248,.18);display:flex;align-items:center;justify-content:center;color:var(--c1b);}
.ac-empty-t{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 3px;}
.ac-empty-s{font-size:11px;color:var(--mu);margin:0;}

.ac-tscroll{width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;}
table.ac-t{width:100%;min-width:640px;border-collapse:collapse;font-size:12px;}
.ac-t thead th{padding:9px 12px;text-align:left;font-size:9.5px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.06em;background:var(--bg);border-bottom:1px solid var(--bd);white-space:nowrap;}
.ac-t thead th:first-child{padding-left:16px;}
.ac-t thead th:last-child{text-align:right;padding-right:16px;}
.ac-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
.ac-t tbody tr:last-child{border-bottom:none;}
.ac-t tbody tr:hover{background:rgba(129,140,248,.05);}
.ac-t tbody td{padding:10px 12px;vertical-align:middle;}
.ac-t tbody td:first-child{padding-left:16px;}
.ac-t tbody td:last-child{padding-right:16px;text-align:right;}
.ac-idx{font-size:11px;font-weight:700;color:var(--mu);}
.ac-course-cell{display:flex;align-items:center;gap:10px;}
.ac-course-av{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ac-course-name{font-size:12px;font-weight:700;color:var(--tx);transition:color .15s;white-space:nowrap;}
.ac-t tbody tr:hover .ac-course-name{color:var(--c1b);}
.ac-cat-tag{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:8px;font-size:10.5px;font-weight:700;border:1px solid;white-space:nowrap;}
.ac-trainer-cell{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--mu);white-space:nowrap;}
.ac-assigned-badge{display:inline-flex;align-items:center;gap:4px;padding:2px 7px;border-radius:6px;font-size:9.5px;font-weight:700;background:rgba(244,114,182,.10);border:1px solid rgba(244,114,182,.20);color:var(--c4b);margin-left:6px;}
.ac-status-ok{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:8px;font-size:10.5px;font-weight:700;background:rgba(52,211,153,.10);border:1px solid rgba(52,211,153,.22);color:var(--c3b);white-space:nowrap;}
.ac-status-dot{width:5px;height:5px;border-radius:50%;background:var(--c3);animation:ac-blink 1.4s ease-in-out infinite;}
@keyframes ac-blink{0%,100%{opacity:1}50%{opacity:.3}}
.ac-enroll-cell{display:flex;align-items:center;justify-content:flex-end;gap:4px;font-size:12px;font-weight:700;color:var(--tx);white-space:nowrap;}

.ac-toast{position:fixed;bottom:24px;right:24px;z-index:200;padding:10px 16px;border-radius:11px;background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.25);color:var(--c3b);font-family:inherit;font-size:12px;font-weight:700;box-shadow:var(--shl);display:flex;align-items:center;gap:7px;animation:ac-slidein .25s ease;backdrop-filter:blur(6px);max-width:calc(100vw - 32px);}
@keyframes ac-slidein{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
.ac-toast-err{background:rgba(248,113,113,.12);border-color:rgba(248,113,113,.25);color:var(--cr);}

.ac-dr-head{flex-shrink:0;padding:18px 22px;background:linear-gradient(180deg,rgba(129,140,248,.08),rgba(129,140,248,.02));border-bottom:1px solid var(--bd);}
.ac-dr-head-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
.ac-dr-head-l{display:flex;align-items:center;gap:11px;}
.ac-dr-ico{width:38px;height:38px;border-radius:11px;background:linear-gradient(145deg,var(--c1),var(--c1b));display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;box-shadow:0 6px 16px rgba(79,70,229,.32);}
.ac-dr-title{font-size:15px;font-weight:800;color:var(--tx);margin:0 0 2px;letter-spacing:-.01em;}
.ac-dr-sub{font-size:11px;color:var(--mu);margin:0;}
.ac-dr-close{width:30px;height:30px;border-radius:9px;border:1px solid var(--bd);background:var(--card);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;flex-shrink:0;}
.ac-dr-close:hover{border-color:rgba(248,113,113,.30);color:var(--cr);background:rgba(248,113,113,.06);}

.ac-dr-body{flex:1;overflow-y:auto;padding:22px;display:flex;flex-direction:column;gap:16px;min-width:0;}
.ac-dr-body::-webkit-scrollbar{width:8px;}
.ac-dr-body::-webkit-scrollbar-thumb{background:var(--bd);border-radius:8px;}

.ac-field{display:flex;flex-direction:column;gap:6px;}
.ac-field label{display:flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--mu);}
.ac-field label span{color:var(--cr);}
.ac-input{width:100%;padding:11px 13px;border-radius:12px;border:1.5px solid var(--bd);background:var(--bg);color:var(--tx);font-family:inherit;font-size:12.5px;outline:none;box-sizing:border-box;transition:border-color .18s,box-shadow .18s,background .18s;}
.ac-input:focus{border-color:var(--c1);box-shadow:0 0 0 4px rgba(129,140,248,.12);background:var(--card);}
.ac-input::placeholder{color:var(--mu);}
.ac-input:disabled{opacity:.6;cursor:not-allowed;}
textarea.ac-input{font-family:inherit;}
select.ac-input{cursor:pointer;appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b6180' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 15px center;padding-right:38px;}
.ac-field-hint{font-size:10.5px;color:var(--mu);margin-top:1px;}

.ac-divider-soft{height:1px;background:var(--bd);margin:4px 0;}

.ac-dr-foot{flex-shrink:0;display:flex;justify-content:flex-end;gap:9px;padding:14px 22px;background:var(--card);border-top:1px solid var(--bd);}
.ac-cancel{padding:9px 17px;border-radius:11px;border:1.5px solid var(--bd);background:var(--bg);color:var(--mu);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;}
.ac-cancel:hover{border-color:rgba(129,140,248,.30);color:var(--c1b);}
.ac-submit{padding:9px 20px;border-radius:11px;border:none;background:linear-gradient(135deg,var(--c1),var(--c1b));color:#fff;font-family:inherit;font-size:12px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s,box-shadow .2s;display:inline-flex;align-items:center;gap:6px;box-shadow:0 6px 18px rgba(79,70,229,.30);}
.ac-submit:hover{opacity:.92;transform:translateY(-1px);box-shadow:0 8px 22px rgba(79,70,229,.40);}
.ac-submit:disabled{opacity:.55;cursor:not-allowed;transform:none;box-shadow:none;}
.ac-spin{animation:ac-spin 0.8s linear infinite;}
@keyframes ac-spin{to{transform:rotate(360deg);}}

@media (max-width:1200px){.ac-stats{grid-template-columns:repeat(3,1fr);}}
@media (max-width:1024px){
  .ac-split{flex-direction:column;}
  .ac-divider{display:none;}
  .ac-panel{width:100%!important;flex-basis:auto!important;height:auto;position:relative;border-left:none;border-top:1px solid var(--bd);}
  .ac-split-left{padding:16px;}
  .ac-split-left-inner{gap:12px;}
  .ac-hdr{padding:14px 16px;}
  .ac-stats{grid-template-columns:repeat(3,1fr);gap:10px;}
}
@media (max-width:834px){
  .ac-split-left{padding:14px;}
  .ac-split-left-inner{gap:10px;}
  .ac-hdr{flex-direction:column;align-items:flex-start;padding:12px 14px;gap:10px;}
  .ac-hdr-l{flex-wrap:wrap;}
  .ac-stats{grid-template-columns:repeat(3,1fr);gap:8px;}
  .ac-abar{flex-direction:column;align-items:stretch;gap:8px;}
  .ac-search{max-width:none;}
  .ac-abar-r{width:100%;}
  .ac-btn{flex:1 1 auto;justify-content:center;}
}
@media (max-width:768px){
  .ac-split-left{padding:12px;}
  .ac-split-left-inner{gap:10px;}
  .ac-hdr{padding:12px 14px;border-radius:14px;}
  .ac-hdr-ico{width:34px;height:34px;border-radius:10px;}
  .ac-h1{font-size:15px;}
  .ac-sub{display:none;}
  .ac-stats{grid-template-columns:repeat(3,1fr);gap:8px;}
  .ac-stat{padding:10px 10px;min-height:66px;border-radius:12px;}
  .ac-stat-ico{width:22px;height:22px;}
  .ac-stat-num{font-size:16px;margin-top:2px;}
  .ac-stat-lbl{font-size:9.5px;}
  .ac-abar{margin-top:0;gap:8px;padding:8px 10px;}
  .ac-search input{padding:8px 12px 8px 34px;font-size:12px;}
  .ac-abar-r{flex-direction:row;flex-wrap:wrap;gap:6px;}
  .ac-btn{flex:1 1 auto;padding:8px 12px;font-size:10.5px;}
  .ac-tcard{margin-top:0;}
  .ac-thead-row{padding:9px 12px;}
}
@media (max-width:640px){
  .ac-split-left{padding:10px;}
  .ac-split-left-inner{gap:8px;}
  .ac-hdr{padding:10px 12px;border-radius:14px;gap:8px;}
  .ac-hdr-l{gap:8px;}
  .ac-hdr-ico{width:32px;height:32px;border-radius:9px;}
  .ac-h1{font-size:14px;}
  .ac-bdg{font-size:8.5px;padding:2px 7px;margin-bottom:3px;}
  .ac-stats{grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:0;}
  .ac-stat{padding:8px 8px;min-height:56px;border-radius:11px;flex-direction:column;align-items:flex-start;justify-content:space-between;}
  .ac-stat-ico{width:20px;height:20px;border-radius:7px;}
  .ac-stat-num{font-size:15px;margin-top:2px;}
  .ac-stat-lbl{font-size:8.5px;margin-top:1px;}
  .ac-tcard{border-radius:14px;}
  .ac-thead-row{padding:8px 10px;}
  .ac-t thead th:first-child,.ac-t tbody td:first-child{padding-left:12px;}
  .ac-t thead th:last-child,.ac-t tbody td:last-child{padding-right:12px;}
  .ac-t th:nth-child(1),.ac-t td:nth-child(1),
  .ac-t th:nth-child(4),.ac-t td:nth-child(4){display:none;}
  .ac-dr-head,.ac-dr-body,.ac-dr-foot{padding-left:14px;padding-right:14px;}
  .ac-dr-head{padding-top:14px;padding-bottom:14px;}
  .ac-dr-body{padding-top:14px;padding-bottom:14px;gap:12px;}
  .ac-dr-foot{padding-top:10px;padding-bottom:10px;flex-direction:column-reverse;gap:7px;}
  .ac-dr-foot .ac-cancel,.ac-dr-foot .ac-submit{width:100%;justify-content:center;padding:9px 14px;}
  .ac-abar{margin-top:0;gap:6px;flex-direction:column;align-items:stretch;}
  .ac-search{max-width:100%;margin:0;}
  .ac-search input{padding:7px 10px 7px 32px;border-radius:10px;font-size:11.5px;}
  .ac-abar-r{width:100%;display:flex;flex-direction:row;flex-wrap:wrap;gap:6px;}
  .ac-btn{flex:1 1 auto;justify-content:center;padding:8px 10px;font-size:10.5px;border-radius:10px;}
  .ac-tcard{margin-top:0;}
  .ac-toast{left:14px;right:14px;bottom:14px;padding:9px 14px;font-size:11px;}
}
@media (max-width:480px){
  .ac-split-left{padding:8px;}
  .ac-split-left-inner{gap:7px;}
  .ac-hdr{padding:9px 10px;border-radius:12px;gap:7px;}
  .ac-hdr-ico{width:28px;height:28px;border-radius:8px;}
  .ac-h1{font-size:13px;}
  .ac-bdg{font-size:8px;padding:2px 6px;}
  .ac-stats{grid-template-columns:repeat(3,1fr);gap:5px;}
  .ac-stat{padding:7px 7px;min-height:50px;border-radius:10px;}
  .ac-stat-ico{width:18px;height:18px;}
  .ac-stat-num{font-size:13px;}
  .ac-stat-lbl{font-size:7.5px;}
  .ac-thead-row{padding:7px 9px;}
  .ac-thead-title{font-size:11px;}
  .ac-thead-sub{font-size:9.5px;}
  .ac-empty{padding:18px 12px;min-height:150px;}
  .ac-empty-ico{width:40px;height:40px;}
  .ac-empty-t{font-size:12px;}
  .ac-empty-s{font-size:10px;}
}
@media (max-width:400px){
  .ac-hdr{padding:8px 9px;}
  .ac-hdr-ico{width:26px;height:26px;}
  .ac-stats{grid-template-columns:repeat(3,1fr);}
  .ac-h1{font-size:12.5px;}
  .ac-btn{font-size:10px;padding:7px 9px;}
}
`;

if (!document.getElementById("ac-st")) {
  const t = document.createElement("style");
  t.id = "ac-st";
  t.textContent = STYLES;
  document.head.appendChild(t);
}

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

/* ── category tag colours ── */
const CAT_COLORS = [
  { bg: "rgba(129,140,248,.10)", color: "var(--c1b)", bd: "rgba(129,140,248,.20)" },
  { bg: "rgba(244,114,182,.10)", color: "var(--c4b)", bd: "rgba(244,114,182,.20)" },
  { bg: "rgba(251,191,36,.10)", color: "var(--c2b)", bd: "rgba(251,191,36,.20)" },
  { bg: "rgba(52,211,153,.10)", color: "var(--c3b)", bd: "rgba(52,211,153,.20)" },
  { bg: "rgba(96,165,250,.10)", color: "var(--c5b)", bd: "rgba(96,165,250,.20)" },
];
const catColor = (val) =>
  CAT_COLORS[(String(val)?.charCodeAt(0) ?? 0) % CAT_COLORS.length];

/* ── avatar gradients ── */
const GRAD_BG = [
  "linear-gradient(135deg,#6d28d9,#4338ca)",
  "linear-gradient(135deg,#db2777,#9d174d)",
  "linear-gradient(135deg,#d97706,#92400e)",
  "linear-gradient(135deg,#059669,#065f46)",
  "linear-gradient(135deg,#2563eb,#1e40af)",
  "linear-gradient(135deg,#7c3aed,#5b21b6)",
];
const gradBg = (val) =>
  GRAD_BG[(String(val)?.charCodeAt(0) ?? 0) % GRAD_BG.length];

/* ── default form ── */
const EMPTY_FORM = {
  title: "",
  category: "",
  description: "",
  assignedTrainerEmail: "",
};

/* ── split layout constraints (per spec) ── */
const MIN_LEFT_WIDTH = 500; // px
const MIN_RIGHT_WIDTH = 420; // px
const DEFAULT_RIGHT_PCT = 0.4; // 40% of screen

/* ════════════════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════════════════ */
const AllCourses = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(isDark);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);
  const [trainersLoading, setTrainersLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { msg, err }

  const getDefaultRightWidth = () => {
    const pct = window.innerWidth * DEFAULT_RIGHT_PCT;
    const maxAllowedByLeft = window.innerWidth - MIN_LEFT_WIDTH - 6;
    return Math.max(MIN_RIGHT_WIDTH, Math.min(pct, maxAllowedByLeft));
  };
  const [rightWidth, setRightWidth] = useState(getDefaultRightWidth);
  const [dragging, setDragging] = useState(false);
  const dragStateRef = useRef({ startX: 0, startWidth: 0 });
  const splitRef = useRef(null);

  useEffect(() => {
    const o = new MutationObserver(() => setDark(isDark()));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    setTrainersLoading(true);
    courseService
      .getOrgTrainers()
      .then((res) => setTrainers(res.data || []))
      .catch((err) => console.error("Failed to load trainers", err))
      .finally(() => setTrainersLoading(false));
  }, []);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    setLoading(true);
    courseService
      .getOrgAdminCourses()
      .then((res) => {
        const mapped = res.data.map((c) => ({
          id: c.id,
          name: c.title,
          category: c.category,
          trainerName: c.ownerEmail,
          assignedTrainer: c.assignedTrainerEmail || null,
          status: "PUBLISHED",
          enrollments: 0,
        }));
        setCourses(mapped);
      })
      .catch((err) => console.error("Failed to load courses", err))
      .finally(() => setLoading(false));
  };

  const showToast = (msg, err = false) => {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 3000);
  };

  const openModal = () => {
    setForm(EMPTY_FORM);
    setRightWidth(getDefaultRightWidth());
    setOpen(true);
    setClosing(false);
  };

  const closeModal = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setForm(EMPTY_FORM);
    }, 200);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeModal]);

  const onDividerMouseDown = (e) => {
    e.preventDefault();
    dragStateRef.current = { startX: e.clientX, startWidth: rightWidth };
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const containerWidth = splitRef.current
        ? splitRef.current.getBoundingClientRect().width
        : window.innerWidth;
      const delta = dragStateRef.current.startX - e.clientX;
      let nextRight = dragStateRef.current.startWidth + delta;
      const maxRight = containerWidth - MIN_LEFT_WIDTH - 6;
      nextRight = Math.min(maxRight, Math.max(MIN_RIGHT_WIDTH, nextRight));
      setRightWidth(nextRight);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  const handleCreate = async () => {
    if (!form.title.trim()) {
      showToast("Course name is required", true);
      return;
    }
    if (!form.category.trim()) {
      showToast("Category is required", true);
      return;
    }
    if (!form.assignedTrainerEmail) {
      showToast("Please assign a trainer", true);
      return;
    }

    try {
      setSubmitting(true);
      await courseService.adminCreateCourse({
        title: form.title.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        assignedTrainerEmail: form.assignedTrainerEmail,
      });
      closeModal();
      loadCourses();
      showToast("Course created and assigned successfully!");
    } catch (err) {
      console.error("Create course failed", err);
      showToast(err?.response?.data?.message || "Failed to create course", true);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const publishedCount = courses.filter((c) => c.status === "PUBLISHED").length;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className={`ac${dark ? " ac-dk" : ""}`}>
      <div className="ac-split" ref={splitRef}>
        <div className="ac-split-left">
          <div className="ac-split-left-inner">
            {/* ── Header (back button removed) ── */}
            <div className="ac-hdr">
              <div className="ac-hdr-l">
                <div className="ac-hdr-ico">
                  <BookOpen size={18} />
                </div>
                <div>
                  <div className="ac-bdg">
                    <BookOpen size={9} /> Course Management
                  </div>
                  <h1 className="ac-h1">
                    All <span>Courses</span>
                  </h1>
                  <p className="ac-sub">
                    Create, assign and manage all courses in your organisation
                  </p>
                </div>
              </div>
            </div>

            <div className="ac-stats">
              <div className="ac-stat ac-stat-c1">
                <div className="ac-stat-top">
                  <div className="ac-stat-ico">
                    <BookOpen size={14} />
                  </div>
                </div>
                <div>
                  <div className="ac-stat-num">{courses.length}</div>
                  <div className="ac-stat-lbl">Total Courses</div>
                </div>
              </div>
              <div className="ac-stat ac-stat-c3">
                <div className="ac-stat-top">
                  <div className="ac-stat-ico">
                    <Users size={14} />
                  </div>
                </div>
                <div>
                  <div className="ac-stat-num">{publishedCount}</div>
                  <div className="ac-stat-lbl">Published</div>
                </div>
              </div>
              <div className="ac-stat ac-stat-c4">
                <div className="ac-stat-top">
                  <div className="ac-stat-ico">
                    <UserCheck size={14} />
                  </div>
                </div>
                <div>
                  <div className="ac-stat-num">{trainers.length}</div>
                  <div className="ac-stat-lbl">Trainers</div>
                </div>
              </div>
            </div>

            <div className="ac-abar">
              <div className="ac-search">
                <Search size={13} />
                <input
                  placeholder="Search courses…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="ac-abar-r">
                <button
                  className={`ac-btn ac-btn-cyan${open ? " ac-active" : ""}`}
                  onClick={openModal}
                >
                  <Plus size={13} /> Create Course
                </button>
                <button
                  className="ac-btn ac-btn-outline"
                  onClick={() => navigate("/admin/categories")}
                >
                  <Folder size={13} style={{ color: "var(--c1b)" }} /> Categories
                </button>
              </div>
            </div>

            <div className="ac-tcard">
              <div className="ac-thead-row">
                <div>
                  <p className="ac-thead-title">Course List</p>
                  <p className="ac-thead-sub">
                    {filteredCourses.length} course
                    {filteredCourses.length !== 1 && "s"} found
                  </p>
                </div>
              </div>

              {loading &&
                [1, 2, 3].map((i) => (
                  <div key={i} className="ac-skel-row">
                    <div className="ac-skel-l">
                      <div className="ac-skel-sq" />
                      <div>
                        <div className="ac-skel-line" style={{ width: 160, marginBottom: 7 }} />
                        <div className="ac-skel-line" style={{ width: 100 }} />
                      </div>
                    </div>
                    <div className="ac-skel-pill" />
                  </div>
                ))}

              {!loading && filteredCourses.length === 0 && (
                <div className="ac-empty">
                  <div className="ac-empty-ico">
                    <BookOpen size={22} />
                  </div>
                  <p className="ac-empty-t">No courses yet</p>
                  <p className="ac-empty-s">
                    Click "Create Course" to add your first course and assign it to a trainer
                  </p>
                </div>
              )}

              {!loading && filteredCourses.length > 0 && (
                <div className="ac-tscroll">
                  <table className="ac-t">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Course</th>
                        <th>Category</th>
                        <th>Trainer</th>
                        <th>Status</th>
                        <th>Enrollments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.map((c, index) => {
                        const cc = catColor(c.category);
                        return (
                          <tr key={c.id}>
                            <td>
                              <span className="ac-idx">{String(index + 1).padStart(2, "0")}</span>
                            </td>
                            <td>
                              <div className="ac-course-cell">
                                <div className="ac-course-av" style={{ background: gradBg(c.name) }}>
                                  <BookOpen size={14} color="white" />
                                </div>
                                <span className="ac-course-name">{c.name}</span>
                              </div>
                            </td>
                            <td>
                              <span
                                className="ac-cat-tag"
                                style={{ background: cc.bg, color: cc.color, borderColor: cc.bd }}
                              >
                                <Tag size={10} /> {c.category || "—"}
                              </span>
                            </td>
                            <td>
                              <div className="ac-trainer-cell">
                                <Mail size={11} />
                                {c.assignedTrainer ? (
                                  <>
                                    {c.assignedTrainer}
                                    <span className="ac-assigned-badge">
                                      <UserCheck size={9} /> Assigned
                                    </span>
                                  </>
                                ) : (
                                  c.trainerName
                                )}
                              </div>
                            </td>
                            <td>
                              <span className="ac-status-ok">
                                <span className="ac-status-dot" /> {c.status}
                              </span>
                            </td>
                            <td>
                              <div className="ac-enroll-cell">
                                <Users size={12} style={{ color: "var(--mu)" }} /> {c.enrollments}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {open && (
          <>
            <div
              className={`ac-divider${dragging ? " ac-dragging" : ""}`}
              onMouseDown={onDividerMouseDown}
              title="Drag to resize"
            >
              <div className="ac-divider-grip">
                <GripVertical size={12} />
              </div>
            </div>

            <div
              className={`ac-panel${closing ? " ac-closing" : ""}${dark ? " ac-dk" : ""}`}
              style={{ width: rightWidth, flexBasis: rightWidth }}
              role="region"
              aria-label="Create Course"
            >
              <div className="ac-dr-head">
                <div className="ac-dr-head-row">
                  <div className="ac-dr-head-l">
                    <div className="ac-dr-ico">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <p className="ac-dr-title">Create Course</p>
                      <p className="ac-dr-sub">Fill in the details and assign to a trainer</p>
                    </div>
                  </div>
                  <button className="ac-dr-close" onClick={closeModal} aria-label="Close">
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="ac-dr-body">
                <div className="ac-field">
                  <label>
                    Course Name <span>*</span>
                  </label>
                  <input
                    className="ac-input"
                    placeholder="e.g. React for Beginners"
                    value={form.title}
                    onChange={set("title")}
                  />
                </div>

                <div className="ac-field">
                  <label>
                    Category <span>*</span>
                  </label>
                  <input
                    className="ac-input"
                    placeholder="e.g. Web Development"
                    value={form.category}
                    onChange={set("category")}
                  />
                </div>

                <div className="ac-field">
                  <label>Description</label>
                  <textarea
                    className="ac-input"
                    rows={5}
                    style={{ resize: "none" }}
                    placeholder="Brief course description…"
                    value={form.description}
                    onChange={set("description")}
                  />
                </div>

                <div className="ac-divider-soft" />

                <div className="ac-field">
                  <label>
                    Assign Trainer <span>*</span>
                  </label>
                  <select
                    className="ac-input"
                    value={form.assignedTrainerEmail}
                    onChange={set("assignedTrainerEmail")}
                    disabled={trainersLoading}
                  >
                    <option value="">
                      {trainersLoading
                        ? "Loading trainers…"
                        : trainers.length === 0
                          ? "No trainers available"
                          : "Select a trainer…"}
                    </option>
                    {trainers.map((t) => (
                      <option key={t.email} value={t.email}>
                        {t.displayName ? `${t.displayName} — ${t.email}` : t.email}
                      </option>
                    ))}
                  </select>
                  <p className="ac-field-hint">
                    The selected trainer will own and manage this course.
                  </p>
                </div>
              </div>

              <div className="ac-dr-foot">
                <button className="ac-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button className="ac-submit" onClick={handleCreate} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="ac-spin" /> Creating…
                    </>
                  ) : (
                    <>
                      <Plus size={13} /> Create &amp; Assign
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {toast && (
        <div className={`ac-toast${toast.err ? " ac-toast-err" : ""}`}>
          {toast.err ? <AlertCircle size={14} /> : null}
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default AllCourses;