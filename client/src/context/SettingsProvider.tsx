import { type ReactNode, useState } from "react";
import { SettingsContext, type LicenseClass, type TopicSelectionMode } from "./settingsContext";

const LICENSE_STORAGE_KEY = "ham-exam-license-class";
const MODE_STORAGE_KEY = "ham-exam-topic-mode";
const DEFAULT_LICENSE_CLASS: LicenseClass = "T";
const DEFAULT_TOPIC_MODE: TopicSelectionMode = "ai";

const isBrowser = typeof window !== "undefined";

function readLicenseClass(): LicenseClass {
  if (!isBrowser) return DEFAULT_LICENSE_CLASS;
  const stored = window.localStorage.getItem(LICENSE_STORAGE_KEY);
  if (stored === "T" || stored === "G" || stored === "E") {
    return stored;
  }
  return DEFAULT_LICENSE_CLASS;
}

function readTopicMode(): TopicSelectionMode {
  if (!isBrowser) return DEFAULT_TOPIC_MODE;
  const stored = window.localStorage.getItem(MODE_STORAGE_KEY);
  if (stored === "ai" || stored === "mastery") {
    return stored;
  }
  return DEFAULT_TOPIC_MODE;
}

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [licenseClass, setLicenseClassState] = useState<LicenseClass>(() => readLicenseClass());
  const [topicSelectionMode, setTopicSelectionModeState] = useState<TopicSelectionMode>(() => readTopicMode());

  const setLicenseClass = (value: LicenseClass) => {
    setLicenseClassState(value);
    if (isBrowser) {
      window.localStorage.setItem(LICENSE_STORAGE_KEY, value);
    }
  };

  const setTopicSelectionMode = (value: TopicSelectionMode) => {
    setTopicSelectionModeState(value);
    if (isBrowser) {
      window.localStorage.setItem(MODE_STORAGE_KEY, value);
    }
  };

  return (
    <SettingsContext.Provider
      value={{ licenseClass, setLicenseClass, topicSelectionMode, setTopicSelectionMode }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
