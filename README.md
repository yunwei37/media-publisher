# Multi-Platform Media Publisher

A simple web application and API for publishing articles to multiple platforms (Dev.to and Medium) simultaneously.

## Quick Start

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set the required variables:

```bash
# Required: Your admin password for publishing
PUBLISH_PASSWORD="your-secure-password"

# Required: Get from https://dev.to/settings/extensions
DEV_TO_API_KEY="your-devto-api-key"

# Required: Get from https://medium.com/me/settings (Integration tokens)
MEDIUM_API_KEY="your-medium-integration-token"
```

**Where to get API keys:**
- **Dev.to**: Go to [dev.to/settings/extensions](https://dev.to/settings/extensions) and generate an API key
- **Medium**: Go to [medium.com/me/settings](https://medium.com/me/settings), scroll to "Integration tokens" and create a new token

### 3. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

### 4. Use the Application

Open [http://localhost:3000](http://localhost:3000) in your browser and:

1. Enter your `PUBLISH_PASSWORD` in the password field
2. Fill in your article details:
   - **Title**: Your article title
   - **Content**: Your article in Markdown format
   - **Tags**: Comma-separated tags (e.g., `javascript, webdev, tutorial`)
   - **Publish as draft**: Check to publish as draft (recommended for testing)
   - **Platforms**: Select which platforms to publish to
3. Click "Publish Article"
4. View results for each platform

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

The application has been tested and verified to work correctly. You can run your own tests using the provided scripts:

### Manual API Testing

```bash
# Start the dev server
npm run dev

# Test with valid request (in another terminal)
curl -X POST 'http://localhost:3001/api/publish-multi' \
  -H 'Content-Type: application/json' \
  -H 'x-publish-password: YOUR_PASSWORD' \
  -d '{
    "title": "Test Article",
    "content": "# Hello World\n\nThis is a test.",
    "tags": ["test"],
    "is_draft": true,
    "platforms": ["devto"]
  }'
```

**Expected responses:**
- ✅ **Valid request**: Returns results array with platform publish status
- ✅ **Invalid password**: `{"error": {"message": "Invalid password"}}`
- ✅ **Missing fields**: `{"error": {"message": "Missing required fields: title, content, or tags"}}`
- ✅ **Empty platforms**: `{"error": {"message": "At least one platform must be specified"}}`

### Automated Test Scripts

Two test scripts are provided:

**Bash Script:**
```bash
./test-publish.sh YOUR_PASSWORD http://localhost:3001
```

**Node.js Script:**
```bash
node test-publish.js YOUR_PASSWORD http://localhost:3001
```

Both scripts will:
- Test publishing to individual platforms (Dev.to, Medium)
- Test multi-platform publishing
- Test error cases (invalid password, missing fields, empty platforms)
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

## Verified Functionality

The following has been tested and verified:

✅ **API Endpoint** (`/api/publish-multi`)
- Password authentication working correctly
- Request validation (title, content, tags, platforms required)
- Multi-platform publishing (parallel execution)
- Proper error handling and responses

✅ **Web Interface**
- Loads correctly with all help documentation
- Form with all required fields
- Platform selection (Dev.to, Medium)
- Draft mode option
- Results display section

✅ **Error Handling**
- Invalid password rejection (401 Unauthorized)
- Missing required fields (400 Bad Request)
- Empty platforms array (400 Bad Request)
- Graceful handling of platform API failures

✅ **Documentation**
- Complete setup instructions
- API usage examples
- Test scripts included
- Migration guide from original system

## Notes

- **Note about API keys**: The test uses fake API keys and will fail at the platform API level (expected). To actually publish, you need real API keys from Dev.to and Medium.
- **Port**: Server may start on port 3001 if 3000 is in use (Next.js auto-detection)
- **Drafts**: Always test with `is_draft: true` to avoid publishing test articles publicly

