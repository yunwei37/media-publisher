
export interface KeyDetails {
    name: string
    jti: string
    limit: number
    timeframe: number
    iat: number
}

export interface MediaKeys {
    [key: string]: string
}

// API client functions for frontend use
export const fetchKeyDetails = async (key: string, loginPasswd: string) => {
    const res = await fetch('/api/keys', {
        headers: {
            'X-Login-Passwd': loginPasswd,
        },
    })
    const data = await res.json()
    return data.apiKeys.find(([token]: [string, any]) => token === key)?.[1]
}

export const fetchMediaKeys = async (key: string, loginPasswd: string) => {
    const res = await fetch('/api/mediakeys', {
        headers: {
            'x-api-key': key,
            'X-Login-Passwd': loginPasswd,
        },
    })
    const data = await res.json()
    return data.mediaKeys
}

export const saveMediaKey = async (apiKey: string, newKey: string, newValue: string) => {
    const res = await fetch('/api/mediakeys', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
        },
        body: JSON.stringify({ key: newKey, value: newValue }),
    })

    if (!res.ok) {
        throw new Error('Failed to save media key')
    }
    return res.json()
}

export const deleteMediaKey = async (apiKey: string, mediaKey: string) => {
    const res = await fetch(`/api/mediakeys?key=${mediaKey}`, {
        method: 'DELETE',
        headers: {
            'x-api-key': apiKey,
        },
    })

    if (!res.ok) {
        throw new Error('Failed to delete media key')
    }
    return res.json()
}