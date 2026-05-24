// import { useEffect, useRef, useState, useCallback } from "react";
// import { Client } from "@stomp/stompjs";
// import {
//   Layout,
//   GitBranch,
//   FolderOpen,
//   Upload,
//   Download,
//   Trash2,
//   Users,
//   Wifi,
//   WifiOff,
//   Save,
//   ZoomIn,
//   ZoomOut,
//   Maximize2,
//   X,
//   FileText,
//   Box,
//   Pencil,
//   AlignLeft,
//   RotateCcw,
//   RotateCw,
//   Hand,
//   Eraser,
//   Pen,
//   Star,
//   Clock,
//   Grid,
//   Search,
//   Plus,
//   MoreHorizontal,
//   ArrowRight,
//   Triangle,
//   Circle,
//   Square,
//   Hexagon,
//   Diamond,
//   Type,
//   StickyNote,
//   MessageSquare,
//   Layers,
//   Image,
//   ChevronRight,
//   ChevronLeft,
//   Copy,
//   Move,
//   Lock,
//   Trash,
//   Globe,
//   Zap,
//   Monitor,
//   Network,
//   Cpu,
//   Database,
//   Activity,
//   Minus,
//   Hash,
//   Home,
//   MousePointer,
//   Highlighter,
//   ArrowUpRight,
//   Frame,
//   Navigation,
//   History,
//   Play,
//   ChevronDown,
//   BarChart2,
//   Workflow,
//   Presentation,
//   Share2,
// } from "lucide-react";

// import {
//   getWhiteboardState,
//   saveWhiteboardSnapshot,
//   clearWhiteboardSession,
// } from "../services/liveSessionService";

// const WS_URL =
//   (import.meta.env.VITE_WS_BASE_URL || "ws://localhost:9000") + "/live-chat";

// // ── CURSOR DATA URLs ──────────────────────────────────────────────────────────
// const PEN_CURSOR =
//   "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M4 20L6.5 14.5L16.8 4.2C17.6 3.4 18.9 3.4 19.7 4.2C20.5 5 20.5 6.3 19.7 7.1L9.4 17.4L4 20Z' fill='white' stroke='%23111827' stroke-width='1.8' stroke-linejoin='round'/%3E%3Cpath d='M14.8 6.2L17.7 9.1' stroke='%23111827' stroke-width='1.8' stroke-linecap='round'/%3E%3Ccircle cx='5.2' cy='18.8' r='1.5' fill='%232563eb'/%3E%3C/svg%3E\") 3 21, crosshair";

// const HIGHLIGHTER_CURSOR =
//   "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M5 19L7 14L15.5 5.5C16.3 4.7 17.6 4.7 18.4 5.5C19.2 6.3 19.2 7.6 18.4 8.4L10 16.8L5 19Z' fill='%23bbf7d0' stroke='%23111827' stroke-width='1.8' stroke-linejoin='round'/%3E%3Cpath d='M13.8 7.2L16.7 10.1' stroke='%23111827' stroke-width='1.8' stroke-linecap='round'/%3E%3Cpath d='M4 21H13' stroke='%2322c55e' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E\") 4 20, crosshair";

// const ERASER_CURSOR =
//   "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M4.5 14.5L12.5 6.5C13.3 5.7 14.6 5.7 15.4 6.5L19 10.1C19.8 10.9 19.8 12.2 19 13L12 20H7.5L4.5 17C3.8 16.3 3.8 15.2 4.5 14.5Z' fill='white' stroke='%23111827' stroke-width='1.8' stroke-linejoin='round'/%3E%3Cpath d='M9 10L15.5 16.5' stroke='%23111827' stroke-width='1.5' stroke-linecap='round'/%3E%3Cpath d='M12 20H21' stroke='%23111827' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E\") 8 8, cell";

// function getCanvasCursor(activeTool, isPanning) {
//   if (isPanning) return "grabbing";
//   switch (activeTool) {
//     case "draw":
//     case "brush":
//     case "pen":
//     case "pencil":
//       return PEN_CURSOR;
//     case "highlighter":
//       return HIGHLIGHTER_CURSOR;
//     case "eraser":
//       return ERASER_CURSOR;
//     case "hand":
//       return "grab";
//     case "select":
//       return "default";
//     case "text":
//       return "text";
//     case "arrow":
//     case "connector":
//     case "shape":
//       return "crosshair";
//     default:
//       return "default";
//   }
// }

// // ── SMOOTH PATH DRAWING ───────────────────────────────────────────────────────
// function drawSmoothPath(ctx, points, options) {
//   if (!points || points.length === 0) return;

//   const {
//     color = "#2563eb",
//     width = 3,
//     zoom = 1,
//     panOffset = { x: 0, y: 0 },
//     tool = "pen",
//   } = options || {};

//   ctx.save();
//   ctx.lineCap = "round";
//   ctx.lineJoin = "round";
//   ctx.strokeStyle = color;
//   ctx.lineWidth = Math.max(1, width * zoom);

//   if (tool === "eraser") {
//     ctx.globalCompositeOperation = "destination-out";
//     ctx.strokeStyle = "rgba(0,0,0,1)";
//     ctx.lineWidth = Math.max(8, width * zoom * 3);
//   }

//   if (tool === "highlighter") {
//     ctx.globalAlpha = 0.35;
//     ctx.lineWidth = Math.max(8, width * zoom * 3);
//   }

//   const tx = (p) => p.x * zoom + panOffset.x;
//   const ty = (p) => p.y * zoom + panOffset.y;

//   if (points.length === 1) {
//     const p = points[0];
//     ctx.beginPath();
//     ctx.arc(tx(p), ty(p), ctx.lineWidth / 2, 0, Math.PI * 2);
//     ctx.fillStyle = ctx.strokeStyle;
//     ctx.fill();
//     ctx.restore();
//     return;
//   }

//   ctx.beginPath();
//   ctx.moveTo(tx(points[0]), ty(points[0]));

//   if (points.length === 2) {
//     ctx.lineTo(tx(points[1]), ty(points[1]));
//     ctx.stroke();
//     ctx.restore();
//     return;
//   }

//   for (let i = 1; i < points.length - 1; i++) {
//     const current = points[i];
//     const next = points[i + 1];
//     const midX = (tx(current) + tx(next)) / 2;
//     const midY = (ty(current) + ty(next)) / 2;
//     ctx.quadraticCurveTo(tx(current), ty(current), midX, midY);
//   }

//   const last = points[points.length - 1];
//   ctx.lineTo(tx(last), ty(last));
//   ctx.stroke();
//   ctx.restore();
// }

// const MIN_POINT_DISTANCE = 1.2;

// function shouldAddPoint(last, next) {
//   if (!last) return true;
//   return Math.hypot(next.x - last.x, next.y - last.y) >= MIN_POINT_DISTANCE;
// }

// // ── DEFAULT PROJECTS ──────────────────────────────────────────────────────────
// const DEFAULT_PROJECTS = [
//   "DSA Course",
//   "System Design",
//   "Java OOP",
//   "React Course",
//   "Database",
// ];

// // ── MOCK DATA ─────────────────────────────────────────────────────────────────
// const MOCK_BOARDS = [
//   {
//     id: 1,
//     title: "DSA - Binary Trees Explanation",
//     owner: "Trainer",
//     modified: "May 11, 2026 4:31 PM",
//     starred: true,
//     project: "DSA Course",
//     thumbnail: "tree",
//     templateId: "dsa_tree",
//   },
//   {
//     id: 2,
//     title: "System Design - Microservices",
//     owner: "Trainer",
//     modified: "May 11, 2026 2:15 PM",
//     starred: false,
//     project: "System Design",
//     thumbnail: "arch",
//     templateId: "system",
//   },
//   {
//     id: 3,
//     title: "UML Class Diagram - E-commerce",
//     owner: "Trainer",
//     modified: "May 10, 2026 11:00 AM",
//     starred: true,
//     project: "Java OOP",
//     thumbnail: "uml",
//     templateId: "uml_class",
//   },
//   {
//     id: 4,
//     title: "Flowchart - Auth Flow",
//     owner: "Trainer",
//     modified: "May 9, 2026 3:45 PM",
//     starred: false,
//     project: null,
//     thumbnail: "flow",
//     templateId: "flowchart",
//   },
//   {
//     id: 5,
//     title: "Brainstorm - React Architecture",
//     owner: "Trainer",
//     modified: "May 8, 2026 9:20 AM",
//     starred: false,
//     project: "React Course",
//     thumbnail: "mind",
//     templateId: "mindmap",
//   },
//   {
//     id: 6,
//     title: "ER Diagram - Student DB",
//     owner: "Trainer",
//     modified: "May 7, 2026 5:00 PM",
//     starred: false,
//     project: "Database",
//     thumbnail: "er",
//     templateId: "er",
//   },
// ];

// const TEMPLATE_CATEGORIES = [
//   "All",
//   "Agile",
//   "Brainstorming",
//   "Design",
//   "Workshop",
//   "Meetings",
//   "Education",
//   "Games",
//   "Project Planning",
//   "Presentation",
//   "Architecture",
//   "UML",
//   "DSA Teaching",
// ];

// const TEMPLATES = [
//   {
//     id: "flowchart",
//     title: "Flowchart",
//     category: "Education",
//     color: "#3b82f6",
//     icon: GitBranch,
//   },
//   {
//     id: "mindmap",
//     title: "Mind Map",
//     category: "Brainstorming",
//     color: "#8b5cf6",
//     icon: Share2,
//   },
//   {
//     id: "kanban",
//     title: "Kanban Board",
//     category: "Agile",
//     color: "#10b981",
//     icon: Layout,
//   },
//   {
//     id: "wireframe",
//     title: "UI Wireframe",
//     category: "Design",
//     color: "#f59e0b",
//     icon: Box,
//   },
//   {
//     id: "timeline",
//     title: "Timeline",
//     category: "Project Planning",
//     color: "#ef4444",
//     icon: AlignLeft,
//   },
//   {
//     id: "er",
//     title: "ER Diagram",
//     category: "Education",
//     color: "#06b6d4",
//     icon: Database,
//   },
//   {
//     id: "uml_class",
//     title: "UML Class",
//     category: "UML",
//     color: "#6366f1",
//     icon: Layers,
//   },
//   {
//     id: "sequence",
//     title: "Sequence Diagram",
//     category: "UML",
//     color: "#ec4899",
//     icon: Activity,
//   },
//   {
//     id: "network",
//     title: "Network Topology",
//     category: "Architecture",
//     color: "#84cc16",
//     icon: Network,
//   },
//   {
//     id: "system",
//     title: "System Architecture",
//     category: "Architecture",
//     color: "#f97316",
//     icon: Cpu,
//   },
//   {
//     id: "dsa_tree",
//     title: "BST / Tree",
//     category: "DSA Teaching",
//     color: "#a855f7",
//     icon: GitBranch,
//   },
//   {
//     id: "dsa_graph",
//     title: "Graph Algorithms",
//     category: "DSA Teaching",
//     color: "#14b8a6",
//     icon: Workflow,
//   },
//   {
//     id: "blank",
//     title: "Blank Canvas",
//     category: "All",
//     color: "#64748b",
//     icon: FileText,
//   },
//   {
//     id: "retro",
//     title: "Retrospective",
//     category: "Agile",
//     color: "#f43f5e",
//     icon: RotateCcw,
//   },
//   {
//     id: "presentation",
//     title: "Presentation",
//     category: "Presentation",
//     color: "#0ea5e9",
//     icon: Monitor,
//   },
// ];

// const DIAGRAM_TYPES = [
//   { id: "flowchart", label: "Flowchart", icon: GitBranch, color: "#3b82f6" },
//   { id: "uml_class", label: "UML Class", icon: Box, color: "#8b5cf6" },
//   {
//     id: "uml_sequence",
//     label: "Sequence Diagram",
//     icon: Activity,
//     color: "#ec4899",
//   },
//   { id: "uml_usecase", label: "Use Case", icon: Users, color: "#6366f1" },
//   { id: "er", label: "ER Diagram", icon: Database, color: "#06b6d4" },
//   { id: "network", label: "Network Diagram", icon: Network, color: "#10b981" },
//   { id: "mindmap", label: "Mind Map", icon: Share2, color: "#f59e0b" },
//   { id: "org", label: "Org Chart", icon: Layout, color: "#ef4444" },
//   { id: "workflow", label: "Workflow", icon: Workflow, color: "#f97316" },
//   { id: "aws", label: "AWS Architecture", icon: Cpu, color: "#ff9900" },
//   { id: "system", label: "System Design", icon: Monitor, color: "#84cc16" },
//   { id: "dsa", label: "DSA Visualization", icon: BarChart2, color: "#a855f7" },
// ];

// const SHAPE_CATEGORIES = {
//   "Recently Used": ["rect", "rounded_rect", "circle", "diamond", "process"],
//   "Basic Shapes": [
//     "rect",
//     "rounded_rect",
//     "circle",
//     "ellipse",
//     "triangle",
//     "diamond",
//     "pentagon",
//     "hexagon",
//     "octagon",
//     "star",
//     "line",
//     "arrow",
//   ],
//   Flowchart: [
//     "process",
//     "decision",
//     "database_shape",
//     "document",
//     "connector",
//     "io",
//   ],
//   UML: ["class_box", "interface_box", "actor", "use_case_oval"],
//   Network: ["server", "router", "switch_node", "firewall", "pc"],
//   AWS: ["ec2", "s3", "rds", "lambda", "elb"],
//   "Mind Map": ["bubble", "leaf", "branch"],
// };

// const SHAPE_ICONS = {
//   rect: Square,
//   rounded_rect: Square,
//   circle: Circle,
//   ellipse: Circle,
//   triangle: Triangle,
//   diamond: Diamond,
//   pentagon: Hexagon,
//   hexagon: Hexagon,
//   octagon: Hexagon,
//   star: Star,
//   line: Minus,
//   arrow: ArrowRight,
//   process: Square,
//   decision: Diamond,
//   database_shape: Database,
//   document: FileText,
//   connector: Circle,
//   io: Square,
//   class_box: Box,
//   interface_box: Box,
//   actor: Users,
//   use_case_oval: Circle,
//   server: Cpu,
//   router: Network,
//   switch_node: Network,
//   firewall: Lock,
//   pc: Monitor,
//   ec2: Cpu,
//   s3: Database,
//   rds: Database,
//   lambda: Zap,
//   elb: BarChart2,
//   bubble: Circle,
//   leaf: Hash,
//   branch: GitBranch,
// };

// // ── TEMPLATE SHAPES ───────────────────────────────────────────────────────────
// function getTemplateShapes(templateId) {
//   const makeId = () =>
//     typeof crypto !== "undefined" && crypto.randomUUID
//       ? crypto.randomUUID()
//       : `shape-${Date.now()}-${Math.random()}`;
//   const addIds = (arr) =>
//     arr.map((s) => ({
//       ...s,
//       id: makeId(),
//       selected: false,
//       rotation: 0,
//       locked: false,
//     }));

//   const shapes = {
//     flowchart: addIds([
//       {
//         type: "rect_shape",
//         x: 300,
//         y: 60,
//         w: 120,
//         h: 40,
//         rx: 6,
//         label: "Start",
//         color: "#3b82f6",
//         fill: "#3b82f620",
//       },
//       {
//         type: "diamond_shape",
//         x: 300,
//         y: 150,
//         w: 120,
//         h: 60,
//         label: "Decision?",
//         color: "#10b981",
//         fill: "#10b98120",
//       },
//       {
//         type: "rect_shape",
//         x: 300,
//         y: 270,
//         w: 120,
//         h: 40,
//         rx: 4,
//         label: "Process",
//         color: "#f59e0b",
//         fill: "#f59e0b20",
//       },
//       {
//         type: "rect_shape",
//         x: 300,
//         y: 370,
//         w: 120,
//         h: 40,
//         rx: 20,
//         label: "End",
//         color: "#ef4444",
//         fill: "#ef444420",
//       },
//       {
//         type: "arrow_conn",
//         x1: 360,
//         y1: 100,
//         x2: 360,
//         y2: 150,
//         color: "#64748b",
//       },
//       {
//         type: "arrow_conn",
//         x1: 360,
//         y1: 210,
//         x2: 360,
//         y2: 270,
//         color: "#64748b",
//       },
//       {
//         type: "arrow_conn",
//         x1: 360,
//         y1: 310,
//         x2: 360,
//         y2: 370,
//         color: "#64748b",
//       },
//       {
//         type: "arrow_conn",
//         x1: 420,
//         y1: 180,
//         x2: 500,
//         y2: 180,
//         color: "#ef4444",
//         label: "No",
//       },
//     ]),
//     uml_class: addIds([
//       {
//         type: "class_shape",
//         x: 80,
//         y: 80,
//         w: 180,
//         h: 160,
//         label: "User",
//         attrs: ["- id: int", "- name: String", "- email: String"],
//         methods: ["+ login()", "+ logout()"],
//         color: "#8b5cf6",
//       },
//       {
//         type: "class_shape",
//         x: 360,
//         y: 80,
//         w: 180,
//         h: 140,
//         label: "Course",
//         attrs: ["- id: int", "- title: String", "- duration: int"],
//         methods: ["+ enroll()"],
//         color: "#3b82f6",
//       },
//       {
//         type: "class_shape",
//         x: 220,
//         y: 310,
//         w: 180,
//         h: 120,
//         label: "Enrollment",
//         attrs: ["- userId: int", "- courseId: int", "- date: Date"],
//         methods: [],
//         color: "#10b981",
//       },
//       {
//         type: "arrow_conn",
//         x1: 260,
//         y1: 240,
//         x2: 310,
//         y2: 310,
//         color: "#64748b",
//         style: "dashed",
//       },
//       {
//         type: "arrow_conn",
//         x1: 450,
//         y1: 220,
//         x2: 400,
//         y2: 310,
//         color: "#64748b",
//         style: "dashed",
//       },
//     ]),
//     er: addIds([
//       {
//         type: "er_entity",
//         x: 60,
//         y: 100,
//         w: 140,
//         h: 160,
//         label: "Student",
//         attrs: ["PK id", "name", "email", "batch"],
//         color: "#06b6d4",
//       },
//       {
//         type: "er_entity",
//         x: 320,
//         y: 100,
//         w: 140,
//         h: 140,
//         label: "Course",
//         attrs: ["PK id", "title", "duration"],
//         color: "#3b82f6",
//       },
//       {
//         type: "er_relation",
//         x: 220,
//         y: 150,
//         w: 80,
//         h: 50,
//         label: "enrolls",
//         color: "#8b5cf6",
//       },
//       {
//         type: "arrow_conn",
//         x1: 200,
//         y1: 175,
//         x2: 220,
//         y2: 175,
//         color: "#64748b",
//       },
//       {
//         type: "arrow_conn",
//         x1: 300,
//         y1: 175,
//         x2: 320,
//         y2: 175,
//         color: "#64748b",
//       },
//     ]),
//     mindmap: addIds([
//       {
//         type: "bubble_shape",
//         x: 300,
//         y: 200,
//         rx: 60,
//         ry: 30,
//         label: "React",
//         color: "#8b5cf6",
//         fill: "#8b5cf620",
//       },
//       {
//         type: "bubble_shape",
//         x: 80,
//         y: 100,
//         rx: 45,
//         ry: 22,
//         label: "Hooks",
//         color: "#3b82f6",
//         fill: "#3b82f620",
//       },
//       {
//         type: "bubble_shape",
//         x: 80,
//         y: 300,
//         rx: 45,
//         ry: 22,
//         label: "State",
//         color: "#10b981",
//         fill: "#10b98120",
//       },
//       {
//         type: "bubble_shape",
//         x: 520,
//         y: 100,
//         rx: 45,
//         ry: 22,
//         label: "Props",
//         color: "#f59e0b",
//         fill: "#f59e0b20",
//       },
//       {
//         type: "bubble_shape",
//         x: 520,
//         y: 300,
//         rx: 45,
//         ry: 22,
//         label: "Context",
//         color: "#ef4444",
//         fill: "#ef444420",
//       },
//       {
//         type: "line_conn",
//         x1: 300,
//         y1: 200,
//         x2: 125,
//         y2: 100,
//         color: "#3b82f680",
//       },
//       {
//         type: "line_conn",
//         x1: 300,
//         y1: 200,
//         x2: 125,
//         y2: 300,
//         color: "#10b98180",
//       },
//       {
//         type: "line_conn",
//         x1: 300,
//         y1: 200,
//         x2: 475,
//         y2: 100,
//         color: "#f59e0b80",
//       },
//       {
//         type: "line_conn",
//         x1: 300,
//         y1: 200,
//         x2: 475,
//         y2: 300,
//         color: "#ef444480",
//       },
//     ]),
//     dsa_tree: addIds([
//       {
//         type: "rect_shape",
//         x: 300,
//         y: 30,
//         w: 60,
//         h: 36,
//         rx: 4,
//         label: "50",
//         color: "#3b82f6",
//         fill: "#3b82f620",
//       },
//       {
//         type: "rect_shape",
//         x: 160,
//         y: 120,
//         w: 60,
//         h: 36,
//         rx: 4,
//         label: "30",
//         color: "#8b5cf6",
//         fill: "#8b5cf620",
//       },
//       {
//         type: "rect_shape",
//         x: 440,
//         y: 120,
//         w: 60,
//         h: 36,
//         rx: 4,
//         label: "70",
//         color: "#8b5cf6",
//         fill: "#8b5cf620",
//       },
//       {
//         type: "rect_shape",
//         x: 80,
//         y: 210,
//         w: 60,
//         h: 36,
//         rx: 4,
//         label: "20",
//         color: "#10b981",
//         fill: "#10b98120",
//       },
//       {
//         type: "rect_shape",
//         x: 240,
//         y: 210,
//         w: 60,
//         h: 36,
//         rx: 4,
//         label: "40",
//         color: "#10b981",
//         fill: "#10b98120",
//       },
//       {
//         type: "rect_shape",
//         x: 360,
//         y: 210,
//         w: 60,
//         h: 36,
//         rx: 4,
//         label: "60",
//         color: "#10b981",
//         fill: "#10b98120",
//       },
//       {
//         type: "rect_shape",
//         x: 520,
//         y: 210,
//         w: 60,
//         h: 36,
//         rx: 4,
//         label: "80",
//         color: "#10b981",
//         fill: "#10b98120",
//       },
//       {
//         type: "line_conn",
//         x1: 330,
//         y1: 66,
//         x2: 190,
//         y2: 120,
//         color: "#64748b",
//       },
//       {
//         type: "line_conn",
//         x1: 330,
//         y1: 66,
//         x2: 470,
//         y2: 120,
//         color: "#64748b",
//       },
//       {
//         type: "line_conn",
//         x1: 190,
//         y1: 156,
//         x2: 110,
//         y2: 210,
//         color: "#94a3b8",
//       },
//       {
//         type: "line_conn",
//         x1: 190,
//         y1: 156,
//         x2: 270,
//         y2: 210,
//         color: "#94a3b8",
//       },
//       {
//         type: "line_conn",
//         x1: 470,
//         y1: 156,
//         x2: 390,
//         y2: 210,
//         color: "#94a3b8",
//       },
//       {
//         type: "line_conn",
//         x1: 470,
//         y1: 156,
//         x2: 550,
//         y2: 210,
//         color: "#94a3b8",
//       },
//     ]),
//     system: addIds([
//       {
//         type: "rect_shape",
//         x: 100,
//         y: 110,
//         w: 140,
//         h: 50,
//         rx: 6,
//         label: "Load Balancer",
//         color: "#3b82f6",
//         fill: "#3b82f620",
//       },
//       {
//         type: "rect_shape",
//         x: 100,
//         y: 220,
//         w: 120,
//         h: 44,
//         rx: 6,
//         label: "Service A",
//         color: "#8b5cf6",
//         fill: "#8b5cf620",
//       },
//       {
//         type: "rect_shape",
//         x: 260,
//         y: 220,
//         w: 120,
//         h: 44,
//         rx: 6,
//         label: "Service B",
//         color: "#8b5cf6",
//         fill: "#8b5cf620",
//       },
//       {
//         type: "rect_shape",
//         x: 420,
//         y: 220,
//         w: 120,
//         h: 44,
//         rx: 6,
//         label: "Service C",
//         color: "#8b5cf6",
//         fill: "#8b5cf620",
//       },
//       {
//         type: "rect_shape",
//         x: 180,
//         y: 360,
//         w: 120,
//         h: 44,
//         rx: 6,
//         label: "Database",
//         color: "#06b6d4",
//         fill: "#06b6d420",
//       },
//       {
//         type: "rect_shape",
//         x: 360,
//         y: 360,
//         w: 120,
//         h: 44,
//         rx: 6,
//         label: "Cache",
//         color: "#10b981",
//         fill: "#10b98120",
//       },
//       {
//         type: "arrow_conn",
//         x1: 170,
//         y1: 110,
//         x2: 160,
//         y2: 220,
//         color: "#64748b",
//       },
//       {
//         type: "arrow_conn",
//         x1: 170,
//         y1: 110,
//         x2: 320,
//         y2: 220,
//         color: "#64748b",
//       },
//       {
//         type: "arrow_conn",
//         x1: 170,
//         y1: 110,
//         x2: 480,
//         y2: 220,
//         color: "#64748b",
//       },
//     ]),
//   };
//   shapes["uml"] = shapes["uml_class"];
//   shapes["dsa"] = shapes["dsa_tree"];
//   shapes["network"] = shapes["system"];
//   return shapes[templateId] || [];
// }

// // ── HELPERS ───────────────────────────────────────────────────────────────────
// function makeShapeId() {
//   return typeof crypto !== "undefined" && crypto.randomUUID
//     ? crypto.randomUUID()
//     : `shape-${Date.now()}-${Math.random().toString(36).slice(2)}`;
// }

// function makeId() {
//   return typeof crypto !== "undefined" && crypto.randomUUID
//     ? crypto.randomUUID()
//     : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
// }

// const HANDLE_SIZE = 8;

// function parseWhiteboardElements(raw) {
//   if (!raw) return { paths: [], templateShapes: [] };
//   try {
//     const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
//     if (Array.isArray(parsed)) {
//       return { paths: parsed, templateShapes: [] };
//     }
//     return {
//       paths: Array.isArray(parsed.paths) ? parsed.paths : [],
//       templateShapes: Array.isArray(parsed.templateShapes)
//         ? parsed.templateShapes
//         : [],
//       zoom: parsed.zoom,
//       panOffset: parsed.panOffset,
//     };
//   } catch (e) {
//     console.warn("Invalid whiteboard elements:", e);
//     return { paths: [], templateShapes: [] };
//   }
// }

// // ── DRAW SHAPE ────────────────────────────────────────────────────────────────
// function drawShapeOnCanvas(ctx, shape, zoom, panOffset, isDark, isSelected) {
//   const px = (x) => x * zoom + panOffset.x;
//   const py = (y) => y * zoom + panOffset.y;
//   const sc = (v) => v * zoom;

//   ctx.save();

//   if (shape.type === "rect_shape") {
//     const x = px(shape.x),
//       y = py(shape.y),
//       w = sc(shape.w),
//       h = sc(shape.h);
//     ctx.fillStyle = shape.fill || shape.color + "20";
//     ctx.strokeStyle = shape.color;
//     ctx.lineWidth = 1.5;
//     ctx.beginPath();
//     if (ctx.roundRect) ctx.roundRect(x, y, w, h, sc(shape.rx || 0));
//     else ctx.rect(x, y, w, h);
//     ctx.fill();
//     ctx.stroke();
//     if (shape.label) {
//       ctx.fillStyle = shape.color;
//       ctx.font = `${Math.max(10, sc(11))}px system-ui`;
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.fillText(shape.label, x + w / 2, y + h / 2);
//     }
//   } else if (shape.type === "triangle_shape") {
//     const x = px(shape.x),
//       y = py(shape.y),
//       w = sc(shape.w),
//       h = sc(shape.h);
//     ctx.fillStyle = shape.fill || shape.color + "20";
//     ctx.strokeStyle = shape.color;
//     ctx.lineWidth = 1.5;
//     ctx.beginPath();
//     ctx.moveTo(x + w / 2, y);
//     ctx.lineTo(x + w, y + h);
//     ctx.lineTo(x, y + h);
//     ctx.closePath();
//     ctx.fill();
//     ctx.stroke();
//     if (shape.label) {
//       ctx.fillStyle = shape.color;
//       ctx.font = `${Math.max(9, sc(10))}px system-ui`;
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.fillText(shape.label, x + w / 2, y + h * 0.67);
//     }
//   } else if (shape.type === "polygon_shape") {
//     const cx = px(shape.x + shape.w / 2),
//       cy = py(shape.y + shape.h / 2);
//     const rx = sc(shape.w / 2),
//       ry = sc(shape.h / 2);
//     const sides = shape.sides || 6;
//     ctx.fillStyle = shape.fill || shape.color + "20";
//     ctx.strokeStyle = shape.color;
//     ctx.lineWidth = 1.5;
//     ctx.beginPath();
//     for (let i = 0; i < sides; i++) {
//       const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
//       const px2 = cx + rx * Math.cos(angle);
//       const py2 = cy + ry * Math.sin(angle);
//       if (i === 0) ctx.moveTo(px2, py2);
//       else ctx.lineTo(px2, py2);
//     }
//     ctx.closePath();
//     ctx.fill();
//     ctx.stroke();
//     if (shape.label) {
//       ctx.fillStyle = shape.color;
//       ctx.font = `${Math.max(9, sc(10))}px system-ui`;
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.fillText(shape.label, cx, cy);
//     }
//   } else if (shape.type === "star_shape") {
//     const cx = px(shape.x + shape.w / 2),
//       cy = py(shape.y + shape.h / 2);
//     const outerR = sc(Math.min(shape.w, shape.h) / 2);
//     const innerR = outerR * 0.4;
//     const points = shape.points || 5;
//     ctx.fillStyle = shape.fill || shape.color + "20";
//     ctx.strokeStyle = shape.color;
//     ctx.lineWidth = 1.5;
//     ctx.beginPath();
//     for (let i = 0; i < points * 2; i++) {
//       const angle = (Math.PI * i) / points - Math.PI / 2;
//       const r = i % 2 === 0 ? outerR : innerR;
//       const px2 = cx + r * Math.cos(angle);
//       const py2 = cy + r * Math.sin(angle);
//       if (i === 0) ctx.moveTo(px2, py2);
//       else ctx.lineTo(px2, py2);
//     }
//     ctx.closePath();
//     ctx.fill();
//     ctx.stroke();
//   } else if (shape.type === "diamond_shape") {
//     const cx = px(shape.x + shape.w / 2),
//       cy = py(shape.y + shape.h / 2);
//     const hw = sc(shape.w / 2),
//       hh = sc(shape.h / 2);
//     ctx.fillStyle = shape.fill || shape.color + "20";
//     ctx.strokeStyle = shape.color;
//     ctx.lineWidth = 1.5;
//     ctx.beginPath();
//     ctx.moveTo(cx, cy - hh);
//     ctx.lineTo(cx + hw, cy);
//     ctx.lineTo(cx, cy + hh);
//     ctx.lineTo(cx - hw, cy);
//     ctx.closePath();
//     ctx.fill();
//     ctx.stroke();
//     if (shape.label) {
//       ctx.fillStyle = shape.color;
//       ctx.font = `${Math.max(9, sc(10))}px system-ui`;
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.fillText(shape.label, cx, cy);
//     }
//   } else if (shape.type === "bubble_shape") {
//     const cx = px(shape.x),
//       cy = py(shape.y);
//     ctx.fillStyle = shape.fill || shape.color + "20";
//     ctx.strokeStyle = shape.color;
//     ctx.lineWidth = 2;
//     ctx.beginPath();
//     ctx.ellipse(cx, cy, sc(shape.rx), sc(shape.ry), 0, 0, Math.PI * 2);
//     ctx.fill();
//     ctx.stroke();
//     if (shape.label) {
//       ctx.fillStyle = shape.color;
//       ctx.font = `bold ${Math.max(9, sc(10))}px system-ui`;
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.fillText(shape.label, cx, cy);
//     }
//   } else if (shape.type === "class_shape") {
//     const x = px(shape.x),
//       y = py(shape.y),
//       w = sc(shape.w),
//       h = sc(shape.h);
//     ctx.fillStyle = isDark ? "#1e293b" : "#fff";
//     ctx.strokeStyle = shape.color;
//     ctx.lineWidth = 1.5;
//     ctx.beginPath();
//     if (ctx.roundRect) ctx.roundRect(x, y, w, h, sc(3));
//     else ctx.rect(x, y, w, h);
//     ctx.fill();
//     ctx.stroke();
//     ctx.fillStyle = shape.color + "25";
//     ctx.beginPath();
//     if (ctx.roundRect) ctx.roundRect(x, y, w, sc(24), [sc(3), sc(3), 0, 0]);
//     else ctx.rect(x, y, w, sc(24));
//     ctx.fill();
//     ctx.fillStyle = shape.color;
//     ctx.font = `bold ${Math.max(9, sc(11))}px system-ui`;
//     ctx.textAlign = "center";
//     ctx.fillText(shape.label, x + w / 2, y + sc(15));
//     ctx.strokeStyle = shape.color + "60";
//     ctx.lineWidth = 1;
//     ctx.beginPath();
//     ctx.moveTo(x, y + sc(24));
//     ctx.lineTo(x + w, y + sc(24));
//     ctx.stroke();
//     ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
//     ctx.font = `${Math.max(8, sc(9))}px system-ui`;
//     ctx.textAlign = "left";
//     (shape.attrs || []).forEach((a, i) =>
//       ctx.fillText(a, x + sc(6), y + sc(36) + i * sc(14)),
//     );
//     const mdY = y + sc(24) + sc((shape.attrs || []).length * 14) + sc(4);
//     if ((shape.methods || []).length > 0) {
//       ctx.strokeStyle = shape.color + "60";
//       ctx.beginPath();
//       ctx.moveTo(x, mdY);
//       ctx.lineTo(x + w, mdY);
//       ctx.stroke();
//       ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
//       (shape.methods || []).forEach((m, i) =>
//         ctx.fillText(m, x + sc(6), mdY + sc(12) + i * sc(14)),
//       );
//     }
//   } else if (shape.type === "er_entity") {
//     const x = px(shape.x),
//       y = py(shape.y),
//       w = sc(shape.w),
//       h = sc(shape.h);
//     ctx.fillStyle = isDark ? "#1e293b" : "#fff";
//     ctx.strokeStyle = shape.color;
//     ctx.lineWidth = 1.5;
//     ctx.beginPath();
//     if (ctx.roundRect) ctx.roundRect(x, y, w, h, sc(3));
//     else ctx.rect(x, y, w, h);
//     ctx.fill();
//     ctx.stroke();
//     ctx.fillStyle = shape.color + "25";
//     ctx.beginPath();
//     if (ctx.roundRect) ctx.roundRect(x, y, w, sc(20), [sc(3), sc(3), 0, 0]);
//     else ctx.rect(x, y, w, sc(20));
//     ctx.fill();
//     ctx.fillStyle = shape.color;
//     ctx.font = `bold ${Math.max(9, sc(11))}px system-ui`;
//     ctx.textAlign = "center";
//     ctx.fillText(shape.label, x + w / 2, y + sc(13));
//     ctx.strokeStyle = shape.color + "60";
//     ctx.lineWidth = 1;
//     ctx.beginPath();
//     ctx.moveTo(x, y + sc(20));
//     ctx.lineTo(x + w, y + sc(20));
//     ctx.stroke();
//     ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
//     ctx.font = `${Math.max(8, sc(9))}px system-ui`;
//     ctx.textAlign = "left";
//     (shape.attrs || []).forEach((a, i) =>
//       ctx.fillText(a, x + sc(6), y + sc(32) + i * sc(13)),
//     );
//   } else if (shape.type === "er_relation") {
//     const cx = px(shape.x + shape.w / 2),
//       cy = py(shape.y + shape.h / 2);
//     const hw = sc(shape.w / 2),
//       hh = sc(shape.h / 2);
//     ctx.fillStyle = shape.color + "20";
//     ctx.strokeStyle = shape.color;
//     ctx.lineWidth = 1.5;
//     ctx.beginPath();
//     ctx.moveTo(cx, cy - hh);
//     ctx.lineTo(cx + hw, cy);
//     ctx.lineTo(cx, cy + hh);
//     ctx.lineTo(cx - hw, cy);
//     ctx.closePath();
//     ctx.fill();
//     ctx.stroke();
//     ctx.fillStyle = shape.color;
//     ctx.font = `${Math.max(9, sc(10))}px system-ui`;
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";
//     ctx.fillText(shape.label, cx, cy);
//   } else if (shape.type === "arrow_conn" || shape.type === "line_conn") {
//     ctx.strokeStyle = shape.color || "#64748b";
//     ctx.lineWidth = 1.5;
//     if (shape.style === "dashed") ctx.setLineDash([sc(5), sc(3)]);
//     ctx.beginPath();
//     ctx.moveTo(px(shape.x1), py(shape.y1));
//     ctx.lineTo(px(shape.x2), py(shape.y2));
//     ctx.stroke();
//     ctx.setLineDash([]);
//     if (shape.type === "arrow_conn") {
//       const angle = Math.atan2(
//         py(shape.y2) - py(shape.y1),
//         px(shape.x2) - px(shape.x1),
//       );
//       const aLen = sc(8);
//       ctx.fillStyle = shape.color || "#64748b";
//       ctx.beginPath();
//       ctx.moveTo(px(shape.x2), py(shape.y2));
//       ctx.lineTo(
//         px(shape.x2) - aLen * Math.cos(angle - 0.4),
//         py(shape.y2) - aLen * Math.sin(angle - 0.4),
//       );
//       ctx.lineTo(
//         px(shape.x2) - aLen * Math.cos(angle + 0.4),
//         py(shape.y2) - aLen * Math.sin(angle + 0.4),
//       );
//       ctx.closePath();
//       ctx.fill();
//     }
//     if (shape.label) {
//       const mx = (px(shape.x1) + px(shape.x2)) / 2;
//       const my = (py(shape.y1) + py(shape.y2)) / 2;
//       ctx.fillStyle = shape.color || "#64748b";
//       ctx.font = `${Math.max(8, sc(9))}px system-ui`;
//       ctx.textAlign = "center";
//       ctx.fillText(shape.label, mx, my - sc(4));
//     }
//   }

//   if (isSelected) {
//     const bounds = getShapeBounds(shape);
//     const sx = bounds.x * zoom + panOffset.x;
//     const sy = bounds.y * zoom + panOffset.y;
//     const sw = bounds.w * zoom;
//     const sh = bounds.h * zoom;
//     ctx.strokeStyle = "#3b82f6";
//     ctx.lineWidth = 1.5;
//     ctx.setLineDash([4, 3]);
//     ctx.strokeRect(sx - 6, sy - 6, sw + 12, sh + 12);
//     ctx.setLineDash([]);
//     const handles = getResizeHandles(bounds, zoom, panOffset);
//     handles.forEach(({ x: hx, y: hy }) => {
//       ctx.fillStyle = "#ffffff";
//       ctx.strokeStyle = "#3b82f6";
//       ctx.lineWidth = 1.5;
//       ctx.fillRect(
//         hx - HANDLE_SIZE / 2,
//         hy - HANDLE_SIZE / 2,
//         HANDLE_SIZE,
//         HANDLE_SIZE,
//       );
//       ctx.strokeRect(
//         hx - HANDLE_SIZE / 2,
//         hy - HANDLE_SIZE / 2,
//         HANDLE_SIZE,
//         HANDLE_SIZE,
//       );
//     });
//   }

//   ctx.restore();
// }

// // ── HIT DETECTION ─────────────────────────────────────────────────────────────
// function getShapeBounds(shape) {
//   if (shape.type === "bubble_shape") {
//     return {
//       x: shape.x - shape.rx,
//       y: shape.y - shape.ry,
//       w: shape.rx * 2,
//       h: shape.ry * 2,
//     };
//   }
//   if (shape.type === "arrow_conn" || shape.type === "line_conn") {
//     const minX = Math.min(shape.x1, shape.x2),
//       maxX = Math.max(shape.x1, shape.x2);
//     const minY = Math.min(shape.y1, shape.y2),
//       maxY = Math.max(shape.y1, shape.y2);
//     return { x: minX, y: minY, w: maxX - minX || 1, h: maxY - minY || 1 };
//   }
//   return { x: shape.x, y: shape.y, w: shape.w || 100, h: shape.h || 50 };
// }

// function getResizeHandles(bounds, zoom, panOffset) {
//   const { x, y, w, h } = bounds;
//   const sx = x * zoom + panOffset.x;
//   const sy = y * zoom + panOffset.y;
//   const sw = w * zoom;
//   const sh = h * zoom;
//   const ox = -6,
//     oy = -6;
//   return [
//     { id: "nw", x: sx + ox, y: sy + oy },
//     { id: "n", x: sx + ox + (sw + 12) / 2, y: sy + oy },
//     { id: "ne", x: sx + ox + sw + 12, y: sy + oy },
//     { id: "e", x: sx + ox + sw + 12, y: sy + oy + (sh + 12) / 2 },
//     { id: "se", x: sx + ox + sw + 12, y: sy + oy + sh + 12 },
//     { id: "s", x: sx + ox + (sw + 12) / 2, y: sy + oy + sh + 12 },
//     { id: "sw", x: sx + ox, y: sy + oy + sh + 12 },
//     { id: "w", x: sx + ox, y: sy + oy + (sh + 12) / 2 },
//   ];
// }

// function getWorldCoords(clientX, clientY, canvas, zoom, panOffset) {
//   const rect = canvas.getBoundingClientRect();
//   return {
//     x: (clientX - rect.left - panOffset.x) / zoom,
//     y: (clientY - rect.top - panOffset.y) / zoom,
//   };
// }

// function isPointInShape(point, shape) {
//   const b = getShapeBounds(shape);
//   if (shape.type === "bubble_shape") {
//     const dx = (point.x - shape.x) / shape.rx;
//     const dy = (point.y - shape.y) / shape.ry;
//     return dx * dx + dy * dy <= 1;
//   }
//   if (shape.type === "arrow_conn" || shape.type === "line_conn") {
//     const dx = shape.x2 - shape.x1,
//       dy = shape.y2 - shape.y1;
//     const len2 = dx * dx + dy * dy;
//     if (len2 === 0)
//       return Math.hypot(point.x - shape.x1, point.y - shape.y1) < 10;
//     let t = ((point.x - shape.x1) * dx + (point.y - shape.y1) * dy) / len2;
//     t = Math.max(0, Math.min(1, t));
//     const nearX = shape.x1 + t * dx,
//       nearY = shape.y1 + t * dy;
//     return Math.hypot(point.x - nearX, point.y - nearY) < 10;
//   }
//   return (
//     point.x >= b.x &&
//     point.x <= b.x + b.w &&
//     point.y >= b.y &&
//     point.y <= b.y + b.h
//   );
// }

// function getResizeHandleAtPoint(screenX, screenY, shape, zoom, panOffset) {
//   const bounds = getShapeBounds(shape);
//   const handles = getResizeHandles(bounds, zoom, panOffset);
//   for (const h of handles) {
//     if (
//       Math.abs(screenX - h.x) <= HANDLE_SIZE &&
//       Math.abs(screenY - h.y) <= HANDLE_SIZE
//     ) {
//       return h.id;
//     }
//   }
//   return null;
// }

// function findShapeAtPoint(point, shapes) {
//   for (let i = shapes.length - 1; i >= 0; i--) {
//     if (isPointInShape(point, shapes[i])) return shapes[i];
//   }
//   return null;
// }

// function applyResize(original, handleId, dx, dy) {
//   const s = { ...original };
//   if (s.type === "arrow_conn" || s.type === "line_conn") {
//     s.x2 = original.x2 + dx;
//     s.y2 = original.y2 + dy;
//     return s;
//   }
//   if (s.type === "bubble_shape") {
//     s.rx = Math.max(
//       10,
//       original.rx +
//         (handleId.includes("e") ? dx : handleId.includes("w") ? -dx : 0),
//     );
//     s.ry = Math.max(
//       10,
//       original.ry +
//         (handleId.includes("s") ? dy : handleId.includes("n") ? -dy : 0),
//     );
//     return s;
//   }
//   const b = { x: original.x, y: original.y, w: original.w, h: original.h };
//   if (handleId.includes("w")) {
//     b.x += dx;
//     b.w = Math.max(20, b.w - dx);
//   }
//   if (handleId.includes("n")) {
//     b.y += dy;
//     b.h = Math.max(20, b.h - dy);
//   }
//   if (handleId.includes("e")) b.w = Math.max(20, b.w + dx);
//   if (handleId.includes("s")) b.h = Math.max(20, b.h + dy);
//   return { ...s, x: b.x, y: b.y, w: b.w, h: b.h };
// }

// // ── BOARD THUMBNAILS ──────────────────────────────────────────────────────────
// function BoardThumbnail({ type, isDark }) {
//   const bg = isDark ? "#1e293b" : "#f8fafc";
//   const thumbnails = {
//     tree: (
//       <svg
//         viewBox="0 0 200 120"
//         style={{ width: "100%", height: "100%", display: "block" }}
//       >
//         <rect width="200" height="120" fill={bg} />
//         <rect
//           x="80"
//           y="10"
//           width="40"
//           height="22"
//           rx="4"
//           fill="#3b82f620"
//           stroke="#3b82f6"
//           strokeWidth="1.5"
//         />
//         <text x="100" y="25" textAnchor="middle" fontSize="9" fill="#3b82f6">
//           Root
//         </text>
//         <line
//           x1="100"
//           y1="32"
//           x2="55"
//           y2="55"
//           stroke="#64748b"
//           strokeWidth="1.2"
//         />
//         <line
//           x1="100"
//           y1="32"
//           x2="145"
//           y2="55"
//           stroke="#64748b"
//           strokeWidth="1.2"
//         />
//         <rect
//           x="35"
//           y="55"
//           width="40"
//           height="20"
//           rx="4"
//           fill="#8b5cf620"
//           stroke="#8b5cf6"
//           strokeWidth="1.5"
//         />
//         <rect
//           x="125"
//           y="55"
//           width="40"
//           height="20"
//           rx="4"
//           fill="#8b5cf620"
//           stroke="#8b5cf6"
//           strokeWidth="1.5"
//         />
//         <text x="55" y="68" textAnchor="middle" fontSize="8" fill="#8b5cf6">
//           Left
//         </text>
//         <text x="145" y="68" textAnchor="middle" fontSize="8" fill="#8b5cf6">
//           Right
//         </text>
//       </svg>
//     ),
//     arch: (
//       <svg
//         viewBox="0 0 200 120"
//         style={{ width: "100%", height: "100%", display: "block" }}
//       >
//         <rect width="200" height="120" fill={bg} />
//         <rect
//           x="10"
//           y="10"
//           width="180"
//           height="20"
//           rx="4"
//           fill="#06b6d420"
//           stroke="#06b6d4"
//           strokeWidth="1.5"
//         />
//         <text x="100" y="24" textAnchor="middle" fontSize="9" fill="#06b6d4">
//           API Gateway
//         </text>
//         {[10, 75, 145].map((x, i) => (
//           <g key={i}>
//             <line
//               x1={x + 22}
//               y1="30"
//               x2={x + 22}
//               y2="50"
//               stroke="#64748b"
//               strokeWidth="1"
//             />
//             <rect
//               x={x}
//               y="50"
//               width="45"
//               height="20"
//               rx="3"
//               fill="#3b82f620"
//               stroke="#3b82f6"
//               strokeWidth="1"
//             />
//             <text
//               x={x + 22}
//               y="63"
//               textAnchor="middle"
//               fontSize="7"
//               fill="#3b82f6"
//             >
//               Svc {i + 1}
//             </text>
//           </g>
//         ))}
//       </svg>
//     ),
//     uml: (
//       <svg
//         viewBox="0 0 200 120"
//         style={{ width: "100%", height: "100%", display: "block" }}
//       >
//         <rect width="200" height="120" fill={bg} />
//         <rect
//           x="10"
//           y="10"
//           width="80"
//           height="90"
//           rx="3"
//           fill={isDark ? "#1e293b" : "#fff"}
//           stroke="#8b5cf6"
//           strokeWidth="1.5"
//         />
//         <rect x="10" y="10" width="80" height="20" rx="3" fill="#8b5cf620" />
//         <text
//           x="50"
//           y="24"
//           textAnchor="middle"
//           fontSize="9"
//           fill="#8b5cf6"
//           fontWeight="bold"
//         >
//           User
//         </text>
//         <line
//           x1="10"
//           y1="30"
//           x2="90"
//           y2="30"
//           stroke="#8b5cf6"
//           strokeWidth="1"
//         />
//         <text x="15" y="45" fontSize="7" fill={isDark ? "#94a3b8" : "#475569"}>
//           - id: int
//         </text>
//         <text x="15" y="57" fontSize="7" fill={isDark ? "#94a3b8" : "#475569"}>
//           - name: str
//         </text>
//         <line
//           x1="10"
//           y1="66"
//           x2="90"
//           y2="66"
//           stroke="#8b5cf6"
//           strokeWidth="1"
//         />
//         <text x="15" y="80" fontSize="7" fill={isDark ? "#94a3b8" : "#475569"}>
//           + login()
//         </text>
//         <line
//           x1="90"
//           y1="55"
//           x2="115"
//           y2="55"
//           stroke="#64748b"
//           strokeWidth="1"
//         />
//         <rect
//           x="115"
//           y="25"
//           width="70"
//           height="65"
//           rx="3"
//           fill={isDark ? "#1e293b" : "#fff"}
//           stroke="#3b82f6"
//           strokeWidth="1.5"
//         />
//         <rect x="115" y="25" width="70" height="20" rx="3" fill="#3b82f620" />
//         <text
//           x="150"
//           y="38"
//           textAnchor="middle"
//           fontSize="9"
//           fill="#3b82f6"
//           fontWeight="bold"
//         >
//           Course
//         </text>
//       </svg>
//     ),
//     flow: (
//       <svg
//         viewBox="0 0 200 120"
//         style={{ width: "100%", height: "100%", display: "block" }}
//       >
//         <rect width="200" height="120" fill={bg} />
//         <rect
//           x="70"
//           y="8"
//           width="60"
//           height="22"
//           rx="4"
//           fill="#3b82f620"
//           stroke="#3b82f6"
//           strokeWidth="1.5"
//         />
//         <text x="100" y="22" textAnchor="middle" fontSize="8" fill="#3b82f6">
//           Start
//         </text>
//         <line
//           x1="100"
//           y1="30"
//           x2="100"
//           y2="42"
//           stroke="#64748b"
//           strokeWidth="1"
//         />
//         <polygon
//           points="100,42 80,62 100,72 120,62"
//           fill="#10b98120"
//           stroke="#10b981"
//           strokeWidth="1.5"
//         />
//         <text x="100" y="62" textAnchor="middle" fontSize="7" fill="#10b981">
//           Decision?
//         </text>
//         <line
//           x1="100"
//           y1="72"
//           x2="100"
//           y2="85"
//           stroke="#64748b"
//           strokeWidth="1"
//         />
//         <rect
//           x="65"
//           y="85"
//           width="70"
//           height="22"
//           rx="4"
//           fill="#f59e0b20"
//           stroke="#f59e0b"
//           strokeWidth="1.5"
//         />
//         <text x="100" y="99" textAnchor="middle" fontSize="8" fill="#f59e0b">
//           Process
//         </text>
//       </svg>
//     ),
//     mind: (
//       <svg
//         viewBox="0 0 200 120"
//         style={{ width: "100%", height: "100%", display: "block" }}
//       >
//         <rect width="200" height="120" fill={bg} />
//         <ellipse
//           cx="100"
//           cy="60"
//           rx="28"
//           ry="18"
//           fill="#8b5cf620"
//           stroke="#8b5cf6"
//           strokeWidth="2"
//         />
//         <text x="100" y="64" textAnchor="middle" fontSize="8" fill="#8b5cf6">
//           React
//         </text>
//         {[
//           ["Hooks", 25, 30, "#3b82f6"],
//           ["State", 25, 90, "#10b981"],
//           ["Props", 155, 30, "#f59e0b"],
//           ["Context", 155, 90, "#ef4444"],
//         ].map(([label, x, y, color], i) => (
//           <g key={i}>
//             <line
//               x1="100"
//               y1="60"
//               x2={x + 20}
//               y2={y}
//               stroke={color + "80"}
//               strokeWidth="1.2"
//             />
//             <rect
//               x={x}
//               y={y - 10}
//               width="40"
//               height="18"
//               rx="9"
//               fill={color + "20"}
//               stroke={color}
//               strokeWidth="1.2"
//             />
//             <text
//               x={x + 20}
//               y={y + 4}
//               textAnchor="middle"
//               fontSize="7"
//               fill={color}
//             >
//               {label}
//             </text>
//           </g>
//         ))}
//       </svg>
//     ),
//     er: (
//       <svg
//         viewBox="0 0 200 120"
//         style={{ width: "100%", height: "100%", display: "block" }}
//       >
//         <rect width="200" height="120" fill={bg} />
//         <rect
//           x="10"
//           y="15"
//           width="60"
//           height="90"
//           rx="3"
//           fill={isDark ? "#1e293b" : "#fff"}
//           stroke="#06b6d4"
//           strokeWidth="1.5"
//         />
//         <rect x="10" y="15" width="60" height="16" rx="3" fill="#06b6d420" />
//         <text
//           x="40"
//           y="27"
//           textAnchor="middle"
//           fontSize="8"
//           fill="#06b6d4"
//           fontWeight="bold"
//         >
//           Student
//         </text>
//         {["PK id", "name", "email"].map((t, i) => (
//           <text
//             key={i}
//             x="14"
//             y={42 + i * 13}
//             fontSize="7"
//             fill={isDark ? "#94a3b8" : "#475569"}
//           >
//             {t}
//           </text>
//         ))}
//         <line
//           x1="70"
//           y1="60"
//           x2="95"
//           y2="60"
//           stroke="#64748b"
//           strokeWidth="1.2"
//         />
//         <rect
//           x="95"
//           y="15"
//           width="60"
//           height="90"
//           rx="3"
//           fill={isDark ? "#1e293b" : "#fff"}
//           stroke="#3b82f6"
//           strokeWidth="1.5"
//         />
//         <rect x="95" y="15" width="60" height="16" rx="3" fill="#3b82f620" />
//         <text
//           x="125"
//           y="27"
//           textAnchor="middle"
//           fontSize="8"
//           fill="#3b82f6"
//           fontWeight="bold"
//         >
//           Course
//         </text>
//       </svg>
//     ),
//   };
//   return thumbnails[type] || thumbnails["flow"];
// }

// // ── CANVAS WHITEBOARD ─────────────────────────────────────────────────────────
// function CanvasWhiteboard({
//   sessionId,
//   stompClient,
//   connected,
//   isDark,
//   userName,
//   userRole,
//   initialShapes = [],
//   whiteboardId,
//   whiteboardTitle,
//   selectedProject,
//   onSaveStatusChange,
// }) {
//   const canvasRef = useRef(null);
//   const canvasContainerRef = useRef(null);
//   const lastPos = useRef(null);
//   const pathsRef = useRef([]);
//   const templateShapesRef = useRef([]);
//   const currentDrawingPathRef = useRef(null);

//   const [activeTool, setActiveTool] = useState("pen");
//   const [shapesOpen, setShapesOpen] = useState(false);
//   const [color, setColor] = useState("#3b82f6");
//   const [strokeWidth, setStroke] = useState(3);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [isPanning, setIsPanning] = useState(false);
//   const [paths, _setPaths] = useState([]);
//   const [templateShapes, _setTemplateShapes] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [redoStack, setRedoStack] = useState([]);
//   const [shapeSearch, setShapeSearch] = useState("");
//   const [activeShapeCat, setActiveShapeCat] = useState("Basic Shapes");
//   const [showPages, setShowPages] = useState(false);
//   const [pages, setPages] = useState([{ id: 1, name: "Page 1", active: true }]);
//   const [showHistory, setShowHistory] = useState(false);

//   // ── Save state ──
//   const [saveStatus, setSaveStatus] = useState("saved");
//   const [lastSavedAt, setLastSavedAt] = useState(null);
//   const [toast, setToast] = useState(null);

//   const [selectedShapeId, setSelectedShapeId] = useState(null);
//   const dragModeRef = useRef(null);
//   const resizeHandleRef = useRef(null);
//   const dragStartRef = useRef(null);
//   const originalShapeRef = useRef(null);
//   const uiInteractingRef = useRef(false);

//   const zoomRef = useRef(1);
//   const panOffsetRef = useRef({ x: 0, y: 0 });
//   const [zoom, _setZoom] = useState(1);
//   const [panOffset, _setPanOffset] = useState({ x: 0, y: 0 });

//   const isLoadingRef = useRef(false);

//   function showToast(message, type = "success") {
//     setToast({ message, type });
//     window.clearTimeout(showToast._timer);
//     showToast._timer = window.setTimeout(() => setToast(null), 2500);
//   }

//   const setPaths = useCallback((updater) => {
//     _setPaths((prev) => {
//       const next = typeof updater === "function" ? updater(prev) : updater;
//       pathsRef.current = next;
//       return next;
//     });
//   }, []);

//   const setTemplateShapes = useCallback((updater) => {
//     _setTemplateShapes((prev) => {
//       const next = typeof updater === "function" ? updater(prev) : updater;
//       templateShapesRef.current = next;
//       return next;
//     });
//   }, []);

//   const setZoom = useCallback((updater) => {
//     _setZoom((prev) => {
//       const next = typeof updater === "function" ? updater(prev) : updater;
//       zoomRef.current = next;
//       return next;
//     });
//   }, []);

//   const setPanOffset = useCallback((updater) => {
//     _setPanOffset((prev) => {
//       const next = typeof updater === "function" ? updater(prev) : updater;
//       panOffsetRef.current = next;
//       return next;
//     });
//   }, []);

//   useEffect(() => {
//     const shapes = Array.isArray(initialShapes) ? initialShapes : [];
//     const withIds = shapes.map((s) =>
//       s.id
//         ? s
//         : {
//             ...s,
//             id: makeShapeId(),
//             selected: false,
//             rotation: 0,
//             locked: false,
//           },
//     );
//     setTemplateShapes(withIds);
//   }, [initialShapes]);

//   const COLORS = [
//     "#000000",
//     "#ffffff",
//     "#ef4444",
//     "#f97316",
//     "#22c55e",
//     "#3b82f6",
//     "#8b5cf6",
//     "#ec4899",
//     "#06b6d4",
//     "#84cc16",
//     "#fbbf24",
//     "#64748b",
//   ];
//   const STROKE_SIZES = [1, 2, 3, 5, 8, 12];

//   const LEFT_TOOLS = [
//     { id: "select", icon: MousePointer, label: "Select" },
//     { id: "hand", icon: Hand, label: "Pan" },
//     { id: "pen", icon: Pen, label: "Pen" },
//     { id: "pencil", icon: Pencil, label: "Pencil" },
//     { id: "highlighter", icon: Highlighter, label: "Highlighter" },
//     { id: "eraser", icon: Eraser, label: "Eraser" },
//     { id: "arrow", icon: ArrowRight, label: "Arrow" },
//     { id: "connector", icon: ArrowUpRight, label: "Connector" },
//     { id: "sticky", icon: StickyNote, label: "Sticky Note" },
//     { id: "text", icon: Type, label: "Text" },
//     { id: "frame", icon: Frame, label: "Frame" },
//     { id: "comment", icon: MessageSquare, label: "Comment" },
//     { id: "laser", icon: Navigation, label: "Laser Pointer" },
//     { id: "image", icon: Image, label: "Upload Image" },
//   ];

//   const selectedShapeIdRef = useRef(null);

//   // ── HIGH DPI RESIZE ───────────────────────────────────────────────────────
//   const resizeCanvas = useCallback(() => {
//     const canvas = canvasRef.current;
//     const container = canvasContainerRef.current || canvas?.parentElement;
//     if (!canvas || !container) return;
//     const rect = container.getBoundingClientRect();
//     const dpr = window.devicePixelRatio || 1;
//     canvas.width = Math.floor(rect.width * dpr);
//     canvas.height = Math.floor(rect.height * dpr);
//     canvas.style.width = `${rect.width}px`;
//     canvas.style.height = `${rect.height}px`;
//     const ctx = canvas.getContext("2d");
//     ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
//   }, []);

//   // ── REDRAW ────────────────────────────────────────────────────────────────
//   const redraw = useCallback(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     const z = zoomRef.current;
//     const pan = panOffsetRef.current;
//     const allPaths = pathsRef.current;
//     const tShapes = templateShapesRef.current;
//     const W = canvas.clientWidth;
//     const H = canvas.clientHeight;

//     ctx.clearRect(0, 0, W, H);
//     ctx.fillStyle = isDark ? "#0f172a" : "#ffffff";
//     ctx.fillRect(0, 0, W, H);

//     ctx.strokeStyle = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)";
//     ctx.lineWidth = 1;
//     const gridSize = 24 * z;
//     for (let x = pan.x % gridSize; x < W; x += gridSize) {
//       ctx.beginPath();
//       ctx.moveTo(x, 0);
//       ctx.lineTo(x, H);
//       ctx.stroke();
//     }
//     for (let y = pan.y % gridSize; y < H; y += gridSize) {
//       ctx.beginPath();
//       ctx.moveTo(0, y);
//       ctx.lineTo(W, y);
//       ctx.stroke();
//     }

//     tShapes.forEach((shape) => {
//       drawShapeOnCanvas(
//         ctx,
//         shape,
//         z,
//         pan,
//         isDark,
//         shape.id === selectedShapeIdRef.current,
//       );
//     });

//     // Draw saved paths with smooth curves
//     allPaths.forEach((path) => {
//       if (!path.points || path.points.length === 0) return;
//       drawSmoothPath(ctx, path.points, {
//         color: path.color || "#000",
//         width: path.width || 3,
//         zoom: z,
//         panOffset: pan,
//         tool: path.tool || "pen",
//       });
//     });

//     // Draw live path in progress
//     const livePath = currentDrawingPathRef.current;
//     if (livePath && livePath.points && livePath.points.length > 0) {
//       drawSmoothPath(ctx, livePath.points, {
//         color: livePath.color || "#000",
//         width: livePath.width || 3,
//         zoom: z,
//         panOffset: pan,
//         tool: livePath.tool || "pen",
//       });
//     }
//   }, [isDark]);

//   useEffect(() => {
//     selectedShapeIdRef.current = selectedShapeId;
//     redraw();
//   }, [selectedShapeId, redraw]);

//   useEffect(() => {
//     redraw();
//   }, [paths, templateShapes, zoom, panOffset, redraw]);

//   useEffect(() => {
//     resizeCanvas();
//     redraw();
//   }, [resizeCanvas, redraw]);

//   useEffect(() => {
//     const handleResize = () => {
//       resizeCanvas();
//       redraw();
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [resizeCanvas, redraw]);

//   // ── STOMP SUBSCRIPTION ────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!stompClient || !connected || !sessionId) return;
//     const sub = stompClient.subscribe(
//       `/topic/whiteboard/${sessionId}`,
//       (msg) => {
//         try {
//           const event = JSON.parse(msg.body);
//           if (event.userId === userName) return;
//           if (event.eventType === "CLEAR") {
//             setPaths([]);
//             setTemplateShapes([]);
//             setHistory([]);
//             return;
//           }
//           if (event.eventType === "FULL_STATE" && event.elements) {
//             const parsed = parseWhiteboardElements(event.elements);
//             setPaths(parsed.paths || []);
//             setTemplateShapes(parsed.templateShapes || []);
//             return;
//           }
//           if (event.eventType === "DRAW" && event.elements) {
//             setPaths((prev) => [...prev, JSON.parse(event.elements)]);
//           }
//         } catch (e) {
//           console.error("WB parse error", e);
//         }
//       },
//     );
//     return () => sub.unsubscribe();
//   }, [stompClient, connected, sessionId, userName]);

//   // ── LOAD FROM SERVER / LOCALSTORAGE ───────────────────────────────────────
//   useEffect(() => {
//     if (!sessionId && !whiteboardId) return;
//     isLoadingRef.current = true;

//     // Try localStorage first
//     const localKey = `whiteboard:${whiteboardId || sessionId}`;
//     const localRaw = localStorage.getItem(localKey);
//     if (localRaw) {
//       try {
//         const localData = JSON.parse(localRaw);
//         const parsed = parseWhiteboardElements(localData.elements || localData);
//         if (parsed.paths?.length || parsed.templateShapes?.length) {
//           setPaths(parsed.paths || []);
//           if (parsed.templateShapes?.length)
//             setTemplateShapes(parsed.templateShapes);
//           if (parsed.zoom) setZoom(parsed.zoom);
//           if (parsed.panOffset) setPanOffset(parsed.panOffset);
//           isLoadingRef.current = false;
//           return;
//         }
//       } catch {}
//     }

//     if (sessionId) {
//       getWhiteboardState(sessionId)
//         .then((res) => {
//           if (res.data?.elements) {
//             const parsed = parseWhiteboardElements(res.data.elements);
//             setPaths(parsed.paths || []);
//             if (parsed.templateShapes?.length)
//               setTemplateShapes(parsed.templateShapes);
//             if (parsed.zoom) setZoom(parsed.zoom);
//             if (parsed.panOffset) setPanOffset(parsed.panOffset);
//           }
//         })
//         .catch(() => {})
//         .finally(() => {
//           isLoadingRef.current = false;
//         });
//     } else {
//       isLoadingRef.current = false;
//     }
//   }, [sessionId, whiteboardId]);

//   // ── MARK DIRTY ON CHANGES ─────────────────────────────────────────────────
//   useEffect(() => {
//     if (!isLoadingRef.current) {
//       setSaveStatus("dirty");
//       if (onSaveStatusChange) onSaveStatusChange("dirty");
//     }
//   }, [paths, templateShapes]);

//   // ── PUBLISH STOMP ─────────────────────────────────────────────────────────
//   const publishPath = useCallback(
//     (path) => {
//       if (!stompClient || !connected) return;
//       stompClient.publish({
//         destination: `/app/whiteboard/${sessionId}`,
//         body: JSON.stringify({
//           eventType: "DRAW",
//           elements: JSON.stringify(path),
//           userId: userName,
//           userName,
//           userRole,
//         }),
//       });
//     },
//     [stompClient, connected, sessionId, userName, userRole],
//   );

//   // ── MANUAL SAVE ───────────────────────────────────────────────────────────
//   const handleManualSave = useCallback(async () => {
//     setSaveStatus("saving");
//     if (onSaveStatusChange) onSaveStatusChange("saving");
//     try {
//       const payload = {
//         title: whiteboardTitle || "Untitled",
//         project: selectedProject || null,
//         updatedAt: new Date().toISOString(),
//         paths: pathsRef.current,
//         templateShapes: templateShapesRef.current,
//         zoom: zoomRef.current,
//         panOffset: panOffsetRef.current,
//       };
//       const elementsJson = JSON.stringify({
//         paths: payload.paths,
//         templateShapes: payload.templateShapes,
//         zoom: payload.zoom,
//         panOffset: payload.panOffset,
//       });

//       // Save to service if sessionId available
//       if (sessionId) {
//         await saveWhiteboardSnapshot(sessionId, {
//           eventType: "FULL_STATE",
//           elements: elementsJson,
//           userId: userName,
//           userRole,
//           title: payload.title,
//           project: payload.project,
//         });
//       }

//       // Always localStorage fallback
//       const localKey = `whiteboard:${whiteboardId || sessionId || "default"}`;
//       localStorage.setItem(
//         localKey,
//         JSON.stringify({ ...payload, elements: elementsJson }),
//       );

//       setSaveStatus("saved");
//       setLastSavedAt(new Date());
//       if (onSaveStatusChange) onSaveStatusChange("saved");
//       showToast("Whiteboard saved");
//     } catch (error) {
//       console.error("Save failed:", error);
//       // Try localStorage only
//       try {
//         const payload = {
//           paths: pathsRef.current,
//           templateShapes: templateShapesRef.current,
//           zoom: zoomRef.current,
//           panOffset: panOffsetRef.current,
//         };
//         const localKey = `whiteboard:${whiteboardId || sessionId || "default"}`;
//         localStorage.setItem(localKey, JSON.stringify(payload));
//         setSaveStatus("saved");
//         setLastSavedAt(new Date());
//         if (onSaveStatusChange) onSaveStatusChange("saved");
//         showToast("Saved locally");
//       } catch {
//         setSaveStatus("error");
//         if (onSaveStatusChange) onSaveStatusChange("error");
//         showToast("Save failed. Please try again.", "error");
//       }
//     }
//   }, [
//     sessionId,
//     whiteboardId,
//     whiteboardTitle,
//     selectedProject,
//     userName,
//     userRole,
//     onSaveStatusChange,
//   ]);

//   // ── POINTER EVENTS ────────────────────────────────────────────────────────
//   const getClientCoords = (e) => {
//     if (e.touches && e.touches.length > 0)
//       return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
//     return { clientX: e.clientX, clientY: e.clientY };
//   };

//   const onPointerDown = useCallback(
//     (e) => {
//       if (uiInteractingRef.current) return;
//       const canvas = canvasRef.current;
//       if (!canvas) return;
//       if (e.pointerId !== undefined) {
//         try {
//           canvas.setPointerCapture(e.pointerId);
//         } catch {}
//       }
//       const { clientX, clientY } = getClientCoords(e);
//       const world = getWorldCoords(
//         clientX,
//         clientY,
//         canvas,
//         zoomRef.current,
//         panOffsetRef.current,
//       );

//       if (activeTool === "select") {
//         const shapes = templateShapesRef.current;
//         if (selectedShapeIdRef.current) {
//           const selShape = shapes.find(
//             (s) => s.id === selectedShapeIdRef.current,
//           );
//           if (selShape) {
//             const rect = canvas.getBoundingClientRect();
//             const screenX = clientX - rect.left;
//             const screenY = clientY - rect.top;
//             const handle = getResizeHandleAtPoint(
//               screenX,
//               screenY,
//               selShape,
//               zoomRef.current,
//               panOffsetRef.current,
//             );
//             if (handle) {
//               dragModeRef.current = "resize";
//               resizeHandleRef.current = handle;
//               dragStartRef.current = {
//                 worldX: world.x,
//                 worldY: world.y,
//                 screenX,
//                 screenY,
//               };
//               originalShapeRef.current = { ...selShape };
//               e.preventDefault();
//               return;
//             }
//           }
//         }
//         const hit = findShapeAtPoint(world, shapes);
//         if (hit) {
//           setSelectedShapeId(hit.id);
//           dragModeRef.current = "move";
//           dragStartRef.current = { worldX: world.x, worldY: world.y };
//           originalShapeRef.current = { ...hit };
//           e.preventDefault();
//         } else {
//           setSelectedShapeId(null);
//           dragModeRef.current = null;
//         }
//         return;
//       }

//       if (activeTool === "hand") {
//         setIsPanning(true);
//         lastPos.current = { x: clientX, y: clientY };
//         e.preventDefault();
//         return;
//       }

//       if (
//         [
//           "sticky",
//           "text",
//           "frame",
//           "comment",
//           "laser",
//           "image",
//           "arrow",
//           "connector",
//         ].includes(activeTool)
//       )
//         return;

//       if (["pen", "pencil", "highlighter", "eraser"].includes(activeTool)) {
//         e.preventDefault();
//         setIsDrawing(true);
//         const newPath = {
//           points: [world],
//           color,
//           width: strokeWidth,
//           tool: activeTool,
//         };
//         currentDrawingPathRef.current = newPath;
//       }
//     },
//     [activeTool, color, strokeWidth],
//   );

//   const onPointerMove = useCallback(
//     (e) => {
//       if (uiInteractingRef.current) return;
//       const canvas = canvasRef.current;
//       if (!canvas) return;
//       const { clientX, clientY } = getClientCoords(e);
//       const world = getWorldCoords(
//         clientX,
//         clientY,
//         canvas,
//         zoomRef.current,
//         panOffsetRef.current,
//       );

//       if (isPanning && activeTool === "hand") {
//         const dx = clientX - lastPos.current.x;
//         const dy = clientY - lastPos.current.y;
//         setPanOffset((p) => ({ x: p.x + dx, y: p.y + dy }));
//         lastPos.current = { x: clientX, y: clientY };
//         return;
//       }

//       if (
//         activeTool === "select" &&
//         dragModeRef.current === "move" &&
//         dragStartRef.current &&
//         originalShapeRef.current
//       ) {
//         const orig = originalShapeRef.current;
//         const ddx = world.x - dragStartRef.current.worldX;
//         const ddy = world.y - dragStartRef.current.worldY;
//         setTemplateShapes((prev) =>
//           prev.map((s) => {
//             if (s.id !== orig.id) return s;
//             if (s.type === "arrow_conn" || s.type === "line_conn") {
//               return {
//                 ...s,
//                 x1: orig.x1 + ddx,
//                 y1: orig.y1 + ddy,
//                 x2: orig.x2 + ddx,
//                 y2: orig.y2 + ddy,
//               };
//             }
//             return { ...s, x: orig.x + ddx, y: orig.y + ddy };
//           }),
//         );
//         return;
//       }

//       if (
//         activeTool === "select" &&
//         dragModeRef.current === "resize" &&
//         dragStartRef.current &&
//         originalShapeRef.current
//       ) {
//         const ddx = world.x - dragStartRef.current.worldX;
//         const ddy = world.y - dragStartRef.current.worldY;
//         const resized = applyResize(
//           originalShapeRef.current,
//           resizeHandleRef.current,
//           ddx,
//           ddy,
//         );
//         setTemplateShapes((prev) =>
//           prev.map((s) =>
//             s.id === originalShapeRef.current.id ? { ...resized } : s,
//           ),
//         );
//         return;
//       }

//       if (
//         !isDrawing ||
//         !["pen", "pencil", "highlighter", "eraser"].includes(activeTool)
//       )
//         return;

//       const current = currentDrawingPathRef.current;
//       if (!current) return;

//       const lastPt = current.points[current.points.length - 1];
//       if (shouldAddPoint(lastPt, world)) {
//         const updatedPath = { ...current, points: [...current.points, world] };
//         currentDrawingPathRef.current = updatedPath;
//         redraw();
//       }
//     },
//     [isPanning, isDrawing, activeTool, redraw, setPanOffset, setTemplateShapes],
//   );

//   const onPointerUp = useCallback(
//     (e) => {
//       const canvas = canvasRef.current;
//       if (canvas && e.pointerId !== undefined) {
//         try {
//           canvas.releasePointerCapture(e.pointerId);
//         } catch {}
//       }

//       if (isPanning) {
//         setIsPanning(false);
//         return;
//       }

//       if (activeTool === "select" && dragModeRef.current) {
//         if (
//           dragModeRef.current === "move" ||
//           dragModeRef.current === "resize"
//         ) {
//           setHistory((prev) => [
//             ...prev,
//             {
//               paths: [...pathsRef.current],
//               templateShapes: [...templateShapesRef.current],
//             },
//           ]);
//           setRedoStack([]);
//           setSaveStatus("dirty");
//         }
//         dragModeRef.current = null;
//         resizeHandleRef.current = null;
//         dragStartRef.current = null;
//         originalShapeRef.current = null;
//         return;
//       }

//       if (!isDrawing) return;

//       const finishedPath = currentDrawingPathRef.current;
//       if (!finishedPath || finishedPath.points.length < 1) {
//         currentDrawingPathRef.current = null;
//         setIsDrawing(false);
//         return;
//       }

//       setPaths((prev) => [...prev, finishedPath]);
//       setHistory((prev) => [
//         ...prev,
//         {
//           paths: [...pathsRef.current, finishedPath],
//           templateShapes: [...templateShapesRef.current],
//         },
//       ]);
//       setRedoStack([]);
//       publishPath(finishedPath);
//       currentDrawingPathRef.current = null;
//       setIsDrawing(false);
//       setSaveStatus("dirty");
//     },
//     [isPanning, isDrawing, activeTool, publishPath, setPaths],
//   );

//   // ── KEYBOARD ──────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const onKeyDown = (e) => {
//       const tag = document.activeElement?.tagName;
//       if (tag === "INPUT" || tag === "TEXTAREA") return;
//       if (
//         (e.key === "Delete" || e.key === "Backspace") &&
//         selectedShapeIdRef.current
//       ) {
//         setHistory((prev) => [
//           ...prev,
//           {
//             paths: [...pathsRef.current],
//             templateShapes: [...templateShapesRef.current],
//           },
//         ]);
//         setTemplateShapes((prev) =>
//           prev.filter((s) => s.id !== selectedShapeIdRef.current),
//         );
//         setSelectedShapeId(null);
//         setRedoStack([]);
//         setSaveStatus("dirty");
//       }
//       if (e.key === "Escape") setSelectedShapeId(null);
//       if ((e.ctrlKey || e.metaKey) && e.key === "z") {
//         e.preventDefault();
//         undo();
//       }
//       if ((e.ctrlKey || e.metaKey) && e.key === "y") {
//         e.preventDefault();
//         redo();
//       }
//       if ((e.ctrlKey || e.metaKey) && e.key === "s") {
//         e.preventDefault();
//         handleManualSave();
//       }
//     };
//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [handleManualSave]);

//   const addShapeToCanvas = useCallback((shapeId) => {
//     const canvas = canvasRef.current;
//     const cw = canvas?.clientWidth || 600;
//     const ch = canvas?.clientHeight || 400;
//     const z = zoomRef.current;
//     const pan = panOffsetRef.current;
//     const offset = (templateShapesRef.current.length % 5) * 20;
//     const canvasX = (cw / 2 - pan.x) / z + offset;
//     const canvasY = (ch / 2 - pan.y) / z + offset;

//     const shapeMap = {
//       rect: {
//         type: "rect_shape",
//         x: canvasX - 60,
//         y: canvasY - 25,
//         w: 120,
//         h: 50,
//         rx: 4,
//         label: "Rectangle",
//         color: "#3b82f6",
//         fill: "#3b82f620",
//       },
//       rounded_rect: {
//         type: "rect_shape",
//         x: canvasX - 60,
//         y: canvasY - 25,
//         w: 120,
//         h: 50,
//         rx: 14,
//         label: "Rounded",
//         color: "#8b5cf6",
//         fill: "#8b5cf620",
//       },
//       circle: {
//         type: "bubble_shape",
//         x: canvasX,
//         y: canvasY,
//         rx: 50,
//         ry: 50,
//         label: "Circle",
//         color: "#10b981",
//         fill: "#10b98120",
//       },
//       ellipse: {
//         type: "bubble_shape",
//         x: canvasX,
//         y: canvasY,
//         rx: 70,
//         ry: 35,
//         label: "Ellipse",
//         color: "#06b6d4",
//         fill: "#06b6d420",
//       },
//       triangle: {
//         type: "triangle_shape",
//         x: canvasX - 50,
//         y: canvasY - 45,
//         w: 100,
//         h: 80,
//         label: "Triangle",
//         color: "#ef4444",
//         fill: "#ef444420",
//       },
//       diamond: {
//         type: "diamond_shape",
//         x: canvasX - 60,
//         y: canvasY - 30,
//         w: 120,
//         h: 60,
//         label: "Diamond",
//         color: "#f59e0b",
//         fill: "#f59e0b20",
//       },
//       pentagon: {
//         type: "polygon_shape",
//         x: canvasX - 50,
//         y: canvasY - 50,
//         w: 100,
//         h: 100,
//         sides: 5,
//         label: "Pentagon",
//         color: "#3b82f6",
//         fill: "#3b82f620",
//       },
//       hexagon: {
//         type: "polygon_shape",
//         x: canvasX - 55,
//         y: canvasY - 50,
//         w: 110,
//         h: 100,
//         sides: 6,
//         label: "Hexagon",
//         color: "#8b5cf6",
//         fill: "#8b5cf620",
//       },
//       octagon: {
//         type: "polygon_shape",
//         x: canvasX - 55,
//         y: canvasY - 55,
//         w: 110,
//         h: 110,
//         sides: 8,
//         label: "Octagon",
//         color: "#06b6d4",
//         fill: "#06b6d420",
//       },
//       star: {
//         type: "star_shape",
//         x: canvasX - 50,
//         y: canvasY - 50,
//         w: 100,
//         h: 100,
//         points: 5,
//         label: "",
//         color: "#fbbf24",
//         fill: "#fbbf2420",
//       },
//       line: {
//         type: "line_conn",
//         x1: canvasX - 60,
//         y1: canvasY,
//         x2: canvasX + 60,
//         y2: canvasY,
//         color: "#64748b",
//       },
//       arrow: {
//         type: "arrow_conn",
//         x1: canvasX - 60,
//         y1: canvasY,
//         x2: canvasX + 60,
//         y2: canvasY,
//         color: "#3b82f6",
//       },
//       process: {
//         type: "rect_shape",
//         x: canvasX - 70,
//         y: canvasY - 22,
//         w: 140,
//         h: 44,
//         rx: 4,
//         label: "Process",
//         color: "#3b82f6",
//         fill: "#3b82f620",
//       },
//       decision: {
//         type: "diamond_shape",
//         x: canvasX - 70,
//         y: canvasY - 35,
//         w: 140,
//         h: 70,
//         label: "Decision?",
//         color: "#10b981",
//         fill: "#10b98120",
//       },
//       database_shape: {
//         type: "rect_shape",
//         x: canvasX - 50,
//         y: canvasY - 35,
//         w: 100,
//         h: 70,
//         rx: 8,
//         label: "Database",
//         color: "#06b6d4",
//         fill: "#06b6d420",
//       },
//       document: {
//         type: "rect_shape",
//         x: canvasX - 65,
//         y: canvasY - 25,
//         w: 130,
//         h: 50,
//         rx: 4,
//         label: "Document",
//         color: "#f59e0b",
//         fill: "#f59e0b20",
//       },
//       connector: {
//         type: "bubble_shape",
//         x: canvasX,
//         y: canvasY,
//         rx: 18,
//         ry: 18,
//         label: "●",
//         color: "#64748b",
//         fill: "#64748b20",
//       },
//       io: {
//         type: "diamond_shape",
//         x: canvasX - 60,
//         y: canvasY - 25,
//         w: 120,
//         h: 50,
//         label: "I/O",
//         color: "#ec4899",
//         fill: "#ec489920",
//       },
//       class_box: {
//         type: "class_shape",
//         x: canvasX - 80,
//         y: canvasY - 70,
//         w: 160,
//         h: 140,
//         label: "ClassName",
//         attrs: ["- attribute: Type"],
//         methods: ["+ method()"],
//         color: "#8b5cf6",
//       },
//       interface_box: {
//         type: "class_shape",
//         x: canvasX - 80,
//         y: canvasY - 60,
//         w: 160,
//         h: 120,
//         label: "«interface»",
//         attrs: [],
//         methods: ["+ method()"],
//         color: "#6366f1",
//       },
//       actor: {
//         type: "bubble_shape",
//         x: canvasX,
//         y: canvasY,
//         rx: 30,
//         ry: 30,
//         label: "Actor",
//         color: "#64748b",
//         fill: "#64748b20",
//       },
//       use_case_oval: {
//         type: "bubble_shape",
//         x: canvasX,
//         y: canvasY,
//         rx: 70,
//         ry: 35,
//         label: "Use Case",
//         color: "#6366f1",
//         fill: "#6366f120",
//       },
//       server: {
//         type: "rect_shape",
//         x: canvasX - 50,
//         y: canvasY - 30,
//         w: 100,
//         h: 60,
//         rx: 6,
//         label: "Server",
//         color: "#10b981",
//         fill: "#10b98120",
//       },
//       router: {
//         type: "bubble_shape",
//         x: canvasX,
//         y: canvasY,
//         rx: 35,
//         ry: 35,
//         label: "Router",
//         color: "#f59e0b",
//         fill: "#f59e0b20",
//       },
//       switch_node: {
//         type: "bubble_shape",
//         x: canvasX,
//         y: canvasY,
//         rx: 40,
//         ry: 25,
//         label: "Switch",
//         color: "#3b82f6",
//         fill: "#3b82f620",
//       },
//       firewall: {
//         type: "rect_shape",
//         x: canvasX - 50,
//         y: canvasY - 25,
//         w: 100,
//         h: 50,
//         rx: 4,
//         label: "Firewall",
//         color: "#ef4444",
//         fill: "#ef444420",
//       },
//       pc: {
//         type: "rect_shape",
//         x: canvasX - 45,
//         y: canvasY - 25,
//         w: 90,
//         h: 50,
//         rx: 4,
//         label: "PC",
//         color: "#8b5cf6",
//         fill: "#8b5cf620",
//       },
//       ec2: {
//         type: "rect_shape",
//         x: canvasX - 50,
//         y: canvasY - 30,
//         w: 100,
//         h: 60,
//         rx: 6,
//         label: "EC2",
//         color: "#ff9900",
//         fill: "#ff990020",
//       },
//       s3: {
//         type: "rect_shape",
//         x: canvasX - 45,
//         y: canvasY - 30,
//         w: 90,
//         h: 60,
//         rx: 6,
//         label: "S3",
//         color: "#3b82f6",
//         fill: "#3b82f620",
//       },
//       rds: {
//         type: "rect_shape",
//         x: canvasX - 45,
//         y: canvasY - 30,
//         w: 90,
//         h: 60,
//         rx: 6,
//         label: "RDS",
//         color: "#06b6d4",
//         fill: "#06b6d420",
//       },
//       lambda: {
//         type: "rect_shape",
//         x: canvasX - 50,
//         y: canvasY - 28,
//         w: 100,
//         h: 56,
//         rx: 6,
//         label: "Lambda",
//         color: "#f59e0b",
//         fill: "#f59e0b20",
//       },
//       elb: {
//         type: "rect_shape",
//         x: canvasX - 55,
//         y: canvasY - 25,
//         w: 110,
//         h: 50,
//         rx: 6,
//         label: "Load Balancer",
//         color: "#10b981",
//         fill: "#10b98120",
//       },
//       bubble: {
//         type: "bubble_shape",
//         x: canvasX,
//         y: canvasY,
//         rx: 60,
//         ry: 30,
//         label: "Topic",
//         color: "#8b5cf6",
//         fill: "#8b5cf620",
//       },
//       leaf: {
//         type: "bubble_shape",
//         x: canvasX,
//         y: canvasY,
//         rx: 45,
//         ry: 22,
//         label: "Leaf",
//         color: "#10b981",
//         fill: "#10b98120",
//       },
//       branch: {
//         type: "diamond_shape",
//         x: canvasX - 50,
//         y: canvasY - 30,
//         w: 100,
//         h: 60,
//         label: "Branch",
//         color: "#14b8a6",
//         fill: "#14b8a620",
//       },
//     };

//     const template = shapeMap[shapeId];
//     if (!template) return;
//     const newShape = {
//       ...template,
//       id: makeShapeId(),
//       selected: false,
//       rotation: 0,
//       locked: false,
//     };
//     const histSnap = {
//       paths: [...pathsRef.current],
//       templateShapes: [...templateShapesRef.current],
//     };
//     setHistory((prev) => [...prev, histSnap]);
//     setRedoStack([]);
//     const updated = [...templateShapesRef.current, newShape];
//     templateShapesRef.current = updated;
//     _setTemplateShapes(updated);
//     setSelectedShapeId(newShape.id);
//     setActiveTool("select");
//     setSaveStatus("dirty");
//   }, []);

//   const undo = useCallback(() => {
//     setHistory((prev) => {
//       if (!prev.length) return prev;
//       const snap = prev[prev.length - 1];
//       setRedoStack((r) => [
//         ...r,
//         {
//           paths: [...pathsRef.current],
//           templateShapes: [...templateShapesRef.current],
//         },
//       ]);
//       if (snap && "paths" in snap) {
//         setPaths(snap.paths);
//         setTemplateShapes(snap.templateShapes);
//       } else setPaths(snap);
//       setSaveStatus("dirty");
//       return prev.slice(0, -1);
//     });
//   }, [setPaths, setTemplateShapes]);

//   const redo = useCallback(() => {
//     setRedoStack((prev) => {
//       if (!prev.length) return prev;
//       const snap = prev[prev.length - 1];
//       setHistory((h) => [
//         ...h,
//         {
//           paths: [...pathsRef.current],
//           templateShapes: [...templateShapesRef.current],
//         },
//       ]);
//       if (snap && "paths" in snap) {
//         setPaths(snap.paths);
//         setTemplateShapes(snap.templateShapes);
//       } else setPaths(snap);
//       setSaveStatus("dirty");
//       return prev.slice(0, -1);
//     });
//   }, [setPaths, setTemplateShapes]);

//   const clearCanvas = useCallback(() => {
//     setHistory((prev) => [
//       ...prev,
//       {
//         paths: [...pathsRef.current],
//         templateShapes: [...templateShapesRef.current],
//       },
//     ]);
//     setPaths([]);
//     setTemplateShapes([]);
//     setSaveStatus("dirty");
//     if (sessionId) clearWhiteboardSession(sessionId).catch(() => {});
//   }, [sessionId, setPaths, setTemplateShapes]);

//   const exportPNG = useCallback(() => {
//     const canvas = canvasRef.current;
//     const link = document.createElement("a");
//     link.download = `whiteboard-${sessionId || "export"}.png`;
//     link.href = canvas.toDataURL("image/png");
//     link.click();
//   }, [sessionId]);

//   const toolBg = (id) =>
//     activeTool === id
//       ? isDark
//         ? "rgba(59,130,246,0.2)"
//         : "rgba(59,130,246,0.1)"
//       : "transparent";
//   const toolColor = (id) =>
//     activeTool === id
//       ? "#3b82f6"
//       : isDark
//         ? "rgba(255,255,255,0.65)"
//         : "#475569";
//   const isEmpty = paths.length === 0 && templateShapes.length === 0;
//   const canvasCursor = getCanvasCursor(activeTool, isPanning);

//   // Save status label
//   const saveStatusLabel =
//     saveStatus === "saving"
//       ? "Saving..."
//       : saveStatus === "error"
//         ? "Save failed"
//         : saveStatus === "dirty"
//           ? "Unsaved changes"
//           : lastSavedAt
//             ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
//             : "Auto-saved";

//   const saveStatusColor =
//     saveStatus === "error"
//       ? "#f87171"
//       : saveStatus === "dirty"
//         ? "#fbbf24"
//         : saveStatus === "saving"
//           ? "#60a5fa"
//           : "#22c55e";

//   return (
//     <div
//       style={{
//         display: "flex",
//         height: "100%",
//         position: "relative",
//         background: isDark ? "#0f172a" : "#f8fafc",
//       }}
//     >
//       {/* ── LEFT TOOLBAR ── */}
//       <div
//         onMouseEnter={() => {
//           uiInteractingRef.current = true;
//         }}
//         onMouseLeave={() => {
//           uiInteractingRef.current = false;
//         }}
//         style={{
//           position: "absolute",
//           left: 12,
//           top: "50%",
//           transform: "translateY(-50%)",
//           zIndex: 200,
//           display: "flex",
//           flexDirection: "column",
//           gap: 2,
//           padding: "8px 6px",
//           background: isDark ? "rgba(15,23,42,0.98)" : "rgba(255,255,255,0.99)",
//           borderRadius: 14,
//           border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
//           boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
//           backdropFilter: "blur(12px)",
//           cursor: "default",
//         }}
//       >
//         {LEFT_TOOLS.map(({ id, icon: Icon, label }) => (
//           <button
//             key={id}
//             title={label}
//             onMouseDown={(e) => {
//               e.stopPropagation();
//               e.preventDefault();
//             }}
//             onClick={(e) => {
//               e.stopPropagation();
//               setActiveTool(id);
//               if (id !== "shape") setShapesOpen(false);
//             }}
//             style={{
//               width: 34,
//               height: 34,
//               borderRadius: 8,
//               border: "none",
//               cursor: "pointer",
//               background: toolBg(id),
//               color: toolColor(id),
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               transition: "all 0.15s",
//               position: "relative",
//             }}
//           >
//             {activeTool === id && (
//               <span
//                 style={{
//                   position: "absolute",
//                   left: 0,
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   width: 2,
//                   height: 18,
//                   background: "#3b82f6",
//                   borderRadius: 1,
//                 }}
//               />
//             )}
//             <Icon size={15} />
//           </button>
//         ))}
//         <div
//           style={{
//             width: "100%",
//             height: 1,
//             background: isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
//             margin: "2px 0",
//           }}
//         />
//         <button
//           title="Shapes"
//           onMouseDown={(e) => {
//             e.stopPropagation();
//             e.preventDefault();
//           }}
//           onClick={(e) => {
//             e.stopPropagation();
//             setShapesOpen((s) => !s);
//           }}
//           style={{
//             width: 34,
//             height: 34,
//             borderRadius: 8,
//             border: "none",
//             cursor: "pointer",
//             background: shapesOpen ? "rgba(59,130,246,0.15)" : "transparent",
//             color: shapesOpen
//               ? "#3b82f6"
//               : isDark
//                 ? "rgba(255,255,255,0.5)"
//                 : "#64748b",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <Square size={15} />
//         </button>
//         <button
//           title="Pages"
//           onMouseDown={(e) => {
//             e.stopPropagation();
//             e.preventDefault();
//           }}
//           onClick={(e) => {
//             e.stopPropagation();
//             setShowPages((s) => !s);
//           }}
//           style={{
//             width: 34,
//             height: 34,
//             borderRadius: 8,
//             border: "none",
//             cursor: "pointer",
//             background: showPages ? "rgba(59,130,246,0.15)" : "transparent",
//             color: showPages
//               ? "#3b82f6"
//               : isDark
//                 ? "rgba(255,255,255,0.5)"
//                 : "#64748b",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <Layers size={15} />
//         </button>
//         <button
//           title="History"
//           onMouseDown={(e) => {
//             e.stopPropagation();
//             e.preventDefault();
//           }}
//           onClick={(e) => {
//             e.stopPropagation();
//             setShowHistory((s) => !s);
//           }}
//           style={{
//             width: 34,
//             height: 34,
//             borderRadius: 8,
//             border: "none",
//             cursor: "pointer",
//             background: showHistory ? "rgba(59,130,246,0.15)" : "transparent",
//             color: showHistory
//               ? "#3b82f6"
//               : isDark
//                 ? "rgba(255,255,255,0.5)"
//                 : "#64748b",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <History size={15} />
//         </button>
//       </div>

//       {/* ── SHAPES PANEL ── */}
//       {shapesOpen && (
//         <div
//           onMouseEnter={() => {
//             uiInteractingRef.current = true;
//           }}
//           onMouseLeave={() => {
//             uiInteractingRef.current = false;
//           }}
//           onMouseDown={(e) => e.stopPropagation()}
//           onClick={(e) => e.stopPropagation()}
//           style={{
//             position: "absolute",
//             left: 58,
//             top: 60,
//             zIndex: 300,
//             width: 290,
//             maxHeight: "calc(100% - 130px)",
//             overflowY: "auto",
//             background: isDark ? "#1e293b" : "#ffffff",
//             border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
//             borderRadius: 14,
//             padding: 14,
//             boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
//             cursor: "default",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginBottom: 10,
//             }}
//           >
//             <span
//               style={{
//                 fontSize: 12,
//                 fontWeight: 700,
//                 color: isDark ? "#f1f5f9" : "#0f172a",
//               }}
//             >
//               Shapes
//             </span>
//             <button
//               onMouseDown={(e) => {
//                 e.stopPropagation();
//                 e.preventDefault();
//               }}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShapesOpen(false);
//               }}
//               style={{
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 color: isDark ? "#64748b" : "#94a3b8",
//               }}
//             >
//               <X size={14} />
//             </button>
//           </div>
//           <div style={{ position: "relative", marginBottom: 10 }}>
//             <Search
//               size={12}
//               style={{
//                 position: "absolute",
//                 left: 8,
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 color: "#64748b",
//               }}
//             />
//             <input
//               value={shapeSearch}
//               onChange={(e) => setShapeSearch(e.target.value)}
//               onMouseDown={(e) => e.stopPropagation()}
//               placeholder="Search shapes..."
//               style={{
//                 width: "100%",
//                 padding: "6px 8px 6px 26px",
//                 borderRadius: 8,
//                 border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
//                 background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
//                 color: isDark ? "#f1f5f9" : "#0f172a",
//                 fontSize: 11,
//                 outline: "none",
//                 boxSizing: "border-box",
//               }}
//             />
//           </div>
//           {Object.entries(SHAPE_CATEGORIES).map(([cat, shapes]) => (
//             <div key={cat} style={{ marginBottom: 12 }}>
//               <button
//                 onMouseDown={(e) => {
//                   e.stopPropagation();
//                   e.preventDefault();
//                 }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setActiveShapeCat(activeShapeCat === cat ? "" : cat);
//                 }}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 4,
//                   marginBottom: 6,
//                   padding: 0,
//                 }}
//               >
//                 <ChevronRight
//                   size={11}
//                   style={{
//                     transform:
//                       activeShapeCat === cat ? "rotate(90deg)" : "none",
//                     transition: "0.15s",
//                     color: "#64748b",
//                   }}
//                 />
//                 <span
//                   style={{
//                     fontSize: 10,
//                     fontWeight: 600,
//                     color: isDark ? "#94a3b8" : "#64748b",
//                     textTransform: "uppercase",
//                     letterSpacing: "0.06em",
//                   }}
//                 >
//                   {cat}
//                 </span>
//               </button>
//               {activeShapeCat === cat && (
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(5, 1fr)",
//                     gap: 6,
//                   }}
//                 >
//                   {shapes
//                     .filter(
//                       (s) =>
//                         !shapeSearch ||
//                         s.toLowerCase().includes(shapeSearch.toLowerCase()),
//                     )
//                     .map((shapeId) => {
//                       const ShapeIcon = SHAPE_ICONS[shapeId] || Square;
//                       return (
//                         <button
//                           key={shapeId}
//                           title={shapeId}
//                           onMouseDown={(e) => {
//                             e.stopPropagation();
//                             e.preventDefault();
//                           }}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             e.preventDefault();
//                             addShapeToCanvas(shapeId);
//                           }}
//                           style={{
//                             width: 40,
//                             height: 40,
//                             borderRadius: 8,
//                             border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
//                             background: isDark
//                               ? "rgba(255,255,255,0.04)"
//                               : "#f8fafc",
//                             cursor: "pointer",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             transition: "all 0.15s",
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.background =
//                               "rgba(59,130,246,0.15)";
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.background = isDark
//                               ? "rgba(255,255,255,0.04)"
//                               : "#f8fafc";
//                           }}
//                         >
//                           <ShapeIcon
//                             size={16}
//                             color={isDark ? "#94a3b8" : "#475569"}
//                           />
//                         </button>
//                       );
//                     })}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ── PAGES PANEL ── */}
//       {showPages && (
//         <div
//           onMouseEnter={() => {
//             uiInteractingRef.current = true;
//           }}
//           onMouseLeave={() => {
//             uiInteractingRef.current = false;
//           }}
//           onMouseDown={(e) => e.stopPropagation()}
//           style={{
//             position: "absolute",
//             left: 58,
//             bottom: 60,
//             zIndex: 300,
//             width: 200,
//             background: isDark ? "#1e293b" : "#fff",
//             border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
//             borderRadius: 12,
//             padding: 12,
//             boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
//             cursor: "default",
//           }}
//         >
//           <div
//             style={{
//               fontSize: 11,
//               fontWeight: 700,
//               color: isDark ? "#f1f5f9" : "#0f172a",
//               marginBottom: 8,
//             }}
//           >
//             Pages
//           </div>
//           {pages.map((p, i) => (
//             <div
//               key={p.id}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 padding: "6px 8px",
//                 borderRadius: 8,
//                 background: p.active ? "rgba(59,130,246,0.1)" : "transparent",
//                 marginBottom: 2,
//                 cursor: "pointer",
//               }}
//               onMouseDown={(e) => e.stopPropagation()}
//               onClick={() =>
//                 setPages((prev) =>
//                   prev.map((pg) => ({ ...pg, active: pg.id === p.id })),
//                 )
//               }
//             >
//               <div
//                 style={{
//                   width: 28,
//                   height: 20,
//                   background: isDark ? "#334155" : "#f1f5f9",
//                   borderRadius: 4,
//                   border: `1px solid ${p.active ? "#3b82f6" : isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <span style={{ fontSize: 8, color: "#64748b" }}>{i + 1}</span>
//               </div>
//               <span
//                 style={{
//                   fontSize: 11,
//                   color: p.active ? "#3b82f6" : isDark ? "#94a3b8" : "#475569",
//                   flex: 1,
//                 }}
//               >
//                 {p.name}
//               </span>
//             </div>
//           ))}
//           <button
//             onMouseDown={(e) => e.stopPropagation()}
//             onClick={(e) => {
//               e.stopPropagation();
//               setPages((p) => [
//                 ...p.map((pg) => ({ ...pg, active: false })),
//                 { id: Date.now(), name: `Page ${p.length + 1}`, active: true },
//               ]);
//             }}
//             style={{
//               width: "100%",
//               padding: "6px",
//               borderRadius: 8,
//               border: `1px dashed ${isDark ? "rgba(255,255,255,0.15)" : "#e2e8f0"}`,
//               background: "none",
//               cursor: "pointer",
//               fontSize: 10,
//               color: isDark ? "#64748b" : "#94a3b8",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: 4,
//               marginTop: 4,
//             }}
//           >
//             <Plus size={12} /> Add Page
//           </button>
//         </div>
//       )}

//       {/* ── HISTORY PANEL ── */}
//       {showHistory && (
//         <div
//           onMouseEnter={() => {
//             uiInteractingRef.current = true;
//           }}
//           onMouseLeave={() => {
//             uiInteractingRef.current = false;
//           }}
//           onMouseDown={(e) => e.stopPropagation()}
//           style={{
//             position: "absolute",
//             right: 12,
//             top: "50%",
//             transform: "translateY(-50%)",
//             zIndex: 300,
//             width: 220,
//             maxHeight: 400,
//             overflowY: "auto",
//             background: isDark ? "#1e293b" : "#fff",
//             border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
//             borderRadius: 12,
//             padding: 12,
//             boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
//             cursor: "default",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginBottom: 10,
//             }}
//           >
//             <span
//               style={{
//                 fontSize: 12,
//                 fontWeight: 700,
//                 color: isDark ? "#f1f5f9" : "#0f172a",
//               }}
//             >
//               History
//             </span>
//             <button
//               onMouseDown={(e) => e.stopPropagation()}
//               onClick={() => setShowHistory(false)}
//               style={{
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 color: "#64748b",
//               }}
//             >
//               <X size={13} />
//             </button>
//           </div>
//           {history.length === 0 ? (
//             <div
//               style={{
//                 fontSize: 11,
//                 color: isDark ? "#475569" : "#94a3b8",
//                 textAlign: "center",
//                 padding: 16,
//               }}
//             >
//               No history yet
//             </div>
//           ) : (
//             history.map((snap, i) => (
//               <div
//                 key={i}
//                 onMouseDown={(e) => e.stopPropagation()}
//                 onClick={() => {
//                   setRedoStack((r) => [
//                     ...r,
//                     {
//                       paths: [...pathsRef.current],
//                       templateShapes: [...templateShapesRef.current],
//                     },
//                   ]);
//                   if (snap && "paths" in snap) {
//                     setPaths(snap.paths);
//                     setTemplateShapes(snap.templateShapes);
//                   } else setPaths(snap);
//                   setHistory((h) => h.slice(0, i));
//                 }}
//                 style={{
//                   padding: "8px 10px",
//                   borderRadius: 8,
//                   marginBottom: 3,
//                   cursor: "pointer",
//                   border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.background = "rgba(59,130,246,0.08)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.background = "transparent";
//                 }}
//               >
//                 <History size={11} color="#64748b" />
//                 <span
//                   style={{
//                     fontSize: 10,
//                     color: isDark ? "#94a3b8" : "#475569",
//                   }}
//                 >
//                   Snapshot {i + 1}
//                 </span>
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {/* ── TOP TOOLBAR ── */}
//       <div
//         onMouseEnter={() => {
//           uiInteractingRef.current = true;
//         }}
//         onMouseLeave={() => {
//           uiInteractingRef.current = false;
//         }}
//         onMouseDown={(e) => e.stopPropagation()}
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           height: 52,
//           zIndex: 200,
//           display: "flex",
//           alignItems: "center",
//           gap: 8,
//           padding: "0 16px",
//           background: isDark ? "rgba(15,23,42,0.97)" : "rgba(255,255,255,0.98)",
//           borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
//           backdropFilter: "blur(12px)",
//           cursor: "default",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             gap: 3,
//             background: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
//             borderRadius: 10,
//             padding: 4,
//           }}
//         >
//           {COLORS.map((c) => (
//             <button
//               key={c}
//               onClick={() => setColor(c)}
//               onMouseDown={(e) => e.stopPropagation()}
//               style={{
//                 width: 18,
//                 height: 18,
//                 borderRadius: 4,
//                 background: c,
//                 border:
//                   color === c
//                     ? "2px solid #3b82f6"
//                     : `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
//                 cursor: "pointer",
//                 transform: color === c ? "scale(1.3)" : "scale(1)",
//                 transition: "0.1s",
//                 flexShrink: 0,
//               }}
//             />
//           ))}
//           <input
//             type="color"
//             value={color}
//             onChange={(e) => setColor(e.target.value)}
//             onMouseDown={(e) => e.stopPropagation()}
//             style={{
//               width: 18,
//               height: 18,
//               borderRadius: 4,
//               border: "none",
//               cursor: "pointer",
//               padding: 0,
//               background: "transparent",
//             }}
//           />
//         </div>
//         <div
//           style={{
//             width: 1,
//             height: 24,
//             background: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
//           }}
//         />
//         <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
//           {STROKE_SIZES.map((s) => (
//             <button
//               key={s}
//               onClick={() => setStroke(s)}
//               onMouseDown={(e) => e.stopPropagation()}
//               style={{
//                 width: Math.max(12, s + 8),
//                 height: Math.max(12, s + 8),
//                 borderRadius: "50%",
//                 border:
//                   strokeWidth === s
//                     ? "2px solid #3b82f6"
//                     : "2px solid transparent",
//                 background: isDark ? "#e2e8f0" : "#1e293b",
//                 cursor: "pointer",
//                 flexShrink: 0,
//                 opacity: strokeWidth === s ? 1 : 0.35,
//                 transition: "0.15s",
//               }}
//             />
//           ))}
//         </div>
//         <div
//           style={{
//             marginLeft: "auto",
//             display: "flex",
//             gap: 4,
//             alignItems: "center",
//           }}
//         >
//           <button
//             onClick={undo}
//             disabled={!history.length}
//             title="Undo"
//             onMouseDown={(e) => e.stopPropagation()}
//             style={{
//               width: 30,
//               height: 30,
//               borderRadius: 8,
//               border: "none",
//               cursor: history.length ? "pointer" : "not-allowed",
//               background: "transparent",
//               color: history.length
//                 ? isDark
//                   ? "rgba(255,255,255,0.6)"
//                   : "#475569"
//                 : isDark
//                   ? "rgba(255,255,255,0.15)"
//                   : "#cbd5e1",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <RotateCcw size={14} />
//           </button>
//           <button
//             onClick={redo}
//             disabled={!redoStack.length}
//             title="Redo"
//             onMouseDown={(e) => e.stopPropagation()}
//             style={{
//               width: 30,
//               height: 30,
//               borderRadius: 8,
//               border: "none",
//               cursor: redoStack.length ? "pointer" : "not-allowed",
//               background: "transparent",
//               color: redoStack.length
//                 ? isDark
//                   ? "rgba(255,255,255,0.6)"
//                   : "#475569"
//                 : isDark
//                   ? "rgba(255,255,255,0.15)"
//                   : "#cbd5e1",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <RotateCw size={14} />
//           </button>
//           <button
//             onClick={clearCanvas}
//             title="Clear"
//             onMouseDown={(e) => e.stopPropagation()}
//             style={{
//               width: 30,
//               height: 30,
//               borderRadius: 8,
//               border: "none",
//               cursor: "pointer",
//               background: "transparent",
//               color: "#f87171",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Trash2 size={14} />
//           </button>
//           <button
//             onClick={handleManualSave}
//             title="Save whiteboard"
//             disabled={saveStatus === "saving"}
//             onMouseDown={(e) => e.stopPropagation()}
//             style={{
//               width: 30,
//               height: 30,
//               borderRadius: 8,
//               border: "none",
//               cursor: saveStatus === "saving" ? "not-allowed" : "pointer",
//               background:
//                 saveStatus === "dirty"
//                   ? "rgba(251,191,36,0.12)"
//                   : "transparent",
//               color:
//                 saveStatus === "saving"
//                   ? "#60a5fa"
//                   : saveStatus === "error"
//                     ? "#f87171"
//                     : saveStatus === "dirty"
//                       ? "#fbbf24"
//                       : "#a78bfa",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Save size={14} />
//           </button>
//           <button
//             onClick={exportPNG}
//             title="Export PNG"
//             onMouseDown={(e) => e.stopPropagation()}
//             style={{
//               width: 30,
//               height: 30,
//               borderRadius: 8,
//               border: "none",
//               cursor: "pointer",
//               background: "transparent",
//               color: "#22c55e",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Download size={14} />
//           </button>
//           <div
//             style={{
//               width: 1,
//               height: 20,
//               background: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
//             }}
//           />
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 4,
//               padding: "3px 10px",
//               borderRadius: 8,
//               background: connected
//                 ? "rgba(34,197,94,0.1)"
//                 : "rgba(248,113,113,0.1)",
//               border: `1px solid ${connected ? "rgba(34,197,94,0.3)" : "rgba(248,113,113,0.3)"}`,
//             }}
//           >
//             {connected ? (
//               <Wifi size={11} color="#22c55e" />
//             ) : (
//               <WifiOff size={11} color="#f87171" />
//             )}
//             <span
//               style={{
//                 fontSize: 9,
//                 fontWeight: 700,
//                 color: connected ? "#22c55e" : "#f87171",
//                 fontFamily: "monospace",
//               }}
//             >
//               {connected ? "LIVE" : "OFF"}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* ── CANVAS ── */}
//       <div
//         ref={canvasContainerRef}
//         style={{
//           position: "absolute",
//           inset: 0,
//           paddingTop: 52,
//           cursor: "unset",
//         }}
//       >
//         <canvas
//           ref={canvasRef}
//           style={{
//             display: "block",
//             width: "100%",
//             height: "100%",
//             touchAction: "none",
//             userSelect: "none",
//             cursor: canvasCursor,
//           }}
//           onPointerDown={onPointerDown}
//           onPointerMove={onPointerMove}
//           onPointerUp={onPointerUp}
//           onPointerLeave={onPointerUp}
//         />
//         {isEmpty && (
//           <div
//             style={{
//               position: "absolute",
//               inset: 0,
//               top: 52,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               pointerEvents: "none",
//               gap: 10,
//             }}
//           >
//             <Pencil
//               size={36}
//               color={isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}
//             />
//             <p
//               style={{
//                 fontSize: 13,
//                 color: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)",
//                 margin: 0,
//                 fontWeight: 500,
//               }}
//             >
//               Select a tool and start drawing, or click Shapes to insert
//             </p>
//           </div>
//         )}
//       </div>

//       {/* ── ZOOM CONTROLS ── */}
//       <div
//         onMouseEnter={() => {
//           uiInteractingRef.current = true;
//         }}
//         onMouseLeave={() => {
//           uiInteractingRef.current = false;
//         }}
//         onMouseDown={(e) => e.stopPropagation()}
//         style={{
//           position: "absolute",
//           bottom: 20,
//           right: 20,
//           zIndex: 200,
//           display: "flex",
//           alignItems: "center",
//           gap: 4,
//           padding: "6px 10px",
//           background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.97)",
//           border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
//           borderRadius: 12,
//           boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
//           backdropFilter: "blur(12px)",
//           cursor: "default",
//         }}
//       >
//         <button
//           onClick={() => setZoom((z) => Math.max(0.1, +(z - 0.25).toFixed(2)))}
//           style={{
//             width: 26,
//             height: 26,
//             border: "none",
//             borderRadius: 6,
//             cursor: "pointer",
//             background: "transparent",
//             color: isDark ? "rgba(255,255,255,0.6)" : "#475569",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <ZoomOut size={13} />
//         </button>
//         <span
//           style={{
//             fontSize: 11,
//             fontWeight: 700,
//             color: isDark ? "rgba(255,255,255,0.7)" : "#334155",
//             minWidth: 40,
//             textAlign: "center",
//             fontFamily: "monospace",
//           }}
//         >
//           {Math.round(zoom * 100)}%
//         </span>
//         <button
//           onClick={() => setZoom((z) => Math.min(5, +(z + 0.25).toFixed(2)))}
//           style={{
//             width: 26,
//             height: 26,
//             border: "none",
//             borderRadius: 6,
//             cursor: "pointer",
//             background: "transparent",
//             color: isDark ? "rgba(255,255,255,0.6)" : "#475569",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <ZoomIn size={13} />
//         </button>
//         <div
//           style={{
//             width: 1,
//             height: 16,
//             background: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
//             margin: "0 2px",
//           }}
//         />
//         <button
//           onClick={() => {
//             setZoom(1);
//             setPanOffset({ x: 0, y: 0 });
//           }}
//           title="Fit screen"
//           style={{
//             width: 26,
//             height: 26,
//             border: "none",
//             borderRadius: 6,
//             cursor: "pointer",
//             background: "transparent",
//             color: isDark ? "rgba(255,255,255,0.6)" : "#475569",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <Maximize2 size={13} />
//         </button>
//       </div>

//       {/* ── TOAST ── */}
//       {toast && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: 24,
//             right: 24,
//             zIndex: 9999,
//             borderRadius: 12,
//             padding: "10px 18px",
//             fontSize: 13,
//             fontWeight: 600,
//             boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
//             background: toast.type === "error" ? "#dc2626" : "#1e293b",
//             color: "#fff",
//             pointerEvents: "none",
//           }}
//         >
//           {toast.message}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── WHITEBOARD CARD ───────────────────────────────────────────────────────────
// function WhiteboardCard({
//   board,
//   isDark,
//   onOpen,
//   onStar,
//   onDelete,
//   onDuplicate,
//   onRename,
// }) {
//   const [showMenu, setShowMenu] = useState(false);
//   const [hovered, setHovered] = useState(false);
//   const menuItems = [
//     { label: "Rename", icon: Pencil, action: onRename },
//     { label: "Duplicate", icon: Copy, action: onDuplicate },
//     { label: "Move", icon: Move, action: () => {} },
//     { label: "Export", icon: Download, action: () => {} },
//     { label: "Lock", icon: Lock, action: () => {} },
//     { label: board.starred ? "Unstar" : "Star", icon: Star, action: onStar },
//     { label: "Move to Trash", icon: Trash, action: onDelete, danger: true },
//   ];
//   return (
//     <div
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => {
//         setHovered(false);
//         setShowMenu(false);
//       }}
//       style={{
//         borderRadius: 14,
//         border: `1px solid ${isDark ? (hovered ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.08)") : hovered ? "rgba(59,130,246,0.3)" : "#e2e8f0"}`,
//         overflow: "hidden",
//         background: isDark ? "#1e293b" : "#ffffff",
//         transition: "all 0.2s",
//         boxShadow: hovered
//           ? "0 8px 32px rgba(0,0,0,0.2)"
//           : "0 2px 8px rgba(0,0,0,0.06)",
//         transform: hovered ? "translateY(-2px)" : "none",
//         cursor: "pointer",
//         position: "relative",
//       }}
//     >
//       <div
//         onClick={onOpen}
//         style={{
//           height: 130,
//           overflow: "hidden",
//           background: isDark ? "#0f172a" : "#f8fafc",
//         }}
//       >
//         <BoardThumbnail type={board.thumbnail} isDark={isDark} />
//       </div>
//       <div style={{ padding: "10px 12px" }}>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "flex-start",
//             justifyContent: "space-between",
//             gap: 6,
//           }}
//         >
//           <div style={{ flex: 1, minWidth: 0 }}>
//             <div
//               onClick={onOpen}
//               style={{
//                 fontSize: 12,
//                 fontWeight: 600,
//                 color: isDark ? "#f1f5f9" : "#0f172a",
//                 whiteSpace: "nowrap",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 marginBottom: 3,
//               }}
//             >
//               {board.title}
//             </div>
//             <div
//               style={{ fontSize: 10, color: isDark ? "#475569" : "#94a3b8" }}
//             >
//               {board.owner}
//             </div>
//             <div
//               style={{
//                 fontSize: 10,
//                 color: isDark ? "#334155" : "#cbd5e1",
//                 marginTop: 2,
//               }}
//             >
//               {board.modified}
//             </div>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 3,
//               flexShrink: 0,
//             }}
//           >
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onStar();
//               }}
//               style={{
//                 width: 26,
//                 height: 26,
//                 border: "none",
//                 borderRadius: 6,
//                 cursor: "pointer",
//                 background: "transparent",
//                 color: board.starred
//                   ? "#fbbf24"
//                   : isDark
//                     ? "#334155"
//                     : "#cbd5e1",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Star size={13} fill={board.starred ? "#fbbf24" : "none"} />
//             </button>
//             <div style={{ position: "relative" }}>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setShowMenu((s) => !s);
//                 }}
//                 style={{
//                   width: 26,
//                   height: 26,
//                   border: "none",
//                   borderRadius: 6,
//                   cursor: "pointer",
//                   background: showMenu
//                     ? isDark
//                       ? "rgba(255,255,255,0.1)"
//                       : "#f1f5f9"
//                     : "transparent",
//                   color: isDark ? "rgba(255,255,255,0.5)" : "#94a3b8",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <MoreHorizontal size={13} />
//               </button>
//               {showMenu && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     right: 0,
//                     bottom: 32,
//                     zIndex: 200,
//                     background: isDark ? "#1e293b" : "#ffffff",
//                     border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
//                     borderRadius: 10,
//                     padding: "6px",
//                     boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
//                     minWidth: 160,
//                   }}
//                 >
//                   {menuItems.map(({ label, icon: Icon, action, danger }) => (
//                     <button
//                       key={label}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         action();
//                         setShowMenu(false);
//                       }}
//                       style={{
//                         width: "100%",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 8,
//                         padding: "7px 10px",
//                         borderRadius: 7,
//                         border: "none",
//                         background: "transparent",
//                         cursor: "pointer",
//                         color: danger
//                           ? "#f87171"
//                           : isDark
//                             ? "#e2e8f0"
//                             : "#334155",
//                         fontSize: 11,
//                         fontWeight: 500,
//                         textAlign: "left",
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.background = danger
//                           ? "rgba(248,113,113,0.1)"
//                           : isDark
//                             ? "rgba(255,255,255,0.06)"
//                             : "#f8fafc";
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.background = "transparent";
//                       }}
//                     >
//                       <Icon size={12} />
//                       {label}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         {board.project && (
//           <div
//             style={{
//               marginTop: 6,
//               display: "inline-flex",
//               alignItems: "center",
//               gap: 4,
//               padding: "2px 8px",
//               borderRadius: 20,
//               background: "rgba(59,130,246,0.1)",
//               border: "1px solid rgba(59,130,246,0.2)",
//             }}
//           >
//             <FolderOpen size={9} color="#3b82f6" />
//             <span style={{ fontSize: 9, color: "#3b82f6", fontWeight: 600 }}>
//               {board.project}
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ── TEMPLATES MODAL ───────────────────────────────────────────────────────────
// function TemplatesModal({ isDark, onClose, onSelect }) {
//   const [activeCat, setActiveCat] = useState("All");
//   const [search, setSearch] = useState("");
//   const [starred, setStarred] = useState([]);
//   const filtered = TEMPLATES.filter(
//     (t) =>
//       (activeCat === "All" || t.category === activeCat) &&
//       (!search || t.title.toLowerCase().includes(search.toLowerCase())),
//   );
//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 500,
//         background: "rgba(0,0,0,0.55)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backdropFilter: "blur(4px)",
//       }}
//     >
//       <div
//         style={{
//           width: "min(900px, 96vw)",
//           height: "min(620px, 94vh)",
//           background: isDark ? "#0f172a" : "#ffffff",
//           borderRadius: 20,
//           border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//           boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
//         }}
//       >
//         <div
//           style={{
//             padding: "20px 24px 16px",
//             borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <span
//             style={{
//               fontSize: 18,
//               fontWeight: 700,
//               color: isDark ? "#f1f5f9" : "#0f172a",
//             }}
//           >
//             Templates
//           </span>
//           <button
//             onClick={onClose}
//             style={{
//               width: 32,
//               height: 32,
//               borderRadius: 8,
//               border: "none",
//               cursor: "pointer",
//               background: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9",
//               color: isDark ? "#94a3b8" : "#64748b",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <X size={16} />
//           </button>
//         </div>
//         <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
//           <div
//             style={{
//               width: 190,
//               borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
//               overflowY: "auto",
//               padding: "12px 8px",
//             }}
//           >
//             {TEMPLATE_CATEGORIES.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => setActiveCat(cat)}
//                 style={{
//                   width: "100%",
//                   padding: "8px 12px",
//                   borderRadius: 8,
//                   border: "none",
//                   cursor: "pointer",
//                   background: activeCat === cat ? "#3b82f6" : "transparent",
//                   color:
//                     activeCat === cat ? "#fff" : isDark ? "#94a3b8" : "#475569",
//                   fontSize: 12,
//                   fontWeight: activeCat === cat ? 600 : 500,
//                   textAlign: "left",
//                   marginBottom: 2,
//                 }}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
//           <div
//             style={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 padding: "14px 16px 10px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 10,
//               }}
//             >
//               <div style={{ position: "relative", flex: 1 }}>
//                 <Search
//                   size={13}
//                   style={{
//                     position: "absolute",
//                     left: 10,
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     color: "#64748b",
//                   }}
//                 />
//                 <input
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search templates..."
//                   style={{
//                     width: "100%",
//                     padding: "8px 10px 8px 30px",
//                     borderRadius: 10,
//                     border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
//                     background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
//                     color: isDark ? "#f1f5f9" : "#0f172a",
//                     fontSize: 12,
//                     outline: "none",
//                     boxSizing: "border-box",
//                   }}
//                 />
//               </div>
//             </div>
//             <div
//               style={{
//                 flex: 1,
//                 overflowY: "auto",
//                 padding: "0 16px 16px",
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
//                 gap: 12,
//                 alignContent: "start",
//               }}
//             >
//               {filtered.map((t) => {
//                 const Icon = t.icon;
//                 const isStarred = starred.includes(t.id);
//                 return (
//                   <div
//                     key={t.id}
//                     onClick={() => onSelect(t.id)}
//                     style={{
//                       borderRadius: 12,
//                       border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
//                       background: isDark ? "#1e293b" : "#f8fafc",
//                       overflow: "hidden",
//                       cursor: "pointer",
//                       transition: "0.2s",
//                       position: "relative",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.border = `1px solid ${t.color}60`;
//                       e.currentTarget.style.transform = "translateY(-2px)";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.border = `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`;
//                       e.currentTarget.style.transform = "none";
//                     }}
//                   >
//                     <div
//                       style={{
//                         height: 90,
//                         background: `linear-gradient(135deg, ${t.color}18, ${t.color}08)`,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         position: "relative",
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: 48,
//                           height: 48,
//                           borderRadius: 14,
//                           background: `${t.color}20`,
//                           border: `1.5px solid ${t.color}40`,
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <Icon size={22} color={t.color} />
//                       </div>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setStarred((s) =>
//                             isStarred
//                               ? s.filter((x) => x !== t.id)
//                               : [...s, t.id],
//                           );
//                         }}
//                         style={{
//                           position: "absolute",
//                           top: 6,
//                           right: 6,
//                           width: 24,
//                           height: 24,
//                           border: "none",
//                           borderRadius: 6,
//                           background: "transparent",
//                           cursor: "pointer",
//                           color: isStarred
//                             ? "#fbbf24"
//                             : isDark
//                               ? "rgba(255,255,255,0.3)"
//                               : "#cbd5e1",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <Star size={12} fill={isStarred ? "#fbbf24" : "none"} />
//                       </button>
//                     </div>
//                     <div style={{ padding: "8px 10px" }}>
//                       <div
//                         style={{
//                           fontSize: 11,
//                           fontWeight: 600,
//                           color: isDark ? "#e2e8f0" : "#1e293b",
//                           marginBottom: 3,
//                         }}
//                       >
//                         {t.title}
//                       </div>
//                       <div
//                         style={{
//                           fontSize: 9,
//                           color: isDark ? "#475569" : "#94a3b8",
//                           padding: "2px 6px",
//                           background: `${t.color}15`,
//                           borderRadius: 10,
//                           display: "inline-block",
//                         }}
//                       >
//                         {t.category}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── DIAGRAM MODAL ─────────────────────────────────────────────────────────────
// function DiagramModal({ isDark, onClose, onSelect }) {
//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 500,
//         background: "rgba(0,0,0,0.55)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backdropFilter: "blur(4px)",
//       }}
//     >
//       <div
//         style={{
//           width: "min(640px, 96vw)",
//           background: isDark ? "#0f172a" : "#ffffff",
//           borderRadius: 20,
//           border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
//           overflow: "hidden",
//           boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
//         }}
//       >
//         <div
//           style={{
//             padding: "20px 24px 16px",
//             borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <div>
//             <div
//               style={{
//                 fontSize: 18,
//                 fontWeight: 700,
//                 color: isDark ? "#f1f5f9" : "#0f172a",
//               }}
//             >
//               Diagrams
//             </div>
//             <div
//               style={{
//                 fontSize: 12,
//                 color: isDark ? "#475569" : "#94a3b8",
//                 marginTop: 2,
//               }}
//             >
//               Choose a diagram type to start with a structured template
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             style={{
//               width: 32,
//               height: 32,
//               borderRadius: 8,
//               border: "none",
//               cursor: "pointer",
//               background: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9",
//               color: isDark ? "#94a3b8" : "#64748b",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <X size={16} />
//           </button>
//         </div>
//         <div
//           style={{
//             padding: 20,
//             display: "grid",
//             gridTemplateColumns: "repeat(3, 1fr)",
//             gap: 12,
//           }}
//         >
//           {DIAGRAM_TYPES.map((d) => {
//             const Icon = d.icon;
//             return (
//               <button
//                 key={d.id}
//                 onClick={() => onSelect(d.id)}
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   gap: 10,
//                   padding: "18px 12px",
//                   borderRadius: 14,
//                   border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
//                   background: isDark ? "#1e293b" : "#f8fafc",
//                   cursor: "pointer",
//                   transition: "0.2s",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.background = `${d.color}12`;
//                   e.currentTarget.style.border = `1px solid ${d.color}50`;
//                   e.currentTarget.style.transform = "translateY(-2px)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.background = isDark
//                     ? "#1e293b"
//                     : "#f8fafc";
//                   e.currentTarget.style.border = `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`;
//                   e.currentTarget.style.transform = "none";
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 44,
//                     height: 44,
//                     borderRadius: 12,
//                     background: `${d.color}20`,
//                     border: `1.5px solid ${d.color}40`,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Icon size={20} color={d.color} />
//                 </div>
//                 <span
//                   style={{
//                     fontSize: 11,
//                     fontWeight: 600,
//                     color: isDark ? "#e2e8f0" : "#1e293b",
//                     textAlign: "center",
//                   }}
//                 >
//                   {d.label}
//                 </span>
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── MAIN EXPORT ───────────────────────────────────────────────────────────────
// export default function WhiteboardPanel({ t, isDark, sessionId }) {
//   const [view, setView] = useState("dashboard");
//   const [activeBoardId, setActiveBoardId] = useState(null);
//   const [connected, setConnected] = useState(false);
//   const [stompClient, setStompClient] = useState(null);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [activeSidebarItem, setActiveSidebarItem] = useState("Recent");
//   const [boards, setBoards] = useState(() => {
//     try {
//       const saved = localStorage.getItem("whiteboards");
//       if (saved) {
//         const parsed = JSON.parse(saved);
//         if (Array.isArray(parsed) && parsed.length > 0) return parsed;
//       }
//     } catch {}
//     return MOCK_BOARDS;
//   });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showTemplates, setShowTemplates] = useState(false);
//   const [showDiagrams, setShowDiagrams] = useState(false);
//   const [editorTitle, setEditorTitle] = useState("Untitled Whiteboard");
//   const [renamingId, setRenamingId] = useState(null);
//   const [renameVal, setRenameVal] = useState("");
//   const [presentMode, setPresentMode] = useState(false);
//   const [currentTemplateShapes, setCurrentTemplateShapes] = useState([]);
//   const [editorKey, setEditorKey] = useState(0);
//   const [editorSaveStatus, setEditorSaveStatus] = useState("saved");
//   const fileInputRef = useRef(null);

//   // ── PROJECTS STATE (BUG 4 FIX) ────────────────────────────────────────────
//   const [projects, setProjects] = useState(() => {
//     try {
//       const saved = localStorage.getItem("whiteboardProjects");
//       if (saved) {
//         const parsed = JSON.parse(saved);
//         return Array.from(new Set([...DEFAULT_PROJECTS, ...parsed]));
//       }
//     } catch {}
//     return [...DEFAULT_PROJECTS];
//   });

//   // ── TOAST ─────────────────────────────────────────────────────────────────
//   const [dashToast, setDashToast] = useState(null);
//   function showDashToast(message, type = "success") {
//     setDashToast({ message, type });
//     window.clearTimeout(showDashToast._timer);
//     showDashToast._timer = window.setTimeout(() => setDashToast(null), 2500);
//   }

//   const [selectedProject, setSelectedProject] = useState(null);

//   const userName = (() => {
//     try {
//       return (
//         JSON.parse(localStorage.getItem("lms_user") || "{}").email || "trainer"
//       );
//     } catch {
//       return "trainer";
//     }
//   })();

//   useEffect(() => {
//     const client = new Client({
//       brokerURL: WS_URL,
//       reconnectDelay: 5000,
//       onConnect: () => setConnected(true),
//       onDisconnect: () => setConnected(false),
//     });
//     client.activate();
//     setStompClient(client);
//     return () => client.deactivate();
//   }, [sessionId]);

//   // Persist boards to localStorage when they change
//   useEffect(() => {
//     try {
//       localStorage.setItem("whiteboards", JSON.stringify(boards));
//     } catch {}
//   }, [boards]);

//   const filteredBoards = boards.filter((b) => {
//     if (
//       searchQuery &&
//       !b.title.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//       return false;
//     if (activeSidebarItem === "Starred") return b.starred;
//     if (activeSidebarItem === "Trash") return false;
//     if (activeSidebarItem === "My Whiteboards") return true;
//     if (activeSidebarItem === "Shared With Me") return false;
//     if (projects.includes(activeSidebarItem))
//       return b.project === activeSidebarItem;
//     return true;
//   });

//   const openBoard = (board) => {
//     const shapes = board.templateId ? getTemplateShapes(board.templateId) : [];
//     setActiveBoardId(board.id);
//     setEditorTitle(board.title);
//     setCurrentTemplateShapes(shapes);
//     setSelectedProject(board.project || null);
//     setEditorKey((k) => k + 1);
//     setEditorSaveStatus("saved");
//     setView("editor");
//   };

//   const createNew = (
//     title = "Untitled Whiteboard",
//     templateId = null,
//     project = null,
//   ) => {
//     const shapes = templateId ? getTemplateShapes(templateId) : [];
//     const newId = makeId();
//     const nb = {
//       id: newId,
//       title,
//       owner: "Trainer",
//       modified: "Just now",
//       starred: false,
//       project: project || selectedProject || null,
//       thumbnail: "flow",
//       templateId: templateId || null,
//     };
//     setBoards((b) => {
//       const updated = [nb, ...b];
//       try {
//         localStorage.setItem("whiteboards", JSON.stringify(updated));
//       } catch {}
//       return updated;
//     });
//     setActiveBoardId(newId);
//     setEditorTitle(title);
//     setCurrentTemplateShapes(shapes);
//     setSelectedProject(nb.project);
//     setEditorKey((k) => k + 1);
//     setEditorSaveStatus("saved");
//     setView("editor");
//   };

//   // ── NEW PROJECT HANDLER (BUG 4 FIX) ───────────────────────────────────────
//   function handleCreateProject() {
//     const name = window.prompt("Enter project name:");
//     if (!name) return;
//     const cleanName = name.trim();
//     if (!cleanName) return;
//     const exists = projects.some(
//       (p) => p.toLowerCase() === cleanName.toLowerCase(),
//     );
//     if (exists) {
//       showDashToast("Project already exists", "error");
//       setActiveSidebarItem(cleanName);
//       setSelectedProject(cleanName);
//       return;
//     }
//     const updated = [...projects, cleanName];
//     setProjects(updated);
//     try {
//       localStorage.setItem("whiteboardProjects", JSON.stringify(updated));
//     } catch {}
//     setActiveSidebarItem(cleanName);
//     setSelectedProject(cleanName);
//     showDashToast(`Project "${cleanName}" created`);
//   }

//   const toggleStar = (id) =>
//     setBoards((b) =>
//       b.map((x) => (x.id === id ? { ...x, starred: !x.starred } : x)),
//     );
//   const deleteBoard = (id) => setBoards((b) => b.filter((x) => x.id !== id));
//   const duplicateBoard = (id) => {
//     const orig = boards.find((x) => x.id === id);
//     if (orig)
//       setBoards((b) => [
//         { ...orig, id: makeId(), title: orig.title + " (copy)" },
//         ...b,
//       ]);
//   };
//   const startRename = (board) => {
//     setRenamingId(board.id);
//     setRenameVal(board.title);
//   };
//   const confirmRename = () => {
//     if (renamingId) {
//       setBoards((b) =>
//         b.map((x) => (x.id === renamingId ? { ...x, title: renameVal } : x)),
//       );
//       if (renamingId === activeBoardId) setEditorTitle(renameVal);
//       setRenamingId(null);
//     }
//   };

//   const sidebarItems = [
//     { label: "All Whiteboards", icon: Grid },
//     { label: "Recent", icon: Clock },
//     { label: "My Whiteboards", icon: Home },
//     { label: "Shared With Me", icon: Users },
//     { label: "Starred", icon: Star },
//     { label: "Trash", icon: Trash2 },
//   ];

//   // Save status label for editor header
//   const editorSaveLabel =
//     editorSaveStatus === "saving"
//       ? "Saving..."
//       : editorSaveStatus === "error"
//         ? "Save failed"
//         : editorSaveStatus === "dirty"
//           ? "Unsaved changes"
//           : "Auto-saved";
//   const editorSaveColor =
//     editorSaveStatus === "error"
//       ? "#f87171"
//       : editorSaveStatus === "dirty"
//         ? "#fbbf24"
//         : editorSaveStatus === "saving"
//           ? "#60a5fa"
//           : "#22c55e";

//   if (presentMode && view === "editor") {
//     return (
//       <div
//         style={{
//           position: "fixed",
//           inset: 0,
//           zIndex: 9999,
//           background: isDark ? "#0f172a" : "#ffffff",
//         }}
//       >
//         <div style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
//           <button
//             onClick={() => setPresentMode(false)}
//             style={{
//               padding: "8px 18px",
//               borderRadius: 10,
//               border: "none",
//               cursor: "pointer",
//               background: "rgba(248,113,113,0.15)",
//               color: "#f87171",
//               fontWeight: 600,
//               fontSize: 12,
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//             }}
//           >
//             <X size={14} /> Exit Present
//           </button>
//         </div>
//         <CanvasWhiteboard
//           key={`present-${editorKey}`}
//           sessionId={sessionId}
//           stompClient={stompClient}
//           connected={connected}
//           isDark={isDark}
//           userName={userName}
//           userRole="TRAINER"
//           initialShapes={currentTemplateShapes}
//           whiteboardId={activeBoardId}
//           whiteboardTitle={editorTitle}
//           selectedProject={selectedProject}
//         />
//       </div>
//     );
//   }

//   if (view === "editor") {
//     return (
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           height: "calc(100vh - 120px)",
//           minHeight: 560,
//           position: "relative",
//           background: isDark ? "#0f172a" : "#f8fafc",
//         }}
//       >
//         {/* ── EDITOR TOP BAR ── */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//             padding: "0 16px",
//             height: 52,
//             flexShrink: 0,
//             background: isDark ? "#0f172a" : "#ffffff",
//             borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
//           }}
//         >
//           <button
//             onClick={() => setView("dashboard")}
//             style={{
//               width: 32,
//               height: 32,
//               border: "none",
//               borderRadius: 8,
//               cursor: "pointer",
//               background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
//               color: isDark ? "#94a3b8" : "#475569",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <ChevronLeft size={16} />
//           </button>
//           <div style={{ position: "relative" }}>
//             {renamingId === activeBoardId ? (
//               <input
//                 value={renameVal}
//                 onChange={(e) => setRenameVal(e.target.value)}
//                 onBlur={confirmRename}
//                 onKeyDown={(e) => e.key === "Enter" && confirmRename()}
//                 autoFocus
//                 style={{
//                   fontSize: 14,
//                   fontWeight: 600,
//                   color: isDark ? "#f1f5f9" : "#0f172a",
//                   background: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9",
//                   border: "1px solid #3b82f6",
//                   borderRadius: 6,
//                   padding: "3px 8px",
//                   outline: "none",
//                   minWidth: 200,
//                 }}
//               />
//             ) : (
//               <button
//                 onClick={() =>
//                   startRename({ id: activeBoardId, title: editorTitle })
//                 }
//                 style={{
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   fontSize: 14,
//                   fontWeight: 600,
//                   color: isDark ? "#f1f5f9" : "#0f172a",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 6,
//                 }}
//               >
//                 {editorTitle}
//                 <Pencil size={11} color="#64748b" />
//               </button>
//             )}
//           </div>
//           {/* ── SAVE STATUS INDICATOR (BUG 2 FIX) ── */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 4,
//               marginLeft: 4,
//             }}
//           >
//             <div
//               style={{
//                 width: 6,
//                 height: 6,
//                 borderRadius: "50%",
//                 background: editorSaveColor,
//               }}
//             />
//             <span
//               style={{ fontSize: 10, color: editorSaveColor, fontWeight: 600 }}
//             >
//               {editorSaveLabel}
//             </span>
//           </div>
//           {/* ── RIGHT SIDE: removed Share button and Settings icon (BUG 3 FIX) ── */}
//           <div
//             style={{
//               marginLeft: "auto",
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 4,
//                 padding: "4px 10px",
//                 borderRadius: 8,
//                 background: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9",
//                 border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
//               }}
//             >
//               <Users size={12} color="#3b82f6" />
//               <span style={{ fontSize: 11, fontWeight: 600, color: "#3b82f6" }}>
//                 1 online
//               </span>
//             </div>
//             <button
//               onClick={() => setPresentMode(true)}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 padding: "6px 14px",
//                 borderRadius: 9,
//                 border: "none",
//                 cursor: "pointer",
//                 background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
//                 color: isDark ? "#e2e8f0" : "#334155",
//                 fontSize: 12,
//                 fontWeight: 600,
//               }}
//             >
//               <Play size={12} /> Present
//             </button>
//             {/* Share and Settings intentionally removed per BUG 3 */}
//           </div>
//         </div>
//         <div style={{ flex: 1, overflow: "hidden" }}>
//           <CanvasWhiteboard
//             key={editorKey}
//             sessionId={sessionId}
//             stompClient={stompClient}
//             connected={connected}
//             isDark={isDark}
//             userName={userName}
//             userRole="TRAINER"
//             initialShapes={currentTemplateShapes}
//             whiteboardId={activeBoardId}
//             whiteboardTitle={editorTitle}
//             selectedProject={selectedProject}
//             onSaveStatusChange={setEditorSaveStatus}
//           />
//         </div>
//       </div>
//     );
//   }

//   // ── DASHBOARD ─────────────────────────────────────────────────────────────
//   return (
//     <div
//       style={{
//         display: "flex",
//         height: "calc(100vh - 120px)",
//         minHeight: 560,
//         background: isDark ? "#0a0f1e" : "#f8fafc",
//         overflow: "hidden",
//       }}
//     >
//       {/* ── LEFT SIDEBAR ── */}
//       <div
//         style={{
//           width: sidebarCollapsed ? 52 : 230,
//           flexShrink: 0,
//           transition: "width 0.25s ease",
//           background: isDark ? "#0f172a" : "#ffffff",
//           borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "#e2e8f0"}`,
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: sidebarCollapsed ? "center" : "space-between",
//             padding: sidebarCollapsed ? "16px 8px" : "16px 14px 12px",
//             borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
//           }}
//         >
//           {!sidebarCollapsed && (
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <div
//                 style={{
//                   width: 28,
//                   height: 28,
//                   borderRadius: 8,
//                   background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <Grid size={14} color="#fff" />
//               </div>
//               <span
//                 style={{
//                   fontSize: 14,
//                   fontWeight: 700,
//                   color: isDark ? "#f1f5f9" : "#0f172a",
//                 }}
//               >
//                 Whiteboards
//               </span>
//             </div>
//           )}
//           <button
//             onClick={() => setSidebarCollapsed((s) => !s)}
//             style={{
//               width: 28,
//               height: 28,
//               borderRadius: 7,
//               border: "none",
//               cursor: "pointer",
//               background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
//               color: isDark ? "#64748b" : "#94a3b8",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexShrink: 0,
//             }}
//           >
//             {sidebarCollapsed ? (
//               <ChevronRight size={13} />
//             ) : (
//               <ChevronLeft size={13} />
//             )}
//           </button>
//         </div>
//         {!sidebarCollapsed && (
//           <div style={{ padding: "10px 12px 6px" }}>
//             <button
//               onClick={() => createNew()}
//               style={{
//                 width: "100%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: 6,
//                 padding: "8px",
//                 borderRadius: 10,
//                 border: "none",
//                 cursor: "pointer",
//                 background: "#3b82f6",
//                 color: "#fff",
//                 fontSize: 12,
//                 fontWeight: 600,
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = "#2563eb";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = "#3b82f6";
//               }}
//             >
//               <Plus size={14} /> New Whiteboard
//             </button>
//           </div>
//         )}
//         <div
//           style={{
//             flex: 1,
//             overflowY: "auto",
//             padding: sidebarCollapsed ? "8px 6px" : "6px 8px",
//           }}
//         >
//           {sidebarItems.map(({ label, icon: Icon }) => {
//             const active = activeSidebarItem === label;
//             return (
//               <button
//                 key={label}
//                 onClick={() => setActiveSidebarItem(label)}
//                 title={sidebarCollapsed ? label : undefined}
//                 style={{
//                   width: "100%",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: sidebarCollapsed ? 0 : 9,
//                   padding: sidebarCollapsed ? "8px 0" : "8px 10px",
//                   borderRadius: 9,
//                   border: "none",
//                   cursor: "pointer",
//                   justifyContent: sidebarCollapsed ? "center" : "flex-start",
//                   marginBottom: 2,
//                   background: active
//                     ? isDark
//                       ? "rgba(59,130,246,0.15)"
//                       : "rgba(59,130,246,0.08)"
//                     : "transparent",
//                   color: active ? "#3b82f6" : isDark ? "#64748b" : "#64748b",
//                   fontSize: 12,
//                   fontWeight: active ? 600 : 500,
//                 }}
//               >
//                 <Icon size={15} color={active ? "#3b82f6" : undefined} />
//                 {!sidebarCollapsed && <span>{label}</span>}
//                 {!sidebarCollapsed && active && (
//                   <span
//                     style={{
//                       marginLeft: "auto",
//                       width: 4,
//                       height: 4,
//                       borderRadius: "50%",
//                       background: "#3b82f6",
//                     }}
//                   />
//                 )}
//               </button>
//             );
//           })}
//           {!sidebarCollapsed && (
//             <div style={{ marginTop: 10 }}>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   padding: "4px 10px",
//                   marginBottom: 4,
//                 }}
//               >
//                 <span
//                   style={{
//                     fontSize: 10,
//                     fontWeight: 700,
//                     color: isDark ? "#334155" : "#94a3b8",
//                     textTransform: "uppercase",
//                     letterSpacing: "0.08em",
//                   }}
//                 >
//                   Projects
//                 </span>
//                 {/* New Project button in sidebar */}
//                 <button
//                   onClick={handleCreateProject}
//                   title="New Project"
//                   style={{
//                     width: 18,
//                     height: 18,
//                     border: "none",
//                     borderRadius: 5,
//                     cursor: "pointer",
//                     background: "transparent",
//                     color: isDark ? "#334155" : "#94a3b8",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Plus size={11} />
//                 </button>
//               </div>
//               {/* Render from projects state (BUG 4 FIX) */}
//               {projects.map((p) => (
//                 <button
//                   key={p}
//                   onClick={() => {
//                     setActiveSidebarItem(p);
//                     setSelectedProject(p);
//                   }}
//                   style={{
//                     width: "100%",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 8,
//                     padding: "6px 10px",
//                     borderRadius: 8,
//                     border: "none",
//                     cursor: "pointer",
//                     background:
//                       activeSidebarItem === p
//                         ? isDark
//                           ? "rgba(59,130,246,0.12)"
//                           : "rgba(59,130,246,0.06)"
//                         : "transparent",
//                     color:
//                       activeSidebarItem === p
//                         ? "#3b82f6"
//                         : isDark
//                           ? "#475569"
//                           : "#64748b",
//                     fontSize: 11,
//                     marginBottom: 1,
//                     textAlign: "left",
//                   }}
//                 >
//                   <FolderOpen
//                     size={13}
//                     color={activeSidebarItem === p ? "#3b82f6" : "#64748b"}
//                   />
//                   <span
//                     style={{
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {p}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── MAIN CONTENT ── */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 8,
//             padding: "14px 20px 10px",
//             background: isDark ? "#0f172a" : "#ffffff",
//             borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "#e2e8f0"}`,
//             flexShrink: 0,
//             flexWrap: "wrap",
//           }}
//         >
//           <h2
//             style={{
//               fontSize: 16,
//               fontWeight: 700,
//               color: isDark ? "#f1f5f9" : "#0f172a",
//               margin: 0,
//               minWidth: 80,
//             }}
//           >
//             {activeSidebarItem}
//           </h2>
//           <div style={{ flex: 1 }} />
//           {[
//             {
//               label: "New Whiteboard",
//               icon: Plus,
//               color: "#3b82f6",
//               action: () => createNew(),
//             },
//             {
//               label: "Templates",
//               icon: FileText,
//               color: "#8b5cf6",
//               action: () => setShowTemplates(true),
//             },
//             {
//               label: "Diagram",
//               icon: GitBranch,
//               color: "#10b981",
//               action: () => setShowDiagrams(true),
//             },
//             {
//               label: "New Project",
//               icon: FolderOpen,
//               color: "#f59e0b",
//               action: handleCreateProject,
//             },
//             {
//               label: "Import",
//               icon: Upload,
//               color: "#ec4899",
//               action: () => fileInputRef.current?.click(),
//             },
//           ].map(({ label, icon: Icon, color, action }) => (
//             <button
//               key={label}
//               onClick={action}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 padding: "7px 14px",
//                 borderRadius: 10,
//                 border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
//                 background: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
//                 color: isDark ? "#e2e8f0" : "#334155",
//                 fontSize: 12,
//                 fontWeight: 600,
//                 cursor: "pointer",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = `${color}12`;
//                 e.currentTarget.style.border = `1px solid ${color}50`;
//                 e.currentTarget.style.color = color;
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = isDark
//                   ? "rgba(255,255,255,0.03)"
//                   : "#f8fafc";
//                 e.currentTarget.style.border = `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`;
//                 e.currentTarget.style.color = isDark ? "#e2e8f0" : "#334155";
//               }}
//             >
//               <Icon size={13} color={color} />
//               {label}
//             </button>
//           ))}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//               padding: "6px 12px",
//               borderRadius: 10,
//               background: connected
//                 ? "rgba(34,197,94,0.08)"
//                 : "rgba(248,113,113,0.08)",
//               border: `1px solid ${connected ? "rgba(34,197,94,0.2)" : "rgba(248,113,113,0.2)"}`,
//             }}
//           >
//             {connected ? (
//               <Wifi size={11} color="#22c55e" />
//             ) : (
//               <WifiOff size={11} color="#f87171" />
//             )}
//             <span
//               style={{
//                 fontSize: 10,
//                 fontWeight: 700,
//                 color: connected ? "#22c55e" : "#f87171",
//               }}
//             >
//               {connected ? "LIVE SYNC" : "OFFLINE"}
//             </span>
//           </div>
//         </div>
//         <div
//           style={{
//             padding: "12px 20px 8px",
//             background: isDark ? "#0f172a" : "#ffffff",
//             borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"}`,
//             flexShrink: 0,
//           }}
//         >
//           <div style={{ position: "relative", maxWidth: 360 }}>
//             <Search
//               size={14}
//               style={{
//                 position: "absolute",
//                 left: 12,
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 color: "#64748b",
//               }}
//             />
//             <input
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search whiteboards..."
//               style={{
//                 width: "100%",
//                 padding: "9px 12px 9px 36px",
//                 borderRadius: 12,
//                 border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
//                 background: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc",
//                 color: isDark ? "#f1f5f9" : "#0f172a",
//                 fontSize: 12,
//                 outline: "none",
//                 boxSizing: "border-box",
//               }}
//             />
//           </div>
//         </div>
//         <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
//           {filteredBoards.length === 0 ? (
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 height: 300,
//                 gap: 14,
//               }}
//             >
//               <div
//                 style={{
//                   width: 60,
//                   height: 60,
//                   borderRadius: 16,
//                   background: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <Grid size={24} color={isDark ? "#334155" : "#cbd5e1"} />
//               </div>
//               <div style={{ textAlign: "center" }}>
//                 <div
//                   style={{
//                     fontSize: 14,
//                     fontWeight: 600,
//                     color: isDark ? "#475569" : "#94a3b8",
//                     marginBottom: 6,
//                   }}
//                 >
//                   No whiteboards found
//                 </div>
//                 <div
//                   style={{
//                     fontSize: 12,
//                     color: isDark ? "#334155" : "#cbd5e1",
//                   }}
//                 >
//                   Create a new whiteboard or choose a template
//                 </div>
//               </div>
//               <button
//                 onClick={() => createNew()}
//                 style={{
//                   padding: "8px 20px",
//                   borderRadius: 10,
//                   border: "none",
//                   cursor: "pointer",
//                   background: "#3b82f6",
//                   color: "#fff",
//                   fontSize: 12,
//                   fontWeight: 600,
//                 }}
//               >
//                 + New Whiteboard
//               </button>
//             </div>
//           ) : (
//             <>
//               <div
//                 style={{
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: isDark ? "#334155" : "#94a3b8",
//                   marginBottom: 12,
//                   textTransform: "uppercase",
//                   letterSpacing: "0.07em",
//                 }}
//               >
//                 {projects.includes(activeSidebarItem)
//                   ? activeSidebarItem
//                   : "Today"}
//               </div>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
//                   gap: 16,
//                 }}
//               >
//                 {filteredBoards.map((board) =>
//                   renamingId === board.id ? (
//                     <div
//                       key={board.id}
//                       style={{
//                         borderRadius: 14,
//                         border: "1px solid #3b82f6",
//                         padding: 16,
//                         background: isDark ? "#1e293b" : "#fff",
//                       }}
//                     >
//                       <input
//                         value={renameVal}
//                         onChange={(e) => setRenameVal(e.target.value)}
//                         onBlur={confirmRename}
//                         onKeyDown={(e) => e.key === "Enter" && confirmRename()}
//                         autoFocus
//                         style={{
//                           width: "100%",
//                           fontSize: 13,
//                           fontWeight: 600,
//                           padding: "6px 10px",
//                           borderRadius: 8,
//                           border: "1px solid #3b82f6",
//                           background: isDark
//                             ? "rgba(255,255,255,0.08)"
//                             : "#f8fafc",
//                           color: isDark ? "#f1f5f9" : "#0f172a",
//                           outline: "none",
//                           boxSizing: "border-box",
//                         }}
//                       />
//                     </div>
//                   ) : (
//                     <WhiteboardCard
//                       key={board.id}
//                       board={board}
//                       isDark={isDark}
//                       onOpen={() => openBoard(board)}
//                       onStar={() => toggleStar(board.id)}
//                       onDelete={() => deleteBoard(board.id)}
//                       onDuplicate={() => duplicateBoard(board.id)}
//                       onRename={() => startRename(board)}
//                     />
//                   ),
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {showTemplates && (
//         <TemplatesModal
//           isDark={isDark}
//           onClose={() => setShowTemplates(false)}
//           onSelect={(id) => {
//             setShowTemplates(false);
//             createNew(
//               TEMPLATES.find((t) => t.id === id)?.title || "New Whiteboard",
//               id,
//             );
//           }}
//         />
//       )}
//       {showDiagrams && (
//         <DiagramModal
//           isDark={isDark}
//           onClose={() => setShowDiagrams(false)}
//           onSelect={(id) => {
//             setShowDiagrams(false);
//             createNew(
//               DIAGRAM_TYPES.find((d) => d.id === id)?.label || "New Diagram",
//               id,
//             );
//           }}
//         />
//       )}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept=".json,.png,.svg,.jpg"
//         style={{ display: "none" }}
//         onChange={() => createNew("Imported Board")}
//       />

//       {/* ── DASHBOARD TOAST ── */}
//       {dashToast && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: 24,
//             right: 24,
//             zIndex: 9999,
//             borderRadius: 12,
//             padding: "10px 18px",
//             fontSize: 13,
//             fontWeight: 600,
//             boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
//             background: dashToast.type === "error" ? "#dc2626" : "#1e293b",
//             color: "#fff",
//             pointerEvents: "none",
//           }}
//         >
//           {dashToast.message}
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import {
  Layout,
  GitBranch,
  FolderOpen,
  Upload,
  Download,
  Trash2,
  Users,
  Wifi,
  WifiOff,
  Save,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  FileText,
  Box,
  Pencil,
  AlignLeft,
  RotateCcw,
  RotateCw,
  Hand,
  Eraser,
  Pen,
  Star,
  Clock,
  Grid,
  Search,
  Plus,
  MoreHorizontal,
  ArrowRight,
  Triangle,
  Circle,
  Square,
  Hexagon,
  Diamond,
  Type,
  StickyNote,
  MessageSquare,
  Layers,
  Image,
  ChevronRight,
  ChevronLeft,
  Copy,
  Move,
  Lock,
  Trash,
  Globe,
  Zap,
  Monitor,
  Network,
  Cpu,
  Database,
  Activity,
  Minus,
  Hash,
  Home,
  MousePointer,
  Highlighter,
  ArrowUpRight,
  Frame,
  Navigation,
  History,
  Play,
  ChevronDown,
  BarChart2,
  Workflow,
  Share2,
  Bold,
  Italic,
  AlignCenter,
  Presentation,
} from "lucide-react";

import {
  getWhiteboardState,
  saveWhiteboardSnapshot,
  clearWhiteboardSession,
} from "../services/liveSessionService";

const WS_URL =
  (import.meta.env.VITE_WS_BASE_URL || "ws://localhost:9000") + "/live-chat";

// ── CURSOR HELPERS ─────────────────────────────────────────────────────────
const PEN_CURSOR =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M4 20L6.5 14.5L16.8 4.2C17.6 3.4 18.9 3.4 19.7 4.2C20.5 5 20.5 6.3 19.7 7.1L9.4 17.4L4 20Z' fill='white' stroke='%23111827' stroke-width='1.8' stroke-linejoin='round'/%3E%3Cpath d='M14.8 6.2L17.7 9.1' stroke='%23111827' stroke-width='1.8' stroke-linecap='round'/%3E%3Ccircle cx='5.2' cy='18.8' r='1.5' fill='%232563eb'/%3E%3C/svg%3E\") 3 21, crosshair";
const HIGHLIGHTER_CURSOR =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M5 19L7 14L15.5 5.5C16.3 4.7 17.6 4.7 18.4 5.5C19.2 6.3 19.2 7.6 18.4 8.4L10 16.8L5 19Z' fill='%23bbf7d0' stroke='%23111827' stroke-width='1.8' stroke-linejoin='round'/%3E%3Cpath d='M13.8 7.2L16.7 10.1' stroke='%23111827' stroke-width='1.8' stroke-linecap='round'/%3E%3Cpath d='M4 21H13' stroke='%2322c55e' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E\") 4 20, crosshair";
const ERASER_CURSOR =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M4.5 14.5L12.5 6.5C13.3 5.7 14.6 5.7 15.4 6.5L19 10.1C19.8 10.9 19.8 12.2 19 13L12 20H7.5L4.5 17C3.8 16.3 3.8 15.2 4.5 14.5Z' fill='white' stroke='%23111827' stroke-width='1.8' stroke-linejoin='round'/%3E%3Cpath d='M9 10L15.5 16.5' stroke='%23111827' stroke-width='1.5' stroke-linecap='round'/%3E%3Cpath d='M12 20H21' stroke='%23111827' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E\") 8 8, cell";

function getCanvasCursor(activeTool, isPanning) {
  if (isPanning) return "grabbing";
  switch (activeTool) {
    case "pen":
    case "pencil":
      return PEN_CURSOR;
    case "highlighter":
      return HIGHLIGHTER_CURSOR;
    case "eraser":
      return ERASER_CURSOR;
    case "hand":
      return "grab";
    case "select":
      return "default";
    case "text":
      return "text";
    case "arrow":
    case "connector":
    case "frame":
      return "crosshair";
    case "sticky":
    case "comment":
    case "equation":
      return "cell";
    default:
      return "default";
  }
}

// ── SMOOTH PATH DRAWING ────────────────────────────────────────────────────
function drawSmoothPath(ctx, points, options) {
  if (!points || points.length === 0) return;
  const {
    color = "#2563eb",
    width = 3,
    zoom = 1,
    panOffset = { x: 0, y: 0 },
    tool = "pen",
  } = options || {};
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, width * zoom);
  if (tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.lineWidth = Math.max(8, width * zoom * 3);
  }
  if (tool === "highlighter") {
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = Math.max(8, width * zoom * 3);
  }
  const tx = (p) => p.x * zoom + panOffset.x;
  const ty = (p) => p.y * zoom + panOffset.y;
  if (points.length === 1) {
    const p = points[0];
    ctx.beginPath();
    ctx.arc(tx(p), ty(p), ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
    ctx.restore();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(tx(points[0]), ty(points[0]));
  if (points.length === 2) {
    ctx.lineTo(tx(points[1]), ty(points[1]));
    ctx.stroke();
    ctx.restore();
    return;
  }
  for (let i = 1; i < points.length - 1; i++) {
    const cur = points[i];
    const nxt = points[i + 1];
    const mx = (tx(cur) + tx(nxt)) / 2;
    const my = (ty(cur) + ty(nxt)) / 2;
    ctx.quadraticCurveTo(tx(cur), ty(cur), mx, my);
  }
  ctx.lineTo(tx(points[points.length - 1]), ty(points[points.length - 1]));
  ctx.stroke();
  ctx.restore();
}

const MIN_DIST = 1.2;
function shouldAdd(last, next) {
  if (!last) return true;
  return Math.hypot(next.x - last.x, next.y - last.y) >= MIN_DIST;
}

// ── SHAPE DRAWING ──────────────────────────────────────────────────────────
const HANDLE_SIZE = 8;

function drawShapeOnCanvas(ctx, shape, zoom, pan, isDark, isSelected) {
  const px = (x) => x * zoom + pan.x;
  const py = (y) => y * zoom + pan.y;
  const sc = (v) => v * zoom;
  ctx.save();

  if (shape.type === "rect_shape") {
    const x = px(shape.x),
      y = py(shape.y),
      w = sc(shape.w),
      h = sc(shape.h);
    ctx.fillStyle = shape.fill || shape.color + "20";
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, sc(shape.rx || 0));
    else ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();
    if (shape.label) {
      ctx.fillStyle = shape.color;
      ctx.font = `${Math.max(10, sc(11))}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(shape.label, x + w / 2, y + h / 2);
    }
  } else if (shape.type === "triangle_shape") {
    const x = px(shape.x),
      y = py(shape.y),
      w = sc(shape.w),
      h = sc(shape.h);
    ctx.fillStyle = shape.fill || shape.color + "20";
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (shape.label) {
      ctx.fillStyle = shape.color;
      ctx.font = `${Math.max(9, sc(10))}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(shape.label, x + w / 2, y + h * 0.67);
    }
  } else if (shape.type === "polygon_shape") {
    const cx = px(shape.x + shape.w / 2),
      cy = py(shape.y + shape.h / 2);
    const rx = sc(shape.w / 2),
      ry = sc(shape.h / 2);
    const sides = shape.sides || 6;
    ctx.fillStyle = shape.fill || shape.color + "20";
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const a = (Math.PI * 2 * i) / sides - Math.PI / 2;
      if (i === 0) ctx.moveTo(cx + rx * Math.cos(a), cy + ry * Math.sin(a));
      else ctx.lineTo(cx + rx * Math.cos(a), cy + ry * Math.sin(a));
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (shape.label) {
      ctx.fillStyle = shape.color;
      ctx.font = `${Math.max(9, sc(10))}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(shape.label, cx, cy);
    }
  } else if (shape.type === "star_shape") {
    const cx = px(shape.x + shape.w / 2),
      cy = py(shape.y + shape.h / 2);
    const outer = sc(Math.min(shape.w, shape.h) / 2);
    const inner = outer * 0.4;
    const pts = shape.points || 5;
    ctx.fillStyle = shape.fill || shape.color + "20";
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < pts * 2; i++) {
      const a = (Math.PI * i) / pts - Math.PI / 2;
      const r = i % 2 === 0 ? outer : inner;
      if (i === 0) ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      else ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (shape.type === "diamond_shape") {
    const cx = px(shape.x + shape.w / 2),
      cy = py(shape.y + shape.h / 2);
    const hw = sc(shape.w / 2),
      hh = sc(shape.h / 2);
    ctx.fillStyle = shape.fill || shape.color + "20";
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - hh);
    ctx.lineTo(cx + hw, cy);
    ctx.lineTo(cx, cy + hh);
    ctx.lineTo(cx - hw, cy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (shape.label) {
      ctx.fillStyle = shape.color;
      ctx.font = `${Math.max(9, sc(10))}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(shape.label, cx, cy);
    }
  } else if (shape.type === "bubble_shape") {
    const cx = px(shape.x),
      cy = py(shape.y);
    ctx.fillStyle = shape.fill || shape.color + "20";
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, sc(shape.rx), sc(shape.ry), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (shape.label) {
      ctx.fillStyle = shape.color;
      ctx.font = `bold ${Math.max(9, sc(10))}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(shape.label, cx, cy);
    }
  } else if (shape.type === "class_shape") {
    const x = px(shape.x),
      y = py(shape.y),
      w = sc(shape.w),
      h = sc(shape.h);
    ctx.fillStyle = isDark ? "#1e293b" : "#fff";
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, sc(3));
    else ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = shape.color + "25";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, sc(24), [sc(3), sc(3), 0, 0]);
    else ctx.rect(x, y, w, sc(24));
    ctx.fill();
    ctx.fillStyle = shape.color;
    ctx.font = `bold ${Math.max(9, sc(11))}px system-ui`;
    ctx.textAlign = "center";
    ctx.fillText(shape.label, x + w / 2, y + sc(15));
    ctx.strokeStyle = shape.color + "60";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + sc(24));
    ctx.lineTo(x + w, y + sc(24));
    ctx.stroke();
    ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
    ctx.font = `${Math.max(8, sc(9))}px system-ui`;
    ctx.textAlign = "left";
    (shape.attrs || []).forEach((a, i) =>
      ctx.fillText(a, x + sc(6), y + sc(36) + i * sc(14)),
    );
    const mdY = y + sc(24) + sc((shape.attrs || []).length * 14) + sc(4);
    if ((shape.methods || []).length > 0) {
      ctx.strokeStyle = shape.color + "60";
      ctx.beginPath();
      ctx.moveTo(x, mdY);
      ctx.lineTo(x + w, mdY);
      ctx.stroke();
      ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
      (shape.methods || []).forEach((m, i) =>
        ctx.fillText(m, x + sc(6), mdY + sc(12) + i * sc(14)),
      );
    }
  } else if (shape.type === "er_entity") {
    const x = px(shape.x),
      y = py(shape.y),
      w = sc(shape.w),
      h = sc(shape.h);
    ctx.fillStyle = isDark ? "#1e293b" : "#fff";
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, sc(3));
    else ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = shape.color + "25";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, sc(20), [sc(3), sc(3), 0, 0]);
    else ctx.rect(x, y, w, sc(20));
    ctx.fill();
    ctx.fillStyle = shape.color;
    ctx.font = `bold ${Math.max(9, sc(11))}px system-ui`;
    ctx.textAlign = "center";
    ctx.fillText(shape.label, x + w / 2, y + sc(13));
    ctx.strokeStyle = shape.color + "60";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + sc(20));
    ctx.lineTo(x + w, y + sc(20));
    ctx.stroke();
    ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
    ctx.font = `${Math.max(8, sc(9))}px system-ui`;
    ctx.textAlign = "left";
    (shape.attrs || []).forEach((a, i) =>
      ctx.fillText(a, x + sc(6), y + sc(32) + i * sc(13)),
    );
  } else if (shape.type === "er_relation") {
    const cx = px(shape.x + shape.w / 2),
      cy = py(shape.y + shape.h / 2);
    const hw = sc(shape.w / 2),
      hh = sc(shape.h / 2);
    ctx.fillStyle = shape.color + "20";
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - hh);
    ctx.lineTo(cx + hw, cy);
    ctx.lineTo(cx, cy + hh);
    ctx.lineTo(cx - hw, cy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = shape.color;
    ctx.font = `${Math.max(9, sc(10))}px system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(shape.label, cx, cy);
  } else if (shape.type === "arrow_conn" || shape.type === "line_conn") {
    ctx.strokeStyle = shape.color || "#64748b";
    ctx.lineWidth = 1.5;
    if (shape.style === "dashed") ctx.setLineDash([sc(5), sc(3)]);
    else if (shape.style === "dotted") ctx.setLineDash([sc(2), sc(3)]);
    ctx.beginPath();
    ctx.moveTo(px(shape.x1), py(shape.y1));
    ctx.lineTo(px(shape.x2), py(shape.y2));
    ctx.stroke();
    ctx.setLineDash([]);
    if (shape.type === "arrow_conn") {
      const angle = Math.atan2(
        py(shape.y2) - py(shape.y1),
        px(shape.x2) - px(shape.x1),
      );
      const aLen = sc(8);
      ctx.fillStyle = shape.color || "#64748b";
      ctx.beginPath();
      ctx.moveTo(px(shape.x2), py(shape.y2));
      ctx.lineTo(
        px(shape.x2) - aLen * Math.cos(angle - 0.4),
        py(shape.y2) - aLen * Math.sin(angle - 0.4),
      );
      ctx.lineTo(
        px(shape.x2) - aLen * Math.cos(angle + 0.4),
        py(shape.y2) - aLen * Math.sin(angle + 0.4),
      );
      ctx.closePath();
      ctx.fill();
    }
    if (shape.label) {
      const mx = (px(shape.x1) + px(shape.x2)) / 2;
      const my = (py(shape.y1) + py(shape.y2)) / 2;
      ctx.fillStyle = shape.color || "#64748b";
      ctx.font = `${Math.max(8, sc(9))}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText(shape.label, mx, my - sc(4));
    }
  } else if (shape.type === "text_element") {
    const x = px(shape.x),
      y = py(shape.y);
    const fs = Math.max(10, sc(shape.fontSize || 14));
    const fw = shape.fontWeight === "bold" ? "bold " : "";
    const fi = shape.fontStyle === "italic" ? "italic " : "";
    ctx.font = `${fi}${fw}${fs}px system-ui`;
    ctx.fillStyle = shape.color || (isDark ? "#f1f5f9" : "#0f172a");
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const lines = (shape.text || "").split("\n");
    lines.forEach((line, i) => ctx.fillText(line, x, y + i * (fs + 4)));
  } else if (shape.type === "equation_element") {
    const x = px(shape.x),
      y = py(shape.y);
    const fs = Math.max(12, sc(shape.fontSize || 18));
    ctx.font = `${fs}px "Georgia", serif`;
    ctx.fillStyle = shape.color || (isDark ? "#f1f5f9" : "#0f172a");
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    // Render equation with a subtle background pill
    const text = shape.text || "f(x)";
    const metrics = ctx.measureText(text);
    const pad = sc(6);
    ctx.fillStyle = isDark ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.08)";
    if (ctx.roundRect)
      ctx.roundRect(
        x - pad,
        y - pad / 2,
        metrics.width + pad * 2,
        fs + pad,
        sc(4),
      );
    else ctx.rect(x - pad, y - pad / 2, metrics.width + pad * 2, fs + pad);
    ctx.fill();
    ctx.strokeStyle = isDark ? "rgba(59,130,246,0.3)" : "rgba(59,130,246,0.2)";
    ctx.lineWidth = 1;
    if (ctx.roundRect)
      ctx.roundRect(
        x - pad,
        y - pad / 2,
        metrics.width + pad * 2,
        fs + pad,
        sc(4),
      );
    else ctx.rect(x - pad, y - pad / 2, metrics.width + pad * 2, fs + pad);
    ctx.stroke();
    ctx.fillStyle = shape.color || (isDark ? "#93c5fd" : "#1d4ed8");
    ctx.fillText(text, x, y);
  } else if (shape.type === "sticky_note") {
    const x = px(shape.x),
      y = py(shape.y),
      w = sc(shape.w || 160),
      h = sc(shape.h || 120);
    const noteColor = shape.color || "#fef08a";
    ctx.fillStyle = noteColor;
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = sc(6);
    ctx.shadowOffsetY = sc(3);
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, sc(3));
    else ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, sc(3));
    else ctx.rect(x, y, w, h);
    ctx.stroke();
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, sc(24), [sc(3), sc(3), 0, 0]);
    else ctx.rect(x, y, w, sc(24));
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.font = `bold ${Math.max(9, sc(10))}px system-ui`;
    ctx.textAlign = "center";
    ctx.fillText("Note", x + w / 2, y + sc(15));
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.font = `${Math.max(9, sc(10))}px system-ui`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const noteLines = (shape.text || "Double-click to edit").split("\n");
    noteLines.forEach((line, i) =>
      ctx.fillText(line, x + sc(8), y + sc(30) + i * sc(14)),
    );
  } else if (shape.type === "comment_element") {
    // Render as speech bubble icon
    const cx = px(shape.x),
      cy = py(shape.y);
    const r = sc(14);
    ctx.fillStyle = "#f59e0b";
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${Math.max(9, sc(10))}px system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("💬", cx, cy);
    if (shape.text) {
      ctx.fillStyle = isDark ? "#1e293b" : "#fff";
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1;
      const tw = Math.max(sc(100), ctx.measureText(shape.text).width + sc(16));
      const th = sc(28);
      const bx = cx + r + sc(4),
        by = cy - th / 2;
      if (ctx.roundRect) ctx.roundRect(bx, by, tw, th, sc(4));
      else ctx.rect(bx, by, tw, th);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = isDark ? "#f1f5f9" : "#0f172a";
      ctx.font = `${Math.max(9, sc(9))}px system-ui`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(shape.text, bx + sc(6), by + th / 2);
    }
    if (shape.resolved) {
      ctx.fillStyle = "#22c55e";
      ctx.strokeStyle = "#16a34a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx + r - sc(3), cy - r + sc(3), sc(5), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${Math.max(7, sc(7))}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✓", cx + r - sc(3), cy - r + sc(3));
    }
  } else if (shape.type === "frame_element") {
    const x = px(shape.x),
      y = py(shape.y),
      w = sc(shape.w || 300),
      h = sc(shape.h || 200);
    ctx.strokeStyle = shape.color || "#3b82f6";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([sc(6), sc(3)]);
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);
    ctx.fillStyle = (shape.color || "#3b82f6") + "08";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = shape.color || "#3b82f6";
    ctx.font = `bold ${Math.max(10, sc(11))}px system-ui`;
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText(shape.label || "Frame", x + sc(4), y - sc(4));
  } else if (shape.type === "image_element" && shape.src) {
    const img = new window.Image();
    img.src = shape.src;
    const x = px(shape.x),
      y = py(shape.y),
      w = sc(shape.w || 200),
      h = sc(shape.h || 150);
    if (img.complete) {
      ctx.drawImage(img, x, y, w, h);
    } else {
      ctx.fillStyle = isDark ? "#1e293b" : "#f1f5f9";
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = "#94a3b8";
      ctx.font = `${Math.max(9, sc(10))}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Image", x + w / 2, y + h / 2);
    }
  }

  if (isSelected) {
    const b = getShapeBounds(shape);
    const sx = b.x * zoom + pan.x,
      sy = b.y * zoom + pan.y;
    const sw = b.w * zoom,
      sh = b.h * zoom;
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(sx - 6, sy - 6, sw + 12, sh + 12);
    ctx.setLineDash([]);
    getResizeHandles(b, zoom, pan).forEach(({ x: hx, y: hy }) => {
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 1.5;
      ctx.fillRect(
        hx - HANDLE_SIZE / 2,
        hy - HANDLE_SIZE / 2,
        HANDLE_SIZE,
        HANDLE_SIZE,
      );
      ctx.strokeRect(
        hx - HANDLE_SIZE / 2,
        hy - HANDLE_SIZE / 2,
        HANDLE_SIZE,
        HANDLE_SIZE,
      );
    });
  }
  ctx.restore();
}

// ── BOUNDS / HANDLES ───────────────────────────────────────────────────────
function getShapeBounds(shape) {
  if (shape.type === "bubble_shape")
    return {
      x: shape.x - shape.rx,
      y: shape.y - shape.ry,
      w: shape.rx * 2,
      h: shape.ry * 2,
    };
  if (shape.type === "arrow_conn" || shape.type === "line_conn")
    return {
      x: Math.min(shape.x1, shape.x2),
      y: Math.min(shape.y1, shape.y2),
      w: Math.abs(shape.x2 - shape.x1) || 1,
      h: Math.abs(shape.y2 - shape.y1) || 1,
    };
  if (shape.type === "text_element") {
    const lineCount = (shape.text || "").split("\n").length;
    return {
      x: shape.x,
      y: shape.y,
      w: shape.w || 200,
      h: lineCount * ((shape.fontSize || 14) + 4) + 8,
    };
  }
  if (shape.type === "equation_element")
    return { x: shape.x, y: shape.y, w: shape.w || 160, h: shape.h || 40 };
  if (shape.type === "comment_element")
    return { x: shape.x - 14, y: shape.y - 14, w: 28, h: 28 };
  return { x: shape.x, y: shape.y, w: shape.w || 100, h: shape.h || 50 };
}

function getResizeHandles(bounds, zoom, pan) {
  const { x, y, w, h } = bounds;
  const sx = x * zoom + pan.x,
    sy = y * zoom + pan.y;
  const sw = w * zoom,
    sh = h * zoom;
  const ox = -6,
    oy = -6;
  return [
    { id: "nw", x: sx + ox, y: sy + oy },
    { id: "n", x: sx + ox + (sw + 12) / 2, y: sy + oy },
    { id: "ne", x: sx + ox + sw + 12, y: sy + oy },
    { id: "e", x: sx + ox + sw + 12, y: sy + oy + (sh + 12) / 2 },
    { id: "se", x: sx + ox + sw + 12, y: sy + oy + sh + 12 },
    { id: "s", x: sx + ox + (sw + 12) / 2, y: sy + oy + sh + 12 },
    { id: "sw", x: sx + ox, y: sy + oy + sh + 12 },
    { id: "w", x: sx + ox, y: sy + oy + (sh + 12) / 2 },
  ];
}

function getWorldCoords(clientX, clientY, canvas, zoom, pan) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left - pan.x) / zoom,
    y: (clientY - rect.top - pan.y) / zoom,
  };
}

function isPointInShape(pt, shape) {
  if (shape.type === "bubble_shape") {
    const dx = (pt.x - shape.x) / shape.rx,
      dy = (pt.y - shape.y) / shape.ry;
    return dx * dx + dy * dy <= 1;
  }
  if (shape.type === "arrow_conn" || shape.type === "line_conn") {
    const dx = shape.x2 - shape.x1,
      dy = shape.y2 - shape.y1;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return Math.hypot(pt.x - shape.x1, pt.y - shape.y1) < 10;
    let t = Math.max(
      0,
      Math.min(1, ((pt.x - shape.x1) * dx + (pt.y - shape.y1) * dy) / len2),
    );
    return Math.hypot(pt.x - shape.x1 - t * dx, pt.y - shape.y1 - t * dy) < 10;
  }
  const b = getShapeBounds(shape);
  return pt.x >= b.x && pt.x <= b.x + b.w && pt.y >= b.y && pt.y <= b.y + b.h;
}

function getResizeHandleAtPoint(sx, sy, shape, zoom, pan) {
  const bounds = getShapeBounds(shape);
  for (const h of getResizeHandles(bounds, zoom, pan)) {
    if (Math.abs(sx - h.x) <= HANDLE_SIZE && Math.abs(sy - h.y) <= HANDLE_SIZE)
      return h.id;
  }
  return null;
}

function findShapeAtPoint(pt, shapes) {
  for (let i = shapes.length - 1; i >= 0; i--) {
    if (isPointInShape(pt, shapes[i])) return shapes[i];
  }
  return null;
}

function applyResize(orig, handleId, dx, dy) {
  const s = { ...orig };
  if (s.type === "arrow_conn" || s.type === "line_conn")
    return { ...s, x2: orig.x2 + dx, y2: orig.y2 + dy };
  if (s.type === "bubble_shape")
    return {
      ...s,
      rx: Math.max(
        10,
        orig.rx +
          (handleId.includes("e") ? dx : handleId.includes("w") ? -dx : 0),
      ),
      ry: Math.max(
        10,
        orig.ry +
          (handleId.includes("s") ? dy : handleId.includes("n") ? -dy : 0),
      ),
    };
  const b = { x: orig.x, y: orig.y, w: orig.w || 100, h: orig.h || 50 };
  if (handleId.includes("w")) {
    b.x += dx;
    b.w = Math.max(20, b.w - dx);
  }
  if (handleId.includes("n")) {
    b.y += dy;
    b.h = Math.max(20, b.h - dy);
  }
  if (handleId.includes("e")) b.w = Math.max(20, b.w + dx);
  if (handleId.includes("s")) b.h = Math.max(20, b.h + dy);
  return { ...s, x: b.x, y: b.y, w: b.w, h: b.h };
}

function makeId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function parseWhiteboardElements(raw) {
  if (!raw) return { paths: [], templateShapes: [] };
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed)) return { paths: parsed, templateShapes: [] };
    return {
      paths: Array.isArray(parsed.paths) ? parsed.paths : [],
      templateShapes: Array.isArray(parsed.templateShapes)
        ? parsed.templateShapes
        : [],
      zoom: parsed.zoom,
      panOffset: parsed.panOffset,
    };
  } catch {
    return { paths: [], templateShapes: [] };
  }
}

// ── MOCK DATA ─────────────────────────────────────────────────────────────
const DEFAULT_PROJECTS = [
  "DSA Course",
  "System Design",
  "Java OOP",
  "React Course",
  "Database",
];

const MOCK_BOARDS = [
  {
    id: 1,
    title: "DSA - Binary Trees",
    owner: "Trainer",
    modified: "May 11, 2026 4:31 PM",
    starred: true,
    project: "DSA Course",
    thumbnail: "tree",
    templateId: "dsa_tree",
  },
  {
    id: 2,
    title: "System Design - Microservices",
    owner: "Trainer",
    modified: "May 11, 2026 2:15 PM",
    starred: false,
    project: "System Design",
    thumbnail: "arch",
    templateId: "system",
  },
  {
    id: 3,
    title: "UML Class Diagram",
    owner: "Trainer",
    modified: "May 10, 2026 11:00 AM",
    starred: true,
    project: "Java OOP",
    thumbnail: "uml",
    templateId: "uml_class",
  },
  {
    id: 4,
    title: "Flowchart - Auth Flow",
    owner: "Trainer",
    modified: "May 9, 2026 3:45 PM",
    starred: false,
    project: null,
    thumbnail: "flow",
    templateId: "flowchart",
  },
  {
    id: 5,
    title: "Brainstorm - React Architecture",
    owner: "Trainer",
    modified: "May 8, 2026 9:20 AM",
    starred: false,
    project: "React Course",
    thumbnail: "mind",
    templateId: "mindmap",
  },
  {
    id: 6,
    title: "ER Diagram - Student DB",
    owner: "Trainer",
    modified: "May 7, 2026 5:00 PM",
    starred: false,
    project: "Database",
    thumbnail: "er",
    templateId: "er",
  },
];

const TEMPLATE_CATEGORIES = [
  "All",
  "Agile",
  "Brainstorming",
  "Design",
  "Workshop",
  "Meetings",
  "Education",
  "Games",
  "Project Planning",
  "Presentation",
  "Architecture",
  "UML",
  "DSA Teaching",
];

const TEMPLATES = [
  {
    id: "flowchart",
    title: "Flowchart",
    category: "Education",
    color: "#3b82f6",
    icon: GitBranch,
  },
  {
    id: "mindmap",
    title: "Mind Map",
    category: "Brainstorming",
    color: "#8b5cf6",
    icon: Share2,
  },
  {
    id: "kanban",
    title: "Kanban Board",
    category: "Agile",
    color: "#10b981",
    icon: Layout,
  },
  {
    id: "wireframe",
    title: "UI Wireframe",
    category: "Design",
    color: "#f59e0b",
    icon: Box,
  },
  {
    id: "timeline",
    title: "Timeline",
    category: "Project Planning",
    color: "#ef4444",
    icon: AlignLeft,
  },
  {
    id: "er",
    title: "ER Diagram",
    category: "Education",
    color: "#06b6d4",
    icon: Database,
  },
  {
    id: "uml_class",
    title: "UML Class",
    category: "UML",
    color: "#6366f1",
    icon: Layers,
  },
  {
    id: "sequence",
    title: "Sequence Diagram",
    category: "UML",
    color: "#ec4899",
    icon: Activity,
  },
  {
    id: "network",
    title: "Network Topology",
    category: "Architecture",
    color: "#84cc16",
    icon: Network,
  },
  {
    id: "system",
    title: "System Architecture",
    category: "Architecture",
    color: "#f97316",
    icon: Cpu,
  },
  {
    id: "dsa_tree",
    title: "BST / Tree",
    category: "DSA Teaching",
    color: "#a855f7",
    icon: GitBranch,
  },
  {
    id: "dsa_graph",
    title: "Graph Algorithms",
    category: "DSA Teaching",
    color: "#14b8a6",
    icon: Workflow,
  },
  {
    id: "blank",
    title: "Blank Canvas",
    category: "All",
    color: "#64748b",
    icon: FileText,
  },
  {
    id: "retro",
    title: "Retrospective",
    category: "Agile",
    color: "#f43f5e",
    icon: RotateCcw,
  },
  {
    id: "presentation",
    title: "Presentation",
    category: "Presentation",
    color: "#0ea5e9",
    icon: Monitor,
  },
];

const DIAGRAM_TYPES = [
  { id: "flowchart", label: "Flowchart", icon: GitBranch, color: "#3b82f6" },
  { id: "uml_class", label: "UML Class", icon: Box, color: "#8b5cf6" },
  {
    id: "uml_sequence",
    label: "Sequence Diagram",
    icon: Activity,
    color: "#ec4899",
  },
  { id: "uml_usecase", label: "Use Case", icon: Users, color: "#6366f1" },
  { id: "er", label: "ER Diagram", icon: Database, color: "#06b6d4" },
  { id: "network", label: "Network Diagram", icon: Network, color: "#10b981" },
  { id: "mindmap", label: "Mind Map", icon: Share2, color: "#f59e0b" },
  { id: "org", label: "Org Chart", icon: Layout, color: "#ef4444" },
  { id: "workflow", label: "Workflow", icon: Workflow, color: "#f97316" },
  { id: "aws", label: "AWS Architecture", icon: Cpu, color: "#ff9900" },
  { id: "system", label: "System Design", icon: Monitor, color: "#84cc16" },
  { id: "dsa", label: "DSA Visualization", icon: BarChart2, color: "#a855f7" },
];

const SHAPE_CATEGORIES = {
  "Recently Used": ["rect", "rounded_rect", "circle", "diamond", "process"],
  "Basic Shapes": [
    "rect",
    "rounded_rect",
    "circle",
    "ellipse",
    "triangle",
    "diamond",
    "pentagon",
    "hexagon",
    "octagon",
    "star",
    "line",
    "arrow",
  ],
  Flowchart: [
    "process",
    "decision",
    "database_shape",
    "document",
    "connector",
    "io",
  ],
  UML: ["class_box", "interface_box", "actor", "use_case_oval"],
  Network: ["server", "router", "switch_node", "firewall", "pc"],
  AWS: ["ec2", "s3", "rds", "lambda", "elb"],
  "Mind Map": ["bubble", "leaf", "branch"],
};

const SHAPE_ICON_MAP = {
  rect: Square,
  rounded_rect: Square,
  circle: Circle,
  ellipse: Circle,
  triangle: Triangle,
  diamond: Diamond,
  pentagon: Hexagon,
  hexagon: Hexagon,
  octagon: Hexagon,
  star: Star,
  line: Minus,
  arrow: ArrowRight,
  process: Square,
  decision: Diamond,
  database_shape: Database,
  document: FileText,
  connector: Circle,
  io: Square,
  class_box: Box,
  interface_box: Box,
  actor: Users,
  use_case_oval: Circle,
  server: Cpu,
  router: Network,
  switch_node: Network,
  firewall: Lock,
  pc: Monitor,
  ec2: Cpu,
  s3: Database,
  rds: Database,
  lambda: Zap,
  elb: BarChart2,
  bubble: Circle,
  leaf: Hash,
  branch: GitBranch,
};

// ── TEMPLATE SHAPES ────────────────────────────────────────────────────────
function getTemplateShapes(templateId) {
  const mk = () => makeId();
  const ids = (arr) =>
    arr.map((s) => ({
      ...s,
      id: mk(),
      selected: false,
      rotation: 0,
      locked: false,
    }));
  const map = {
    flowchart: ids([
      {
        type: "rect_shape",
        x: 300,
        y: 60,
        w: 120,
        h: 40,
        rx: 6,
        label: "Start",
        color: "#3b82f6",
        fill: "#3b82f620",
      },
      {
        type: "diamond_shape",
        x: 300,
        y: 150,
        w: 120,
        h: 60,
        label: "Decision?",
        color: "#10b981",
        fill: "#10b98120",
      },
      {
        type: "rect_shape",
        x: 300,
        y: 270,
        w: 120,
        h: 40,
        rx: 4,
        label: "Process",
        color: "#f59e0b",
        fill: "#f59e0b20",
      },
      {
        type: "rect_shape",
        x: 300,
        y: 370,
        w: 120,
        h: 40,
        rx: 20,
        label: "End",
        color: "#ef4444",
        fill: "#ef444420",
      },
      {
        type: "arrow_conn",
        x1: 360,
        y1: 100,
        x2: 360,
        y2: 150,
        color: "#64748b",
      },
      {
        type: "arrow_conn",
        x1: 360,
        y1: 210,
        x2: 360,
        y2: 270,
        color: "#64748b",
      },
      {
        type: "arrow_conn",
        x1: 360,
        y1: 310,
        x2: 360,
        y2: 370,
        color: "#64748b",
      },
      {
        type: "arrow_conn",
        x1: 420,
        y1: 180,
        x2: 500,
        y2: 180,
        color: "#ef4444",
        label: "No",
      },
    ]),
    uml_class: ids([
      {
        type: "class_shape",
        x: 80,
        y: 80,
        w: 180,
        h: 160,
        label: "User",
        attrs: ["- id: int", "- name: String", "- email: String"],
        methods: ["+ login()", "+ logout()"],
        color: "#8b5cf6",
      },
      {
        type: "class_shape",
        x: 360,
        y: 80,
        w: 180,
        h: 140,
        label: "Course",
        attrs: ["- id: int", "- title: String", "- duration: int"],
        methods: ["+ enroll()"],
        color: "#3b82f6",
      },
      {
        type: "class_shape",
        x: 220,
        y: 310,
        w: 180,
        h: 120,
        label: "Enrollment",
        attrs: ["- userId: int", "- courseId: int", "- date: Date"],
        methods: [],
        color: "#10b981",
      },
      {
        type: "arrow_conn",
        x1: 260,
        y1: 240,
        x2: 310,
        y2: 310,
        color: "#64748b",
        style: "dashed",
      },
      {
        type: "arrow_conn",
        x1: 450,
        y1: 220,
        x2: 400,
        y2: 310,
        color: "#64748b",
        style: "dashed",
      },
    ]),
    er: ids([
      {
        type: "er_entity",
        x: 60,
        y: 100,
        w: 140,
        h: 160,
        label: "Student",
        attrs: ["PK id", "name", "email", "batch"],
        color: "#06b6d4",
      },
      {
        type: "er_entity",
        x: 320,
        y: 100,
        w: 140,
        h: 140,
        label: "Course",
        attrs: ["PK id", "title", "duration"],
        color: "#3b82f6",
      },
      {
        type: "er_relation",
        x: 220,
        y: 150,
        w: 80,
        h: 50,
        label: "enrolls",
        color: "#8b5cf6",
      },
      {
        type: "arrow_conn",
        x1: 200,
        y1: 175,
        x2: 220,
        y2: 175,
        color: "#64748b",
      },
      {
        type: "arrow_conn",
        x1: 300,
        y1: 175,
        x2: 320,
        y2: 175,
        color: "#64748b",
      },
    ]),
    mindmap: ids([
      {
        type: "bubble_shape",
        x: 300,
        y: 200,
        rx: 60,
        ry: 30,
        label: "React",
        color: "#8b5cf6",
        fill: "#8b5cf620",
      },
      {
        type: "bubble_shape",
        x: 80,
        y: 100,
        rx: 45,
        ry: 22,
        label: "Hooks",
        color: "#3b82f6",
        fill: "#3b82f620",
      },
      {
        type: "bubble_shape",
        x: 80,
        y: 300,
        rx: 45,
        ry: 22,
        label: "State",
        color: "#10b981",
        fill: "#10b98120",
      },
      {
        type: "bubble_shape",
        x: 520,
        y: 100,
        rx: 45,
        ry: 22,
        label: "Props",
        color: "#f59e0b",
        fill: "#f59e0b20",
      },
      {
        type: "bubble_shape",
        x: 520,
        y: 300,
        rx: 45,
        ry: 22,
        label: "Context",
        color: "#ef4444",
        fill: "#ef444420",
      },
      {
        type: "line_conn",
        x1: 300,
        y1: 200,
        x2: 125,
        y2: 100,
        color: "#3b82f680",
      },
      {
        type: "line_conn",
        x1: 300,
        y1: 200,
        x2: 125,
        y2: 300,
        color: "#10b98180",
      },
      {
        type: "line_conn",
        x1: 300,
        y1: 200,
        x2: 475,
        y2: 100,
        color: "#f59e0b80",
      },
      {
        type: "line_conn",
        x1: 300,
        y1: 200,
        x2: 475,
        y2: 300,
        color: "#ef444480",
      },
    ]),
    dsa_tree: ids([
      {
        type: "rect_shape",
        x: 300,
        y: 30,
        w: 60,
        h: 36,
        rx: 4,
        label: "50",
        color: "#3b82f6",
        fill: "#3b82f620",
      },
      {
        type: "rect_shape",
        x: 160,
        y: 120,
        w: 60,
        h: 36,
        rx: 4,
        label: "30",
        color: "#8b5cf6",
        fill: "#8b5cf620",
      },
      {
        type: "rect_shape",
        x: 440,
        y: 120,
        w: 60,
        h: 36,
        rx: 4,
        label: "70",
        color: "#8b5cf6",
        fill: "#8b5cf620",
      },
      {
        type: "rect_shape",
        x: 80,
        y: 210,
        w: 60,
        h: 36,
        rx: 4,
        label: "20",
        color: "#10b981",
        fill: "#10b98120",
      },
      {
        type: "rect_shape",
        x: 240,
        y: 210,
        w: 60,
        h: 36,
        rx: 4,
        label: "40",
        color: "#10b981",
        fill: "#10b98120",
      },
      {
        type: "rect_shape",
        x: 360,
        y: 210,
        w: 60,
        h: 36,
        rx: 4,
        label: "60",
        color: "#10b981",
        fill: "#10b98120",
      },
      {
        type: "rect_shape",
        x: 520,
        y: 210,
        w: 60,
        h: 36,
        rx: 4,
        label: "80",
        color: "#10b981",
        fill: "#10b98120",
      },
      {
        type: "line_conn",
        x1: 330,
        y1: 66,
        x2: 190,
        y2: 120,
        color: "#64748b",
      },
      {
        type: "line_conn",
        x1: 330,
        y1: 66,
        x2: 470,
        y2: 120,
        color: "#64748b",
      },
      {
        type: "line_conn",
        x1: 190,
        y1: 156,
        x2: 110,
        y2: 210,
        color: "#94a3b8",
      },
      {
        type: "line_conn",
        x1: 190,
        y1: 156,
        x2: 270,
        y2: 210,
        color: "#94a3b8",
      },
      {
        type: "line_conn",
        x1: 470,
        y1: 156,
        x2: 390,
        y2: 210,
        color: "#94a3b8",
      },
      {
        type: "line_conn",
        x1: 470,
        y1: 156,
        x2: 550,
        y2: 210,
        color: "#94a3b8",
      },
    ]),
    system: ids([
      {
        type: "rect_shape",
        x: 100,
        y: 110,
        w: 140,
        h: 50,
        rx: 6,
        label: "Load Balancer",
        color: "#3b82f6",
        fill: "#3b82f620",
      },
      {
        type: "rect_shape",
        x: 100,
        y: 220,
        w: 120,
        h: 44,
        rx: 6,
        label: "Service A",
        color: "#8b5cf6",
        fill: "#8b5cf620",
      },
      {
        type: "rect_shape",
        x: 260,
        y: 220,
        w: 120,
        h: 44,
        rx: 6,
        label: "Service B",
        color: "#8b5cf6",
        fill: "#8b5cf620",
      },
      {
        type: "rect_shape",
        x: 420,
        y: 220,
        w: 120,
        h: 44,
        rx: 6,
        label: "Service C",
        color: "#8b5cf6",
        fill: "#8b5cf620",
      },
      {
        type: "rect_shape",
        x: 180,
        y: 360,
        w: 120,
        h: 44,
        rx: 6,
        label: "Database",
        color: "#06b6d4",
        fill: "#06b6d420",
      },
      {
        type: "rect_shape",
        x: 360,
        y: 360,
        w: 120,
        h: 44,
        rx: 6,
        label: "Cache",
        color: "#10b981",
        fill: "#10b98120",
      },
      {
        type: "arrow_conn",
        x1: 170,
        y1: 110,
        x2: 160,
        y2: 220,
        color: "#64748b",
      },
      {
        type: "arrow_conn",
        x1: 170,
        y1: 110,
        x2: 320,
        y2: 220,
        color: "#64748b",
      },
      {
        type: "arrow_conn",
        x1: 170,
        y1: 110,
        x2: 480,
        y2: 220,
        color: "#64748b",
      },
    ]),
  };
  map.uml = map.uml_class;
  map.dsa = map.dsa_tree;
  map.network = map.system;
  return map[templateId] || [];
}

// ── SHAPE FACTORY ─────────────────────────────────────────────────────────
function createShape(shapeId, canvasX, canvasY, color) {
  const c = color || "#3b82f6";
  const base = { id: makeId(), selected: false, rotation: 0, locked: false };
  const map = {
    rect: {
      type: "rect_shape",
      x: canvasX - 60,
      y: canvasY - 25,
      w: 120,
      h: 50,
      rx: 4,
      label: "Rectangle",
      color: c,
      fill: c + "20",
    },
    rounded_rect: {
      type: "rect_shape",
      x: canvasX - 60,
      y: canvasY - 25,
      w: 120,
      h: 50,
      rx: 14,
      label: "Rounded",
      color: c,
      fill: c + "20",
    },
    circle: {
      type: "bubble_shape",
      x: canvasX,
      y: canvasY,
      rx: 50,
      ry: 50,
      label: "Circle",
      color: c,
      fill: c + "20",
    },
    ellipse: {
      type: "bubble_shape",
      x: canvasX,
      y: canvasY,
      rx: 70,
      ry: 35,
      label: "Ellipse",
      color: c,
      fill: c + "20",
    },
    triangle: {
      type: "triangle_shape",
      x: canvasX - 50,
      y: canvasY - 45,
      w: 100,
      h: 80,
      label: "Triangle",
      color: c,
      fill: c + "20",
    },
    diamond: {
      type: "diamond_shape",
      x: canvasX - 60,
      y: canvasY - 30,
      w: 120,
      h: 60,
      label: "Diamond",
      color: c,
      fill: c + "20",
    },
    pentagon: {
      type: "polygon_shape",
      x: canvasX - 50,
      y: canvasY - 50,
      w: 100,
      h: 100,
      sides: 5,
      label: "Pentagon",
      color: c,
      fill: c + "20",
    },
    hexagon: {
      type: "polygon_shape",
      x: canvasX - 55,
      y: canvasY - 50,
      w: 110,
      h: 100,
      sides: 6,
      label: "Hexagon",
      color: c,
      fill: c + "20",
    },
    octagon: {
      type: "polygon_shape",
      x: canvasX - 55,
      y: canvasY - 55,
      w: 110,
      h: 110,
      sides: 8,
      label: "Octagon",
      color: c,
      fill: c + "20",
    },
    star: {
      type: "star_shape",
      x: canvasX - 50,
      y: canvasY - 50,
      w: 100,
      h: 100,
      points: 5,
      label: "",
      color: c,
      fill: c + "20",
    },
    line: {
      type: "line_conn",
      x1: canvasX - 60,
      y1: canvasY,
      x2: canvasX + 60,
      y2: canvasY,
      color: "#64748b",
    },
    arrow: {
      type: "arrow_conn",
      x1: canvasX - 60,
      y1: canvasY,
      x2: canvasX + 60,
      y2: canvasY,
      color: c,
    },
    process: {
      type: "rect_shape",
      x: canvasX - 70,
      y: canvasY - 22,
      w: 140,
      h: 44,
      rx: 4,
      label: "Process",
      color: c,
      fill: c + "20",
    },
    decision: {
      type: "diamond_shape",
      x: canvasX - 70,
      y: canvasY - 35,
      w: 140,
      h: 70,
      label: "Decision?",
      color: "#10b981",
      fill: "#10b98120",
    },
    database_shape: {
      type: "rect_shape",
      x: canvasX - 50,
      y: canvasY - 35,
      w: 100,
      h: 70,
      rx: 8,
      label: "Database",
      color: "#06b6d4",
      fill: "#06b6d420",
    },
    document: {
      type: "rect_shape",
      x: canvasX - 65,
      y: canvasY - 25,
      w: 130,
      h: 50,
      rx: 4,
      label: "Document",
      color: "#f59e0b",
      fill: "#f59e0b20",
    },
    connector: {
      type: "bubble_shape",
      x: canvasX,
      y: canvasY,
      rx: 18,
      ry: 18,
      label: "●",
      color: "#64748b",
      fill: "#64748b20",
    },
    io: {
      type: "diamond_shape",
      x: canvasX - 60,
      y: canvasY - 25,
      w: 120,
      h: 50,
      label: "I/O",
      color: "#ec4899",
      fill: "#ec489920",
    },
    class_box: {
      type: "class_shape",
      x: canvasX - 80,
      y: canvasY - 70,
      w: 160,
      h: 140,
      label: "ClassName",
      attrs: ["- attribute: Type"],
      methods: ["+ method()"],
      color: "#8b5cf6",
    },
    interface_box: {
      type: "class_shape",
      x: canvasX - 80,
      y: canvasY - 60,
      w: 160,
      h: 120,
      label: "«interface»",
      attrs: [],
      methods: ["+ method()"],
      color: "#6366f1",
    },
    actor: {
      type: "bubble_shape",
      x: canvasX,
      y: canvasY,
      rx: 30,
      ry: 30,
      label: "Actor",
      color: "#64748b",
      fill: "#64748b20",
    },
    use_case_oval: {
      type: "bubble_shape",
      x: canvasX,
      y: canvasY,
      rx: 70,
      ry: 35,
      label: "Use Case",
      color: "#6366f1",
      fill: "#6366f120",
    },
    server: {
      type: "rect_shape",
      x: canvasX - 50,
      y: canvasY - 30,
      w: 100,
      h: 60,
      rx: 6,
      label: "Server",
      color: "#10b981",
      fill: "#10b98120",
    },
    router: {
      type: "bubble_shape",
      x: canvasX,
      y: canvasY,
      rx: 35,
      ry: 35,
      label: "Router",
      color: "#f59e0b",
      fill: "#f59e0b20",
    },
    switch_node: {
      type: "bubble_shape",
      x: canvasX,
      y: canvasY,
      rx: 40,
      ry: 25,
      label: "Switch",
      color: "#3b82f6",
      fill: "#3b82f620",
    },
    firewall: {
      type: "rect_shape",
      x: canvasX - 50,
      y: canvasY - 25,
      w: 100,
      h: 50,
      rx: 4,
      label: "Firewall",
      color: "#ef4444",
      fill: "#ef444420",
    },
    pc: {
      type: "rect_shape",
      x: canvasX - 45,
      y: canvasY - 25,
      w: 90,
      h: 50,
      rx: 4,
      label: "PC",
      color: "#8b5cf6",
      fill: "#8b5cf620",
    },
    ec2: {
      type: "rect_shape",
      x: canvasX - 50,
      y: canvasY - 30,
      w: 100,
      h: 60,
      rx: 6,
      label: "EC2",
      color: "#ff9900",
      fill: "#ff990020",
    },
    s3: {
      type: "rect_shape",
      x: canvasX - 45,
      y: canvasY - 30,
      w: 90,
      h: 60,
      rx: 6,
      label: "S3",
      color: "#3b82f6",
      fill: "#3b82f620",
    },
    rds: {
      type: "rect_shape",
      x: canvasX - 45,
      y: canvasY - 30,
      w: 90,
      h: 60,
      rx: 6,
      label: "RDS",
      color: "#06b6d4",
      fill: "#06b6d420",
    },
    lambda: {
      type: "rect_shape",
      x: canvasX - 50,
      y: canvasY - 28,
      w: 100,
      h: 56,
      rx: 6,
      label: "Lambda",
      color: "#f59e0b",
      fill: "#f59e0b20",
    },
    elb: {
      type: "rect_shape",
      x: canvasX - 55,
      y: canvasY - 25,
      w: 110,
      h: 50,
      rx: 6,
      label: "Load Balancer",
      color: "#10b981",
      fill: "#10b98120",
    },
    bubble: {
      type: "bubble_shape",
      x: canvasX,
      y: canvasY,
      rx: 60,
      ry: 30,
      label: "Topic",
      color: "#8b5cf6",
      fill: "#8b5cf620",
    },
    leaf: {
      type: "bubble_shape",
      x: canvasX,
      y: canvasY,
      rx: 45,
      ry: 22,
      label: "Leaf",
      color: "#10b981",
      fill: "#10b98120",
    },
    branch: {
      type: "diamond_shape",
      x: canvasX - 50,
      y: canvasY - 30,
      w: 100,
      h: 60,
      label: "Branch",
      color: "#14b8a6",
      fill: "#14b8a620",
    },
  };
  const t = map[shapeId];
  return t ? { ...base, ...t } : null;
}

// ── BOARD THUMBNAILS ───────────────────────────────────────────────────────
function BoardThumbnail({ type, isDark }) {
  const bg = isDark ? "#1e293b" : "#f8fafc";
  const svgStyle = { width: "100%", height: "100%", display: "block" };
  const T = {
    tree: (
      <svg viewBox="0 0 200 120" style={svgStyle}>
        <rect width="200" height="120" fill={bg} />
        <rect
          x="80"
          y="10"
          width="40"
          height="22"
          rx="4"
          fill="#3b82f620"
          stroke="#3b82f6"
          strokeWidth="1.5"
        />
        <text x="100" y="25" textAnchor="middle" fontSize="9" fill="#3b82f6">
          Root
        </text>
        <line
          x1="100"
          y1="32"
          x2="55"
          y2="55"
          stroke="#64748b"
          strokeWidth="1.2"
        />
        <line
          x1="100"
          y1="32"
          x2="145"
          y2="55"
          stroke="#64748b"
          strokeWidth="1.2"
        />
        <rect
          x="35"
          y="55"
          width="40"
          height="20"
          rx="4"
          fill="#8b5cf620"
          stroke="#8b5cf6"
          strokeWidth="1.5"
        />
        <rect
          x="125"
          y="55"
          width="40"
          height="20"
          rx="4"
          fill="#8b5cf620"
          stroke="#8b5cf6"
          strokeWidth="1.5"
        />
        <text x="55" y="68" textAnchor="middle" fontSize="8" fill="#8b5cf6">
          Left
        </text>
        <text x="145" y="68" textAnchor="middle" fontSize="8" fill="#8b5cf6">
          Right
        </text>
      </svg>
    ),
    arch: (
      <svg viewBox="0 0 200 120" style={svgStyle}>
        <rect width="200" height="120" fill={bg} />
        <rect
          x="10"
          y="10"
          width="180"
          height="20"
          rx="4"
          fill="#06b6d420"
          stroke="#06b6d4"
          strokeWidth="1.5"
        />
        <text x="100" y="24" textAnchor="middle" fontSize="9" fill="#06b6d4">
          API Gateway
        </text>
        {[10, 75, 145].map((x, i) => (
          <g key={i}>
            <line
              x1={x + 22}
              y1="30"
              x2={x + 22}
              y2="50"
              stroke="#64748b"
              strokeWidth="1"
            />
            <rect
              x={x}
              y="50"
              width="45"
              height="20"
              rx="3"
              fill="#3b82f620"
              stroke="#3b82f6"
              strokeWidth="1"
            />
            <text
              x={x + 22}
              y="63"
              textAnchor="middle"
              fontSize="7"
              fill="#3b82f6"
            >
              Svc {i + 1}
            </text>
          </g>
        ))}
      </svg>
    ),
    uml: (
      <svg viewBox="0 0 200 120" style={svgStyle}>
        <rect width="200" height="120" fill={bg} />
        <rect
          x="10"
          y="10"
          width="80"
          height="90"
          rx="3"
          fill={isDark ? "#1e293b" : "#fff"}
          stroke="#8b5cf6"
          strokeWidth="1.5"
        />
        <rect x="10" y="10" width="80" height="20" rx="3" fill="#8b5cf620" />
        <text
          x="50"
          y="24"
          textAnchor="middle"
          fontSize="9"
          fill="#8b5cf6"
          fontWeight="bold"
        >
          User
        </text>
        <line
          x1="10"
          y1="30"
          x2="90"
          y2="30"
          stroke="#8b5cf6"
          strokeWidth="1"
        />
        <text x="15" y="45" fontSize="7" fill={isDark ? "#94a3b8" : "#475569"}>
          - id: int
        </text>
        <text x="15" y="57" fontSize="7" fill={isDark ? "#94a3b8" : "#475569"}>
          - name: str
        </text>
      </svg>
    ),
    flow: (
      <svg viewBox="0 0 200 120" style={svgStyle}>
        <rect width="200" height="120" fill={bg} />
        <rect
          x="70"
          y="8"
          width="60"
          height="22"
          rx="4"
          fill="#3b82f620"
          stroke="#3b82f6"
          strokeWidth="1.5"
        />
        <text x="100" y="22" textAnchor="middle" fontSize="8" fill="#3b82f6">
          Start
        </text>
        <line
          x1="100"
          y1="30"
          x2="100"
          y2="42"
          stroke="#64748b"
          strokeWidth="1"
        />
        <polygon
          points="100,42 80,62 100,72 120,62"
          fill="#10b98120"
          stroke="#10b981"
          strokeWidth="1.5"
        />
        <text x="100" y="62" textAnchor="middle" fontSize="7" fill="#10b981">
          Decision?
        </text>
        <line
          x1="100"
          y1="72"
          x2="100"
          y2="85"
          stroke="#64748b"
          strokeWidth="1"
        />
        <rect
          x="65"
          y="85"
          width="70"
          height="22"
          rx="4"
          fill="#f59e0b20"
          stroke="#f59e0b"
          strokeWidth="1.5"
        />
        <text x="100" y="99" textAnchor="middle" fontSize="8" fill="#f59e0b">
          Process
        </text>
      </svg>
    ),
    mind: (
      <svg viewBox="0 0 200 120" style={svgStyle}>
        <rect width="200" height="120" fill={bg} />
        <ellipse
          cx="100"
          cy="60"
          rx="28"
          ry="18"
          fill="#8b5cf620"
          stroke="#8b5cf6"
          strokeWidth="2"
        />
        <text x="100" y="64" textAnchor="middle" fontSize="8" fill="#8b5cf6">
          React
        </text>
        {[
          ["Hooks", 25, 30, "#3b82f6"],
          ["State", 25, 90, "#10b981"],
          ["Props", 155, 30, "#f59e0b"],
          ["Context", 155, 90, "#ef4444"],
        ].map(([label, x, y, color], i) => (
          <g key={i}>
            <line
              x1="100"
              y1="60"
              x2={+x + 20}
              y2={+y}
              stroke={color + "80"}
              strokeWidth="1.2"
            />
            <rect
              x={x}
              y={+y - 10}
              width="40"
              height="18"
              rx="9"
              fill={color + "20"}
              stroke={color}
              strokeWidth="1.2"
            />
            <text
              x={+x + 20}
              y={+y + 4}
              textAnchor="middle"
              fontSize="7"
              fill={color}
            >
              {label}
            </text>
          </g>
        ))}
      </svg>
    ),
    er: (
      <svg viewBox="0 0 200 120" style={svgStyle}>
        <rect width="200" height="120" fill={bg} />
        <rect
          x="10"
          y="15"
          width="60"
          height="90"
          rx="3"
          fill={isDark ? "#1e293b" : "#fff"}
          stroke="#06b6d4"
          strokeWidth="1.5"
        />
        <rect x="10" y="15" width="60" height="16" rx="3" fill="#06b6d420" />
        <text
          x="40"
          y="27"
          textAnchor="middle"
          fontSize="8"
          fill="#06b6d4"
          fontWeight="bold"
        >
          Student
        </text>
        {["PK id", "name", "email"].map((t, i) => (
          <text
            key={i}
            x="14"
            y={42 + i * 13}
            fontSize="7"
            fill={isDark ? "#94a3b8" : "#475569"}
          >
            {t}
          </text>
        ))}
        <line
          x1="70"
          y1="60"
          x2="95"
          y2="60"
          stroke="#64748b"
          strokeWidth="1.2"
        />
        <rect
          x="95"
          y="15"
          width="60"
          height="90"
          rx="3"
          fill={isDark ? "#1e293b" : "#fff"}
          stroke="#3b82f6"
          strokeWidth="1.5"
        />
        <rect x="95" y="15" width="60" height="16" rx="3" fill="#3b82f620" />
        <text
          x="125"
          y="27"
          textAnchor="middle"
          fontSize="8"
          fill="#3b82f6"
          fontWeight="bold"
        >
          Course
        </text>
      </svg>
    ),
  };
  return T[type] || T.flow;
}

// ── TEXT EDITOR OVERLAY ────────────────────────────────────────────────────
// Fully working overlay for text, equation, and label editing
function TextOverlay({ element, zoom, pan, onCommit, onCancel, isDark }) {
  const [val, setVal] = useState(element.text || "");
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  const screenX = element.x * zoom + pan.x;
  const screenY = element.y * zoom + pan.y;
  const fs = Math.max(10, (element.fontSize || 14) * zoom);
  const isEquation = element.type === "equation_element";

  return (
    <div
      style={{
        position: "absolute",
        left: screenX,
        top: screenY,
        zIndex: 500,
        minWidth: 120,
      }}
    >
      <textarea
        ref={ref}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
            return;
          }
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onCommit(val);
            return;
          }
        }}
        onBlur={() => onCommit(val)}
        placeholder={isEquation ? "e.g. E = mc², x² + y² = r²" : "Type here…"}
        style={{
          fontSize: fs,
          fontFamily: isEquation ? '"Georgia", serif' : "system-ui",
          background: isDark ? "rgba(15,23,42,0.97)" : "rgba(255,255,255,0.99)",
          border: "1.5px solid #3b82f6",
          borderRadius: 6,
          padding: "4px 8px",
          outline: "none",
          color: element.color || (isDark ? "#f1f5f9" : "#0f172a"),
          resize: "both",
          minWidth: Math.max(120, (element.w || 200) * zoom),
          minHeight: Math.max(28, (element.h || 36) * zoom),
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          pointerEvents: "auto",
          display: "block",
          lineHeight: 1.5,
        }}
      />
      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onCommit(val)}
          style={{
            padding: "3px 10px",
            borderRadius: 6,
            border: "none",
            background: "#3b82f6",
            color: "#fff",
            fontSize: 10,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save (↵)
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={onCancel}
          style={{
            padding: "3px 10px",
            borderRadius: 6,
            border: "1px solid #64748b",
            background: "transparent",
            color: isDark ? "#94a3b8" : "#64748b",
            fontSize: 10,
            cursor: "pointer",
          }}
        >
          Cancel (Esc)
        </button>
      </div>
    </div>
  );
}

// ── LABEL EDITOR OVERLAY ────────────────────────────────────────────────────
// For editing shape labels (rect, diamond, bubble, etc.)
function LabelOverlay({ shape, zoom, pan, onCommit, onCancel, isDark }) {
  const bounds = getShapeBounds(shape);
  const cx = (bounds.x + bounds.w / 2) * zoom + pan.x;
  const cy = (bounds.y + bounds.h / 2) * zoom + pan.y;
  const [val, setVal] = useState(shape.label || "");
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);
  return (
    <div
      style={{
        position: "absolute",
        left: cx - 80,
        top: cy - 18,
        zIndex: 500,
        minWidth: 160,
      }}
    >
      <input
        ref={ref}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
            return;
          }
          if (e.key === "Enter") {
            e.preventDefault();
            onCommit(val);
            return;
          }
        }}
        onBlur={() => onCommit(val)}
        style={{
          width: "100%",
          fontSize: Math.max(11, zoom * 11),
          fontFamily: "system-ui",
          background: isDark ? "rgba(15,23,42,0.97)" : "rgba(255,255,255,0.99)",
          border: "1.5px solid #3b82f6",
          borderRadius: 6,
          padding: "4px 8px",
          outline: "none",
          color: shape.color || (isDark ? "#f1f5f9" : "#0f172a"),
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

// ── COMMENT POPUP ──────────────────────────────────────────────────────────
function CommentPopup({
  position,
  element,
  onSave,
  onCancel,
  onDelete,
  onResolve,
  isDark,
}) {
  const [text, setText] = useState(element?.text || "");
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  const isEdit = !!element;

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        zIndex: 600,
        width: 260,
        background: isDark ? "#1e293b" : "#fff",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0"}`,
        borderRadius: 12,
        padding: 14,
        boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "#f59e0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MessageSquare size={13} color="#fff" />
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: isDark ? "#f1f5f9" : "#0f172a",
            }}
          >
            {isEdit ? "Edit Comment" : "Add Comment"}
          </span>
        </div>
        <button
          onClick={onCancel}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#64748b",
          }}
        >
          <X size={13} />
        </button>
      </div>
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancel();
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) onSave(text);
        }}
        placeholder="Add a comment… (Ctrl+Enter to save)"
        rows={3}
        style={{
          width: "100%",
          borderRadius: 8,
          border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0"}`,
          background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
          color: isDark ? "#f1f5f9" : "#0f172a",
          fontSize: 12,
          padding: "8px 10px",
          outline: "none",
          resize: "vertical",
          boxSizing: "border-box",
          fontFamily: "system-ui",
        }}
      />
      <div
        style={{
          display: "flex",
          gap: 6,
          marginTop: 8,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {isEdit && (
            <>
              <button
                onClick={() => onResolve()}
                style={{
                  padding: "5px 10px",
                  borderRadius: 7,
                  border: "1px solid #22c55e",
                  background: "transparent",
                  color: "#22c55e",
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ✓ Resolve
              </button>
              <button
                onClick={() => onDelete()}
                style={{
                  padding: "5px 10px",
                  borderRadius: 7,
                  border: "1px solid #f87171",
                  background: "transparent",
                  color: "#f87171",
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={onCancel}
            style={{
              padding: "5px 10px",
              borderRadius: 7,
              border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0"}`,
              background: "transparent",
              color: "#64748b",
              fontSize: 10,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(text)}
            style={{
              padding: "5px 12px",
              borderRadius: 7,
              border: "none",
              background: "#f59e0b",
              color: "#fff",
              fontSize: 10,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── EQUATION POPUP ─────────────────────────────────────────────────────────
function EquationPopup({ position, element, onSave, onCancel, isDark }) {
  const [text, setText] = useState(element?.text || "");
  const ref = useRef(null);
  const examples = [
    "f(x) = x² + 1",
    "E = mc²",
    "a² + b² = c²",
    "∑(i=1 to n) i = n(n+1)/2",
    "∇²φ = ρ/ε₀",
  ];
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);
  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        zIndex: 600,
        width: 300,
        background: isDark ? "#1e293b" : "#fff",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0"}`,
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Hash size={13} color="#3b82f6" />
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: isDark ? "#f1f5f9" : "#0f172a",
            }}
          >
            {element ? "Edit Equation" : "Insert Equation"}
          </span>
        </div>
        <button
          onClick={onCancel}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#64748b",
          }}
        >
          <X size={13} />
        </button>
      </div>
      <input
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancel();
          if (e.key === "Enter") onSave(text);
        }}
        placeholder="Type a formula…"
        style={{
          width: "100%",
          fontSize: 14,
          fontFamily: '"Georgia", serif',
          border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#e2e8f0"}`,
          borderRadius: 8,
          padding: "8px 10px",
          background: isDark
            ? "rgba(59,130,246,0.08)"
            : "rgba(59,130,246,0.04)",
          color: isDark ? "#93c5fd" : "#1d4ed8",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      {text && (
        <div
          style={{
            marginTop: 8,
            padding: "8px 12px",
            borderRadius: 8,
            background: isDark
              ? "rgba(59,130,246,0.1)"
              : "rgba(59,130,246,0.06)",
            border: `1px solid rgba(59,130,246,0.2)`,
          }}
        >
          <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>
            Preview:
          </div>
          <div
            style={{
              fontSize: 16,
              fontFamily: '"Georgia", serif',
              color: isDark ? "#93c5fd" : "#1d4ed8",
            }}
          >
            {text}
          </div>
        </div>
      )}
      <div style={{ marginTop: 10 }}>
        <div
          style={{
            fontSize: 10,
            color: "#64748b",
            marginBottom: 6,
            fontWeight: 600,
          }}
        >
          Examples:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => setText(ex)}
              style={{
                padding: "3px 8px",
                borderRadius: 6,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
                background: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc",
                color: isDark ? "#94a3b8" : "#475569",
                fontSize: 9,
                cursor: "pointer",
                fontFamily: '"Georgia", serif',
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 12,
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={onCancel}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0"}`,
            background: "transparent",
            color: "#64748b",
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(text)}
          disabled={!text.trim()}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "none",
            background: text.trim() ? "#3b82f6" : "#94a3b8",
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            cursor: text.trim() ? "pointer" : "not-allowed",
          }}
        >
          Insert
        </button>
      </div>
    </div>
  );
}

// ── CANVAS WHITEBOARD ──────────────────────────────────────────────────────
function CanvasWhiteboard({
  sessionId,
  stompClient,
  connected,
  isDark,
  userName,
  userRole,
  initialShapes = [],
  whiteboardId,
  whiteboardTitle,
  selectedProject,
  onSaveStatusChange,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Drawing refs (no re-render on change)
  const pathsRef = useRef([]);
  const shapesRef = useRef([]);
  const livePathRef = useRef(null);
  const liveConnectorRef = useRef(null);
  const liveFrameRef = useRef(null);
  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const isDrawingRef = useRef(false);
  const isPanningRef = useRef(false);
  const lastPosRef = useRef(null);
  const dragModeRef = useRef(null);
  const dragStartRef = useRef(null);
  const resizeHandleRef = useRef(null);
  const origShapeRef = useRef(null);
  const selectedIdRef = useRef(null);
  const uiRef = useRef(false);
  const clipboardRef = useRef(null);

  // React state
  const [paths, _setPaths] = useState([]);
  const [shapes, _setShapes] = useState([]);
  const [activeTool, setActiveTool] = useState("pen");
  const [color, setColor] = useState("#2563eb");
  const [strokeWidth, setStroke] = useState(3);
  const [zoom, _setZoom] = useState(1);
  const [panOffset, _setPan] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState(null);
  const [shapesOpen, setShapesOpen] = useState(false);
  const [activeShapeCat, setActiveShapeCat] = useState("Basic Shapes");
  const [shapeSearch, setShapeSearch] = useState("");
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [toast, setToast] = useState(null);

  // ── FIX 1: Text overlay state ──────────────────────────────────────────
  const [textOverlay, setTextOverlay] = useState(null); // { element, isNew, isLabel }

  // ── FIX 2: Comment popup state ─────────────────────────────────────────
  const [commentPopup, setCommentPopup] = useState(null); // { screenPos, worldPos, element }

  // ── FIX 2: Equation popup state ────────────────────────────────────────
  const [equationPopup, setEquationPopup] = useState(null); // { screenPos, worldPos, element }

  const [fontSize, setFontSize] = useState(14);
  const [fontBold, setFontBold] = useState(false);
  const [fontItalic, setFontItalic] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const [pages, setPages] = useState([{ id: 1, name: "Page 1", active: true }]);
  const fileInputRef = useRef(null);

  // Sync refs
  const setPaths = useCallback((u) => {
    _setPaths((p) => {
      const n = typeof u === "function" ? u(p) : u;
      pathsRef.current = n;
      return n;
    });
  }, []);

  const setShapesSafe = useCallback((updater) => {
    _setShapes((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      shapesRef.current = next;
      return next;
    });
  }, []);

  const setZoom = useCallback((u) => {
    _setZoom((p) => {
      const n = typeof u === "function" ? u(p) : u;
      zoomRef.current = n;
      return n;
    });
  }, []);

  const setPan = useCallback((u) => {
    _setPan((p) => {
      const n = typeof u === "function" ? u(p) : u;
      panRef.current = n;
      return n;
    });
  }, []);

  // Load initial shapes
  useEffect(() => {
    const withIds = (Array.isArray(initialShapes) ? initialShapes : []).map(
      (s) =>
        s.id
          ? s
          : { ...s, id: makeId(), selected: false, rotation: 0, locked: false },
    );
    shapesRef.current = withIds;
    _setShapes(withIds);
  }, [initialShapes]);

  // ── CANVAS RESIZE ────────────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ct = containerRef.current || c.parentElement;
    if (!ct) return;
    const r = ct.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    c.width = Math.floor(r.width * dpr);
    c.height = Math.floor(r.height * dpr);
    c.style.width = `${r.width}px`;
    c.style.height = `${r.height}px`;
    c.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  // ── REDRAW ───────────────────────────────────────────────────────────────
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const z = zoomRef.current,
      pan = panRef.current;
    const W = canvas.clientWidth,
      H = canvas.clientHeight;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = isDark ? "#0f172a" : "#ffffff";
    ctx.fillRect(0, 0, W, H);
    // Grid
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)";
    ctx.lineWidth = 1;
    const gs = 24 * z;
    for (let x = pan.x % gs; x < W; x += gs) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = pan.y % gs; y < H; y += gs) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    // Shapes
    shapesRef.current.forEach((s) =>
      drawShapeOnCanvas(ctx, s, z, pan, isDark, s.id === selectedIdRef.current),
    );
    // Saved paths
    pathsRef.current.forEach((p) =>
      drawSmoothPath(ctx, p.points, {
        color: p.color,
        width: p.width,
        zoom: z,
        panOffset: pan,
        tool: p.tool,
      }),
    );
    // Live path
    if (livePathRef.current?.points?.length > 0) {
      drawSmoothPath(ctx, livePathRef.current.points, {
        color: livePathRef.current.color,
        width: livePathRef.current.width,
        zoom: z,
        panOffset: pan,
        tool: livePathRef.current.tool,
      });
    }
    // Live connector preview
    if (liveConnectorRef.current) {
      const c2 = liveConnectorRef.current;
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(c2.x1 * z + pan.x, c2.y1 * z + pan.y);
      ctx.lineTo(c2.x2 * z + pan.x, c2.y2 * z + pan.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // Live frame preview
    if (liveFrameRef.current) {
      const f = liveFrameRef.current;
      const fx = f.x * z + pan.x,
        fy = f.y * z + pan.y,
        fw = f.w * z,
        fh = f.h * z;
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 3]);
      ctx.strokeRect(fx, fy, fw, fh);
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(59,130,246,0.05)";
      ctx.fillRect(fx, fy, fw, fh);
    }
  }, [isDark]);

  useEffect(() => {
    selectedIdRef.current = selectedId;
    redraw();
  }, [selectedId, redraw]);
  useEffect(() => {
    redraw();
  }, [paths, shapes, zoom, panOffset, isDark, redraw]);

  useEffect(() => {
    resizeCanvas();
    redraw();
    const onResize = () => {
      resizeCanvas();
      redraw();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [resizeCanvas, redraw]);

  // ── WHEEL ZOOM ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left,
          my = e.clientY - rect.top;
        const delta = e.deltaY < 0 ? 1.1 : 0.9;
        const newZ = Math.max(0.05, Math.min(8, zoomRef.current * delta));
        const newPanX = mx - (mx - panRef.current.x) * (newZ / zoomRef.current);
        const newPanY = my - (my - panRef.current.y) * (newZ / zoomRef.current);
        zoomRef.current = newZ;
        panRef.current = { x: newPanX, y: newPanY };
        _setZoom(newZ);
        _setPan({ x: newPanX, y: newPanY });
        redraw();
      } else {
        e.preventDefault();
        panRef.current = {
          x: panRef.current.x - e.deltaX,
          y: panRef.current.y - e.deltaY,
        };
        _setPan({ ...panRef.current });
        redraw();
      }
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [redraw]);

  // ── STOMP ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!stompClient || !connected || !sessionId) return;
    const sub = stompClient.subscribe(
      `/topic/whiteboard/${sessionId}`,
      (msg) => {
        try {
          const event = JSON.parse(msg.body);
          if (event.userId === userName) return;
          if (event.eventType === "CLEAR") {
            setPaths([]);
            setShapesSafe([]);
            setHistory([]);
            return;
          }
          if (event.eventType === "FULL_STATE" && event.elements) {
            const p = parseWhiteboardElements(event.elements);
            setPaths(p.paths || []);
            setShapesSafe(p.templateShapes || []);
          }
        } catch {}
      },
    );
    return () => sub.unsubscribe();
  }, [stompClient, connected, sessionId, userName]);

  // ── LOAD STATE ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId && !whiteboardId) return;
    const key = `whiteboard:${whiteboardId || sessionId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const d = JSON.parse(raw);
        const p = parseWhiteboardElements(d.elements || d);
        if (p.paths?.length || p.templateShapes?.length) {
          setPaths(p.paths || []);
          setShapesSafe(p.templateShapes || []);
          if (p.zoom) {
            zoomRef.current = p.zoom;
            _setZoom(p.zoom);
          }
          if (p.panOffset) {
            panRef.current = p.panOffset;
            _setPan(p.panOffset);
          }
          return;
        }
      } catch {}
    }
    if (sessionId) {
      getWhiteboardState(sessionId)
        .then((res) => {
          if (res.data?.elements) {
            const p = parseWhiteboardElements(res.data.elements);
            setPaths(p.paths || []);
            setShapesSafe(p.templateShapes || []);
            if (p.zoom) {
              zoomRef.current = p.zoom;
              _setZoom(p.zoom);
            }
            if (p.panOffset) {
              panRef.current = p.panOffset;
              _setPan(p.panOffset);
            }
          }
        })
        .catch(() => {});
    }
  }, [sessionId, whiteboardId]);

  // ── DIRTY TRACKING ───────────────────────────────────────────────────────
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSaveStatus("dirty");
    if (onSaveStatusChange) onSaveStatusChange("dirty");
  }, [paths, shapes]);

  function showToast(msg, type = "success") {
    setToast({ message: msg, type });
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => setToast(null), 2500);
  }

  // ── PUBLISH ──────────────────────────────────────────────────────────────
  const publish = useCallback(
    (path) => {
      if (!stompClient || !connected) return;
      stompClient.publish({
        destination: `/app/whiteboard/${sessionId}`,
        body: JSON.stringify({
          eventType: "DRAW",
          elements: JSON.stringify(path),
          userId: userName,
          userName,
          userRole,
        }),
      });
    },
    [stompClient, connected, sessionId, userName, userRole],
  );

  const publishFull = useCallback(() => {
    if (!stompClient || !connected) return;
    stompClient.publish({
      destination: `/app/whiteboard/${sessionId}`,
      body: JSON.stringify({
        eventType: "FULL_STATE",
        elements: JSON.stringify({
          paths: pathsRef.current,
          templateShapes: shapesRef.current,
        }),
        userId: userName,
        userName,
        userRole,
      }),
    });
  }, [stompClient, connected, sessionId, userName, userRole]);

  // ── SAVE ─────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    setSaveStatus("saving");
    if (onSaveStatusChange) onSaveStatusChange("saving");
    const payload = {
      paths: pathsRef.current,
      templateShapes: shapesRef.current,
      zoom: zoomRef.current,
      panOffset: panRef.current,
    };
    const elemJson = JSON.stringify(payload);
    try {
      if (sessionId) {
        await saveWhiteboardSnapshot(sessionId, {
          eventType: "FULL_STATE",
          elements: elemJson,
          userId: userName,
          userRole,
          title: whiteboardTitle,
          project: selectedProject,
        });
      }
      localStorage.setItem(
        `whiteboard:${whiteboardId || sessionId || "default"}`,
        elemJson,
      );
      setSaveStatus("saved");
      setLastSavedAt(new Date());
      if (onSaveStatusChange) onSaveStatusChange("saved");
      showToast("Whiteboard saved ✓");
    } catch {
      try {
        localStorage.setItem(
          `whiteboard:${whiteboardId || sessionId || "default"}`,
          elemJson,
        );
        setSaveStatus("saved");
        setLastSavedAt(new Date());
        if (onSaveStatusChange) onSaveStatusChange("saved");
        showToast("Saved locally");
      } catch {
        setSaveStatus("error");
        if (onSaveStatusChange) onSaveStatusChange("error");
        showToast("Save failed", "error");
      }
    }
  }, [
    sessionId,
    whiteboardId,
    whiteboardTitle,
    selectedProject,
    userName,
    userRole,
    onSaveStatusChange,
  ]);

  // ── ADD SHAPE ────────────────────────────────────────────────────────────
  const addShape = useCallback(
    (shapeId) => {
      const canvas = canvasRef.current;
      const z = zoomRef.current,
        pan = panRef.current;
      const cw = canvas?.clientWidth || 600,
        ch = canvas?.clientHeight || 400;
      const offset = (shapesRef.current.length % 6) * 18;
      const wx = (cw / 2 - pan.x) / z + offset;
      const wy = (ch / 2 - pan.y) / z + offset;
      const newShape = createShape(shapeId, wx, wy, color);
      if (!newShape) return;
      snapshotHistory();
      setShapesSafe((p) => [...p, newShape]);
      setSelectedId(newShape.id);
      setActiveTool("select");
      setSaveStatus("dirty");
    },
    [color],
  );

  // ── FIX 3: updateSelectedElements ─────────────────────────────────────
  // Applies a patch to all selected shapes/elements or just the one with selectedId
  const updateSelectedElements = useCallback(
    (patch) => {
      if (!selectedIdRef.current) return;
      snapshotHistory();
      setShapesSafe((prev) =>
        prev.map((s) => {
          if (s.id !== selectedIdRef.current) return s;
          // Map generic patch keys to element-specific fields
          const update = { ...s };
          if (patch.color !== undefined) {
            // color affects: stroke for shapes, text color for text elements
            if (
              [
                "text_element",
                "equation_element",
                "sticky_note",
                "comment_element",
              ].includes(s.type)
            ) {
              update.color = patch.color;
            } else {
              update.color = patch.color;
            }
          }
          if (patch.fill !== undefined) update.fill = patch.fill;
          if (patch.strokeWidth !== undefined)
            update.strokeWidth = patch.strokeWidth;
          if (patch.fontSize !== undefined) update.fontSize = patch.fontSize;
          if (patch.fontWeight !== undefined)
            update.fontWeight = patch.fontWeight;
          if (patch.fontStyle !== undefined) update.fontStyle = patch.fontStyle;
          if (patch.label !== undefined) update.label = patch.label;
          if (patch.text !== undefined) update.text = patch.text;
          return update;
        }),
      );
      setSaveStatus("dirty");
      redraw();
      publishFull();
    },
    [redraw, publishFull],
  );

  // ── UNDO / REDO ──────────────────────────────────────────────────────────
  function snapshotHistory() {
    setHistory((h) => [
      ...h,
      { paths: [...pathsRef.current], shapes: [...shapesRef.current] },
    ]);
    setRedoStack([]);
  }

  const undo = useCallback(() => {
    setHistory((h) => {
      if (!h.length) return h;
      const snap = h[h.length - 1];
      setRedoStack((r) => [
        ...r,
        { paths: [...pathsRef.current], shapes: [...shapesRef.current] },
      ]);
      setPaths(snap.paths || []);
      setShapesSafe(snap.shapes || []);
      setSaveStatus("dirty");
      return h.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setRedoStack((r) => {
      if (!r.length) return r;
      const snap = r[r.length - 1];
      setHistory((h) => [
        ...h,
        { paths: [...pathsRef.current], shapes: [...shapesRef.current] },
      ]);
      setPaths(snap.paths || []);
      setShapesSafe(snap.shapes || []);
      setSaveStatus("dirty");
      return r.slice(0, -1);
    });
  }, []);

  const clearCanvas = useCallback(() => {
    snapshotHistory();
    setPaths([]);
    setShapesSafe([]);
    setSaveStatus("dirty");
    if (sessionId) clearWhiteboardSession(sessionId).catch(() => {});
  }, [sessionId]);

  const exportPNG = useCallback(() => {
    const canvas = canvasRef.current;
    const a = document.createElement("a");
    a.download = `whiteboard-${Date.now()}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  }, []);

  // ── IMAGE UPLOAD ─────────────────────────────────────────────────────────
  const handleImageFile = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      const img = new window.Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const z = zoomRef.current,
          pan = panRef.current;
        const cw = canvas?.clientWidth || 600,
          ch = canvas?.clientHeight || 400;
        const maxW = 300,
          maxH = 250;
        let w = img.width,
          h = img.height;
        if (w > maxW) {
          h = (h * maxW) / w;
          w = maxW;
        }
        if (h > maxH) {
          w = (w * maxH) / h;
          h = maxH;
        }
        const wx = (cw / 2 - pan.x) / z - w / 2;
        const wy = (ch / 2 - pan.y) / z - h / 2;
        const imgEl = {
          id: makeId(),
          type: "image_element",
          x: wx,
          y: wy,
          w,
          h,
          src,
          selected: false,
          rotation: 0,
          locked: false,
        };
        snapshotHistory();
        setShapesSafe((p) => [...p, imgEl]);
        setSelectedId(imgEl.id);
        setActiveTool("select");
        setSaveStatus("dirty");
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, []);

  // ── FIX 1: TEXT COMMIT ────────────────────────────────────────────────
  const commitText = useCallback(
    (val) => {
      const ov = textOverlay;
      if (!ov) return;
      setTextOverlay(null);

      if (ov.isLabel) {
        // Editing a shape's label
        if (val !== null) {
          snapshotHistory();
          setShapesSafe((p) =>
            p.map((s) => (s.id === ov.element.id ? { ...s, label: val } : s)),
          );
          setSaveStatus("dirty");
          publishFull();
        }
        return;
      }

      if (!val?.trim() && ov.isNew) return; // discard empty new text

      snapshotHistory();
      if (ov.isNew) {
        const el = {
          ...ov.element,
          text: val,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setShapesSafe((p) => [...p, el]);
        setSelectedId(el.id);
      } else {
        setShapesSafe((p) =>
          p.map((s) =>
            s.id === ov.element.id
              ? { ...s, text: val, updatedAt: new Date().toISOString() }
              : s,
          ),
        );
      }
      setSaveStatus("dirty");
      publishFull();
    },
    [textOverlay, publishFull],
  );

  // ── FIX 2: COMMENT SAVE ────────────────────────────────────────────────
  const saveComment = useCallback(
    (text) => {
      const popup = commentPopup;
      if (!popup) return;
      setCommentPopup(null);
      if (!text?.trim()) return;
      snapshotHistory();
      if (popup.element) {
        // edit existing
        setShapesSafe((p) =>
          p.map((s) =>
            s.id === popup.element.id
              ? { ...s, text, updatedAt: new Date().toISOString() }
              : s,
          ),
        );
      } else {
        // new comment
        const el = {
          id: makeId(),
          type: "comment_element",
          x: popup.worldPos.x,
          y: popup.worldPos.y,
          w: 28,
          h: 28,
          text,
          authorName: userName,
          resolved: false,
          selected: false,
          rotation: 0,
          locked: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setShapesSafe((p) => [...p, el]);
        setSelectedId(el.id);
      }
      setSaveStatus("dirty");
      publishFull();
    },
    [commentPopup, userName, publishFull],
  );

  const deleteComment = useCallback(() => {
    const popup = commentPopup;
    if (!popup?.element) return;
    setCommentPopup(null);
    snapshotHistory();
    setShapesSafe((p) => p.filter((s) => s.id !== popup.element.id));
    setSelectedId(null);
    setSaveStatus("dirty");
    publishFull();
  }, [commentPopup, publishFull]);

  const resolveComment = useCallback(() => {
    const popup = commentPopup;
    if (!popup?.element) return;
    setCommentPopup(null);
    snapshotHistory();
    setShapesSafe((p) =>
      p.map((s) =>
        s.id === popup.element.id ? { ...s, resolved: !s.resolved } : s,
      ),
    );
    setSaveStatus("dirty");
    publishFull();
  }, [commentPopup, publishFull]);

  // ── FIX 2: EQUATION SAVE ───────────────────────────────────────────────
  const saveEquation = useCallback(
    (text) => {
      const popup = equationPopup;
      if (!popup) return;
      setEquationPopup(null);
      if (!text?.trim()) return;
      snapshotHistory();
      if (popup.element) {
        setShapesSafe((p) =>
          p.map((s) =>
            s.id === popup.element.id
              ? { ...s, text, updatedAt: new Date().toISOString() }
              : s,
          ),
        );
      } else {
        const el = {
          id: makeId(),
          type: "equation_element",
          x: popup.worldPos.x,
          y: popup.worldPos.y,
          w: 200,
          h: 40,
          text,
          fontSize: fontSize || 18,
          color,
          selected: false,
          rotation: 0,
          locked: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setShapesSafe((p) => [...p, el]);
        setSelectedId(el.id);
      }
      setSaveStatus("dirty");
      publishFull();
    },
    [equationPopup, fontSize, color, publishFull],
  );

  // ── POINTER HELPERS ───────────────────────────────────────────────────
  const getCoords = (e) =>
    e.touches
      ? { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }
      : { clientX: e.clientX, clientY: e.clientY };

  // ── FIX 1+2: POINTER DOWN ─────────────────────────────────────────────
  const onPointerDown = useCallback(
    (e) => {
      if (uiRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {}
      const { clientX, clientY } = getCoords(e);
      const rect = canvas.getBoundingClientRect();
      const screenX = clientX - rect.left,
        screenY = clientY - rect.top;
      const world = getWorldCoords(
        clientX,
        clientY,
        canvas,
        zoomRef.current,
        panRef.current,
      );

      // Close any open popups on canvas click
      setCommentPopup(null);
      setEquationPopup(null);

      // ── SELECT TOOL ──
      if (activeTool === "select") {
        const selShape = shapesRef.current.find(
          (s) => s.id === selectedIdRef.current,
        );
        if (selShape) {
          const handle = getResizeHandleAtPoint(
            screenX,
            screenY,
            selShape,
            zoomRef.current,
            panRef.current,
          );
          if (handle) {
            dragModeRef.current = "resize";
            resizeHandleRef.current = handle;
            dragStartRef.current = { wx: world.x, wy: world.y };
            origShapeRef.current = { ...selShape };
            e.preventDefault();
            return;
          }
        }
        const hit = findShapeAtPoint(world, shapesRef.current);
        if (hit) {
          setSelectedId(hit.id);
          dragModeRef.current = "move";
          dragStartRef.current = { wx: world.x, wy: world.y };
          origShapeRef.current = { ...hit };
          e.preventDefault();
        } else {
          setSelectedId(null);
          dragModeRef.current = null;
        }
        return;
      }

      // ── HAND / PAN ──
      if (activeTool === "hand") {
        isPanningRef.current = true;
        lastPosRef.current = { x: clientX, y: clientY };
        e.preventDefault();
        return;
      }

      // ── DRAW TOOLS ──
      if (["pen", "pencil", "highlighter", "eraser"].includes(activeTool)) {
        e.preventDefault();
        isDrawingRef.current = true;
        livePathRef.current = {
          points: [world],
          color,
          width: strokeWidth,
          tool: activeTool,
        };
        redraw();
        return;
      }

      // ── CONNECTOR / ARROW ──
      if (activeTool === "connector" || activeTool === "arrow") {
        e.preventDefault();
        liveConnectorRef.current = {
          x1: world.x,
          y1: world.y,
          x2: world.x,
          y2: world.y,
          color,
        };
        isDrawingRef.current = true;
        return;
      }

      // ── FRAME DRAW ──
      if (activeTool === "frame") {
        e.preventDefault();
        liveFrameRef.current = { x: world.x, y: world.y, w: 0, h: 0 };
        dragStartRef.current = { wx: world.x, wy: world.y };
        isDrawingRef.current = true;
        return;
      }

      // ── FIX 1: TEXT TOOL ──────────────────────────────────────────────
      if (activeTool === "text") {
        e.preventDefault();
        const el = {
          id: makeId(),
          type: "text_element",
          x: world.x,
          y: world.y,
          w: 220,
          h: Math.max(30, (fontSize + 4) * 3),
          text: "",
          color: color,
          fontSize,
          fontWeight: fontBold ? "bold" : "normal",
          fontStyle: fontItalic ? "italic" : "normal",
          selected: false,
          rotation: 0,
          locked: false,
        };
        setTextOverlay({ element: el, isNew: true, isLabel: false });
        return;
      }

      // ── FIX 1: EQUATION TOOL ──────────────────────────────────────────
      if (activeTool === "equation") {
        e.preventDefault();
        const rect2 = canvas.getBoundingClientRect();
        // Position popup near click, but keep on screen
        const popupX = Math.min(screenX, (canvas.clientWidth || 600) - 320);
        const popupY = Math.min(screenY, (canvas.clientHeight || 400) - 280);
        const existingEl = findShapeAtPoint(world, shapesRef.current);
        if (existingEl?.type === "equation_element") {
          setEquationPopup({
            screenPos: { x: popupX, y: popupY },
            worldPos: world,
            element: existingEl,
          });
        } else {
          setEquationPopup({
            screenPos: { x: popupX, y: popupY },
            worldPos: world,
            element: null,
          });
        }
        return;
      }

      // ── FIX 2: COMMENT TOOL ───────────────────────────────────────────
      if (activeTool === "comment") {
        e.preventDefault();
        const rect2 = canvas.getBoundingClientRect();
        const popupX = Math.min(screenX, (canvas.clientWidth || 600) - 280);
        const popupY = Math.min(screenY, (canvas.clientHeight || 400) - 220);
        const existingEl = findShapeAtPoint(world, shapesRef.current);
        if (existingEl?.type === "comment_element") {
          setCommentPopup({
            screenPos: { x: popupX, y: popupY },
            worldPos: world,
            element: existingEl,
          });
        } else {
          setCommentPopup({
            screenPos: { x: popupX, y: popupY },
            worldPos: world,
            element: null,
          });
        }
        return;
      }

      if (activeTool === "sticky") {
        e.preventDefault();
        snapshotHistory();
        const el = {
          id: makeId(),
          type: "sticky_note",
          x: world.x,
          y: world.y,
          w: 160,
          h: 120,
          text: "Double-click to edit",
          color: "#fef08a",
          selected: false,
          rotation: 0,
          locked: false,
        };
        setShapesSafe((p) => [...p, el]);
        setSelectedId(el.id);
        setSaveStatus("dirty");
        setTimeout(
          () => setTextOverlay({ element: el, isNew: false, isLabel: false }),
          80,
        );
        return;
      }

      if (activeTool === "image") {
        fileInputRef.current?.click();
        return;
      }
    },
    [activeTool, color, strokeWidth, fontSize, fontBold, fontItalic, redraw],
  );

  // ── POINTER MOVE ─────────────────────────────────────────────────────
  const onPointerMove = useCallback(
    (e) => {
      if (uiRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { clientX, clientY } = getCoords(e);
      const world = getWorldCoords(
        clientX,
        clientY,
        canvas,
        zoomRef.current,
        panRef.current,
      );

      if (isPanningRef.current && activeTool === "hand") {
        const dx = clientX - lastPosRef.current.x,
          dy = clientY - lastPosRef.current.y;
        panRef.current = { x: panRef.current.x + dx, y: panRef.current.y + dy };
        _setPan({ ...panRef.current });
        lastPosRef.current = { x: clientX, y: clientY };
        redraw();
        return;
      }

      if (
        activeTool === "select" &&
        dragModeRef.current === "move" &&
        origShapeRef.current
      ) {
        const ddx = world.x - dragStartRef.current.wx,
          ddy = world.y - dragStartRef.current.wy;
        const orig = origShapeRef.current;
        setShapesSafe((prev) =>
          prev.map((s) => {
            if (s.id !== orig.id) return s;
            if (s.type === "arrow_conn" || s.type === "line_conn")
              return {
                ...s,
                x1: orig.x1 + ddx,
                y1: orig.y1 + ddy,
                x2: orig.x2 + ddx,
                y2: orig.y2 + ddy,
              };
            if (s.type === "bubble_shape")
              return { ...s, x: orig.x + ddx, y: orig.y + ddy };
            return { ...s, x: orig.x + ddx, y: orig.y + ddy };
          }),
        );
        return;
      }

      if (
        activeTool === "select" &&
        dragModeRef.current === "resize" &&
        origShapeRef.current
      ) {
        const ddx = world.x - dragStartRef.current.wx,
          ddy = world.y - dragStartRef.current.wy;
        const resized = applyResize(
          origShapeRef.current,
          resizeHandleRef.current,
          ddx,
          ddy,
        );
        setShapesSafe((prev) =>
          prev.map((s) =>
            s.id === origShapeRef.current.id ? { ...resized } : s,
          ),
        );
        return;
      }

      if (
        isDrawingRef.current &&
        ["pen", "pencil", "highlighter", "eraser"].includes(activeTool)
      ) {
        const live = livePathRef.current;
        if (!live) return;
        const last = live.points[live.points.length - 1];
        if (shouldAdd(last, world)) {
          livePathRef.current = { ...live, points: [...live.points, world] };
          redraw();
        }
        return;
      }

      if (
        isDrawingRef.current &&
        (activeTool === "connector" || activeTool === "arrow")
      ) {
        liveConnectorRef.current = {
          ...liveConnectorRef.current,
          x2: world.x,
          y2: world.y,
        };
        redraw();
        return;
      }

      if (isDrawingRef.current && activeTool === "frame") {
        const start = dragStartRef.current;
        liveFrameRef.current = {
          x: Math.min(start.wx, world.x),
          y: Math.min(start.wy, world.y),
          w: Math.abs(world.x - start.wx),
          h: Math.abs(world.y - start.wy),
        };
        redraw();
        return;
      }
    },
    [activeTool, redraw],
  );

  // ── POINTER UP ───────────────────────────────────────────────────────
  const onPointerUp = useCallback(
    (e) => {
      const canvas = canvasRef.current;
      try {
        canvas?.releasePointerCapture(e.pointerId);
      } catch {}

      if (isPanningRef.current) {
        isPanningRef.current = false;
        return;
      }

      if (activeTool === "select" && dragModeRef.current) {
        if (
          dragModeRef.current === "move" ||
          dragModeRef.current === "resize"
        ) {
          snapshotHistory();
          publishFull();
          setSaveStatus("dirty");
        }
        dragModeRef.current = null;
        resizeHandleRef.current = null;
        dragStartRef.current = null;
        origShapeRef.current = null;
        return;
      }

      if (
        isDrawingRef.current &&
        ["pen", "pencil", "highlighter", "eraser"].includes(activeTool)
      ) {
        const finished = livePathRef.current;
        livePathRef.current = null;
        isDrawingRef.current = false;
        if (finished?.points?.length > 0) {
          snapshotHistory();
          setPaths((p) => [...p, finished]);
          publish(finished);
          setSaveStatus("dirty");
        }
        redraw();
        return;
      }

      if (
        isDrawingRef.current &&
        (activeTool === "connector" || activeTool === "arrow")
      ) {
        const conn = liveConnectorRef.current;
        liveConnectorRef.current = null;
        isDrawingRef.current = false;
        if (
          conn &&
          (Math.abs(conn.x2 - conn.x1) > 5 || Math.abs(conn.y2 - conn.y1) > 5)
        ) {
          snapshotHistory();
          const el = {
            ...conn,
            id: makeId(),
            type: activeTool === "arrow" ? "arrow_conn" : "line_conn",
            selected: false,
            rotation: 0,
            locked: false,
          };
          setShapesSafe((p) => [...p, el]);
          setSelectedId(el.id);
          setSaveStatus("dirty");
          publishFull();
        }
        redraw();
        return;
      }

      if (isDrawingRef.current && activeTool === "frame") {
        const fr = liveFrameRef.current;
        liveFrameRef.current = null;
        isDrawingRef.current = false;
        if (fr && fr.w > 20 && fr.h > 20) {
          snapshotHistory();
          const el = {
            id: makeId(),
            type: "frame_element",
            ...fr,
            label: "Frame",
            color: "#3b82f6",
            selected: false,
            rotation: 0,
            locked: false,
          };
          setShapesSafe((p) => [...p, el]);
          setSelectedId(el.id);
          setSaveStatus("dirty");
          publishFull();
        }
        redraw();
        return;
      }
    },
    [activeTool, publish, publishFull, redraw],
  );

  // ── FIX 1+2: DOUBLE CLICK (edit text/equation/comment/label) ──────────
  const onDblClick = useCallback((e) => {
    if (uiRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { clientX, clientY } = getCoords(e);
    const rect = canvas.getBoundingClientRect();
    const screenX = clientX - rect.left,
      screenY = clientY - rect.top;
    const world = getWorldCoords(
      clientX,
      clientY,
      canvas,
      zoomRef.current,
      panRef.current,
    );
    const hit = findShapeAtPoint(world, shapesRef.current);
    if (!hit) return;

    // Text elements — open text overlay
    if (hit.type === "text_element" || hit.type === "sticky_note") {
      setTextOverlay({ element: hit, isNew: false, isLabel: false });
      return;
    }

    // Equation — open equation popup
    if (hit.type === "equation_element") {
      const popupX = Math.min(screenX, (canvas.clientWidth || 600) - 320);
      const popupY = Math.min(screenY, (canvas.clientHeight || 400) - 280);
      setEquationPopup({
        screenPos: { x: popupX, y: popupY },
        worldPos: world,
        element: hit,
      });
      return;
    }

    // Comment — open comment popup
    if (hit.type === "comment_element") {
      const popupX = Math.min(screenX, (canvas.clientWidth || 600) - 280);
      const popupY = Math.min(screenY, (canvas.clientHeight || 400) - 220);
      setCommentPopup({
        screenPos: { x: popupX, y: popupY },
        worldPos: world,
        element: hit,
      });
      return;
    }

    // Shape with a label — open label editor
    if (
      [
        "rect_shape",
        "triangle_shape",
        "polygon_shape",
        "diamond_shape",
        "bubble_shape",
        "class_shape",
        "er_entity",
        "er_relation",
      ].includes(hit.type)
    ) {
      setTextOverlay({ element: hit, isNew: false, isLabel: true });
      return;
    }
  }, []);

  // ── KEYBOARD ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedIdRef.current
      ) {
        snapshotHistory();
        setShapesSafe((p) => p.filter((s) => s.id !== selectedIdRef.current));
        setSelectedId(null);
        setSaveStatus("dirty");
        return;
      }
      if (e.key === "Escape") {
        setSelectedId(null);
        setTextOverlay(null);
        setCommentPopup(null);
        setEquationPopup(null);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
        return;
      }

      // Ctrl+C: copy selected shape
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        if (selectedIdRef.current) {
          const orig = shapesRef.current.find(
            (s) => s.id === selectedIdRef.current,
          );
          if (orig) clipboardRef.current = { ...orig };
        }
        return;
      }

      // Ctrl+V: paste
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        if (clipboardRef.current) {
          e.preventDefault();
          snapshotHistory();
          const dup = {
            ...clipboardRef.current,
            id: makeId(),
            x: (clipboardRef.current.x || 0) + 20,
            y: (clipboardRef.current.y || 0) + 20,
          };
          setShapesSafe((p) => [...p, dup]);
          setSelectedId(dup.id);
          setSaveStatus("dirty");
        }
        return;
      }

      // Ctrl+D: duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        if (selectedIdRef.current) {
          const orig = shapesRef.current.find(
            (s) => s.id === selectedIdRef.current,
          );
          if (orig) {
            snapshotHistory();
            const dup = {
              ...orig,
              id: makeId(),
              x: (orig.x || 0) + 20,
              y: (orig.y || 0) + 20,
            };
            setShapesSafe((p) => [...p, dup]);
            setSelectedId(dup.id);
            setSaveStatus("dirty");
          }
        }
        return;
      }

      const toolKeys = {
        v: "select",
        h: "hand",
        p: "pen",
        e: "eraser",
        t: "text",
        s: "sticky",
        c: "connector",
        n: "sticky",
        f: "frame",
      };
      if (!e.ctrlKey && !e.metaKey && toolKeys[e.key])
        setActiveTool(toolKeys[e.key]);
      if (e.key === "+" || e.key === "=")
        setZoom((z) => Math.min(8, +(z + 0.2).toFixed(2)));
      if (e.key === "-") setZoom((z) => Math.max(0.05, +(z - 0.2).toFixed(2)));
      if (e.key === "0") {
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, handleSave]);

  // ── FIX 3: Color/style change handlers ────────────────────────────────
  const handleColorChange = useCallback(
    (newColor) => {
      setColor(newColor);
      // If something is selected, update its color too
      if (selectedIdRef.current) {
        updateSelectedElements({ color: newColor });
      }
    },
    [updateSelectedElements],
  );

  const handleStrokeChange = useCallback(
    (newWidth) => {
      setStroke(newWidth);
      if (selectedIdRef.current) {
        updateSelectedElements({ strokeWidth: newWidth });
      }
    },
    [updateSelectedElements],
  );

  const handleFontSizeChange = useCallback(
    (newSize) => {
      setFontSize(newSize);
      if (selectedIdRef.current) {
        updateSelectedElements({ fontSize: newSize });
      }
    },
    [updateSelectedElements],
  );

  const handleFontBoldToggle = useCallback(() => {
    const newBold = !fontBold;
    setFontBold(newBold);
    if (selectedIdRef.current) {
      updateSelectedElements({ fontWeight: newBold ? "bold" : "normal" });
    }
  }, [fontBold, updateSelectedElements]);

  const handleFontItalicToggle = useCallback(() => {
    const newItalic = !fontItalic;
    setFontItalic(newItalic);
    if (selectedIdRef.current) {
      updateSelectedElements({ fontStyle: newItalic ? "italic" : "normal" });
    }
  }, [fontItalic, updateSelectedElements]);

  // ── UI helpers ────────────────────────────────────────────────────────
  const COLORS = [
    "#000000",
    "#ffffff",
    "#ef4444",
    "#f97316",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#fbbf24",
    "#64748b",
  ];
  const STROKE_SIZES = [1, 2, 3, 5, 8, 12];

  const LEFT_TOOLS = [
    { id: "select", icon: MousePointer, label: "Select (V)" },
    { id: "hand", icon: Hand, label: "Pan (H)" },
    { id: "pen", icon: Pen, label: "Pen (P)" },
    { id: "pencil", icon: Pencil, label: "Pencil" },
    { id: "highlighter", icon: Highlighter, label: "Highlighter" },
    { id: "eraser", icon: Eraser, label: "Eraser (E)" },
    { id: "arrow", icon: ArrowRight, label: "Arrow" },
    { id: "connector", icon: ArrowUpRight, label: "Connector (C)" },
    { id: "text", icon: Type, label: "Text (T)" },
    { id: "equation", icon: Hash, label: "Equation" },
    { id: "sticky", icon: StickyNote, label: "Sticky Note (S)" },
    { id: "comment", icon: MessageSquare, label: "Comment" },
    { id: "frame", icon: Frame, label: "Frame (F)" },
    { id: "image", icon: Image, label: "Upload Image" },
  ];

  const tb = (id) =>
    activeTool === id
      ? isDark
        ? "rgba(59,130,246,0.2)"
        : "rgba(59,130,246,0.1)"
      : "transparent";
  const tc = (id) =>
    activeTool === id
      ? "#3b82f6"
      : isDark
        ? "rgba(255,255,255,0.65)"
        : "#475569";
  const isEmpty = paths.length === 0 && shapes.length === 0;

  const saveLabel =
    saveStatus === "saving"
      ? "Saving..."
      : saveStatus === "error"
        ? "Save failed"
        : saveStatus === "dirty"
          ? "Unsaved changes"
          : lastSavedAt
            ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
            : "Auto-saved";
  const saveColor =
    saveStatus === "error"
      ? "#f87171"
      : saveStatus === "dirty"
        ? "#fbbf24"
        : saveStatus === "saving"
          ? "#60a5fa"
          : "#22c55e";

  // Determine if text formatting controls should show
  const textToolActive = ["text", "equation", "sticky", "comment"].includes(
    activeTool,
  );
  const selectedShape = shapes.find((s) => s.id === selectedId);
  const selectedIsText =
    selectedShape &&
    [
      "text_element",
      "equation_element",
      "sticky_note",
      "comment_element",
    ].includes(selectedShape.type);
  const showTextFormatting = textToolActive || selectedIsText;

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        position: "relative",
        background: isDark ? "#0f172a" : "#ffffff",
      }}
    >
      {/* ── LEFT TOOLBAR ── */}
      <div
        onMouseEnter={() => {
          uiRef.current = true;
        }}
        onMouseLeave={() => {
          uiRef.current = false;
        }}
        style={{
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: "8px 6px",
          background: isDark ? "rgba(15,23,42,0.98)" : "rgba(255,255,255,0.99)",
          borderRadius: 14,
          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        {LEFT_TOOLS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            title={label}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTool(id);
              if (id !== "shape") setShapesOpen(false);
            }}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: tb(id),
              color: tc(id),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
              position: "relative",
            }}
          >
            {activeTool === id && (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 2,
                  height: 18,
                  background: "#3b82f6",
                  borderRadius: 1,
                }}
              />
            )}
            <Icon size={15} />
          </button>
        ))}
        <div
          style={{
            width: "100%",
            height: 1,
            background: isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
            margin: "2px 0",
          }}
        />
        {[
          {
            id: "shape",
            icon: Square,
            label: "Shapes",
            action: () => setShapesOpen((s) => !s),
            active: shapesOpen,
          },
          {
            id: "pages",
            icon: Layers,
            label: "Pages",
            action: () => setShowPages((s) => !s),
            active: showPages,
          },
          {
            id: "history",
            icon: History,
            label: "History",
            action: () => setShowHistory((s) => !s),
            active: showHistory,
          },
        ].map(({ id, icon: Icon, label, action, active }) => (
          <button
            key={id}
            title={label}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              action();
            }}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: active ? "rgba(59,130,246,0.15)" : "transparent",
              color: active
                ? "#3b82f6"
                : isDark
                  ? "rgba(255,255,255,0.5)"
                  : "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={15} />
          </button>
        ))}
      </div>

      {/* ── SHAPES PANEL ── */}
      {shapesOpen && (
        <div
          onMouseEnter={() => {
            uiRef.current = true;
          }}
          onMouseLeave={() => {
            uiRef.current = false;
          }}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            left: 58,
            top: 60,
            zIndex: 300,
            width: 290,
            maxHeight: "calc(100% - 130px)",
            overflowY: "auto",
            background: isDark ? "#1e293b" : "#ffffff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
            borderRadius: 14,
            padding: 14,
            boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: isDark ? "#f1f5f9" : "#0f172a",
              }}
            >
              Shapes
            </span>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setShapesOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#64748b",
              }}
            >
              <X size={14} />
            </button>
          </div>
          <div style={{ position: "relative", marginBottom: 10 }}>
            <Search
              size={12}
              style={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b",
              }}
            />
            <input
              value={shapeSearch}
              onChange={(e) => setShapeSearch(e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="Search shapes..."
              style={{
                width: "100%",
                padding: "6px 8px 6px 26px",
                borderRadius: 8,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
                background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
                color: isDark ? "#f1f5f9" : "#0f172a",
                fontSize: 11,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          {Object.entries(SHAPE_CATEGORIES).map(([cat, catShapes]) => (
            <div key={cat} style={{ marginBottom: 12 }}>
              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveShapeCat(activeShapeCat === cat ? "" : cat);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginBottom: 6,
                  padding: 0,
                }}
              >
                <ChevronRight
                  size={11}
                  style={{
                    transform:
                      activeShapeCat === cat ? "rotate(90deg)" : "none",
                    transition: "0.15s",
                    color: "#64748b",
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: isDark ? "#94a3b8" : "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {cat}
                </span>
              </button>
              {activeShapeCat === cat && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5,1fr)",
                    gap: 6,
                  }}
                >
                  {catShapes
                    .filter(
                      (s) =>
                        !shapeSearch ||
                        s.toLowerCase().includes(shapeSearch.toLowerCase()),
                    )
                    .map((shapeId) => {
                      const Icon = SHAPE_ICON_MAP[shapeId] || Square;
                      return (
                        <button
                          key={shapeId}
                          title={shapeId}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            addShape(shapeId);
                          }}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
                            background: isDark
                              ? "rgba(255,255,255,0.04)"
                              : "#f8fafc",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(59,130,246,0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isDark
                              ? "rgba(255,255,255,0.04)"
                              : "#f8fafc";
                          }}
                        >
                          <Icon
                            size={16}
                            color={isDark ? "#94a3b8" : "#475569"}
                          />
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── PAGES PANEL ── */}
      {showPages && (
        <div
          onMouseEnter={() => {
            uiRef.current = true;
          }}
          onMouseLeave={() => {
            uiRef.current = false;
          }}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            left: 58,
            bottom: 60,
            zIndex: 300,
            width: 200,
            background: isDark ? "#1e293b" : "#fff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
            borderRadius: 12,
            padding: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: isDark ? "#f1f5f9" : "#0f172a",
              marginBottom: 8,
            }}
          >
            Pages
          </div>
          {pages.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 8px",
                borderRadius: 8,
                background: p.active ? "rgba(59,130,246,0.1)" : "transparent",
                marginBottom: 2,
                cursor: "pointer",
              }}
              onClick={() =>
                setPages((prev) =>
                  prev.map((pg) => ({ ...pg, active: pg.id === p.id })),
                )
              }
            >
              <div
                style={{
                  width: 28,
                  height: 20,
                  background: isDark ? "#334155" : "#f1f5f9",
                  borderRadius: 4,
                  border: `1px solid ${p.active ? "#3b82f6" : isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 8, color: "#64748b" }}>{i + 1}</span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: p.active ? "#3b82f6" : isDark ? "#94a3b8" : "#475569",
                  flex: 1,
                }}
              >
                {p.name}
              </span>
            </div>
          ))}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() =>
              setPages((p) => [
                ...p.map((pg) => ({ ...pg, active: false })),
                { id: Date.now(), name: `Page ${p.length + 1}`, active: true },
              ])
            }
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: 8,
              border: `1px dashed ${isDark ? "rgba(255,255,255,0.15)" : "#e2e8f0"}`,
              background: "none",
              cursor: "pointer",
              fontSize: 10,
              color: isDark ? "#64748b" : "#94a3b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              marginTop: 4,
            }}
          >
            <Plus size={12} /> Add Page
          </button>
        </div>
      )}

      {/* ── HISTORY PANEL ── */}
      {showHistory && (
        <div
          onMouseEnter={() => {
            uiRef.current = true;
          }}
          onMouseLeave={() => {
            uiRef.current = false;
          }}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 300,
            width: 220,
            maxHeight: 400,
            overflowY: "auto",
            background: isDark ? "#1e293b" : "#fff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
            borderRadius: 12,
            padding: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: isDark ? "#f1f5f9" : "#0f172a",
              }}
            >
              History
            </span>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setShowHistory(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#64748b",
              }}
            >
              <X size={13} />
            </button>
          </div>
          {history.length === 0 ? (
            <div
              style={{
                fontSize: 11,
                color: isDark ? "#475569" : "#94a3b8",
                textAlign: "center",
                padding: 16,
              }}
            >
              No history yet
            </div>
          ) : (
            history.map((snap, i) => (
              <div
                key={i}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => {
                  setRedoStack((r) => [
                    ...r,
                    {
                      paths: [...pathsRef.current],
                      shapes: [...shapesRef.current],
                    },
                  ]);
                  setPaths(snap.paths || []);
                  setShapesSafe(snap.shapes || []);
                  setHistory((h) => h.slice(0, i));
                }}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  marginBottom: 3,
                  cursor: "pointer",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(59,130,246,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <History size={11} color="#64748b" />
                <span
                  style={{
                    fontSize: 10,
                    color: isDark ? "#94a3b8" : "#475569",
                  }}
                >
                  Snapshot {i + 1}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── TOP TOOLBAR ── */}
      <div
        onMouseEnter={() => {
          uiRef.current = true;
        }}
        onMouseLeave={() => {
          uiRef.current = false;
        }}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 52,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 16px",
          background: isDark ? "rgba(15,23,42,0.97)" : "rgba(255,255,255,0.98)",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
          backdropFilter: "blur(12px)",
          flexWrap: "nowrap",
          overflowX: "auto",
        }}
      >
        {/* FIX 3: Colors — now calls handleColorChange to also update selected element */}
        <div
          style={{
            display: "flex",
            gap: 3,
            background: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
            borderRadius: 10,
            padding: 4,
            flexShrink: 0,
          }}
        >
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => handleColorChange(c)}
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                background: c,
                border:
                  color === c
                    ? "2px solid #3b82f6"
                    : `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
                cursor: "pointer",
                transform: color === c ? "scale(1.3)" : "scale(1)",
                transition: "0.1s",
                flexShrink: 0,
              }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              padding: 0,
              background: "transparent",
            }}
          />
        </div>

        <div
          style={{
            width: 1,
            height: 24,
            background: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
            flexShrink: 0,
          }}
        />

        {/* FIX 3: Stroke sizes */}
        <div
          style={{
            display: "flex",
            gap: 4,
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {STROKE_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => handleStrokeChange(s)}
              style={{
                width: Math.max(12, s + 8),
                height: Math.max(12, s + 8),
                borderRadius: "50%",
                border:
                  strokeWidth === s
                    ? "2px solid #3b82f6"
                    : "2px solid transparent",
                background: isDark ? "#e2e8f0" : "#1e293b",
                cursor: "pointer",
                flexShrink: 0,
                opacity: strokeWidth === s ? 1 : 0.35,
                transition: "0.15s",
              }}
            />
          ))}
        </div>

        {/* FIX 3: Text formatting — shown when text tool active OR text element selected */}
        {showTextFormatting && (
          <>
            <div
              style={{
                width: 1,
                height: 24,
                background: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                flexShrink: 0,
              }}
            />
            <select
              value={fontSize}
              onChange={(e) => handleFontSizeChange(+e.target.value)}
              style={{
                padding: "3px 6px",
                borderRadius: 6,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#e2e8f0"}`,
                background: isDark ? "#1e293b" : "#f8fafc",
                color: isDark ? "#f1f5f9" : "#0f172a",
                fontSize: 11,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {[10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 60].map((v) => (
                <option key={v} value={v}>
                  {v}px
                </option>
              ))}
            </select>
            <button
              onClick={handleFontBoldToggle}
              title="Bold"
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                background: fontBold ? "rgba(59,130,246,0.15)" : "transparent",
                color: fontBold
                  ? "#3b82f6"
                  : isDark
                    ? "rgba(255,255,255,0.6)"
                    : "#475569",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Bold size={13} />
            </button>
            <button
              onClick={handleFontItalicToggle}
              title="Italic"
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                background: fontItalic
                  ? "rgba(59,130,246,0.15)"
                  : "transparent",
                color: fontItalic
                  ? "#3b82f6"
                  : isDark
                    ? "rgba(255,255,255,0.6)"
                    : "#475569",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Italic size={13} />
            </button>
          </>
        )}

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 4,
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {[
            {
              icon: RotateCcw,
              action: undo,
              disabled: !history.length,
              title: "Undo (Ctrl+Z)",
            },
            {
              icon: RotateCw,
              action: redo,
              disabled: !redoStack.length,
              title: "Redo (Ctrl+Y)",
            },
          ].map(({ icon: Icon, action, disabled, title }) => (
            <button
              key={title}
              onClick={action}
              disabled={disabled}
              title={title}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                border: "none",
                cursor: disabled ? "not-allowed" : "pointer",
                background: "transparent",
                color: disabled
                  ? isDark
                    ? "rgba(255,255,255,0.15)"
                    : "#cbd5e1"
                  : isDark
                    ? "rgba(255,255,255,0.6)"
                    : "#475569",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={14} />
            </button>
          ))}
          <button
            onClick={clearCanvas}
            title="Clear canvas"
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "transparent",
              color: "#f87171",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={handleSave}
            title="Save (Ctrl+S)"
            disabled={saveStatus === "saving"}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: "none",
              cursor: saveStatus === "saving" ? "not-allowed" : "pointer",
              background:
                saveStatus === "dirty"
                  ? "rgba(251,191,36,0.12)"
                  : "transparent",
              color:
                saveStatus === "saving"
                  ? "#60a5fa"
                  : saveStatus === "error"
                    ? "#f87171"
                    : saveStatus === "dirty"
                      ? "#fbbf24"
                      : "#a78bfa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Save size={14} />
          </button>
          <button
            onClick={exportPNG}
            title="Export PNG"
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "transparent",
              color: "#22c55e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Download size={14} />
          </button>
          <div
            style={{
              width: 1,
              height: 20,
              background: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 8px",
              borderRadius: 8,
              background: connected
                ? "rgba(34,197,94,0.1)"
                : "rgba(248,113,113,0.1)",
              border: `1px solid ${connected ? "rgba(34,197,94,0.3)" : "rgba(248,113,113,0.3)"}`,
            }}
          >
            {connected ? (
              <Wifi size={11} color="#22c55e" />
            ) : (
              <WifiOff size={11} color="#f87171" />
            )}
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: connected ? "#22c55e" : "#f87171",
                fontFamily: "monospace",
              }}
            >
              {connected ? "LIVE" : "OFF"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 8px",
              borderRadius: 8,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: saveColor,
              }}
            />
            <span style={{ fontSize: 9, color: saveColor, fontWeight: 600 }}>
              {saveLabel}
            </span>
          </div>
        </div>
      </div>

      {/* ── CANVAS ── */}
      <div
        ref={containerRef}
        style={{ position: "absolute", inset: 0, paddingTop: 52 }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            touchAction: "none",
            userSelect: "none",
            cursor: getCanvasCursor(activeTool, isPanningRef.current),
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onDoubleClick={onDblClick}
        />

        {isEmpty && !textOverlay && !commentPopup && !equationPopup && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              top: 52,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              gap: 10,
            }}
          >
            <Pencil
              size={36}
              color={isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}
            />
            <p
              style={{
                fontSize: 13,
                color: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)",
                margin: 0,
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              Select a tool and start drawing · Click Shapes to insert ·
              Double-click elements to edit
            </p>
          </div>
        )}

        {/* ── FIX 1: TEXT OVERLAY ── */}
        {textOverlay && !textOverlay.isLabel && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              top: 52,
              pointerEvents: "none",
            }}
          >
            <div
              style={{ position: "absolute", inset: 0, pointerEvents: "auto" }}
            >
              <TextOverlay
                element={textOverlay.element}
                zoom={zoom}
                pan={panOffset}
                onCommit={commitText}
                onCancel={() => setTextOverlay(null)}
                isDark={isDark}
              />
            </div>
          </div>
        )}

        {/* ── FIX 1: LABEL OVERLAY (for shape labels) ── */}
        {textOverlay && textOverlay.isLabel && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              top: 52,
              pointerEvents: "none",
            }}
          >
            <div
              style={{ position: "absolute", inset: 0, pointerEvents: "auto" }}
            >
              <LabelOverlay
                shape={textOverlay.element}
                zoom={zoom}
                pan={panOffset}
                onCommit={(val) => commitText(val)}
                onCancel={() => setTextOverlay(null)}
                isDark={isDark}
              />
            </div>
          </div>
        )}

        {/* ── FIX 2: COMMENT POPUP ── */}
        {commentPopup && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              top: 52,
              pointerEvents: "none",
            }}
          >
            <div
              style={{ position: "absolute", inset: 0, pointerEvents: "auto" }}
            >
              <CommentPopup
                position={commentPopup.screenPos}
                element={commentPopup.element}
                onSave={saveComment}
                onCancel={() => setCommentPopup(null)}
                onDelete={deleteComment}
                onResolve={resolveComment}
                isDark={isDark}
              />
            </div>
          </div>
        )}

        {/* ── FIX 2: EQUATION POPUP ── */}
        {equationPopup && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              top: 52,
              pointerEvents: "none",
            }}
          >
            <div
              style={{ position: "absolute", inset: 0, pointerEvents: "auto" }}
            >
              <EquationPopup
                position={equationPopup.screenPos}
                element={equationPopup.element}
                onSave={saveEquation}
                onCancel={() => setEquationPopup(null)}
                isDark={isDark}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── ZOOM CONTROLS ── */}
      <div
        onMouseEnter={() => {
          uiRef.current = true;
        }}
        onMouseLeave={() => {
          uiRef.current = false;
        }}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "6px 10px",
          background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.97)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          onClick={() => setZoom((z) => Math.max(0.05, +(z - 0.25).toFixed(2)))}
          style={{
            width: 26,
            height: 26,
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            background: "transparent",
            color: isDark ? "rgba(255,255,255,0.6)" : "#475569",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ZoomOut size={13} />
        </button>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: isDark ? "rgba(255,255,255,0.7)" : "#334155",
            minWidth: 40,
            textAlign: "center",
            fontFamily: "monospace",
          }}
        >
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(8, +(z + 0.25).toFixed(2)))}
          style={{
            width: 26,
            height: 26,
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            background: "transparent",
            color: isDark ? "rgba(255,255,255,0.6)" : "#475569",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ZoomIn size={13} />
        </button>
        <div
          style={{
            width: 1,
            height: 16,
            background: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
            margin: "0 2px",
          }}
        />
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          title="Reset view (0)"
          style={{
            width: 26,
            height: 26,
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            background: "transparent",
            color: isDark ? "rgba(255,255,255,0.6)" : "#475569",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Maximize2 size={13} />
        </button>
      </div>

      {/* ── BOTTOM LEFT ACTIONS ── */}
      <div
        onMouseEnter={() => {
          uiRef.current = true;
        }}
        onMouseLeave={() => {
          uiRef.current = false;
        }}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          bottom: 20,
          left: 60,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "6px 10px",
          background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.97)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          onClick={undo}
          disabled={!history.length}
          title="Undo"
          style={{
            width: 26,
            height: 26,
            border: "none",
            borderRadius: 6,
            cursor: history.length ? "pointer" : "not-allowed",
            background: "transparent",
            color: history.length
              ? "#3b82f6"
              : isDark
                ? "rgba(255,255,255,0.2)"
                : "#cbd5e1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RotateCcw size={13} />
        </button>
        <button
          onClick={redo}
          disabled={!redoStack.length}
          title="Redo"
          style={{
            width: 26,
            height: 26,
            border: "none",
            borderRadius: 6,
            cursor: redoStack.length ? "pointer" : "not-allowed",
            background: "transparent",
            color: redoStack.length
              ? "#3b82f6"
              : isDark
                ? "rgba(255,255,255,0.2)"
                : "#cbd5e1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RotateCw size={13} />
        </button>
        <div
          style={{
            width: 1,
            height: 16,
            background: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
          }}
        />
        <button
          onClick={() => {
            if (selectedIdRef.current) {
              snapshotHistory();
              setShapesSafe((p) =>
                p.filter((s) => s.id !== selectedIdRef.current),
              );
              setSelectedId(null);
              setSaveStatus("dirty");
            }
          }}
          title="Delete selected (Del)"
          style={{
            width: 26,
            height: 26,
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            background: "transparent",
            color: "#f87171",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Trash size={13} />
        </button>
      </div>

      {/* ── HIDDEN IMAGE INPUT ── */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleImageFile(e.target.files[0])}
      />

      {/* ── TOAST ── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            borderRadius: 12,
            padding: "10px 18px",
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            background: toast.type === "error" ? "#dc2626" : "#1e293b",
            color: "#fff",
            pointerEvents: "none",
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

// ── WHITEBOARD CARD ────────────────────────────────────────────────────────
function WhiteboardCard({
  board,
  isDark,
  onOpen,
  onStar,
  onDelete,
  onDuplicate,
  onRename,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [hovered, setHovered] = useState(false);
  const menuItems = [
    { label: "Rename", icon: Pencil, action: onRename },
    { label: "Duplicate", icon: Copy, action: onDuplicate },
    { label: "Export", icon: Download, action: () => {} },
    { label: board.starred ? "Unstar" : "Star", icon: Star, action: onStar },
    { label: "Move to Trash", icon: Trash, action: onDelete, danger: true },
  ];
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShowMenu(false);
      }}
      style={{
        borderRadius: 14,
        border: `1px solid ${isDark ? (hovered ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.08)") : hovered ? "rgba(59,130,246,0.3)" : "#e2e8f0"}`,
        overflow: "hidden",
        background: isDark ? "#1e293b" : "#ffffff",
        transition: "all 0.2s",
        boxShadow: hovered
          ? "0 8px 32px rgba(0,0,0,0.2)"
          : "0 2px 8px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-2px)" : "none",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <div
        onClick={onOpen}
        style={{
          height: 130,
          overflow: "hidden",
          background: isDark ? "#0f172a" : "#f8fafc",
        }}
      >
        <BoardThumbnail type={board.thumbnail} isDark={isDark} />
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 6,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              onClick={onOpen}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: isDark ? "#f1f5f9" : "#0f172a",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginBottom: 3,
              }}
            >
              {board.title}
            </div>
            <div
              style={{ fontSize: 10, color: isDark ? "#475569" : "#94a3b8" }}
            >
              {board.owner}
            </div>
            <div
              style={{
                fontSize: 10,
                color: isDark ? "#334155" : "#cbd5e1",
                marginTop: 2,
              }}
            >
              {board.modified}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexShrink: 0,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStar();
              }}
              style={{
                width: 26,
                height: 26,
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                background: "transparent",
                color: board.starred
                  ? "#fbbf24"
                  : isDark
                    ? "#334155"
                    : "#cbd5e1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Star size={13} fill={board.starred ? "#fbbf24" : "none"} />
            </button>
            <div style={{ position: "relative" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu((s) => !s);
                }}
                style={{
                  width: 26,
                  height: 26,
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  background: showMenu
                    ? isDark
                      ? "rgba(255,255,255,0.1)"
                      : "#f1f5f9"
                    : "transparent",
                  color: isDark ? "rgba(255,255,255,0.5)" : "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MoreHorizontal size={13} />
              </button>
              {showMenu && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 32,
                    zIndex: 200,
                    background: isDark ? "#1e293b" : "#fff",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
                    borderRadius: 10,
                    padding: "6px",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
                    minWidth: 160,
                  }}
                >
                  {menuItems.map(({ label, icon: Icon, action, danger }) => (
                    <button
                      key={label}
                      onClick={(e) => {
                        e.stopPropagation();
                        action();
                        setShowMenu(false);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "7px 10px",
                        borderRadius: 7,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        color: danger
                          ? "#f87171"
                          : isDark
                            ? "#e2e8f0"
                            : "#334155",
                        fontSize: 11,
                        fontWeight: 500,
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = danger
                          ? "rgba(248,113,113,0.1)"
                          : isDark
                            ? "rgba(255,255,255,0.06)"
                            : "#f8fafc";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <Icon size={12} />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {board.project && (
          <div
            style={{
              marginTop: 6,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "2px 8px",
              borderRadius: 20,
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            <FolderOpen size={9} color="#3b82f6" />
            <span style={{ fontSize: 9, color: "#3b82f6", fontWeight: 600 }}>
              {board.project}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── TEMPLATES MODAL ────────────────────────────────────────────────────────
function TemplatesModal({ isDark, onClose, onSelect }) {
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [starred, setStarred] = useState([]);
  const filtered = TEMPLATES.filter(
    (t) =>
      (activeCat === "All" || t.category === activeCat) &&
      (!search || t.title.toLowerCase().includes(search.toLowerCase())),
  );
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          width: "min(900px,96vw)",
          height: "min(620px,94vh)",
          background: isDark ? "#0f172a" : "#fff",
          borderRadius: 20,
          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: isDark ? "#f1f5f9" : "#0f172a",
            }}
          >
            Templates
          </span>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9",
              color: isDark ? "#94a3b8" : "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div
            style={{
              width: 190,
              borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
              overflowY: "auto",
              padding: "12px 8px",
            }}
          >
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  background: activeCat === cat ? "#3b82f6" : "transparent",
                  color:
                    activeCat === cat ? "#fff" : isDark ? "#94a3b8" : "#475569",
                  fontSize: 12,
                  fontWeight: activeCat === cat ? 600 : 500,
                  textAlign: "left",
                  marginBottom: 2,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "14px 16px 10px" }}>
              <div style={{ position: "relative" }}>
                <Search
                  size={13}
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                  }}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search templates..."
                  style={{
                    width: "100%",
                    padding: "8px 10px 8px 30px",
                    borderRadius: 10,
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
                    background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
                    color: isDark ? "#f1f5f9" : "#0f172a",
                    fontSize: 12,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "0 16px 16px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
                gap: 12,
                alignContent: "start",
              }}
            >
              {filtered.map((t) => {
                const Icon = t.icon;
                const isStarred = starred.includes(t.id);
                return (
                  <div
                    key={t.id}
                    onClick={() => onSelect(t.id)}
                    style={{
                      borderRadius: 12,
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
                      background: isDark ? "#1e293b" : "#f8fafc",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "0.2s",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.border = `1px solid ${t.color}60`;
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.border = `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`;
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    <div
                      style={{
                        height: 90,
                        background: `linear-gradient(135deg,${t.color}18,${t.color}08)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 14,
                          background: `${t.color}20`,
                          border: `1.5px solid ${t.color}40`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon size={22} color={t.color} />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStarred((s) =>
                            isStarred
                              ? s.filter((x) => x !== t.id)
                              : [...s, t.id],
                          );
                        }}
                        style={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          width: 24,
                          height: 24,
                          border: "none",
                          borderRadius: 6,
                          background: "transparent",
                          cursor: "pointer",
                          color: isStarred
                            ? "#fbbf24"
                            : isDark
                              ? "rgba(255,255,255,0.3)"
                              : "#cbd5e1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Star size={12} fill={isStarred ? "#fbbf24" : "none"} />
                      </button>
                    </div>
                    <div style={{ padding: "8px 10px" }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: isDark ? "#e2e8f0" : "#1e293b",
                          marginBottom: 3,
                        }}
                      >
                        {t.title}
                      </div>
                      <div
                        style={{
                          fontSize: 9,
                          color: isDark ? "#475569" : "#94a3b8",
                          padding: "2px 6px",
                          background: `${t.color}15`,
                          borderRadius: 10,
                          display: "inline-block",
                        }}
                      >
                        {t.category}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DIAGRAM MODAL ──────────────────────────────────────────────────────────
function DiagramModal({ isDark, onClose, onSelect }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          width: "min(640px,96vw)",
          background: isDark ? "#0f172a" : "#fff",
          borderRadius: 20,
          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: isDark ? "#f1f5f9" : "#0f172a",
              }}
            >
              Diagrams
            </div>
            <div
              style={{
                fontSize: 12,
                color: isDark ? "#475569" : "#94a3b8",
                marginTop: 2,
              }}
            >
              Choose a diagram type to start with a structured template
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9",
              color: isDark ? "#94a3b8" : "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={16} />
          </button>
        </div>
        <div
          style={{
            padding: 20,
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 12,
          }}
        >
          {DIAGRAM_TYPES.map((d) => {
            const Icon = d.icon;
            return (
              <button
                key={d.id}
                onClick={() => onSelect(d.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  padding: "18px 12px",
                  borderRadius: 14,
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
                  background: isDark ? "#1e293b" : "#f8fafc",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${d.color}12`;
                  e.currentTarget.style.border = `1px solid ${d.color}50`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDark
                    ? "#1e293b"
                    : "#f8fafc";
                  e.currentTarget.style.border = `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`;
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${d.color}20`,
                    border: `1.5px solid ${d.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={20} color={d.color} />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: isDark ? "#e2e8f0" : "#1e293b",
                    textAlign: "center",
                  }}
                >
                  {d.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── MAIN EXPORT ────────────────────────────────────────────────────────────
export default function WhiteboardPanel({ t, isDark, sessionId }) {
  const [view, setView] = useState("dashboard");
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [connected, setConnected] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState("Recent");
  const [boards, setBoards] = useState(() => {
    try {
      const s = localStorage.getItem("whiteboards");
      if (s) {
        const p = JSON.parse(s);
        if (Array.isArray(p) && p.length) return p;
      }
    } catch {}
    return MOCK_BOARDS;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [showDiagrams, setShowDiagrams] = useState(false);
  const [editorTitle, setEditorTitle] = useState("Untitled Whiteboard");
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal] = useState("");
  const [presentMode, setPresentMode] = useState(false);
  const [currentTemplateShapes, setCurrentTemplateShapes] = useState([]);
  const [editorKey, setEditorKey] = useState(0);
  const [editorSaveStatus, setEditorSaveStatus] = useState("saved");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState(() => {
    try {
      const s = localStorage.getItem("wbProjects");
      if (s)
        return Array.from(new Set([...DEFAULT_PROJECTS, ...JSON.parse(s)]));
    } catch {}
    return [...DEFAULT_PROJECTS];
  });
  const [dashToast, setDashToast] = useState(null);
  const fileInputRef = useRef(null);

  function showDashToast(msg, type = "success") {
    setDashToast({ message: msg, type });
    clearTimeout(showDashToast._t);
    showDashToast._t = setTimeout(() => setDashToast(null), 2500);
  }

  const userName = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem("lms_user") || "{}").email || "trainer"
      );
    } catch {
      return "trainer";
    }
  })();

  useEffect(() => {
    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
    });
    client.activate();
    setStompClient(client);
    return () => client.deactivate();
  }, [sessionId]);

  useEffect(() => {
    try {
      localStorage.setItem("whiteboards", JSON.stringify(boards));
    } catch {}
  }, [boards]);

  const filteredBoards = boards.filter((b) => {
    if (
      searchQuery &&
      !b.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (activeSidebarItem === "Starred") return b.starred;
    if (activeSidebarItem === "Trash") return false;
    if (activeSidebarItem === "My Whiteboards") return true;
    if (activeSidebarItem === "Shared With Me") return false;
    if (projects.includes(activeSidebarItem))
      return b.project === activeSidebarItem;
    return true;
  });

  const openBoard = (board) => {
    const shapes = board.templateId ? getTemplateShapes(board.templateId) : [];
    setActiveBoardId(board.id);
    setEditorTitle(board.title);
    setCurrentTemplateShapes(shapes);
    setSelectedProject(board.project || null);
    setEditorKey((k) => k + 1);
    setEditorSaveStatus("saved");
    setView("editor");
  };

  const createNew = (
    title = "Untitled Whiteboard",
    templateId = null,
    project = null,
  ) => {
    const shapes = templateId ? getTemplateShapes(templateId) : [];
    const nid = makeId();
    const nb = {
      id: nid,
      title,
      owner: "Trainer",
      modified: "Just now",
      starred: false,
      project: project || selectedProject || null,
      thumbnail: "flow",
      templateId: templateId || null,
    };
    setBoards((b) => [nb, ...b]);
    setActiveBoardId(nid);
    setEditorTitle(title);
    setCurrentTemplateShapes(shapes);
    setSelectedProject(nb.project);
    setEditorKey((k) => k + 1);
    setEditorSaveStatus("saved");
    setView("editor");
  };

  function handleCreateProject() {
    const name = window.prompt("Enter project name:");
    if (!name?.trim()) return;
    const cleanName = name.trim();
    if (projects.some((p) => p.toLowerCase() === cleanName.toLowerCase())) {
      showDashToast("Project already exists", "error");
      setActiveSidebarItem(cleanName);
      setSelectedProject(cleanName);
      return;
    }
    const updated = [...projects, cleanName];
    setProjects(updated);
    try {
      localStorage.setItem("wbProjects", JSON.stringify(updated));
    } catch {}
    setActiveSidebarItem(cleanName);
    setSelectedProject(cleanName);
    showDashToast(`Project "${cleanName}" created`);
  }

  const toggleStar = (id) =>
    setBoards((b) =>
      b.map((x) => (x.id === id ? { ...x, starred: !x.starred } : x)),
    );
  const deleteBoard = (id) => setBoards((b) => b.filter((x) => x.id !== id));
  const duplicateBoard = (id) => {
    const o = boards.find((x) => x.id === id);
    if (o)
      setBoards((b) => [
        { ...o, id: makeId(), title: o.title + " (copy)" },
        ...b,
      ]);
  };
  const startRename = (board) => {
    setRenamingId(board.id);
    setRenameVal(board.title);
  };
  const confirmRename = () => {
    if (!renamingId) return;
    setBoards((b) =>
      b.map((x) => (x.id === renamingId ? { ...x, title: renameVal } : x)),
    );
    if (renamingId === activeBoardId) setEditorTitle(renameVal);
    setRenamingId(null);
  };

  const sidebarItems = [
    { label: "All Whiteboards", icon: Grid },
    { label: "Recent", icon: Clock },
    { label: "My Whiteboards", icon: Home },
    { label: "Shared With Me", icon: Users },
    { label: "Starred", icon: Star },
    { label: "Trash", icon: Trash2 },
  ];

  const editorSaveLabel =
    editorSaveStatus === "saving"
      ? "Saving..."
      : editorSaveStatus === "error"
        ? "Save failed"
        : editorSaveStatus === "dirty"
          ? "Unsaved changes"
          : "Auto-saved";
  const editorSaveColor =
    editorSaveStatus === "error"
      ? "#f87171"
      : editorSaveStatus === "dirty"
        ? "#fbbf24"
        : editorSaveStatus === "saving"
          ? "#60a5fa"
          : "#22c55e";

  // Present mode
  if (presentMode && view === "editor") {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: isDark ? "#0f172a" : "#fff",
        }}
      >
        <div style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
          <button
            onClick={() => setPresentMode(false)}
            style={{
              padding: "8px 18px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: "rgba(248,113,113,0.15)",
              color: "#f87171",
              fontWeight: 600,
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <X size={14} /> Exit Present
          </button>
        </div>
        <CanvasWhiteboard
          key={`present-${editorKey}`}
          sessionId={sessionId}
          stompClient={stompClient}
          connected={connected}
          isDark={isDark}
          userName={userName}
          userRole="TRAINER"
          initialShapes={currentTemplateShapes}
          whiteboardId={activeBoardId}
          whiteboardTitle={editorTitle}
          selectedProject={selectedProject}
        />
      </div>
    );
  }

  // Editor view
  if (view === "editor") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 120px)",
          minHeight: 560,
          position: "relative",
          background: isDark ? "#0f172a" : "#f8fafc",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 16px",
            height: 52,
            flexShrink: 0,
            background: isDark ? "#0f172a" : "#fff",
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
          }}
        >
          <button
            onClick={() => setView("dashboard")}
            style={{
              width: 32,
              height: 32,
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
              color: isDark ? "#94a3b8" : "#475569",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <div style={{ position: "relative" }}>
            {renamingId === activeBoardId ? (
              <input
                value={renameVal}
                onChange={(e) => setRenameVal(e.target.value)}
                onBlur={confirmRename}
                onKeyDown={(e) => e.key === "Enter" && confirmRename()}
                autoFocus
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: isDark ? "#f1f5f9" : "#0f172a",
                  background: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9",
                  border: "1px solid #3b82f6",
                  borderRadius: 6,
                  padding: "3px 8px",
                  outline: "none",
                  minWidth: 200,
                }}
              />
            ) : (
              <button
                onClick={() =>
                  startRename({ id: activeBoardId, title: editorTitle })
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  color: isDark ? "#f1f5f9" : "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {editorTitle}
                <Pencil size={11} color="#64748b" />
              </button>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginLeft: 4,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: editorSaveColor,
              }}
            />
            <span
              style={{ fontSize: 10, color: editorSaveColor, fontWeight: 600 }}
            >
              {editorSaveLabel}
            </span>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 10px",
                borderRadius: 8,
                background: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
              }}
            >
              <Users size={12} color="#3b82f6" />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#3b82f6" }}>
                1 online
              </span>
            </div>
            <button
              onClick={() => setPresentMode(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
                color: isDark ? "#e2e8f0" : "#334155",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <Play size={12} /> Present
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 10px",
                borderRadius: 8,
                background: connected
                  ? "rgba(34,197,94,0.1)"
                  : "rgba(248,113,113,0.1)",
                border: `1px solid ${connected ? "rgba(34,197,94,0.3)" : "rgba(248,113,113,0.3)"}`,
              }}
            >
              {connected ? (
                <Wifi size={11} color="#22c55e" />
              ) : (
                <WifiOff size={11} color="#f87171" />
              )}
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: connected ? "#22c55e" : "#f87171",
                  fontFamily: "monospace",
                }}
              >
                {connected ? "LIVE" : "OFF"}
              </span>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <CanvasWhiteboard
            key={editorKey}
            sessionId={sessionId}
            stompClient={stompClient}
            connected={connected}
            isDark={isDark}
            userName={userName}
            userRole="TRAINER"
            initialShapes={currentTemplateShapes}
            whiteboardId={activeBoardId}
            whiteboardTitle={editorTitle}
            selectedProject={selectedProject}
            onSaveStatusChange={setEditorSaveStatus}
          />
        </div>
      </div>
    );
  }

  // Dashboard view
  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 120px)",
        minHeight: 560,
        background: isDark ? "#0a0f1e" : "#f8fafc",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: sidebarCollapsed ? 52 : 230,
          flexShrink: 0,
          transition: "width 0.25s",
          background: isDark ? "#0f172a" : "#fff",
          borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "#e2e8f0"}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: sidebarCollapsed ? "center" : "space-between",
            padding: sidebarCollapsed ? "16px 8px" : "16px 14px 12px",
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
          }}
        >
          {!sidebarCollapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Grid size={14} color="#fff" />
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: isDark ? "#f1f5f9" : "#0f172a",
                }}
              >
                Whiteboards
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed((s) => !s)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              border: "none",
              cursor: "pointer",
              background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
              color: isDark ? "#64748b" : "#94a3b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {sidebarCollapsed ? (
              <ChevronRight size={13} />
            ) : (
              <ChevronLeft size={13} />
            )}
          </button>
        </div>
        {!sidebarCollapsed && (
          <div style={{ padding: "10px 12px 6px" }}>
            <button
              onClick={() => createNew()}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "8px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: "#3b82f6",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#3b82f6";
              }}
            >
              <Plus size={14} /> New Whiteboard
            </button>
          </div>
        )}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: sidebarCollapsed ? "8px 6px" : "6px 8px",
          }}
        >
          {sidebarItems.map(({ label, icon: Icon }) => {
            const active = activeSidebarItem === label;
            return (
              <button
                key={label}
                onClick={() => setActiveSidebarItem(label)}
                title={sidebarCollapsed ? label : undefined}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: sidebarCollapsed ? 0 : 9,
                  padding: sidebarCollapsed ? "8px 0" : "8px 10px",
                  borderRadius: 9,
                  border: "none",
                  cursor: "pointer",
                  justifyContent: sidebarCollapsed ? "center" : "flex-start",
                  marginBottom: 2,
                  background: active
                    ? isDark
                      ? "rgba(59,130,246,0.15)"
                      : "rgba(59,130,246,0.08)"
                    : "transparent",
                  color: active ? "#3b82f6" : isDark ? "#64748b" : "#64748b",
                  fontSize: 12,
                  fontWeight: active ? 600 : 500,
                }}
              >
                <Icon size={15} color={active ? "#3b82f6" : undefined} />
                {!sidebarCollapsed && <span>{label}</span>}
                {!sidebarCollapsed && active && (
                  <span
                    style={{
                      marginLeft: "auto",
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: "#3b82f6",
                    }}
                  />
                )}
              </button>
            );
          })}
          {!sidebarCollapsed && (
            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "4px 10px",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: isDark ? "#334155" : "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Projects
                </span>
                <button
                  onClick={handleCreateProject}
                  title="New Project"
                  style={{
                    width: 18,
                    height: 18,
                    border: "none",
                    borderRadius: 5,
                    cursor: "pointer",
                    background: "transparent",
                    color: isDark ? "#334155" : "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Plus size={11} />
                </button>
              </div>
              {projects.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setActiveSidebarItem(p);
                    setSelectedProject(p);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    background:
                      activeSidebarItem === p
                        ? isDark
                          ? "rgba(59,130,246,0.12)"
                          : "rgba(59,130,246,0.06)"
                        : "transparent",
                    color:
                      activeSidebarItem === p
                        ? "#3b82f6"
                        : isDark
                          ? "#475569"
                          : "#64748b",
                    fontSize: 11,
                    marginBottom: 1,
                    textAlign: "left",
                  }}
                >
                  <FolderOpen
                    size={13}
                    color={activeSidebarItem === p ? "#3b82f6" : "#64748b"}
                  />
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 20px 10px",
            background: isDark ? "#0f172a" : "#fff",
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "#e2e8f0"}`,
            flexShrink: 0,
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: isDark ? "#f1f5f9" : "#0f172a",
              margin: 0,
              minWidth: 80,
            }}
          >
            {activeSidebarItem}
          </h2>
          <div style={{ flex: 1 }} />
          {[
            {
              label: "New Whiteboard",
              icon: Plus,
              color: "#3b82f6",
              action: () => createNew(),
            },
            {
              label: "Templates",
              icon: FileText,
              color: "#8b5cf6",
              action: () => setShowTemplates(true),
            },
            {
              label: "Diagram",
              icon: GitBranch,
              color: "#10b981",
              action: () => setShowDiagrams(true),
            },
            {
              label: "New Project",
              icon: FolderOpen,
              color: "#f59e0b",
              action: handleCreateProject,
            },
            {
              label: "Import",
              icon: Upload,
              color: "#ec4899",
              action: () => fileInputRef.current?.click(),
            },
          ].map(({ label, icon: Icon, color, action }) => (
            <button
              key={label}
              onClick={action}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 10,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
                background: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
                color: isDark ? "#e2e8f0" : "#334155",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${color}12`;
                e.currentTarget.style.border = `1px solid ${color}50`;
                e.currentTarget.style.color = color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDark
                  ? "rgba(255,255,255,0.03)"
                  : "#f8fafc";
                e.currentTarget.style.border = `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`;
                e.currentTarget.style.color = isDark ? "#e2e8f0" : "#334155";
              }}
            >
              <Icon size={13} color={color} />
              {label}
            </button>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 10,
              background: connected
                ? "rgba(34,197,94,0.08)"
                : "rgba(248,113,113,0.08)",
              border: `1px solid ${connected ? "rgba(34,197,94,0.2)" : "rgba(248,113,113,0.2)"}`,
            }}
          >
            {connected ? (
              <Wifi size={11} color="#22c55e" />
            ) : (
              <WifiOff size={11} color="#f87171" />
            )}
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: connected ? "#22c55e" : "#f87171",
              }}
            >
              {connected ? "LIVE SYNC" : "OFFLINE"}
            </span>
          </div>
        </div>
        <div
          style={{
            padding: "12px 20px 8px",
            background: isDark ? "#0f172a" : "#fff",
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"}`,
            flexShrink: 0,
          }}
        >
          <div style={{ position: "relative", maxWidth: 360 }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b",
              }}
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search whiteboards..."
              style={{
                width: "100%",
                padding: "9px 12px 9px 36px",
                borderRadius: 12,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
                background: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc",
                color: isDark ? "#f1f5f9" : "#0f172a",
                fontSize: 12,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {filteredBoards.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 300,
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 16,
                  background: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Grid size={24} color={isDark ? "#334155" : "#cbd5e1"} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: isDark ? "#475569" : "#94a3b8",
                    marginBottom: 6,
                  }}
                >
                  No whiteboards found
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: isDark ? "#334155" : "#cbd5e1",
                  }}
                >
                  Create a new whiteboard or choose a template
                </div>
              </div>
              <button
                onClick={() => createNew()}
                style={{
                  padding: "8px 20px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  background: "#3b82f6",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                + New Whiteboard
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: isDark ? "#334155" : "#94a3b8",
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                {projects.includes(activeSidebarItem)
                  ? activeSidebarItem
                  : "Today"}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
                  gap: 16,
                }}
              >
                {filteredBoards.map((board) =>
                  renamingId === board.id ? (
                    <div
                      key={board.id}
                      style={{
                        borderRadius: 14,
                        border: "1px solid #3b82f6",
                        padding: 16,
                        background: isDark ? "#1e293b" : "#fff",
                      }}
                    >
                      <input
                        value={renameVal}
                        onChange={(e) => setRenameVal(e.target.value)}
                        onBlur={confirmRename}
                        onKeyDown={(e) => e.key === "Enter" && confirmRename()}
                        autoFocus
                        style={{
                          width: "100%",
                          fontSize: 13,
                          fontWeight: 600,
                          padding: "6px 10px",
                          borderRadius: 8,
                          border: "1px solid #3b82f6",
                          background: isDark
                            ? "rgba(255,255,255,0.08)"
                            : "#f8fafc",
                          color: isDark ? "#f1f5f9" : "#0f172a",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  ) : (
                    <WhiteboardCard
                      key={board.id}
                      board={board}
                      isDark={isDark}
                      onOpen={() => openBoard(board)}
                      onStar={() => toggleStar(board.id)}
                      onDelete={() => deleteBoard(board.id)}
                      onDuplicate={() => duplicateBoard(board.id)}
                      onRename={() => startRename(board)}
                    />
                  ),
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {showTemplates && (
        <TemplatesModal
          isDark={isDark}
          onClose={() => setShowTemplates(false)}
          onSelect={(id) => {
            setShowTemplates(false);
            createNew(
              TEMPLATES.find((t) => t.id === id)?.title || "New Whiteboard",
              id,
            );
          }}
        />
      )}
      {showDiagrams && (
        <DiagramModal
          isDark={isDark}
          onClose={() => setShowDiagrams(false)}
          onSelect={(id) => {
            setShowDiagrams(false);
            createNew(
              DIAGRAM_TYPES.find((d) => d.id === id)?.label || "New Diagram",
              id,
            );
          }}
        />
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.png,.svg,.jpg"
        style={{ display: "none" }}
        onChange={() => createNew("Imported Board")}
      />

      {dashToast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            borderRadius: 12,
            padding: "10px 18px",
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            background: dashToast.type === "error" ? "#dc2626" : "#1e293b",
            color: "#fff",
            pointerEvents: "none",
          }}
        >
          {dashToast.message}
        </div>
      )}
    </div>
  );
}
