import { Providers } from "@/components/providers";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
