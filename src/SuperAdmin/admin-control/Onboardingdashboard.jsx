// import React, { useState, useEffect } from "react";
// import {
//   Eye, Pencil, Trash2, Crown, CheckCircle, XCircle, User, Building2,
//   ShieldCheck, CreditCard, Settings, BadgeCheck, ChevronRight, ChevronLeft,
//   X, Clock, BarChart3, Users, Briefcase, GraduationCap, Mic2, Shield,
//   FileText, Phone, Mail, MapPin, Calendar, Star, Award, TrendingUp,
//   AlertCircle, CheckSquare, Upload, Image, Layers, Bell, Lock, Globe,
//   Hash, Activity, PieChart, ArrowRight, MoreHorizontal
// } from "lucide-react";

// // ── Data ─────────────────────────────────────────────────────
// const generateStepData = (user, roleKey) => ({
//   step1: {
//     fullName: user.name,
//     email: user.email,
//     phone: "+91 98" + Math.floor(10000000 + Math.random() * 89999999),
//     role: roleKey === "student" ? "Student" : roleKey === "trainer" ? "Trainer" : roleKey === "admin" ? "Administrator" : "Business Owner",
//     profileImage: null,
//     registrationDate: "Jan 15, 2025",
//     location: "Mumbai, Maharashtra",
//     dob: "1998-06-12",
//   },
//   step2: {
//     orgName: roleKey === "student" ? "Mumbai University" : roleKey === "trainer" ? "Self-Employed" : user.org || "Innovate Labs",
//     department: roleKey === "student" ? "Computer Science" : roleKey === "trainer" ? "Training & Development" : "Operations",
//     industry: user.industry || "IT & Software",
//     experience: roleKey === "student" ? "Fresher" : "3-5 Years",
//     skills: ["JavaScript", "React", "Node.js", "Python"],
//     linkedIn: "linkedin.com/in/" + user.name?.toLowerCase().replace(" ", ""),
//   },
//   step3: {
//     aadhaarStatus: user.step >= 3 ? "Verified" : "Pending",
//     resumeStatus: user.step >= 3 ? "Uploaded" : "Missing",
//     certificateCount: user.step >= 3 ? 3 : 0,
//     verificationStatus: user.step >= 4 ? "Approved" : user.step >= 3 ? "Under Review" : "Pending",
//     uploadedDocs: user.step >= 3 ? ["Aadhaar.pdf", "Resume.pdf", "Cert_React.pdf"] : [],
//   },
//   step4: {
//     plan: user.subscription,
//     paymentStatus: user.subscription !== "Free" ? "Active" : "N/A",
//     billingDate: user.subscription !== "Free" ? "Feb 15, 2025" : "—",
//     planFeatures: user.subscription === "Enterprise"
//       ? ["Unlimited courses", "Priority support", "Analytics dashboard", "Custom branding", "API access"]
//       : user.subscription === "Pro"
//         ? ["50 courses/month", "Email support", "Basic analytics", "Certificates"]
//         : ["5 courses/month", "Community support", "Basic features"],
//     amount: user.subscription === "Enterprise" ? "₹4,999/mo" : user.subscription === "Pro" ? "₹999/mo" : "Free",
//   },
//   step5: {
//     profileCompletion: Math.round((user.step / 6) * 100),
//     dashboardAccess: user.step >= 5,
//     permissions: user.subscription === "Enterprise" ? ["Admin Panel", "Analytics", "Team Management", "API"] : user.subscription === "Pro" ? ["Dashboard", "Analytics", "Certificates"] : ["Dashboard"],
//     teamSize: roleKey === "admin" || roleKey === "business" ? user.size || "11-50" : "Individual",
//     theme: "Light",
//     language: "English",
//     notifications: true,
//   },
//   step6: {
//     approvalStatus: user.status === "Completed" ? "Approved" : user.status === "In Progress" ? "Under Review" : "Pending",
//     activeStatus: user.active,
//     adminNotes: user.status === "Completed" ? "All documents verified. Account activated successfully." : "Awaiting document verification.",
//     completionDate: user.status === "Completed" ? "Jan 20, 2025" : "—",
//     finalReview: user.status === "Completed" ? "Passed" : "Pending",
//     reviewer: "Suresh Kumar (Admin)",
//   },
// });

// const ONBOARDING_DATA = {
//   student: {
//     total: 1284, completed: 897, pending: 241, inProgress: 146,
//     recentUsers: [
//       { id: "STU001", name: "Arjun Mehta", email: "arjun@example.com", status: "Completed", step: 6, goal: "Get Internship / Job", learning: "Programming & Development", time: "2h ago", subscription: "Pro", active: true },
//       { id: "STU002", name: "Priya Sharma", email: "priya@example.com", status: "In Progress", step: 3, goal: "Build Skills", learning: "Data & AI", time: "4h ago", subscription: "Free", active: true },
//       { id: "STU003", name: "Sneha Patel", email: "sneha@example.com", status: "Pending", step: 1, goal: "—", learning: "—", time: "6h ago", subscription: "Free", active: false },
//       { id: "STU004", name: "Karan Singh", email: "karan@example.com", status: "Completed", step: 6, goal: "Get Certified", learning: "Design & Creativity", time: "1d ago", subscription: "Enterprise", active: true },
//       { id: "STU005", name: "Rahul Verma", email: "rahul@example.com", status: "In Progress", step: 4, goal: "Improve Academic", learning: "Business & Marketing", time: "1d ago", subscription: "Pro", active: true },
//     ],
//     topGoals: [
//       { label: "Get Internship / Job", count: 412, pct: 46 },
//       { label: "Build Skills", count: 310, pct: 35 },
//       { label: "Get Certified", count: 248, pct: 28 },
//       { label: "Improve Academic", count: 162, pct: 18 },
//     ],
//     learningAreas: [
//       { label: "Programming & Dev", count: 524 },
//       { label: "Data & AI", count: 387 },
//       { label: "Design", count: 218 },
//       { label: "Business", count: 155 },
//     ],
//     completionRate: 70,
//   },
//   trainer: {
//     total: 187, completed: 134, pending: 32, inProgress: 21,
//     recentUsers: [
//       { id: "TRN001", name: "Meera Joshi", email: "meera@example.com", status: "Completed", step: 6, expertise: "UI/UX Design", style: "Live Sessions", time: "3h ago", subscription: "Enterprise", active: true },
//       { id: "TRN002", name: "Vikram Nair", email: "vikram@example.com", status: "Completed", step: 6, expertise: "Data Science", style: "Recorded Lessons", time: "5h ago", subscription: "Pro", active: true },
//       { id: "TRN003", name: "Deepa Rao", email: "deepa@example.com", status: "In Progress", step: 4, expertise: "Digital Marketing", style: "Hybrid Teaching", time: "1d ago", subscription: "Pro", active: false },
//       { id: "TRN004", name: "Aarav Shah", email: "aarav@example.com", status: "Pending", step: 1, expertise: "—", style: "—", time: "2d ago", subscription: "Free", active: false },
//     ],
//     topFocus: [
//       { label: "Programming & Technology", count: 62, pct: 46 },
//       { label: "Data, AI & Analytics", count: 48, pct: 36 },
//       { label: "Design & Creative", count: 35, pct: 26 },
//       { label: "Business & Marketing", count: 28, pct: 21 },
//     ],
//     deliveryStyle: [
//       { label: "Live Sessions", count: 74 },
//       { label: "Hybrid Teaching", count: 58 },
//       { label: "Recorded Lessons", count: 38 },
//       { label: "Assignments", count: 17 },
//     ],
//     completionRate: 72,
//   },
//   admin: {
//     total: 48, completed: 38, pending: 6, inProgress: 4,
//     recentUsers: [
//       { id: "ADM001", name: "Suresh Kumar", email: "suresh@example.com", status: "Completed", step: 6, org: "Innovate Labs", size: "51-200", time: "1h ago", subscription: "Enterprise", active: true },
//       { id: "ADM002", name: "Anita Desai", email: "anita@example.com", status: "Completed", step: 6, org: "TechVenture Inc.", size: "201-500", time: "4h ago", subscription: "Pro", active: true },
//       { id: "ADM003", name: "Ravi Menon", email: "ravi@example.com", status: "In Progress", step: 3, org: "EduZone Academy", size: "11-50", time: "1d ago", subscription: "Pro", active: true },
//       { id: "ADM004", name: "Pooja Tiwari", email: "pooja@example.com", status: "Pending", step: 1, org: "—", size: "—", time: "2d ago", subscription: "Free", active: false },
//     ],
//     topGoals: [
//       { label: "Launch Learning Platform", count: 22, pct: 58 },
//       { label: "Manage Teams Efficiently", count: 16, pct: 42 },
//       { label: "Improve Training Quality", count: 12, pct: 32 },
//       { label: "Track Business Outcomes", count: 8, pct: 21 },
//     ],
//     orgTypes: [
//       { label: "Educational Institute", count: 21 },
//       { label: "Company / Business", count: 14 },
//       { label: "Coaching Center", count: 8 },
//       { label: "Startup / Agency", count: 5 },
//     ],
//     completionRate: 79,
//   },
//   business: {
//     total: 62, completed: 44, pending: 11, inProgress: 7,
//     recentUsers: [
//       { id: "BIZ001", name: "Future Skills Hub", email: "info@fsh.com", status: "Completed", step: 6, type: "Educational Institute", industry: "Education & EdTech", time: "2h ago", subscription: "Enterprise", active: true },
//       { id: "BIZ002", name: "NexGen Corp", email: "hr@nexgen.com", status: "Completed", step: 6, type: "Enterprise", industry: "IT & Software", time: "8h ago", subscription: "Enterprise", active: true },
//       { id: "BIZ003", name: "BrightPath Academy", email: "ops@bpa.com", status: "In Progress", step: 4, type: "Coaching Center", industry: "Education & EdTech", time: "1d ago", subscription: "Pro", active: true },
//       { id: "BIZ004", name: "Innovate Solutions", email: "team@inno.com", status: "Pending", step: 1, type: "—", industry: "—", time: "3d ago", subscription: "Free", active: false },
//     ],
//     topGoals: [
//       { label: "Student Training", count: 28, pct: 64 },
//       { label: "Corporate Upskilling", count: 21, pct: 48 },
//       { label: "Reports & Analytics", count: 18, pct: 41 },
//       { label: "Trainer Management", count: 14, pct: 32 },
//     ],
//     industries: [
//       { label: "IT & Software", count: 22 },
//       { label: "Education & EdTech", count: 18 },
//       { label: "Finance & Banking", count: 11 },
//       { label: "Healthcare", count: 7 },
//     ],
//     completionRate: 71,
//   },
// };

// const ROLE_CONFIG = {
//   student: { label: "Students", color: "#16a34a", bg: "rgba(22,163,74,0.07)", accent: "#dcfce7", light: "#f0fdf4", Icon: GraduationCap },
//   trainer: { label: "Trainers", color: "#ea580c", bg: "rgba(234,88,12,0.07)", accent: "#ffedd5", light: "#fff7ed", Icon: Mic2 },
//   admin: { label: "Admins", color: "#7c3aed", bg: "rgba(124,58,237,0.07)", accent: "#ede9fe", light: "#f5f3ff", Icon: Shield },
//   business: { label: "Businesses", color: "#0369a1", bg: "rgba(3,105,161,0.07)", accent: "#e0f2fe", light: "#f0f9ff", Icon: Briefcase },
// };

// const STATUS_CONFIG = {
//   "Completed": { bg: "#dcfce7", color: "#15803d", dot: "#16a34a", Icon: CheckCircle },
//   "In Progress": { bg: "#ffedd5", color: "#c2410c", dot: "#ea580c", Icon: Clock },
//   "Pending": { bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af", Icon: AlertCircle },
// };

// const SUB_CONFIG = {
//   Free: { bg: "#f3f4f6", color: "#374151", badge: "#e5e7eb" },
//   Pro: { bg: "#ede9fe", color: "#6d28d9", badge: "#ddd6fe" },
//   Enterprise: { bg: "#dbeafe", color: "#1d4ed8", badge: "#bfdbfe" },
// };

// const STEP_DEFS = [
//   { num: 1, label: "Basic Info", Icon: User, desc: "Personal details" },
//   { num: 2, label: "Organization", Icon: Building2, desc: "Work & education" },
//   { num: 3, label: "Documents", Icon: ShieldCheck, desc: "Verification" },
//   { num: 4, label: "Subscription", Icon: CreditCard, desc: "Plan & billing" },
//   { num: 5, label: "Platform Setup", Icon: Settings, desc: "Preferences" },
//   { num: 6, label: "Final Approval", Icon: BadgeCheck, desc: "Activation" },
// ];

// // ── Helpers ──────────────────────────────────────────────────
// const Avatar = ({ name, color, size = 40 }) => (
//   <div style={{
//     width: size, height: size, borderRadius: "50%",
//     background: color + "22", border: `2px solid ${color}44`,
//     display: "flex", alignItems: "center", justifyContent: "center",
//     fontSize: size * 0.32, fontWeight: 700, color, flexShrink: 0, letterSpacing: "-0.5px",
//   }}>
//     {name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
//   </div>
// );

// const Badge = ({ children, bg, color }) => (
//   <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: bg, color }}>
//     {children}
//   </span>
// );

// const InfoRow = ({ Icon: Ic, label, value, accent }) => (
//   <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
//     <div style={{ width: 30, height: 30, borderRadius: 8, background: accent + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//       <Ic size={14} color={accent} />
//     </div>
//     <div style={{ flex: 1 }}>
//       <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
//       <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>{value || "—"}</div>
//     </div>
//   </div>
// );

// const SectionCard = ({ title, Icon: Ic, color, children }) => (
//   <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: 12 }}>
//     <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: "1px solid #f1f5f9", background: color + "08" }}>
//       <div style={{ width: 28, height: 28, borderRadius: 8, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <Ic size={14} color={color} />
//       </div>
//       <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{title}</span>
//     </div>
//     <div style={{ padding: "0 16px 4px" }}>{children}</div>
//   </div>
// );

// // ── Stepper ──────────────────────────────────────────────────
// const Stepper = ({ currentStep, userStep, color, onStepClick }) => (
//   <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", overflowX: "auto" }}>
//     {STEP_DEFS.map((s, i) => {
//       const done = s.num <= userStep;
//       const active = s.num === currentStep;
//       const Ic = s.Icon;
//       return (
//         <React.Fragment key={s.num}>
//           <button onClick={() => onStepClick(s.num)} style={{
//             display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer",
//             background: "none", border: "none", padding: "4px 6px", borderRadius: 10,
//             transition: "background 0.15s", minWidth: 64,
//           }}
//             onMouseEnter={e => e.currentTarget.style.background = color + "12"}
//             onMouseLeave={e => e.currentTarget.style.background = "none"}
//           >
//             <div style={{
//               width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
//               background: active ? color : done ? color + "22" : "#e2e8f0",
//               border: `2px solid ${active ? color : done ? color + "44" : "#e2e8f0"}`,
//               transition: "all 0.2s",
//             }}>
//               {done && !active ? <CheckCircle size={16} color={color} /> : <Ic size={15} color={active ? "#fff" : done ? color : "#94a3b8"} />}
//             </div>
//             <div style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? color : done ? "#475569" : "#94a3b8", textAlign: "center", lineHeight: 1.2 }}>{s.label}</div>
//           </button>
//           {i < STEP_DEFS.length - 1 && (
//             <div style={{ flex: 1, height: 2, minWidth: 12, background: i < userStep - 1 ? color + "44" : "#e2e8f0", margin: "0 2px", marginBottom: 18, transition: "background 0.3s" }} />
//           )}
//         </React.Fragment>
//       );
//     })}
//   </div>
// );

// // ── Step Content Panels ──────────────────────────────────────
// const Step1Panel = ({ data, color }) => (
//   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
//     <SectionCard title="Personal Details" Icon={User} color={color}>
//       <InfoRow Icon={User} label="Full Name" value={data.fullName} accent={color} />
//       <InfoRow Icon={Mail} label="Email" value={data.email} accent={color} />
//       <InfoRow Icon={Phone} label="Phone" value={data.phone} accent={color} />
//       <InfoRow Icon={MapPin} label="Location" value={data.location} accent={color} />
//     </SectionCard>
//     <SectionCard title="Account Info" Icon={Hash} color={color}>
//       <InfoRow Icon={Briefcase} label="Role" value={data.role} accent={color} />
//       <InfoRow Icon={Calendar} label="Registration Date" value={data.registrationDate} accent={color} />
//       <InfoRow Icon={Image} label="Profile Photo" value="Uploaded" accent={color} />
//       <InfoRow Icon={Calendar} label="Date of Birth" value={data.dob} accent={color} />
//     </SectionCard>
//   </div>
// );

// const Step2Panel = ({ data, color }) => (
//   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
//     <SectionCard title="Organization" Icon={Building2} color={color}>
//       <InfoRow Icon={Building2} label="Company / Institute" value={data.orgName} accent={color} />
//       <InfoRow Icon={Layers} label="Department" value={data.department} accent={color} />
//       <InfoRow Icon={Globe} label="Industry" value={data.industry} accent={color} />
//       <InfoRow Icon={TrendingUp} label="Experience" value={data.experience} accent={color} />
//     </SectionCard>
//     <SectionCard title="Skills & Profile" Icon={Star} color={color}>
//       <div style={{ padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
//         <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Skills</div>
//         <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
//           {data.skills.map(s => (
//             <span key={s} style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: color + "15", color }}>{s}</span>
//           ))}
//         </div>
//       </div>
//       <InfoRow Icon={Globe} label="LinkedIn" value={data.linkedIn} accent={color} />
//     </SectionCard>
//   </div>
// );

// const Step3Panel = ({ data, color }) => {
//   const verif = { Approved: { bg: "#dcfce7", c: "#15803d" }, "Under Review": { bg: "#fef9c3", c: "#a16207" }, Pending: { bg: "#f3f4f6", c: "#6b7280" } };
//   const vs = verif[data.verificationStatus] || verif.Pending;
//   return (
//     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
//       <SectionCard title="Document Status" Icon={ShieldCheck} color={color}>
//         <InfoRow Icon={ShieldCheck} label="Aadhaar / ID" value={data.aadhaarStatus} accent={color} />
//         <InfoRow Icon={FileText} label="Resume" value={data.resumeStatus} accent={color} />
//         <InfoRow Icon={Award} label="Certificates" value={`${data.certificateCount} uploaded`} accent={color} />
//         <div style={{ padding: "10px 0" }}>
//           <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Verification Status</div>
//           <span style={{ fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20, background: vs.bg, color: vs.c }}>{data.verificationStatus}</span>
//         </div>
//       </SectionCard>
//       <SectionCard title="Uploaded Documents" Icon={Upload} color={color}>
//         {data.uploadedDocs.length > 0 ? data.uploadedDocs.map((doc, i) => (
//           <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid #f1f5f9" }}>
//             <div style={{ width: 28, height: 28, borderRadius: 7, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <FileText size={13} color={color} />
//             </div>
//             <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{doc}</span>
//             <CheckCircle size={14} color="#16a34a" style={{ marginLeft: "auto" }} />
//           </div>
//         )) : (
//           <div style={{ padding: "20px 0", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No documents uploaded yet</div>
//         )}
//       </SectionCard>
//     </div>
//   );
// };

// const Step4Panel = ({ data, color }) => {
//   const planColors = { Enterprise: { bg: "#dbeafe", c: "#1d4ed8" }, Pro: { bg: "#ede9fe", c: "#6d28d9" }, Free: { bg: "#f3f4f6", c: "#374151" } };
//   const pc = planColors[data.plan] || planColors.Free;
//   return (
//     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
//       <SectionCard title="Plan Details" Icon={CreditCard} color={color}>
//         <div style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
//           <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Current Plan</div>
//           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <Crown size={16} color={pc.c} />
//             <span style={{ fontSize: 16, fontWeight: 800, color: pc.c }}>{data.plan}</span>
//             <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b", marginLeft: "auto" }}>{data.amount}</span>
//           </div>
//         </div>
//         <InfoRow Icon={CheckSquare} label="Payment Status" value={data.paymentStatus} accent={color} />
//         <InfoRow Icon={Calendar} label="Billing Date" value={data.billingDate} accent={color} />
//       </SectionCard>
//       <SectionCard title="Plan Features" Icon={Star} color={color}>
//         <div style={{ padding: "10px 0" }}>
//           {data.planFeatures.map((f, i) => (
//             <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
//               <CheckCircle size={13} color="#16a34a" />
//               <span style={{ fontSize: 13, color: "#334155", fontWeight: 500 }}>{f}</span>
//             </div>
//           ))}
//         </div>
//       </SectionCard>
//     </div>
//   );
// };

// const Step5Panel = ({ data, color }) => (
//   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
//     <SectionCard title="Platform Access" Icon={Settings} color={color}>
//       <div style={{ padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
//         <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Profile Completion</div>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#e2e8f0", overflow: "hidden" }}>
//             <div style={{ height: "100%", width: `${data.profileCompletion}%`, background: color, borderRadius: 4, transition: "width 0.6s ease" }} />
//           </div>
//           <span style={{ fontSize: 13, fontWeight: 700, color }}>{data.profileCompletion}%</span>
//         </div>
//       </div>
//       <InfoRow Icon={CheckCircle} label="Dashboard Access" value={data.dashboardAccess ? "Granted" : "Restricted"} accent={color} />
//       <InfoRow Icon={Users} label="Team Size" value={data.teamSize} accent={color} />
//     </SectionCard>
//     <SectionCard title="Permissions & Preferences" Icon={Lock} color={color}>
//       <div style={{ padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
//         <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Permissions</div>
//         <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
//           {data.permissions.map(p => (
//             <span key={p} style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: color + "15", color }}>{p}</span>
//           ))}
//         </div>
//       </div>
//       <InfoRow Icon={Globe} label="Language" value={data.language} accent={color} />
//       <InfoRow Icon={Bell} label="Notifications" value={data.notifications ? "Enabled" : "Disabled"} accent={color} />
//     </SectionCard>
//   </div>
// );

// const Step6Panel = ({ data, color }) => {
//   const apprColors = { Approved: { bg: "#dcfce7", c: "#15803d" }, "Under Review": { bg: "#fef9c3", c: "#a16207" }, Pending: { bg: "#f3f4f6", c: "#6b7280" } };
//   const ac = apprColors[data.approvalStatus] || apprColors.Pending;
//   return (
//     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
//       <SectionCard title="Approval Details" Icon={BadgeCheck} color={color}>
//         <div style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
//           <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Approval Status</div>
//           <span style={{ fontSize: 13, fontWeight: 700, padding: "5px 12px", borderRadius: 20, background: ac.bg, color: ac.c }}>{data.approvalStatus}</span>
//         </div>
//         <InfoRow Icon={Activity} label="Account Status" value={data.activeStatus ? "Active" : "Inactive"} accent={color} />
//         <InfoRow Icon={Calendar} label="Completion Date" value={data.completionDate} accent={color} />
//         <InfoRow Icon={CheckSquare} label="Final Review" value={data.finalReview} accent={color} />
//       </SectionCard>
//       <SectionCard title="Review Notes" Icon={FileText} color={color}>
//         <InfoRow Icon={User} label="Reviewed By" value={data.reviewer} accent={color} />
//         <div style={{ padding: "10px 0" }}>
//           <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Admin Notes</div>
//           <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, background: "#f8fafc", padding: "10px 12px", borderRadius: 10, border: "1px solid #e2e8f0" }}>
//             {data.adminNotes}
//           </div>
//         </div>
//       </SectionCard>
//     </div>
//   );
// };

// // ── Onboarding Detail Modal ───────────────────────────────────
// const OnboardingModal = ({ user, cfg, roleKey, onClose, onEdit, onDelete, onToggleActive }) => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const stepData = generateStepData(user, roleKey);
//   const color = cfg.color;
//   const ss = STATUS_CONFIG[user.status] || STATUS_CONFIG.Pending;
//   const sub = SUB_CONFIG[user.subscription] || SUB_CONFIG.Free;
//   const pct = Math.round((user.step / 6) * 100);

//   const stepPanels = [Step1Panel, Step2Panel, Step3Panel, Step4Panel, Step5Panel, Step6Panel];
//   const CurrentPanel = stepPanels[currentStep - 1];
//   const currentStepData = [stepData.step1, stepData.step2, stepData.step3, stepData.step4, stepData.step5, stepData.step6][currentStep - 1];

//   return (
//     <div style={{
//       position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1000,
//       display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
//       backdropFilter: "blur(4px)",
//     }}>
//       <div style={{
//         background: "#fff", borderRadius: 20, width: "100%", maxWidth: 860,
//         maxHeight: "90vh", display: "flex", flexDirection: "column",
//         boxShadow: "0 32px 64px rgba(0,0,0,0.25)", overflow: "hidden",
//         animation: "fadeIn 0.2s ease",
//       }}>
//         <style>{`@keyframes fadeIn { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }`}</style>

//         {/* Modal Header */}
//         <div style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, padding: "20px 24px", flexShrink: 0 }}>
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//               <Avatar name={user.name} color="rgba(255,255,255,0.9)" size={48} />
//               <div>
//                 <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px" }}>{user.name}</div>
//                 <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{user.email} · {user.id}</div>
//               </div>
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               {/* Quick actions */}
//               <button onClick={() => onToggleActive(user.id)} style={{
//                 display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10,
//                 background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.3)",
//                 color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
//               }}>
//                 {user.active ? <CheckCircle size={14} /> : <XCircle size={14} />}
//                 {user.active ? "Active" : "Inactive"}
//               </button>
//               <button onClick={() => onEdit(user)} style={{
//                 display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10,
//                 background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.3)",
//                 color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
//               }}>
//                 <Pencil size={13} /> Edit
//               </button>
//               <button onClick={() => { onClose(); onDelete(user); }} style={{
//                 display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10,
//                 background: "rgba(239,68,68,0.3)", border: "1.5px solid rgba(239,68,68,0.5)",
//                 color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
//               }}>
//                 <Trash2 size={13} /> Delete
//               </button>
//               <button onClick={onClose} style={{
//                 width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
//                 border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
//               }}>
//                 <X size={16} />
//               </button>
//             </div>
//           </div>

//           {/* Status row */}
//           <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
//             <Badge bg="rgba(255,255,255,0.2)" color="#fff">
//               <ss.Icon size={11} /> {user.status}
//             </Badge>
//             <Badge bg="rgba(255,255,255,0.2)" color="#fff">
//               <Crown size={11} /> {user.subscription}
//             </Badge>
//             <Badge bg="rgba(255,255,255,0.2)" color="#fff">
//               Step {user.step} / 6 — {pct}% complete
//             </Badge>
//             <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
//               <div style={{ height: 6, width: 120, borderRadius: 3, background: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
//                 <div style={{ height: "100%", width: `${pct}%`, background: "rgba(255,255,255,0.9)", borderRadius: 3 }} />
//               </div>
//               <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{pct}%</span>
//             </div>
//           </div>

//           {/* Route path */}
//           <div style={{ marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>
//             /superadmin/onboarding/{user.id} · {cfg.label}
//           </div>
//         </div>

//         {/* Stepper */}
//         <Stepper currentStep={currentStep} userStep={user.step} color={color} onStepClick={setCurrentStep} />

//         {/* Step Content */}
//         <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>
//             {React.createElement(STEP_DEFS[currentStep - 1].Icon, { size: 16, color })}
//             <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Step {currentStep} — {STEP_DEFS[currentStep - 1].label}</span>
//             <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 4 }}>{STEP_DEFS[currentStep - 1].desc}</span>
//             {currentStep > user.step && (
//               <Badge bg="#fef9c3" color="#a16207" style={{ marginLeft: "auto" }}><AlertCircle size={10} /> Not reached yet</Badge>
//             )}
//           </div>
//           <CurrentPanel data={currentStepData} color={color} />
//         </div>

//         {/* Footer Navigation */}
//         <div style={{ padding: "12px 20px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fafafa", flexShrink: 0 }}>
//           <button onClick={() => setCurrentStep(s => Math.max(1, s - 1))} disabled={currentStep === 1}
//             style={{
//               display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10,
//               border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 13, fontWeight: 600,
//               cursor: currentStep === 1 ? "not-allowed" : "pointer", opacity: currentStep === 1 ? 0.4 : 1,
//             }}>
//             <ChevronLeft size={15} /> Previous
//           </button>
//           <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{currentStep} of 6 steps</span>
//           <button onClick={() => setCurrentStep(s => Math.min(6, s + 1))} disabled={currentStep === 6}
//             style={{
//               display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10,
//               border: "none", background: color, color: "#fff", fontSize: 13, fontWeight: 700,
//               cursor: currentStep === 6 ? "not-allowed" : "pointer", opacity: currentStep === 6 ? 0.5 : 1,
//             }}>
//             Next <ChevronRight size={15} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── Edit Modal ────────────────────────────────────────────────
// const EditModal = ({ user, cfg, onClose, onSave }) => {
//   const [form, setForm] = useState({ name: user.name, email: user.email, status: user.status, subscription: user.subscription, active: user.active });
//   return (
//     <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
//       <div style={{ background: "#fff", borderRadius: 18, padding: 28, maxWidth: 440, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.22)" }}>
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div style={{ width: 36, height: 36, borderRadius: 10, background: cfg.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <Pencil size={16} color={cfg.color} />
//             </div>
//             <div>
//               <div style={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>Edit Onboarding</div>
//               <div style={{ fontSize: 11, color: "#94a3b8" }}>ID: {user.id}</div>
//             </div>
//           </div>
//           <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <X size={14} color="#64748b" />
//           </button>
//         </div>

//         {[["Full Name", "name", "text"], ["Email", "email", "email"]].map(([label, key, type]) => (
//           <div key={key} style={{ marginBottom: 14 }}>
//             <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>{label}</label>
//             <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
//               style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${cfg.color}33`, fontSize: 13, outline: "none", color: "#1e293b", background: cfg.bg, boxSizing: "border-box", fontFamily: "inherit" }} />
//           </div>
//         ))}

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 22 }}>
//           {[["Status", "status", ["Completed", "In Progress", "Pending"]], ["Plan", "subscription", ["Free", "Pro", "Enterprise"]]].map(([label, key, opts]) => (
//             <div key={key}>
//               <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>{label}</label>
//               <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
//                 style={{ width: "100%", padding: "8px 10px", borderRadius: 9, border: `1.5px solid ${cfg.color}33`, fontSize: 12, background: cfg.bg, color: "#1e293b", outline: "none", fontFamily: "inherit" }}>
//                 {opts.map(o => <option key={o}>{o}</option>)}
//               </select>
//             </div>
//           ))}
//           <div>
//             <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Active</label>
//             <button onClick={() => setForm(f => ({ ...f, active: !f.active }))}
//               style={{
//                 width: "100%", padding: "8px 10px", borderRadius: 9, border: `1.5px solid ${form.active ? cfg.color + "44" : "#e2e8f0"}`,
//                 background: form.active ? cfg.color + "12" : "#f8fafc",
//                 color: form.active ? cfg.color : "#6b7280", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
//               }}>
//               {form.active ? <CheckCircle size={12} /> : <XCircle size={12} />} {form.active ? "Active" : "Inactive"}
//             </button>
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: 10 }}>
//           <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
//           <button onClick={() => onSave(form)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: cfg.color, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Save Changes</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── Delete Modal ──────────────────────────────────────────────
// const DeleteModal = ({ user, onConfirm, onCancel }) => (
//   <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center" }}>
//     <div style={{ background: "#fff", borderRadius: 18, padding: 28, maxWidth: 360, width: "90%", boxShadow: "0 24px 64px rgba(0,0,0,0.22)" }}>
//       <div style={{ textAlign: "center", marginBottom: 16 }}>
//         <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
//           <Trash2 size={24} color="#dc2626" />
//         </div>
//         <div style={{ fontSize: 17, fontWeight: 800, color: "#1e293b" }}>Delete User?</div>
//         <div style={{ fontSize: 13, color: "#64748b", marginTop: 6, lineHeight: 1.5 }}>
//           This will permanently delete <strong>{user?.name}</strong>. This action cannot be undone.
//         </div>
//       </div>
//       <div style={{ display: "flex", gap: 10 }}>
//         <button onClick={onCancel} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
//         <button onClick={onConfirm} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
//       </div>
//     </div>
//   </div>
// );

// // ── Ring Chart ────────────────────────────────────────────────
// const RingChart = ({ pct, color, size = 56 }) => {
//   const r = (size - 8) / 2;
//   const circ = 2 * Math.PI * r;
//   const dash = (pct / 100) * circ;
//   return (
//     <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
//       <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={7} />
//       <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={7}
//         strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
//     </svg>
//   );
// };

// const MiniBar = ({ pct, color }) => (
//   <div style={{ height: 6, borderRadius: 3, background: "#f1f5f9", overflow: "hidden" }}>
//     <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.5s ease" }} />
//   </div>
// );

// // ── User Row ──────────────────────────────────────────────────
// const UserRow = ({ user, cfg, roleKey, onView, onEdit, onDelete, onToggleActive }) => {
//   const [hov, setHov] = useState(false);
//   const ss = STATUS_CONFIG[user.status] || STATUS_CONFIG.Pending;
//   const sub = SUB_CONFIG[user.subscription] || SUB_CONFIG.Free;
//   const col1Key = roleKey === "student" ? "goal" : roleKey === "trainer" ? "expertise" : roleKey === "admin" ? "org" : "type";

//   return (
//     <div
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
//         borderRadius: 12, background: hov ? cfg.bg : "#fafafa",
//         border: `1px solid ${hov ? cfg.color + "33" : "#f1f5f9"}`,
//         flexWrap: "wrap", transition: "all 0.15s", cursor: "pointer",
//       }}
//       onClick={() => onView(user)}
//     >
//       <Avatar name={user.name} color={cfg.color} size={36} />
//       <div style={{ flex: 1, minWidth: 100 }}>
//         <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{user.name}</div>
//         <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{user[col1Key] !== "—" ? user[col1Key] : user.email}</div>
//       </div>

//       <Badge bg={ss.bg} color={ss.color}>
//         <ss.Icon size={10} /> {user.status}
//       </Badge>

//       <Badge bg={sub.bg} color={sub.color}>
//         <Crown size={10} /> {user.subscription}
//       </Badge>

//       <button
//         onClick={e => { e.stopPropagation(); onToggleActive(user.id); }}
//         style={{
//           display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 8,
//           border: `1.5px solid ${user.active ? cfg.color + "44" : "#e2e8f0"}`,
//           background: user.active ? cfg.color + "10" : "#f8fafc",
//           color: user.active ? cfg.color : "#9ca3af", fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
//         }}>
//         {user.active ? <CheckCircle size={11} /> : <XCircle size={11} />} {user.active ? "Active" : "Inactive"}
//       </button>

//       <div style={{ fontSize: 10, color: "#94a3b8", textAlign: "right", minWidth: 44 }}>
//         <div style={{ fontWeight: 600 }}>Step {user.step}/6</div>
//         <div>{user.time}</div>
//       </div>

//       <div style={{ display: "flex", gap: 5 }} onClick={e => e.stopPropagation()}>
//         {[
//           { label: "View", Icon: Eye, color: "#2563eb", bg: "#dbeafe", action: () => onView(user) },
//           { label: "Edit", Icon: Pencil, color: "#ea580c", bg: "#ffedd5", action: () => onEdit(user) },
//           { label: "Delete", Icon: Trash2, color: "#dc2626", bg: "#fee2e2", action: () => onDelete(user) },
//         ].map(({ label, Icon: Ic, color, bg, action }) => (
//           <button key={label} onClick={action} title={label}
//             style={{
//               width: 30, height: 30, borderRadius: 8, border: `1px solid ${color}33`,
//               background: "transparent", color, cursor: "pointer", display: "flex", alignItems: "center",
//               justifyContent: "center", transition: "all 0.15s",
//             }}
//             onMouseEnter={e => e.currentTarget.style.background = bg}
//             onMouseLeave={e => e.currentTarget.style.background = "transparent"}
//           >
//             <Ic size={13} />
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// // ── Section Header Card ───────────────────────────────────────
// const SectionHeader = ({ roleKey, data, cfg, isActive, onClick }) => {
//   const pct = Math.round((data.completed / data.total) * 100);
//   const Ic = cfg.Icon;
//   return (
//     <div onClick={onClick} style={{
//       background: isActive ? cfg.bg : "#fff",
//       border: `2px solid ${isActive ? cfg.color : "#e2e8f0"}`,
//       borderRadius: 14, padding: "16px 18px", cursor: "pointer",
//       transition: "all 0.2s", boxShadow: isActive ? `0 4px 20px ${cfg.color}22` : "none",
//     }}
//       onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = cfg.color + "55"; e.currentTarget.style.background = cfg.light; } }}
//       onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; } }}
//     >
//       <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//         <div style={{ width: 44, height: 44, borderRadius: 12, background: cfg.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//           <Ic size={20} color={cfg.color} />
//         </div>
//         <div style={{ flex: 1 }}>
//           <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{cfg.label}</div>
//           <div style={{ fontSize: 12, color: "#94a3b8" }}>{data.total.toLocaleString()} total onboarded</div>
//         </div>
//         <div style={{ textAlign: "right" }}>
//           <div style={{ fontSize: 20, fontWeight: 800, color: cfg.color }}>{data.total}</div>
//           <div style={{ fontSize: 10, color: "#94a3b8" }}>{pct}% done</div>
//         </div>
//       </div>
//       <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
//         {[{ label: "Completed", val: data.completed, c: "#16a34a" }, { label: "In Progress", val: data.inProgress, c: "#ea580c" }, { label: "Pending", val: data.pending, c: "#9ca3af" }].map(s => (
//           <div key={s.label} style={{ flex: 1, padding: "6px", borderRadius: 8, background: "rgba(0,0,0,0.03)", textAlign: "center" }}>
//             <div style={{ fontSize: 15, fontWeight: 800, color: s.c }}>{s.val}</div>
//             <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>{s.label}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // ── Detail Panel ──────────────────────────────────────────────
// const DetailPanel = ({ roleKey, data, cfg, onUpdateData }) => {
//   const [subTab, setSubTab] = useState("users");
//   const [viewUser, setViewUser] = useState(null);
//   const [editUser, setEditUser] = useState(null);
//   const [deleteUser, setDeleteUser] = useState(null);

//   const barData = roleKey === "student" ? data.topGoals : roleKey === "trainer" ? data.topFocus : data.topGoals;
//   const distData = roleKey === "student" ? data.learningAreas : roleKey === "trainer" ? data.deliveryStyle : roleKey === "admin" ? data.orgTypes : data.industries;
//   const distLabel = roleKey === "student" ? "Learning Areas" : roleKey === "trainer" ? "Delivery Styles" : roleKey === "admin" ? "Org Types" : "Industries";

//   const handleSave = (form) => {
//     onUpdateData(roleKey, data.recentUsers.map(u => u.id === editUser.id ? { ...u, ...form } : u));
//     setEditUser(null);
//   };
//   const handleDelete = () => {
//     onUpdateData(roleKey, data.recentUsers.filter(u => u.id !== deleteUser.id));
//     setDeleteUser(null);
//   };
//   const handleToggle = (id) => {
//     onUpdateData(roleKey, data.recentUsers.map(u => u.id === id ? { ...u, active: !u.active } : u));
//   };

//   return (
//     <>
//       {viewUser && <OnboardingModal user={viewUser} cfg={cfg} roleKey={roleKey} onClose={() => setViewUser(null)} onEdit={(u) => { setViewUser(null); setEditUser(u); }} onDelete={(u) => { setViewUser(null); setDeleteUser(u); }} onToggleActive={handleToggle} />}
//       {editUser && <EditModal user={editUser} cfg={cfg} onClose={() => setEditUser(null)} onSave={handleSave} />}
//       {deleteUser && <DeleteModal user={deleteUser} onConfirm={handleDelete} onCancel={() => setDeleteUser(null)} />}

//       <div style={{ background: "#fff", border: `1.5px solid ${cfg.color}22`, borderRadius: 18, overflow: "hidden", boxShadow: `0 4px 24px ${cfg.color}10` }}>
//         {/* Panel header */}
//         <div style={{ background: `linear-gradient(135deg,${cfg.color}ee,${cfg.color}aa)`, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             {React.createElement(cfg.Icon, { size: 20, color: "#fff" })}
//             <div>
//               <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{cfg.label} Onboarding</div>
//               <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Click any user row to view full onboarding details</div>
//             </div>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <RingChart pct={data.completionRate} color="rgba(255,255,255,0.9)" size={46} />
//             <div style={{ textAlign: "right" }}>
//               <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{data.completionRate}%</div>
//               <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>completion</div>
//             </div>
//           </div>
//         </div>

//         {/* Sub tabs */}
//         <div style={{ display: "flex", borderBottom: `1px solid ${cfg.color}18`, background: "#fafafa" }}>
//           {[["users", Users, "Recent Users"], ["goals", TrendingUp, "Top Goals"], ["dist", PieChart, distLabel]].map(([id, Ic, label]) => (
//             <button key={id} onClick={() => setSubTab(id)} style={{
//               flex: 1, padding: "11px 8px", border: "none", background: "transparent",
//               borderBottom: subTab === id ? `2.5px solid ${cfg.color}` : "2.5px solid transparent",
//               color: subTab === id ? cfg.color : "#94a3b8",
//               fontSize: 12, fontWeight: subTab === id ? 700 : 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
//               fontFamily: "inherit", transition: "all 0.15s",
//             }}>
//               <Ic size={13} /> {label}
//             </button>
//           ))}
//         </div>

//         <div style={{ padding: 16 }}>
//           {subTab === "users" && (
//             <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//               {data.recentUsers.length === 0 && (
//                 <div style={{ textAlign: "center", padding: "28px", color: "#94a3b8", fontSize: 13 }}>No users found.</div>
//               )}
//               {data.recentUsers.map(u => (
//                 <UserRow key={u.id} user={u} cfg={cfg} roleKey={roleKey}
//                   onView={setViewUser} onEdit={setEditUser} onDelete={setDeleteUser} onToggleActive={handleToggle} />
//               ))}
//             </div>
//           )}
//           {subTab === "goals" && (
//             <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//               {barData.map((g, i) => (
//                 <div key={i}>
//                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
//                     <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{g.label}</span>
//                     <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{g.count}</span>
//                   </div>
//                   <MiniBar pct={g.pct} color={cfg.color} />
//                 </div>
//               ))}
//             </div>
//           )}
//           {subTab === "dist" && (
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
//               {distData.map((d, i) => (
//                 <div key={i} style={{ padding: "14px", borderRadius: 12, background: cfg.bg, border: `1px solid ${cfg.color}22`, textAlign: "center" }}>
//                   <div style={{ fontSize: 22, fontWeight: 800, color: cfg.color }}>{d.count}</div>
//                   <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginTop: 3 }}>{d.label}</div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// // ── Main Dashboard ────────────────────────────────────────────
// export default function OnboardingDashboard() {
//   const [activeRole, setActiveRole] = useState(null);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [tableData, setTableData] = useState(ONBOARDING_DATA);

//   const handleUpdateData = (roleKey, newUsers) => {
//     setTableData(prev => ({ ...prev, [roleKey]: { ...prev[roleKey], recentUsers: newUsers } }));
//   };

//   const allTotal = Object.values(tableData).reduce((s, d) => s + d.total, 0);
//   const allCompleted = Object.values(tableData).reduce((s, d) => s + d.completed, 0);
//   const allPending = Object.values(tableData).reduce((s, d) => s + d.pending, 0);
//   const allInProg = Object.values(tableData).reduce((s, d) => s + d.inProgress, 0);
//   const overallPct = Math.round((allCompleted / allTotal) * 100);

//   return (
//     <div style={{ fontFamily: "'DM Sans', 'Inter', -apple-system, sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "28px 24px" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
//         * { box-sizing: border-box; margin: 0; }
//         ::-webkit-scrollbar { width: 5px; }
//         ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
//         button { font-family: inherit; }
//       `}</style>

//       {/* Header */}
//       <div style={{ marginBottom: 28 }}>
//         <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,#ea580c,#f59e0b)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <BarChart3 size={20} color="#fff" />
//             </div>
//             <div>
//               <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.4px" }}>Onboarding Dashboard</div>
//               <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>Centralized view — Students, Trainers, Admins & Businesses</div>
//             </div>
//           </div>

//           <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
//             {[
//               { label: "Total", val: allTotal.toLocaleString(), color: "#1e293b", bg: "#fff", border: "#e2e8f0" },
//               { label: "Completed", val: allCompleted, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
//               { label: "In Progress", val: allInProg, color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
//               { label: "Pending", val: allPending, color: "#9ca3af", bg: "#f9fafb", border: "#e5e7eb" },
//             ].map(s => (
//               <div key={s.label} style={{ padding: "8px 14px", borderRadius: 10, background: s.bg, border: `1.5px solid ${s.border}`, textAlign: "center", minWidth: 72 }}>
//                 <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
//                 <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
//               </div>
//             ))}
//             <div style={{ padding: "8px 14px", borderRadius: 10, background: "linear-gradient(135deg,#ea580c,#f59e0b)", display: "flex", alignItems: "center", gap: 8 }}>
//               <RingChart pct={overallPct} color="rgba(255,255,255,0.9)" size={42} />
//               <div>
//                 <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{overallPct}%</div>
//                 <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>OVERALL</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
//           {["All", "Completed", "In Progress", "Pending"].map(f => (
//             <button key={f} onClick={() => setFilterStatus(f)} style={{
//               padding: "5px 16px", borderRadius: 20, border: "1.5px solid",
//               borderColor: filterStatus === f ? "#ea580c" : "#e2e8f0",
//               background: filterStatus === f ? "#ea580c" : "#fff",
//               color: filterStatus === f ? "#fff" : "#64748b",
//               fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
//             }}>{f}</button>
//           ))}
//         </div>
//       </div>

//       {/* Grid */}
//       <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, alignItems: "start" }}>
//         {/* Left */}
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Select Role to Inspect</div>
//           {Object.entries(tableData).map(([roleKey, data]) => (
//             <SectionHeader key={roleKey} roleKey={roleKey} data={data} cfg={ROLE_CONFIG[roleKey]}
//               isActive={activeRole === roleKey}
//               onClick={() => setActiveRole(activeRole === roleKey ? null : roleKey)} />
//           ))}

//           {/* Platform overview */}
//           <div style={{ marginTop: 4, padding: "16px", borderRadius: 14, background: "linear-gradient(135deg,#0f172a,#1e293b)", border: "1px solid #1e293b" }}>
//             <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Platform Overview</div>
//             {Object.entries(tableData).map(([roleKey, data]) => {
//               const cfg = ROLE_CONFIG[roleKey];
//               const pct = Math.round((data.completed / data.total) * 100);
//               const Ic = cfg.Icon;
//               return (
//                 <div key={roleKey} style={{ marginBottom: 12 }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
//                     <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: 6 }}>
//                       <Ic size={12} color={cfg.color} /> {cfg.label}
//                     </span>
//                     <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color }}>{pct}%</span>
//                   </div>
//                   <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
//                     <div style={{ height: "100%", width: `${pct}%`, background: cfg.color, borderRadius: 3, transition: "width 0.5s ease" }} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Right */}
//         <div>
//           {activeRole ? (
//             <DetailPanel roleKey={activeRole} data={tableData[activeRole]} cfg={ROLE_CONFIG[activeRole]} onUpdateData={handleUpdateData} />
//           ) : (
//             <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//               <div style={{ padding: "14px 18px", borderRadius: 14, background: "#fff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 12 }}>
//                 <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fef9c3", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                   <ArrowRight size={18} color="#a16207" />
//                 </div>
//                 <div>
//                   <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Select a role to see detailed onboarding analytics</div>
//                   <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Click any user row to view the full 6-step onboarding journey — View, Edit, Delete, and Status controls per user</div>
//                 </div>
//               </div>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//                 {Object.entries(tableData).map(([roleKey, data]) => {
//                   const cfg = ROLE_CONFIG[roleKey];
//                   const pct = Math.round((data.completed / data.total) * 100);
//                   const Ic = cfg.Icon;
//                   return (
//                     <div key={roleKey} onClick={() => setActiveRole(roleKey)}
//                       style={{ padding: "18px", borderRadius: 14, background: cfg.bg, border: `1.5px solid ${cfg.color}22`, cursor: "pointer", transition: "all 0.2s" }}
//                       onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${cfg.color}22`; }}
//                       onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
//                     >
//                       <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
//                         <div style={{ width: 40, height: 40, borderRadius: 10, background: cfg.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                           <Ic size={18} color={cfg.color} />
//                         </div>
//                         <div>
//                           <div style={{ fontSize: 14, fontWeight: 700, color: cfg.color }}>{cfg.label}</div>
//                           <div style={{ fontSize: 11, color: "#64748b" }}>{data.total} total</div>
//                         </div>
//                         <div style={{ marginLeft: "auto" }}>
//                           <RingChart pct={pct} color={cfg.color} size={40} />
//                         </div>
//                       </div>
//                       <div style={{ display: "flex", gap: 8 }}>
//                         {[[data.completed, "#16a34a", "✓ Done"], [data.inProgress, "#ea580c", "⏳ Active"], [data.pending, "#9ca3af", "○ Pending"]].map(([val, c, label], i) => (
//                           <div key={i} style={{ flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 8, background: "rgba(255,255,255,0.6)" }}>
//                             <div style={{ fontSize: 16, fontWeight: 800, color: c }}>{val}</div>
//                             <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>{label}</div>
//                           </div>
//                         ))}
//                       </div>
//                       <div style={{ marginTop: 10, display: "flex", gap: 5 }}>
//                         {[[Eye, "#2563eb", "View"], [Pencil, "#ea580c", "Edit"], [Trash2, "#dc2626", "Delete"]].map(([Ic2, c, label]) => (
//                           <span key={label} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: c + "15", color: c, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
//                             <Ic2 size={9} /> {label}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






































import React, { useState, useEffect, useRef } from "react";
import {
  Eye, Pencil, Trash2, Crown, CheckCircle, XCircle, User, Building2,
  ShieldCheck, CreditCard, Settings, BadgeCheck, ChevronRight, ChevronLeft,
  X, Clock, Users, Briefcase, GraduationCap, Mic2, Shield, FileText,
  Phone, Mail, MapPin, Calendar, Star, Award, TrendingUp, AlertCircle,
  CheckSquare, Upload, Image, Layers, Bell, Lock, Globe, Hash, Activity,
  PieChart, Search, Download, Plus, GripVertical, ClipboardList, ThumbsUp,
  ThumbsDown, Filter
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────────

const generateStepData = (user, roleKey) => ({
  step1: {
    fullName: user.name,
    email: user.email,
    phone: "+91 9812345678",
    role: roleKey === "student" ? "Student" : roleKey === "trainer" ? "Trainer" : roleKey === "admin" ? "Administrator" : "Business Owner",
    registrationDate: "Jan 15, 2025",
    location: "Mumbai, Maharashtra",
    dob: "1998-06-12",
  },
  step2: {
    orgName: roleKey === "student" ? "Mumbai University" : roleKey === "trainer" ? "Self-Employed" : user.org || "Innovate Labs",
    department: roleKey === "student" ? "Computer Science" : roleKey === "trainer" ? "Training & Development" : "Operations",
    industry: user.industry || "IT & Software",
    experience: roleKey === "student" ? "Fresher" : "3-5 Years",
    skills: ["JavaScript", "React", "Node.js", "Python"],
    linkedIn: "linkedin.com/in/" + (user.name || "user").toLowerCase().replace(/\s/g, ""),
  },
  step3: {
    aadhaarStatus: user.step >= 3 ? "Verified" : "Pending",
    resumeStatus: user.step >= 3 ? "Uploaded" : "Missing",
    certificateCount: user.step >= 3 ? 3 : 0,
    verificationStatus: user.step >= 4 ? "Approved" : user.step >= 3 ? "Under Review" : "Pending",
    uploadedDocs: user.step >= 3 ? ["Aadhaar.pdf", "Resume.pdf", "Cert_React.pdf"] : [],
  },
  step4: {
    plan: user.subscription,
    paymentStatus: user.subscription !== "Free" ? "Active" : "N/A",
    billingDate: user.subscription !== "Free" ? "Feb 15, 2025" : "—",
    planFeatures: user.subscription === "Enterprise"
      ? ["Unlimited courses", "Priority support", "Analytics dashboard", "Custom branding", "API access"]
      : user.subscription === "Pro"
        ? ["50 courses/month", "Email support", "Basic analytics", "Certificates"]
        : ["5 courses/month", "Community support", "Basic features"],
    amount: user.subscription === "Enterprise" ? "₹4,999/mo" : user.subscription === "Pro" ? "₹999/mo" : "Free",
  },
  step5: {
    profileCompletion: Math.round((user.step / 6) * 100),
    dashboardAccess: user.step >= 5,
    permissions: user.subscription === "Enterprise"
      ? ["Admin Panel", "Analytics", "Team Management", "API"]
      : user.subscription === "Pro" ? ["Dashboard", "Analytics", "Certificates"] : ["Dashboard"],
    teamSize: roleKey === "admin" || roleKey === "business" ? user.size || "11-50" : "Individual",
    language: "English",
    notifications: true,
  },
  step6: {
    approvalStatus: user.status === "Completed" ? "Approved" : user.status === "In Progress" ? "Under Review" : "Pending",
    activeStatus: user.active,
    adminNotes: user.status === "Completed" ? "All documents verified. Account activated successfully." : "Awaiting document verification.",
    completionDate: user.status === "Completed" ? "Jan 20, 2025" : "—",
    finalReview: user.status === "Completed" ? "Passed" : "Pending",
    reviewer: "Suresh Kumar (Admin)",
  },
});

const ALL_USERS = [
  { id: "STU001", name: "Arjun Mehta",        email: "arjun@example.com",   status: "Completed",   step: 6, role: "Student",  learning: "Programming & Development", time: "2h ago",  subscription: "Pro",        active: true,  joinDate: "15/01/2025", roleKey: "student",  appliedAt: "2025-01-10T08:00:00Z" },
  { id: "STU002", name: "Priya Sharma",        email: "priya@example.com",   status: "In Progress", step: 3, role: "Student",  learning: "Data & AI",                 time: "4h ago",  subscription: "Free",       active: true,  joinDate: "18/01/2025", roleKey: "student",  appliedAt: "2025-01-13T10:30:00Z" },
  { id: "STU003", name: "Sneha Patel",         email: "sneha@example.com",   status: "Pending",     step: 1, role: "Student",  learning: "—",                         time: "6h ago",  subscription: "Free",       active: false, joinDate: "20/01/2025", roleKey: "student",  appliedAt: "2025-01-15T09:15:00Z" },
  { id: "STU004", name: "Karan Singh",         email: "karan@example.com",   status: "Completed",   step: 6, role: "Student",  learning: "Design & Creativity",       time: "1d ago",  subscription: "Enterprise", active: true,  joinDate: "22/01/2025", roleKey: "student",  appliedAt: "2025-01-12T14:00:00Z" },
  { id: "STU005", name: "Rahul Verma",         email: "rahul@example.com",   status: "In Progress", step: 4, role: "Student",  learning: "Business & Marketing",      time: "1d ago",  subscription: "Pro",        active: true,  joinDate: "25/01/2025", roleKey: "student",  appliedAt: "2025-01-14T11:00:00Z" },
  { id: "TRN001", name: "Meera Joshi",         email: "meera@example.com",   status: "Completed",   step: 6, role: "Trainer", expertise: "UI/UX Design",             time: "3h ago",  subscription: "Enterprise", active: true,  joinDate: "10/01/2025", roleKey: "trainer",  appliedAt: "2025-01-05T07:00:00Z" },
  { id: "TRN002", name: "Vikram Nair",         email: "vikram@example.com",  status: "Completed",   step: 6, role: "Trainer", expertise: "Data Science",             time: "5h ago",  subscription: "Pro",        active: true,  joinDate: "12/01/2025", roleKey: "trainer",  appliedAt: "2025-01-07T09:00:00Z" },
  { id: "TRN003", name: "Deepa Rao",           email: "deepa@example.com",   status: "In Progress", step: 4, role: "Trainer", expertise: "Digital Marketing",        time: "1d ago",  subscription: "Pro",        active: false, joinDate: "14/01/2025", roleKey: "trainer",  appliedAt: "2025-01-09T08:30:00Z" },
  { id: "TRN004", name: "Aarav Shah",          email: "aarav@example.com",   status: "Pending",     step: 1, role: "Trainer", expertise: "—",                        time: "2d ago",  subscription: "Free",       active: false, joinDate: "16/01/2025", roleKey: "trainer",  appliedAt: "2025-01-16T12:00:00Z" },
  { id: "ADM001", name: "Suresh Kumar",        email: "suresh@example.com",  status: "Completed",   step: 6, role: "Admin",   org: "Innovate Labs",   size: "51-200",  time: "1h ago",  subscription: "Enterprise", active: true,  joinDate: "05/01/2025", roleKey: "admin",    appliedAt: "2025-01-01T06:00:00Z" },
  { id: "ADM002", name: "Anita Desai",         email: "anita@example.com",   status: "Completed",   step: 6, role: "Admin",   org: "TechVenture Inc.", size: "201-500", time: "4h ago",  subscription: "Pro",        active: true,  joinDate: "07/01/2025", roleKey: "admin",    appliedAt: "2025-01-03T08:00:00Z" },
  { id: "ADM003", name: "Ravi Menon",          email: "ravi@example.com",    status: "In Progress", step: 3, role: "Admin",   org: "EduZone Academy", size: "11-50",   time: "1d ago",  subscription: "Pro",        active: true,  joinDate: "09/01/2025", roleKey: "admin",    appliedAt: "2025-01-06T10:00:00Z" },
  { id: "ADM004", name: "Pooja Tiwari",        email: "pooja@example.com",   status: "Pending",     step: 1, role: "Admin",   org: "—",               size: "—",       time: "2d ago",  subscription: "Free",       active: false, joinDate: "11/01/2025", roleKey: "admin",    appliedAt: "2025-01-17T09:00:00Z" },
  { id: "BIZ001", name: "Future Skills Hub",   email: "info@fsh.com",        status: "Completed",   step: 6, role: "Business", type: "Educational Institute", industry: "Education & EdTech", time: "2h ago",  subscription: "Enterprise", active: true,  joinDate: "01/01/2025", roleKey: "business", appliedAt: "2024-12-28T08:00:00Z" },
  { id: "BIZ002", name: "NexGen Corp",         email: "hr@nexgen.com",       status: "Completed",   step: 6, role: "Business", type: "Enterprise",            industry: "IT & Software",       time: "8h ago",  subscription: "Enterprise", active: true,  joinDate: "03/01/2025", roleKey: "business", appliedAt: "2024-12-30T09:00:00Z" },
  { id: "BIZ003", name: "BrightPath Academy",  email: "ops@bpa.com",         status: "In Progress", step: 4, role: "Business", type: "Coaching Center",       industry: "Education & EdTech",  time: "1d ago",  subscription: "Pro",        active: true,  joinDate: "05/01/2025", roleKey: "business", appliedAt: "2025-01-02T11:00:00Z" },
  { id: "BIZ004", name: "Innovate Solutions",  email: "team@inno.com",       status: "Pending",     step: 1, role: "Business", type: "—",                     industry: "—",                   time: "3d ago",  subscription: "Free",       active: false, joinDate: "07/01/2025", roleKey: "business", appliedAt: "2025-01-18T08:00:00Z" },
];

const ROLE_CONFIG = {
  student:  { label: "Students",   color: "#10b981", bg: "rgba(16,185,129,0.1)",  Icon: GraduationCap },
  trainer:  { label: "Trainers",   color: "#f59e0b", bg: "rgba(245,158,11,0.1)", Icon: Mic2 },
  admin:    { label: "Admins",     color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", Icon: Shield },
  business: { label: "Businesses", color: "#ef4444", bg: "rgba(239,68,68,0.1)",  Icon: Briefcase },
};

const STATUS_CONFIG = {
  "Completed":   { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
  "In Progress": { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
  "Pending":     { bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af" },
  "Approved":    { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
  "Rejected":    { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
};

const SUB_CONFIG = {
  Free:       { bg: "#f3f4f6", color: "#6b7280" },
  Pro:        { bg: "#ede9fe", color: "#7c3aed" },
  Enterprise: { bg: "#dbeafe", color: "#1d4ed8" },
};

const STEP_DEFS = [
  { num: 1, label: "Basic Info",     Icon: User,       desc: "Personal details" },
  { num: 2, label: "Organization",   Icon: Building2,  desc: "Work & education" },
  { num: 3, label: "Documents",      Icon: ShieldCheck, desc: "Verification" },
  { num: 4, label: "Subscription",   Icon: CreditCard, desc: "Plan & billing" },
  { num: 5, label: "Platform Setup", Icon: Settings,   desc: "Preferences" },
  { num: 6, label: "Final Approval", Icon: BadgeCheck, desc: "Activation" },
];

// ─── SHARED ATOMS ─────────────────────────────────────────────────────────────────

const Avatar = ({ name, color, size = 32 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: color + "22", border: `2px solid ${color}44`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.31, fontWeight: 700, color, flexShrink: 0, letterSpacing: "-0.3px",
  }}>
    {(name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
  </div>
);

const InfoRow = ({ Icon: Ic, label, value, accent }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
    <div style={{ width: 24, height: 24, borderRadius: 6, background: accent + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
      <Ic size={11} color={accent} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 9.5, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", marginTop: 1, wordBreak: "break-word" }}>{value || "—"}</div>
    </div>
  </div>
);

const SectionCard = ({ title, Icon: Ic, color, children }) => (
  <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e8edf3", overflow: "hidden", marginBottom: 9 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 11px", background: color + "07", borderBottom: "1px solid #f1f5f9" }}>
      <div style={{ width: 20, height: 20, borderRadius: 5, background: color + "1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Ic size={10} color={color} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>{title}</span>
    </div>
    <div style={{ padding: "2px 11px 5px" }}>{children}</div>
  </div>
);

// ─── STEP PANELS ──────────────────────────────────────────────────────────────────

const Step1Panel = ({ data, color }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
    <SectionCard title="Personal Details" Icon={User} color={color}>
      <InfoRow Icon={User}     label="Full Name"   value={data.fullName}         accent={color} />
      <InfoRow Icon={Mail}     label="Email"       value={data.email}            accent={color} />
      <InfoRow Icon={Phone}    label="Phone"       value={data.phone}            accent={color} />
      <InfoRow Icon={MapPin}   label="Location"    value={data.location}         accent={color} />
    </SectionCard>
    <SectionCard title="Account Info" Icon={Hash} color={color}>
      <InfoRow Icon={Briefcase} label="Role"       value={data.role}             accent={color} />
      <InfoRow Icon={Calendar}  label="Registered" value={data.registrationDate} accent={color} />
      <InfoRow Icon={Image}     label="Photo"      value="Uploaded"              accent={color} />
      <InfoRow Icon={Calendar}  label="DOB"        value={data.dob}              accent={color} />
    </SectionCard>
  </div>
);

const Step2Panel = ({ data, color }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
    <SectionCard title="Organization" Icon={Building2} color={color}>
      <InfoRow Icon={Building2}  label="Company / Institute" value={data.orgName}    accent={color} />
      <InfoRow Icon={Layers}     label="Department"          value={data.department} accent={color} />
      <InfoRow Icon={Globe}      label="Industry"            value={data.industry}   accent={color} />
      <InfoRow Icon={TrendingUp} label="Experience"          value={data.experience} accent={color} />
    </SectionCard>
    <SectionCard title="Skills & Profile" Icon={Star} color={color}>
      <div style={{ padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ fontSize: 9.5, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Skills</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {data.skills.map(s => <span key={s} style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: color + "15", color }}>{s}</span>)}
        </div>
      </div>
      <InfoRow Icon={Globe} label="LinkedIn" value={data.linkedIn} accent={color} />
    </SectionCard>
  </div>
);

const Step3Panel = ({ data, color }) => {
  const vs = ({ Approved: { bg: "#d1fae5", c: "#065f46" }, "Under Review": { bg: "#fef3c7", c: "#92400e" }, Pending: { bg: "#f3f4f6", c: "#6b7280" } })[data.verificationStatus] || { bg: "#f3f4f6", c: "#6b7280" };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <SectionCard title="Document Status" Icon={ShieldCheck} color={color}>
        <InfoRow Icon={ShieldCheck} label="Aadhaar / ID"  value={data.aadhaarStatus}    accent={color} />
        <InfoRow Icon={FileText}    label="Resume"        value={data.resumeStatus}      accent={color} />
        <InfoRow Icon={Award}       label="Certificates"  value={`${data.certificateCount} uploaded`} accent={color} />
        <div style={{ padding: "7px 0" }}>
          <div style={{ fontSize: 9.5, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Verification</div>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: vs.bg, color: vs.c }}>{data.verificationStatus}</span>
        </div>
      </SectionCard>
      <SectionCard title="Uploaded Docs" Icon={Upload} color={color}>
        {data.uploadedDocs.length > 0
          ? data.uploadedDocs.map((doc, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ width: 20, height: 20, borderRadius: 5, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}><FileText size={10} color={color} /></div>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#334155", flex: 1 }}>{doc}</span>
                <CheckCircle size={11} color="#10b981" />
              </div>
            ))
          : <div style={{ padding: "14px 0", textAlign: "center", color: "#94a3b8", fontSize: 12 }}>No documents uploaded</div>}
      </SectionCard>
    </div>
  );
};

const Step4Panel = ({ data, color }) => {
  const pc = ({ Enterprise: { bg: "#dbeafe", c: "#1d4ed8" }, Pro: { bg: "#ede9fe", c: "#6d28d9" }, Free: { bg: "#f3f4f6", c: "#374151" } })[data.plan] || { bg: "#f3f4f6", c: "#374151" };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <SectionCard title="Plan Details" Icon={CreditCard} color={color}>
        <div style={{ padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: 9.5, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Current Plan</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Crown size={13} color={pc.c} />
            <span style={{ fontSize: 14, fontWeight: 800, color: pc.c }}>{data.plan}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginLeft: "auto" }}>{data.amount}</span>
          </div>
        </div>
        <InfoRow Icon={CheckSquare} label="Payment Status" value={data.paymentStatus} accent={color} />
        <InfoRow Icon={Calendar}    label="Billing Date"   value={data.billingDate}   accent={color} />
      </SectionCard>
      <SectionCard title="Plan Features" Icon={Star} color={color}>
        <div style={{ paddingTop: 4 }}>
          {data.planFeatures.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", borderBottom: "1px solid #f1f5f9" }}>
              <CheckCircle size={10} color="#10b981" />
              <span style={{ fontSize: 11, color: "#334155", fontWeight: 500 }}>{f}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

const Step5Panel = ({ data, color }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
    <SectionCard title="Platform Access" Icon={Settings} color={color}>
      <div style={{ padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ fontSize: 9.5, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Profile Completion</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: "#e2e8f0", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${data.profileCompletion}%`, background: color, borderRadius: 3 }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color }}>{data.profileCompletion}%</span>
        </div>
      </div>
      <InfoRow Icon={CheckCircle} label="Dashboard Access" value={data.dashboardAccess ? "Granted" : "Restricted"} accent={color} />
      <InfoRow Icon={Users}       label="Team Size"        value={data.teamSize}                                    accent={color} />
    </SectionCard>
    <SectionCard title="Permissions" Icon={Lock} color={color}>
      <div style={{ padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ fontSize: 9.5, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Granted Permissions</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {data.permissions.map(p => <span key={p} style={{ fontSize: 9.5, fontWeight: 600, padding: "2px 6px", borderRadius: 20, background: color + "15", color }}>{p}</span>)}
        </div>
      </div>
      <InfoRow Icon={Globe} label="Language"      value={data.language}                        accent={color} />
      <InfoRow Icon={Bell}  label="Notifications" value={data.notifications ? "On" : "Off"} accent={color} />
    </SectionCard>
  </div>
);

const Step6Panel = ({ data, color }) => {
  const ac = ({ Approved: { bg: "#d1fae5", c: "#065f46" }, "Under Review": { bg: "#fef3c7", c: "#92400e" }, Pending: { bg: "#f3f4f6", c: "#6b7280" } })[data.approvalStatus] || { bg: "#f3f4f6", c: "#6b7280" };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <SectionCard title="Approval Details" Icon={BadgeCheck} color={color}>
        <div style={{ padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: 9.5, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Status</div>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: ac.bg, color: ac.c }}>{data.approvalStatus}</span>
        </div>
        <InfoRow Icon={Activity}    label="Account"         value={data.activeStatus ? "Active" : "Inactive"} accent={color} />
        <InfoRow Icon={Calendar}    label="Completion Date" value={data.completionDate}                        accent={color} />
        <InfoRow Icon={CheckSquare} label="Final Review"    value={data.finalReview}                           accent={color} />
      </SectionCard>
      <SectionCard title="Review Notes" Icon={FileText} color={color}>
        <InfoRow Icon={User} label="Reviewed By" value={data.reviewer} accent={color} />
        <div style={{ padding: "7px 0" }}>
          <div style={{ fontSize: 9.5, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Admin Notes</div>
          <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.6, background: "#f8fafc", padding: "7px 9px", borderRadius: 8, border: "1px solid #e2e8f0" }}>{data.adminNotes}</div>
        </div>
      </SectionCard>
    </div>
  );
};

// ─── STEPPER ──────────────────────────────────────────────────────────────────────

const Stepper = ({ currentStep, userStep, color, onStepClick }) => (
  <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", background: "#f8fafc", borderBottom: "1px solid #e8edf3", overflowX: "auto", flexShrink: 0 }}>
    {STEP_DEFS.map((s, i) => {
      const done = s.num <= userStep;
      const active = s.num === currentStep;
      const Ic = s.Icon;
      return (
        <React.Fragment key={s.num}>
          <button onClick={() => onStepClick(s.num)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", background: "none", border: "none", padding: "3px 3px", borderRadius: 8, minWidth: 46 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: active ? color : done ? color + "20" : "#e2e8f0", border: `2px solid ${active ? color : done ? color + "50" : "#e2e8f0"}`, transition: "all 0.2s" }}>
              {done && !active ? <CheckCircle size={12} color={color} /> : <Ic size={11} color={active ? "#fff" : done ? color : "#94a3b8"} />}
            </div>
            <div style={{ fontSize: 8, fontWeight: active ? 700 : 500, color: active ? color : done ? "#475569" : "#94a3b8", textAlign: "center", lineHeight: 1.2, whiteSpace: "nowrap" }}>{s.label}</div>
          </button>
          {i < STEP_DEFS.length - 1 && (
            <div style={{ flex: 1, height: 1.5, minWidth: 4, background: i < userStep - 1 ? color + "40" : "#e2e8f0", margin: "0 1px 12px" }} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── USER VIEW ────────────────────────────────────────────────────────────────────

const UserView = ({ user, onEdit, onDelete, onToggle }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const sd = generateStepData(user, user.roleKey);
  const cfg = ROLE_CONFIG[user.roleKey] || ROLE_CONFIG.student;
  const color = cfg.color;
  const pct = Math.round((user.step / 6) * 100);
  const panels = [Step1Panel, Step2Panel, Step3Panel, Step4Panel, Step5Panel, Step6Panel];
  const Panel = panels[currentStep - 1];
  const panelData = [sd.step1, sd.step2, sd.step3, sd.step4, sd.step5, sd.step6][currentStep - 1];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", background: `linear-gradient(135deg, ${color}f0, ${color}a0)`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Avatar name={user.name} color="rgba(255,255,255,0.95)" size={40} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.72)", marginTop: 1 }}>{user.email} · {user.id}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 9 }}>
          {[user.status, user.subscription, `Step ${user.step}/6`].map(t => (
            <span key={t} style={{ fontSize: 9.5, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: "rgba(255,255,255,0.22)", color: "#fff" }}>{t}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.22)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "rgba(255,255,255,0.88)", borderRadius: 3 }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.92)" }}>{pct}%</span>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {[
            { label: user.active ? "Active" : "Inactive", icon: user.active ? CheckCircle : XCircle, onClick: () => onToggle(user.id), danger: false },
            { label: "Edit",   icon: Pencil, onClick: onEdit,   danger: false },
            { label: "Delete", icon: Trash2, onClick: onDelete, danger: true  },
          ].map(({ label, icon: Ic, onClick, danger }) => (
            <button key={label} onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, background: danger ? "rgba(239,68,68,0.28)" : "rgba(255,255,255,0.18)", border: `1px solid ${danger ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.3)"}`, color: "#fff", fontSize: 10.5, fontWeight: 700, cursor: "pointer" }}>
              <Ic size={11} /> {label}
            </button>
          ))}
        </div>
      </div>

      <Stepper currentStep={currentStep} userStep={user.step} color={color} onStepClick={setCurrentStep} />

      <div style={{ flex: 1, overflowY: "auto", padding: "11px 13px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 9, paddingBottom: 7, borderBottom: "1px solid #f1f5f9" }}>
          {React.createElement(STEP_DEFS[currentStep - 1].Icon, { size: 12, color })}
          <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>Step {currentStep} — {STEP_DEFS[currentStep - 1].label}</span>
          <span style={{ fontSize: 10, color: "#94a3b8" }}>{STEP_DEFS[currentStep - 1].desc}</span>
        </div>
        <Panel data={panelData} color={color} />
      </div>

      <div style={{ padding: "9px 13px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fafafa", flexShrink: 0 }}>
        <button onClick={() => setCurrentStep(s => Math.max(1, s - 1))} disabled={currentStep === 1} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 11px", borderRadius: 7, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 11, fontWeight: 600, cursor: currentStep === 1 ? "not-allowed" : "pointer", opacity: currentStep === 1 ? 0.4 : 1 }}>
          <ChevronLeft size={13} /> Prev
        </button>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>{currentStep} / 6</span>
        <button onClick={() => setCurrentStep(s => Math.min(6, s + 1))} disabled={currentStep === 6} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 11px", borderRadius: 7, border: "none", background: color, color: "#fff", fontSize: 11, fontWeight: 700, cursor: currentStep === 6 ? "not-allowed" : "pointer", opacity: currentStep === 6 ? 0.5 : 1 }}>
          Next <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

// ─── USER FORM ────────────────────────────────────────────────────────────────────

const UserForm = ({ user, onSave, onCancel }) => {
  const isEdit = !!user;
  const [form, setForm] = useState({
    name:         user?.name         || "",
    email:        user?.email        || "",
    status:       user?.status       || "Pending",
    subscription: user?.subscription || "Free",
    active:       user?.active       ?? true,
    roleKey:      user?.roleKey      || "student",
    role:         user?.role         || "Student",
  });

  const cfg = ROLE_CONFIG[form.roleKey] || ROLE_CONFIG.student;
  const color = cfg.color;
  const ss = STATUS_CONFIG[form.status] || STATUS_CONFIG.Pending;
  const sub = SUB_CONFIG[form.subscription] || SUB_CONFIG.Free;

  const inputStyle = (c) => ({
    width: "100%", padding: "9px 11px", borderRadius: 9,
    border: `1.5px solid ${c}30`, fontSize: 13,
    outline: "none", color: "#1e293b", background: c + "06",
    boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "15px 16px", background: `linear-gradient(135deg, ${color}f0, ${color}a0)`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isEdit ? <Pencil size={17} color="#fff" /> : <Plus size={17} color="#fff" />}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{isEdit ? "Edit User" : "Add New User"}</div>
            {isEdit && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>ID: {user.id}</div>}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "15px 15px 6px" }}>
        {!isEdit && (
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 7 }}>User Type</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {Object.entries(ROLE_CONFIG).map(([key, rc]) => (
                <button key={key} onClick={() => setForm(f => ({ ...f, roleKey: key, role: rc.label.slice(0, -1) }))}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 9px", borderRadius: 9, border: `2px solid ${form.roleKey === key ? rc.color : "#e2e8f0"}`, background: form.roleKey === key ? rc.color + "0d" : "#fff", cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: rc.color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {React.createElement(rc.Icon, { size: 10, color: rc.color })}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: form.roleKey === key ? rc.color : "#475569" }}>{rc.label.slice(0, -1)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {[
          { label: "Full Name",     key: "name",  type: "text",  placeholder: "Enter full name..." },
          { label: "Email Address", key: "email", type: "email", placeholder: "Enter email address..." },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key} style={{ marginBottom: 13 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>{label}</label>
            <input type={type} value={form[key]} placeholder={placeholder}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              style={inputStyle(color)}
              onFocus={e => { e.target.style.borderColor = color; e.target.style.background = color + "0d"; }}
              onBlur={e => { e.target.style.borderColor = color + "30"; e.target.style.background = color + "06"; }}
            />
          </div>
        ))}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 13 }}>
          {[
            { label: "Status", key: "status",       opts: ["Pending", "In Progress", "Completed"] },
            { label: "Plan",   key: "subscription", opts: ["Free", "Pro", "Enterprise"] },
          ].map(({ label, key, opts }) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>{label}</label>
              <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={{ width: "100%", padding: "8px 9px", borderRadius: 9, border: `1.5px solid ${color}30`, fontSize: 12, background: color + "06", color: "#1e293b", outline: "none", fontFamily: "inherit" }}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Account Status</label>
          <button onClick={() => setForm(f => ({ ...f, active: !f.active }))}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 9, border: `1.5px solid ${form.active ? "#10b98150" : "#e2e8f0"}`, background: form.active ? "#d1fae5" : "#f9fafb", color: form.active ? "#065f46" : "#6b7280", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
            {form.active ? <CheckCircle size={13} /> : <XCircle size={13} />} {form.active ? "Active" : "Inactive"}
          </button>
        </div>

        <div style={{ background: color + "0a", border: `1px solid ${color}25`, borderRadius: 11, padding: "11px 12px" }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Preview</div>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Avatar name={form.name || "New User"} color={color} size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{form.name || "Name not set"}</div>
              <div style={{ fontSize: 10.5, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{form.email || "email@example.com"}</div>
              <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                <span style={{ fontSize: 9.5, fontWeight: 600, padding: "1px 6px", borderRadius: 20, background: ss.bg, color: ss.color }}>{form.status}</span>
                <span style={{ fontSize: 9.5, fontWeight: 600, padding: "1px 6px", borderRadius: 20, background: sub.bg, color: sub.color }}>{form.subscription}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "11px 15px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 8, background: "#fafafa", flexShrink: 0 }}>
        <button onClick={onCancel} style={{ flex: 1, padding: "9px", borderRadius: 9, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
        <button onClick={() => onSave(form)} style={{ flex: 2, padding: "9px", borderRadius: 9, border: "none", background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          {isEdit ? "Save Changes" : "Add User"}
        </button>
      </div>
    </div>
  );
};

// ─── PENDING APPROVALS PANEL ──────────────────────────────────────────────────────

const ApprovalPanel = ({ user, onApprove, onReject, onViewFull, onClose }) => {
  const cfg = ROLE_CONFIG[user.roleKey] || ROLE_CONFIG.student;
  const color = cfg.color;
  const sd = generateStepData(user, user.roleKey);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Hero */}
      <div style={{ padding: "14px 16px", background: `linear-gradient(135deg, ${color}f0, ${color}a0)`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Avatar name={user.name} color="rgba(255,255,255,0.95)" size={40} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.72)", marginTop: 1 }}>{user.email} · {user.id}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
          {[user.role, user.subscription, `Step ${user.step}/6`, "Awaiting Approval"].map(t => (
            <span key={t} style={{ fontSize: 9.5, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: "rgba(255,255,255,0.22)", color: "#fff" }}>{t}</span>
          ))}
        </div>
        {/* Approve / Reject CTA */}
        <div style={{ display: "flex", gap: 7 }}>
          <button onClick={() => onReject(user.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px", borderRadius: 8, background: "rgba(239,68,68,0.22)", border: "1px solid rgba(239,68,68,0.45)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            <ThumbsDown size={13} /> Reject
          </button>
          <button onClick={() => onApprove(user.id)} style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px", borderRadius: 8, background: "rgba(16,185,129,0.28)", border: "1px solid rgba(16,185,129,0.45)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            <ThumbsUp size={13} /> Approve & Activate
          </button>
        </div>
      </div>

      {/* Quick info */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 13px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 9 }}>Application Summary</div>

        <SectionCard title="Personal Info" Icon={User} color={color}>
          <InfoRow Icon={User}     label="Full Name"  value={sd.step1.fullName}  accent={color} />
          <InfoRow Icon={Mail}     label="Email"      value={sd.step1.email}     accent={color} />
          <InfoRow Icon={Phone}    label="Phone"      value={sd.step1.phone}     accent={color} />
          <InfoRow Icon={MapPin}   label="Location"   value={sd.step1.location}  accent={color} />
        </SectionCard>

        <SectionCard title="Organization" Icon={Building2} color={color}>
          <InfoRow Icon={Building2}  label="Company / Institute" value={sd.step2.orgName}    accent={color} />
          <InfoRow Icon={Globe}      label="Industry"            value={sd.step2.industry}   accent={color} />
          <InfoRow Icon={TrendingUp} label="Experience"          value={sd.step2.experience} accent={color} />
        </SectionCard>

        <SectionCard title="Documents" Icon={ShieldCheck} color={color}>
          <InfoRow Icon={ShieldCheck} label="Aadhaar / ID" value={sd.step3.aadhaarStatus}               accent={color} />
          <InfoRow Icon={FileText}    label="Resume"       value={sd.step3.resumeStatus}                accent={color} />
          <InfoRow Icon={Award}       label="Certificates" value={`${sd.step3.certificateCount} uploaded`} accent={color} />
        </SectionCard>

        <SectionCard title="Subscription" Icon={CreditCard} color={color}>
          <InfoRow Icon={Crown}      label="Plan"    value={sd.step4.plan}   accent={color} />
          <InfoRow Icon={Calendar}   label="Applied" value={user.joinDate}   accent={color} />
        </SectionCard>

        {/* View full profile button */}
        <button onClick={onViewFull} style={{ width: "100%", padding: "9px", borderRadius: 9, border: `1.5px solid ${color}30`, background: color + "0a", color, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 4 }}>
          <Eye size={13} /> View Full Profile
        </button>
      </div>

      <div style={{ padding: "9px 13px", borderTop: "1px solid #f1f5f9", background: "#fafafa", flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: "#94a3b8", textAlign: "center" }}>
          Applied {user.appliedAt ? new Date(user.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : user.joinDate}
        </div>
      </div>
    </div>
  );
};

// ─── RIGHT PANEL ──────────────────────────────────────────────────────────────────

const RightPanel = ({ visible, width, onClose, onDragStart, title, children }) => (
  <div style={{
    width, flexShrink: 0, height: "100vh",
    transform: visible ? "translateX(0)" : "translateX(105%)",
    transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.28s ease",
    background: "#fff", borderLeft: "1px solid #e2e8f0",
    display: "flex", flexDirection: "column",
    position: "relative", overflow: "hidden",
    boxShadow: visible ? "-10px 0 40px rgba(0,0,0,0.12)" : "none",
  }}>
    <div
      onMouseDown={onDragStart}
      style={{ position: "absolute", left: 0, top: 0, width: 7, height: "100%", cursor: "col-resize", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center" }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.12)"; e.currentTarget.querySelector("div").style.background = "#6366f1"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.querySelector("div").style.background = "#d1d5db"; }}
    >
      <div style={{ width: 3, height: 44, borderRadius: 4, background: "#d1d5db", transition: "background 0.2s" }} />
    </div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 13px 9px 20px", borderBottom: "1px solid #f1f5f9", background: "#fafafa", flexShrink: 0, zIndex: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <GripVertical size={13} color="#c0cad8" />
        <span style={{ fontSize: 11.5, fontWeight: 700, color: "#374151" }}>{title}</span>
      </div>
      <button onClick={onClose} style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <X size={12} color="#64748b" />
      </button>
    </div>
    <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {children}
    </div>
  </div>
);

// ─── DELETE CONFIRM ───────────────────────────────────────────────────────────────

const DeleteOverlay = ({ user, onConfirm, onCancel }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ background: "#fff", borderRadius: 16, padding: 22, maxWidth: 300, width: "90%", boxShadow: "0 24px 60px rgba(0,0,0,0.22)" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
          <Trash2 size={20} color="#dc2626" />
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>Delete User?</div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, lineHeight: 1.5 }}>
          Permanently delete <strong>{user?.name}</strong>? This cannot be undone.
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onCancel} style={{ flex: 1, padding: "8px", borderRadius: 9, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
        <button onClick={onConfirm} style={{ flex: 1, padding: "8px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
      </div>
    </div>
  </div>
);

// ─── PENDING APPROVALS TAB CONTENT ───────────────────────────────────────────────

const PendingApprovalsTab = ({ users, onApprove, onReject, onOpenApproval, activeUserId, panelOpen }) => {
  const [filterRole, setFilterRole] = useState("All");
  const pending = users.filter(u => u.status === "Pending" && !u.approvalResolved);

  const filtered = pending.filter(u =>
    filterRole === "All" || u.role === filterRole
  );

  const sel = { padding: "5px 9px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 11.5, color: "#374151", cursor: "pointer", outline: "none", fontFamily: "inherit" };

  if (pending.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <CheckCircle size={26} color="#10b981" />
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>All caught up!</div>
        <div style={{ fontSize: 12, color: "#64748b" }}>No pending approvals at this time.</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px 18px" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ClipboardList size={13} color="#d97706" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Pending Approvals</div>
            <div style={{ fontSize: 10.5, color: "#64748b" }}>{filtered.length} application{filtered.length !== 1 ? "s" : ""} awaiting review</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Filter size={11} color="#94a3b8" />
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} style={sel}>
            {["All", "Student", "Trainer", "Admin", "Business"].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Role breakdown mini-stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
        {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
          const cnt = pending.filter(u => u.roleKey === key).length;
          return (
            <div key={key} onClick={() => setFilterRole(filterRole === cfg.label.slice(0,-1) ? "All" : cfg.label.slice(0,-1))}
              style={{ background: filterRole === cfg.label.slice(0,-1) ? cfg.color + "15" : "#f8fafc", border: `1.5px solid ${filterRole === cfg.label.slice(0,-1) ? cfg.color + "50" : "#e5e7eb"}`, borderRadius: 10, padding: "9px 11px", cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, background: cfg.color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {React.createElement(cfg.Icon, { size: 9, color: cfg.color })}
                </div>
                <span style={{ fontSize: 9.5, fontWeight: 600, color: "#64748b" }}>{cfg.label}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: cnt > 0 ? cfg.color : "#cbd5e1", letterSpacing: "-0.5px" }}>{cnt}</div>
            </div>
          );
        })}
      </div>

      {/* Cards list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {filtered.length === 0 && (
          <div style={{ padding: "20px", textAlign: "center", color: "#94a3b8", fontSize: 12, background: "#f8fafc", borderRadius: 10, border: "1px dashed #e2e8f0" }}>
            No {filterRole !== "All" ? filterRole.toLowerCase() : ""} applications pending.
          </div>
        )}
        {filtered.map(user => {
          const cfg = ROLE_CONFIG[user.roleKey] || ROLE_CONFIG.student;
          const isActive = activeUserId === user.id && panelOpen;
          return (
            <div key={user.id}
              style={{ background: isActive ? cfg.color + "08" : "#fff", border: `1.5px solid ${isActive ? cfg.color + "40" : "#e5e7eb"}`, borderRadius: 12, padding: "13px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "all 0.15s", boxShadow: isActive ? `0 0 0 3px ${cfg.color}15` : "0 1px 3px rgba(0,0,0,0.04)" }}
              onClick={() => onOpenApproval(user)}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f9fafb"; }}
              onMouseLeave={e => { e.currentTarget.style.background = isActive ? cfg.color + "08" : "#fff"; }}
            >
              {/* Avatar */}
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg, ${cfg.color}80, ${cfg.color}50)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0, letterSpacing: "-0.5px" }}>
                {(user.name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{user.name}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: cfg.bg, color: cfg.color, display: "inline-flex", alignItems: "center", gap: 3 }}>
                    {React.createElement(cfg.Icon, { size: 9 })} {user.role}
                  </span>
                  <span style={{ fontSize: 9.5, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: "#fef3c7", color: "#92400e" }}>Pending</span>
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{user.email}</div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
                  Applied: {user.appliedAt ? new Date(user.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : user.joinDate}
                  {" · "}{user.subscription} plan
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => onReject(user.id)}
                  style={{ padding: "6px 11px", borderRadius: 8, border: "1.5px solid #fca5a5", background: "#fff", color: "#dc2626", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  <XCircle size={11} /> Reject
                </button>
                <button onClick={() => onApprove(user.id)}
                  style={{ padding: "6px 11px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#059669"}
                  onMouseLeave={e => e.currentTarget.style.background = "#10b981"}
                >
                  <CheckCircle size={11} /> Approve
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── MAIN ──────────────────────────────────────────────────────────────────────────

export default function OnboardingManagement() {
  const [users, setUsers] = useState(ALL_USERS);
  const [activeTab, setActiveTab] = useState("onboarding"); // 'onboarding' | 'approvals'

  // Onboarding tab state
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All Roles");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterSub, setFilterSub] = useState("All Plans");
  const [filterActive, setFilterActive] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Panel state
  const [panelMode, setPanelMode] = useState(null); // 'view' | 'edit' | 'add' | 'approval'
  const [activeUser, setActiveUser] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelWidth, setPanelWidth] = useState(480);
  const [deleteUser, setDeleteUser] = useState(null);

  // ── Drag-to-resize ──────────────────────────────────────────────────────────────
  const dragRef = useRef({ dragging: false, startX: 0, startW: 0 });

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.dragging) return;
      const delta = dragRef.current.startX - e.clientX;
      setPanelWidth(Math.max(360, Math.min(760, dragRef.current.startW + delta)));
    };
    const onUp = () => {
      if (dragRef.current.dragging) {
        dragRef.current.dragging = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  const onDragStart = (e) => {
    e.preventDefault();
    dragRef.current = { dragging: true, startX: e.clientX, startW: panelWidth };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  // ── Panel helpers ───────────────────────────────────────────────────────────────
  const openPanel = (mode, user = null) => {
    setActiveUser(user);
    setPanelMode(mode);
    if (!panelOpen) {
      setPanelOpen(true);
      setTimeout(() => setPanelVisible(true), 10);
    } else {
      setPanelMode(mode);
      setActiveUser(user);
    }
  };

  const closePanel = () => {
    setPanelVisible(false);
    setTimeout(() => { setPanelOpen(false); setPanelMode(null); setActiveUser(null); }, 300);
  };

  const panelTitle =
    panelMode === "view"     ? "User Details"         :
    panelMode === "edit"     ? "Edit User"             :
    panelMode === "add"      ? "Add New User"          :
    panelMode === "approval" ? "Approval Review"       : "";

  // ── Approval handlers ───────────────────────────────────────────────────────────
  const handleApprove = (id) => {
    setUsers(prev => prev.map(u => u.id === id
      ? { ...u, status: "Completed", step: 6, active: true, approvalResolved: true }
      : u
    ));
    if (activeUser?.id === id) {
      setActiveUser(v => v ? { ...v, status: "Completed", step: 6, active: true, approvalResolved: true } : v);
      // Switch panel to view after approving
      setTimeout(() => setPanelMode("view"), 200);
    }
  };

  const handleReject = (id) => {
    setUsers(prev => prev.map(u => u.id === id
      ? { ...u, status: "Pending", active: false, approvalResolved: true, rejectedAt: new Date().toISOString() }
      : u
    ));
    if (activeUser?.id === id) closePanel();
  };

  // ── Stats ───────────────────────────────────────────────────────────────────────
  const total       = users.length;
  const completed   = users.filter(u => u.status === "Completed").length;
  const inProgress  = users.filter(u => u.status === "In Progress").length;
  const pending     = users.filter(u => u.status === "Pending").length;
  const pendingApprovals = users.filter(u => u.status === "Pending" && !u.approvalResolved);
  const overallPct  = Math.round((completed / total) * 100);

  // ── Filters ─────────────────────────────────────────────────────────────────────
  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (
      (!search || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q)) &&
      (filterRole   === "All Roles"  || u.role === filterRole) &&
      (filterStatus === "All Status" || u.status === filterStatus) &&
      (filterSub    === "All Plans"  || u.subscription === filterSub) &&
      (filterActive === "All"        || (filterActive === "Active" ? u.active : !u.active))
    );
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  // ── Other handlers ──────────────────────────────────────────────────────────────
  const handleSave = (form) => {
    setUsers(prev => prev.map(u => u.id === activeUser?.id ? { ...u, ...form } : u));
    setActiveUser(prev => prev ? { ...prev, ...form } : prev);
    setPanelMode("view");
  };

  const handleAdd = (form) => {
    const rk = form.roleKey || "student";
    const prefix = { student: "STU", trainer: "TRN", admin: "ADM", business: "BIZ" }[rk] || "USR";
    const count = users.filter(u => u.roleKey === rk).length + 1;
    const newUser = { ...form, id: `${prefix}${String(count).padStart(3, "0")}`, step: 1, joinDate: new Date().toLocaleDateString("en-GB"), time: "Just now", appliedAt: new Date().toISOString() };
    setUsers(prev => [newUser, ...prev]);
    closePanel();
  };

  const handleDelete = () => {
    setUsers(prev => prev.filter(u => u.id !== deleteUser?.id));
    if (activeUser?.id === deleteUser?.id) closePanel();
    setDeleteUser(null);
  };

  const handleToggle = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
    if (activeUser?.id === id) setActiveUser(v => v ? { ...v, active: !v.active } : v);
  };

  const sel = { padding: "6px 9px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 11.5, color: "#374151", cursor: "pointer", outline: "none", fontFamily: "inherit" };
  const liveUser = activeUser ? (users.find(u => u.id === activeUser.id) || activeUser) : null;

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif", background: "#f1f5f9", height: "100vh", display: "flex", overflow: "hidden" }}>
      <style>{`* { box-sizing: border-box; margin: 0; } ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; } button { font-family: inherit; }`}</style>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", minWidth: 0, transition: "all 0.28s ease" }}>
        <div style={{ padding: "20px 22px" }}>

          {/* Page Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <h1 style={{ fontSize: 19, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" }}>Onboarding Management</h1>
              <p style={{ fontSize: 12.5, color: "#64748b", marginTop: 3 }}>Track and manage user onboarding across all roles and stages.</p>
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 9, border: "1px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                <Download size={13} /> Export
              </button>
              <button onClick={() => openPanel("add")} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(99,102,241,0.35)" }}>
                <Plus size={13} /> Add User
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 11, marginBottom: 14 }}>
            {[
              { label: "Total Onboarded", val: total,      Icon: Users,       color: "#6366f1", bg: "#eef2ff", light: "#e0e7ff" },
              { label: "Completed",       val: completed,  Icon: CheckCircle, color: "#10b981", bg: "#ecfdf5", light: "#d1fae5" },
              { label: "In Progress",     val: inProgress, Icon: Clock,       color: "#f59e0b", bg: "#fffbeb", light: "#fef3c7" },
              { label: "Pending",         val: pending,    Icon: AlertCircle, color: "#ef4444", bg: "#fff5f5", light: "#fee2e2" },
            ].map(({ label, val, Icon: Ic, color, bg, light }) => (
              <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "13px 15px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", right: -8, top: -8, width: 56, height: 56, borderRadius: "50%", background: light, opacity: 0.6 }} />
                <div style={{ width: 32, height: 32, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, position: "relative" }}>
                  <Ic size={15} color={color} />
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>{val}</div>
                <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>{label}</div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: color + "30" }}>
                  <div style={{ height: "100%", width: `${Math.round((val / total) * 100)}%`, background: color, borderRadius: "0 2px 0 0" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Completion Rate */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "12px 16px", border: "1px solid #e5e7eb", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <TrendingUp size={13} color="#6366f1" />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#374151" }}>Overall Completion Rate</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#6366f1" }}>{overallPct}%</span>
            </div>
            <div style={{ height: 7, borderRadius: 4, background: "#e2e8f0", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${overallPct}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: 4, transition: "width 0.7s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 9.5, color: "#94a3b8" }}>
              {["0%","25%","50%","75%","100%"].map(l => <span key={l}>{l}</span>)}
            </div>
          </div>

          {/* Role Breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 11, marginBottom: 18 }}>
            {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
              const ru = users.filter(u => u.roleKey === key);
              const Ic = cfg.Icon;
              return (
                <div key={key} style={{ background: "#fff", borderRadius: 12, padding: "11px 13px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 9 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: cfg.color + "1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Ic size={11} color={cfg.color} />
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: "#374151" }}>{cfg.label}</span>
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: cfg.color, marginLeft: "auto" }}>{ru.length}</span>
                  </div>
                  {[
                    { l: "Done",    cnt: ru.filter(u => u.status === "Completed").length },
                    { l: "Active",  cnt: ru.filter(u => u.status === "In Progress").length },
                    { l: "Pending", cnt: ru.filter(u => u.status === "Pending").length },
                  ].map(({ l, cnt }) => {
                    const p = ru.length ? Math.round((cnt / ru.length) * 100) : 0;
                    return (
                      <div key={l} style={{ marginBottom: 5 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1.5 }}>
                          <span style={{ fontSize: 9, color: "#94a3b8" }}>{l}</span>
                          <span style={{ fontSize: 9, fontWeight: 700, color: cfg.color }}>{p}%</span>
                        </div>
                        <div style={{ height: 3, borderRadius: 2, background: "#f1f5f9", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${p}%`, background: cfg.color, borderRadius: 2 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {/* Distribution card */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "11px 13px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 9 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <PieChart size={11} color="#6366f1" />
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#374151" }}>Share</span>
              </div>
              {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
                const cnt = users.filter(u => u.roleKey === key).length;
                const p = Math.round((cnt / total) * 100);
                return (
                  <div key={key} style={{ marginBottom: 5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1.5 }}>
                      <span style={{ fontSize: 9, color: "#94a3b8" }}>{cfg.label}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: cfg.color }}>{p}%</span>
                    </div>
                    <div style={{ height: 3, borderRadius: 2, background: "#f1f5f9", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${p}%`, background: cfg.color, borderRadius: 2 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── TABS ───────────────────────────────────────────────────────────────── */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>

            {/* Tab Bar */}
            <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #f1f5f9", padding: "0 15px", background: "#fafafa" }}>
              {[
                { key: "onboarding", label: "All Users",          Icon: Users,        badge: null },
                { key: "approvals",  label: "Pending Approvals",  Icon: ClipboardList, badge: pendingApprovals.length },
              ].map(({ key, label, Icon: Ic, badge }) => {
                const active = activeTab === key;
                return (
                  <button key={key} onClick={() => { setActiveTab(key); if (panelOpen && panelMode === "approval" && key === "onboarding") closePanel(); }}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 14px", background: "none", border: "none", borderBottom: `2.5px solid ${active ? "#6366f1" : "transparent"}`, color: active ? "#6366f1" : "#64748b", fontSize: 12.5, fontWeight: active ? 700 : 600, cursor: "pointer", marginBottom: -1, transition: "all 0.15s" }}>
                    <Ic size={13} />
                    {label}
                    {badge > 0 && (
                      <span style={{ fontSize: 9.5, fontWeight: 800, padding: "1px 6px", borderRadius: 20, background: active ? "#6366f1" : "#fef3c7", color: active ? "#fff" : "#d97706", minWidth: 18, textAlign: "center" }}>
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── ONBOARDING TAB ──────────────────────────────────────────────────── */}
            {activeTab === "onboarding" && (
              <>
                {/* Toolbar */}
                <div style={{ padding: "11px 15px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 180, border: "1px solid #e2e8f0", borderRadius: 8, padding: "5px 9px", background: "#f9fafb" }}>
                    <Search size={12} color="#94a3b8" />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, email, ID…" style={{ border: "none", background: "transparent", fontSize: 12, color: "#374151", outline: "none", width: "100%", fontFamily: "inherit" }} />
                    {search && <button onClick={() => setSearch("")} style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8", lineHeight: 0 }}><X size={12} /></button>}
                  </div>
                  {[
                    [filterRole,   setFilterRole,   ["All Roles",  "Student","Trainer","Admin","Business"]],
                    [filterStatus, setFilterStatus, ["All Status", "Completed","In Progress","Pending"]],
                    [filterSub,    setFilterSub,    ["All Plans",  "Free","Pro","Enterprise"]],
                    [filterActive, setFilterActive, ["All",        "Active","Inactive"]],
                  ].map(([val, set, opts], i) => (
                    <select key={i} value={val} onChange={e => { set(e.target.value); setPage(1); }} style={sel}>
                      {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ))}
                  <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: "auto", whiteSpace: "nowrap" }}>{filtered.length} results</span>
                </div>

                {/* Table */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ background: "#f8fafc" }}>
                        {["#","Name","Role","Status","Progress","Details","Join Date","Plan","Active","Actions"].map(h => (
                          <th key={h} style={{ padding: "8px 11px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paged.length === 0 && (
                        <tr><td colSpan={10} style={{ padding: "30px", textAlign: "center", color: "#9ca3af", fontSize: 12 }}>No users match your filters.</td></tr>
                      )}
                      {paged.map((user, idx) => {
                        const cfg = ROLE_CONFIG[user.roleKey] || ROLE_CONFIG.student;
                        const ss  = STATUS_CONFIG[user.status] || STATUS_CONFIG.Pending;
                        const sub = SUB_CONFIG[user.subscription] || SUB_CONFIG.Free;
                        const isActive = activeUser?.id === user.id && panelOpen;
                        return (
                          <tr key={user.id}
                            style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer", background: isActive ? cfg.color + "0a" : "transparent", transition: "background 0.1s", outline: isActive ? `2px solid ${cfg.color}30` : "none" }}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f9fafb"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = isActive ? cfg.color + "0a" : "transparent"; }}
                            onClick={() => openPanel("view", user)}>
                            <td style={{ padding: "9px 11px", color: "#94a3b8", fontSize: 11 }}>{(page - 1) * perPage + idx + 1}</td>
                            <td style={{ padding: "9px 11px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                <Avatar name={user.name} color={cfg.color} size={26} />
                                <div>
                                  <div style={{ fontWeight: 600, color: "#111827", fontSize: 12 }}>{user.name}</div>
                                  <div style={{ fontSize: 10, color: "#94a3b8" }}>{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "9px 11px" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: cfg.bg, color: cfg.color }}>
                                {React.createElement(cfg.Icon, { size: 9 })} {user.role}
                              </span>
                            </td>
                            <td style={{ padding: "9px 11px" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: ss.bg, color: ss.color }}>
                                <span style={{ width: 4, height: 4, borderRadius: "50%", background: ss.dot, display: "inline-block" }} />
                                {user.status}
                              </span>
                            </td>
                            <td style={{ padding: "9px 11px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <div style={{ height: 3, width: 48, borderRadius: 2, background: "#f1f5f9", overflow: "hidden" }}>
                                  <div style={{ height: "100%", width: `${(user.step / 6) * 100}%`, background: cfg.color, borderRadius: 2 }} />
                                </div>
                                <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>{user.step}/6</span>
                              </div>
                            </td>
                            <td style={{ padding: "9px 11px", color: "#6b7280", fontSize: 11 }}>{user.learning || user.expertise || user.org || user.type || "—"}</td>
                            <td style={{ padding: "9px 11px", color: "#6b7280", fontSize: 11 }}>{user.joinDate}</td>
                            <td style={{ padding: "9px 11px" }}>
                              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: sub.bg, color: sub.color }}>{user.subscription}</span>
                            </td>
                            <td style={{ padding: "9px 11px" }} onClick={e => e.stopPropagation()}>
                              <button onClick={() => handleToggle(user.id)} style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "3px 7px", borderRadius: 20, border: `1.5px solid ${user.active ? "#10b98145" : "#e2e8f0"}`, background: user.active ? "#d1fae5" : "#f9fafb", color: user.active ? "#065f46" : "#9ca3af", fontSize: 9.5, fontWeight: 700, cursor: "pointer" }}>
                                {user.active ? <CheckCircle size={9} /> : <XCircle size={9} />} {user.active ? "Active" : "Off"}
                              </button>
                            </td>
                            <td style={{ padding: "9px 11px" }} onClick={e => e.stopPropagation()}>
                              <div style={{ display: "flex", gap: 3 }}>
                                {[
                                  { label: "View", ic: Eye,    onClick: () => openPanel("view", user),     borderC: "#dbeafe", hoverBg: "#dbeafe", textC: "#2563eb", showLabel: true },
                                  { label: "Edit", ic: Pencil, onClick: () => openPanel("edit", user),     borderC: "#ffedd5", hoverBg: "#ffedd5", textC: "#ea580c", showLabel: false },
                                  { label: "Del",  ic: Trash2, onClick: () => setDeleteUser(user),         borderC: "#fee2e2", hoverBg: "#fee2e2", textC: "#dc2626", showLabel: false },
                                ].map(({ label, ic: Ic2, onClick, borderC, hoverBg, textC, showLabel }) => (
                                  <button key={label} onClick={onClick}
                                    style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: showLabel ? "3px 7px" : "0", width: showLabel ? "auto" : 22, height: 22, borderRadius: 6, border: `1px solid ${borderC}`, background: "transparent", color: textC, fontSize: 10, fontWeight: 700, cursor: "pointer", justifyContent: "center" }}
                                    onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                    <Ic2 size={10} /> {showLabel && label}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div style={{ padding: "10px 15px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "#6b7280" }}>
                    {filtered.length === 0 ? "No results" : `${Math.min((page - 1) * perPage + 1, filtered.length)}–${Math.min(page * perPage, filtered.length)} of ${filtered.length}`}
                  </span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "3px 9px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: 11, fontWeight: 600, cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1 }}>← Prev</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setPage(p)} style={{ width: 24, height: 24, borderRadius: 6, border: "none", background: p === page ? "#6366f1" : "#f9fafb", color: p === page ? "#fff" : "#374151", fontSize: 11, fontWeight: p === page ? 700 : 500, cursor: "pointer" }}>{p}</button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "3px 9px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: 11, fontWeight: 600, cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1 }}>Next →</button>
                  </div>
                </div>
              </>
            )}

            {/* ── APPROVALS TAB ────────────────────────────────────────────────────── */}
            {activeTab === "approvals" && (
              <PendingApprovalsTab
                users={users}
                onApprove={handleApprove}
                onReject={handleReject}
                onOpenApproval={(user) => openPanel("approval", user)}
                activeUserId={activeUser?.id}
                panelOpen={panelOpen}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT SLIDING PANEL ──────────────────────────────────────────────────── */}
      {panelOpen && (
        <RightPanel visible={panelVisible} width={panelWidth} onClose={closePanel} onDragStart={onDragStart} title={panelTitle}>
          {panelMode === "view" && liveUser && (
            <UserView
              user={liveUser}
              onEdit={() => setPanelMode("edit")}
              onDelete={() => { closePanel(); setTimeout(() => setDeleteUser(liveUser), 310); }}
              onToggle={handleToggle}
            />
          )}
          {panelMode === "edit" && liveUser && (
            <UserForm user={liveUser} onSave={handleSave} onCancel={() => setPanelMode("view")} />
          )}
          {panelMode === "add" && (
            <UserForm user={null} onSave={handleAdd} onCancel={closePanel} />
          )}
          {panelMode === "approval" && liveUser && (
            <ApprovalPanel
              user={liveUser}
              onApprove={handleApprove}
              onReject={handleReject}
              onViewFull={() => setPanelMode("view")}
              onClose={closePanel}
            />
          )}
        </RightPanel>
      )}

      {/* ── DELETE OVERLAY ──────────────────────────────────────────────────────── */}
      {deleteUser && <DeleteOverlay user={deleteUser} onConfirm={handleDelete} onCancel={() => setDeleteUser(null)} />}
    </div>
  );
}