import { useEffect } from "react";

const INJECT_ID = "mmv-styles-v1";
const CSS = `
  .mmv-wrap { padding:10px 4px 4px; overflow-x:auto; font-family:'Inter',sans-serif; }
  .mmv-root-box {
    display:inline-flex; align-items:center; padding:12px 20px; border-radius:14px;
    background:var(--accent); color:#fff; font-size:14px; font-weight:800;
    box-shadow:0 4px 16px var(--accent-sh); margin-bottom:4px; letter-spacing:-.2px;
  }
  .mmv-branches { display:flex; flex-direction:column; margin-left:20px; margin-top:8px; }
  .mmv-node { position:relative; padding-left:28px; }
  .mmv-node::before {
    content:''; position:absolute; left:0; top:-6px; bottom:20px;
    width:1px; background:var(--border2);
  }
  .mmv-node:first-child::before { top:19px; }
  .mmv-node:last-child::before { bottom:auto; height:26px; }
  .mmv-node:only-child::before { display:none; }
  .mmv-node::after {
    content:''; position:absolute; left:0; top:19px; width:20px; height:1px;
    background:var(--border2);
  }
  .mmv-node-box {
    display:inline-flex; align-items:center; padding:8px 14px; border-radius:10px;
    background:var(--surface2); border:1px solid var(--border); color:var(--text);
    font-size:12px; font-weight:600; margin:5px 0; line-height:1.4;
  }
  .mmv-node-children { display:flex; flex-direction:column; margin-left:18px; margin-top:2px; }
  .mmv-empty { padding:24px; text-align:center; font-size:12px; color:var(--text3); font-family:'Inter',sans-serif; }
`;

const injectCSS = () => {
  if (document.getElementById(INJECT_ID)) return;
  const el = document.createElement("style");
  el.id = INJECT_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
};

const NODE_COLORS = [
  "#7c3aed",
  "#2563eb",
  "#0891b2",
  "#059669",
  "#d97706",
  "#dc2626",
  "#db2777",
  "#9333ea",
];

const MindMapNode = ({ node, depth = 0 }) => {
  const color = NODE_COLORS[depth % NODE_COLORS.length];
  const hasChildren = Array.isArray(node?.children) && node.children.length > 0;

  return (
    <div className="mmv-node">
      <div
        className="mmv-node-box"
        style={{ borderLeft: `3px solid ${color}` }}
      >
        {node?.label}
      </div>
      {hasChildren && (
        <div className="mmv-node-children">
          {node.children.map((child, i) => (
            <MindMapNode key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * MindMapViewer
 * Props:
 *   data: { root: string, children: [{ label, children: [...] }] }
 *   children can be an empty array but is always present per node.
 */
const MindMapViewer = ({ data }) => {
  useEffect(() => {
    injectCSS();
  }, []);

  if (!data || !data.root) {
    return <div className="mmv-empty">No mind map available.</div>;
  }

  const children = Array.isArray(data.children) ? data.children : [];

  return (
    <div className="mmv-wrap">
      <div className="mmv-root-box">{data.root}</div>
      {children.length > 0 && (
        <div className="mmv-branches">
          {children.map((child, i) => (
            <MindMapNode key={i} node={child} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MindMapViewer;
