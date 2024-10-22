import { useRouter } from 'next/router'
import { Layout, Page, Text, Link, Button } from '@vercel/examples-ui'

function KeyPage() {
  const router = useRouter()
  const { key } = router.query

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

      <div className="mb-4">
        {/* Add your key-specific content here */}
        <Text>This is a dedicated page for the selected API key.</Text>
      </div>

      <Link href="/">
        <Button variant="secondary">Back to Home</Button>
      </Link>
    </Page>
  )
}

KeyPage.Layout = Layout

export default KeyPage