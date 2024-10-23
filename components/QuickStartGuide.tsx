import { Text } from '@vercel/examples-ui'

const GuideItem = ({ number, title, description }: {
  number: number
  title: string
  description: string
}) => (
  <div className="flex items-start gap-3">
    <div className="bg-blue-100 rounded-full p-2 mt-1">
      <span className="font-semibold">{number}</span>
    </div>
    <div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
)

export default function QuickStartGuide() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <Text variant="h2" className="text-xl font-semibold mb-4">
        Quick Start Guide
      </Text>
      <div className="space-y-4">
        <GuideItem 
          number={1}
          title="Manage API Keys"
          description="Use the API Keys Management section to create, revoke, or update your API keys. Each key can be configured with specific platform permissions or accounts."
        />
        <GuideItem 
          number={2}
          title="Publish Content"
          description="Click the 'Publish Content' button in each key to open a new window for the publishing interface. From there, you can distribute your content to multiple platforms simultaneously."
        />
        <GuideItem 
          number={3}
          title="Track Distribution"
          description="Monitor your content distribution status and analytics through the monitoring dashboard. View detailed logs, performance metrics, and engagement statistics for each platform."
        />
      </div>
    </div>
  )
}