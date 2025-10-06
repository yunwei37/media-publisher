#!/usr/bin/env node

/**
 * Test script for multi-platform publisher
 * Usage: node test-publish.js [password] [url]
 */

const password = process.argv[2] || 'test-password';
const url = process.argv[3] || 'http://localhost:3000';

async function testPublish(testName, data, expectedStatus = 200) {
  console.log(`\n🧪 ${testName}`);
  console.log('─'.repeat(50));

  try {
    const response = await fetch(`${url}/api/publish-multi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publish-password': data.password || password,
      },
      body: JSON.stringify(data.body),
    });

    const result = await response.json();

    console.log(`Status: ${response.status} ${response.status === expectedStatus ? '✅' : '❌'}`);
    console.log('Response:', JSON.stringify(result, null, 2));

    return { success: response.status === expectedStatus, result };
  } catch (error) {
    console.log('❌ Error:', error.message);
    return { success: false, error };
  }
}

async function runTests() {
  console.log('🚀 Multi-Platform Publisher Test Suite');
  console.log('═'.repeat(50));
  console.log(`URL: ${url}`);
  console.log(`Password: ${password}`);

  const results = [];

  // Test 1: Publish to Dev.to only (draft)
  results.push(await testPublish(
    'Test 1: Publish to Dev.to (draft)',
    {
      body: {
        title: 'Test Article from Node.js',
        content: `# Hello from Node.js

This is a test article published via the Node.js test script.

## Features

- Multi-platform publishing
- Markdown support
- Simple API

Published at: ${new Date().toISOString()}`,
        tags: ['test', 'nodejs', 'api'],
        is_draft: true,
        platforms: ['devto'],
      },
    }
  ));

  // Test 2: Publish to both platforms (draft)
  results.push(await testPublish(
    'Test 2: Publish to both platforms (draft)',
    {
      body: {
        title: 'Multi-Platform Test from Node.js',
        content: `# Multi-Platform Test

This article was published to multiple platforms simultaneously using Node.js.

## Platforms

- Dev.to
- Medium

Published at: ${new Date().toISOString()}`,
        tags: ['test', 'automation', 'multiplatform'],
        is_draft: true,
        platforms: ['devto', 'medium'],
      },
    }
  ));

  // Test 3: Invalid password (should fail)
  results.push(await testPublish(
    'Test 3: Invalid password (should fail)',
    {
      password: 'wrong-password',
      body: {
        title: 'This should fail',
        content: '# Should not publish',
        tags: ['test'],
        is_draft: true,
        platforms: ['devto'],
      },
    },
    401
  ));

  // Test 4: Missing title (should fail)
  results.push(await testPublish(
    'Test 4: Missing title (should fail)',
    {
      body: {
        content: '# Missing title',
        tags: ['test'],
        is_draft: true,
        platforms: ['devto'],
      },
    },
    400
  ));

  // Test 5: No platforms (should fail)
  results.push(await testPublish(
    'Test 5: No platforms specified (should fail)',
    {
      body: {
        title: 'No platforms',
        content: '# Should fail',
        tags: ['test'],
        is_draft: true,
        platforms: [],
      },
    },
    400
  ));

  // Test 6: Medium only (draft)
  results.push(await testPublish(
    'Test 6: Publish to Medium only (draft)',
    {
      body: {
        title: 'Medium Test Article',
        content: `# Medium Test

Testing Medium-only publishing.

Published at: ${new Date().toISOString()}`,
        tags: ['test', 'medium'],
        is_draft: true,
        platforms: ['medium'],
      },
    }
  ));

  // Summary
  console.log('\n═'.repeat(50));
  console.log('📊 Test Summary');
  console.log('═'.repeat(50));

  const passed = results.filter(r => r.success).length;
  const total = results.length;

  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);

  console.log('\n💡 Tips:');
  console.log('  - Make sure your .env.local has PUBLISH_PASSWORD, DEV_TO_API_KEY, and MEDIUM_API_KEY');
  console.log('  - Start the server with: pnpm dev');
  console.log('  - All test articles are created as drafts');
  console.log('  - Check the web UI to see published articles');

  process.exit(passed === total ? 0 : 1);
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
