import { toast, Toaster, ToastBar } from 'react-hot-toast'
import styles from './AppToaster.module.css'

const AppToaster = () => (
  <Toaster
    position="bottom-right"
    reverseOrder
    containerStyle={{ zIndex: 4000 }}
    toastOptions={{
      duration: Infinity,
      className: styles.toast,
      iconTheme: {
        primary: '#0369a1',
        secondary: '#e0f2fe',
      },
      success: {
        duration: Infinity,
        className: `${styles.toast} ${styles.toastSuccess}`,
        iconTheme: {
          primary: '#f0f9ff',
          secondary: '#0284c7',
        },
      },
      error: {
        duration: Infinity,
        className: `${styles.toast} ${styles.toastError}`,
        iconTheme: {
          primary: '#dc2626',
          secondary: '#ffffff',
        },
      },
    }}
  >
    {(t) => (
      <ToastBar
        toast={t}
        style={{ padding: 0, background: '#f8fafc', boxShadow: 'none' }}
      >
        {({ icon, message }) => (
          <div className={styles.content}>
            <span className={styles.icon}>{icon}</span>
            <span className={styles.message}>{message}</span>
            <button
              type="button"
              className={styles.dismissButton}
              onClick={() => toast.dismiss(t.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}
      </ToastBar>
    )}
  </Toaster>
)

export default AppToaster
