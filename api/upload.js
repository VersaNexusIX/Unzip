export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { repo, owner, fileContent, path, token } = req.body;

  if (!repo || !owner || !fileContent || !path || !token) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    // check existing file
    let sha;
    const check = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: { Authorization: `token ${token}` }
    });

    if (check.ok) {
      const json = await check.json();
      sha = json.sha;
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Upload via OAuth App",
        content: fileContent,
        sha
      })
    });

    const result = await response.json();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "Upload failed", details: err.message });
  }
}
