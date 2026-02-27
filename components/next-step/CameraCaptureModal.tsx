"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import styles from "./CameraFlow.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64: string) => void;
  onError: (message: string) => void;
};

type FlowStep = "prompt" | "loading" | "active" | "error";

export default function CameraCaptureModal({
  isOpen,
  onClose,
  onCapture,
  onError,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [step, setStep] = useState<FlowStep>("prompt");
  const [errorMessage, setErrorMessage] = useState("");

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const handleAllow = useCallback(async () => {
    setStep("loading");
    setErrorMessage("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setStep("active");
    } catch (err) {
      stopStream();
      setStep("error");
      const msg =
        err instanceof Error
          ? err.message
          : "Camera access denied. Use Gallery instead.";
      setErrorMessage(msg);
      onError(msg);
    }
  }, [onError, stopStream]);

  const handleDeny = useCallback(() => {
    onClose();
  }, [onClose]);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video || step !== "active" || !video.videoWidth) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const base64 =
      dataUrl.includes(",") ? dataUrl.split(",")[1]?.trim() ?? "" : dataUrl;
    stopStream();
    onCapture(base64);
    onClose();
  }, [step, onCapture, onClose, stopStream]);

  const handleBack = useCallback(() => {
    stopStream();
    onClose();
  }, [onClose, stopStream]);

  // Reset to prompt when modal opens; lock body scroll when full-screen active
  useEffect(() => {
    if (!isOpen) {
      stopStream();
      setStep("prompt");
      setErrorMessage("");
    }
  }, [isOpen, stopStream]);

  useEffect(() => {
    if (step === "active") {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [step]);

  // Attach stream to video when it mounts (step === "active")
  useEffect(() => {
    if (step === "active" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [step]);

  if (!isOpen) return null;

  // Step 1 — Permission prompt
  if (step === "prompt") {
    return (
      <div
        className={styles.cameraOverlay}
        onClick={(e) => e.target === e.currentTarget && handleDeny()}
      >
        <div
          className={styles.cameraPermissionModal}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.cameraPermissionCard}>
            <p className={styles.cameraPermissionTitle}>
              ALLOW A.I. TO ACCESS YOUR CAMERA
            </p>
            <div className={styles.cameraPermissionActions}>
              <button
                type="button"
                className={`${styles.cameraPermissionBtn} ${styles.cameraPermissionBtnDeny}`}
                onClick={handleDeny}
              >
                DENY
              </button>
              <button
                type="button"
                className={`${styles.cameraPermissionBtn} ${styles.cameraPermissionBtnAllow}`}
                onClick={handleAllow}
              >
                ALLOW
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2 — Loading / Preparing camera
  if (step === "loading") {
    return (
      <div className={styles.cameraLoadingScreen}>
        <div className={styles.cameraLoadingCenter}>
          <div className={styles.cameraLoadingIconWrap}>
            <div
              className={`${styles.cameraLoadingDiamond} ${styles.cameraLoadingDiamondOuter}`}
              aria-hidden="true"
            />
            <div
              className={`${styles.cameraLoadingDiamond} ${styles.cameraLoadingDiamondMiddle}`}
              aria-hidden="true"
            />
            <div
              className={`${styles.cameraLoadingDiamond} ${styles.cameraLoadingDiamondInner}`}
              aria-hidden="true"
            />
            <img
              src="/new-camera.svg"
              alt=""
              className={styles.cameraLoadingIcon}
              width={136}
              height={136}
              aria-hidden="true"
            />
          </div>
          <p className={styles.cameraLoadingText}>SETTING UP CAMERA …</p>
        </div>
        <div className={styles.cameraLoadingHelper}>
          <p className={`${styles.cameraHelperText} ${styles.cameraHelperTextMain}`}>
            TO GET BETTER RESULTS MAKE SURE TO HAVE
          </p>
          <div className={styles.cameraHelperItems}>
            <span className={styles.cameraHelperItem}>
              <span className={styles.cameraHelperDiamond} aria-hidden="true" />
              <span className={styles.cameraHelperText}>NEUTRAL EXPRESSION</span>
            </span>
            <span className={styles.cameraHelperItem}>
              <span className={styles.cameraHelperDiamond} aria-hidden="true" />
              <span className={styles.cameraHelperText}>FRONTAL POSE</span>
            </span>
            <span className={styles.cameraHelperItem}>
              <span className={styles.cameraHelperDiamond} aria-hidden="true" />
              <span className={styles.cameraHelperText}>ADEQUATE LIGHTING</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Step 3 — Full-screen camera
  if (step === "active") {
    return (
      <div className={styles.cameraFullscreen}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={styles.cameraVideo}
        />
        <div className={styles.cameraOverlayUi}>
          <button
            type="button"
            className={styles.cameraBackButton}
            onClick={handleBack}
            aria-label="Back"
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M43.293 22L22 43.293L0.707031 22L22 0.707031L43.293 22Z"
                stroke="currentColor"
              />
              <path
                d="M15.7144 22L25.1429 27.4436V16.5564L15.7144 22Z"
                fill="currentColor"
              />
            </svg>
            <span className={styles.cameraBackLabel}>BACK</span>
          </button>

          <div className={styles.cameraHelperBottom}>
            <p className={`${styles.cameraHelperText} ${styles.cameraHelperTextMain}`}>
              TO GET BETTER RESULTS MAKE SURE TO HAVE
            </p>
            <div className={styles.cameraHelperItems}>
              <span className={styles.cameraHelperItem}>
                <span className={styles.cameraHelperDiamond} aria-hidden="true" />
                <span className={styles.cameraHelperText}>NEUTRAL EXPRESSION</span>
              </span>
              <span className={styles.cameraHelperItem}>
                <span className={styles.cameraHelperDiamond} aria-hidden="true" />
                <span className={styles.cameraHelperText}>FRONTAL POSE</span>
              </span>
              <span className={styles.cameraHelperItem}>
                <span className={styles.cameraHelperDiamond} aria-hidden="true" />
                <span className={styles.cameraHelperText}>ADEQUATE LIGHTING</span>
              </span>
            </div>
          </div>

          <div
            className={styles.cameraCaptureCta}
            onClick={capture}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && capture()}
            aria-label="Take picture"
          >
            <span className={styles.cameraCaptureLabel}>TAKE PICTURE</span>
            <div className={styles.cameraCaptureBtn}>
              <img
                src="/new-camera.svg"
                alt=""
                width={32}
                height={32}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state — fallback to simple overlay
  return (
    <div
      className={styles.cameraOverlay}
      onClick={(e) => e.target === e.currentTarget && handleBack()}
    >
      <div
        className={styles.cameraPermissionModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.cameraPermissionCard}>
          <p className={styles.cameraPermissionTitle}>
            {errorMessage || "Camera access denied"}
          </p>
          <p className={styles.cameraHelperText}>Use Gallery instead</p>
          <button
            type="button"
            className={`${styles.cameraPermissionBtn} ${styles.cameraPermissionBtnAllow}`}
            onClick={handleBack}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
