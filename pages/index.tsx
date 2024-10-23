import { useState } from 'react'
import useSWR from 'swr'
import { Page, Text, Input } from '@vercel/examples-ui'
import ApiRequest from '@components/api-request'
import ApiKeyList from '@components/ApiKeyList'
import QuickStartGuide from '@components/QuickStartGuide'

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

function MediaPublisher() {
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

  const [isApiRequestOpen, setIsApiRequestOpen] = useState(false)

  return (
    <Page className="flex flex-col gap-8">
      {/* Hero Section - Fixed background and margins */}
      <section className="relative -mt-6 -mx-6 px-6 py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <Text variant="h1" className="text-black text-4xl font-bold mb-4">
            Media Publisher Platform
          </Text>
          <Text className="text-black text-xl opacity-90">
            Enterprise-grade media content management and distribution
          </Text>
        </div>
      </section>

      {/* Auth Section */}
      <section className="max-w-lg mx-auto w-full">
        <div className="flex flex-col gap-4">
          <Text>Input the admin password and click refresh to load API keys.</Text>
          <Input
            type="password"
            placeholder="Enter admin password"
            value={loginPasswd}
            onChange={(e) => setLoginPasswd(e.target.value)}
          />
        </div>
      </section>

      {/* Main Content Section */}
      <section className="max-w-4xl mx-auto w-full space-y-6">
        {/* Collapsible API Request Section */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => setIsApiRequestOpen(!isApiRequestOpen)}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
          >
            <Text className="font-medium">API Request Testing</Text>
            <span className="text-gray-500">
              {isApiRequestOpen ? '▼' : '▶'}
            </span>
          </button>
          <div className={`p-4 ${isApiRequestOpen ? 'block' : 'hidden'}`}>
            <ApiRequest token={selectedKey} loginPasswd={loginPasswd} />
          </div>
        </div>

        {/* API Keys Management Section */}
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <Text variant="h2" className="text-xl font-semibold mb-6">
            API Keys Management
          </Text>
          <ApiKeyList
            error={error}
            data={data}
            apiKeys={apiKeys}
            selectedKey={selectedKey}
            setKey={setKey}
            loginPasswd={loginPasswd}
            mutate={mutate}
          />
        </div>
      </section>

      {/* Quick Start Guide Section */}
      <section className="max-w-4xl mx-auto w-full">
        <QuickStartGuide />
      </section>

      {/* Info Section */}
      <section className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg bg-white">
          <h3 className="font-semibold mb-2">Secure</h3>
          <p className="text-gray-600">Enterprise-grade security with API key management</p>
        </div>
        <div className="p-6 border rounded-lg bg-white">
          <h3 className="font-semibold mb-2">Scalable</h3>
          <p className="text-gray-600">Built for high-performance media distribution</p>
        </div>
        <div className="p-6 border rounded-lg bg-white">
          <h3 className="font-semibold mb-2">Reliable</h3>
          <p className="text-gray-600">24/7 content delivery with global reach</p>
        </div>
      </section>
    </Page>
  )
}

export default MediaPublisher
