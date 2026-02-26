"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import styles from "./NextStep.module.css";

function ConnectorSvg() {
  return (
    <svg width="66" height="59" viewBox="0 0 66 59" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 58L63 3" stroke="#1A1B1C" strokeWidth="1" />
      <circle cx="63" cy="3" r="2.5" stroke="#1A1B1C" strokeWidth="1" />
    </svg>
  );
}

export default function NextStepPage() {
  const router = useRouter();
  const prefersReducedMotion = usePrefersReducedMotion();

  const headerRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  const enterCodeRef = useRef<HTMLButtonElement>(null);
  const leftModuleRef = useRef<HTMLDivElement>(null);
  const rightModuleRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(
        [
          headerRef.current,
          analysisRef.current,
          enterCodeRef.current,
          leftModuleRef.current,
          rightModuleRef.current,
          backRef.current,
        ],
        { autoAlpha: 0 }
      );

      gsap.set(headerRef.current, { y: -14 });
      gsap.set(analysisRef.current, { y: 10 });
      gsap.set(leftModuleRef.current, { x: -22, y: 8 });
      gsap.set(rightModuleRef.current, { x: 22, y: 8 });
      gsap.set(backRef.current, { y: 10 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.to(headerRef.current, { autoAlpha: 1, y: 0, duration: 0.6 })
        .to(enterCodeRef.current, { autoAlpha: 1, duration: 0.5 }, "-=0.35")
        .to(analysisRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.25")
        .to(leftModuleRef.current, { autoAlpha: 1, x: 0, y: 0, duration: 0.8 }, "-=0.2")
        .to(rightModuleRef.current, { autoAlpha: 1, x: 0, y: 0, duration: 0.8 }, "-=0.7")
        .to(backRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.55");
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section className={styles.page}>
      {/* Header */}
      <div ref={headerRef} className={styles.header}>
        <Link href="/" className={styles.brand}>
          Skinstric
        </Link>
        <span className={styles.crumb} aria-label="Intro breadcrumb">
          <span className={styles.crumbPip} aria-hidden="true" />
          <span className={styles.crumbText}>Intro</span>
          <span className={styles.crumbPip} aria-hidden="true" />
        </span>
      </div>

      <button ref={enterCodeRef} className={styles.enterCode} type="button">
        Enter Code
      </button>

      <div ref={analysisRef} className={styles.analysis}>
        To Start Analysis
      </div>

      {/* Modules */}
      <div className={styles.modulesRow}>
        {/* Left: Camera */}
        <div ref={leftModuleRef} className={`${styles.module} ${styles.moduleLeft}`}>
          <div className={`${styles.rhombus} ${styles.rhombusOuter}`} aria-hidden="true" />
          <div className={`${styles.rhombus} ${styles.rhombusMid}`} aria-hidden="true" />
          <div className={`${styles.rhombus} ${styles.rhombusInner}`} aria-hidden="true" />

          <img
            alt="Camera"
            className={`${styles.icon} ${styles.iconCamera}`}
            src="/new-camera.svg"
            width={136}
            height={136}
            draggable={false}
          />

          <div className={styles.connectorLeft} aria-hidden="true">
            <ConnectorSvg />
          </div>
          <div className={styles.captionLeft}>
            <div className={styles.captionText}>Allow A.I. to Scan Your Face</div>
          </div>
        </div>

        {/* Right: Gallery */}
        <div ref={rightModuleRef} className={`${styles.module} ${styles.moduleRight}`}>
          <div className={`${styles.rhombus} ${styles.rhombusOuter}`} aria-hidden="true" />
          <div className={`${styles.rhombus} ${styles.rhombusMid}`} aria-hidden="true" />
          <div className={`${styles.rhombus} ${styles.rhombusInner}`} aria-hidden="true" />

          <img
            alt="Gallery"
            className={`${styles.icon} ${styles.iconGallery}`}
            src="/gallery.svg"
            width={136}
            height={136}
            draggable={false}
          />

          <div className={styles.connectorRight} aria-hidden="true">
            <ConnectorSvg />
          </div>
          <div className={styles.captionRight}>
            <div className={styles.captionText}>Allow A.I. Access Gallery</div>
          </div>
        </div>
      </div>

      {/* Back */}
      <div ref={backRef} className={styles.back} onClick={() => router.push("/take-test")}>
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
    </section>
  );
}
