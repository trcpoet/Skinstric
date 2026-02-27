"use client";

import { useLayoutEffect, useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import type { PhaseTwoData } from "@/lib/api";
import "./demographics.css";

type ActualDemographics = {
  race: string;
  age: string;
  gender: string;
};

type ActiveCategory = "race" | "age" | "gender";

function toSortedPercent(value: number): string {
  return (value * 100).toFixed(2) + "%";
}

function toTitleCase(s: string): string {
  return s
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function objToSortedList(obj: Record<string, number>): [string, number][] {
  return Object.entries(obj).sort(([, a], [, b]) => b - a);
}

function getTopValue(obj: Record<string, number>): string {
  const sorted = objToSortedList(obj);
  return sorted[0]?.[0] ?? "";
}

export default function DemographicsPage() {
  const router = useRouter();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [predictions, setPredictions] = useState<PhaseTwoData | null>(null);
  const [actual, setActual] = useState<ActualDemographics | null>(null);
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("race");

  const loadFromStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem("skinstric:predictions");
      const data = raw ? (JSON.parse(raw) as PhaseTwoData) : null;
      setPredictions(data);

      const rawActual = localStorage.getItem("skinstric:actual");
      if (rawActual) {
        const parsed = JSON.parse(rawActual) as ActualDemographics;
        setActual(parsed);
      } else if (data) {
        const initial: ActualDemographics = {
          race: getTopValue(data.race),
          age: getTopValue(data.age),
          gender: getTopValue(data.gender),
        };
        setActual(initial);
        localStorage.setItem("skinstric:actual", JSON.stringify(initial));
      }
    } catch {
      setPredictions(null);
      setActual(null);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !predictions) return;
    const targets = document.querySelectorAll(
      ".demographics-content, .demographics-boxes-container, .back-button-icon, .action-buttons"
    );
    const ctx = gsap.context(() => {
      gsap.set(targets, { autoAlpha: 0 });
      gsap.set(".demographics-content", { y: -8 });
      gsap.set(".demographics-boxes-container", { y: 10 });
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.to(".demographics-content", { autoAlpha: 1, y: 0, duration: 0.5 })
        .to(".demographics-boxes-container", { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.3")
        .to(".back-button-icon, .action-buttons", { autoAlpha: 1, duration: 0.5 }, "-=0.3");
    });
    return () => ctx.revert();
  }, [prefersReducedMotion, predictions]);

  const updateActual = useCallback(
    (category: keyof ActualDemographics, value: string) => {
      if (!actual) return;
      const next = { ...actual, [category]: value };
      setActual(next);
      try {
        localStorage.setItem("skinstric:actual", JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [actual]
  );

  const handleReset = useCallback(() => {
    if (!predictions) return;
    const initial: ActualDemographics = {
      race: getTopValue(predictions.race),
      age: getTopValue(predictions.age),
      gender: getTopValue(predictions.gender),
    };
    setActual(initial);
    try {
      localStorage.setItem("skinstric:actual", JSON.stringify(initial));
    } catch {
      /* ignore */
    }
  }, [predictions]);

  const handleConfirm = useCallback(() => {
    router.push("/");
  }, [router]);

  if (!predictions || !actual) {
    return (
      <div className="demographics-page">
        <p className="demographics-no-data">No analysis data. Please start from the beginning.</p>
        <button
          type="button"
          className="demographics-back-btn"
          onClick={() => router.push("/next-step")}
        >
          Back
        </button>
      </div>
    );
  }

  const raceList = objToSortedList(predictions.race);
  const ageList = objToSortedList(predictions.age);
  const genderList = objToSortedList(predictions.gender);

  const getListForCategory = (cat: ActiveCategory) => {
    if (cat === "race") return raceList;
    if (cat === "age") return ageList;
    return genderList;
  };

  const getValueForCategory = (cat: ActiveCategory) => {
    if (cat === "race") return actual.race;
    if (cat === "age") return actual.age;
    return actual.gender;
  };

  const getDisplayValue = (cat: ActiveCategory) => {
    const v = getValueForCategory(cat);
    return cat === "age" ? v : toTitleCase(v);
  };

  const getPercentForCategory = (cat: ActiveCategory) => {
    const list = getListForCategory(cat);
    const val = getValueForCategory(cat);
    const entry = list.find(([l]) =>
      cat === "age" ? l === val : l.toLowerCase() === val.toLowerCase()
    );
    return entry ? entry[1] : 0;
  };

  const percent = getPercentForCategory(activeCategory);
  const conicDegrees = (percent * 100).toFixed(2);
  const conicStyle = {
    background: `conic-gradient(rgb(26, 27, 28) ${parseFloat(conicDegrees) * 3.6}deg, rgb(224, 224, 224) 0deg)`,
  };

  const predictionsList = getListForCategory(activeCategory);
  const categoryHeader = activeCategory === "race" ? "RACE" : activeCategory === "age" ? "AGE" : "GENDER";

  const isSelected = (label: string) => {
    const val = getValueForCategory(activeCategory);
    return activeCategory === "age" ? label === val : label.toLowerCase() === val.toLowerCase();
  };

  return (
    <div className="demographics-page">
      <div className="top-left-text">
        <a className="skinstric-link" href="/" data-discover="true">
          <span className="skinstric-text">SKINSTRIC</span>
        </a>
        <span className="intro-text">[ Analysis ]</span>
      </div>

      <div className="demographics-content">
        <div className="ai-analysis-title">A.I. ANALYSIS</div>
        <div className="demographics-subtitle">DEMOGRAPHICS</div>
        <div className="predicted-text">PREDICTED RACE &amp; AGE</div>
      </div>

      <div className="demographics-boxes-container">
        <div className="demographics-boxes">
          <div
            className={`demographics-box race-box ${activeCategory === "race" ? "active" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => setActiveCategory("race")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setActiveCategory("race")}
          >
            <div className="race-value">{toTitleCase(actual.race)}</div>
            <div className="race-label">RACE</div>
          </div>
          <div
            className={`demographics-box age-box ${activeCategory === "age" ? "active" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => setActiveCategory("age")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setActiveCategory("age")}
          >
            <div className="age-value">{actual.age}</div>
            <div className="age-label">AGE</div>
          </div>
          <div
            className={`demographics-box gender-box ${activeCategory === "gender" ? "active" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => setActiveCategory("gender")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setActiveCategory("gender")}
          >
            <div className="gender-value">{toTitleCase(actual.gender)}</div>
            <div className="gender-label">SEX</div>
          </div>
        </div>

        <div className="large-demographics-box">
          {activeCategory === "race" && (
            <div className="selected-race-display">{getDisplayValue("race")}</div>
          )}
          {activeCategory === "age" && (
            <div className="selected-age-display">{getDisplayValue("age")}</div>
          )}
          {activeCategory === "gender" && (
            <div className="selected-gender-display">{getDisplayValue("gender")}</div>
          )}
          <div className="circular-graph">
            <div className="circle-progress" style={conicStyle}>
              <div className="circle-inner">
                <span className="percentage-text">{toSortedPercent(percent)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="right-demographics-box">
          <div className="box-header">
            <div className="box-title">{categoryHeader}</div>
            <div className="box-title">A.I. CONFIDENCE</div>
          </div>
          <div className="predictions-list">
            {predictionsList.map(([label, score]) => (
              <div
                key={label}
                className={`prediction-item ${isSelected(label) ? "selected" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => updateActual(activeCategory, label)}
                onKeyDown={(e) => e.key === "Enter" && updateActual(activeCategory, label)}
              >
                <span className="prediction-label">
                  {activeCategory === "age" ? label : toTitleCase(label)}
                </span>
                <span className="prediction-value">{toSortedPercent(score)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="instruction-text">If A.I estimate is wrong, select the correct one.</div>

      <div className="action-buttons">
        <button type="button" className="reset-button" onClick={handleReset}>
          RESET
        </button>
        <button type="button" className="confirm-button" onClick={handleConfirm}>
          CONFIRM
        </button>
      </div>

      <div
        className="back-button-icon"
        role="button"
        tabIndex={0}
        onClick={() => router.push("/next-step")}
        onKeyDown={(e) => e.key === "Enter" && router.push("/next-step")}
        aria-label="Back"
        style={{ display: "flex", alignItems: "center", gap: "12px" }}
      >
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M43.293 22L22 43.293L0.707031 22L22 0.707031L43.293 22Z" stroke="#1A1B1C" />
          <path d="M15.7144 22L25.1429 27.4436V16.5564L15.7144 22Z" fill="#1A1B1C" />
        </svg>
        <span
          style={{
            fontFamily: '"Roobert TRIAL", sans-serif',
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: "#1a1b1c",
          }}
        >
          BACK
        </span>
      </div>
    </div>
  );
}
