import type { NextApiRequest, NextApiResponse } from 'next'
import { base64url } from 'jose'
import { API_KEYS, MEDIA_KEYS } from '@lib/api/constants'
import type { ApiTokenPayload } from '@lib/api/keys'
import { upstashRest } from '@lib/upstash'

// Add type definitions for supported platforms
type MediaPlatform = 'devto' | 'medium'

interface PublishRequest {
  title: string;
  content: string;
  tags: string[];
  is_draft?: boolean;
}

interface PublishResponse {
  done: boolean;
  article: any;
}

// Updated platform-specific publishing functions with API key fetching
async function publishToDevTo(jti: string, data: PublishRequest): Promise<PublishResponse> {
  // Get DevTo API key using the correct identifier
  const mediaKeyId = `${jti}:DEV_TO_APIKEY`;
  const result = await upstashRest(['HGET', MEDIA_KEYS, mediaKeyId]);
  const apiKey = result.result;
  console.log('result', result);
  if (!apiKey) {
    throw new Error('DevTo API key not found');
  }

  const response = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      article: {
        title: data.title,
        body_markdown: data.content,
        tags: data.tags,
        published: !data.is_draft,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }

  const article = await response.json();
  return { done: true, article };
}

async function publishToMedium(jti: string, data: PublishRequest): Promise<PublishResponse> {
  // Get Medium API key
  const mediaKeyId = `${jti}:MEDIUM_APIKEY`;
  const result = await upstashRest(['HGET', MEDIA_KEYS, mediaKeyId]);
  const apiKey = result.result;

  if (!apiKey) {
    throw new Error('Medium API key not found');
  }

  // First, get the user's ID using the /me endpoint
  const userResponse = await fetch('https://api.medium.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!userResponse.ok) {
    const error = await userResponse.json();
    throw new Error(JSON.stringify(error));
  }

  const userData = await userResponse.json();
  const mediumUserId = userData.data.id;

  // Then publish the post using the user ID
  const response = await fetch(`https://api.medium.com/v1/users/${mediumUserId}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      title: data.title,
      contentFormat: 'markdown',
      content: data.content,
      tags: data.tags,
      publishStatus: data.is_draft ? 'draft' : 'public',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }

  const article = await response.json();
  return { done: true, article };
}

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
  const { media } = req.query as { media: MediaPlatform };
  if (!['devto', 'medium'].includes(media)) {
    return res.status(400).json({ error: { message: 'Unsupported media type' } });
  }

  try {
    // Validate request body
    const { title, content, tags, is_draft } = req.body;
    if (!title || !content || !Array.isArray(tags)) {
      return res.status(400).json({ 
        error: { message: 'Missing required fields: title, content, or tags' } 
      });
    }

    const publishData: PublishRequest = { title, content, tags, is_draft };

    let response: PublishResponse;
    switch (media) {
      case 'devto':
        response = await publishToDevTo(payload.jti, publishData);
        break;
      case 'medium':
        response = await publishToMedium(payload.jti, publishData);
        break;
      default:
        throw new Error('Unsupported media type');
    }

    return res.status(200).json(response);

  } catch (err) {
    console.error(`Error publishing to ${media}:`, err);
    return res.status(500).json({
      error: { 
        message: err instanceof Error ? err.message : 'An internal server error occurred'
      },
    });
  }
}
