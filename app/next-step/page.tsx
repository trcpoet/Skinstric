"use client";

import { useLayoutEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { postPhaseOne } from "@/lib/api";
import CameraCaptureModal from "@/components/next-step/CameraCaptureModal";
import styles from "./NextStep.module.css";

type UserData = { name: string; location: string };

function ConnectorSvg() {
  return (
    <svg width="66" height="51" viewBox="0 0 66 59" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 58L63 3" stroke="#1A1B1C" strokeWidth="1" />
      <circle cx="63" cy="3" r="2.5" stroke="#1A1B1C" strokeWidth="1" />
    </svg>
  );
}

export default function NextStepPage() {
  const router = useRouter();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [phase1Error, setPhase1Error] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageReady = useCallback(
    async (imageBase64: string) => {
      setPhase1Error("");

      let userData: UserData | null = null;
      try {
        const stored = localStorage.getItem("skinstric:user");
        userData = stored ? (JSON.parse(stored) as UserData) : null;
      } catch {
        userData = null;
      }

      if (!userData?.name || !userData?.location) {
        setPhase1Error("Please complete Intro (name & location) first.");
        router.push("/take-test");
        return;
      }

      // Save image to localStorage
      try {
        localStorage.setItem("skinstric:image", imageBase64);
      } catch {
        /* continue */
      }

      // Call Phase 1 API (don't block flow on failure)
      try {
        await postPhaseOne({ name: userData.name, location: userData.location });
      } catch {
        setPhase1Error("Could not save to server. Continuing.");
        // Don't block flow
      }

      router.push("/analysis-loading");
    },
    [router]
  );

  const handleGallerySelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 =
          dataUrl.includes(",") ? dataUrl.split(",")[1]?.trim() ?? "" : dataUrl;
        if (base64) handleImageReady(base64);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [handleImageReady]
  );

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

      {phase1Error && (
        <p className="absolute left-8 top-[120px] z-[100] text-sm text-amber-700">
          {phase1Error}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleGallerySelect}
        aria-label="Select image from gallery"
      />

      {/* Modules */}
      <div className={styles.modulesRow}>
        {/* Left: Camera */}
        <div
          ref={leftModuleRef}
          role="button"
          tabIndex={0}
          className={`${styles.module} ${styles.moduleLeft} ${styles.moduleClickable}`}
          onClick={() => setCameraOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && setCameraOpen(true)}
          aria-label="Open camera to capture photo"
        >
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
            <div className={styles.captionText}>Allow A.I.<br />to Scan Your Face</div>
          </div>
        </div>

        {/* Right: Gallery */}
        <div
          ref={rightModuleRef}
          role="button"
          tabIndex={0}
          className={`${styles.module} ${styles.moduleRight} ${styles.moduleClickable}`}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          aria-label="Open gallery to select image"
        >
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
            <div className={styles.captionText}>Allow A.I <br />to Access Gallery</div>
          </div>
        </div>
      </div>

      <CameraCaptureModal
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleImageReady}
        onError={() => {}}
      />

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
