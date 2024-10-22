import React, { useState } from 'react'
import { Button, Input } from '@vercel/examples-ui'
import Link from 'next/link'
import fetchAPI from '@lib/fetch-api'
import { ApiKeyItemProps } from './types'
import KeyActions from './KeyActions'

const ApiKeyItem: React.FC<ApiKeyItemProps> = ({
  apiKey,
  keyData,
  selectedKey,
  loginPasswd,
  mutate,
  setKey
}) => {
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editingName, setEditingName] = useState<string>('')

  const handleEditName = async (key: string, newName: string) => {
    try {
      const response = await fetchAPI('/keys', {
        method: 'PATCH',
        headers: { 'X-Login-Passwd': loginPasswd },
        body: JSON.stringify({ key, name: newName }),
      })
      
      if (!response.done) {
        alert(response.error?.message || 'Failed to update key name')
        return
      }

      await mutate()
      setEditingKey(null)
    } catch (error) {
      console.error('Failed to update key name:', error)
      alert('An error occurred while updating the key name')
    }
  }

  return (
    <li className="flex items-center justify-content p-6">
      <span className="flex-1 mr-4 sm:mr-8">
        {editingKey === apiKey ? (
          <Input
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleEditName(apiKey, editingName)
              }
            }}
            className="mb-2"
          />
        ) : (
          <h3 className="text-sm font-semibold text-black break-all mb-2">
            {keyData.name || 'Unnamed Key'}
          </h3>
        )}
        <p className="text-xs text-accents-5 break-all mb-2">{apiKey}</p>
        <p className="font-medium text-accents-4">
          {keyData.limit}req/{keyData.timeframe}s
        </p>
      </span>
      <KeyActions
        apiKey={apiKey}
        keyData={keyData}
        selectedKey={selectedKey}
        editingKey={editingKey}
        editingName={editingName}
        setEditingKey={setEditingKey}
        setEditingName={setEditingName}
        handleEditName={handleEditName}
        setKey={setKey}
        loginPasswd={loginPasswd}
        mutate={mutate}
      />
    </li>
  )
}

export default ApiKeyItem
