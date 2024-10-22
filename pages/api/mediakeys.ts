import type { NextApiRequest, NextApiResponse } from 'next'
import { base64url } from 'jose'
import { API_KEYS, MEDIA_KEYS } from '@lib/api/constants'
import type { ApiTokenPayload } from '@lib/api/keys'
import { upstashRest } from '@lib/upstash'

// Decode JWT helper function
const decode = (jwt: string) =>
  JSON.parse(new TextDecoder().decode(base64url.decode(jwt.split('.')[1])))

// Validate API key middleware
const validateApiKey = async (apiKey: string): Promise<ApiTokenPayload | null> => {
  try {
    const payload = decode(apiKey) as ApiTokenPayload
    const result = await upstashRest(['HEXISTS', API_KEYS, payload.jti])
    return result.result === 1 ? payload : null
  } catch {
    return null
  }
}

export default async function mediaKeys(req: NextApiRequest, res: NextApiResponse) {
  console.log('Request method:', req.method)
  
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

  try {
    switch (req.method) {
      case 'PUT': {
        const { key, value } = req.body
        if (!key || typeof key !== 'string' || !value || typeof value !== 'string') {
          return res.status(400).json({ error: { message: 'Invalid request body' } })
        }

        // Store key-value pair in Redis, prefixed with the API key's JTI
        const mediaKeyId = `${payload.jti}:${key}`
        const result = await upstashRest(['HSET', MEDIA_KEYS, mediaKeyId, value])

        return res.status(200).json({ 
          done: true,
          message: 'Media key stored successfully' 
        })
      }

      case 'GET': {
        // Get all media keys for this API key
        const allKeys = await upstashRest(['HGETALL', MEDIA_KEYS])
        
        // Filter keys that belong to this API key
        const mediaKeys: Record<string, string> = {}
        for (let i = 0; i < allKeys.result.length; i += 2) {
          const fullKey = allKeys.result[i] as string
          if (fullKey.startsWith(`${payload.jti}:`)) {
            const key = fullKey.split(':')[1]
            mediaKeys[key] = allKeys.result[i + 1] as string
          }
        }

        return res.status(200).json({ mediaKeys })
      }

      case 'DELETE': {
        const { key } = req.query
        if (!key || typeof key !== 'string') {
          return res.status(400).json({ error: { message: 'Invalid request' } })
        }

        const mediaKeyId = `${payload.jti}:${key}`
        const result = await upstashRest(['HDEL', MEDIA_KEYS, mediaKeyId])

        return res.status(200).json({ 
          done: result.result === 1,
          message: 'Media key deleted successfully' 
        })
      }

      default:
        return res.status(405).json({
          error: { message: 'Method not allowed' },
        })
    }
  } catch (err) {
    console.error('Error in API route:', err)
    return res.status(500).json({
      error: { message: 'An internal server error occurred' },
    })
  }
}
