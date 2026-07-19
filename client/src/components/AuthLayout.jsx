import { Link } from "react-router-dom";
import styles from "./AuthLayout.module.css";

function AuthLayout({
  eyebrow,
  title,
  description,
  children,
  footerText,
  footerLink,
  footerHref,
  heroTitle,
  heroDescription,
  highlights,
}) {
  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <section className={styles.hero}>
          <div className={styles.heroBadge}>TaskFlow</div>
          <h1>{heroTitle}</h1>
          <p>{heroDescription}</p>
          <ul>
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.formCard}>
          <div className={styles.formHeader}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>

          {children}

          <div className={styles.footerLink}>
            <span>{footerText}</span>
            <Link to={footerHref}>{footerLink}</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthLayout;
