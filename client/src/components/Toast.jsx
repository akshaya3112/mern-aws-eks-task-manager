import { useEffect } from 'react';
import styles from './Toast.module.css';

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => onClose(), 2400);
    return () => window.clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <div>
        <strong>{toast.title}</strong>
        <p>{toast.message}</p>
      </div>
      <button type="button" onClick={onClose} aria-label="Close notification">
        ×
      </button>
    </div>
  );
}

export default Toast;
