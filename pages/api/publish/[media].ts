import type { NextApiRequest, NextApiResponse } from 'next'
import { base64url } from 'jose'
import { API_KEYS, MEDIA_KEYS } from '@lib/api/constants'
import type { ApiTokenPayload } from '@lib/api/keys'
import { upstashRest } from '@lib/upstash'

// Reuse the decode helper function
const decode = (jwt: string) =>
  JSON.parse(new TextDecoder().decode(base64url.decode(jwt.split('.')[1])))

// Validate API key middleware (reused from mediakeys.ts)
const validateApiKey = async (apiKey: string): Promise<ApiTokenPayload | null> => {
  try {
    const payload = decode(apiKey) as ApiTokenPayload
    const result = await upstashRest(['HEXISTS', API_KEYS, payload.jti])
    return result.result === 1 ? payload : null
  } catch {
    return null
  }
}

export default async function publishMedia(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } })
  }

  // Get API key from header
  const apiKey = req.headers['x-api-key']
  if (!apiKey || typeof apiKey !== 'string') {
    return res.status(401).json({ error: { message: 'API key required' } })
  }

  // Validate API key
  const payload = await validateApiKey(apiKey)
  if (!payload) {
    return res.status(401).json({ error: { message: 'Invalid API key' } })
  }

  // Get media type from URL parameter
  const { media } = req.query
  if (media !== 'devto') {
    return res.status(400).json({ error: { message: 'Unsupported media type' } })
  }

  try {
    // Get DEV.to API key from stored media keys
    const mediaKeyId = `${payload.jti}:${media}`
    const result = await upstashRest(['HGET', MEDIA_KEYS, mediaKeyId])
    const devToApiKey = result.result

    if (!devToApiKey) {
      return res.status(400).json({ error: { message: 'DEV.to API key not found' } })
    }

    // Validate request body
    const { title, content, tags, is_draft } = req.body
    if (!title || !content || !Array.isArray(tags)) {
      return res.status(400).json({ 
        error: { message: 'Missing required fields: title, content, or tags' } 
      })
    }

    // Prepare the request to DEV.to API
    const devToResponse = await fetch('https://dev.to/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': devToApiKey,
      },
      body: JSON.stringify({
        article: {
          title,
          body_markdown: content,
          tags,
          published: !is_draft,
        },
      }),
    })

    if (!devToResponse.ok) {
      const error = await devToResponse.json()
      return res.status(devToResponse.status).json({ error })
    }

    const publishedArticle = await devToResponse.json()
    return res.status(200).json({ 
      done: true,
      article: publishedArticle 
    })

  } catch (err) {
    console.error('Error publishing to DEV.to:', err)
    return res.status(500).json({
      error: { message: 'An internal server error occurred' },
    })
  }
}
