import { useParams } from "wouter";
import { EditorShell } from "@/components/editor/editor-shell";

export default function EditorPage() {
  const { projectId } = useParams<{ projectId: string }>();
  return <EditorShell projectId={projectId} />;
}
