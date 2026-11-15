export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(501).json({ error: 'GEMINI_API_KEY is not configured in Vercel Environment Variables' });
  }

  try {
    const { mode, model, payload } = req.body || {};
    const targetModel = model || 'gemini-4-hydrogen';
    const action = mode === 'batch' ? 'batchGenerateContent' : 'generateContent';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(targetModel)}:${action}?key=${encodeURIComponent(apiKey)}`;

    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
