#!/usr/bin/env node
/**
 * Test script to verify Phase 2 API (skinstricPhaseTwo).
 * Run: node scripts/test-phase-two.js
 *
 * Uses a minimal valid 1x1 PNG base64 string to test if the API accepts requests.
 */

const URL = "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo";

// Minimal valid 1x1 red pixel PNG (base64, no data URL prefix)
const MINIMAL_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

async function test(body, label) {
  console.log(`\n--- Testing: ${label} ---`);
  console.log("Payload key:", Object.keys(body)[0]);
  console.log("Payload value length:", body[Object.keys(body)[0]]?.length ?? 0);
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    console.log("Status:", res.status, res.statusText);
    console.log("Response:", JSON.stringify(data, null, 2));
    return res.ok;
  } catch (err) {
    console.error("Error:", err.message);
    return false;
  }
}

async function main() {
  console.log("Phase 2 API verification: " + URL);

  // Test 1: raw base64 with "Image" (capital)
  await test({ Image: MINIMAL_BASE64 }, 'body: { Image: "<base64>" }');

  // Test 2: raw base64 with "image" (lowercase)
  await test({ image: MINIMAL_BASE64 }, 'body: { image: "<base64>" }');

  // Test 3: full data URL with "Image"
  const dataUrl = `data:image/png;base64,${MINIMAL_BASE64}`;
  await test({ Image: dataUrl }, 'body: { Image: "data:image/png;base64,<base64>" }');

  // Test 4: full data URL with "image"
  await test({ image: dataUrl }, 'body: { image: "data:image/png;base64,<base64>" }');

  console.log("\n--- Done. Check which request (if any) returns 200. ---");
}

main().catch(console.error);
