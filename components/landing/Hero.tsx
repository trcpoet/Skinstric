"use client";

import { useRef, useLayoutEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import LandingHeader from "./LandingHeader";
import DecorativeDashedFrame from "./DecorativeDashedFrame";
import HeroSideControl from "./HeroSideControl";
import HeroCaption from "./HeroCaption";

export default function Hero() {
  const router = useRouter();
  const prefersReducedMotion = usePrefersReducedMotion();

  const headerRef = useRef<HTMLElement>(null);
  const decoLeftRef = useRef<HTMLDivElement>(null);
  const decoRightRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const controlLeftRef = useRef<HTMLDivElement>(null);
  const controlRightRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const deltaXRef = useRef(0);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const deltaXLine1Ref = useRef(0);
  const deltaXLine2Ref = useRef(0);

  // Calculate alignment delta for the H1 animation
  useLayoutEffect(() => {
    const computeDelta = () => {
      if (!titleRef.current || !controlLeftRef.current || !line1Ref.current || !line2Ref.current) return;
      
      // Use the paragraph text (captionRef) as our true left alignment target edge
      const targetRect = captionRef.current ? captionRef.current.getBoundingClientRect() : controlLeftRef.current.getBoundingClientRect();

      const line1CurrentX = (gsap.getProperty(line1Ref.current, "x") as number) || 0;
      const line2CurrentX = (gsap.getProperty(line2Ref.current, "x") as number) || 0;
      const parentCurrentX = (gsap.getProperty(titleRef.current, "x") as number) || 0;

      const line1Rect = line1Ref.current.getBoundingClientRect();
      const line2Rect = line2Ref.current.getBoundingClientRect();

      const line1Left = line1Rect.left - line1CurrentX - parentCurrentX;
      const line2Left = line2Rect.left - line2CurrentX - parentCurrentX;

      const minLeftEdge = Math.min(line1Left, line2Left);
      
      // Parent moves the whole block to the target
      deltaXRef.current = targetRect.left - minLeftEdge;

      // Children move individually to left align their own edges with the minLeftEdge
      deltaXLine1Ref.current = minLeftEdge - line1Left;
      deltaXLine2Ref.current = minLeftEdge - line2Left;
    };

    computeDelta();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(computeDelta, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleHoverCTA = useCallback((isHovering: boolean) => {
    if (!titleRef.current || prefersReducedMotion) return;
    
    // Animate H1 to target x position
    gsap.to(titleRef.current, {
      x: isHovering ? deltaXRef.current : 0,
      duration: 0.8,
      ease: "power3.out",
      overwrite: "auto",
    });

    if (line1Ref.current && line2Ref.current) {
      gsap.to([line1Ref.current, line2Ref.current], {
        x: (index) => isHovering ? (index === 0 ? deltaXLine1Ref.current : deltaXLine2Ref.current) : 0,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    // Fade out/in left diamond and discover AI button
    if (decoLeftRef.current && controlLeftRef.current) {
      gsap.to([decoLeftRef.current, controlLeftRef.current], {
        opacity: isHovering ? 0 : 1,
        autoAlpha: isHovering ? 0 : 1, // handles visibility hidden automatically
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }, [prefersReducedMotion]);

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Set initial states
      gsap.set(
        [
          headerRef.current,
          decoLeftRef.current,
          decoRightRef.current,
          titleRef.current,
          controlLeftRef.current,
          controlRightRef.current,
          captionRef.current,
        ],
        { autoAlpha: 0 }
      );

      gsap.set(headerRef.current, { y: -20 });
      gsap.set(titleRef.current, { y: 40 });
      gsap.set(controlLeftRef.current, { x: -30 });
      gsap.set(controlRightRef.current, { x: 30 });
      gsap.set(captionRef.current, { y: 20 });

      // Timeline sequence
      tl.to(headerRef.current, { autoAlpha: 1, y: 0, duration: 0.6 })
        .to(
          [decoLeftRef.current, decoRightRef.current],
          { autoAlpha: 1, duration: 0.8 },
          "-=0.2"
        )
        .to(
          titleRef.current,
          { autoAlpha: 1, y: 0, duration: 0.7 },
          "-=0.4"
        )
        .to(
          [controlLeftRef.current, controlRightRef.current],
          { autoAlpha: 1, x: 0, duration: 0.6 },
          "-=0.3"
        )
        .to(
          captionRef.current,
          { autoAlpha: 1, y: 0, duration: 0.5 },
          "-=0.2"
        );
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FCFCFC]">
      {/* Header */}
      <LandingHeader ref={headerRef} />

      {/* Decorative dashed frames (xl+ only) */}
      <DecorativeDashedFrame ref={decoLeftRef} side="left" />
      <DecorativeDashedFrame ref={decoRightRef} side="right" />

      {/* Center content */}
      <div className="flex flex-col items-center justify-center px-6">
        <h1
          ref={titleRef}
          className="flex flex-col items-center justify-center font-normal leading-[0.99] tracking-[0.05em] text-[#1A1B1C] w-full"
          style={{
            fontSize: "clamp(36px, 6vw, 96px)",
            lineHeight: "clamp(36px, 6vw, 96px)",
          }}
        >
          <span ref={line1Ref} className="whitespace-nowrap">Sophisticated</span>
          <span ref={line2Ref} className="whitespace-nowrap">skincare</span>
        </h1>
      </div>

      {/* Side controls - positioned at hero midline on desktop */}
      <div className="pointer-events-none absolute inset-0 hidden min-[900px]:block">
        <HeroSideControl
          ref={controlLeftRef}
          label="DISCOVER A.I."
          side="left"
          className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2"
        />
        <HeroSideControl
          ref={controlRightRef}
          label="TAKE TEST"
          side="right"
          className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2"
          onClick={() => router.push("/take-test")}
          onMouseEnter={() => handleHoverCTA(true)}
          onMouseLeave={() => handleHoverCTA(false)}
        />
      </div>


      {/* Bottom-left caption */}
      <HeroCaption ref={captionRef} />
    </section>
  );
}
