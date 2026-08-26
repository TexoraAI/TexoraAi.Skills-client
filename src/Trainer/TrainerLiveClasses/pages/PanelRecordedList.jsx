import { useState, useEffect } from "react";
import { Video, Upload, Search, Activity } from "lucide-react";
import { getMyRecordings } from "@/services/liveSessionService";
import { inputStyle } from "../data/utils";
import RecordedVideoCard from "../components/RecordedVideoCard";
import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function PanelRecordedList({ t, isDark, navigate, onEdit, onUpload }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyRecordings();
        setVideos(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load recordings.");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = videos.filter(
    (v) =>
      v.title?.toLowerCase().includes(search.toLowerCase()) ||
      v.batchName?.toLowerCase().includes(search.toLowerCase()),
  );
  const readyCount = videos.filter((v) => v.status === "READY").length;
  const processingCount = videos.filter(
    (v) => v.status === "PROCESSING",
  ).length;
  const iStyle = inputStyle(t);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <p
          style={{
            fontSize: 12,
            color: t.textSub,
            fontFamily: FONT_FAMILY,
            margin: 0,
            fontWeight: FONT_WEIGHT.medium,
          }}
        >
          {videos.length} video{videos.length !== 1 ? "s" : ""} · {readyCount}{" "}
          ready{processingCount > 0 ? ` · ${processingCount} processing` : ""}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: t.actBg,
              border: `1px solid ${t.actBorder}`,
              borderRadius: 10,
              padding: "8px 14px",
            }}
          >
            <Activity size={12} color={t.actIcon} />
            <div
              style={{
                display: "flex",
                gap: 3,
                alignItems: "flex-end",
                height: 14,
              }}
            >
              <span
                className="d1"
                style={{
                  width: 3,
                  height: 10,
                  borderRadius: 2,
                  background: t.actBar,
                  display: "block",
                }}
              />
              <span
                className="d2"
                style={{
                  width: 3,
                  height: 14,
                  borderRadius: 2,
                  background: t.actBar,
                  display: "block",
                }}
              />
              <span
                className="d3"
                style={{
                  width: 3,
                  height: 7,
                  borderRadius: 2,
                  background: t.actBar,
                  display: "block",
                }}
              />
            </div>
          </div>
          <button
            onClick={onUpload}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 18px",
              borderRadius: 10,
              border: "1px solid rgba(45,212,191,0.3)",
              background: "rgba(45,212,191,0.08)",
              color: "#2dd4bf",
              fontSize: 11,
              fontWeight: FONT_WEIGHT.bold,
              cursor: "pointer",
              fontFamily: FONT_FAMILY,
              transition: "all 0.2s",
            }}
          >
            <Upload size={13} /> Upload Video
          </button>
        </div>
      </div>
      {error && (
        <div
          style={{
            background: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.3)",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 14,
            fontSize: 12,
            color: "#f87171",
            fontFamily: FONT_FAMILY,
          }}
        >
          ⚠️ {error}
        </div>
      )}
      <div
        style={{
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: 16,
          padding: "12px 16px",
          boxShadow: t.shadow,
          marginBottom: 20,
          position: "relative",
        }}
      >
        <Search
          size={13}
          style={{
            position: "absolute",
            left: 28,
            top: "50%",
            transform: "translateY(-50%)",
            color: t.textMuted,
          }}
        />
        <input
          placeholder="Search by title or batch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...iStyle, padding: "8px 14px 8px 34px" }}
        />
      </div>
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 14,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
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
                  height: 160,
                  background: t.barBg,
                  animation: "pulse 1.5s ease infinite",
                }}
              />
              <div
                style={{
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    height: 12,
                    borderRadius: 6,
                    background: t.barBg,
                    animation: "pulse 1.5s ease infinite",
                    width: "75%",
                  }}
                />
                <div
                  style={{
                    height: 10,
                    borderRadius: 5,
                    background: t.barBg,
                    animation: "pulse 1.5s ease infinite",
                    width: "50%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 0",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1.5px dashed ${t.emptyBorder}`,
              background: t.emptyBg,
            }}
          >
            <Video size={28} color={t.emptyIcon} />
          </div>
          <p
            style={{
              fontSize: 13,
              color: t.textMuted,
              fontWeight: FONT_WEIGHT.semibold,
              fontFamily: FONT_FAMILY,
              margin: 0,
            }}
          >
            {search ? "No videos match your search" : "No recordings yet"}
          </p>
          <button
            onClick={onUpload}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              border: "1px solid rgba(244,63,94,0.25)",
              background: "rgba(244,63,94,0.08)",
              color: "#f43f5e",
              fontSize: 11,
              fontWeight: FONT_WEIGHT.bold,
              cursor: "pointer",
              fontFamily: FONT_FAMILY,
            }}
          >
            Upload Your First Video →
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 14,
          }}
        >
          {filtered.map((video, i) => (
            <RecordedVideoCard
              key={video.id}
              video={video}
              t={t}
              isDark={isDark}
              index={i}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
