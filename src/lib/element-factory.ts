import { v4 as uuid } from "uuid";
import type { CanvasElement, ElementType } from "@/types/editor";

const DEFAULTS: Partial<
  Record<ElementType, Partial<CanvasElement>>
> = {
  text: {
    content: "Новый текст",
    styles: { fontSize: "16px", color: "#333", padding: "8px" },
  },
  heading: {
    content: "Заголовок",
    styles: { fontSize: "32px", fontWeight: "700", color: "#111", padding: "12px" },
  },
  button: {
    content: "Кнопка",
    styles: {
      padding: "12px 24px",
      backgroundColor: "#0c8ce9",
      color: "#fff",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontSize: "16px",
    },
  },
  image: {
    src: "https://placehold.co/400x300/e2e8f0/64748b?text=Image",
    alt: "Изображение",
    styles: { width: "400px", height: "auto", borderRadius: "8px" },
  },
  container: {
    styles: {
      minHeight: "120px",
      padding: "16px",
      backgroundColor: "#f8fafc",
      border: "1px dashed #cbd5e1",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
  },
  section: {
    styles: {
      minHeight: "200px",
      padding: "24px",
      width: "100%",
    },
  },
  form: {
    styles: {
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      backgroundColor: "#f1f5f9",
      borderRadius: "12px",
    },
  },
  input: {
    placeholder: "Введите текст...",
    styles: {
      padding: "10px 14px",
      border: "1px solid #cbd5e1",
      borderRadius: "6px",
      fontSize: "14px",
      width: "100%",
    },
  },
  video: {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    styles: { width: "100%", maxWidth: "640px", borderRadius: "8px" },
  },
  map: {
    content: "Москва",
    styles: { width: "100%", height: "300px", border: "none", borderRadius: "8px" },
  },
  slider: {
    styles: {
      minHeight: "200px",
      backgroundColor: "#e2e8f0",
      borderRadius: "12px",
      padding: "16px",
    },
  },
  divider: {
    styles: { width: "100%", border: "none", borderTop: "1px solid #e2e8f0", margin: "16px 0" },
  },
  link: {
    content: "Ссылка",
    href: "#",
    styles: { color: "#0c8ce9", fontSize: "16px", textDecoration: "underline" },
  },
  spacer: {
    styles: { height: "48px", width: "100%" },
  },
  card: {
    styles: {
      padding: "24px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      maxWidth: "360px",
    },
  },
};

export function createElement(
  type: ElementType,
  parentId: string | null = null
): CanvasElement {
  const id = uuid();
  const base = DEFAULTS[type] || {};
  return {
    id,
    type,
    name: type.charAt(0).toUpperCase() + type.slice(1),
    children: [],
    parentId,
    positionMode: "relative",
    styles: {
      position: "relative",
      ...(base.styles || {}),
    },
    content: base.content,
    src: base.src,
    alt: base.alt,
    href: base.href,
    placeholder: base.placeholder,
  };
}
