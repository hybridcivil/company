/**
 * Serverless Route Handler for Vercel deployment
 * Proxies GitHub API requests using server-side process.env.GITHUB_TOKEN
 * Protects GitHub credentials from client-side browser exposure.
 */

export default async function handler(req: any, res: any) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !owner || !repo) {
    return res.status(500).json({
      error: 'GitHub environment variables not configured on server (GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO).',
    });
  }

  const { method } = req;

  try {
    if (method === 'GET') {
      const { path } = req.query;
      const targetPath = path || 'data/snapshot.json';
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${targetPath}?ref=${branch}`;

      const ghRes = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!ghRes.ok) {
        if (ghRes.status === 404) {
          return res.status(404).json({ message: 'File not found in repository' });
        }
        const err = await ghRes.json();
        return res.status(ghRes.status).json(err);
      }

      const fileData: any = await ghRes.json();
      const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
      return res.status(200).json({
        sha: fileData.sha,
        data: JSON.parse(content),
      });
    }

    if (method === 'POST' || method === 'PUT') {
      const { path, data, message: commitMsg } = req.body;
      const targetPath = path || 'data/snapshot.json';
      const contentStr = JSON.stringify(data, null, 2);
      const encodedContent = Buffer.from(contentStr, 'utf-8').toString('base64');

      // Fetch existing file SHA if present
      let sha: string | undefined;
      const checkUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${targetPath}?ref=${branch}`;
      const checkRes = await fetch(checkUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (checkRes.ok) {
        const fileInfo: any = await checkRes.json();
        sha = fileInfo.sha;
      }

      // Update file via GitHub REST API
      const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${targetPath}`;
      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMsg || `Automated Vault Sync - ${new Date().toISOString()}`,
          content: encodedContent,
          branch,
          sha,
        }),
      });

      if (!putRes.ok) {
        const errJson = await putRes.json();
        return res.status(putRes.status).json(errJson);
      }

      const result: any = await putRes.json();
      return res.status(200).json({
        success: true,
        commitSha: result?.commit?.sha,
        message: 'Successfully written to private GitHub repository',
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
