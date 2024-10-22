export const API_KEYS = 'api-keys'

export const API_KEYS_JWT_SECRET_KEY = process.env.API_KEYS_JWT_SECRET_KEY!

export const API_KEY_NAMES = 'api_key_names'

export const MEDIA_KEYS = 'media_keys'

if (!API_KEYS_JWT_SECRET_KEY) {
  throw new Error('API_KEYS_JWT_SECRET_KEY is missing in environment variables')
}
