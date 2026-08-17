import { useEffect, useRef, useState } from "react";
import { Track, createLocalTracks } from "livekit-client";
import texoraLogo from "@/assets/texora-logo.webp";
import {
  AlertTriangle,
  Clock,
  Copy,
  Loader2,
  Mic,
  MicOff,
  ShieldCheck,
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

  return (
    <div style={PJ.root}>
      <div style={PJ.page}>
        <div style={PJ.header}>
          <div style={PJ.brandRow}>
            <img src={texoraLogo} alt="Texora AI" style={PJ.brandLogo} />
          </div>
          <h1 style={PJ.pageTitle}>
            Welcome to <span style={PJ.pageTitleAccent}>Workspace</span>
          </h1>
          <p style={PJ.pageSubtitle}>
            Join your meeting or start a new session
          </p>
        </div>

        <div style={PJ.card}>
          <div style={PJ.leftCol}>
            <div style={PJ.previewBox}>
              {camOn && previewTrack ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "scaleX(-1)",
                  }}
                />
              ) : (
                <div style={PJ.previewAvatarWrap}>
                  <div
                    style={{
                      ...PJ.previewAvatar,
                      background: getAvatarStyle(name || email || "guest"),
                    }}
                  >
                    {(name || "G").trim().charAt(0).toUpperCase()}
                  </div>
                </div>
              )}

              <img src={texoraLogo} alt="" style={PJ.previewWatermark} />

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

            <div style={PJ.secureBanner}>
              <span style={PJ.secureIconWrap}>
                <ShieldCheck size={18} color="#1a73e8" />
              </span>
              <div>
                <p style={PJ.secureTitle}>
                  Your meeting is secure and end-to-end encrypted
                </p>
                <p style={PJ.secureSubtitle}>
                  We protect your privacy and keep your data safe.
                </p>
              </div>
            </div>
          </div>

          <div style={PJ.infoCol}>
            <h2 style={PJ.title}>{meetingInfo?.title || "Ilmorameet"}</h2>
            <p style={PJ.subtitle}>
              Hosted by{" "}
              <strong>{meetingInfo?.creatorName || "the meeting host"}</strong>
            </p>
            <p style={PJ.code}>
              Meeting code: <span>{joinCode}</span>
              {joinCode && (
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
              )}
            </p>

            <div style={PJ.sectionHeading}>
              <h3 style={PJ.sectionHeadingText}>Join the Meeting</h3>
              <div style={PJ.sectionHeadingDash}>
                <span style={PJ.dashOrange} />
              </div>
            </div>

            <label style={PJ.label}>Your name</label>
            <input
              style={PJ.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={40}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />

            <label style={PJ.label}>Your email</label>
            <input
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
              style={{
                ...PJ.joinBtn,
                opacity: submitting || !emailValid ? 0.7 : 1,
              }}
              disabled={submitting || !emailValid}
              onClick={handleSubmit}
            >
              {submitting ? <Loader2 size={16} className="im-spin" /> : null}
              {submitting ? "Requesting to join…" : "Ask to Join"}
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
