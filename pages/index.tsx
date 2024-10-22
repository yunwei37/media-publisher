import { useState } from 'react'
import useSWR from 'swr'
import { Layout, Page, Button, Text, Link, Input } from '@vercel/examples-ui'
import fetchAPI from '@lib/fetch-api'
import ApiRequest from '@components/api-request'
import ApiKeyList from '@components/ApiKeyList'

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
          Media Publish tool
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

      <ApiKeyList
        error={error}
        data={data}
        apiKeys={apiKeys}
        selectedKey={selectedKey}
        setKey={setKey}
        loginPasswd={loginPasswd}
        mutate={mutate}
      />

    </Page>
  )
}

RateLimit.Layout = Layout

export default RateLimit
