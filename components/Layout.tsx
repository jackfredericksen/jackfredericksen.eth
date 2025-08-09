import Head from 'next/head'
import Navigation from './Navigation'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export default function Layout({ 
  children, 
  title = 'jackfredericksen.eth',
  description = 'Web3 Architect & Blockchain Developer - Personal portfolio hosted on IPFS'
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        
        {/* IPFS optimizations */}
        <meta name="robots" content="index,follow" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
      </Head>
      
      <div className="min-h-screen">
        <Navigation />
        <main>
          {children}
        </main>
      </div>
    </>
  )
}