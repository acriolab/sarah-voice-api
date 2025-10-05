import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS (still wide open for now)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const agentId = process.env.ELEVENLABS_AGENT_ID;
    if (!apiKey || !agentId)
      return res.status(500).json({ error: "Missing env vars" });

    // Use your server-side agent ID securely
    const r = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${agentId}`,
      { headers: { "xi-api-key": apiKey } }
    );

    if (!r.ok) {
      const text = await r.text();
      console.error("ElevenLabs error:", text);
      return res.status(r.status).send(text);
    }

    const body = await r.json();

    // Send only the token — no agent ID exposed
    res.status(200).json({ token: body.token });
  } catch (e: any) {
    console.error("Token generation error:", e);
    res.status(500).json({ error: e.message });
  }
}
