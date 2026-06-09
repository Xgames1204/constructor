"use client";

import { useDraggable } from "@dnd-kit/core";
import type { ElementType } from "@/types/editor";
import {
  Box,
  CreditCard,
  FormInput,
  Heading,
  Image,
  Layout,
  Link,
  List,
  Minus,
  MousePointer,
  Navigation,
  PanelBottom,
  Play,
  SeparatorHorizontal,
  SlidersHorizontal,
  Table,
  Text,
  Video,
} from "lucide-react";

const ELEMENTS: { type: ElementType; label: string; icon: React.ElementType }[] = [
  { type: "text", label: "Текст", icon: Text },
  { type: "heading", label: "Заголовок", icon: Heading },
  { type: "button", label: "Кнопка", icon: MousePointer },
  { type: "link", label: "Ссылка", icon: Link },
  { type: "image", label: "Изображение", icon: Image },
  { type: "container", label: "Контейнер", icon: Box },
  { type: "section", label: "Секция", icon: Layout },
  { type: "form", label: "Форма", icon: FormInput },
  { type: "input", label: "Поле ввода", icon: FormInput },
  { type: "textarea", label: "Текст. область", icon: Text },
  { type: "video", label: "Видео", icon: Video },
  { type: "slider", label: "Слайдер", icon: SlidersHorizontal },
  { type: "divider", label: "Разделитель", icon: Minus },
  { type: "spacer", label: "Отступ", icon: SeparatorHorizontal },
  { type: "navbar", label: "Навбар", icon: Navigation },
  { type: "footer", label: "Подвал", icon: PanelBottom },
  { type: "card", label: "Карточка", icon: CreditCard },
  { type: "list", label: "Список", icon: List },
  { type: "table", label: "Таблица", icon: Table },
  { type: "embed", label: "Встраивание", icon: Play },
];

function DraggableItem({
  type,
  label,
  icon: Icon,
}: {
  type: ElementType;
  label: string;
  icon: React.ElementType;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, fromPalette: true },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      title={label}
      className={`flex w-full min-w-0 cursor-grab items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-2 transition hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Icon className="h-4 w-4 shrink-0 text-brand-600" />
      <span className="min-w-0 flex-1 text-left text-xs leading-snug">{label}</span>
    </div>
  );
}

export function ElementPalette() {
  return (
    <div className="flex flex-col gap-1.5 p-2">
      {ELEMENTS.map((el) => (
        <DraggableItem key={el.type} {...el} />
      ))}
    </div>
  );
}
