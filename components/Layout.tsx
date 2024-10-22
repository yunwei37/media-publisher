import Head from 'next/head'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Media Publisher Platform</title>
      </Head>

      <div className="py-8 px-4">
        {children}
      </div>
    </div>
  )
}
