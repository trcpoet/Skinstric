const PHASE_ONE_URL =
  "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseOne";
const PHASE_TWO_URL =
  "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo";

export type PhaseOnePayload = {
  name: string;
  location: string;
};

export type PhaseOneResponse = {
  SUCCESS?: string;
};

export type PhaseTwoPayload = {
  Image: string;
};

export type PhaseTwoData = {
  race: Record<string, number>;
  age: Record<string, number>;
  gender: Record<string, number>;
};

export type PhaseTwoResponse = {
  message?: string;
  data?: PhaseTwoData;
};

export async function postPhaseOne(payload: PhaseOnePayload): Promise<PhaseOneResponse> {
  const res = await fetch(PHASE_ONE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json().catch(() => ({}))) as PhaseOneResponse;
  if (!res.ok) {
    throw new Error(`Phase 1 failed: ${res.status}`);
  }
  return data;
}

/** Normalize base64: strip data URL prefix if present, trim whitespace */
export function toBase64String(value: string): string {
  const trimmed = value.trim();
  if (trimmed.includes(",")) {
    return trimmed.split(",")[1]?.trim() ?? trimmed;
  }
  return trimmed;
}

export async function postPhaseTwo(payload: PhaseTwoPayload): Promise<PhaseTwoResponse> {
  const base64 = toBase64String(payload.Image);
  if (!base64) throw new Error("No image data provided");

  // API expects lowercase "image" (not "Image"). Returns 400 "Image is required." otherwise.
  const res = await fetch(PHASE_TWO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64 }),
  });
  const data = (await res.json().catch(() => ({}))) as PhaseTwoResponse & {
    success?: boolean;
    error?: string;
    message?: string;
  };

  if (!res.ok) {
    const hint = data?.error ?? data?.message ?? JSON.stringify(data);
    throw new Error(`Phase 2 failed: ${res.status}. ${hint}`);
  }
  return data as PhaseTwoResponse;
}
