import React from 'react'
import { Button } from '@vercel/examples-ui'
import Link from 'next/link'
import fetchAPI from '@lib/fetch-api'
import { ApiKeyData } from './types'

interface KeyActionsProps {
  apiKey: string
  keyData: ApiKeyData
  selectedKey: string
  editingKey: string | null
  editingName: string
  setEditingKey: (key: string | null) => void
  setEditingName: (name: string) => void
  handleEditName: (key: string, name: string) => void
  setKey: (key: string) => void
  loginPasswd: string
  mutate: () => Promise<any>
}

const KeyActions: React.FC<KeyActionsProps> = ({
  apiKey,
  keyData,
  selectedKey,
  editingKey,
  editingName,
  setEditingKey,
  setEditingName,
  handleEditName,
  setKey,
  loginPasswd,
  mutate
}) => (
  <span className="flex justify-end flex-col sm:flex-row">
    <Link
        href={{
            pathname: `/key/${encodeURIComponent(apiKey)}`,
            query: { loginPasswd: loginPasswd },
        }}
        >
      <Button
        className="mb-2 sm:mr-2 sm:mb-0"
        size="sm"
        variant="secondary"
      >
        Publish content
      </Button>
    </Link>
    {editingKey === apiKey ? (
      <Button
        className="mb-2 sm:mr-2 sm:mb-0"
        onClick={() => handleEditName(apiKey, editingName)}
        size="sm"
      >
        Save
      </Button>
    ) : (
      <Button
        className="mb-2 sm:mr-2 sm:mb-0"
        onClick={() => {
          setEditingKey(apiKey)
          setEditingName(keyData.name || '')
        }}
        size="sm"
      >
        Edit Name
      </Button>
    )}
    <Button
      className="mb-2 sm:mr-2 sm:mb-0"
      onClick={() => setKey(selectedKey === apiKey ? '' : apiKey)}
      size="sm"
      variant={selectedKey === apiKey ? 'primary' : 'secondary'}
    >
      Use this key
    </Button>
    <Button
      onClick={async () => {
        await fetchAPI(`/keys?key=${apiKey}`, {
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
)

export default KeyActions
