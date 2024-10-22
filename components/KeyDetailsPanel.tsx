import { Text } from '@vercel/examples-ui'
import { KeyDetails } from '../lib/media-keys'
import { useState } from 'react'

interface KeyDetailsPanelProps {
  keyDetails: KeyDetails | null;
}

export function KeyDetailsPanel({ keyDetails }: KeyDetailsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4">
      <div 
        className="text-left mb-2 cursor-pointer flex items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Text className="mb-0">
          Key Details
        </Text>
        <span className="ml-2">{isExpanded ? '▼' : '▶'}</span>
      </div>
      {keyDetails && isExpanded && (
        <div className="mt-2 p-4 border rounded-lg">
          <Text className="mb-2">Name: {keyDetails.name}</Text>
          <Text className="mb-2">Key ID: {keyDetails.jti}</Text>
          <Text className="mb-2">Rate Limit: {keyDetails.limit} requests</Text>
          <Text className="mb-2">Time Frame: {keyDetails.timeframe} seconds</Text>
          <Text>Created: {new Date(keyDetails.iat * 1000).toLocaleString()}</Text>
        </div>
      )}
    </div>
  );
}
