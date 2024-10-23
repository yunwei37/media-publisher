import { useState } from 'react'
import { Text, Button } from '@vercel/examples-ui'
import dynamic from 'next/dynamic'
import { Editor } from '@monaco-editor/react'

const MarkdownPreview = dynamic(() => import('./MarkdownPreview'), {
  ssr: false,
})

interface PublishPanelProps {
  apiKey: string
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      className={`${
        checked ? 'bg-indigo-600' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`${
          checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </button>
  );
}

export function PublishPanel({ apiKey }: PublishPanelProps) {
  const [platform, setPlatform] = useState('devto')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState(['', '', ''])
  const [isDraft, setIsDraft] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...tags]
    newTags[index] = value
    setTags(newTags)
  }

  const handlePublish = async () => {
    if (!title || !content || !tags.filter(Boolean).length) {
      alert('Please fill in all required fields')
      return
    }

    setIsPublishing(true)
    try {
      const response = await fetch(`/api/publish/${platform}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          title,
          content,
          tags: tags.filter(Boolean),
          is_draft: isDraft,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error.message)
      }

      alert(`Successfully published to ${platform}!`)
      setTitle('')
      setContent('')
      setTags(['', '', ''])
    } catch (error: any) {
      alert(`Failed to publish: ${error.message}`)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-6">
      <Text variant="h2" className="mb-4">Publish Article</Text>

      <div className="p-6 bg-white rounded-lg shadow space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Platform
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="devto">DEV.to</option>
            <option value="medium">Medium</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Article title"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Content (Markdown)
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {showPreview ? 'Preview' : 'Editor'}
              </span>
              <Toggle checked={showPreview} onChange={setShowPreview} />
            </div>
          </div>

          <div className="border rounded-lg">
            {showPreview ? (
              <div className="prose prose-sm max-w-none p-4 min-h-[400px] bg-gray-50">
                <MarkdownPreview content={content} />
              </div>
            ) : (
              <Editor
                height="400px"
                defaultLanguage="markdown"
                value={content}
                onChange={(value) => setContent(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  quickSuggestions: true,
                  tabSize: 2,
                }}
                className="border rounded-lg"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {tags.map((tag, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700">
                Tag {index + 1}
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter tag"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <Toggle checked={isDraft} onChange={setIsDraft} />
          <span className="text-sm text-gray-600">Save as draft</span>
        </div>

        <div>
          <Button
            variant="primary"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? 'Publishing...' : `Publish to ${platform.toUpperCase()}`}
          </Button>
        </div>
      </div>
    </div>
  )
}
