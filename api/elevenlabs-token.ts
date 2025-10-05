import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const agentId = process.env.ELEVENLABS_AGENT_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!agentId || !apiKey) {
      return res.status(500).json({ error: "Missing env vars" });
    }

    const r = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${agentId}`,
      { headers: { "xi-api-key": apiKey } }
    );

    if (!r.ok) {
      const text = await r.text();
      return res.status(500).send(text);
    }

    const body = await r.json();
    res.status(200).json({ token: body.token });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
