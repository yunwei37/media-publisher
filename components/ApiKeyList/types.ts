export interface ApiKeyListProps {
    error: Error | undefined
    data: any
    apiKeys: [string, ApiKeyData][]
    selectedKey: string
    setKey: (key: string) => void
    loginPasswd: string
    mutate: () => Promise<any>
  }
  
  export interface ApiKeyData {
    limit: number
    timeframe: string
    name: string
  }
  
  export interface ApiKeyItemProps {
    apiKey: string
    keyData: ApiKeyData
    selectedKey: string
    loginPasswd: string
    mutate: () => Promise<any>
    setKey: (key: string) => void
  }