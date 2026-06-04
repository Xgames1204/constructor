"use client";

import { VisualBlockEditor } from "./visual-block-editor";
import { CLIENT_BLOCK_DEFINITIONS } from "@/lib/block-catalog";
import { useEditorStore } from "@/store/editor-store";

export function BlockEditor() {
  const targetId = useEditorStore((s) => s.blockTargetElementId || "global");
  const getGlobalScript = useEditorStore((s) => s.getGlobalScript);
  const updateBlocks = useEditorStore((s) => s.updateBlocks);

  return (
    <VisualBlockEditor
      scriptKey={targetId}
      definitions={CLIENT_BLOCK_DEFINITIONS}
      getScript={getGlobalScript}
      onSave={updateBlocks}
      saveLabel="Сохранить скрипт страницы"
      hint="Соединяйте блоки: снизу блока → сверху следующего. Клавишу выберите в блоке «Нажатие клавиши». Условия — выходы «да» и «нет» справа."
    />
  );
}
