import { useRouter } from 'next/router'
import { Layout, Page, Text, Link, Button } from '@vercel/examples-ui'
import { useState, useEffect } from 'react'
import { MediaKeyForm } from '../../components/MediaKeyForm'
import { MediaKeyTable } from '../../components/MediaKeyTable'
import { fetchKeyDetails, fetchMediaKeys, saveMediaKey, deleteMediaKey } from '../../lib/media-keys'
import { KeyDetails, MediaKeys } from '../../lib/media-keys'
import { KeyDetailsPanel } from '../../components/KeyDetailsPanel'
import { MediaKeyPanel } from '../../components/MediaKeyPanel'

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

function KeyPage() {
  const router = useRouter()
  const { key, loginPasswd } = router.query
  const [mediaKeys, setMediaKeys] = useState<MediaKeys>({})
  const [keyDetails, setKeyDetails] = useState<KeyDetails | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState(['', '', ''])
  const [isDraft, setIsDraft] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    if (key && loginPasswd) {
      const loadData = async () => {
        try {
          const [details, keys] = await Promise.all([
            fetchKeyDetails(key as string, loginPasswd as string),
            fetchMediaKeys(key as string, loginPasswd as string)
          ])
          setKeyDetails(details)
          setMediaKeys(keys)
        } catch (err) {
          console.error('Failed to load data')
        }
      }
      loadData()
    }
  }, [key, loginPasswd])

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
      const response = await fetch(`/api/publish/devto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key as string,
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

      alert('Successfully published to DEV.to!')
      setTitle('')
      setContent('')
      setTags(['', '', ''])
    } catch (error) {
      alert(`Failed to publish: ${error.message}`)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <Page>
      <div className="text-center mb-6">
        <Text variant="h1" className="mb-4">
          Key Details
        </Text>
      </div>

      <KeyDetailsPanel keyDetails={keyDetails} />

      <MediaKeyPanel
        mediaKeys={mediaKeys}
        setMediaKeys={setMediaKeys}
        apiKey={key as string}
        loginPasswd={loginPasswd as string}
      />

      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
        <Text variant="h2" className="mb-6">
          Publish to DEV.to
        </Text>

        <div className="space-y-6">
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
            <label className="block text-sm font-medium text-gray-700">
              Content (Markdown)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Write your article in markdown..."
            />
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
              {isPublishing ? 'Publishing...' : 'Publish to DEV.to'}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/">
          <Button variant="secondary">Back to Home</Button>
        </Link>
      </div>
    </Page>
  )
}

KeyPage.Layout = Layout

export default KeyPage
