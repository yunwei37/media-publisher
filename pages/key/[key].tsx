import { useRouter } from 'next/router'
import { Layout, Page, Text, Link, Button } from '@vercel/examples-ui'
import { useState, useEffect } from 'react'
import { MediaKeyForm } from '../../components/MediaKeyForm'
import { MediaKeyTable } from '../../components/MediaKeyTable'
import { fetchKeyDetails, fetchMediaKeys, saveMediaKey, deleteMediaKey } from '../../lib/media-keys'
import { KeyDetails, MediaKeys } from '../../lib/media-keys'

function KeyPage() {
  const router = useRouter()
  const { key, loginPasswd } = router.query
  const [mediaKeys, setMediaKeys] = useState<MediaKeys>({})
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [keyDetails, setKeyDetails] = useState<KeyDetails | null>(null)

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
          setError('Failed to load data')
        }
      }
      loadData()
    }
  }, [key, loginPasswd])

  const handleSaveMediaKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await saveMediaKey(key as string, newKey, newValue)
      const keys = await fetchMediaKeys(key as string, loginPasswd as string)
      setMediaKeys(keys)
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
      await deleteMediaKey(key as string, mediaKey)
      const keys = await fetchMediaKeys(key as string, loginPasswd as string)
      setMediaKeys(keys)
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
        {keyDetails && (
          <div className="mt-2 p-4 border rounded-lg">
            <Text className="mb-2">Name: {keyDetails.name}</Text>
            <Text className="mb-2">Key ID: {keyDetails.jti}</Text>
            <Text className="mb-2">Rate Limit: {keyDetails.limit} requests</Text>
            <Text className="mb-2">Time Frame: {keyDetails.timeframe} seconds</Text>
            <Text>Created: {new Date(keyDetails.iat * 1000).toLocaleString()}</Text>
          </div>
        )}
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
