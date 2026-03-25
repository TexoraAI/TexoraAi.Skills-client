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
import { ChevronDown, ChevronUp, Users, BookOpen, Hash } from "lucide-react";

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
    <div style={{ padding: "24px", maxWidth: "800px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <div style={{
          background: "#2563eb",
          color: "#fff",
          borderRadius: "10px",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Users size={20} />
        </div>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b", margin: 0 }}>
            My Batches
          </h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>
            {batches.length} batch{batches.length !== 1 ? "es" : ""} assigned
          </p>
        </div>
      </div>

      {/* Batch Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {batches.map((b) => {
          const isOpen = expanded[b.id];
          return (
            <div
              key={b.id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                transition: "box-shadow 0.2s",
              }}
            >
              {/* Collapsed Row */}
              <div
                onClick={() => toggleExpand(b.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  cursor: "pointer",
                  background: isOpen ? "#f8fafc" : "#fff",
                  transition: "background 0.15s",
                  userSelect: "none",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                onMouseLeave={e => e.currentTarget.style.background = isOpen ? "#f8fafc" : "#fff"}
              >
                {/* Left */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    background: "#eff6ff",
                    color: "#2563eb",
                    borderRadius: "10px",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <p style={{ fontWeight: "600", fontSize: "15px", color: "#1e293b", margin: 0 }}>
                      {b.batchName}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                      <Hash size={11} color="#94a3b8" />
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>Batch ID: {b.id}</span>
                    </div>
                  </div>
                </div>

                {/* Right: chevron */}
                <div style={{ color: "#94a3b8", display: "flex" }}>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Expanded Content */}
              {isOpen && (
                <div style={{
                  padding: "14px 20px 18px",
                  borderTop: "1px solid #f1f5f9",
                  background: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap"
                }}>
                  <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                    Click <strong style={{ color: "#334155" }}>Open Classroom</strong> to manage
                    students, content, and more for this batch.
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/trainer/batches/${b.id}/students`);
                    }}
                    style={{
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "9px 20px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
                    onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}
                  >
                    Open Classroom
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {batches.length === 0 && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 0",
          color: "#cbd5e1"
        }}>
          <Users size={44} style={{ marginBottom: "12px", opacity: 0.3 }} />
          <p style={{ fontSize: "15px", fontWeight: "600", color: "#94a3b8", margin: 0 }}>
            No batches assigned yet
          </p>
          <p style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "6px" }}>
            Your batches will appear here once assigned.
          </p>
        </div>
      )}
    </div>
  );
};

export default TrainerBatchesPage;
