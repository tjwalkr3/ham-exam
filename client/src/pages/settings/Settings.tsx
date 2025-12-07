import Header from "../../components/layout-components/header/Header";
import InfoCard from "../../components/layout-components/info-card/InfoCard";
import styles from "./Settings.module.css";
import { useSettings, type LicenseClass, type TopicSelectionMode } from "../../context/settingsContext";
import Dropdown from "../../components/form-components/dropdown/Dropdown";

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
        <InfoCard title="Settings">
          <div className={styles.cardContent}>
            <p className={styles.helperText}>Configure how quizzes and recommendations are tailored to you.</p>

            <Dropdown
              id="license-class"
              label="License Class"
              value={licenseClass}
              onChange={(value) => setLicenseClass(value as LicenseClass)}
              options={LICENSE_OPTIONS}
              helperText="All quiz content and AI prompts will use this license class."
            />

            <Dropdown
              id="topic-mode"
              label="Topic Selection Mode"
              value={topicSelectionMode}
              onChange={(value) => setTopicSelectionMode(value as TopicSelectionMode)}
              options={TOPIC_MODE_OPTIONS}
              helperText={TOPIC_MODE_OPTIONS.find((option) => option.value === topicSelectionMode)?.helper}
            />
          </div>
        </InfoCard>
      </main>
    </div>
  );
}

export default Settings;
