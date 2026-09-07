// Vercel serverless function backing the admin portal's "live" editing.
//
// GET  -> returns the current portfolio content (read from a JSON file
//         committed to this repo on GitHub), so every visitor and every
//         device the admin logs in from sees the same, current data.
// POST -> { pin, data } — writes new content back to that same file via
//         GitHub's Contents API, after checking `pin` against the PIN
//         already stored inside the existing content. This makes every
//         edit a real git commit: reviewable, revertible, versioned.
//
// The only secret involved is GITHUB_TOKEN (a repo-scoped token), set as
// a Vercel environment variable and never sent to the browser. The admin
// PIN itself lives inside the content file, same as before — this just
// moves the source of truth from one browser's localStorage to git.

const REPO = process.env.CONTENT_REPO || 'Albricengwa/albrice-portfolio'
const BRANCH = process.env.CONTENT_BRANCH || 'main'
const FILE_PATH = process.env.CONTENT_PATH || 'public/content.json'
const TOKEN = process.env.GITHUB_TOKEN

function gh(path, options = {}) {
  return fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    },
  })
}

async function readCurrent() {
  const res = await gh(`/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`)
  if (res.status === 404) return { data: null, sha: null }
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status} ${await res.text()}`)
  const json = await res.json()
  const text = Buffer.from(json.content, 'base64').toString('utf-8')
  return { data: JSON.parse(text), sha: json.sha }
}

export default async function handler(req, res) {
  if (!TOKEN) {
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({ error: 'Server not configured (missing GITHUB_TOKEN)' })
  }

  if (req.method === 'GET') {
    try {
      const { data } = await readCurrent()
      // Short edge cache so a burst of visitors doesn't hammer GitHub's
      // API, but an admin save is visible again within seconds.
      res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=120')
      return res.status(200).json(data)
    } catch (err) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(500).json({ error: 'Failed to load content', detail: String(err.message || err) })
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      const { pin, data } = body || {}
      // Guard against a malformed or partial payload clobbering the whole
      // site (this has happened once, from a manual test write) — require
      // the shape of a real portfolio document, not just "some object".
      if (!data || typeof data !== 'object' || !data.profile?.name || !data.adminPin) {
        return res.status(400).json({ error: 'Payload does not look like a full portfolio document' })
      }

      const { data: current, sha } = await readCurrent()
      const expectedPin = current ? current.adminPin : data.adminPin
      if (!pin || pin !== expectedPin) {
        return res.status(401).json({ error: 'Incorrect PIN' })
      }

      const put = await gh(`/repos/${REPO}/contents/${FILE_PATH}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Update portfolio content via admin portal',
          content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
          branch: BRANCH,
          ...(sha ? { sha } : {}),
        }),
      })
      if (!put.ok) {
        throw new Error(`GitHub write failed: ${put.status} ${await put.text()}`)
      }
      return res.status(200).json({ ok: true })
    } catch (err) {
      return res.status(500).json({ error: 'Failed to save content', detail: String(err.message || err) })
    }
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method Not Allowed' })
}
