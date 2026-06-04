import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth-context";
import { createContext, useContext, useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

interface AppSettings {
  locale: Locale;
  autosave: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
}

const defaultSettings: AppSettings = {
  locale: "ru",
  autosave: true,
  showGrid: true,
  snapToGrid: true,
};

const SettingsContext = createContext<{
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
}>({
  settings: defaultSettings,
  updateSettings: () => {},
});

export function useAppSettings() {
  return useContext(SettingsContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("constructor-settings");
      if (saved) setSettings({ ...defaultSettings, ...JSON.parse(saved) });
    } catch {
      /* empty */
    }
  }, []);

  const updateSettings = (patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem("constructor-settings", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SettingsContext.Provider value={{ settings, updateSettings }}>
          {children}
        </SettingsContext.Provider>
      </ThemeProvider>
    </AuthProvider>
  );
}
