import { useRouter } from 'next/router'
import { Layout, Page, Text, Link, Button } from '@vercel/examples-ui'
import { useState, useEffect } from 'react'
import { MediaKeyForm } from '../../components/MediaKeyForm'
import { MediaKeyTable } from '../../components/MediaKeyTable'

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

      <div className="mb-6">
        <Text variant="h2" className="mb-4">Media Keys</Text>
        
        <MediaKeyForm
          onSubmit={handleSaveMediaKey}
          newKey={newKey}
          setNewKey={setNewKey}
          newValue={newValue}
          setNewValue={setNewValue}
          loading={loading}
        />

        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}

        <div className="border rounded-lg overflow-hidden">
          <MediaKeyTable
            mediaKeys={mediaKeys}
            onDelete={handleDeleteMediaKey}
          />
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
