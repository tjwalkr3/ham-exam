import Header from "../../components/header/Header";
import styles from "./Settings.module.css";
import { useSettings, type LicenseClass, type TopicSelectionMode } from "../../context/settingsContext";

const LICENSE_OPTIONS: Array<{ value: LicenseClass; label: string }> = [
  { value: "T", label: "Technician" },
  { value: "G", label: "General" },
  { value: "E", label: "Extra" },
];

const TOPIC_MODE_OPTIONS: Array<{ value: TopicSelectionMode; label: string; helper: string }> = [
  {
    value: "ai",
    label: "AI-Enhanced Topic Selection",
    helper: "Let the AI analyze your mastery data and pick the next subsection.",
  },
  {
    value: "mastery",
    label: "Select Topic Based On Lowest Mastery",
    helper: "Always choose the subsection where your mastery score is currently the lowest.",
  },
];

function Settings() {
  const { licenseClass, setLicenseClass, topicSelectionMode, setTopicSelectionMode } = useSettings();

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.section}>
            <h1 className={styles.heading}>Settings</h1>
            <p className={styles.helperText}>Configure how quizzes and recommendations are tailored to you.</p>
          </div>

          <div className={styles.section}>
            <label className={styles.label} htmlFor="license-class">
              License Class
            </label>
            <select
              id="license-class"
              className={styles.select}
              value={licenseClass}
              onChange={(event) => setLicenseClass(event.target.value as LicenseClass)}
            >
              {LICENSE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className={styles.helperText}>All quiz content and AI prompts will use this license class.</p>
          </div>

          <div className={styles.section}>
            <label className={styles.label} htmlFor="topic-mode">
              Topic Selection Mode
            </label>
            <select
              id="topic-mode"
              className={styles.select}
              value={topicSelectionMode}
              onChange={(event) => setTopicSelectionMode(event.target.value as TopicSelectionMode)}
            >
              {TOPIC_MODE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className={styles.helperText}>
              {TOPIC_MODE_OPTIONS.find((option) => option.value === topicSelectionMode)?.helper}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
