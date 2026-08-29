import { useEffect, useRef, useState } from "react";
import { Track, createLocalTracks } from "livekit-client";
import texoraLogo from "@/assets/texora-logo.webp";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Copy,
  Loader2,
  Mail,
  Mic,
  MicOff,
  Send,
  ChevronRight,
  Sparkles,
  User,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import { PJ } from "../styles/prejoinStyles";
import { getAvatarStyle } from "../utils/avatar";

export function PreJoinScreen({ meetingInfo, joinCode, onSubmit, submitting, error }) {
  const [name, setName] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("lms_user") || "{}");
      return u?.name || "";
    } catch {
      return "";
    }
  });
  const [email, setEmail] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("lms_user") || "{}");
      return u?.email || "";
    } catch {
      return "";
    }
  });
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [previewTrack, setPreviewTrack] = useState(null);
  const [previewError, setPreviewError] = useState(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  useEffect(() => {
    let localTracks = [];
    let cancelled = false;
    (async () => {
      try {
        localTracks = await createLocalTracks({ audio: true, video: true });
        if (cancelled) {
          localTracks.forEach((t) => t.stop());
          return;
        }
        const cam = localTracks.find((t) => t.kind === Track.Kind.Video);
        if (cam) setPreviewTrack(cam);
      } catch (err) {
        setPreviewError(
          "Camera/microphone permission was blocked. You can still join with audio/video off.",
        );
      }
    })();
    return () => {
      cancelled = true;
      localTracks.forEach((t) => {
        try {
          t.stop();
        } catch (_) {}
      });
    };
  }, []);

  const videoRef = useRef(null);
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !previewTrack) return undefined;
    if (camOn) previewTrack.attach(el);
    else previewTrack.detach(el);
    return () => {
      try {
        previewTrack.detach(el);
      } catch (_) {}
    };
  }, [previewTrack, camOn]);

  const handleSubmit = () => {
    if (!emailValid || submitting) return;
    onSubmit({
      name: name.trim() || "Guest",
      email: email.trim(),
      micOn,
      camOn,
    });
  };

  // Decorative waveform bar heights (purely visual, mirrors the mic
  // level indicator style — no functional/audio-analysis change).
  const waveHeights = [10, 18, 26, 16, 8];

  return (
    <div style={PJ.root}>
      <style>{`
        @keyframes pjWaveBar {
          0%, 100% { transform: scaleY(.55); }
          50% { transform: scaleY(1); }
        }
        .pj-wavebar { animation: pjWaveBar 1.2s ease-in-out infinite; }

        @media (max-width: 980px) {
          .pj-card { flex-direction: column !important; align-items: center !important; }
          .pj-leftCol, .pj-infoCol { width: 100% !important; max-width: 520px !important; }
        }
        @media (max-width: 700px) {
          .pj-deco { display: none !important; }
          .pj-page { padding: 32px 16px 40px !important; }
          .pj-pageTitle { font-size: 28px !important; }
          .pj-pageSubtitle { font-size: 13.5px !important; }
          .pj-infoCol { padding: 22px 18px 20px !important; }
          .pj-previewBox { aspect-ratio: 4/3 !important; border-radius: 18px !important; }
          .pj-card { gap: 18px !important; }
        }
        @media (max-width: 420px) {
          .pj-pageTitle { font-size: 24px !important; }
          .pj-avatarStage { width: 96px !important; height: 96px !important; }
          .pj-previewAvatar { width: 74px !important; height: 74px !important; font-size: 26px !important; }
        }
        .pj-input:focus { border-color: #7c8cf5 !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(90,100,240,.12); }
        .pj-joinBtn:disabled { cursor: default; }
      `}</style>

      <div className="pj-page" style={PJ.page}>
        {/* decorative floating icon tiles (desktop/tablet only) */}
        <span className="pj-deco" style={{ ...PJ.decoDots, ...PJ.decoDotsTL }} />
        <div className="pj-deco" style={PJ.decoTL}>
          <Video size={24} color="#3b6ff0" />
        </div>
        <span className="pj-deco" style={{ ...PJ.decoDots, ...PJ.decoDotsTR }} />
        <div className="pj-deco" style={PJ.decoTR}>
          <Users size={24} color="#6a5cf5" />
        </div>

        <div className="pj-header" style={PJ.header}>
          <div style={PJ.brandRow}>
            <img src={texoraLogo} alt="Texora AI" style={PJ.brandLogo} />
          </div>
          <h1 className="pj-pageTitle" style={PJ.pageTitle}>
            Welcome to <span style={PJ.pageTitleAccent}>Workspace</span>
          </h1>
          <p className="pj-pageSubtitle" style={PJ.pageSubtitle}>
            <Sparkles size={14} style={PJ.sparkleIcon} />
            Join your meeting or start a new session
            <Sparkles size={14} style={PJ.sparkleIcon} />
          </p>
        </div>

        <div className="pj-card" style={PJ.card}>
          <div className="pj-leftCol" style={PJ.leftCol}>
            <div className="pj-previewBox" style={PJ.previewBox}>
              <div style={PJ.previewBackdropShape1} />
              <div style={PJ.previewBackdropShape2} />

              {camOn && previewTrack ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "scaleX(-1)",
                  }}
                />
              ) : (
                <div style={PJ.previewAvatarWrap}>
                  <div className="pj-avatarStage" style={PJ.avatarStage}>
                    <div
                      style={{ ...PJ.waveBars, ...PJ.waveBarsLeft }}
                    >
                      {waveHeights.map((h, i) => (
                        <span
                          key={`l${i}`}
                          className="pj-wavebar"
                          style={{
                            ...PJ.waveBar,
                            height: h,
                            animationDelay: `${i * 0.12}s`,
                          }}
                        />
                      ))}
                    </div>

                    <span style={PJ.avatarRing} />
                    <div
                      className="pj-previewAvatar"
                      style={{
                        ...PJ.previewAvatar,
                        background: getAvatarStyle(name || email || "guest"),
                      }}
                    >
                      {(name || "G").trim().charAt(0).toUpperCase()}
                    </div>

                    <div
                      style={{ ...PJ.waveBars, ...PJ.waveBarsRight }}
                    >
                      {waveHeights.map((h, i) => (
                        <span
                          key={`r${i}`}
                          className="pj-wavebar"
                          style={{
                            ...PJ.waveBar,
                            height: h,
                            animationDelay: `${i * 0.12}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p style={PJ.previewCaption}>You are previewing your video</p>
                </div>
              )}

              <div style={PJ.previewWatermarkPill}>
                <img src={texoraLogo} alt="" style={PJ.previewWatermark} />
              </div>

              <div style={PJ.previewCtrls}>
                <button
                  style={PJ.previewPillBtn}
                  onClick={() => setMicOn((v) => !v)}
                  title={micOn ? "Mute" : "Unmute"}
                >
                  {micOn ? <Mic size={16} /> : <MicOff size={16} />}
                  <span>{micOn ? "Mic On" : "Mic Off"}</span>
                </button>
                <span style={PJ.previewCtrlsDivider} />
                <button
                  style={PJ.previewPillBtn}
                  onClick={() => setCamOn((v) => !v)}
                  title={camOn ? "Stop camera" : "Start camera"}
                >
                  {camOn ? <Video size={16} /> : <VideoOff size={16} />}
                  <span>{camOn ? "Camera On" : "Camera Off"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pj-infoCol" style={PJ.infoCol}>
            <div style={PJ.meetingHeadRow}>
              <span style={PJ.meetingIconWrap}>
                <Calendar size={20} color="#3b6ff0" />
              </span>
              <div style={{ minWidth: 0 }}>
                <h2 style={PJ.title}>{meetingInfo?.title || "Ilmorameet"}</h2>
                <p style={PJ.subtitle}>
                  Hosted by{" "}
                  <span style={PJ.subtitleStrong}>
                    {meetingInfo?.creatorName || "the meeting host"}
                  </span>
                </p>
              </div>
            </div>

            {joinCode && (
              <p style={PJ.code}>
                Meeting code: <span style={PJ.codeValue}>{joinCode}</span>
                <button
                  type="button"
                  style={PJ.copyBtn}
                  title="Copy meeting code"
                  onClick={() => {
                    try {
                      navigator.clipboard?.writeText(joinCode);
                    } catch (_) {}
                  }}
                >
                  <Copy size={13} />
                </button>
              </p>
            )}

            <div style={PJ.sectionHeading}>
              <h3 style={PJ.sectionHeadingText}>Join the Meeting</h3>
              <div style={PJ.sectionHeadingDash}>
                <span style={PJ.dashOrange} />
              </div>
            </div>

            <label style={PJ.label}>Your name</label>
            <div style={PJ.inputWrap}>
              <span style={PJ.inputIcon}>
                <User size={15} />
              </span>
              <input
                className="pj-input"
                style={PJ.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                maxLength={40}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
              />
            </div>

            <label style={PJ.label}>Your email</label>
            <div style={PJ.inputWrap}>
              <span style={PJ.inputIcon}>
                <Mail size={15} />
              </span>
              <input
                className="pj-input"
                style={PJ.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                maxLength={100}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
              />
            </div>
            {email.length > 0 && !emailValid && (
              <p style={PJ.errText}>Enter a valid email address</p>
            )}

            {previewError && (
              <p style={PJ.warnText}>
                <AlertTriangle size={13} /> {previewError}
              </p>
            )}
            {error && <p style={PJ.errText}>{error}</p>}

            <button
              className="pj-joinBtn"
              style={{
                ...PJ.joinBtn,
                opacity: submitting || !emailValid ? 0.7 : 1,
              }}
              disabled={submitting || !emailValid}
              onClick={handleSubmit}
            >
              <span style={PJ.joinBtnLabel}>
                {submitting ? (
                  <Loader2 size={16} className="im-spin" />
                ) : (
                  <Send size={16} />
                )}
                {submitting ? "Requesting to join…" : "Ask to Join"}
              </span>
              <span style={PJ.joinBtnChevron}>
                <ChevronRight size={18} />
              </span>
            </button>
            <p style={PJ.hint}>
              <Clock size={12} />
              Someone in the meeting will let you in soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}