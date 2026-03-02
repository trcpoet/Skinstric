"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Select.module.css";

export default function SelectPage() {
  const router = useRouter();

  return (
    <section className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.brand}>
          Skinstric
        </Link>
        <span className={styles.crumb} aria-label="Intro breadcrumb">
          <span className={styles.crumbPip} aria-hidden="true" />
          <span className={styles.crumbText}>Intro</span>
          <span className={styles.crumbPip} aria-hidden="true" />
        </span>
      </div>

      <button className={styles.enterCode} type="button">
        Enter Code
      </button>

      {/* Left intro text */}
      <div className={styles.introBlock}>
        <div className={styles.introTitle}>A.I. ANALYSIS</div>
        <p className={styles.introText}>
          A.I. HAS ESTIMATED THE FOLLOWING.<br />
          FIX ESTIMATED INFORMATION IF NEEDED.
        </p>
      </div>

      {/* Center diamond grid */}
      <div className={styles.diamondCenter}>
        <div className={styles.diamondCenterOuter} aria-hidden="true" />
        <div className={styles.diamondGrid}>
          {/* Top: Demographics (active, links to demographics) */}
          <div className={`${styles.quadrantWrap} ${styles.quadrantWrapTop}`}>
            <Link href="/demographics" className={`${styles.quadrant} ${styles.quadrantActive}`} style={{ textDecoration: "none", color: "inherit" }}>
              <span className={styles.quadrantLabel}>Demographics</span>
              <div className={styles.quadrantOverlay} aria-hidden="true">
                <div className={styles.quadrantOverlayRhombus} />
              </div>
            </Link>
          </div>

          {/* Left: Cosmetic Concerns (disabled) */}
          <div className={`${styles.quadrantWrap} ${styles.quadrantWrapLeft}`}>
            <button type="button" className={`${styles.quadrant} ${styles.quadrantDisabled}`} disabled>
              <span className={styles.quadrantLabel}>Cosmetic Concerns</span>
            </button>
          </div>

          {/* Right: Skin Type Details (disabled) */}
          <div className={`${styles.quadrantWrap} ${styles.quadrantWrapRight}`}>
            <button type="button" className={`${styles.quadrant} ${styles.quadrantDisabled}`} disabled>
              <span className={styles.quadrantLabel}>Skin Type Details</span>
            </button>
          </div>

          {/* Bottom: Weather (disabled) */}
          <div className={`${styles.quadrantWrap} ${styles.quadrantWrapBottom}`}>
            <button type="button" className={`${styles.quadrant} ${styles.quadrantDisabled}`} disabled>
              <span className={styles.quadrantLabel}>Weather</span>
            </button>
          </div>
        </div>
      </div>

      {/* Back */}
      <div
        className={styles.back}
        onClick={() => router.push("/analysis-loading")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && router.push("/analysis-loading")}
        aria-label="Back"
      >
        <svg
          className={styles.backIcon}
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M43.293 22L22 43.293L0.707031 22L22 0.707031L43.293 22Z" stroke="#1A1B1C" />
          <path d="M15.7144 22L25.1429 27.4436V16.5564L15.7144 22Z" fill="#1A1B1C" />
        </svg>
        <span className={styles.backLabel}>Back</span>
      </div>

      {/* Get Summary */}
      <div
        className={styles.getSummary}
        onClick={() => router.push("/demographics")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && router.push("/demographics")}
        aria-label="Get summary"
      >
        <span className={styles.getSummaryLabel}>Get Summary</span>
        <svg
          className={styles.getSummaryIcon}
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M43.293 22L22 43.293L0.707031 22L22 0.707031L43.293 22Z" stroke="#1A1B1C" />
          <path d="M28.1426 22L18.714 27.4436V16.5564L28.1426 22Z" fill="#1A1B1C" />
        </svg>
      </div>
    </section>
  );
}
