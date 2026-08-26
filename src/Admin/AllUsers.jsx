import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  GripVertical,
  Mail,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  UserCheck,
  GraduationCap,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";
import authService from "../services/authService";

// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page must not
// redeclare tokens or components that already live there (see
// AdminDashboard.jsx / AllCourses.jsx, the Golden Reference, which this
// page now visually matches). The page's previous bespoke inline theme
// token map and hardcoded Google-Fonts family have been removed in favor
// of the shared tokens below.
import {
  T,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  RADIUS,
  CARD_PADDING,
  ACCENT_PURPLE,
  PageContainer,
  Hero,
  StatCard,
} from "@/design-system";

const GRAD_COLORS = [
  ["#a78bfa", "#7c3aed"],
  ["#22d3ee", "#0891b2"],
  ["#f43f5e", "#be123c"],
  ["#f59e0b", "#b45309"],
  ["#34d399", "#059669"],
  ["#818cf8", "#4338ca"],
];
const gradColor = (name) =>
  GRAD_COLORS[(name?.charCodeAt(0) ?? 0) % GRAD_COLORS.length];

const ROLE_CFG = {
  ROLE_ADMIN: { label: "Admin", color: "#f43f5e" },
  ROLE_TRAINER: { label: "Trainer", color: "#22d3ee" },
  ROLE_STUDENT: { label: "Student", color: "#94a3b8" },
};
// Maps user-service mirror role format ("ROLE_STUDENT") to the
// auth-service Role enum format ("STUDENT") expected by adminUpdateUserByEmail.
const ROLE_TO_AUTH_ROLE = {
  ROLE_STUDENT: "STUDENT",
  ROLE_TRAINER: "TRAINER",
};

const AllUsers = () => {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"),
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark",
      ),
    );
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limitError, setLimitError] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    roles: "ROLE_STUDENT",
  });
  const [roleDropOpen, setRoleDropOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── PASSWORD STRENGTH ────────────────────────────────────────────────────
  const getPasswordStrength = (pw) => {
    if (!pw) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 2) return { score, label: "Weak", color: "#f43f5e" };
    if (score <= 4) return { score, label: "Fair", color: "#f59e0b" };
    if (score === 5) return { score, label: "Good", color: "#22d3ee" };
    return { score, label: "Strong", color: "#34d399" };
  };
  const pwStrength = getPasswordStrength(formData.password);
  // ─────────────────────────────────────────────────────────────────────────

  // ── PROFILE PANEL STATE (ADDED) ──────────────────────────────────────────
  const [profilePanelUser, setProfilePanelUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  // ─────────────────────────────────────────────────────────────────────────

  const loggedInUser = JSON.parse(localStorage.getItem("lms_user") || "null");
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const role = localStorage.getItem("role");
      if (role === "TENANT_ADMIN") {
        const currentUser = JSON.parse(
          localStorage.getItem("lms_user") || "null",
        );
        const orgId = currentUser?.organizationId || null;
        if (orgId) {
          // const data = await userService.getUsersByOrg(orgId);
          // setUsers(Array.isArray(data) ? data : []);
          const data = await userService.getUsersByOrg(orgId);
          const filtered = Array.isArray(data)
            ? data.filter(
                (u) => u.roles === "ROLE_STUDENT" || u.roles === "ROLE_TRAINER",
              )
            : [];
          setUsers(filtered);
        } else {
          setUsers([]);
        }
      } else {
        const res = await userService.getUsers(0, 50);
        setUsers(res.data.content);
      }
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await userService.deleteUser(id);
      setUsers((p) => p.filter((u) => u.id !== id));
    } catch {
      alert("Failed to delete user");
    }
  };
  const handleResend = async (email) => {
    try {
      await authService.adminResendSetPasswordEmailByEmail(email);
      alert("Set-password email resent.");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to resend email.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let res;
      // if (editingUser) {
      //   res = await userService.updateUser(editingUser.id, {
      //     displayName: formData.displayName,
      //     roles: formData.roles,
      //   });
      // if (editingUser) {
      //   res = await userService.updateUser(editingUser.id, {
      //     displayName: formData.displayName,
      //   });
      //   setUsers((p) => p.map((u) => (u.id === editingUser.id ? res.data : u)));
      if (editingUser) {
        // Update auth-service (source of truth) by the user's ORIGINAL email —
        // formData.email may have just been changed in the form, so we look
        // the record up by what it WAS, not what it's becoming.
        await authService.adminUpdateUserByEmail(editingUser.email, {
          name: formData.displayName,
          email: formData.email,
          role: ROLE_TO_AUTH_ROLE[formData.roles],
        });

        res = await userService.updateUser(editingUser.id, {
          displayName: formData.displayName,
        });
        setUsers((p) => p.map((u) => (u.id === editingUser.id ? res.data : u)));
        if (
          loggedInUser &&
          loggedInUser.email === editingUser.email &&
          loggedInUser.roles !== formData.roles
        ) {
          alert("Your role has been changed. Please login again.");
          localStorage.clear();
          window.location.href = "/login";
          return;
        }
      } else {
        const currentUser = JSON.parse(
          localStorage.getItem("lms_user") || "null",
        );
        const orgId = currentUser?.organizationId || null;
        await userService.createAuthUser({
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName,
          roles: formData.roles,
          organizationId: orgId,
        });
        // setTimeout(async () => {
        //   const currentUser = JSON.parse(
        //     localStorage.getItem("lms_user") || "null",
        //   );
        //   const orgId = currentUser?.organizationId || null;
        //   if (orgId) {
        //     const data = await userService.getUsersByOrg(orgId);
        //     setUsers(Array.isArray(data) ? data : []);
        //   }
        // }, 3000);
        setTimeout(async () => {
          const currentUser = JSON.parse(
            localStorage.getItem("lms_user") || "null",
          );
          const orgId = currentUser?.organizationId || null;
          if (orgId) {
            const data = await userService.getUsersByOrg(orgId);
            const filtered = Array.isArray(data)
              ? data.filter(
                  (u) =>
                    u.roles === "ROLE_STUDENT" || u.roles === "ROLE_TRAINER",
                )
              : [];
            setUsers(filtered); // ✅
          }
        }, 3000);
      }
      resetPanel();
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to save user";
      if (
        message.includes("limit reached") ||
        message.includes("Max allowed")
      ) {
        setLimitError(message);
      } else {
        alert(message);
      }
    }
  };

  const resetPanel = () => {
    setPanelOpen(false);
    setEditingUser(null);
    setFormData({
      displayName: "",
      email: "",
      password: "",
      roles: "ROLE_STUDENT",
    });
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setFormData({
      displayName: u.displayName,
      email: u.email,
      password: "",
      roles: u.roles,
    });
    setPanelOpen(true);
  };

  // ── PROFILE PANEL HANDLERS (ADDED) ───────────────────────────────────────
  const openProfile = async (u) => {
    // Close add/edit panel if open
    setPanelOpen(false);
    setProfilePanelUser(u);
    setProfileData(null);
    setProfileError(null);
    setProfileLoading(true);
    try {
      if (u.roles === "ROLE_STUDENT") {
        const res = await userService.getStudentProfileByEmail(u.email);
        setProfileData(res.data);
      } else if (u.roles === "ROLE_TRAINER") {
        const res = await userService.getTrainerProfileByEmail(u.email);
        setProfileData(res.data);
      } else {
        setProfileData({});
      }
    } catch {
      setProfileError("Failed to load profile details.");
    } finally {
      setProfileLoading(false);
    }
  };

  const closeProfile = () => {
    setProfilePanelUser(null);
    setProfileData(null);
    setProfileError(null);
  };
  // ─────────────────────────────────────────────────────────────────────────

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(filteredUsers);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    const updatedUsers = users.map(
      (u) => items.find((i) => i.id === u.id) || u,
    );
    setUsers(updatedUsers);
  };

  const filteredUsers = users
    .filter((u) =>
      (u.displayName || u.email)?.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      const order = { ROLE_ADMIN: 0, ROLE_TRAINER: 1, ROLE_STUDENT: 2 };
      return (order[a.roles] ?? 3) - (order[b.roles] ?? 3);
    });

  const pill = {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "4px 10px",
    borderRadius: 999,
    background: t.pillBg,
    border: `1px solid ${t.pillBorder}`,
    color: t.pillText,
    fontFamily: FONT_FAMILY,
  };
  const inputStyle = {
    width: "100%",
    height: 38,
    borderRadius: 10,
    border: `1px solid ${t.border}`,
    background: t.recentItemBg,
    color: t.text,
    fontSize: 12,
    fontFamily: FONT_FAMILY,
    padding: "0 12px",
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle = {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: t.textMuted,
    fontFamily: FONT_FAMILY,
    display: "block",
    marginBottom: 6,
  };

  if (loading)
    return (
      <PageContainer
        mode={isDark ? "dark" : "light"}
        pageBg={t.pageBg}
        textColor={t.text}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              height: 64,
              borderRadius: RADIUS.standardCard,
              background: t.recentItemBg,
              border: `1px solid ${t.border}`,
              marginBottom: 10,
              animation: "shimmer 1.5s ease infinite",
            }}
          />
        ))}
      </PageContainer>
    );

  if (error)
    return (
      <PageContainer
        mode={isDark ? "dark" : "light"}
        pageBg={t.pageBg}
        textColor={t.text}
      >
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              color: "#f43f5e",
              fontSize: 13,
              fontFamily: FONT_FAMILY,
            }}
          >
            {error}
          </p>
        </div>
      </PageContainer>
    );

  // ── stat cards — same shared design-system <StatCard> used on
  // AdminDashboard.jsx / AllCourses.jsx, counts derived from the users
  // already loaded (no new API calls / logic added).
  const adminCount = users.filter((u) => u.roles === "ROLE_ADMIN").length;
  const trainerCount = users.filter((u) => u.roles === "ROLE_TRAINER").length;
  const studentCount = users.filter((u) => u.roles === "ROLE_STUDENT").length;

  const userStats = [
    {
      label: "Total Users",
      numericValue: users.length,
      icon: Users,
      colorKey: "blue",
      change: "All registered accounts",
    },
    {
      label: "Trainers",
      numericValue: trainerCount,
      icon: UserCheck,
      colorKey: "green",
      change: "Active on platform",
    },
    {
      label: "Students",
      numericValue: studentCount,
      icon: GraduationCap,
      colorKey: "purple",
      change: "Enrolled learners",
    },
    {
      label: "Admins",
      numericValue: adminCount,
      icon: ShieldCheck,
      colorKey: "amber",
      change: "Platform administrators",
    },
  ];

  return (
    <PageContainer
      mode={isDark ? "dark" : "light"}
      pageBg={t.pageBg}
      textColor={t.text}
    >
      <style>{`
        @keyframes shimmer{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .user-row .row-actions{opacity:0;transition:opacity 0.2s}.user-row:hover .row-actions{opacity:1}
        .user-row:hover .uname{color:#22d3ee}
        .uname{transition:color 0.15s}
        @media (max-width:560px){
          .au-hero-badges{width:100%;}
        }
      `}</style>

      {/* ═══ HERO — shared <Hero> component, matches Admin Dashboard / All Courses exactly ═══ */}
      <Hero borderHero={t.borderHero}>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate(-1)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: RADIUS.pill,
                border: `1px solid ${t.borderHov}`,
                background: t.actBg,
                color: t.textSub,
                fontSize: 10.5,
                fontWeight: FONT_WEIGHT.semibold,
                cursor: "pointer",
                fontFamily: FONT_FAMILY,
              }}
            >
              <ArrowLeft size={12} /> Back
            </button>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: ACCENT_PURPLE.base,
              }}
            />
            <span
              style={{
                fontSize: FONT_SIZE.eyebrow,
                fontWeight: FONT_WEIGHT.bold,
                letterSpacing: LETTER_SPACING.eyebrowWide,
                textTransform: "uppercase",
                color: t.textSub,
                fontFamily: FONT_FAMILY,
              }}
            >
              Organisation Manager
            </span>
          </div>
          <h1
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: FONT_WEIGHT.heroTitle,
              fontSize: FONT_SIZE.heroTitle,
              color: ACCENT_PURPLE.base,
              margin: "0 0 6px",
              lineHeight: LINE_HEIGHT.heroTitle,
              letterSpacing: LETTER_SPACING.heroTitle,
            }}
          >
            All Users
          </h1>
          <p
            style={{
              fontSize: FONT_SIZE.bodySmall,
              color: t.textSub,
              margin: 0,
              fontWeight: FONT_WEIGHT.medium,
              fontFamily: FONT_FAMILY,
            }}
          >
            Manage platform users and roles across your organisation
          </p>
        </div>

        <div className="hero-badges au-hero-badges">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: t.actBg,
              border: `1px solid ${t.actBorder}`,
              borderRadius: RADIUS.chip,
              padding: "8px 16px",
              fontSize: 11,
              fontWeight: FONT_WEIGHT.semibold,
              fontFamily: FONT_FAMILY,
              color: t.textSub,
              flexWrap: "wrap",
            }}
          >
            <span>{users.length} users</span>
            <span style={{ width: 1, height: 14, background: t.actBorder }} />
            <span>{trainerCount} trainers</span>
            <span style={{ width: 1, height: 14, background: t.actBorder }} />
            <span>{studentCount} students</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: RADIUS.pill,
              padding: "8px 18px",
              color: ACCENT_PURPLE.base,
              fontSize: 11,
              fontWeight: FONT_WEIGHT.bold,
              letterSpacing: LETTER_SPACING.eyebrowWide,
              fontFamily: FONT_FAMILY,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: ACCENT_PURPLE.base,
                display: "inline-block",
              }}
            />
            LIVE
          </div>
        </div>
      </Hero>

      {/* ═══ STAT CARDS — shared <StatCard> ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {userStats.map((s, i) => (
          <StatCard
            key={s.label}
            stat={s}
            index={i}
            loading={loading}
            mode={isDark ? "dark" : "light"}
          />
        ))}
      </div>

      {/* ═══ TOOLBAR — search + actions ═══ */}
      <div
        style={{
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: RADIUS.standardCard,
          boxShadow: t.shadow,
          padding: "12px 16px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
                color: t.textMuted,
                pointerEvents: "none",
              }}
            />
            <input
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingLeft: 34,
                paddingRight: 14,
                height: 36,
                width: 220,
                boxSizing: "border-box",
                borderRadius: RADIUS.chip,
                border: `1px solid ${t.border}`,
                background: t.recentItemBg,
                color: t.text,
                fontSize: 12.5,
                fontFamily: FONT_FAMILY,
                outline: "none",
              }}
            />
          </div>
          <button
            onClick={() => {
              closeProfile();
              setEditingUser(null);
              setFormData({
                displayName: "",
                email: "",
                password: "",
                roles: "ROLE_STUDENT",
              });
              setPanelOpen(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 18px",
              borderRadius: RADIUS.button,
              background: `linear-gradient(135deg, ${ACCENT_PURPLE.base}, #4f46e5)`,
              border: "none",
              color: "#ffffff",
              fontSize: 12,
              fontWeight: FONT_WEIGHT.bold,
              cursor: "pointer",
              fontFamily: FONT_FAMILY,
              boxShadow: "0 6px 18px rgba(79,70,229,0.3)",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            <Plus size={14} /> Add User
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {/* USER LIST CARD */}
        <div style={{ flex: 1, minWidth: 0, transition: "all 0.3s" }}>
          <div
            style={{
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: t.shadow,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 22px",
                borderBottom: `1px solid ${t.border}`,
                background: isDark
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(0,0,0,0.01)",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: t.text,
                    margin: 0,
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  All Users
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: t.textMuted,
                    margin: "3px 0 0",
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  {filteredUsers.length} user
                  {filteredUsers.length !== 1 && "s"} found
                </p>
              </div>
              <span style={pill}>All Users</span>
            </div>

            <div style={{ padding: 16 }}>
              {filteredUsers.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "52px 0",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1.5px dashed ${t.emptyBorder}`,
                      background: t.emptyBg,
                    }}
                  >
                    <Users size={22} color={t.emptyIcon} />
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: t.textMuted,
                      fontWeight: 500,
                      fontFamily: FONT_FAMILY,
                      margin: 0,
                    }}
                  >
                    No users found
                  </p>
                </div>
              ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="users">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {filteredUsers.map((u, index) => {
                          const role =
                            ROLE_CFG[u.roles] ?? ROLE_CFG.ROLE_STUDENT;
                          const [c1, c2] = gradColor(u.displayName);
                          return (
                            <Draggable
                              key={u.id}
                              draggableId={String(u.id)}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="user-row"
                                  onClick={() => openProfile(u)}
                                  style={{
                                    ...provided.draggableProps.style,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    borderRadius: 14,
                                    border: `1px solid ${
                                      profilePanelUser?.id === u.id
                                        ? "#7c3aed"
                                        : snapshot.isDragging
                                          ? "#22d3ee"
                                          : t.recentItemBorder
                                    }`,
                                    padding: "12px 14px",
                                    background: snapshot.isDragging
                                      ? t.actBg
                                      : profilePanelUser?.id === u.id
                                        ? isDark
                                          ? "rgba(124,58,237,0.08)"
                                          : "rgba(124,58,237,0.04)"
                                        : t.recentItemBg,
                                    boxShadow: snapshot.isDragging
                                      ? t.shadowHov
                                      : "none",
                                    transition: "all 0.15s",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 12,
                                    }}
                                  >
                                    <div
                                      {...provided.dragHandleProps}
                                      onClick={(e) => e.stopPropagation()}
                                      style={{
                                        cursor: "grab",
                                        padding: 4,
                                        borderRadius: 7,
                                        background: t.actBg,
                                        opacity: 0.6,
                                      }}
                                    >
                                      <GripVertical
                                        size={14}
                                        color={t.textMuted}
                                      />
                                    </div>
                                    <div
                                      style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 12,
                                        background: `linear-gradient(135deg,${c1},${c2})`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        fontWeight: 800,
                                        fontSize: 15,
                                        fontFamily: FONT_FAMILY,
                                        boxShadow: `0 3px 10px ${c1}44`,
                                        flexShrink: 0,
                                      }}
                                    >
                                      {u.displayName
                                        ?.charAt(0)
                                        ?.toUpperCase() ?? "?"}
                                    </div>
                                    <div>
                                      <p
                                        className="uname"
                                        style={{
                                          fontSize: 13,
                                          fontWeight: 700,
                                          color: t.text,
                                          margin: 0,
                                          fontFamily: FONT_FAMILY,
                                        }}
                                      >
                                        {u.displayName}
                                      </p>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 5,
                                          marginTop: 3,
                                        }}
                                      >
                                        <Mail size={11} color={t.textMuted} />
                                        <span
                                          style={{
                                            fontSize: 10,
                                            color: t.textMuted,
                                            fontFamily: FONT_FAMILY,
                                          }}
                                        >
                                          {u.email}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className="row-actions"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 8,
                                    }}
                                  >
                                    <span
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        padding: "3px 10px",
                                        borderRadius: 999,
                                        background: `${role.color}14`,
                                        border: `1px solid ${role.color}33`,
                                        fontSize: 10,
                                        fontWeight: 700,
                                        color: role.color,
                                        fontFamily: FONT_FAMILY,
                                      }}
                                    >
                                      {role.label}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        closeProfile();
                                        openEdit(u);
                                      }}
                                      style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "rgba(34,211,238,0.08)",
                                        border:
                                          "1px solid rgba(34,211,238,0.2)",
                                        color: isDark ? "#22d3ee" : "#0891b2",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <Pencil size={13} />
                                    </button>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleResend(u.email);
                                      }}
                                      title="Resend set-password email"
                                      style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "rgba(245,158,11,0.08)",
                                        border:
                                          "1px solid rgba(245,158,11,0.2)",
                                        color: "#f59e0b",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <Mail size={13} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(u.id);
                                      }}
                                      style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "rgba(244,63,94,0.08)",
                                        border: "1px solid rgba(244,63,94,0.2)",
                                        color: "#f43f5e",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>
          </div>
        </div>

        {/* INLINE ADD/EDIT PANEL */}
        <div
          style={{
            flexShrink: 0,
            width: panelOpen ? 384 : 0,
            opacity: panelOpen ? 1 : 0,
            pointerEvents: panelOpen ? "auto" : "none",
            overflow: "hidden",
            transition: "width 0.3s ease,opacity 0.3s ease",
          }}
        >
          <div
            style={{
              width: 384,
              borderRadius: 20,
              border: `1px solid ${t.border}`,
              background: t.cardBg,
              overflow: "hidden",
              boxShadow: t.shadowHov,
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg,#1a56db,#06b6d4)",
                padding: "18px 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {editingUser ? (
                      <Pencil size={15} color="#fff" />
                    ) : (
                      <Plus size={15} color="#fff" />
                    )}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#fff",
                        margin: 0,
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      {editingUser ? "Edit User" : "New User"}
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: "rgba(255,255,255,0.6)",
                        margin: "2px 0 0",
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      {editingUser
                        ? "Update user details"
                        : "Fill in the user details"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetPanel}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={14} color="#fff" />
                </button>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
                {["User Info", "Role", "Done"].map((step, i) => (
                  <div
                    key={step}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 10px",
                      borderRadius: 8,
                      background:
                        i === 0 ? "rgba(255,255,255,0.2)" : "transparent",
                      color: i === 0 ? "#fff" : "rgba(255,255,255,0.4)",
                      fontSize: 10,
                      fontWeight: 600,
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 9,
                        fontWeight: 800,
                        background: i === 0 ? "#fff" : "rgba(255,255,255,0.2)",
                        color: i === 0 ? "#1a56db" : "rgba(255,255,255,0.6)",
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSave}
              style={{
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                overflowY: "auto",
                maxHeight: "calc(100vh - 280px)",
              }}
            >
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  placeholder="e.g. Raghib Khan"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      displayName: e.target.value,
                    })
                  }
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                {/* <input
                      placeholder="user@example.com"
                      disabled={!!editingUser}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      style={{ ...inputStyle, opacity: editingUser ? 0.5 : 1 }}
                    /> */}
                <input
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  style={inputStyle}
                />
              </div>
              {!editingUser && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <label style={{ ...labelStyle, marginBottom: 0 }}>
                      Password
                    </label>
                    {formData.password && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: pwStrength.color,
                          fontFamily: FONT_FAMILY,
                          letterSpacing: "0.05em",
                        }}
                      >
                        {pwStrength.label}
                      </span>
                    )}
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 8 chars, mixed symbols"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      required
                      style={{ ...inputStyle, paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        color: t.textMuted,
                      }}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {formData.password && (
                    <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: 3,
                            borderRadius: 99,
                            background:
                              i <= pwStrength.score
                                ? pwStrength.color
                                : t.border,
                            transition: "background 0.25s",
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <p
                    style={{
                      fontSize: 9,
                      color: t.textMuted,
                      fontFamily: FONT_FAMILY,
                      margin: "5px 0 0",
                      lineHeight: 1.5,
                    }}
                  >
                    Must include uppercase, lowercase, number &amp; symbol
                  </p>
                </div>
              )}
              {/* <div>
                    <label style={labelStyle}>Role</label>
                    <div style={{ position: "relative" }}>
                      <button
                        type="button"
                        onClick={() => setRoleDropOpen((o) => !o)}
                        style={{
                          ...inputStyle,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                        }}
                      >
                        <span style={{ fontSize: 12 }}>
                          {ROLE_CFG[formData.roles]?.label || "Select role"}
                        </span>
                        <span style={{ fontSize: 10, color: t.textMuted }}>
                          ▾
                        </span>
                      </button>
                      {roleDropOpen && (
                        <div
                          style={{
                            position: "absolute",
                            top: "calc(100% + 4px)",
                            left: 0,
                            right: 0,
                            background: t.cardBg,
                            border: `1px solid ${t.border}`,
                            borderRadius: 12,
                            boxShadow: t.shadowHov,
                            zIndex: 999,
                          }}
                        >
                          {["ROLE_STUDENT", "ROLE_TRAINER", "ROLE_ADMIN"].map(
                            (r) => (
                              <div
                                key={r}
                                onClick={() => {
                                  setFormData({ ...formData, roles: r });
                                  setRoleDropOpen(false);
                                }}
                                style={{
                                  padding: "9px 14px",
                                  fontSize: 12,
                                  cursor: "pointer",
                                  color: t.text,
                                  fontFamily: FONT_FAMILY,
                                  background:
                                    formData.roles === r
                                      ? isDark
                                        ? "rgba(34,211,238,0.1)"
                                        : "rgba(34,211,238,0.07)"
                                      : "transparent",
                                  fontWeight: formData.roles === r ? 600 : 400,
                                }}
                              >
                                {ROLE_CFG[r].label}
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div> */}
              <div>
                <label style={labelStyle}>Role</label>
                {editingUser ? (
                  <div
                    style={{
                      ...inputStyle,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      opacity: 0.55,
                      cursor: "not-allowed",
                    }}
                  >
                    <span style={{ fontSize: 12 }}>
                      {ROLE_CFG[formData.roles]?.label || "—"}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        color: t.textMuted,
                        fontStyle: "italic",
                      }}
                    >
                      locked
                    </span>
                  </div>
                ) : (
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      onClick={() => setRoleDropOpen((o) => !o)}
                      style={{
                        ...inputStyle,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ fontSize: 12 }}>
                        {ROLE_CFG[formData.roles]?.label || "Select role"}
                      </span>
                      <span style={{ fontSize: 10, color: t.textMuted }}>
                        ▾
                      </span>
                    </button>
                    {roleDropOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "calc(100% + 4px)",
                          left: 0,
                          right: 0,
                          background: t.cardBg,
                          border: `1px solid ${t.border}`,
                          borderRadius: 12,
                          boxShadow: t.shadowHov,
                          zIndex: 999,
                        }}
                      >
                        {/* {["ROLE_STUDENT", "ROLE_TRAINER", "ROLE_ADMIN"].map( */}
                        {["ROLE_STUDENT", "ROLE_TRAINER"].map((r) => (
                          <div
                            key={r}
                            onClick={() => {
                              setFormData({ ...formData, roles: r });
                              setRoleDropOpen(false);
                            }}
                            style={{
                              padding: "9px 14px",
                              fontSize: 12,
                              cursor: "pointer",
                              color: t.text,
                              fontFamily: FONT_FAMILY,
                              background:
                                formData.roles === r
                                  ? isDark
                                    ? "rgba(34,211,238,0.1)"
                                    : "rgba(34,211,238,0.07)"
                                  : "transparent",
                              fontWeight: formData.roles === r ? 600 : 400,
                            }}
                          >
                            {ROLE_CFG[r].label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  paddingTop: 4,
                }}
              >
                <button
                  type="button"
                  onClick={resetPanel}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 10,
                    border: `1px solid ${t.border}`,
                    background: t.actBg,
                    color: t.textSub,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 20px",
                    borderRadius: 10,
                    background: "linear-gradient(135deg,#3b82f6,#22d3ee)",
                    border: "none",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: FONT_FAMILY,
                    boxShadow: "0 4px 14px rgba(34,211,238,0.35)",
                  }}
                >
                  {editingUser ? "Update" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── PROFILE DETAIL PANEL (ADDED) ─────────────────────────────── */}
        <div
          style={{
            flexShrink: 0,
            width: profilePanelUser ? 360 : 0,
            opacity: profilePanelUser ? 1 : 0,
            pointerEvents: profilePanelUser ? "auto" : "none",
            overflow: "hidden",
            transition: "width 0.3s ease,opacity 0.3s ease",
          }}
        >
          <div
            style={{
              width: 360,
              borderRadius: 20,
              border: `1px solid ${t.border}`,
              background: t.cardBg,
              overflow: "hidden",
              boxShadow: t.shadowHov,
            }}
          >
            {/* Panel Header */}
            <div
              style={{
                background:
                  profilePanelUser?.roles === "ROLE_TRAINER"
                    ? "linear-gradient(135deg,#7c3aed,#6366f1)"
                    : profilePanelUser?.roles === "ROLE_STUDENT"
                      ? "linear-gradient(135deg,#0d9488,#14b8a6)"
                      : "linear-gradient(135deg,#f43f5e,#be123c)",
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {profilePanelUser &&
                  (() => {
                    const [c1, c2] = gradColor(profilePanelUser.displayName);
                    return (
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 11,
                          background: `linear-gradient(135deg,${c1},${c2})`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: 800,
                          fontSize: 15,
                          fontFamily: FONT_FAMILY,
                        }}
                      >
                        {profilePanelUser.displayName
                          ?.charAt(0)
                          ?.toUpperCase() ?? "?"}
                      </div>
                    );
                  })()}
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                      margin: 0,
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    {profilePanelUser?.displayName}
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.65)",
                      margin: "2px 0 0",
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    {ROLE_CFG[profilePanelUser?.roles]?.label ?? "User"} Profile
                  </p>
                </div>
              </div>
              <button
                onClick={closeProfile}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={14} color="#fff" />
              </button>
            </div>

            {/* Panel Body */}
            <div
              style={{
                padding: 20,
                overflowY: "auto",
                maxHeight: "calc(100vh - 220px)",
              }}
            >
              {/* Basic Info */}
              <div style={{ marginBottom: 16 }}>
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: t.textMuted,
                    fontFamily: FONT_FAMILY,
                    margin: "0 0 10px",
                  }}
                >
                  Basic Info
                </p>
                {[
                  { label: "Email", value: profilePanelUser?.email },
                  {
                    label: "Role",
                    value: ROLE_CFG[profilePanelUser?.roles]?.label ?? "—",
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: `1px solid ${t.border}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: t.textMuted,
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: t.text,
                        fontFamily: FONT_FAMILY,
                        maxWidth: 200,
                        textAlign: "right",
                        wordBreak: "break-all",
                      }}
                    >
                      {value || "—"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Loading spinner */}
              {profileLoading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "28px 0",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      border: `3px solid ${t.border}`,
                      borderTop: "3px solid #6366f1",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                </div>
              )}

              {/* Error */}
              {profileError && (
                <p
                  style={{
                    fontSize: 12,
                    color: "#f43f5e",
                    textAlign: "center",
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  {profileError}
                </p>
              )}

              {/* Student Profile Fields */}
              {!profileLoading &&
                !profileError &&
                profileData &&
                profilePanelUser?.roles === "ROLE_STUDENT" && (
                  <div>
                    <p
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: t.textMuted,
                        fontFamily: FONT_FAMILY,
                        margin: "0 0 10px",
                      }}
                    >
                      Student Profile
                    </p>
                    {[
                      {
                        label: "Mobile",
                        value: profileData.mobileNumber,
                      },
                      {
                        label: "Date of Birth",
                        value: profileData.dateOfBirth,
                      },
                      { label: "Gender", value: profileData.gender },
                      { label: "City", value: profileData.city },
                      { label: "State", value: profileData.state },
                      { label: "Country", value: profileData.country },
                      {
                        label: "Qualification",
                        value: profileData.qualification,
                      },
                      {
                        label: "College",
                        value: profileData.collegeName,
                      },
                      {
                        label: "Year of Passing",
                        value: profileData.yearOfPassing,
                      },
                      { label: "Domain", value: profileData.domain },
                      {
                        label: "Experience",
                        value: profileData.experience,
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 0",
                          borderBottom: `1px solid ${t.border}`,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: t.textMuted,
                            fontFamily: FONT_FAMILY,
                          }}
                        >
                          {label}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: t.text,
                            fontFamily: FONT_FAMILY,
                            maxWidth: 180,
                            textAlign: "right",
                          }}
                        >
                          {value || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              {/* Trainer Profile Fields */}
              {!profileLoading &&
                !profileError &&
                profileData &&
                profilePanelUser?.roles === "ROLE_TRAINER" && (
                  <div>
                    <p
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: t.textMuted,
                        fontFamily: FONT_FAMILY,
                        margin: "0 0 10px",
                      }}
                    >
                      Trainer Profile
                    </p>
                    {[
                      {
                        label: "LinkedIn",
                        value: profileData.linkedinUrl,
                      },
                      { label: "Country", value: profileData.country },
                      {
                        label: "Audience Size",
                        value: profileData.audienceSize,
                      },
                      {
                        label: "Full Time Role",
                        value: profileData.fullTimeRole,
                      },
                      {
                        label: "Course Topic",
                        value: profileData.courseTopic,
                      },
                      {
                        label: "Platforms",
                        value: Array.isArray(profileData.platforms)
                          ? profileData.platforms.join(", ")
                          : profileData.platforms,
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 0",
                          borderBottom: `1px solid ${t.border}`,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: t.textMuted,
                            fontFamily: FONT_FAMILY,
                          }}
                        >
                          {label}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: t.text,
                            fontFamily: FONT_FAMILY,
                            maxWidth: 180,
                            textAlign: "right",
                            wordBreak: "break-all",
                          }}
                        >
                          {value || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              {/* Admin — no extra profile */}
              {!profileLoading &&
                !profileError &&
                profileData &&
                profilePanelUser?.roles === "ROLE_ADMIN" && (
                  <p
                    style={{
                      fontSize: 12,
                      color: t.textMuted,
                      textAlign: "center",
                      fontFamily: FONT_FAMILY,
                      paddingTop: 8,
                    }}
                  >
                    No additional profile fields for admins.
                  </p>
                )}
            </div>
          </div>
        </div>
        {/* ── END PROFILE DETAIL PANEL ─────────────────────────────────── */}
      </div>

      {/* LIMIT ERROR MODAL */}
      {limitError && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: t.cardBg,
              borderRadius: 20,
              padding: "32px 28px",
              maxWidth: 420,
              width: "100%",
              textAlign: "center",
              border: `1px solid ${t.border}`,
              boxShadow: t.shadowHov,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(244,63,94,0.1)",
                border: "1.5px solid rgba(244,63,94,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Users size={24} color="#f43f5e" />
            </div>

            <p
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: t.text,
                fontFamily: FONT_FAMILY,
                margin: "0 0 8px",
              }}
            >
              User Limit Reached
            </p>

            <p
              style={{
                fontSize: 12,
                color: t.textSub,
                fontFamily: FONT_FAMILY,
                margin: "0 0 20px",
                lineHeight: 1.6,
              }}
            >
              {limitError}. Please contact your Super Admin to upgrade your plan
              and increase the limit.
            </p>

            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => setLimitError(null)}
                style={{
                  padding: "9px 22px",
                  borderRadius: 10,
                  border: `1px solid ${t.border}`,
                  background: t.actBg,
                  color: t.textSub,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: FONT_FAMILY,
                }}
              >
                Close
              </button>

              <button
                onClick={() => {
                  setLimitError(null);
                }}
                style={{
                  padding: "9px 22px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg,#f43f5e,#be123c)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: FONT_FAMILY,
                  boxShadow: "0 4px 14px rgba(244,63,94,0.35)",
                }}
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default AllUsers;
