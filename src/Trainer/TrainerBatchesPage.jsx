// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getTrainerBatches } from "../services/batchService";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// const TrainerBatchesPage = () => {
//   const [batches, setBatches] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const load = async () => {
//       const res = await getTrainerBatches();
//       setBatches(res || []);
//     };
//     load();
//   }, []);

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">My Batches</h1>

//       {batches.map((b) => (
//         <Card key={b.id}>
//           <CardContent className="flex justify-between items-center p-4">
//             <div>
//               <p className="font-semibold">{b.batchName}</p>
//               <p className="text-sm text-muted-foreground">Batch ID: {b.id}</p>
//             </div>

//             <Button
//               onClick={() => navigate(`/trainer/batches/${b.id}/students`)}
//             >
//               Open Classroom
//             </Button>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default TrainerBatchesPage;
















import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrainerBatches } from "../services/batchService";
import { ChevronDown, ChevronUp, Users, BookOpen, Hash, GraduationCap } from "lucide-react";

const TrainerBatchesPage = () => {
  const [batches, setBatches] = useState([]);
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const res = await getTrainerBatches();
      setBatches(res || []);
    };
    load();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{
      padding: "20px 24px",
      maxWidth: "780px",
      fontFamily: "inherit",
    }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <div style={{
          background: "var(--primary, #2563eb)",
          color: "#fff",
          borderRadius: "10px",
          width: "36px", height: "36px",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <GraduationCap size={18} />
        </div>
        <div>
          <h1 style={{
            fontSize: "18px", fontWeight: "700", margin: 0,
            color: "var(--foreground, #0f172a)",
          }}>
            My Batches
          </h1>
          <p style={{ fontSize: "12px", color: "var(--muted-foreground, #94a3b8)", margin: 0 }}>
            {batches.length} batch{batches.length !== 1 ? "es" : ""} assigned
          </p>
        </div>
      </div>

      {/* ── Cards ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {batches.map((b, idx) => {
          const isOpen = expanded[b.id];
          const accent = "#2563eb";

          return (
            <div
              key={b.id}
              style={{
                border: "1px solid var(--border, #e2e8f0)",
                borderRadius: "12px",
                overflow: "hidden",
                background: "var(--card, #ffffff)",
                boxShadow: isOpen
                  ? "0 2px 12px rgba(37,99,235,0.08)"
                  : "0 1px 3px rgba(0,0,0,0.05)",
                transition: "box-shadow 0.2s",
              }}
            >
              {/* Row */}
              <div
                onClick={() => toggleExpand(b.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  cursor: "pointer",
                  userSelect: "none",
                  background: isOpen
                    ? "var(--accent, #f1f5f9)"
                    : "var(--card, #ffffff)",
                  transition: "background 0.15s",
                  gap: "12px",
                }}
                onMouseEnter={e =>
                  e.currentTarget.style.background = "var(--accent, #f1f5f9)"
                }
                onMouseLeave={e =>
                  e.currentTarget.style.background = isOpen
                    ? "var(--accent, #f1f5f9)"
                    : "var(--card, #ffffff)"
                }
              >
                {/* Left */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {/* Index badge */}
                  <div style={{
                    width: "32px", height: "32px",
                    borderRadius: "8px",
                    background: isOpen ? accent : "var(--accent, #eff6ff)",
                    color: isOpen ? "#fff" : accent,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    transition: "background 0.2s, color 0.2s",
                    fontSize: "13px", fontWeight: "700",
                  }}>
                    {idx + 1}
                  </div>

                  <div>
                    <p style={{
                      fontWeight: "600", fontSize: "14px", margin: 0,
                      color: "var(--foreground, #0f172a)",
                      letterSpacing: "0.01em",
                    }}>
                      {b.batchName}
                    </p>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "3px", marginTop: "1px"
                    }}>
                      <Hash size={10} color="var(--muted-foreground, #94a3b8)" />
                      <span style={{ fontSize: "11px", color: "var(--muted-foreground, #94a3b8)" }}>
                        Batch ID: {b.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div style={{
                  color: "var(--muted-foreground, #94a3b8)",
                  display: "flex",
                  transition: "transform 0.2s",
                  transform: isOpen ? "rotate(0deg)" : "rotate(0deg)",
                }}>
                  {isOpen
                    ? <ChevronUp size={16} />
                    : <ChevronDown size={16} />
                  }
                </div>
              </div>

              {/* Expanded panel */}
              {isOpen && (
                <div style={{
                  padding: "12px 16px",
                  borderTop: "1px solid var(--border, #e2e8f0)",
                  background: "var(--card, #ffffff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <BookOpen size={14} color={accent} />
                    <p style={{
                      fontSize: "12px",
                      color: "var(--muted-foreground, #64748b)",
                      margin: 0,
                    }}>
                      Manage students, content & more for this batch.
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/trainer/batches/${b.id}/students`);
                    }}
                    style={{
                      background: accent,
                      color: "#fff",
                      border: "none",
                      borderRadius: "7px",
                      padding: "7px 16px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      letterSpacing: "0.02em",
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    <Users size={13} />
                    Open Classroom
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Empty state ── */}
      {batches.length === 0 && (
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "60px 0",
          gap: "8px",
        }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "14px",
            background: "var(--accent, #f1f5f9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "4px",
          }}>
            <GraduationCap size={22} color="var(--muted-foreground, #94a3b8)" />
          </div>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--muted-foreground, #94a3b8)", margin: 0 }}>
            No batches assigned yet
          </p>
          <p style={{ fontSize: "12px", color: "var(--muted-foreground, #cbd5e1)", margin: 0 }}>
            Your batches will appear here once assigned.
          </p>
        </div>
      )}
    </div>
  );
};

export default TrainerBatchesPage;
