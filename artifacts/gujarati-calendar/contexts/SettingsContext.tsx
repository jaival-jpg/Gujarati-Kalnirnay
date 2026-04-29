import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

export type ThemeMode = "light" | "dark" | "system";

interface SettingsState {
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  language: "gu";
}

interface SettingsContextValue extends SettingsState {
  resolvedScheme: "light" | "dark";
  ready: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
}

const STORAGE_KEY = "@gujarati-calendar/settings/v1";

const defaultState: SettingsState = {
  themeMode: "system",
  notificationsEnabled: false,
  language: "gu",
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [state, setState] = useState<SettingsState>(defaultState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!mounted) return;
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as Partial<SettingsState>;
            setState({ ...defaultState, ...parsed });
          } catch {
            // ignore corrupt persisted state
          }
        }
      })
      .finally(() => {
        if (mounted) setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback(async (next: SettingsState) => {
    setState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // best-effort
    }
  }, []);

  const setThemeMode = useCallback(
    async (mode: ThemeMode) => {
      await persist({ ...state, themeMode: mode });
    },
    [state, persist],
  );

  const setNotificationsEnabled = useCallback(
    async (enabled: boolean) => {
      await persist({ ...state, notificationsEnabled: enabled });
    },
    [state, persist],
  );

  const resolvedScheme: "light" | "dark" = useMemo(() => {
    if (state.themeMode === "light") return "light";
    if (state.themeMode === "dark") return "dark";
    return systemScheme === "dark" ? "dark" : "light";
  }, [state.themeMode, systemScheme]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      ...state,
      resolvedScheme,
      ready,
      setThemeMode,
      setNotificationsEnabled,
    }),
    [state, resolvedScheme, ready, setThemeMode, setNotificationsEnabled],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
}

export function useOptionalSettings(): SettingsContextValue | null {
  return useContext(SettingsContext);
}
