/**
 * SuperAdminBatchControl.jsx  — Light UI redesign
 *
 * Matches the visual language of OnboardingManagement + OrganizationPage:
 *  • White cards, #f8fafc page background
 *  • Inter / system-ui font stack
 *  • #6366f1 purple accent (consistent with SuperAdmin theme)
 *  • Compact font sizes (10–14px), same scale as sibling pages
 *  • Clean table layout, inline slide panel
 */

import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  GitBranch,
  GripVertical,
  Layers,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createBatch,
  createBranch,
  createDepartment,
  deleteBatch,
  deleteBranch,
  deleteDepartment,
  getAllBatches,
  getBranches,
  getDepartments,
  getGlobalDepartments,
  getGlobalBranches,
  getGlobalBatches,
  updateBranch,
  updateDepartment,
  getTrainerStudents,
  getAvailableTrainersGlobal,
  getAvailableStudentsGlobal,
  assignTrainer,
  removeTrainerFromBatch,
  assignStudentsToTrainer,
  removeStudentFromTrainer,
} from "../../services/batchService";

/* ─── CONSTANTS ─────────────────────────────────────────────── */
const DEPT_OPTIONS = [
  "Engineering",
  "Computer Science",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "MBA",
  "Business Administration",
  "Finance & Accounting",
  "Human Resources",
  "Marketing",
  "Sales & Business Development",
  "Data Science & AI",
  "Cybersecurity",
  "Cloud Computing",
  "Product Management",
  "Operations",
  "Research & Development",
  "Legal & Compliance",
  "Quality Assurance",
  "Design & UX",
  "Content & Communications",
  "Customer Support",
  "Logistics & Supply Chain",
  "Healthcare Management",
  "Biotechnology",
  "Architecture",
  "Physics",
  "Mathematics",
  "Chemistry",
];

const CITY_OPTIONS = [
  "Delhi",
  "Mumbai",
  "Kolkata",
  "Chennai",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Surat",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Bhopal",
  "Patna",
  "Chandigarh",
  "Noida",
  "Gurgaon",
  "Meerut",
  "Agra",
  "Varanasi",
  "Dehradun",
  "Kochi",
  "Coimbatore",
  "Visakhapatnam",
  "Vijayawada",
  "Tirupati",
  "Bhubaneswar",
  "Guwahati",
];

const TABS = ["Departments", "Branches", "Batches"];

const AVATAR_COLORS = [
  ["#6366f1", "#818cf8"],
  ["#8b5cf6", "#a78bfa"],
  ["#14b8a6", "#2dd4bf"],
  ["#f59e0b", "#fbbf24"],
  ["#10b981", "#34d399"],
  ["#3b82f6", "#60a5fa"],
  ["#ec4899", "#f472b6"],
  ["#ef4444", "#f87171"],
];
const avatarGrad = (name = "") =>
  AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

/* ─── DRAG LIST ──────────────────────────────────────────────── */
function useDragList(items, setItems) {
  const dragIdx = useRef(null),
    overIdx = useRef(null);
  const [active, setActive] = useState(null),
    [over, setOver] = useState(null);
  const handlers = (i) => ({
    draggable: true,
    onDragStart: () => {
      dragIdx.current = i;
      setActive(i);
    },
    onDragOver: (e) => {
      e.preventDefault();
      overIdx.current = i;
      setOver(i);
    },
    onDrop: () => {
      const f = dragIdx.current,
        t = overIdx.current;
      if (f !== null && t !== null && f !== t) {
        const n = [...items];
        const [m] = n.splice(f, 1);
        n.splice(t, 0, m);
        setItems(n);
      }
      dragIdx.current = null;
      overIdx.current = null;
      setActive(null);
      setOver(null);
    },
    onDragEnd: () => {
      dragIdx.current = null;
      overIdx.current = null;
      setActive(null);
      setOver(null);
    },
  });
  return { handlers, active, over };
}

/* ─── SHARED STYLE TOKENS ────────────────────────────────────── */
const T = {
  pageBg: "#f8fafc",
  cardBg: "#ffffff",
  border: "#e5e7eb",
  borderSub: "#f1f5f9",
  text: "#0f172a",
  textSub: "#64748b",
  textMuted: "#94a3b8",
  accent: "#6366f1",
  accentBg: "#eef2ff",
  accentLt: "#c7d2fe",
  inputBg: "#f1f5f9",
  danger: "#ef4444",
  dangerBg: "#fee2e2",
  success: "#10b981",
  successBg: "#d1fae5",
  rowHov: "#f9fafb",
  shadow: "0 1px 3px rgba(0,0,0,0.06)",
  shadowMd: "0 4px 16px rgba(0,0,0,0.10)",
};

const inputStyle = {
  width: "100%",
  height: 36,
  borderRadius: 8,
  border: `1px solid ${T.border}`,
  background: "#fff",
  color: T.text,
  fontSize: 13,
  fontFamily: "Inter, -apple-system, sans-serif",
  padding: "0 11px",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: T.textMuted,
  fontFamily: "Inter, -apple-system, sans-serif",
  display: "flex",
  alignItems: "center",
  gap: 5,
  marginBottom: 5,
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const SuperAdminBatchControl = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Departments");
  const [search, setSearch] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelMode, setPanelMode] = useState("create");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [globalError, setGlobalError] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [deptForm, setDeptForm] = useState({ id: null, name: "", head: "" });
  const [deptDropOpen, setDeptDropOpen] = useState(false);
  const [customDeptOpts, setCustomDeptOpts] = useState([]);
  const [branchForm, setBranchForm] = useState({
    id: null,
    name: "",
    city: "",
    departmentId: "",
  });
  const [cityOpts, setCityOpts] = useState(CITY_OPTIONS);
  const [batchForm, setBatchForm] = useState({ batchName: "", branchId: "" });

  const [managePanelOpen, setManagePanelOpen] = useState(false);
  const [managePanelVisible, setManagePanelVisible] = useState(false);
  const [manageBatch, setManageBatch] = useState(null);
  const [manageLoading, setManageLoading] = useState(false);
  const [assignedMap, setAssignedMap] = useState({}); // { trainerEmail: [studentEmails] }
  const [availableTrainers, setAvailableTrainers] = useState([]);
  const [availableStudentsMap, setAvailableStudentsMap] = useState({}); // { trainerEmail: [students] }
  const [manageError, setManageError] = useState("");

  /* ── LOAD ── */
  //   const load = async () => {
  //     setLoading(true);
  //     setGlobalError(null);
  //     try {
  //       if (activeTab === "Departments") {
  //         const res = await getDepartments();
  //         setDepartments(res?.data || []);
  //       } else if (activeTab === "Branches") {
  //         const [br, dp] = await Promise.all([getBranches(), getDepartments()]);
  //         setBranches(br?.data?.data ?? br?.data ?? []);
  //         setDepartments(dp?.data || []);
  //       } else {
  //         const [bt, br] = await Promise.all([getAllBatches(), getBranches()]);
  //         const list = bt?.data?.data ?? bt?.data?.batches ?? bt?.data ?? [];
  //         setBatches(Array.isArray(list) ? list : []);
  //         const blist = br?.data?.data ?? br?.data ?? [];
  //         setBranches(Array.isArray(blist) ? blist : []);
  //       }
  //     } catch (e) {
  //       console.error(e);
  //       setGlobalError("Failed to load data. Please retry.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  const load = async () => {
    setLoading(true);
    setGlobalError(null);
    try {
      if (activeTab === "Departments") {
        const res = await getGlobalDepartments();
        setDepartments(res?.data || []);
      } else if (activeTab === "Branches") {
        const [br, dp] = await Promise.all([
          getGlobalBranches(),
          getGlobalDepartments(),
        ]);
        setBranches(br?.data?.data ?? br?.data ?? []);
        setDepartments(dp?.data || []);
      } else {
        const [bt, br] = await Promise.all([
          getGlobalBatches(),
          getGlobalBranches(),
        ]);
        const list = bt?.data?.data ?? bt?.data?.batches ?? bt?.data ?? [];
        setBatches(Array.isArray(list) ? list : []);
        const blist = br?.data?.data ?? br?.data ?? [];
        setBranches(Array.isArray(blist) ? blist : []);
      }
    } catch (e) {
      console.error(e);
      setGlobalError("Failed to load data. Please retry.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
    setSearch("");
    closePanel();
  }, [activeTab]);

  /* ── FILTER ── */
  const q = search.toLowerCase();
  const filteredDepts = departments.filter((d) =>
    d.name?.toLowerCase().includes(q),
  );
  const filteredBranches = branches.filter((b) =>
    b.name?.toLowerCase().includes(q),
  );
  const filteredBatches = batches.filter((b) =>
    b.batchName?.toLowerCase().includes(q),
  );

  /* ── DRAG ── */
  const {
    handlers: deptDrag,
    active: dActive,
    over: dOver,
  } = useDragList(departments, setDepartments);
  const {
    handlers: branchDrag,
    active: brActive,
    over: brOver,
  } = useDragList(branches, setBranches);
  const {
    handlers: batchDrag,
    active: baActive,
    over: baOver,
  } = useDragList(batches, setBatches);

  /* ── PANEL ── */
  const openCreate = () => {
    setPanelMode("create");
    setFormError("");
    if (activeTab === "Departments")
      setDeptForm({ id: null, name: "", head: "" });
    if (activeTab === "Branches")
      setBranchForm({ id: null, name: "", city: "", departmentId: "" });
    if (activeTab === "Batches") setBatchForm({ batchName: "", branchId: "" });
    setPanelOpen(true);
    setTimeout(() => setPanelVisible(true), 10);
  };
  const openEdit = (item) => {
    setPanelMode("edit");
    setFormError("");
    if (activeTab === "Departments")
      setDeptForm({ id: item.id, name: item.name, head: item.head || "" });
    if (activeTab === "Branches")
      setBranchForm({
        id: item.id,
        name: item.name,
        city: item.city,
        departmentId: item.departmentId || "",
      });
    setPanelOpen(true);
    setTimeout(() => setPanelVisible(true), 10);
  };
  const closePanel = () => {
    setPanelVisible(false);
    setTimeout(() => {
      setPanelOpen(false);
      setFormError("");
    }, 260);
  };

  /* ── SAVE ── */
  const handleSave = async () => {
    setFormError("");
    setSaving(true);
    try {
      if (activeTab === "Departments") {
        if (!deptForm.name.trim()) {
          setFormError("Department name is required.");
          setSaving(false);
          return;
        }
        if (!deptForm.head.trim()) {
          setFormError("Department head is required.");
          setSaving(false);
          return;
        }
        panelMode === "create"
          ? await createDepartment({
              name: deptForm.name.trim(),
              head: deptForm.head.trim(),
            })
          : await updateDepartment(deptForm.id, {
              name: deptForm.name.trim(),
              head: deptForm.head.trim(),
            });
      } else if (activeTab === "Branches") {
        if (!branchForm.name.trim()) {
          setFormError("Branch name is required.");
          setSaving(false);
          return;
        }
        if (!branchForm.city.trim()) {
          setFormError("City is required.");
          setSaving(false);
          return;
        }
        panelMode === "create"
          ? await createBranch({
              name: branchForm.name.trim(),
              city: branchForm.city.trim(),
              departmentId: branchForm.departmentId
                ? Number(branchForm.departmentId)
                : undefined,
            })
          : await updateBranch(branchForm.id, {
              name: branchForm.name.trim(),
              city: branchForm.city.trim(),
            });
      } else {
        if (!batchForm.batchName.trim()) {
          setFormError("Batch name is required.");
          setSaving(false);
          return;
        }
        if (!batchForm.branchId) {
          setFormError("Branch is required.");
          setSaving(false);
          return;
        }
        await createBatch({
          batchName: batchForm.batchName.trim(),
          branchId: Number(batchForm.branchId),
        });
      }
      closePanel();
      load();
    } catch (e) {
      const msg =
        e?.response?.data?.message || e?.response?.data || "Save failed.";
      setFormError(typeof msg === "string" ? msg : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  /* ── DELETE ── */
  const handleDelete = async (item) => {
    const label = activeTab === "Batches" ? item.batchName : item.name;
    const cascade =
      activeTab === "Departments"
        ? "\nAll branches and batches will also be deleted."
        : activeTab === "Branches"
          ? "\nAll batches under it will also be deleted."
          : "";
    if (!window.confirm(`Delete "${label}"?${cascade}`)) return;
    setDeleting(item.id);
    try {
      if (activeTab === "Departments") await deleteDepartment(item.id);
      else if (activeTab === "Branches") await deleteBranch(item.id);
      else await deleteBatch(item.id);
      load();
    } catch {
      alert("Delete failed. Please retry.");
    } finally {
      setDeleting(null);
    }
  };
  const loadManageData = async (batchId) => {
    setManageLoading(true);
    setManageError("");
    try {
      const map = await getTrainerStudents(batchId);
      setAssignedMap(map || {});

      const t = await getAvailableTrainersGlobal(batchId);
      setAvailableTrainers(t?.data || []);

      // load available students for each assigned trainer
      const studentsMap = {};
      for (const trainerEmail of Object.keys(map || {})) {
        const s = await getAvailableStudentsGlobal(batchId, trainerEmail);
        const list = s?.data?.data || s?.data?.students || s?.data || [];
        studentsMap[trainerEmail] = Array.isArray(list) ? list : [];
      }
      setAvailableStudentsMap(studentsMap);
    } catch (e) {
      console.error("Failed to load manage data", e);
      setManageError("Failed to load trainer/student data.");
    } finally {
      setManageLoading(false);
    }
  };

  const openManagePanel = (batch) => {
    setManageBatch(batch);
    setManagePanelOpen(true);
    setTimeout(() => setManagePanelVisible(true), 10);
    loadManageData(batch.id);
  };

  const closeManagePanel = () => {
    setManagePanelVisible(false);
    setTimeout(() => {
      setManagePanelOpen(false);
      setManageBatch(null);
      setAssignedMap({});
      setAvailableTrainers([]);
      setAvailableStudentsMap({});
      setManageError("");
    }, 260);
  };

  const handleAssignTrainer = async (trainerEmail) => {
    if (!manageBatch) return;
    try {
      await assignTrainer(manageBatch.id, trainerEmail);
      await loadManageData(manageBatch.id);
      load(); // refresh main batches table
    } catch (e) {
      console.error(e);
      alert("Failed to assign trainer.");
    }
  };

  const handleRemoveTrainer = async (trainerEmail) => {
    if (!manageBatch) return;
    if (
      !window.confirm(`Remove trainer ${trainerEmail} and all their students?`)
    )
      return;
    try {
      await removeTrainerFromBatch(manageBatch.id, trainerEmail);
      await loadManageData(manageBatch.id);
      load();
    } catch (e) {
      console.error(e);
      alert("Failed to remove trainer.");
    }
  };

  const handleAssignStudent = async (trainerEmail, studentEmail) => {
    if (!manageBatch) return;
    try {
      const current = (assignedMap[trainerEmail] || []).filter(
        (e) => e && e !== "__EMPTY__",
      );
      const updated = [...current, studentEmail];
      await assignStudentsToTrainer(manageBatch.id, trainerEmail, updated);
      await loadManageData(manageBatch.id);
    } catch (e) {
      console.error(e);
      alert("Failed to assign student.");
    }
  };

  const handleRemoveStudent = async (trainerEmail, studentEmail) => {
    if (!manageBatch) return;
    try {
      await removeStudentFromTrainer(
        manageBatch.id,
        trainerEmail,
        studentEmail,
      );
      await loadManageData(manageBatch.id);
    } catch (e) {
      console.error(e);
      alert("Failed to remove student.");
    }
  };
  /* ── COUNTS ── */
  const current =
    activeTab === "Departments"
      ? filteredDepts
      : activeTab === "Branches"
        ? filteredBranches
        : filteredBatches;

  /* ═══════════════════════════════════════════════════════════
     PANEL FORM CONTENT
  ═══════════════════════════════════════════════════════════ */
  const PanelContent = () => {
    const allDeptOpts = [...DEPT_OPTIONS, ...customDeptOpts];

    /* Department form */
    if (activeTab === "Departments") {
      return (
        <div
          style={{
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {formError && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "9px 12px",
                borderRadius: 8,
                background: T.dangerBg,
                border: `1px solid ${T.danger}30`,
                color: T.danger,
                fontSize: 12,
              }}
            >
              <AlertCircle size={13} /> <span>{formError}</span>
            </div>
          )}
          <div>
            <label style={labelStyle}>
              <Building2 size={10} /> Department Type *
            </label>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDeptDropOpen((o) => !o)}
                style={{
                  ...inputStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  height: 36,
                }}
              >
                <span
                  style={{
                    color: deptForm.name ? T.text : T.textMuted,
                    fontSize: 13,
                  }}
                >
                  {deptForm.name || "Select department type"}
                </span>
                <ChevronRight
                  size={12}
                  color={T.textMuted}
                  style={{
                    transform: deptDropOpen ? "rotate(90deg)" : "none",
                    transition: "transform 0.18s",
                  }}
                />
              </button>
              {deptDropOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    boxShadow: T.shadowMd,
                    zIndex: 999,
                    maxHeight: 220,
                    overflowY: "auto",
                  }}
                >
                  {allDeptOpts.map((d) => (
                    <div
                      key={d}
                      onClick={() => {
                        setDeptForm((f) => ({ ...f, name: d }));
                        setDeptDropOpen(false);
                      }}
                      style={{
                        padding: "8px 13px",
                        fontSize: 13,
                        cursor: "pointer",
                        color: T.text,
                        background:
                          deptForm.name === d ? T.accentBg : "transparent",
                        fontWeight: deptForm.name === d ? 600 : 400,
                      }}
                    >
                      {d}
                    </div>
                  ))}
                  <div
                    onClick={() => {
                      const v = window.prompt("Enter new department type:");
                      if (v?.trim()) {
                        setCustomDeptOpts((p) => [...p, v.trim()]);
                        setDeptForm((f) => ({ ...f, name: v.trim() }));
                        setDeptDropOpen(false);
                      }
                    }}
                    style={{
                      padding: "8px 13px",
                      fontSize: 12,
                      cursor: "pointer",
                      color: T.accent,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      borderTop: `1px solid ${T.borderSub}`,
                    }}
                  >
                    <Plus size={11} /> Add custom type…
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Department Head *</label>
            <input
              placeholder="Enter full name"
              value={deptForm.head}
              onChange={(e) =>
                setDeptForm((f) => ({ ...f, head: e.target.value }))
              }
              style={inputStyle}
            />
          </div>
          {deptForm.name && deptForm.head && (
            <div
              style={{
                borderRadius: 10,
                border: `1px solid ${T.accentLt}`,
                background: T.accentBg,
                padding: 13,
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: T.accent,
                  margin: "0 0 9px",
                }}
              >
                Preview
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background: `linear-gradient(135deg,${avatarGrad(deptForm.name)[0]},${avatarGrad(deptForm.name)[1]})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {deptForm.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: T.text,
                      margin: 0,
                    }}
                  >
                    {deptForm.name}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: T.textSub,
                      margin: "2px 0 0",
                    }}
                  >
                    {deptForm.head}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    /* Branch form */
    if (activeTab === "Branches") {
      return (
        <div
          style={{
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {formError && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "9px 12px",
                borderRadius: 8,
                background: T.dangerBg,
                border: `1px solid ${T.danger}30`,
                color: T.danger,
                fontSize: 12,
              }}
            >
              <AlertCircle size={13} /> <span>{formError}</span>
            </div>
          )}
          <div>
            <label style={labelStyle}>
              <Building2 size={10} /> Department
            </label>
            <select
              value={branchForm.departmentId}
              onChange={(e) =>
                setBranchForm((f) => ({ ...f, departmentId: e.target.value }))
              }
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>
              <GitBranch size={10} /> Branch Name *
            </label>
            <input
              placeholder="e.g. North Campus"
              value={branchForm.name}
              onChange={(e) =>
                setBranchForm((f) => ({ ...f, name: e.target.value }))
              }
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>
              <MapPin size={10} /> City *
            </label>
            <div style={{ display: "flex", gap: 7 }}>
              <select
                value={branchForm.city}
                onChange={(e) =>
                  setBranchForm((f) => ({ ...f, city: e.target.value }))
                }
                style={{ ...inputStyle, flex: 1, cursor: "pointer" }}
              >
                <option value="">Select City</option>
                {cityOpts.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  const v = window.prompt("Enter new city:");
                  if (v?.trim()) {
                    setCityOpts((p) => [...p, v.trim()]);
                    setBranchForm((f) => ({ ...f, city: v.trim() }));
                  }
                }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  flexShrink: 0,
                  border: `1px solid ${T.border}`,
                  background: T.inputBg,
                  color: T.textMuted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
          {branchForm.name && branchForm.city && (
            <div
              style={{
                borderRadius: 10,
                border: `1px solid ${T.accentLt}`,
                background: T.accentBg,
                padding: 13,
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: T.accent,
                  margin: "0 0 9px",
                }}
              >
                Preview
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background: `linear-gradient(135deg,${avatarGrad(branchForm.name)[0]},${avatarGrad(branchForm.name)[1]})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {branchForm.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: T.text,
                      margin: 0,
                    }}
                  >
                    {branchForm.name}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 2,
                    }}
                  >
                    <MapPin size={10} color={T.accent} />
                    <span
                      style={{ fontSize: 11, color: T.accent, fontWeight: 600 }}
                    >
                      {branchForm.city}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    /* Batch form */
    return (
      <div
        style={{
          padding: "18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {formError && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 12px",
              borderRadius: 8,
              background: T.dangerBg,
              border: `1px solid ${T.danger}30`,
              color: T.danger,
              fontSize: 12,
            }}
          >
            <AlertCircle size={13} /> <span>{formError}</span>
          </div>
        )}
        <div>
          <label style={labelStyle}>
            <Layers size={10} /> Batch Name *
          </label>
          <input
            placeholder="Enter batch name"
            value={batchForm.batchName}
            onChange={(e) =>
              setBatchForm((f) => ({ ...f, batchName: e.target.value }))
            }
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>
            <GitBranch size={10} /> Branch *
          </label>
          <select
            value={batchForm.branchId}
            onChange={(e) =>
              setBatchForm((f) => ({ ...f, branchId: e.target.value }))
            }
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="">Select Branch</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} — {b.city}
              </option>
            ))}
          </select>
        </div>
        {batchForm.batchName &&
          batchForm.branchId &&
          (() => {
            const br = branches.find(
              (b) => String(b.id) === String(batchForm.branchId),
            );
            return (
              <div
                style={{
                  borderRadius: 10,
                  border: `1px solid ${T.accentLt}`,
                  background: T.accentBg,
                  padding: 13,
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: T.accent,
                    margin: "0 0 9px",
                  }}
                >
                  Preview
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      background: `linear-gradient(135deg,${avatarGrad(batchForm.batchName)[0]},${avatarGrad(batchForm.batchName)[1]})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 13,
                      flexShrink: 0,
                    }}
                  >
                    {batchForm.batchName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.text,
                        margin: 0,
                      }}
                    >
                      {batchForm.batchName}
                    </p>
                    {br && (
                      <p
                        style={{
                          fontSize: 11,
                          color: T.textSub,
                          margin: "2px 0 0",
                        }}
                      >
                        {br.name} · {br.city}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
      </div>
    );
  };

  /* ─── Skeleton row ─── */
  const SkeletonRow = () => (
    <tr style={{ borderBottom: `1px solid ${T.borderSub}` }}>
      {[28, 140, 110, 90, 70].map((w, i) => (
        <td key={i} style={{ padding: "12px 14px" }}>
          <div
            style={{
              height: 9,
              width: w,
              borderRadius: 5,
              background: "#e2e8f0",
              animation: "shimmer 1.4s infinite",
            }}
          />
        </td>
      ))}
    </tr>
  );

  /* ═══════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{`
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes panelIn { from{transform:translateX(32px);opacity:0} to{transform:translateX(0);opacity:1} }
        .bca-row { transition: background 0.12s; }
        .bca-row:hover { background: ${T.rowHov} !important; }
        .bca-row:hover .bca-grip { opacity: 1 !important; }
        .bca-row:hover .bca-acts { opacity: 1 !important; }
        .bca-row:hover .bca-rname { color: ${T.accent} !important; }
        .bca-rname { transition: color 0.12s; }
        .bca-tab:hover { background: ${T.accentBg} !important; color: ${T.accent} !important; }
        .bca-icnbtn:hover { opacity: 0.78; }
        * { box-sizing: border-box; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: T.pageBg,
          color: T.text,
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "28px 32px 60px",
          }}
        >
          {/* ── PAGE HEADER ── */}
          <div
            style={{ animation: "fadeUp 0.35s ease both", marginBottom: 24 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <button
                onClick={() => navigate(-1)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 12px",
                  borderRadius: 7,
                  border: `1px solid ${T.border}`,
                  background: "#fff",
                  color: T.textSub,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <ArrowLeft size={12} /> Back
              </button>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: T.text,
                    margin: "0 0 4px",
                    letterSpacing: "-0.3px",
                  }}
                >
                  Batch Management
                </h1>
                <p style={{ fontSize: 13, color: T.textSub, margin: 0 }}>
                  Manage Departments, Branches &amp; Batches across all
                  organisations
                </p>
              </div>
              {/* Stats pills */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  {
                    label: "Departments",
                    val: departments.length,
                    color: "#8b5cf6",
                    bg: "#ede9fe",
                    Icon: Building2,
                  },
                  {
                    label: "Branches",
                    val: branches.length,
                    color: "#14b8a6",
                    bg: "#f0fdfa",
                    Icon: GitBranch,
                  },
                  {
                    label: "Batches",
                    val: batches.length,
                    color: "#f59e0b",
                    bg: "#fffbeb",
                    Icon: Layers,
                  },
                ].map(({ label, val, color, bg, Icon }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "7px 14px",
                      borderRadius: 99,
                      background: bg,
                      border: `1px solid ${color}25`,
                    }}
                  >
                    <Icon size={13} color={color} />
                    <span style={{ fontSize: 17, fontWeight: 800, color }}>
                      {val}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── GLOBAL ERROR ── */}
          {globalError && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 16px",
                borderRadius: 10,
                marginBottom: 18,
                background: T.dangerBg,
                border: `1px solid ${T.danger}30`,
                color: T.danger,
                fontSize: 12,
              }}
            >
              <AlertCircle size={14} />
              <span style={{ flex: 1 }}>{globalError}</span>
              <button
                onClick={load}
                style={{
                  padding: "3px 11px",
                  borderRadius: 7,
                  background: "rgba(239,68,68,0.12)",
                  border: `1px solid ${T.danger}30`,
                  color: T.danger,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* ── ACTION BAR ── */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            {/* Sub-tabs */}
            <div
              style={{
                display: "flex",
                gap: 3,
                background: "#fff",
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: 3,
                boxShadow: T.shadow,
              }}
            >
              {TABS.map((tab) => {
                const icons = {
                  Departments: <Building2 size={13} />,
                  Branches: <GitBranch size={13} />,
                  Batches: <Layers size={13} />,
                };
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={isActive ? "" : "bca-tab"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 16px",
                      borderRadius: 7,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: 12,
                      fontWeight: 600,
                      background: isActive ? T.accent : "transparent",
                      color: isActive ? "#fff" : T.textSub,
                      boxShadow: isActive
                        ? "0 2px 8px rgba(99,102,241,0.28)"
                        : "none",
                      transition: "all 0.18s",
                    }}
                  >
                    {icons[tab]} {tab}
                  </button>
                );
              })}
            </div>

            {/* Search + Create */}
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ position: "relative" }}>
                <Search
                  size={13}
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: T.textMuted,
                    pointerEvents: "none",
                  }}
                />
                <input
                  placeholder={`Search ${activeTab.toLowerCase()}…`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    paddingLeft: 32,
                    paddingRight: 12,
                    height: 35,
                    width: 210,
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: "#fff",
                    color: T.text,
                    fontSize: 12,
                    fontFamily: "inherit",
                    outline: "none",
                    boxShadow: T.shadow,
                  }}
                />
              </div>
              <button
                onClick={openCreate}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 16px",
                  borderRadius: 8,
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  border: "none",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 2px 8px rgba(99,102,241,0.32)",
                  whiteSpace: "nowrap",
                }}
              >
                <Plus size={13} />
                {activeTab === "Departments"
                  ? "Add Department"
                  : activeTab === "Branches"
                    ? "Add Branch"
                    : "Create Batch"}
              </button>
            </div>
          </div>

          {/* ── MAIN LAYOUT ── */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            {/* ── TABLE CARD ── */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  background: T.cardBg,
                  border: `1px solid ${T.border}`,
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: T.shadow,
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 20px",
                    borderBottom: `1px solid ${T.borderSub}`,
                    background: "#fafafa",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.text,
                        margin: 0,
                      }}
                    >
                      {activeTab === "Departments"
                        ? "All Departments"
                        : activeTab === "Branches"
                          ? "All Branches"
                          : "All Batches"}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: T.textMuted,
                        margin: "2px 0 0",
                      }}
                    >
                      {loading
                        ? "Loading…"
                        : `${current.length} record${current.length !== 1 ? "s" : ""} found`}
                      {!loading && (
                        <span style={{ marginLeft: 8, color: T.border }}>
                          · Drag to reorder
                        </span>
                      )}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "3px 10px",
                      borderRadius: 99,
                      background: T.accentBg,
                      color: T.accent,
                      border: `1px solid ${T.accentLt}`,
                    }}
                  >
                    {activeTab}
                  </span>
                </div>

                {/* Table */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr
                        style={{
                          background: "#f8fafc",
                          borderBottom: `1px solid ${T.borderSub}`,
                        }}
                      >
                        {activeTab === "Departments" &&
                          ["", "#", "Department", "Head", "Actions"].map(
                            (h, i) => (
                              <th
                                key={i}
                                style={{
                                  padding:
                                    i === 0
                                      ? "10px 6px 10px 16px"
                                      : "10px 14px",
                                  textAlign: i === 4 ? "right" : "left",
                                  fontSize: 10,
                                  fontWeight: 700,
                                  letterSpacing: "0.07em",
                                  textTransform: "uppercase",
                                  color: T.textMuted,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {h}
                              </th>
                            ),
                          )}
                        {activeTab === "Branches" &&
                          [
                            "",
                            "#",
                            "Branch",
                            "City",
                            "Department",
                            "Actions",
                          ].map((h, i) => (
                            <th
                              key={i}
                              style={{
                                padding:
                                  i === 0 ? "10px 6px 10px 16px" : "10px 14px",
                                textAlign: i === 5 ? "right" : "left",
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: "0.07em",
                                textTransform: "uppercase",
                                color: T.textMuted,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        {activeTab === "Batches" &&
                          [
                            "",
                            "#",
                            "Batch",
                            "Branch",
                            "Trainer",
                            "Actions",
                          ].map((h, i) => (
                            <th
                              key={i}
                              style={{
                                padding:
                                  i === 0 ? "10px 6px 10px 16px" : "10px 14px",
                                textAlign: i === 5 ? "right" : "left",
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: "0.07em",
                                textTransform: "uppercase",
                                color: T.textMuted,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading &&
                        [1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)}

                      {/* DEPARTMENTS */}
                      {!loading &&
                        activeTab === "Departments" &&
                        (filteredDepts.length === 0 ? (
                          <tr>
                            <td colSpan={5}>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "48px 0",
                                  gap: 10,
                                }}
                              >
                                <div
                                  style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: `1.5px dashed ${T.border}`,
                                    background: T.inputBg,
                                  }}
                                >
                                  <Building2 size={20} color={T.textMuted} />
                                </div>
                                <p
                                  style={{
                                    fontSize: 13,
                                    color: T.textSub,
                                    fontWeight: 500,
                                    margin: 0,
                                  }}
                                >
                                  {search
                                    ? "No departments match your search"
                                    : "No departments yet"}
                                </p>
                                <p
                                  style={{
                                    fontSize: 11,
                                    color: T.textMuted,
                                    margin: 0,
                                  }}
                                >
                                  Click "Add Department" to get started
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredDepts.map((dept, index) => {
                            const dh = deptDrag(index);
                            const isDragging = dActive === index,
                              isOver = dOver === index && dActive !== index;
                            const isDeleting = deleting === dept.id;
                            const [c1, c2] = avatarGrad(dept.head || dept.name);
                            return (
                              <tr
                                key={dept.id}
                                {...dh}
                                className="bca-row"
                                style={{
                                  borderBottom: `1px solid ${T.borderSub}`,
                                  background: isDragging
                                    ? T.inputBg
                                    : isOver
                                      ? T.accentBg
                                      : "transparent",
                                  opacity: isDragging || isDeleting ? 0.5 : 1,
                                  outline: isOver
                                    ? `2px solid ${T.accent}`
                                    : "none",
                                  outlineOffset: -1,
                                }}
                              >
                                <td
                                  style={{
                                    padding: "12px 6px 12px 16px",
                                    width: 28,
                                  }}
                                >
                                  <div
                                    className="bca-grip"
                                    style={{
                                      cursor: "grab",
                                      padding: 4,
                                      borderRadius: 6,
                                      background: T.inputBg,
                                      display: "inline-flex",
                                      opacity: 0,
                                    }}
                                  >
                                    <GripVertical
                                      size={12}
                                      color={T.textMuted}
                                    />
                                  </div>
                                </td>
                                <td style={{ padding: "12px 14px", width: 38 }}>
                                  <span
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 600,
                                      color: T.textMuted,
                                    }}
                                  >
                                    {String(index + 1).padStart(2, "0")}
                                  </span>
                                </td>
                                <td style={{ padding: "12px 14px" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 9,
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 9,
                                        background: "#ede9fe",
                                        border: "1px solid #c4b5fd",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                      }}
                                    >
                                      <Building2 size={14} color="#8b5cf6" />
                                    </div>
                                    <div>
                                      <span
                                        className="bca-rname"
                                        style={{
                                          fontSize: 13,
                                          fontWeight: 600,
                                          color: T.text,
                                          display: "block",
                                        }}
                                      >
                                        {dept.name}
                                      </span>
                                      {dept.organizationId && (
                                        <span
                                          style={{
                                            fontSize: 10,
                                            color: T.textMuted,
                                          }}
                                        >
                                          Org:{" "}
                                          {dept.organizationId
                                            .toString()
                                            .slice(0, 8)}
                                          …
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: "12px 14px" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 8,
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: "50%",
                                        background: `linear-gradient(135deg,${c1},${c2})`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        fontWeight: 800,
                                        fontSize: 9,
                                        flexShrink: 0,
                                      }}
                                    >
                                      {(dept.head || "?")
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                                    </div>
                                    <span
                                      style={{
                                        fontSize: 12,
                                        color: T.textSub,
                                        fontWeight: 500,
                                      }}
                                    >
                                      {dept.head || "—"}
                                    </span>
                                  </div>
                                </td>
                                <td
                                  style={{
                                    padding: "12px 20px 12px 14px",
                                    textAlign: "right",
                                  }}
                                >
                                  <div
                                    className="bca-acts"
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      gap: 5,
                                      opacity: 0,
                                    }}
                                  >
                                    <button
                                      onClick={() => openEdit(dept)}
                                      disabled={isDeleting}
                                      className="bca-icnbtn"
                                      style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 7,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "#eef2ff",
                                        border: `1px solid ${T.accentLt}`,
                                        color: T.accent,
                                        cursor: "pointer",
                                      }}
                                    >
                                      <Pencil size={12} />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(dept)}
                                      disabled={isDeleting}
                                      className="bca-icnbtn"
                                      style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 7,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: T.dangerBg,
                                        border: `1px solid ${T.danger}30`,
                                        color: T.danger,
                                        cursor: isDeleting
                                          ? "not-allowed"
                                          : "pointer",
                                      }}
                                    >
                                      {isDeleting ? (
                                        <Loader2
                                          size={12}
                                          style={{
                                            animation:
                                              "spin 0.8s linear infinite",
                                          }}
                                        />
                                      ) : (
                                        <Trash2 size={12} />
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ))}

                      {/* BRANCHES */}
                      {!loading &&
                        activeTab === "Branches" &&
                        (filteredBranches.length === 0 ? (
                          <tr>
                            <td colSpan={6}>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "48px 0",
                                  gap: 10,
                                }}
                              >
                                <div
                                  style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: `1.5px dashed ${T.border}`,
                                    background: T.inputBg,
                                  }}
                                >
                                  <GitBranch size={20} color={T.textMuted} />
                                </div>
                                <p
                                  style={{
                                    fontSize: 13,
                                    color: T.textSub,
                                    fontWeight: 500,
                                    margin: 0,
                                  }}
                                >
                                  {search
                                    ? "No branches match your search"
                                    : "No branches yet"}
                                </p>
                                <p
                                  style={{
                                    fontSize: 11,
                                    color: T.textMuted,
                                    margin: 0,
                                  }}
                                >
                                  Click "Add Branch" to get started
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredBranches.map((b, index) => {
                            const bh = branchDrag(index);
                            const isDragging = brActive === index,
                              isOver = brOver === index && brActive !== index;
                            const isDeleting = deleting === b.id;
                            const [c1, c2] = avatarGrad(b.name);
                            const parentDept = departments.find(
                              (d) => d.id === b.departmentId,
                            );
                            return (
                              <tr
                                key={b.id}
                                {...bh}
                                className="bca-row"
                                style={{
                                  borderBottom: `1px solid ${T.borderSub}`,
                                  background: isDragging
                                    ? T.inputBg
                                    : isOver
                                      ? T.accentBg
                                      : "transparent",
                                  opacity: isDragging || isDeleting ? 0.5 : 1,
                                  outline: isOver
                                    ? `2px solid ${T.accent}`
                                    : "none",
                                  outlineOffset: -1,
                                }}
                              >
                                <td
                                  style={{
                                    padding: "12px 6px 12px 16px",
                                    width: 28,
                                  }}
                                >
                                  <div
                                    className="bca-grip"
                                    style={{
                                      cursor: "grab",
                                      padding: 4,
                                      borderRadius: 6,
                                      background: T.inputBg,
                                      display: "inline-flex",
                                      opacity: 0,
                                    }}
                                  >
                                    <GripVertical
                                      size={12}
                                      color={T.textMuted}
                                    />
                                  </div>
                                </td>
                                <td style={{ padding: "12px 14px", width: 38 }}>
                                  <span
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 600,
                                      color: T.textMuted,
                                    }}
                                  >
                                    {String(index + 1).padStart(2, "0")}
                                  </span>
                                </td>
                                <td style={{ padding: "12px 14px" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 9,
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 9,
                                        background: `linear-gradient(135deg,${c1},${c2})`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        fontWeight: 800,
                                        fontSize: 13,
                                        flexShrink: 0,
                                      }}
                                    >
                                      {b.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <span
                                      className="bca-rname"
                                      style={{
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: T.text,
                                      }}
                                    >
                                      {b.name}
                                    </span>
                                  </div>
                                </td>
                                <td style={{ padding: "12px 14px" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 5,
                                    }}
                                  >
                                    <MapPin size={11} color="#14b8a6" />
                                    <span
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        padding: "2px 9px",
                                        borderRadius: 99,
                                        background: "#f0fdfa",
                                        border: "1px solid #99f6e4",
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: "#14b8a6",
                                      }}
                                    >
                                      {b.city}
                                    </span>
                                  </div>
                                </td>
                                <td style={{ padding: "12px 14px" }}>
                                  {parentDept ? (
                                    <span
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 4,
                                        padding: "2px 9px",
                                        borderRadius: 99,
                                        background: "#ede9fe",
                                        border: "1px solid #c4b5fd",
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: "#8b5cf6",
                                      }}
                                    >
                                      <Building2 size={9} /> {parentDept.name}
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        fontSize: 11,
                                        color: T.textMuted,
                                      }}
                                    >
                                      —
                                    </span>
                                  )}
                                </td>
                                <td
                                  style={{
                                    padding: "12px 20px 12px 14px",
                                    textAlign: "right",
                                  }}
                                >
                                  <div
                                    className="bca-acts"
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      gap: 5,
                                      opacity: 0,
                                    }}
                                  >
                                    <button
                                      onClick={() => openEdit(b)}
                                      disabled={isDeleting}
                                      className="bca-icnbtn"
                                      style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 7,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "#eef2ff",
                                        border: `1px solid ${T.accentLt}`,
                                        color: T.accent,
                                        cursor: "pointer",
                                      }}
                                    >
                                      <Pencil size={12} />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(b)}
                                      disabled={isDeleting}
                                      className="bca-icnbtn"
                                      style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 7,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: T.dangerBg,
                                        border: `1px solid ${T.danger}30`,
                                        color: T.danger,
                                        cursor: isDeleting
                                          ? "not-allowed"
                                          : "pointer",
                                      }}
                                    >
                                      {isDeleting ? (
                                        <Loader2
                                          size={12}
                                          style={{
                                            animation:
                                              "spin 0.8s linear infinite",
                                          }}
                                        />
                                      ) : (
                                        <Trash2 size={12} />
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ))}

                      {/* BATCHES */}
                      {!loading &&
                        activeTab === "Batches" &&
                        (filteredBatches.length === 0 ? (
                          <tr>
                            <td colSpan={6}>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "48px 0",
                                  gap: 10,
                                }}
                              >
                                <div
                                  style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: `1.5px dashed ${T.border}`,
                                    background: T.inputBg,
                                  }}
                                >
                                  <Layers size={20} color={T.textMuted} />
                                </div>
                                <p
                                  style={{
                                    fontSize: 13,
                                    color: T.textSub,
                                    fontWeight: 500,
                                    margin: 0,
                                  }}
                                >
                                  {search
                                    ? "No batches match your search"
                                    : "No batches yet"}
                                </p>
                                <p
                                  style={{
                                    fontSize: 11,
                                    color: T.textMuted,
                                    margin: 0,
                                  }}
                                >
                                  Click "Create Batch" to get started
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredBatches.map((b, index) => {
                            const bh = batchDrag(index);
                            const isDragging = baActive === index,
                              isOver = baOver === index && baActive !== index;
                            const isDeleting = deleting === b.id;
                            const [c1, c2] = avatarGrad(b.batchName);
                            const branchName =
                              branches.find((br) => br.id === b.branchId)
                                ?.name || `Branch #${b.branchId}`;
                            return (
                              <tr
                                key={b.id}
                                {...bh}
                                className="bca-row"
                                style={{
                                  borderBottom: `1px solid ${T.borderSub}`,
                                  background: isDragging
                                    ? T.inputBg
                                    : isOver
                                      ? T.accentBg
                                      : "transparent",
                                  opacity: isDragging || isDeleting ? 0.5 : 1,
                                  outline: isOver
                                    ? `2px solid ${T.accent}`
                                    : "none",
                                  outlineOffset: -1,
                                }}
                              >
                                <td
                                  style={{
                                    padding: "12px 6px 12px 16px",
                                    width: 28,
                                  }}
                                >
                                  <div
                                    className="bca-grip"
                                    style={{
                                      cursor: "grab",
                                      padding: 4,
                                      borderRadius: 6,
                                      background: T.inputBg,
                                      display: "inline-flex",
                                      opacity: 0,
                                    }}
                                  >
                                    <GripVertical
                                      size={12}
                                      color={T.textMuted}
                                    />
                                  </div>
                                </td>
                                <td style={{ padding: "12px 14px", width: 38 }}>
                                  <span
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 600,
                                      color: T.textMuted,
                                    }}
                                  >
                                    {String(index + 1).padStart(2, "0")}
                                  </span>
                                </td>
                                <td style={{ padding: "12px 14px" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 9,
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 9,
                                        background: `linear-gradient(135deg,${c1},${c2})`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        fontWeight: 800,
                                        fontSize: 13,
                                        flexShrink: 0,
                                      }}
                                    >
                                      {b.batchName?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                      <span
                                        className="bca-rname"
                                        style={{
                                          fontSize: 13,
                                          fontWeight: 600,
                                          color: T.text,
                                          display: "block",
                                        }}
                                      >
                                        {b.batchName}
                                      </span>
                                      <span
                                        style={{
                                          fontSize: 10,
                                          color: T.textMuted,
                                        }}
                                      >
                                        ID: {b.id}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: "12px 14px" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 5,
                                      fontSize: 12,
                                      color: T.textSub,
                                    }}
                                  >
                                    <GitBranch size={11} color={T.textMuted} />{" "}
                                    {branchName}
                                  </div>
                                </td>
                                <td style={{ padding: "12px 14px" }}>
                                  {b.trainerEmail ? (
                                    <span
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: "#10b981",
                                      }}
                                    >
                                      <CheckCircle2 size={11} color="#10b981" />{" "}
                                      {b.trainerEmail}
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 5,
                                        padding: "2px 9px",
                                        borderRadius: 99,
                                        background: "#fffbeb",
                                        border: "1px solid #fde68a",
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: "#ca8a04",
                                      }}
                                    >
                                      <span
                                        style={{
                                          width: 5,
                                          height: 5,
                                          borderRadius: "50%",
                                          background: "#f59e0b",
                                          display: "inline-block",
                                        }}
                                      />{" "}
                                      Not assigned
                                    </span>
                                  )}
                                </td>
                                <td
                                  style={{
                                    padding: "12px 20px 12px 14px",
                                    textAlign: "right",
                                  }}
                                >
                                  <div
                                    className="bca-acts"
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      gap: 5,
                                      opacity: 0,
                                    }}
                                  >
                                    <button
                                      //   onClick={() =>
                                      //     navigate(
                                      //       `/admin/batches/${b.id}/trainers`,
                                      //     )
                                      onClick={() => openManagePanel(b)}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 5,
                                        padding: "5px 11px",
                                        borderRadius: 7,
                                        background: "#eef2ff",
                                        border: `1px solid ${T.accentLt}`,
                                        color: T.accent,
                                        cursor: "pointer",
                                        fontSize: 11,
                                        fontWeight: 600,
                                        fontFamily: "inherit",
                                      }}
                                    >
                                      <UserCheck size={11} /> Manage
                                    </button>
                                    <button
                                      onClick={() => handleDelete(b)}
                                      disabled={isDeleting}
                                      className="bca-icnbtn"
                                      style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 7,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: T.dangerBg,
                                        border: `1px solid ${T.danger}30`,
                                        color: T.danger,
                                        cursor: isDeleting
                                          ? "not-allowed"
                                          : "pointer",
                                      }}
                                    >
                                      {isDeleting ? (
                                        <Loader2
                                          size={12}
                                          style={{
                                            animation:
                                              "spin 0.8s linear infinite",
                                          }}
                                        />
                                      ) : (
                                        <Trash2 size={12} />
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ── INLINE SLIDE PANEL ── */}
            {panelOpen && (
              <div
                style={{
                  flexShrink: 0,
                  width: 340,
                  opacity: panelVisible ? 1 : 0,
                  transform: panelVisible
                    ? "translateX(0)"
                    : "translateX(20px)",
                  transition: "opacity 0.25s ease, transform 0.25s ease",
                  pointerEvents: panelVisible ? "auto" : "none",
                }}
              >
                <div
                  style={{
                    borderRadius: 14,
                    border: `1px solid ${T.border}`,
                    background: T.cardBg,
                    overflow: "hidden",
                    boxShadow: T.shadowMd,
                    animation: "panelIn 0.25s ease",
                  }}
                >
                  {/* Panel header */}
                  <div
                    style={{
                      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      padding: "16px 18px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 9,
                            background: "rgba(255,255,255,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {panelMode === "create" ? (
                            <Plus size={14} color="#fff" />
                          ) : (
                            <Pencil size={14} color="#fff" />
                          )}
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#fff",
                              margin: 0,
                            }}
                          >
                            {panelMode === "create"
                              ? activeTab === "Departments"
                                ? "New Department"
                                : activeTab === "Branches"
                                  ? "New Branch"
                                  : "New Batch"
                              : `Edit ${activeTab.slice(0, -1)}`}
                          </p>
                          <p
                            style={{
                              fontSize: 11,
                              color: "rgba(255,255,255,0.65)",
                              margin: "2px 0 0",
                            }}
                          >
                            Fill in the details below
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={closePanel}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 7,
                          background: "rgba(255,255,255,0.18)",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <X size={13} color="#fff" />
                      </button>
                    </div>
                  </div>

                  {/* Panel body */}
                  <div
                    style={{
                      overflowY: "auto",
                      maxHeight: "calc(100vh - 320px)",
                    }}
                  >
                    <PanelContent />
                  </div>

                  {/* Panel footer */}
                  <div
                    style={{
                      borderTop: `1px solid ${T.borderSub}`,
                      padding: "13px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      onClick={closePanel}
                      disabled={saving}
                      style={{
                        padding: "7px 16px",
                        borderRadius: 8,
                        border: `1px solid ${T.border}`,
                        background: "#fff",
                        color: T.textSub,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "7px 18px",
                        borderRadius: 8,
                        background: saving
                          ? "#c7d2fe"
                          : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                        border: "none",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: saving ? "not-allowed" : "pointer",
                        fontFamily: "inherit",
                        boxShadow: saving
                          ? "none"
                          : "0 2px 8px rgba(99,102,241,0.3)",
                      }}
                    >
                      {saving ? (
                        <>
                          <Loader2
                            size={12}
                            style={{ animation: "spin 0.8s linear infinite" }}
                          />{" "}
                          Saving…
                        </>
                      ) : (
                        <>
                          {panelMode === "create" ? "Create" : "Save Changes"}{" "}
                          <ChevronRight size={12} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* ── MANAGE TRAINER/STUDENT PANEL ── */}
            {managePanelOpen && manageBatch && (
              <div
                style={{
                  flexShrink: 0,
                  width: 420,
                  opacity: managePanelVisible ? 1 : 0,
                  transform: managePanelVisible
                    ? "translateX(0)"
                    : "translateX(20px)",
                  transition: "opacity 0.25s ease, transform 0.25s ease",
                  pointerEvents: managePanelVisible ? "auto" : "none",
                }}
              >
                <div
                  style={{
                    borderRadius: 14,
                    border: `1px solid ${T.border}`,
                    background: T.cardBg,
                    overflow: "hidden",
                    boxShadow: T.shadowMd,
                    animation: "panelIn 0.25s ease",
                    maxHeight: "calc(100vh - 56px)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      padding: "16px 18px",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 9,
                            background: "rgba(255,255,255,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <UserCheck size={14} color="#fff" />
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#fff",
                              margin: 0,
                            }}
                          >
                            Manage Trainers &amp; Students
                          </p>
                          <p
                            style={{
                              fontSize: 11,
                              color: "rgba(255,255,255,0.65)",
                              margin: "2px 0 0",
                            }}
                          >
                            {manageBatch.batchName}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={closeManagePanel}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 7,
                          background: "rgba(255,255,255,0.18)",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <X size={13} color="#fff" />
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div
                    style={{ overflowY: "auto", padding: "14px 16px", flex: 1 }}
                  >
                    {manageError && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          padding: "9px 12px",
                          borderRadius: 8,
                          background: T.dangerBg,
                          border: `1px solid ${T.danger}30`,
                          color: T.danger,
                          fontSize: 12,
                          marginBottom: 12,
                        }}
                      >
                        <AlertCircle size={13} /> <span>{manageError}</span>
                      </div>
                    )}

                    {manageLoading ? (
                      <div
                        style={{
                          padding: "30px 0",
                          textAlign: "center",
                          color: T.textMuted,
                          fontSize: 12,
                        }}
                      >
                        Loading…
                      </div>
                    ) : (
                      <>
                        {/* ASSIGNED TRAINERS */}
                        {Object.keys(assignedMap).length === 0 ? (
                          <div
                            style={{
                              padding: "8px 0 14px",
                              fontSize: 11,
                              color: T.textMuted,
                            }}
                          >
                            No trainer assigned yet. Choose one below.
                          </div>
                        ) : (
                          Object.entries(assignedMap).map(
                            ([trainerEmail, students]) => {
                              const assignedStudents = (students || []).filter(
                                (e) => e && e !== "__EMPTY__",
                              );
                              const avail =
                                availableStudentsMap[trainerEmail] || [];
                              return (
                                <div
                                  key={trainerEmail}
                                  style={{
                                    border: `1px solid ${T.border}`,
                                    borderRadius: 12,
                                    marginBottom: 14,
                                    overflow: "hidden",
                                  }}
                                >
                                  {/* Trainer header */}
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      padding: "10px 12px",
                                      background: T.accentBg,
                                      borderBottom: `1px solid ${T.borderSub}`,
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 7,
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: 28,
                                          height: 28,
                                          borderRadius: 8,
                                          background: `linear-gradient(135deg,${avatarGrad(trainerEmail)[0]},${avatarGrad(trainerEmail)[1]})`,
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          color: "#fff",
                                          fontWeight: 800,
                                          fontSize: 11,
                                          flexShrink: 0,
                                        }}
                                      >
                                        {trainerEmail.slice(0, 2).toUpperCase()}
                                      </div>
                                      <div>
                                        <p
                                          style={{
                                            fontSize: 12,
                                            fontWeight: 700,
                                            color: T.text,
                                            margin: 0,
                                          }}
                                        >
                                          {trainerEmail}
                                        </p>
                                        <p
                                          style={{
                                            fontSize: 10,
                                            color: T.textMuted,
                                            margin: 0,
                                          }}
                                        >
                                          {assignedStudents.length} student
                                          {assignedStudents.length !== 1 && "s"}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleRemoveTrainer(trainerEmail)
                                      }
                                      style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 7,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: T.dangerBg,
                                        border: `1px solid ${T.danger}30`,
                                        color: T.danger,
                                        cursor: "pointer",
                                      }}
                                    >
                                      <UserMinus size={12} />
                                    </button>
                                  </div>

                                  {/* Assigned students */}
                                  <div style={{ padding: "10px 12px" }}>
                                    <p
                                      style={{
                                        fontSize: 9.5,
                                        fontWeight: 700,
                                        letterSpacing: "0.07em",
                                        textTransform: "uppercase",
                                        color: T.textMuted,
                                        margin: "0 0 6px",
                                      }}
                                    >
                                      Assigned Students
                                    </p>
                                    {assignedStudents.length === 0 ? (
                                      <p
                                        style={{
                                          fontSize: 11,
                                          color: T.textMuted,
                                          fontStyle: "italic",
                                          margin: 0,
                                        }}
                                      >
                                        No students assigned
                                      </p>
                                    ) : (
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: 5,
                                        }}
                                      >
                                        {assignedStudents.map((email) => (
                                          <div
                                            key={email}
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                              padding: "5px 8px",
                                              borderRadius: 7,
                                              background: T.successBg,
                                              border: "1px solid #6ee7b740",
                                            }}
                                          >
                                            <span
                                              style={{
                                                fontSize: 11,
                                                color: T.text,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 4,
                                              }}
                                            >
                                              <Mail
                                                size={10}
                                                color={T.textMuted}
                                              />{" "}
                                              {email}
                                            </span>
                                            <button
                                              onClick={() =>
                                                handleRemoveStudent(
                                                  trainerEmail,
                                                  email,
                                                )
                                              }
                                              style={{
                                                width: 22,
                                                height: 22,
                                                borderRadius: 6,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background: "transparent",
                                                border: "none",
                                                color: T.danger,
                                                cursor: "pointer",
                                              }}
                                            >
                                              <UserMinus size={11} />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Available students for this trainer */}
                                    <p
                                      style={{
                                        fontSize: 9.5,
                                        fontWeight: 700,
                                        letterSpacing: "0.07em",
                                        textTransform: "uppercase",
                                        color: T.textMuted,
                                        margin: "10px 0 6px",
                                      }}
                                    >
                                      Available Students (no org)
                                    </p>
                                    {avail.length === 0 ? (
                                      <p
                                        style={{
                                          fontSize: 11,
                                          color: T.textMuted,
                                          fontStyle: "italic",
                                          margin: 0,
                                        }}
                                      >
                                        None available
                                      </p>
                                    ) : (
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: 5,
                                        }}
                                      >
                                        {avail.map((s) => (
                                          <div
                                            key={s.email}
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                              padding: "5px 8px",
                                              borderRadius: 7,
                                              background: T.inputBg,
                                              border: `1px solid ${T.border}`,
                                            }}
                                          >
                                            <span
                                              style={{
                                                fontSize: 11,
                                                color: T.text,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 4,
                                              }}
                                            >
                                              <Mail
                                                size={10}
                                                color={T.textMuted}
                                              />{" "}
                                              {s.displayName || s.email}
                                            </span>
                                            <button
                                              onClick={() =>
                                                handleAssignStudent(
                                                  trainerEmail,
                                                  s.email,
                                                )
                                              }
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 4,
                                                padding: "3px 8px",
                                                borderRadius: 6,
                                                background: T.accent,
                                                border: "none",
                                                color: "#fff",
                                                fontSize: 10,
                                                fontWeight: 700,
                                                cursor: "pointer",
                                              }}
                                            >
                                              <UserPlus size={10} /> Add
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            },
                          )
                        )}

                        {/* AVAILABLE TRAINERS — only show if NO trainer assigned yet */}
                        {Object.keys(assignedMap).length === 0 && (
                          <>
                            <p
                              style={{
                                fontSize: 9.5,
                                fontWeight: 700,
                                letterSpacing: "0.07em",
                                textTransform: "uppercase",
                                color: T.textMuted,
                                margin: "0 0 8px",
                              }}
                            >
                              Available Trainers (no org)
                            </p>
                            {availableTrainers.length === 0 ? (
                              <p
                                style={{
                                  fontSize: 11,
                                  color: T.textMuted,
                                  fontStyle: "italic",
                                }}
                              >
                                No available trainers without an organization.
                              </p>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 6,
                                }}
                              >
                                {availableTrainers.map((t) => (
                                  <div
                                    key={t.email}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      padding: "8px 10px",
                                      borderRadius: 9,
                                      border: `1px solid ${T.border}`,
                                      background: T.inputBg,
                                    }}
                                  >
                                    <div>
                                      <p
                                        style={{
                                          fontSize: 12,
                                          fontWeight: 600,
                                          color: T.text,
                                          margin: 0,
                                        }}
                                      >
                                        {t.displayName || t.email}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: 10,
                                          color: T.textMuted,
                                          margin: 0,
                                        }}
                                      >
                                        {t.email}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleAssignTrainer(t.email)
                                      }
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 5,
                                        padding: "5px 11px",
                                        borderRadius: 7,
                                        background:
                                          "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                        border: "none",
                                        color: "#fff",
                                        fontSize: 11,
                                        fontWeight: 700,
                                        cursor: "pointer",
                                      }}
                                    >
                                      <UserPlus size={11} /> Assign
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* end main layout */}
        </div>
      </div>
    </>
  );
};

export default SuperAdminBatchControl;













































































