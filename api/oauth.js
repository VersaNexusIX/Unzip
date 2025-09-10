export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }

  try {
    const client_id = "Ov23lic160MPJU261DRg"; // client id yang lu kasih
    const client_secret = process.env.GITHUB_CLIENT_SECRET; // simpen di vercel env
    const redirect_uri = "https://your-app.vercel.app"; // ganti sesuai domain lu

    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
        redirect_uri
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error_description || "OAuth failed" });
    }

    return res.status(200).json({ access_token: data.access_token });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
}
