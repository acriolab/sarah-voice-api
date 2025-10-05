import type { VercelRequest, VercelResponse } from "@vercel/node";
import WebSocket from "ws";
import fetch from "node-fetch";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
  const ELEVENLABS_AGENT_ID = process.env.ELEVENLABS_AGENT_ID;

  if (!ELEVENLABS_API_KEY || !ELEVENLABS_AGENT_ID)
    return res.status(500).json({ error: "Missing env vars" });

  try {
    // Fetch a realtime token
    const tokenRes = await fetch(`https://api.elevenlabs.io/v1/convai/token`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agent_id: ELEVENLABS_AGENT_ID }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData?.token)
      throw new Error("Failed to get token from ElevenLabs");

    // Return the token to your Framer frontend
    return res.status(200).json({ token: tokenData.token });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
