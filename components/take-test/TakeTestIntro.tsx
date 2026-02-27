"use client";

import { useRef, useLayoutEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type Step = "name" | "location";

const API_URL =
  "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseOne";

export default function TakeTestIntro() {
  const router = useRouter();
  const prefersReducedMotion = usePrefersReducedMotion();

  /* ── Refs for GSAP targets ── */
  const headerRef = useRef<HTMLDivElement>(null);
  const analysisTextRef = useRef<HTMLDivElement>(null);
  const enterCodeRef = useRef<HTMLButtonElement>(null);
  const clickToTypeRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const backButtonRef = useRef<HTMLDivElement>(null);
  const diamondOuterRef = useRef<HTMLDivElement>(null);
  const diamondMiddleRef = useRef<HTMLDivElement>(null);
  const diamondInnerRef = useRef<HTMLDivElement>(null);

  /* ── State ── */
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ── GSAP entrance animation ── */
  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      gsap.set(
        [
          headerRef.current,
          analysisTextRef.current,
          enterCodeRef.current,
          clickToTypeRef.current,
          inputRef.current,
          backButtonRef.current,
          diamondOuterRef.current,
          diamondMiddleRef.current,
          diamondInnerRef.current,
        ],
        { autoAlpha: 0 }
      );

      gsap.set(headerRef.current, { y: -20 });
      gsap.set(analysisTextRef.current, { y: 20 });
      gsap.set(clickToTypeRef.current, { y: 15 });
      gsap.set(inputRef.current, { y: 25 });
      gsap.set(backButtonRef.current, { x: -20 });

      tl.to(headerRef.current, { autoAlpha: 1, y: 0, duration: 0.6 })
        .to(
          enterCodeRef.current,
          { autoAlpha: 1, duration: 0.5 },
          "-=0.3"
        )
        .to(
          analysisTextRef.current,
          { autoAlpha: 1, y: 0, duration: 0.6 },
          "-=0.3"
        )
        .to(
          [diamondOuterRef.current, diamondMiddleRef.current, diamondInnerRef.current],
          { autoAlpha: 1, scale: 1, duration: 0.8 },
          "-=0.4"
        )
        .to(
          clickToTypeRef.current,
          { autoAlpha: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .to(
          inputRef.current,
          { autoAlpha: 1, y: 0, duration: 0.7 },
          "-=0.3"
        )
        .to(
          backButtonRef.current,
          { autoAlpha: 1, x: 0, duration: 0.5 },
          "-=0.3"
        );
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  /* ── Animate step transition ── */
  const animateStepChange = useCallback(
    (nextStep: Step) => {
      if (prefersReducedMotion) {
        setStep(nextStep);
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          setStep(nextStep);
          // Animate new step in after state update
          requestAnimationFrame(() => {
            gsap.fromTo(
              [clickToTypeRef.current, inputRef.current],
              { autoAlpha: 0, y: 15 },
              { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.1 }
            );
            // Focus the input after animation
            inputRef.current?.focus();
          });
        },
      });

      tl.to([clickToTypeRef.current, inputRef.current], {
        autoAlpha: 0,
        y: -15,
        duration: 0.3,
        ease: "power2.in",
      });
    },
    [prefersReducedMotion]
  );

  /* ── Submit handler ── */
  const handleSubmit = useCallback(async () => {
    setError("");

    const isValidTextValue = (value: string, fieldLabel: string) => {
      const trimmed = value.trim();

      if (!trimmed) {
        setError(`Please enter your ${fieldLabel}.`);
        return false;
      }

      if (trimmed.length > 100) {
        setError(`${fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1)} is too long.`);
        return false;
      }

      // Allow letters, spaces, apostrophes and hyphens – but no digits
      const textOnlyPattern = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
      if (!textOnlyPattern.test(trimmed)) {
        setError(`Please enter a valid ${fieldLabel} using letters only.`);
        return false;
      }

      return true;
    };

    if (step === "name") {
      if (!isValidTextValue(name, "name")) return;
      animateStepChange("location");
      return;
    }

    // step === "location"
    if (!isValidTextValue(location, "location")) return;

    const userData = { name: name.trim(), location: location.trim() };

    // Save locally
    try {
      localStorage.setItem("skinstric:user", JSON.stringify(userData));
    } catch {
      // localStorage might be unavailable — continue anyway
    }

    // Send to API
    setIsSubmitting(true);
    try {
      console.log("[Skinstric] POST", API_URL, userData);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        console.log("[Skinstric] API success:", data);
      } else {
        throw new Error(`Server responded with ${res.status}`);
      }
    } catch (err) {
      console.error("[Skinstric] API error:", err);
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);

    router.push("/next-step");
  }, [step, name, location, animateStepChange, router]);

  /* ── Key handler ── */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const placeholderText = step === "name" ? "Introduce Yourself" : "your city name";
  const helperText = "click to type";

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F5F5F5] font-[Roobert_TRIAL,sans-serif]">
      {/* ── Header ── */}
      <div ref={headerRef} className="absolute left-8 top-4 z-[100]">
        <div className="flex items-center gap-3 text-base">
          <Link
            href="/"
            className="font-bold uppercase tracking-wide text-[#1A1B1C] no-underline"
          >
            Skinstric
          </Link>
          <span className="flex items-center gap-1 text-[#A0A4AB]">
            <span className="text-xs leading-none">&#x2503;</span>
            <span className="text-sm font-normal uppercase">Intro</span>
            <span className="text-xs leading-none">&#x2503;</span>
          </span>
        </div>
      </div>

      {/* ── Enter Code button ── */}
      <button
        ref={enterCodeRef}
        className={cn(
          "absolute right-[72px] top-4 z-[100]",
          "bg-[#1A1B1C] px-3 py-1 text-[10px] font-bold uppercase leading-3",
          "tracking-[-0.02em] text-white",
          "border border-[#1A1B1C] transition-colors",
          "hover:bg-transparent hover:text-[#1A1B1C]",
          "cursor-pointer"
        )}
      >
        Enter Code
      </button>

      {/* ── TO START ANALYSIS ── */}
      <div
        ref={analysisTextRef}
        className={cn(
          "absolute left-8 top-[86px] z-[100]",
          "text-base font-semibold uppercase leading-6 tracking-[-0.02em] text-[#1A1B1C]",
          "w-[227px] h-6"
        )}
      >
        To Start Analysis
      </div>

      {/* ── Rotating diamonds ── */}
      <div ref={diamondOuterRef} className="diamond diamond-outer" aria-hidden="true" />
      <div ref={diamondMiddleRef} className="diamond diamond-middle" aria-hidden="true" />
      <div ref={diamondInnerRef} className="diamond diamond-inner" aria-hidden="true" />

      {/* ── Center input area ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {/* CLICK TO TYPE helper */}
        <div
          ref={clickToTypeRef}
          className="mb-2 text-sm font-normal uppercase tracking-normal text-[#1A1B1C] opacity-40"
        >
          {helperText}
        </div>

        {/* Main input */}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholderText}
          value={step === "name" ? name : location}
          onChange={(e) => {
            setError("");
            if (step === "name") {
              setName(e.target.value);
            } else {
              setLocation(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          className={cn(
            "w-[800px] max-w-[90vw] border-none bg-transparent outline-none",
            "text-center text-[64px] font-light leading-none text-[#1A1B1C]",
            "pb-2",
            "placeholder:text-[#A0A4AB]",
            "cursor-text",
            // Underline via background gradient
            "[background-image:linear-gradient(#000,#000)]",
            "[background-position:center_calc(100%_-_8px)]",
            "[background-repeat:no-repeat]",
            "[background-size:60%_0.5px]"
          )}
          autoFocus
        />

        {/* Error message */}
        {error && (
          <p className="mt-4 text-sm text-red-500 transition-opacity duration-300">
            {error}
          </p>
        )}

        {/* Submit hint */}
        {step === "location" && !error && (
          <p className="mt-4 text-xs uppercase tracking-wide text-[#A0A4AB]">
            Press Enter to submit
          </p>
        )}
      </div>

      {/* ── Back button ── */}
      <div
        ref={backButtonRef}
        className="fixed bottom-8 left-8 z-[100] flex cursor-pointer items-center gap-2 group"
        onClick={() => {
          if (step === "location") {
            animateStepChange("name");
          } else {
            router.push("/");
          }
        }}
      >
        <button
          className="relative flex items-center justify-center outline-none transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[0.8]"
          aria-label="Back"
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M43.293 22L22 43.293L0.707031 22L22 0.707031L43.293 22Z"
              stroke="#1A1B1C"
              className="transition-colors duration-500 ease-out group-hover:fill-[#1A1B1C]"
            />
            <path
              d="M15.7144 22L25.1429 27.4436V16.5564L15.7144 22Z"
              fill="#1A1B1C"
              className="transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:fill-white group-hover:-translate-x-1"
            />
          </svg>
        </button>
        <span className="text-sm font-bold uppercase tracking-wide text-[#1A1B1C] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1">
          Back
        </span>
      </div>
    </section>
  );
}
