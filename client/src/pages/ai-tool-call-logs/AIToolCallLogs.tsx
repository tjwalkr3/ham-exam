import { useAuth } from "react-oidc-context";
import { useQuery } from "@tanstack/react-query";
import { fetchWrapper } from "../../utils/fetchWrapper";
import { ToolCallLogArraySchema } from "../../zod-types/toolCallLogModel";
import styles from "./AiToolCallLogs.module.css";
import Header from "../../components/header/Header";
import PleaseSignIn from "../../components/please-sign-in/PleaseSignIn";

export default function AIToolCallLogs() {
  const auth = useAuth();

  const { data: toolCalls, isLoading, error } = useQuery({
    queryKey: ["toolCalls"],
    queryFn: async () => {
      const data = await fetchWrapper("/api/tool-calls", {
        token: auth.user?.access_token,
      });
      return ToolCallLogArraySchema.parse(data);
    },
    enabled: !!auth.user?.access_token,
  });

  if (!auth.isAuthenticated) {
    return (
      <div className={styles.container}>
        <Header />
        <PleaseSignIn />
      </div>
    )
  }

  if (isLoading) return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        Loading...
      </main>
    </div>
  );

  if (error) return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        Error loading tool calls
      </main>
    </div>
  );

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>AI Tool Call Logs</h1>
        <div className={styles.list}>
          {toolCalls?.map((log) => (
            <div key={log.id} className={styles.card}>
              <div className={styles.cardContent}>
                <span className={styles.timestamp}>
                  {new Date(log.timestamp).toLocaleString()}
                </span>
                <span className={styles.description}>
                  {log.toolcall_description}
                </span>
              </div>
            </div>
          ))}
          {toolCalls?.length === 0 && (
            <div className={styles.card}>No tool calls found.</div>
          )}
        </div>
      </main>
    </div>
  );
}
