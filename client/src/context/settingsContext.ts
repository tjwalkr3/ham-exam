import { createContext, useContext } from "react";

export type LicenseClass = "T" | "G" | "E";
export type TopicSelectionMode = "ai" | "mastery";

export interface SettingsContextValue {
  licenseClass: LicenseClass;
  setLicenseClass: (value: LicenseClass) => void;
  topicSelectionMode: TopicSelectionMode;
  setTopicSelectionMode: (value: TopicSelectionMode) => void;
  examDate: string | null;
  setExamDate: (value: string | null) => void;
}

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
