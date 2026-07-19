import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import ThemeToggle from "../components/ThemeToggle";
import Toast from "../components/Toast";
import { useTheme } from "../context/ThemeContext";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      nextErrors.password = "Please enter your password.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await API.post("/users/login", formData);
      
      // Store token and name
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user?.name || "User");
      
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      setToast({ type: "success", title: "Signed in", message: "Welcome back to TaskFlow." });
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (error) {
      setToast({
        type: "error",
        title: "Login failed",
        message: error.response?.data?.message || "Please check your credentials and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.themeToggleContainer}>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>

      <div className={styles.splitLayout}>
        {/* Left Side: Branding and Hero */}
        <div className={styles.brandingPanel}>
          <div className={styles.auroraBg} />
          <div className={styles.gridOverlay} />

          <div className={styles.brandingHeader}>
            <div className={styles.logoIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" />
                <path d="M2 12L12 17L22 12" />
              </svg>
            </div>
            <span className={styles.logoText}>TaskFlow</span>
          </div>

          <div className={styles.brandingContent}>
            <h1 className={styles.heroTitle}>
              Work in flow.<br />
              Complete with ease.
            </h1>
            <p className={styles.heroDesc}>
              A minimal workspace designed for focus, progress, and clarity.
            </p>

            <ul className={styles.featureList}>
              <li className={styles.featureItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}>
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Lightning-fast task capture & instant search</span>
              </li>
              <li className={styles.featureItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}>
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Visual progress metrics & weekly momentum</span>
              </li>
              <li className={styles.featureItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}>
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Clean, adaptive light & dark themes</span>
              </li>
            </ul>
          </div>

          <div className={styles.illustrationPlaceholder}>
            <div className={styles.floatingCard1}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Sprint Planning</span>
                <span className={styles.cardTagHigh}>High Priority</span>
              </div>
              <div className={styles.cardProgress}>
                <div className={styles.cardProgressBar} style={{ width: "75%" }} />
              </div>
            </div>
            <div className={styles.floatingCard2}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>UI Redesign Review</span>
                <span className={styles.cardTagMedium}>Normal</span>
              </div>
              <div className={styles.cardProgress}>
                <div className={styles.cardProgressBar} style={{ width: "40%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Glassmorphic Form Card */}
        <div className={styles.formPanel}>
          <div className={styles.glassCard}>
            <div className={styles.cardHeaderArea}>
              <span className={styles.eyebrow}>Secure Sign-In</span>
              <h2 className={styles.formTitle}>Welcome Back</h2>
              <p className={styles.formSubtitle}>Enter your details to access your workspace</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email address</label>
                <div className={styles.inputWrapper}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.inputIcon}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.modernInput}
                  />
                </div>
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.inputWrapper}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.inputIcon}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={styles.modernInput}
                  />
                  <button
                    type="button"
                    className={styles.toggleVisibility}
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
              </div>

              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxText}>Remember me</span>
                </label>
              </div>

              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? <span className={styles.spinner}></span> : "Log In"}
              </button>
            </form>

            <div className={styles.cardFooter}>
              <span>New here?</span>
              <Link to="/register" className={styles.footerLink}>Create an account</Link>
            </div>
          </div>
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default Login;