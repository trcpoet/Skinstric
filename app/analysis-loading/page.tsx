"use client";

import { useLayoutEffect, useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { postPhaseTwo } from "@/lib/api";
import styles from "./AnalysisLoading.module.css";

type Status = "loading" | "success" | "error";

export default function AnalysisLoadingPage() {
  const router = useRouter();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);
  const diamond1Ref = useRef<HTMLDivElement>(null);
  const diamond2Ref = useRef<HTMLDivElement>(null);
  const diamond3Ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set([contentRef.current, diamond1Ref.current, diamond2Ref.current, diamond3Ref.current], {
        autoAlpha: 0,
      });
      gsap.set(contentRef.current, { y: 10 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.to(diamond1Ref.current, { autoAlpha: 0.3, duration: 0.6 })
        .to(diamond2Ref.current, { autoAlpha: 0.6, duration: 0.5 }, "-=0.3")
        .to(diamond3Ref.current, { autoAlpha: 1, duration: 0.5 }, "-=0.3")
        .to(contentRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.5");
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const run = async () => {
      let imageBase64 = "";
      try {
        imageBase64 = localStorage.getItem("skinstric:image") || "";
      } catch {
        setStatus("error");
        setErrorMessage("No image found. Please try again.");
        return;
      }

      if (!imageBase64) {
        setStatus("error");
        setErrorMessage("No image found. Please go back and capture or select an image.");
        return;
      }

      try {
        const res = await postPhaseTwo({ Image: imageBase64 });

        if (res.data) {
          try {
            localStorage.setItem("skinstric:predictions", JSON.stringify(res.data));
          } catch {
            /* ignore */
          }
          setStatus("success");
          router.push("/demographics");
        } else {
          throw new Error("Invalid response");
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      }
    };

    run();
  }, [router]);

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <a href="/" className={styles.brand}>
          Skinstric
        </a>
        <span className={styles.crumb} aria-hidden="true">
          <span className={styles.crumbPip} />
          <span className={styles.crumbText}>Intro</span>
          <span className={styles.crumbPip} />
        </span>
      </div>

      <div className={styles.analysisLabel}>To Start Analysis</div>

      <div className={styles.center}>
        <div
          ref={diamond1Ref}
          className={`${styles.rhombus} ${styles.rhombusOuter}`}
          aria-hidden="true"
        />
        <div
          ref={diamond2Ref}
          className={`${styles.rhombus} ${styles.rhombusMid}`}
          aria-hidden="true"
        />
        <div
          ref={diamond3Ref}
          className={`${styles.rhombus} ${styles.rhombusInner}`}
          aria-hidden="true"
        />

        <div ref={contentRef} className={styles.content}>
          {status === "loading" && (
            <p className={styles.loadingText}>Preparing your analysis…</p>
          )}
          {status === "error" && (
            <div className={styles.errorBlock}>
              <p className={styles.errorText}>{errorMessage}</p>
              <button
                type="button"
                className={styles.tryAgain}
                onClick={() => router.push("/next-step")}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
