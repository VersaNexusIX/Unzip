// api/oauth.js // Vercel Serverless Function for exchanging GitHub OAuth code to access_token. // Secure: uses environment variables CLIENT_ID and CLIENT_SECRET.

export default async function handler(req, res) { if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }

try { const { code } = req.body || {}; if (!code) return res.status(400).json({ error: 'missing_code' });

// Basic origin check (optional) - uncomment and set allowed origin if needed
// const origin = req.headers.origin;
// if (origin !== process.env.ALLOWED_ORIGIN) return res.status(403).json({ error: 'forbidden_origin' });

const params = new URLSearchParams({
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  code
});

const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
  method: 'POST',
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
  body: params.toString()
});

if (!tokenRes.ok) {
  const text = await tokenRes.text();
  return res.status(502).json({ error: 'bad_gateway', details: text });
}

const tokenData = await tokenRes.json();
if (tokenData.error) return res.status(400).json(tokenData);

// Return only the access_token
return res.status(200).json({ access_token: tokenData.access_token });

} catch (err) { return res.status(500).json({ error: err.message }); } }

