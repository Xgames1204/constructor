"use client";

import { useDraggable } from "@dnd-kit/core";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";

interface Props {
  elementId: string;
  isPreview?: boolean;
}

function stylesToObject(styles: Record<string, string | undefined>): React.CSSProperties {
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(styles)) {
    if (v) result[k] = v;
  }
  return result as React.CSSProperties;
}

export function CanvasElementView({ elementId, isPreview }: Props) {
  const element = useEditorStore((s) => s.data.elements[elementId]);
  const selectedId = useEditorStore((s) => s.selectedId);
  const hoveredId = useEditorStore((s) => s.hoveredId);
  const select = useEditorStore((s) => s.select);
  const hover = useEditorStore((s) => s.hover);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: elementId,
    data: { elementId },
    disabled: !element || element.locked || isPreview,
  });

  if (!element) return null;

  const isSelected = selectedId === element.id;
  const isHovered = hoveredId === element.id;

  const style: React.CSSProperties = {
    ...stylesToObject(element.styles),
    position: element.positionMode as React.CSSProperties["position"],
    transform: isDragging
      ? `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`
      : element.styles.transform,
    opacity: isDragging ? 0.6 : element.styles.opacity ? Number(element.styles.opacity) : 1,
  };

  const children = element.children.map((cid) => (
    <CanvasElementView key={cid} elementId={cid} isPreview={isPreview} />
  ));

  const commonProps = {
    "data-cid": element.id,
    "data-type": element.type,
    onClick: (e: React.MouseEvent) => {
      if (isPreview) return;
      e.stopPropagation();
      select(element.id);
    },
    onMouseEnter: () => !isPreview && hover(element.id),
    onMouseLeave: () => !isPreview && hover(null),
    className: cn(
      "group relative max-w-full min-w-0 break-words [overflow-wrap:anywhere]",
      !isPreview && "cursor-pointer",
      element.className,
      !isPreview && "outline-none",
      !isPreview && isSelected && "ring-2 ring-brand-500 ring-offset-1",
      !isPreview && isHovered && !isSelected && "ring-1 ring-brand-300",
      element.hidden && "hidden"
    ),
    style,
  };

  const dragHandle = !isPreview && !element.locked && (
    <span
      {...listeners}
      {...attributes}
      className="absolute -top-6 left-0 z-10 cursor-move rounded bg-brand-600 px-1.5 py-0.5 text-[10px] text-white opacity-0 group-hover:opacity-100 [.ring-brand-500~&]:opacity-100"
    >
      ⋮⋮
    </span>
  );

  const wrap = (content: React.ReactNode, Tag: React.ElementType = "div") => {
    const El = Tag;
    return (
      <El ref={setNodeRef} {...commonProps}>
        {dragHandle}
        {content}
        {children}
      </El>
    );
  };

  switch (element.type) {
    case "text":
      return wrap(
        <span className="block max-w-full break-words">{element.content || "Текст"}</span>,
        "p"
      );
    case "heading":
      return wrap(
        <span className="block max-w-full break-words">{element.content || "Заголовок"}</span>,
        "h2"
      );
    case "button":
      return wrap(
        <span className="inline-block max-w-full truncate">{element.content || "Кнопка"}</span>,
        "button"
      );
    case "link":
      return wrap(
        <span className="block max-w-full break-words">{element.content || "Ссылка"}</span>,
        "a"
      );
    case "image":
      return wrap(
        <img
          src={element.src || "https://placehold.co/400x300"}
          alt={element.alt || ""}
          draggable={false}
          className="pointer-events-none max-w-full"
        />
      );
    case "input":
      return wrap(
        <input
          readOnly
          placeholder={element.placeholder}
          className="pointer-events-none w-full bg-transparent"
        />
      );
    case "textarea":
      return wrap(
        <textarea
          readOnly
          placeholder={element.placeholder}
          defaultValue={element.content}
          className="pointer-events-none w-full resize-none bg-transparent"
        />
      );
    case "video":
      return wrap(
        <video src={element.src} className="max-w-full" controls={isPreview} />
      );
    case "divider":
      return wrap(null, "hr");
    case "map":
      return wrap(
        <div className="flex h-full min-h-[120px] items-center justify-center bg-slate-200 text-sm text-slate-500 dark:bg-slate-800">
          🗺 {element.content || "Карта"}
        </div>
      );
    case "form":
      return wrap(<div className="flex flex-col gap-2">{children}</div>, "form");
    default:
      return wrap(
        children.length ? null : (
          <span className="text-xs text-slate-400">{element.name}</span>
        )
      );
  }
}
