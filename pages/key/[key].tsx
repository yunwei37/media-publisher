import { useRouter } from 'next/router'
import { Layout, Page, Text, Link, Button } from '@vercel/examples-ui'
import { useState, useEffect } from 'react'

function KeyPage() {
  const router = useRouter()
  const { key } = router.query
  const [mediaKeys, setMediaKeys] = useState<Record<string, string>>({})
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch media keys on load
  useEffect(() => {
    if (key) {
      fetchMediaKeys()
    }
  }, [key])

  const fetchMediaKeys = async () => {
    try {
      const res = await fetch('/api/mediakeys', {
        headers: {
          'x-api-key': key as string,
        },
      })
      const data = await res.json()
      if (data.mediaKeys) {
        setMediaKeys(data.mediaKeys)
      }
    } catch (err) {
      setError('Failed to fetch media keys')
    }
  }

  const handleSaveMediaKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/mediakeys', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key as string,
        },
        body: JSON.stringify({ key: newKey, value: newValue }),
      })

      if (!res.ok) {
        throw new Error('Failed to save media key')
      }

      // Refresh media keys
      await fetchMediaKeys()
      // Clear form
      setNewKey('')
      setNewValue('')
    } catch (err) {
      setError('Failed to save media key')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMediaKey = async (mediaKey: string) => {
    try {
      const res = await fetch(`/api/mediakeys?key=${mediaKey}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': key as string,
        },
      })

      if (!res.ok) {
        throw new Error('Failed to delete media key')
      }

      // Refresh media keys
      await fetchMediaKeys()
    } catch (err) {
      setError('Failed to delete media key')
    }
  }

  return (
    <Page>
      <div className="text-center mb-6">
        <Text variant="h1" className="mb-4">
          Key Details
        </Text>
      </div>

      <div className="mb-4">
        <Text>Selected API Key: {key}</Text>
      </div>

      {/* Media Keys Section */}
      <div className="mb-6">
        <Text variant="h2" className="mb-4">Media Keys</Text>
        
        {/* Add New Media Key Form */}
        <form onSubmit={handleSaveMediaKey} className="mb-4">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Key name"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="flex-1 p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Key value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="flex-1 p-2 border rounded"
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Add Media Key'}
            </Button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}

        {/* Media Keys List */}
        <div className="border rounded-lg overflow-hidden">
          {Object.entries(mediaKeys).length === 0 ? (
            <div className="p-4 text-gray-500">
              No media keys found
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Key</th>
                  <th className="px-4 py-2 text-left">Value</th>
                  <th className="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(mediaKeys).map(([mediaKey, value]) => (
                  <tr key={mediaKey} className="border-t">
                    <td className="px-4 py-2">{mediaKey}</td>
                    <td className="px-4 py-2">{value}</td>
                    <td className="px-4 py-2 text-right">
                      <Button
                        variant="secondary"
                        onClick={() => handleDeleteMediaKey(mediaKey)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Link href="/">
        <Button variant="secondary">Back to Home</Button>
      </Link>
    </Page>
  )
}

KeyPage.Layout = Layout

export default KeyPage
