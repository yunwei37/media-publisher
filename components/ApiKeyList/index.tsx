import React from 'react'
import { ApiKeyListProps } from './types'
import ApiKeyItem from './ApiKeyItem'
import ActionButtons from './ActionButtons'

const ApiKeyList: React.FC<ApiKeyListProps> = ({
  error,
  data,
  apiKeys,
  selectedKey,
  setKey,
  loginPasswd,
  mutate
}) => {
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
          {apiKeys.map(([key, keyData]) => (
            <ApiKeyItem
              key={key}
              apiKey={key}
              keyData={keyData}
              selectedKey={selectedKey}
              loginPasswd={loginPasswd}
              mutate={mutate}
              setKey={setKey}
            />
          ))}
        </ul>
      )}
      <ActionButtons
        loginPasswd={loginPasswd}
        mutate={mutate}
      />
    </div>
  )
}

export default ApiKeyList
