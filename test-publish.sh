#!/bin/bash

# Test script for multi-platform publisher
# Usage: ./test-publish.sh [password] [url]

PASSWORD="${1:-test-password}"
URL="${2:-http://localhost:3000}"

echo "🧪 Testing Multi-Platform Publisher"
echo "=================================="
echo "URL: $URL"
echo "Password: $PASSWORD"
echo ""

# Test 1: Publish to Dev.to only (draft)
echo "Test 1: Publishing to Dev.to (draft)..."
RESPONSE=$(curl -s -X POST "$URL/api/publish-multi" \
  -H "Content-Type: application/json" \
  -H "x-publish-password: $PASSWORD" \
  -d '{
    "title": "Test Article from API",
    "content": "# Hello World\n\nThis is a test article published via the API.\n\n## Features\n\n- Multi-platform publishing\n- Markdown support\n- Simple API\n\nPublished at: '"$(date)"'",
    "tags": ["test", "api"],
    "is_draft": true,
    "platforms": ["devto"]
  }')

echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Test 2: Publish to both platforms (draft)
echo "Test 2: Publishing to both platforms (draft)..."
RESPONSE=$(curl -s -X POST "$URL/api/publish-multi" \
  -H "Content-Type: application/json" \
  -H "x-publish-password: $PASSWORD" \
  -d '{
    "title": "Multi-Platform Test Article",
    "content": "# Multi-Platform Test\n\nThis article was published to multiple platforms simultaneously.\n\n## Platforms\n\n- Dev.to\n- Medium\n\nPublished at: '"$(date)"'",
    "tags": ["test", "automation", "api"],
    "is_draft": true,
    "platforms": ["devto", "medium"]
  }')

echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Test 3: Invalid password
echo "Test 3: Testing invalid password (should fail)..."
RESPONSE=$(curl -s -X POST "$URL/api/publish-multi" \
  -H "Content-Type: application/json" \
  -H "x-publish-password: wrong-password" \
  -d '{
    "title": "This should fail",
    "content": "# Should not publish",
    "tags": ["test"],
    "is_draft": true,
    "platforms": ["devto"]
  }')

echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Test 4: Missing required fields
echo "Test 4: Testing missing title (should fail)..."
RESPONSE=$(curl -s -X POST "$URL/api/publish-multi" \
  -H "Content-Type: application/json" \
  -H "x-publish-password: $PASSWORD" \
  -d '{
    "content": "# Missing title",
    "tags": ["test"],
    "is_draft": true,
    "platforms": ["devto"]
  }')

echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Test 5: No platforms specified
echo "Test 5: Testing no platforms (should fail)..."
RESPONSE=$(curl -s -X POST "$URL/api/publish-multi" \
  -H "Content-Type: application/json" \
  -H "x-publish-password: $PASSWORD" \
  -d '{
    "title": "No platforms",
    "content": "# Should fail",
    "tags": ["test"],
    "is_draft": true,
    "platforms": []
  }')

echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

echo "=================================="
echo "✅ Tests completed!"
echo ""
echo "💡 Tips:"
echo "  - Make sure your .env.local has PUBLISH_PASSWORD, DEV_TO_API_KEY, and MEDIUM_API_KEY"
echo "  - Start the server with: pnpm dev"
echo "  - All test articles are created as drafts"
echo "  - Install jq for pretty JSON output: sudo apt install jq"
