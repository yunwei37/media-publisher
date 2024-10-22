import React, { useState } from 'react'
import { Button, Input } from '@vercel/examples-ui'
import Link from 'next/link'
import fetchAPI from '@lib/fetch-api'

interface ApiKeyListProps {
  error: Error | undefined
  data: any
  apiKeys: [string, ApiKeyData][] // Update this line
  selectedKey: string
  setKey: (key: string) => void
  loginPasswd: string
  mutate: () => Promise<any>
}

interface ApiKeyData {
  limit: number
  timeframe: string
  name: string
}

const ApiKeyList: React.FC<ApiKeyListProps> = ({
  error,
  data,
  apiKeys,
  selectedKey,
  setKey,
  loginPasswd,
  mutate
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editingName, setEditingName] = useState<string>('')

  const handleEditName = async (key: string, newName: string) => {
    try {
      const response = await fetchAPI('/keys', {
        method: 'PATCH',
        headers: { 'X-Login-Passwd': loginPasswd },
        body: JSON.stringify({ key, name: newName }),
      });
        console.log('response', response);  
      // Check the 'done' property from the response
      if (!response.done) {
        alert(response.error?.message || 'Failed to update key name');
        return;
      }

      await mutate(); // Refresh the data only if successful
      setEditingKey(null); // Exit editing mode
    } catch (error) {
      console.error('Failed to update key name:', error);
      alert('An error occurred while updating the key name');
    }
  }

  return (
    <div className="grid">
      {error ? (
        <div>Failed to load API Keys: {error.message}</div>
      ) : !data ? (
        <div>Enter LOGIN_PASSWD to load API Keys</div>
      ) : apiKeys.length === 0 ? (
        <div>No API Keys found</div>
      ) : (
        <ul className="border-accents-2 border rounded-md bg-white divide-y divide-accents-2 my-6">
          {apiKeys.map(([key, keyData]: [string, ApiKeyData]) => (
            <li key={key} className="flex items-center justify-content p-6">
              <span className="flex-1 mr-4 sm:mr-8">
                {editingKey === key ? (
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleEditName(key, editingName)
                      }
                    }}
                    className="mb-2"
                  />
                ) : (
                  <h3 className="text-sm font-semibold text-black break-all mb-2">
                    {keyData.name || 'Unnamed Key'}
                  </h3>
                )}
                <p className="text-xs text-accents-5 break-all mb-2">{key}</p>
                <p className="font-medium text-accents-4">
                  {keyData.limit}req/{keyData.timeframe}s
                </p>
              </span>
              <span className="flex justify-end flex-col sm:flex-row">
                <Link href={`/key/${encodeURIComponent(key)}`}>
                  <Button
                    className="mb-2 sm:mr-2 sm:mb-0"
                    size="sm"
                    variant="secondary"
                  >
                    Details
                  </Button>
                </Link>
                {editingKey === key ? (
                  <Button
                    className="mb-2 sm:mr-2 sm:mb-0"
                    onClick={() => handleEditName(key, editingName)}
                    size="sm"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    className="mb-2 sm:mr-2 sm:mb-0"
                    onClick={() => {
                      setEditingKey(key)
                      setEditingName(keyData.name || '')
                    }}
                    size="sm"
                  >
                    Edit Name
                  </Button>
                )}
                <Button
                  className="mb-2 sm:mr-2 sm:mb-0"
                  onClick={() => setKey(selectedKey === key ? '' : key)}
                  size="sm"
                  variant={selectedKey === key ? 'primary' : 'secondary'}
                >
                  Use this key
                </Button>
                <Button
                  onClick={async () => {
                    await fetchAPI(`/keys?key=${key}`, {
                      method: 'DELETE',
                      headers: { 'X-Login-Passwd': loginPasswd },
                    })
                    await mutate()
                  }}
                  size="sm"
                  variant="secondary"
                >
                  Remove
                </Button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          className="sm:w-44"
          onClick={async () => {
            try {
              await mutate();
            } catch (error) {
              console.error('Error refreshing API keys:', error);
              alert('An error occurred while refreshing the API keys');
            }
          }}
        >
          Refresh
        </Button>
        <Button
          type="button"
          className="sm:w-44"
          onClick={async () => {
            setLoading(true);
            try {
              const response = await fetchAPI('/keys', {
                method: 'PUT',
                headers: { 'X-Login-Passwd': loginPasswd },
                body: JSON.stringify({ name: 'New API Key' }),
              });

              if (!response.done) {
                alert(response.error?.message || 'Failed to add new API key');
                return;
              }

              await mutate();
            } catch (error) {
              console.error('Error adding new API key:', error);
              alert('An error occurred while adding the API key');
            } finally {
              setLoading(false);
            }
          }}
          loading={loading}
        >
          Add new API Key
        </Button>
      </div>
    </div>
  )
}

export default ApiKeyList
