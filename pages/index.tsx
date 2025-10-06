import { useState } from 'react'
import { Page, Text, Input, Button } from '@vercel/examples-ui'

interface PublishResult {
  platform: string;
  success: boolean;
  article?: any;
  error?: string;
}

function MediaPublisher() {
  const [password, setPassword] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [tags, setTags] = useState<string>('')
  const [isDraft, setIsDraft] = useState<boolean>(true)
  const [platforms, setPlatforms] = useState<{devto: boolean, medium: boolean}>({
    devto: true,
    medium: false
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [results, setResults] = useState<PublishResult[] | null>(null)

  const handlePublish = async () => {
    setLoading(true)
    setResults(null)

    const selectedPlatforms = Object.entries(platforms)
      .filter(([_, enabled]) => enabled)
      .map(([platform, _]) => platform)

    try {
      const response = await fetch('/api/publish-multi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publish-password': password,
        },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(',').map(t => t.trim()),
          is_draft: isDraft,
          platforms: selectedPlatforms,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(`Error: ${data.error?.message || 'Failed to publish'}`)
      } else {
        setResults(data.results)
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page className="flex flex-col gap-8">
      {/* Hero Section */}
      <section className="relative -mt-6 -mx-6 px-6 py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <Text variant="h1" className="text-white text-4xl font-bold mb-4">
            Multi-Platform Media Publisher
          </Text>
          <Text className="text-white text-xl opacity-90">
            Publish your content to Dev.to and Medium simultaneously
          </Text>
        </div>
      </section>

      {/* Help Section */}
      <section className="max-w-4xl mx-auto w-full bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">📖 How to Use</h2>
        <div className="space-y-3 text-gray-700">
          <p><strong>1. Setup Environment:</strong> Configure your <code className="bg-blue-100 px-2 py-1 rounded">.env.local</code> file with:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><code className="bg-blue-100 px-2 py-1 rounded">PUBLISH_PASSWORD</code> - Your admin password</li>
            <li><code className="bg-blue-100 px-2 py-1 rounded">DEV_TO_API_KEY</code> - Your Dev.to API key (get from <a href="https://dev.to/settings/extensions" target="_blank" className="text-blue-600 underline">dev.to/settings/extensions</a>)</li>
            <li><code className="bg-blue-100 px-2 py-1 rounded">MEDIUM_API_KEY</code> - Your Medium integration token (get from <a href="https://medium.com/me/settings" target="_blank" className="text-blue-600 underline">medium.com/me/settings</a>)</li>
          </ul>
          <p><strong>2. Fill the Form:</strong> Enter your password, article title, content (in Markdown), and comma-separated tags</p>
          <p><strong>3. Select Platforms:</strong> Choose which platforms to publish to</p>
          <p><strong>4. Publish:</strong> Click the publish button and wait for results</p>
        </div>
      </section>

      {/* API Usage Section */}
      <section className="max-w-4xl mx-auto w-full bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🔌 API Usage</h2>
        <p className="mb-3 text-gray-700">You can also publish programmatically using the API:</p>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X POST \\
  'http://localhost:3000/api/publish-multi' \\
  -H 'Content-Type: application/json' \\
  -H 'x-publish-password: YOUR_PASSWORD' \\
  -d '{
    "title": "My Article Title",
    "content": "# Hello World\\n\\nThis is my article.",
    "tags": ["tech", "tutorial"],
    "is_draft": true,
    "platforms": ["devto", "medium"]
  }'`}
        </pre>
      </section>

      {/* Publishing Form */}
      <section className="max-w-4xl mx-auto w-full border rounded-lg p-6 bg-white shadow-sm">
        <Text variant="h2" className="text-2xl font-semibold mb-6">
          Publish Article
        </Text>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              placeholder="Enter your publish password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              type="text"
              placeholder="Article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content (Markdown)</label>
            <textarea
              className="w-full min-h-[300px] p-3 border rounded-md font-mono text-sm"
              placeholder="# Your Article&#10;&#10;Write your content in Markdown..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
            <Input
              type="text"
              placeholder="javascript, webdev, tutorial"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isDraft}
                onChange={(e) => setIsDraft(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Publish as draft</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Platforms</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={platforms.devto}
                  onChange={(e) => setPlatforms({...platforms, devto: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Dev.to</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={platforms.medium}
                  onChange={(e) => setPlatforms({...platforms, medium: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Medium</span>
              </label>
            </div>
          </div>

          <Button
            onClick={handlePublish}
            disabled={loading || !password || !title || !content || !tags}
            className="w-full"
          >
            {loading ? 'Publishing...' : 'Publish Article'}
          </Button>
        </div>

        {/* Results Display */}
        {results && (
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-lg">Results:</h3>
            {results.map((result, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  result.success
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">{result.platform}</span>
                  <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                    {result.success ? '✓ Success' : '✗ Failed'}
                  </span>
                </div>
                {result.error && (
                  <p className="mt-2 text-sm text-red-600">{result.error}</p>
                )}
                {result.article && (
                  <div className="mt-2 text-sm text-gray-600">
                    <pre className="overflow-x-auto">{JSON.stringify(result.article, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer Info */}
      <section className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg bg-white">
          <h3 className="font-semibold mb-2">🔒 Simple & Secure</h3>
          <p className="text-gray-600">Password-protected API with environment-based credentials</p>
        </div>
        <div className="p-6 border rounded-lg bg-white">
          <h3 className="font-semibold mb-2">⚡ Multi-Platform</h3>
          <p className="text-gray-600">Publish to multiple platforms simultaneously</p>
        </div>
        <div className="p-6 border rounded-lg bg-white">
          <h3 className="font-semibold mb-2">📝 Markdown Support</h3>
          <p className="text-gray-600">Write once in Markdown, publish everywhere</p>
        </div>
      </section>
    </Page>
  )
}

export default MediaPublisher
