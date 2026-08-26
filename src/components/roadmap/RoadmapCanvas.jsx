import React, { useMemo, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import RoadmapNode from "./RoadmapNode";
import "./roadmap-tokens.css";

// Defined once (outside the component) so React-Flow doesn't warn about a new
// nodeTypes object on every render.
const NODE_TYPES = { roadmapNode: RoadmapNode };

const DEFAULT_EDGE_OPTIONS = {
  type: "smoothstep",
  markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
  style: { stroke: "var(--rm-border-strong, #b9b3a6)", strokeWidth: 2 },
};

/**
 * RoadmapCanvas — a controlled React-Flow wrapper used by both the student
 * (read-only) and trainer (editable) roadmap views.
 *
 * Props:
 *  - nodes, edges              react-flow shaped arrays (see backendGraphToFlow)
 *  - selectedNodeId            highlights the selected node (editor)
 *  - readOnly (default true)   disables drag / connect
 *  - onNodeClick(node)         fired with the FULL node object (student view)
 *  - onSelectNode(id)          fired with the node id (editor)
 *  - onNodesChange(changes)    react-flow node changes (editor; apply with
 *                              applyNodeChanges in the parent)
 *  - onEdgesChange(changes)    react-flow edge changes (editor)
 *  - onConnect(connection)     new edge drawn (editor)
 *  - showMiniMap (bool)
 *  - height (css)              container height (default 100%)
 */
function CanvasInner({
  nodes = [],
  edges = [],
  selectedNodeId = null,
  readOnly = true,
  onNodeClick,
  onSelectNode,
  onNodesChange,
  onEdgesChange,
  onConnect,
  showMiniMap = false,
  height = "100%",
}) {
  const decoratedNodes = useMemo(
    () =>
      nodes.map((n) =>
        selectedNodeId != null
          ? { ...n, selected: String(n.id) === String(selectedNodeId) }
          : n,
      ),
    [nodes, selectedNodeId],
  );

  const handleNodeClick = useCallback(
    (_evt, node) => {
      if (onNodeClick) onNodeClick(node);
      if (onSelectNode) onSelectNode(node.id);
    },
    [onNodeClick, onSelectNode],
  );

  return (
    <div style={{ width: "100%", height }}>
      <ReactFlow
        nodes={decoratedNodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodeClick={handleNodeClick}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={true}
        deleteKeyCode={readOnly ? null : ["Backspace", "Delete"]}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.2}
        maxZoom={1.75}
        style={{ background: "var(--rm-bg, #f5f3ee)" }}
      >
        <Background color="var(--rm-border, #d9d5cc)" gap={22} size={1} />
        <Controls showInteractive={!readOnly} />
        {showMiniMap && (
          <MiniMap
            pannable
            zoomable
            nodeStrokeWidth={2}
            nodeColor={() => "var(--rm-node-bg, #ffe08a)"}
            style={{ background: "var(--rm-surface, #fff)" }}
          />
        )}
      </ReactFlow>
    </div>
  );
}

export default function RoadmapCanvas(props) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
}
