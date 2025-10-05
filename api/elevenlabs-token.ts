export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;
  if (!apiKey || !agentId) {
    console.error("Missing env vars");
    return res.status(500).json({ error: "Missing env vars" });
  }

  try {
    const r = await fetch("https://api.elevenlabs.io/v1/convai/token", {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agent_id: agentId }),
    });

    if (!r.ok) {
      const text = await r.text();
      console.error("ElevenLabs response:", text);
      return res.status(r.status).json({ error: text });
    }

    const data = await r.json();
    return res.status(200).json({ token: data.token });
  } catch (err) {
    console.error("Unhandled error:", err);
    return res.status(500).json({ error: err.message });
  }
}
