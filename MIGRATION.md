# Migration Guide

## From Original System to Simplified Version

The system has been simplified from a complex JWT/Redis-based API key management system to a simple password-protected multi-platform publisher.

### What Changed

**Before (Original System):**
- Complex two-tier API key system with JWT tokens
- Upstash Redis for storing API keys and media credentials
- Rate limiting by IP and API tokens
- Separate endpoints for each platform (`/api/publish/devto`, `/api/publish/medium`)
- Web UI for managing API keys and media keys

**After (Simplified System):**
- Single password authentication (`PUBLISH_PASSWORD` env var)
- Platform API keys stored in environment variables
- No database required
- Single endpoint for multi-platform publishing (`/api/publish-multi`)
- Clean web UI focused on publishing

### Backup

The original system is fully preserved in the `backup-original-system` branch:

```bash
git checkout backup-original-system
```

### Setup New System

1. **Update `.env.local`:**

```bash
# Old variables (no longer needed for basic usage)
# UPSTASH_REST_API_DOMAIN=...
# UPSTASH_REST_API_TOKEN=...
# API_KEYS_JWT_SECRET_KEY=...
# LOGIN_PASSWD=...

# New required variables
PUBLISH_PASSWORD=your-secure-password
DEV_TO_API_KEY=your-devto-api-key
MEDIUM_API_KEY=your-medium-api-key
```

2. **Get Platform API Keys:**
   - Dev.to: https://dev.to/settings/extensions
   - Medium: https://medium.com/me/settings (Integration tokens section)

3. **Start the app:**

```bash
pnpm dev
```

### API Changes

**Old API (per platform):**
```bash
curl -X POST 'https://your-app.com/api/publish/devto' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: YOUR_JWT_TOKEN' \
  -d '{
    "title": "Test Article",
    "content": "# Hello",
    "tags": ["test"],
    "is_draft": true
  }'
```

**New API (multi-platform):**
```bash
curl -X POST 'https://your-app.com/api/publish-multi' \
  -H 'Content-Type: application/json' \
  -H 'x-publish-password: YOUR_PASSWORD' \
  -d '{
    "title": "Test Article",
    "content": "# Hello",
    "tags": ["test"],
    "is_draft": true,
    "platforms": ["devto", "medium"]
  }'
```

### Benefits of Simplified System

✅ **Easier Setup**: No Redis database required, just environment variables
✅ **Simpler Deployment**: Fewer moving parts, easier to deploy
✅ **Multi-Platform by Default**: Publish to multiple platforms in one request
✅ **Less Code to Maintain**: Removed ~500 lines of authentication/rate limiting code
✅ **Better UX**: Cleaner interface focused on publishing

### When to Use Original System

The original system (in `backup-original-system` branch) is better if you need:
- Multiple users with different API keys
- Rate limiting per user or IP
- Programmatic API key management
- User-specific platform credentials
- Enterprise-level access control

### Reverting to Original System

If you need to revert:

```bash
git checkout backup-original-system
git checkout -b main-simplified-backup  # backup current main
git checkout main
git reset --hard backup-original-system
```
