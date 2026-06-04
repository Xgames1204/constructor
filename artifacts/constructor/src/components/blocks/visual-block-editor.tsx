"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  ReactFlowProvider,
  type Connection,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { v4 as uuid } from "uuid";
import type { BlockDefinition, BlockEdge, BlockNode, PageScript } from "@/types/editor";
import { CATEGORY_LABELS } from "@/lib/block-catalog";
import { HelpCircle, Save } from "lucide-react";

type BlockNodeData = {
  label: string;
  type: string;
  fields: Record<string, string>;
  color: string;
  onFieldChange: (nodeId: string, key: string, value: string) => void;
};

function BlockNodeView({ id, data }: { id: string; data: BlockNodeData }) {
  const fields = (data as BlockNodeData & { fieldDefs?: BlockDefinition["fields"] })
    .fieldDefs;

  return (
    <div
      className="flow-block-node"
      style={{
        borderColor: data.color,
        minWidth: 200,
        maxWidth: 260,
      }}
    >
      <Handle type="target" position={Position.Top} className="flow-handle flow-handle-in" />
      <div
        className="flow-block-header"
        style={{ backgroundColor: data.color }}
      >
        {data.label}
      </div>
      <div className="flow-block-body">
        {fields?.map((f) => (
          <div key={f.key} className="flow-field">
            <label>{f.label}</label>
            {f.type === "select" && f.options ? (
              <select
                value={data.fields[f.key] ?? f.defaultValue ?? ""}
                onChange={(e) => data.onFieldChange(id, f.key, e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea
                rows={2}
                value={data.fields[f.key] ?? f.defaultValue ?? ""}
                onChange={(e) => data.onFieldChange(id, f.key, e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
              />
            ) : f.type === "color" ? (
              <div className="flex gap-1">
                <input
                  type="color"
                  value={
                    (data.fields[f.key] || f.defaultValue || "#000000").startsWith("#")
                      ? data.fields[f.key] || f.defaultValue || "#000000"
                      : "#000000"
                  }
                  onChange={(e) => data.onFieldChange(id, f.key, e.target.value)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="h-7 w-8 shrink-0 cursor-pointer rounded border-0"
                />
                <input
                  type="text"
                  value={data.fields[f.key] ?? f.defaultValue ?? ""}
                  onChange={(e) => data.onFieldChange(id, f.key, e.target.value)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flow-input min-w-0 flex-1"
                />
              </div>
            ) : (
              <input
                type={f.type === "number" ? "number" : "text"}
                value={data.fields[f.key] ?? f.defaultValue ?? ""}
                onChange={(e) => data.onFieldChange(id, f.key, e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                placeholder={f.defaultValue}
                className="flow-input"
              />
            )}
          </div>
        ))}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="default"
        className="flow-handle flow-handle-out"
      />
      {(data.type === "if_condition" ||
        data.type === "srv_if" ||
        data.type === "compare_vars" ||
        data.type === "srv_validate") && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="true"
            style={{ top: "38%" }}
            className="flow-handle flow-handle-true"
            title="Да"
          />
          <span className="flow-handle-label flow-handle-label-true">да</span>
          <Handle
            type="source"
            position={Position.Right}
            id="false"
            style={{ top: "72%" }}
            className="flow-handle flow-handle-false"
            title="Нет"
          />
          <span className="flow-handle-label flow-handle-label-false">нет</span>
        </>
      )}
      {(data.type === "http_request" ||
        data.type === "site_api_request") && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="success"
            style={{ top: "40%" }}
            className="flow-handle flow-handle-true"
          />
          <Handle
            type="source"
            position={Position.Right}
            id="error"
            style={{ top: "70%" }}
            className="flow-handle flow-handle-false"
          />
        </>
      )}
    </div>
  );
}

function scriptToNodes(
  script: PageScript,
  definitions: BlockDefinition[],
  onFieldChange: (nodeId: string, key: string, value: string) => void
): Node[] {
  return script.nodes.map((n) => {
    const def = definitions.find((d) => d.type === n.type);
    return {
      id: n.id,
      type: "visualBlock",
      position: n.position,
      data: {
        label: def?.label || n.type,
        type: n.type,
        fields: { ...n.data },
        color: def?.color || "#64748b",
        fieldDefs: def?.fields,
        onFieldChange,
      },
    };
  });
}

interface VisualBlockEditorProps {
  scriptKey: string;
  definitions: BlockDefinition[];
  getScript: () => PageScript;
  onSave: (script: PageScript) => void;
  saveLabel?: string;
  hint?: string;
}

function EditorInner({
  scriptKey,
  definitions,
  getScript,
  onSave,
  saveLabel = "Сохранить",
  hint,
}: VisualBlockEditorProps) {
  const [category, setCategory] = useState<string>("all");
  const [showHelp, setShowHelp] = useState(true);

  const buildInitial = useCallback(() => {
    const script = getScript();
    const onFieldChange = (nodeId: string, key: string, value: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  fields: {
                    ...(node.data as BlockNodeData).fields,
                    [key]: value,
                  },
                },
              }
            : node
        )
      );
    };
    return {
      nodes: scriptToNodes(script, definitions, onFieldChange),
      edges: script.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
        style: { stroke: "#38bdf8", strokeWidth: 2 },
        animated: true,
      })),
    };
  }, [definitions, getScript]);

  const initial = useMemo(() => buildInitial(), [scriptKey, buildInitial]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);

  const nodeTypes = useMemo(
    () => ({
      visualBlock: ({
        id,
        data,
      }: {
        id: string;
        data: BlockNodeData;
      }) => <BlockNodeView id={id} data={data} />,
    }),
    []
  );

  const filteredDefs =
    category === "all"
      ? definitions
      : definitions.filter((d) => d.category === category);

  const categories = ["all", ...new Set(definitions.map((d) => d.category))];

  const addBlock = (type: string) => {
    const def = definitions.find((d) => d.type === type);
    if (!def) return;
    const fields: Record<string, string> = {};
    def.fields?.forEach((f) => {
      if (f.defaultValue) fields[f.key] = f.defaultValue;
    });
    const onFieldChange = (nodeId: string, key: string, value: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  fields: { ...(node.data as BlockNodeData).fields, [key]: value },
                },
              }
            : node
        )
      );
    };
    setNodes((nds) => [
      ...nds,
      {
        id: uuid(),
        type: "visualBlock",
        position: { x: 60 + nds.length * 28, y: 60 + nds.length * 36 },
        data: {
          label: def.label,
          type,
          fields,
          color: def.color,
          fieldDefs: def.fields,
          onFieldChange,
        },
      },
    ]);
  };

  const handleSave = () => {
    const blockNodes: BlockNode[] = nodes.map((n) => ({
      id: n.id,
      type: (n.data as BlockNodeData).type,
      position: n.position,
      data: (n.data as BlockNodeData).fields || {},
    }));
    const blockEdges: BlockEdge[] = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle || undefined,
      targetHandle: e.targetHandle || undefined,
    }));
    const script = getScript();
    onSave({ ...script, nodes: blockNodes, edges: blockEdges });
  };

  return (
    <div className="flow-editor-root flex h-full min-h-[320px] flex-col">
      {showHelp && (
        <div className="flow-help-bar">
          <HelpCircle className="h-4 w-4 shrink-0" />
          <p className="flex-1 text-[11px] leading-snug">
            {hint ||
              "Перетащите блок на холст. Соединяйте: выход снизу → вход сверху. Условия: правые точки «да»/«нет». Меняйте поля прямо в блоке."}
          </p>
          <button
            type="button"
            onClick={() => setShowHelp(false)}
            className="text-[10px] opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flow-palette">
        <div className="flow-categories">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={category === c ? "flow-cat-active" : "flow-cat"}
            >
              {c === "all" ? "Все" : CATEGORY_LABELS[c] || c}
            </button>
          ))}
        </div>
        <div className="flow-block-list">
          {filteredDefs.map((b) => (
            <button
              key={b.type}
              type="button"
              onClick={() => addBlock(b.type)}
              className="flow-add-btn"
              style={{ borderLeftColor: b.color }}
            >
              + {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flow-canvas flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(p) =>
            setEdges((eds) =>
              addEdge(
                { ...p, style: { stroke: "#38bdf8", strokeWidth: 2 }, animated: true },
                eds
              )
            )
          }
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          className="flow-react-flow"
        >
          <Background color="#475569" gap={20} size={1} />
          <Controls className="flow-controls" />
          <MiniMap
            className="flow-minimap"
            nodeColor={(n) => (n.data as BlockNodeData).color || "#64748b"}
          />
        </ReactFlow>
      </div>

      <div className="flow-footer">
        <button type="button" onClick={handleSave} className="flow-save-btn">
          <Save className="h-4 w-4" />
          {saveLabel}
        </button>
      </div>
    </div>
  );
}

export function VisualBlockEditor(props: VisualBlockEditorProps) {
  return (
    <ReactFlowProvider>
      <EditorInner key={props.scriptKey} {...props} />
    </ReactFlowProvider>
  );
}
