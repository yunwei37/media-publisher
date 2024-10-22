import React, { useState } from 'react'
import { Button } from '@vercel/examples-ui'
import fetchAPI from '@lib/fetch-api'

interface ActionButtonsProps {
  loginPasswd: string
  mutate: () => Promise<any>
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ loginPasswd, mutate }) => {
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        className="sm:w-44"
        onClick={async () => {
          try {
            await mutate()
          } catch (error) {
            console.error('Error refreshing API keys:', error)
            alert('An error occurred while refreshing the API keys')
          }
        }}
      >
        Refresh
      </Button>
      <Button
        type="button"
        className="sm:w-44"
        onClick={async () => {
          setLoading(true)
          try {
            const response = await fetchAPI('/keys', {
              method: 'PUT',
              headers: { 'X-Login-Passwd': loginPasswd },
              body: JSON.stringify({ name: 'New API Key' }),
            })

            if (!response.done) {
              alert(response.error?.message || 'Failed to add new API key')
              return
            }

            await mutate()
          } catch (error) {
            console.error('Error adding new API key:', error)
            alert('An error occurred while adding the API key')
          } finally {
            setLoading(false)
          }
        }}
        loading={loading}
      >
        Add new API Key
      </Button>
    </div>
  )
}

export default ActionButtons
