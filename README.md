# Multi-Platform Media Publisher

A simple web application and API for publishing articles to multiple platforms (Dev.to and Medium) simultaneously.

## Quick Start

### 1. Setup Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Required variables:
```bash
PUBLISH_PASSWORD="your-secure-password"
DEV_TO_API_KEY="your-devto-api-key"
MEDIUM_API_KEY="your-medium-integration-token"
```

**Getting API Keys:**
- Dev.to: Get your API key from [dev.to/settings/extensions](https://dev.to/settings/extensions)
- Medium: Get your integration token from [medium.com/me/settings](https://medium.com/me/settings) (under Integration tokens)

### 2. Install and Run

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000` to use the web interface.

## Usage

### Web Interface

1. Open the application in your browser
2. Enter your publish password
3. Fill in the article details (title, content in Markdown, tags)
4. Select which platforms to publish to
5. Click "Publish Article"

### API Usage

Publish to multiple platforms simultaneously:

```bash
curl -X POST \
  'http://localhost:3000/api/publish-multi' \
  -H 'Content-Type: application/json' \
  -H 'x-publish-password: YOUR_PASSWORD' \
  -d '{
    "title": "My Article Title",
    "content": "# Hello World\n\nThis is my article.",
    "tags": ["tech", "tutorial"],
    "is_draft": true,
    "platforms": ["devto", "medium"]
  }'
```

Response format:
```json
{
  "results": [
    {
      "platform": "devto",
      "success": true,
      "article": { /* platform response */ }
    },
    {
      "platform": "medium",
      "success": true,
      "article": { /* platform response */ }
    }
  ]
}
```

## Features

- 📝 **Markdown Support**: Write your content once in Markdown
- 🚀 **Multi-Platform Publishing**: Publish to Dev.to and Medium simultaneously
- 🔒 **Password Protected**: Simple password-based authentication
- 🎯 **Draft Mode**: Publish as drafts for review before going live
- 🌐 **Web Interface & API**: Use the web UI or integrate via API
- ⚡ **Parallel Publishing**: Publishes to all platforms concurrently for speed

## Testing

Two test scripts are provided to test the API:

### Bash Script

```bash
# Start the dev server first
pnpm dev

# In another terminal, run the test script
./test-publish.sh YOUR_PASSWORD http://localhost:3000
```

### Node.js Script

```bash
# Start the dev server first
pnpm dev

# In another terminal, run the Node.js test
node test-publish.js YOUR_PASSWORD http://localhost:3000
```

Both scripts will:
- Test publishing to individual platforms
- Test multi-platform publishing
- Test error cases (invalid password, missing fields)
- Create all test articles as drafts (safe to run)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add the required environment variables in Vercel project settings
4. Deploy

Make sure to set these environment variables in Vercel:
- `PUBLISH_PASSWORD`
- `DEV_TO_API_KEY`
- `MEDIUM_API_KEY`

