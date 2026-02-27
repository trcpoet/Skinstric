"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { cn } from "@/lib/cn";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64: string) => void;
  onError: (message: string) => void;
};

export default function CameraCaptureModal({
  isOpen,
  onClose,
  onCapture,
  onError,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<"idle" | "requesting" | "streaming" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setStatus("requesting");
    setErrorMessage("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus("streaming");
      } else {
        stopStream();
        throw new Error("Video element not ready");
      }
    } catch (err) {
      stopStream();
      setStatus("error");
      const msg =
        err instanceof Error
          ? err.message
          : "Camera access denied. Use Gallery instead.";
      setErrorMessage(msg);
      onError(msg);
    }
  }, [onError, stopStream]);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video || status !== "streaming" || !video.videoWidth) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1]?.trim() ?? "" : dataUrl;
    stopStream();
    onCapture(base64);
    onClose();
  }, [status, onCapture, onClose, stopStream]);

  useEffect(() => {
    if (!isOpen) {
      stopStream();
      setStatus("idle");
      setErrorMessage("");
    } else {
      startCamera();
    }
    return () => stopStream();
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    if (!isOpen || !contentRef.current || !overlayRef.current) return;

    gsap.fromTo(
      overlayRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.25 }
    );
    gsap.fromTo(
      contentRef.current,
      { autoAlpha: 0, scale: 0.95 },
      { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power2.out" }
    );
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          stopStream();
          onClose();
        }
      }}
    >
      <div
        ref={contentRef}
        className={cn(
          "relative flex flex-col items-center rounded-lg bg-[#fcfcfc] p-6 shadow-xl",
          "max-w-[640px] w-[90vw]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-base font-semibold uppercase tracking-[-0.02em] text-[#1A1B1C]">
          Allow Camera Access
        </h3>

        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[#1A1B1C]">
          {status === "requesting" && (
            <div className="absolute inset-0 flex items-center justify-center text-white/80">
              Requesting camera…
            </div>
          )}
          {status === "streaming" && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          )}
          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/90">
              <span>Camera access denied</span>
              <span className="text-sm opacity-75">Use Gallery instead</span>
            </div>
          )}
        </div>

        {errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}

        <div className="mt-6 flex gap-4">
          <button
            type="button"
            onClick={() => {
              stopStream();
              onClose();
            }}
            className={cn(
              "px-4 py-2 text-sm font-semibold uppercase tracking-wide",
              "border border-[#1A1B1C] text-[#1A1B1C]",
              "hover:bg-[#1A1B1C] hover:text-white transition-colors"
            )}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={capture}
            disabled={status !== "streaming"}
            className={cn(
              "px-4 py-2 text-sm font-semibold uppercase tracking-wide",
              "bg-[#1A1B1C] text-white",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "hover:bg-[#2d2e2f] transition-colors"
            )}
          >
            Capture
          </button>
        </div>
      </div>
    </div>
  );
}
