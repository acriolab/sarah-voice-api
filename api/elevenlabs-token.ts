import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // list all front-end origins you’ll use
  const allowedOrigins = [
    "https://www.acriolab.com",
    "https://acriolab.com",
    "https://framerusercontent.com",
    "https://framer.com",
  ];

  const origin = req.headers.origin || "";
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // respond to pre-flight quickly
  if (req.method === "OPTIONS") return res.status(200).end();

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;
  if (!apiKey || !agentId) return res.status(500).json({ error: "Missing env vars" });

  try {
    const r = await fetch("https://api.elevenlabs.io/v1/convai/token", {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ agent_id: agentId }),
    });

    const data = await r.json();
    if (!data?.token) throw new Error("Token missing in ElevenLabs response");

    res.status(200).json({ token: data.token });
  } catch (err: any) {
    console.error("Token generation error:", err);
    res.status(500).json({ error: err.message });
  }
}
