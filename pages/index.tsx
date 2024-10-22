import { useState } from 'react'
import useSWR from 'swr'
import { Layout, Page, Button, Text, Link, Input } from '@vercel/examples-ui'
import fetchAPI from '@lib/fetch-api'
import ApiRequest from '@components/api-request'

const fetcher = (url: string, loginPasswd: string) => fetch(url, {
  headers: {
    'X-Login-Passwd': loginPasswd
  }
}).then(res => {
  if (!res.ok) {
    throw new Error(`An error occurred: ${res.status}`)
  }
  return res.json()
})

function RateLimit() {
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedKey, setKey] = useState<string>('')
  const [loginPasswd, setLoginPasswd] = useState<string>('')
  const { data, error, mutate } = useSWR(
    loginPasswd ? ['/api/keys', loginPasswd] : null,
    fetcher
  )
  
  console.log('SWR data:', data)
  console.log('SWR error:', error)

  const apiKeys = data?.apiKeys || []

  return (
    <Page>
      <div className="text-center mb-6">
        <Text variant="h1" className="mb-4">
          API Rate Limiting with Upstash
        </Text>
        <Text className="mb-4">
          With <i className="font-semibold">Vercel&apos;s Edge Middleware</i>{' '}
          we&apos;re able to do API rate limiting by keeping a counter of
          requests by IP or API token. For the demo below you can send a maximum
          of <b>5</b> requests every <b>10</b> seconds, which increases if using
          an API token.
        </Text>
      </div>

      <div className="mb-4">
        <Input
          type="password"
          placeholder="Enter LOGIN_PASSWD"
          value={loginPasswd}
          onChange={(e) => setLoginPasswd(e.target.value)}
        />
      </div>

      <ApiRequest token={selectedKey} loginPasswd={loginPasswd} />

      <div className="grid">
        {error ? (
          <div>Failed to load API Keys: {error.message}</div>
        ) : !data ? (
          <div>Enter LOGIN_PASSWD to load API Keys</div>
        ) : apiKeys.length === 0 ? (
          <div>No API Keys found</div>
        ) : (
          <ul className="border-accents-2 border rounded-md bg-white divide-y divide-accents-2 my-6">
            {apiKeys.map(([key, { limit, timeframe }]) => (
              <li key={key} className="flex items-center justify-content p-6">
                <span className="flex-1 mr-4 sm:mr-8">
                  <h3 className="text-sm font-semibold text-black break-all">
                    {key}
                  </h3>
                  <p className="font-medium text-accents-4">
                    {limit}req/{timeframe}s
                  </p>
                </span>
                <span className="flex justify-end flex-col sm:flex-row">
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

        <Button
          type="button"
          className="sm:w-44 sm:justify-self-end"
          onClick={async () => {
            setLoading(true)
            await fetchAPI('/keys', {
              method: 'PUT',
              headers: { 'X-Login-Passwd': loginPasswd },
            }).finally(() => {
              setLoading(false)
            })
            await mutate()
          }}
          loading={loading}
        >
          Add new API Key
        </Button>
      </div>
    </Page>
  )
}

RateLimit.Layout = Layout

export default RateLimit
