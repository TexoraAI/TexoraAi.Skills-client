import { useState, useEffect, useRef } from "react";

export default function ThreePanelLayout({
  t,
  isDark,
  left,
  center,
  right,
  defaultLeftW = 220,
  defaultRightW = 260,
  minLeft = 160,
  maxLeft = 320,
  minRight = 200,
  maxRight = 360,
  isMobile = false,
  isTablet = false,
}) {
  const stacked = isMobile || isTablet;
  const [leftW, setLeftW] = useState(defaultLeftW);
  const [rightW, setRightW] = useState(defaultRightW);
  const [dragging, setDragging] = useState(null);
  const dragStartRef = useRef(null);

  const onMouseDown = (side, e) => {
    e.preventDefault();
    setDragging(side);
    dragStartRef.current = { x: e.clientX, leftW, rightW };
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const dx = e.clientX - dragStartRef.current.x;
      if (dragging === "left")
        setLeftW(
          Math.max(minLeft, Math.min(maxLeft, dragStartRef.current.leftW + dx)),
        );
      else
        setRightW(
          Math.max(
            minRight,
            Math.min(maxRight, dragStartRef.current.rightW - dx),
          ),
        );
    };
    const onUp = () => setDragging(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, minLeft, maxLeft, minRight, maxRight]);

  const divider = (side) => (
    <div
      style={{
        width: 6,
        flexShrink: 0,
        cursor: "col-resize",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        userSelect: "none",
        zIndex: 10,
      }}
      onMouseDown={(e) => onMouseDown(side, e)}
      onMouseEnter={(e) =>
        (e.currentTarget.querySelector(".dvline").style.background =
          t.dividerHov)
      }
      onMouseLeave={(e) => {
        if (dragging !== side)
          e.currentTarget.querySelector(".dvline").style.background =
            t.dividerBg;
      }}
    >
      <div
        className="dvline"
        style={{
          position: "absolute",
          width: 2,
          top: 0,
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          background: dragging === side ? "#22c55e" : t.dividerBg,
          borderRadius: 99,
          transition: "background 0.2s",
        }}
      />
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pointerEvents: "none",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: dragging === side ? "#22c55e" : t.textMuted,
              opacity: 0.5,
            }}
          />
        ))}
      </div>
      {dragging === side && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            cursor: "col-resize",
            zIndex: 9999,
          }}
        />
      )}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: stacked ? "column" : "row",
        height: stacked ? "auto" : "100%",
        overflow: stacked ? "visible" : "hidden",
      }}
    >
      <div
        style={{
          width: stacked ? "100%" : leftW,
          flexShrink: 0,
          background: t.sidebarBg,
          borderRight: stacked ? "none" : `1px solid ${t.sidebarBorder}`,
          borderBottom: stacked ? `1px solid ${t.sidebarBorder}` : "none",
          overflow: stacked ? "visible" : "hidden",
          maxHeight: stacked ? "none" : "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {left}
      </div>
      {!stacked && divider("left")}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          overflow: stacked ? "visible" : "hidden",
          display: "flex",
          flexDirection: "column",
          background: t.panelBg,
          borderBottom: stacked ? `1px solid ${t.sidebarBorder}` : "none",
        }}
      >
        {center}
      </div>
      {!stacked && divider("right")}
      <div
        style={{
          width: stacked ? "100%" : rightW,
          flexShrink: 0,
          background: t.sidebarBg,
          borderLeft: stacked ? "none" : `1px solid ${t.sidebarBorder}`,
          overflow: stacked ? "visible" : "hidden",
          maxHeight: stacked ? "none" : "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {right}
      </div>
    </div>
  );
}
