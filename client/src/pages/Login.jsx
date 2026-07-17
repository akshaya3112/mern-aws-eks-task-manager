import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/users/login", formData);

      localStorage.setItem("token", res.data.token);

      alert("Login Successful ✅");

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed ❌");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.hero}>
          <div className={styles.heroBadge}>TaskFlow</div>
          <h1>Stay on top of every important task.</h1>
          <p>
            A calm, focused dashboard for your daily priorities, deadlines, and plans.
          </p>
          <ul>
            <li>Secure access with your existing account</li>
            <li>Fast task entry and clear progress tracking</li>
            <li>Designed for a smooth mobile and desktop experience</li>
          </ul>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <p className={styles.eyebrow}>Welcome back</p>
            <h2>Sign in</h2>
            <p>Continue managing your work with a clean and modern workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className={styles.primaryButton}>
              Log in
            </button>
          </form>

          <div className={styles.footerLink}>
            <span>New here?</span>
            <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;