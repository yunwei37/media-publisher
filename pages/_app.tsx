import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import Layout from '../components/Layout'  // Changed this line
import '@vercel/examples-ui/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 40000,
        revalidateOnFocus: false,
        fetcher: (path: RequestInfo | URL, init: RequestInit | undefined) => fetch(path, init).then((res) => res.json()),
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  )
}
