// /* ═════════════════════════════════════════════════════════════════
//    PRE-JOIN / LOBBY STYLES — Texora AI brand refresh: soft gradient
//    backdrop, blue accent (#1a73e8 → #2f6fea gradient), rounded 24px
//    cards, icon-led inputs, split gradient CTA.
//    NOTE: layout-critical props (flex-direction / width / padding /
//    font-size / display) that must change per breakpoint are also
//    targeted by class name in the injected <style> block using
//    `!important`, since inline styles otherwise win over stylesheet
//    rules. Colors / static styling stay in this JS object.
// ═════════════════════════════════════════════════════════════════ */
// export const PJ = {
//   root: {
//     position: "fixed",
//     inset: 0,
//     background:
//       "radial-gradient(1100px 620px at 12% -8%, rgba(80,120,255,.10) 0%, rgba(80,120,255,0) 60%)," +
//       "radial-gradient(900px 560px at 108% 12%, rgba(130,90,255,.12) 0%, rgba(130,90,255,0) 55%)," +
//       "linear-gradient(160deg, #eef2fd 0%, #eaf0fc 45%, #f2eefc 100%)",
//     overflowY: "auto",
//     overflowX: "hidden",
//     fontFamily: "'Google Sans','Roboto','Segoe UI',sans-serif",
//     zIndex: 9999,
//   },
//   page: {
//     position: "relative",
//     maxWidth: 1220,
//     margin: "0 auto",
//     padding: "56px 24px 64px",
//   },

//   /* ── decorative floating icon tiles + dot grid (desktop only) ── */
//   decoTL: {
//     position: "absolute",
//     top: 46,
//     left: "6%",
//     width: 64,
//     height: 64,
//     borderRadius: 18,
//     background: "rgba(255,255,255,.75)",
//     border: "1px solid rgba(255,255,255,.9)",
//     boxShadow: "0 12px 30px rgba(60,90,200,.14)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     transform: "rotate(-8deg)",
//     backdropFilter: "blur(4px)",
//   },
//   decoTR: {
//     position: "absolute",
//     top: 96,
//     right: "7%",
//     width: 64,
//     height: 64,
//     borderRadius: 18,
//     background: "rgba(255,255,255,.75)",
//     border: "1px solid rgba(255,255,255,.9)",
//     boxShadow: "0 12px 30px rgba(60,90,200,.14)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     transform: "rotate(9deg)",
//     backdropFilter: "blur(4px)",
//   },
//   decoDots: {
//     position: "absolute",
//     width: 54,
//     height: 54,
//     backgroundImage:
//       "radial-gradient(rgba(90,110,220,.35) 1.6px, transparent 1.6px)",
//     backgroundSize: "9px 9px",
//     opacity: 0.8,
//   },
//   decoDotsTL: { top: 18, left: "calc(6% - 30px)" },
//   decoDotsTR: { top: 168, right: "calc(7% - 30px)" },

//   header: {
//     position: "relative",
//     textAlign: "center",
//     marginBottom: 40,
//   },
//   brandRow: {
//     display: "flex",
//     justifyContent: "center",
//     marginBottom: 22,
//   },
//   brandLogo: { height: 30, width: "auto", objectFit: "contain" },
//   pageTitle: {
//     fontSize: 40,
//     fontWeight: 700,
//     color: "#1a1f36",
//     margin: "0 0 10px",
//     letterSpacing: -0.8,
//   },
//   pageTitleAccent: {
//     background: "linear-gradient(90deg,#3b6ff0,#6a5cf5)",
//     WebkitBackgroundClip: "text",
//     WebkitTextFillColor: "transparent",
//     backgroundClip: "text",
//   },
//   pageSubtitle: {
//     fontSize: 15.5,
//     color: "#6b7280",
//     margin: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   },
//   sparkleIcon: { color: "#9aa7f7" },

//   card: {
//     display: "flex",
//     gap: 30,
//     maxWidth: 1080,
//     width: "100%",
//     margin: "0 auto",
//     alignItems: "flex-start",
//     justifyContent: "center",
//   },
//   leftCol: {
//     display: "flex",
//     flexDirection: "column",
//     gap: 16,
//     width: 460,
//     maxWidth: "100%",
//   },

//   previewBox: {
//     position: "relative",
//     width: "100%",
//     aspectRatio: "16/11",
//     borderRadius: 24,
//     overflow: "hidden",
//     background:
//       "linear-gradient(155deg,#eef1fa 0%,#e7ecf8 38%,#dbe3f5 62%,#eef1fa 100%)",
//     border: "1px solid rgba(255,255,255,.7)",
//     boxShadow: "0 24px 60px rgba(45,60,140,.16)",
//   },
//   previewBackdropShape1: {
//     position: "absolute",
//     left: "-8%",
//     bottom: "-14%",
//     width: "56%",
//     height: "62%",
//     borderRadius: 28,
//     background: "rgba(255,255,255,.45)",
//     filter: "blur(1px)",
//   },
//   previewBackdropShape2: {
//     position: "absolute",
//     right: "-10%",
//     top: "-16%",
//     width: "48%",
//     height: "50%",
//     borderRadius: "50%",
//     background: "rgba(255,255,255,.35)",
//   },
//   previewAvatarWrap: {
//     position: "absolute",
//     inset: 0,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 14,
//   },
//   avatarStage: {
//     position: "relative",
//     width: 128,
//     height: 128,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   avatarRing: {
//     position: "absolute",
//     inset: 0,
//     borderRadius: "50%",
//     border: "2px dashed rgba(80,100,220,.35)",
//   },
//   previewAvatar: {
//     position: "relative",
//     width: 96,
//     height: 96,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg,#5c6cf0,#8a5cf0)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 34,
//     fontWeight: 600,
//     color: "#fff",
//     boxShadow: "0 10px 24px rgba(90,80,230,.35)",
//   },
//   waveBars: {
//     position: "absolute",
//     top: "50%",
//     transform: "translateY(-50%)",
//     display: "flex",
//     alignItems: "center",
//     gap: 4,
//   },
//   waveBarsLeft: { right: "calc(50% + 76px)" },
//   waveBarsRight: { left: "calc(50% + 76px)" },
//   waveBar: {
//     width: 3,
//     borderRadius: 2,
//     background: "linear-gradient(180deg,#6a7bf5,#9a7bf5)",
//   },
//   previewCaption: {
//     fontSize: 13,
//     fontWeight: 500,
//     color: "#5f6785",
//     margin: 0,
//   },
//   previewWatermarkPill: {
//     position: "absolute",
//     top: 16,
//     right: 16,
//     display: "flex",
//     alignItems: "center",
//     background: "rgba(255,255,255,.9)",
//     borderRadius: 10,
//     padding: "6px 12px",
//     boxShadow: "0 4px 12px rgba(40,50,120,.12)",
//   },
//   previewWatermark: { height: 16, width: "auto", objectFit: "contain" },
//   previewCtrls: {
//     position: "absolute",
//     bottom: 18,
//     left: "50%",
//     transform: "translateX(-50%)",
//     display: "flex",
//     alignItems: "center",
//     gap: 0,
//     background: "rgba(255,255,255,.96)",
//     borderRadius: 999,
//     padding: "8px 10px",
//     boxShadow: "0 10px 26px rgba(40,50,120,.18)",
//   },
//   previewCtrlsDivider: {
//     width: 1,
//     height: 18,
//     background: "rgba(32,33,36,.12)",
//     margin: "0 14px",
//   },
//   previewPillBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: 7,
//     border: "none",
//     background: "transparent",
//     color: "#4b5468",
//     fontSize: 13,
//     fontWeight: 500,
//     fontFamily: "inherit",
//     cursor: "pointer",
//     padding: "4px 6px",
//   },

//   infoCol: {
//     width: 400,
//     maxWidth: "100%",
//     color: "#1a1f36",
//     background: "#ffffff",
//     borderRadius: 24,
//     padding: "30px 30px 26px",
//     boxShadow: "0 24px 60px rgba(45,60,140,.14)",
//     overflow: "hidden",
//     boxSizing: "border-box",
//   },
//   meetingHeadRow: {
//     display: "flex",
//     alignItems: "flex-start",
//     gap: 14,
//     marginBottom: 18,
//   },
//   meetingIconWrap: {
//     flexShrink: 0,
//     width: 46,
//     height: 46,
//     borderRadius: 13,
//     background: "linear-gradient(135deg,#eef2ff,#e4ecff)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 19,
//     fontWeight: 700,
//     margin: "2px 0 4px",
//     wordBreak: "break-word",
//     overflowWrap: "anywhere",
//   },
//   subtitle: {
//     fontSize: 13,
//     color: "#8a90a6",
//     margin: 0,
//   },
//   subtitleStrong: { color: "#3b6ff0", fontWeight: 600 },
//   code: {
//     fontSize: 12.5,
//     color: "#8a90a6",
//     margin: "0 0 18px",
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//   },
//   codeValue: { color: "#3f4560", fontWeight: 600 },
//   copyBtn: {
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     border: "none",
//     background: "#f2f4fb",
//     color: "#5f6785",
//     borderRadius: 8,
//     width: 24,
//     height: 24,
//     cursor: "pointer",
//   },
//   sectionHeading: {
//     marginBottom: 18,
//     paddingBottom: 14,
//     borderBottom: "1px solid #eef0f7",
//   },
//   sectionHeadingText: {
//     fontSize: 15,
//     fontWeight: 700,
//     color: "#1a1f36",
//     margin: "0 0 8px",
//   },
//   sectionHeadingDash: {
//     display: "flex",
//     gap: 6,
//   },
//   dashOrange: {
//     width: 34,
//     height: 3,
//     borderRadius: 2,
//     background: "linear-gradient(90deg,#3b6ff0,#6a5cf5)",
//     display: "inline-block",
//   },
//   label: {
//     fontSize: 12.5,
//     fontWeight: 600,
//     color: "#4b5468",
//     marginBottom: 7,
//     display: "block",
//   },
//   inputWrap: {
//     position: "relative",
//     marginBottom: 14,
//   },
//   inputIcon: {
//     position: "absolute",
//     left: 14,
//     top: "50%",
//     transform: "translateY(-50%)",
//     color: "#9aa0b4",
//     pointerEvents: "none",
//     display: "flex",
//   },
//   input: {
//     width: "100%",
//     background: "#f8f9fd",
//     border: "1px solid #e7e9f4",
//     borderRadius: 12,
//     padding: "12px 14px 12px 40px",
//     color: "#1a1f36",
//     fontSize: 14,
//     outline: "none",
//     fontFamily: "inherit",
//     boxSizing: "border-box",
//   },
//   warnText: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     fontSize: 11,
//     color: "#b06000",
//     marginBottom: 10,
//   },
//   errText: { fontSize: 12, color: "#d93025", marginBottom: 10 },
//   joinBtn: {
//     width: "100%",
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     background: "linear-gradient(90deg,#3468ea,#5a5cf0)",
//     color: "#fff",
//     border: "none",
//     borderRadius: 14,
//     padding: "6px 6px 6px 20px",
//     fontSize: 14.5,
//     fontWeight: 600,
//     cursor: "pointer",
//     boxShadow: "0 12px 26px rgba(60,90,230,.35)",
//     fontFamily: "inherit",
//   },
//   joinBtnLabel: {
//     flex: 1,
//     display: "flex",
//     alignItems: "center",
//     gap: 9,
//     justifyContent: "center",
//   },
//   joinBtnChevron: {
//     width: 40,
//     height: 40,
//     borderRadius: 10,
//     background: "rgba(255,255,255,.18)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     flexShrink: 0,
//   },
//   hint: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 6,
//     fontSize: 11.5,
//     color: "#9aa0b4",
//     marginTop: 14,
//     textAlign: "center",
//   },
// };









































/* ═════════════════════════════════════════════════════════════════
   PRE-JOIN / LOBBY STYLES — Texora AI brand refresh: soft gradient
   backdrop, blue accent (#1a73e8 → #2f6fea gradient), rounded 24px
   cards, icon-led inputs, split gradient CTA.
   NOTE: layout-critical props (flex-direction / width / padding /
   font-size / display) that must change per breakpoint are also
   targeted by class name in the injected <style> block using
   `!important`, since inline styles otherwise win over stylesheet
   rules. Colors / static styling stay in this JS object.
═════════════════════════════════════════════════════════════════ */
export const PJ = {
  root: {
    position: "fixed",
    inset: 0,
    background:
      "radial-gradient(1100px 620px at 12% -8%, rgba(80,120,255,.10) 0%, rgba(80,120,255,0) 60%)," +
      "radial-gradient(900px 560px at 108% 12%, rgba(130,90,255,.12) 0%, rgba(130,90,255,0) 55%)," +
      "linear-gradient(160deg, #eef2fd 0%, #eaf0fc 45%, #f2eefc 100%)",
    overflowY: "auto",
    overflowX: "hidden",
    fontFamily: "'Google Sans','Roboto','Segoe UI',sans-serif",
    zIndex: 9999,
  },
  page: {
    position: "relative",
    maxWidth: 1220,
    margin: "0 auto",
    padding: "20px 24px 20px",
  },

  /* ── decorative floating icon tiles + dot grid (desktop only) ── */
  decoTL: {
    position: "absolute",
    top: 46,
    left: "6%",
    width: 64,
    height: 64,
    borderRadius: 18,
    background: "rgba(255,255,255,.75)",
    border: "1px solid rgba(255,255,255,.9)",
    boxShadow: "0 12px 30px rgba(60,90,200,.14)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "rotate(-8deg)",
    backdropFilter: "blur(4px)",
  },
  decoTR: {
    position: "absolute",
    top: 96,
    right: "7%",
    width: 64,
    height: 64,
    borderRadius: 18,
    background: "rgba(255,255,255,.75)",
    border: "1px solid rgba(255,255,255,.9)",
    boxShadow: "0 12px 30px rgba(60,90,200,.14)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "rotate(9deg)",
    backdropFilter: "blur(4px)",
  },
  decoDots: {
    position: "absolute",
    width: 54,
    height: 54,
    backgroundImage:
      "radial-gradient(rgba(90,110,220,.35) 1.6px, transparent 1.6px)",
    backgroundSize: "9px 9px",
    opacity: 0.8,
  },
  decoDotsTL: { top: 18, left: "calc(6% - 30px)" },
  decoDotsTR: { top: 168, right: "calc(7% - 30px)" },

  header: {
    position: "relative",
    textAlign: "center",
    marginBottom: 14,
  },
  brandRow: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 22,
  },
  brandLogo: { height: 30, width: "auto", objectFit: "contain" },
  pageTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#1a1f36",
    margin: "0 0 6px",
    letterSpacing: -0.8,
  },
  pageTitleAccent: {
    background: "linear-gradient(90deg,#3b6ff0,#6a5cf5)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  pageSubtitle: {
    fontSize: 15.5,
    color: "#6b7280",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  sparkleIcon: { color: "#9aa7f7" },

  card: {
    display: "flex",
    gap: 30,
    maxWidth: 1080,
    width: "100%",
    margin: "0 auto",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    width: 460,
    maxWidth: "100%",
  },

  previewBox: {
    position: "relative",
    width: "100%",
    aspectRatio: "16/11",
    borderRadius: 24,
    overflow: "hidden",
    background:
      "linear-gradient(155deg,#eef1fa 0%,#e7ecf8 38%,#dbe3f5 62%,#eef1fa 100%)",
    border: "1px solid rgba(255,255,255,.7)",
    boxShadow: "0 24px 60px rgba(45,60,140,.16)",
  },
  previewBackdropShape1: {
    position: "absolute",
    left: "-8%",
    bottom: "-14%",
    width: "56%",
    height: "62%",
    borderRadius: 28,
    background: "rgba(255,255,255,.45)",
    filter: "blur(1px)",
  },
  previewBackdropShape2: {
    position: "absolute",
    right: "-10%",
    top: "-16%",
    width: "48%",
    height: "50%",
    borderRadius: "50%",
    background: "rgba(255,255,255,.35)",
  },
  previewAvatarWrap: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  avatarStage: {
    position: "relative",
    width: 128,
    height: 128,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarRing: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "2px dashed rgba(80,100,220,.35)",
  },
  previewAvatar: {
    position: "relative",
    width: 96,
    height: 96,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#5c6cf0,#8a5cf0)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 34,
    fontWeight: 600,
    color: "#fff",
    boxShadow: "0 10px 24px rgba(90,80,230,.35)",
  },
  waveBars: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  waveBarsLeft: { right: "calc(50% + 76px)" },
  waveBarsRight: { left: "calc(50% + 76px)" },
  waveBar: {
    width: 3,
    borderRadius: 2,
    background: "linear-gradient(180deg,#6a7bf5,#9a7bf5)",
  },
  previewCaption: {
    fontSize: 13,
    fontWeight: 500,
    color: "#5f6785",
    margin: 0,
  },
  previewWatermarkPill: {
    position: "absolute",
    top: 16,
    right: 16,
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,.9)",
    borderRadius: 10,
    padding: "6px 12px",
    boxShadow: "0 4px 12px rgba(40,50,120,.12)",
  },
  previewWatermark: { height: 16, width: "auto", objectFit: "contain" },
  previewCtrls: {
    position: "absolute",
    bottom: 18,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: 0,
    background: "rgba(255,255,255,.96)",
    borderRadius: 999,
    padding: "8px 10px",
    boxShadow: "0 10px 26px rgba(40,50,120,.18)",
  },
  previewCtrlsDivider: {
    width: 1,
    height: 18,
    background: "rgba(32,33,36,.12)",
    margin: "0 14px",
  },
  previewPillBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    border: "none",
    background: "transparent",
    color: "#4b5468",
    fontSize: 13,
    fontWeight: 500,
    fontFamily: "inherit",
    cursor: "pointer",
    padding: "4px 6px",
  },

  infoCol: {
    width: 400,
    maxWidth: "100%",
    color: "#1a1f36",
    background: "#ffffff",
    borderRadius: 24,
    padding: "30px 30px 26px",
    boxShadow: "0 24px 60px rgba(45,60,140,.14)",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  meetingHeadRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 18,
  },
  meetingIconWrap: {
    flexShrink: 0,
    width: 46,
    height: 46,
    borderRadius: 13,
    background: "linear-gradient(135deg,#eef2ff,#e4ecff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 19,
    fontWeight: 700,
    margin: "2px 0 4px",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
  },
  subtitle: {
    fontSize: 13,
    color: "#8a90a6",
    margin: 0,
  },
  subtitleStrong: { color: "#3b6ff0", fontWeight: 600 },
  code: {
    fontSize: 12.5,
    color: "#8a90a6",
    margin: "0 0 18px",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  codeValue: { color: "#3f4560", fontWeight: 600 },
  copyBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "#f2f4fb",
    color: "#5f6785",
    borderRadius: 8,
    width: 24,
    height: 24,
    cursor: "pointer",
  },
  sectionHeading: {
    marginBottom: 18,
    paddingBottom: 14,
    borderBottom: "1px solid #eef0f7",
  },
  sectionHeadingText: {
    fontSize: 15,
    fontWeight: 700,
    color: "#1a1f36",
    margin: "0 0 8px",
  },
  sectionHeadingDash: {
    display: "flex",
    gap: 6,
  },
  dashOrange: {
    width: 34,
    height: 3,
    borderRadius: 2,
    background: "linear-gradient(90deg,#3b6ff0,#6a5cf5)",
    display: "inline-block",
  },
  label: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#4b5468",
    marginBottom: 7,
    display: "block",
  },
  inputWrap: {
    position: "relative",
    marginBottom: 14,
  },
  inputIcon: {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9aa0b4",
    pointerEvents: "none",
    display: "flex",
  },
  input: {
    width: "100%",
    background: "#f8f9fd",
    border: "1px solid #e7e9f4",
    borderRadius: 12,
    padding: "12px 14px 12px 40px",
    color: "#1a1f36",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  warnText: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    color: "#b06000",
    marginBottom: 10,
  },
  errText: { fontSize: 12, color: "#d93025", marginBottom: 10 },
  joinBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "linear-gradient(90deg,#3468ea,#5a5cf0)",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: "6px 6px 6px 20px",
    fontSize: 14.5,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 12px 26px rgba(60,90,230,.35)",
    fontFamily: "inherit",
  },
  joinBtnLabel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 9,
    justifyContent: "center",
  },
  joinBtnChevron: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "rgba(255,255,255,.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  hint: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    fontSize: 11.5,
    color: "#9aa0b4",
    marginTop: 14,
    textAlign: "center",
  },
};