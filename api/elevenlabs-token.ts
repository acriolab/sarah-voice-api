import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS for your Framer and Acriolab domains
  res.setHeader("Access-Control-Allow-Origin", "https://www.acriolab.com");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
  const ELEVENLABS_AGENT_ID = process.env.ELEVENLABS_AGENT_ID;

  if (!ELEVENLABS_API_KEY || !ELEVENLABS_AGENT_ID) {
    return res.status(500).json({ error: "Missing env vars" });
  }

  try {
    // Fetch a realtime conversation token from ElevenLabs
    const response = await fetch(`https://api.elevenlabs.io/v1/convai/token`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agent_id: ELEVENLABS_AGENT_ID }),
    });

    const data = await response.json();
    if (!data?.token) {
      throw new Error("Failed to generate token");
    }

    // Return token to frontend
    return res.status(200).json({ token: data.token });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
