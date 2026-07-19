import styles from './ThemeToggle.module.css';

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
      <span>{theme === 'dark' ? 'Light' : 'Dark'} mode</span>
    </button>
  );
}

export default ThemeToggle;
