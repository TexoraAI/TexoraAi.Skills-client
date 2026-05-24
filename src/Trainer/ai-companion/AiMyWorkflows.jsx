// // src/Trainer/ai-companion/AiMyWorkflows.jsx
import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Zap,
  ChevronDown,
  Copy,
  Edit,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  getMyWorkflows,
  deleteWorkflow,
  duplicateWorkflow,
  updateWorkflowStatus,
} from "../../services/liveSessionService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const normalizeList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data?.content)) return res.data.content;
  return [];
};

const safeJsonParse = (value, fallback) => {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const getNodeCount = (workflow) => {
  const nodes = safeJsonParse(workflow.nodesJson, []);
  return Array.isArray(nodes) ? nodes.length : 0;
};

const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr || "—";
  }
};

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const s = (status || "DRAFT").toUpperCase();
  const colors = {
    DRAFT: {
      bg: "rgba(96,165,250,0.1)",
      color: "#2563eb",
      border: "rgba(96,165,250,0.2)",
    },
    ACTIVE: {
      bg: "rgba(5,150,105,0.1)",
      color: "#059669",
      border: "rgba(5,150,105,0.2)",
    },
    INACTIVE: {
      bg: "rgba(245,158,11,0.1)",
      color: "#d97706",
      border: "rgba(245,158,11,0.2)",
    },
  };
  const c = colors[s] || colors.DRAFT;
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: 99,
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {s}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function AiMyWorkflows({
  isDark,
  onCreateNew,
  onEditWorkflow,
  onNavigate,
}) {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const bg = isDark ? "#0d1117" : "#f8fafc";
  const border = isDark ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  const inputBg = isDark ? "#1f2937" : "#ffffff";
  const tableBg = isDark ? "rgba(255,255,255,0.02)" : "#ffffff";
  const tableHover = isDark ? "rgba(255,255,255,0.04)" : "#f9fafb";

  // ── Fetch workflows from backend ──────────────────────────────────────────

  const fetchWorkflows = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (searchQ.trim()) params.search = searchQ.trim();
      if (filterStatus !== "ALL") params.status = filterStatus;

      const res = await getMyWorkflows(params);
      setWorkflows(normalizeList(res));
    } catch (err) {
      console.error("Failed to load workflows:", err);
      setError("Failed to load workflows. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchQ, filterStatus]);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workflow?"))
      return;
    try {
      await deleteWorkflow(id);
      fetchWorkflows();
    } catch (err) {
      console.error("Failed to delete workflow:", err);
      alert("Failed to delete workflow. Please try again.");
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await duplicateWorkflow(id);
      fetchWorkflows();
    } catch (err) {
      console.error("Failed to duplicate workflow:", err);
      alert("Failed to duplicate workflow. Please try again.");
    }
  };

  const handleStatusToggle = async (workflow) => {
    const newStatus =
      (workflow.status || "").toUpperCase() === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";
    try {
      await updateWorkflowStatus(workflow.id, newStatus);
      fetchWorkflows();
    } catch (err) {
      console.error("Failed to update workflow status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleEdit = (workflow) => {
    if (onEditWorkflow) {
      onEditWorkflow(workflow);
    } else if (onNavigate) {
      onNavigate("workflow-create");
    }
  };

  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    } else if (onNavigate) {
      onNavigate("workflow-create");
    }
  };

  // ── Dropdown ──────────────────────────────────────────────────────────────

  const DropdownMenu = ({ show, onClose, children }) =>
    show ? (
      <div
        style={{
          position: "absolute",
          top: "100%",
          right: 0,
          marginTop: 6,
          background: inputBg,
          border: `1px solid ${border}`,
          borderRadius: 10,
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          zIndex: 20,
          minWidth: 160,
          overflow: "hidden",
        }}
        onMouseLeave={onClose}
      >
        {children}
      </div>
    ) : null;

  const DropdownItem = ({ label, value, current, onClick }) => (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "8px 14px",
        border: "none",
        background: current === value ? "#2563eb" : "transparent",
        color: current === value ? "#fff" : textSecondary,
        fontSize: 12,
        fontFamily: "'Poppins', sans-serif",
        cursor: "pointer",
        textAlign: "left",
      }}
      onMouseEnter={(e) => {
        if (current !== value)
          e.currentTarget.style.background = isDark
            ? "rgba(255,255,255,0.05)"
            : "#f9fafb";
      }}
      onMouseLeave={(e) => {
        if (current !== value) e.currentTarget.style.background = "transparent";
      }}
    >
      {label}
    </button>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        flex: 1,
        background: bg,
        overflowY: "auto",
        padding: "32px 40px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: textPrimary,
              margin: "0 0 4px 0",
              letterSpacing: "-0.01em",
            }}
          >
            My Workflows
          </h2>
          <p style={{ fontSize: 12, color: textSecondary, margin: 0 }}>
            {loading
              ? "Loading..."
              : `${workflows.length} workflow${workflows.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 16px",
            borderRadius: 9,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            fontSize: 13,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
        >
          <Plus size={14} /> Create new
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {/* Search */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 13px",
            borderRadius: 9,
            border: `1px solid ${border}`,
            background: inputBg,
          }}
        >
          <Search size={14} color={textSecondary} />
          <input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search workflow name..."
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              color: textPrimary,
              fontSize: 12,
              fontFamily: "'Poppins', sans-serif",
              outline: "none",
            }}
          />
        </div>

        {/* Status filter */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowStatusMenu((p) => !p)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 13px",
              borderRadius: 9,
              border: `1px solid ${filterStatus !== "ALL" ? "#2563eb" : border}`,
              background:
                filterStatus !== "ALL" ? "rgba(37,99,235,0.08)" : inputBg,
              color: filterStatus !== "ALL" ? "#2563eb" : textSecondary,
              fontSize: 12,
              fontFamily: "'Poppins', sans-serif",
              cursor: "pointer",
            }}
          >
            <Filter size={13} />
            {filterStatus === "ALL" ? "Status" : filterStatus}
            <ChevronDown size={11} />
          </button>
          <DropdownMenu
            show={showStatusMenu}
            onClose={() => setShowStatusMenu(false)}
          >
            {["ALL", "ACTIVE", "INACTIVE", "DRAFT"].map((s) => (
              <DropdownItem
                key={s}
                label={s === "ALL" ? "All Status" : s}
                value={s}
                current={filterStatus}
                onClick={() => {
                  setFilterStatus(s);
                  setShowStatusMenu(false);
                }}
              />
            ))}
          </DropdownMenu>
        </div>

        {/* Refresh */}
        <button
          onClick={fetchWorkflows}
          title="Refresh"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 9,
            border: `1px solid ${border}`,
            background: inputBg,
            color: textSecondary,
            cursor: "pointer",
          }}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            borderRadius: 10,
            background: isDark ? "rgba(220,38,38,0.10)" : "#fef2f2",
            border: "1px solid #fecaca",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: "#dc2626",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {error}
          </span>
          <button
            onClick={fetchWorkflows}
            style={{
              padding: "6px 14px",
              borderRadius: 7,
              border: "none",
              background: "#dc2626",
              color: "#fff",
              fontSize: 12,
              fontFamily: "'Poppins', sans-serif",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "48px 20px",
            color: textSecondary,
            fontSize: 13,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Loading workflows...
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && workflows.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "56px 20px",
            borderRadius: 12,
            border: `1px dashed ${border}`,
            background: tableBg,
          }}
        >
          <Zap
            size={30}
            color={textSecondary}
            style={{ margin: "0 auto 14px" }}
          />
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: textPrimary,
              margin: "0 0 6px 0",
            }}
          >
            No workflows found
          </p>
          <p
            style={{ fontSize: 12, color: textSecondary, margin: "0 0 16px 0" }}
          >
            {filterStatus !== "ALL" || searchQ
              ? "Try adjusting your search filters."
              : "You haven't created any workflows yet."}
          </p>
          {filterStatus === "ALL" && !searchQ && (
            <button
              onClick={handleCreateNew}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontSize: 12,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Plus size={12} /> Create your first workflow
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && !error && workflows.length > 0 && (
        <div
          style={{
            background: tableBg,
            borderRadius: 12,
            border: `1px solid ${border}`,
            overflow: "hidden",
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2.5fr 1fr 1fr 70px 1fr auto",
              borderBottom: `1px solid ${border}`,
              background: isDark ? "rgba(255,255,255,0.02)" : "#f9fafb",
              padding: "10px 16px",
            }}
          >
            {[
              "Name",
              "Last Updated",
              "Status",
              "Nodes",
              "Trigger",
              "Actions",
            ].map((h) => (
              <div
                key={h}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: textSecondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {workflows.map((workflow) => {
            const nodeCount = getNodeCount(workflow);
            const isActive = (workflow.status || "").toUpperCase() === "ACTIVE";

            return (
              <div
                key={workflow.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.5fr 1fr 1fr 70px 1fr auto",
                  borderBottom: `1px solid ${border}`,
                  padding: "12px 16px",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = tableHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {/* Name */}
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: textPrimary,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {workflow.name || "Untitled Workflow"}
                  </div>
                  {workflow.description && (
                    <div
                      style={{
                        fontSize: 11,
                        color: textSecondary,
                        marginTop: 2,
                        fontFamily: "'Poppins', sans-serif",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 280,
                      }}
                    >
                      {workflow.description}
                    </div>
                  )}
                  {workflow.sourceType && (
                    <div
                      style={{
                        fontSize: 9,
                        color: textSecondary,
                        marginTop: 2,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {workflow.sourceType}
                      {workflow.category ? ` · ${workflow.category}` : ""}
                    </div>
                  )}
                </div>

                {/* Last updated */}
                <div
                  style={{
                    fontSize: 11,
                    color: textSecondary,
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {formatDate(workflow.updatedAt || workflow.createdAt)}
                </div>

                {/* Status */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <StatusBadge status={workflow.status || "DRAFT"} />
                </div>

                {/* Nodes */}
                <div
                  style={{
                    fontSize: 12,
                    color: textSecondary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {nodeCount}
                </div>

                {/* Trigger */}
                <div
                  style={{
                    fontSize: 10,
                    color: textSecondary,
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "'Poppins', sans-serif",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 110,
                    }}
                  >
                    {workflow.triggerType || "—"}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(workflow)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: `1px solid ${border}`,
                      background: "transparent",
                      color: textSecondary,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#2563eb";
                      e.currentTarget.style.color = "#2563eb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = border;
                      e.currentTarget.style.color = textSecondary;
                    }}
                    title="Edit"
                  >
                    <Edit size={12} />
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={() => handleDuplicate(workflow.id)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: `1px solid ${border}`,
                      background: "transparent",
                      color: textSecondary,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#059669";
                      e.currentTarget.style.color = "#059669";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = border;
                      e.currentTarget.style.color = textSecondary;
                    }}
                    title="Duplicate"
                  >
                    <Copy size={12} />
                  </button>

                  {/* Status toggle (ACTIVE/INACTIVE only — skip DRAFT) */}
                  {(workflow.status || "").toUpperCase() !== "DRAFT" && (
                    <button
                      onClick={() => handleStatusToggle(workflow)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        border: `1px solid ${border}`,
                        background: "transparent",
                        color: isActive ? "#059669" : textSecondary,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.12s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = isActive
                          ? "#d97706"
                          : "#059669";
                        e.currentTarget.style.color = isActive
                          ? "#d97706"
                          : "#059669";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = border;
                        e.currentTarget.style.color = isActive
                          ? "#059669"
                          : textSecondary;
                      }}
                      title={isActive ? "Set Inactive" : "Set Active"}
                    >
                      {isActive ? (
                        <ToggleRight size={13} />
                      ) : (
                        <ToggleLeft size={13} />
                      )}
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(workflow.id)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: `1px solid ${border}`,
                      background: "transparent",
                      color: textSecondary,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#dc2626";
                      e.currentTarget.style.color = "#dc2626";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = border;
                      e.currentTarget.style.color = textSecondary;
                    }}
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
