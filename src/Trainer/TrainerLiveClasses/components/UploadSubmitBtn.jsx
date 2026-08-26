import { useState } from "react";
import { Upload, UploadCloud, CheckCircle2 } from "lucide-react";
import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function UploadSubmitBtn({ uploading, success, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={uploading || success}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        padding: "14px 0",
        borderRadius: 14,
        border: "none",
        background: success
          ? "#34d399"
          : uploading
            ? "rgba(45,212,191,0.5)"
            : hov
              ? "#14b8a6"
              : "#2dd4bf",
        color: uploading ? "rgba(255,255,255,0.7)" : "#0f172a",
        fontSize: 13,
        fontWeight: FONT_WEIGHT.bold,
        cursor: uploading || success ? "not-allowed" : "pointer",
        fontFamily: FONT_FAMILY,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "all 0.2s",
        boxShadow:
          hov && !uploading ? "0 8px 24px rgba(45,212,191,0.35)" : "none",
      }}
    >
      {success ? (
        <>
          <CheckCircle2 size={16} /> Uploaded!
        </>
      ) : uploading ? (
        <>
          <span
            style={{
              width: 14,
              height: 14,
              border: "2px solid rgba(15,23,42,0.3)",
              borderTop: "2px solid rgba(15,23,42,0.8)",
              borderRadius: "50%",
              display: "inline-block",
              animation: "spin 0.8s linear infinite",
            }}
          />
          Uploading...
        </>
      ) : (
        <>
          <UploadCloud size={16} /> Upload & Publish
        </>
      )}
    </button>
  );
}
