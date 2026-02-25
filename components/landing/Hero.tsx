"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import LandingHeader from "./LandingHeader";
import DecorativeDashedFrame from "./DecorativeDashedFrame";
import HeroSideControl from "./HeroSideControl";
import HeroCaption from "./HeroCaption";

export default function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const headerRef = useRef<HTMLElement>(null);
  const decoLeftRef = useRef<HTMLDivElement>(null);
  const decoRightRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const controlLeftRef = useRef<HTMLDivElement>(null);
  const controlRightRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

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
          className="text-center font-normal leading-[0.99] tracking-[0.05em] text-[#1A1B1C]"
          style={{
            fontSize: "clamp(36px, 6vw, 96px)",
            lineHeight: "clamp(36px, 6vw, 96px)",
          }}
        >
          Sophisticated
          <br />
          skincare
        </h1>
      </div>

      {/* Side controls - positioned at hero midline on desktop */}
      <div className="pointer-events-none absolute inset-0 hidden min-[900px]:block">
        <HeroSideControl
          ref={controlLeftRef}
          label="Discover A.I."
          side="left"
          className="pointer-events-auto absolute left-8 top-1/2 -translate-y-1/2"
        />
        <HeroSideControl
          ref={controlRightRef}
          label="Take Test"
          side="right"
          className="pointer-events-auto absolute right-8 top-1/2 -translate-y-1/2"
        />
      </div>


      {/* Bottom-left caption */}
      <HeroCaption ref={captionRef} />
    </section>
  );
}
