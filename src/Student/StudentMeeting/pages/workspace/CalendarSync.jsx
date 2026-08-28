import React, { useEffect, useState } from "react";
import { CalendarClock, RefreshCw, CheckCircle2 } from "lucide-react";
import PageHead from "../../components/PageHead";
import { useToast } from "../../components/Toast";
import {
  getSyncStatus,
  syncNow,
  disconnectCalendar,
  getAuthorizationUrl,
} from "../../../../services/calendarSyncService";

export default function CalendarSync() {
  const [status, setStatus] = useState({
    connected: false,
    googleEmail: null,
    lastSyncAt: null,
    syncMessage: null,
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const showToast = useToast();

  const loadStatus = () => {
    setLoading(true);
    getSyncStatus()
      .then((res) =>
        setStatus(
          res.data || {
            connected: false,
            googleEmail: null,
            lastSyncAt: null,
            syncMessage: null,
          },
        ),
      )
      .catch((err) => {
        console.error("Failed to load calendar sync status:", err);
        showToast("Could not load sync status");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = () => {
    const returnTo = window.location.pathname; // the page you're on = your workspace route
    getAuthorizationUrl(returnTo)
      .then((res) => {
        if (res.data?.authUrl) window.location.href = res.data.authUrl;
      })
      .catch((err) => {
        console.error("Failed to start Google authorization", err);
        showToast?.("Couldn't start Google sign-in. Try again.");
      });
  };

  const handleSyncNow = () => {
    setSyncing(true);
    syncNow()
      .then(() => {
        showToast("Sync started");
        loadStatus();
      })
      .catch((err) => {
        console.error("Failed to sync:", err);
        showToast("Sync failed");
      })
      .finally(() => setSyncing(false));
  };

  const handleDisconnect = () => {
    disconnectCalendar()
      .then(() => {
        showToast("Calendar disconnected");
        loadStatus();
      })
      .catch((err) => {
        console.error("Failed to disconnect:", err);
        showToast("Could not disconnect calendar");
      });
  };

  return (
    <div className="ws-content">
      <PageHead
        title="Calendar Sync"
        subtitle="Sync your calendar to keep everything up to date."
      />

      <section className="section-card">
        <div className="section-card-head">
          <h2>Connected Calendar</h2>
        </div>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : status.connected ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "12px 14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="integration-icon">
                <CalendarClock size={18} />
              </div>
              <div>
                <b style={{ fontSize: 13.5 }}>Google Calendar</b>
                <div className="muted">{status.googleEmail}</div>
                <div className="connected-tag" style={{ marginTop: 2 }}>
                  <span className="dot" /> Connected
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="muted">Last synced</div>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                {status.lastSyncAt
                  ? new Date(status.lastSyncAt).toLocaleString()
                  : "Never"}
              </div>
              <button className="btn-ghost btn-sm" onClick={handleSyncNow}>
                <RefreshCw size={13} className={syncing ? "spin" : ""} />{" "}
                {syncing ? "Syncing..." : "Sync Now"}
              </button>
              <button
                className="btn-ghost btn-sm"
                style={{ marginLeft: 8 }}
                onClick={handleDisconnect}
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <CalendarClock size={30} />
            <h3>No calendar connected</h3>
            <p>Connect Google Calendar to sync your events.</p>
            <button className="btn-primary" onClick={handleConnect}>
              Connect Google Calendar
            </button>
          </div>
        )}
      </section>

      {status.connected && (
        <section className="section-card">
          <div className="section-card-head">
            <h2>Sync Status</h2>
          </div>
          <div className="sync-history-row">
            <CheckCircle2 size={14} color="#16a34a" />
            {status.syncMessage || "Connected"}
          </div>
        </section>
      )}
    </div>
  );
}
