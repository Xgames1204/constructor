import Link from "next/link";

export default function SiteNotFound() {
  return (
    <div style={{ padding: 48, textAlign: "center", fontFamily: "system-ui" }}>
      <h1>404</h1>
      <p>Сайт не найден или не опубликован.</p>
      <Link href="/">Constructor</Link>
    </div>
  );
}
