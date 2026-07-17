import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import styles from "./Register.module.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      await API.post("/users/register", formData);

      alert("Registration Successful ✅");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed ❌");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.hero}>
          <div className={styles.heroBadge}>Create account</div>
          <h1>Build your personal productivity hub.</h1>
          <p>Join thousands of people organizing work, ideas, and goals in one clear place.</p>
          <ul>
            <li>Secure and fast account setup</li>
            <li>Elegant experience built for focus</li>
            <li>Manage tasks from any device</li>
          </ul>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <p className={styles.eyebrow}>Start fresh</p>
            <h2>Register</h2>
            <p>Create your account and begin planning smarter.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Alex Morgan"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

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
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.primaryButton}>
              Create account
            </button>
          </form>

          <div className={styles.footerLink}>
            <span>Already have an account?</span>
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;