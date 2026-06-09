import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth-context";
import { createContext, useContext, useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

export interface AppSettings {
  locale: Locale;
  autosave: boolean;
  autosaveInterval: 3 | 10 | 30;
  showGrid: boolean;
  snapToGrid: boolean;
  compactMode: boolean;
  showElementLabels: boolean;
  defaultPositionMode: "relative" | "absolute";
}

const defaultSettings: AppSettings = {
  locale: "ru",
  autosave: true,
  autosaveInterval: 3,
  showGrid: true,
  snapToGrid: true,
  compactMode: false,
  showElementLabels: true,
  defaultPositionMode: "absolute",
};

const SettingsContext = createContext<{
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
  resetSettings: () => void;
}>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
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

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem("constructor-settings", JSON.stringify(defaultSettings));
  };

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
          {children}
        </SettingsContext.Provider>
      </ThemeProvider>
    </AuthProvider>
  );
}
