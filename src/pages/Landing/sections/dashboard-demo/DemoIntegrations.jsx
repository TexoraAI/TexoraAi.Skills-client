import { useState } from "react";
import { Plug } from "lucide-react";
import DemoPageHead from "./DemoPageHead";
import { integrations as initialIntegrations } from "./demoData";

export default function DemoIntegrations({ onToast }) {
  const [items, setItems] = useState(initialIntegrations);

  const toggle = (id) => {
    setItems((list) =>
      list.map((it) => (it.id === id ? { ...it, connected: !it.connected } : it)),
    );
    const item = items.find((it) => it.id === id);
    onToast(
      item && !item.connected ? `Connected ${item.name} (demo)` : `${item?.name} disconnected (demo)`,
    );
  };

  return (
    <div className="ws-content">
      <DemoPageHead
        title="Integrations"
        subtitle="Connect the tools your workspace already runs on."
      />

      <div className="integrations-grid">
        {items.map((it) => (
          <div className="integration-card" key={it.id}>
            <div className="integration-top">
              <div className="integration-icon">
                <Plug size={17} />
              </div>
              <div>
                <b>{it.name}</b>
                {it.connected ? (
                  <span className="connected-tag">
                    <span className="dot" /> Connected
                  </span>
                ) : (
                  <span className="muted">Not connected</span>
                )}
              </div>
            </div>
            <p className="muted" style={{ margin: 0 }}>
              {it.desc}
            </p>
            <button
              className={it.connected ? "btn-ghost btn-sm" : "btn-primary"}
              onClick={() => toggle(it.id)}
            >
              {it.connected ? "Disconnect" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
