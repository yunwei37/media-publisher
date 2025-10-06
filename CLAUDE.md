# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a simplified Next.js application for publishing articles to multiple platforms (Dev.to and Medium) simultaneously. It features a web interface and API endpoint with password-based authentication and environment-configured platform credentials.

**Note:** The original complex version with Upstash Redis, JWT tokens, and rate limiting is preserved in the `backup-original-system` branch.

## Development Commands

```bash
# Development server
pnpm dev

# Build production version
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Run tests
pnpm test

# Run specific test file
npx jest path/to/test.test.ts
```

## Architecture

### Authentication
- Simple password-based authentication using `PUBLISH_PASSWORD` environment variable
- Password passed via `x-publish-password` header
- No database required - credentials stored in environment variables

### Publishing Flow
- Main endpoint: `/api/publish-multi` - publishes to multiple platforms simultaneously
- Accepts array of platforms in request: `platforms: ["devto", "medium"]`
- Publishes to all platforms in parallel using `Promise.all()`
- Returns individual results for each platform (success/failure)
- Platform API keys read directly from environment variables:
  - `DEV_TO_API_KEY` for Dev.to
  - `MEDIUM_API_KEY` for Medium

### Platform Implementations

**Dev.to:**
- Endpoint: `https://dev.to/api/articles`
- Requires `api-key` header
- Content format: Markdown in `body_markdown` field
- Draft control: `published` boolean (inverted from `is_draft`)

**Medium:**
- Two-step process: First get user ID from `/v1/me`, then publish to `/v1/users/{id}/posts`
- Requires `Authorization: Bearer {token}` header
- Content format: Markdown with `contentFormat: 'markdown'`
- Draft control: `publishStatus` ('draft' or 'public')

## Key Files

- `pages/api/publish-multi.ts`: Main publishing endpoint for multi-platform publishing
- `pages/index.tsx`: Web interface with form and help documentation
- `.env.example`: Environment variable template

### Legacy Files (from original system)
These files are still present but not used by the simplified version:
- `lib/api/keys.ts`, `lib/rate-limit.ts`, `lib/upstash.ts`: Rate limiting system
- `pages/api/keys.ts`, `pages/api/mediakeys.ts`: Old API key management
- `pages/api/publish/[media].ts`: Single-platform publish endpoint

## Environment Variables

Required in `.env.local`:
- `PUBLISH_PASSWORD`: Password for API authentication
- `DEV_TO_API_KEY`: Dev.to API key (from dev.to/settings/extensions)
- `MEDIUM_API_KEY`: Medium integration token (from medium.com/me/settings)

Optional (for legacy rate limiting features):
- `UPSTASH_REST_API_DOMAIN`: Upstash Redis domain
- `UPSTASH_REST_API_TOKEN`: Upstash REST API token
- `API_KEYS_JWT_SECRET_KEY`: Secret for JWT signing/verification

## Testing

- Uses Jest with ts-jest preset
- Path aliases configured: `@lib/*` and `@components/*`
- Test files located in `__tests__/` directory
