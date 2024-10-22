import type { NextApiRequest, NextApiResponse } from 'next'
import { base64url, SignJWT } from 'jose'
import { nanoid } from 'nanoid'
import { API_KEYS, API_KEYS_JWT_SECRET_KEY, API_KEY_NAMES } from '@lib/api/constants'
import type { ApiTokenPayload } from '@lib/api/keys'
import { upstashRest } from '@lib/upstash'
import { log } from 'console'

const decode = (jwt: string) =>
  JSON.parse(new TextDecoder().decode(base64url.decode(jwt.split('.')[1])))

const LOGIN_PASSWD = process.env.LOGIN_PASSWD

// Validate password middleware
const validatePassword = (req: NextApiRequest): boolean => {
  const providedPassword = req.headers['x-login-passwd'];
  // console.log('Validating password:', { 
  //   provided: providedPassword, 
  //   expected: LOGIN_PASSWD,
  //   matches: providedPassword === LOGIN_PASSWD 
  // });
  return providedPassword === LOGIN_PASSWD;
}

export default async function keys(req: NextApiRequest, res: NextApiResponse) {
  console.log('Request method:', req.method);
  // console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);

  if (!validatePassword(req)) {
    console.log('Password validation failed');
    return res.status(401).json({ error: { message: 'Unauthorized' } });
  }

  try {
    switch (req.method) {
      case 'PUT': {
        // Get name from request body, use default if not provided
        const { name = 'New API Key' } = req.body;
        
        // Generate payload for the new key
        const payload: ApiTokenPayload = {
          jti: nanoid(),
          iat: Math.floor(Date.now() / 1000),
          limit: 100,
          timeframe: 60,
        };

        console.log('Generated payload:', payload);

        try {
          // Generate JWT token
          const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .sign(new TextEncoder().encode(API_KEYS_JWT_SECRET_KEY));

          console.log('Generated token:', token);

          // Store the key and name in Upstash
          const [setKeyResult, setNameResult] = await Promise.all([
            upstashRest(['HSET', API_KEYS, payload.jti, token]),
            upstashRest(['HSET', API_KEY_NAMES, payload.jti, name])
          ]);

          console.log('Upstash results:', { setKeyResult, setNameResult });

          if (setKeyResult.error || setNameResult.error) {
            throw new Error('Failed to store key in database');
          }

          return res.status(200).json({ 
            done: true,
            token,
            name,
            jti: payload.jti 
          });
        } catch (error) {
          console.error('Error generating or storing token:', error);
          throw error;
        }
      }
      case 'GET': {
        const [keysResult, namesResult] = await Promise.all([
          upstashRest(['HGETALL', API_KEYS]),
          upstashRest(['HGETALL', API_KEY_NAMES])
        ]);

        // Convert namesResult array to an object for easier lookup
        const names: Record<string, string> = {};  // Add type definition
        for (let i = 0; i < namesResult.result.length; i += 2) {
          const keyId = namesResult.result[i] as string;
          const keyName = namesResult.result[i + 1] as string;
          names[keyId] = keyName;
        }

        console.log('Names mapping:', names); // Should show: { mOFIie4nZCRcBSkxUrLPR: 'Unnamed Keyvdce', bh3lB3TWOkNoNzHJ697MV: 'New API Key' }

        const apiKeys = [];
        for (let i = 0; i < keysResult.result.length; i += 2) {
          const jti = keysResult.result[i];
          const token = keysResult.result[i + 1];
          const decodedToken = decode(token);
          const name = names[jti] || 'Unnamed Key';

          console.log('Processing key:', { jti, name, decodedToken }); // Debug log
        
          apiKeys.push([token, { ...decodedToken, name }]);
        }

        return res.status(200).json({ apiKeys });
      }
      case 'DELETE': {
        const { key } = req.query
        const payload =
          key && typeof key === 'string'
            ? (decode(key) as ApiTokenPayload)
            : null

        if (!payload) {
          return res.status(400).json({ error: { message: 'Invalid request' } })
        }

        const [delKeyResult, delNameResult] = await Promise.all([
          upstashRest(['HDEL', API_KEYS, payload.jti]),
          upstashRest(['HDEL', API_KEY_NAMES, payload.jti])
        ])

        return res.status(200).json({ done: delKeyResult.result === 1 && delNameResult.result === 1 })
      }
      case 'PATCH': {
        const { key, name } = req.body;
        if (!key || typeof key !== 'string' || !name || typeof name !== 'string') {
          return res.status(400).json({ error: { message: 'Invalid request' } });
        }

        try {
          const payload = decode(key) as ApiTokenPayload;
          const result = await upstashRest(['HSET', API_KEY_NAMES, payload.jti, name]);
          
          return res.status(200).json({ 
            done: result.result === 0,
            message: 'Key name updated successfully' 
          });
        } catch (error) {
          console.error('Error updating key name:', error);
          return res.status(500).json({ error: { message: 'Failed to update key name' } });
        }
      }
      default:
        return res.status(405).json({
          error: { message: 'Method not allowed' },
        });
    }
  } catch (err) {
    console.error('Error in API route:', err);
    return res.status(500).json({
      error: { message: 'An internal server error occurred' },
    });
  }
}
