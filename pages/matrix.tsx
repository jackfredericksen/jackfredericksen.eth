// pages/matrix.tsx - 3D Portfolio page that integrates with your existing GitHub data
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Head from 'next/head'

// Dynamically import the ThreePortfolio component to avoid SSR issues
const ThreePortfolio = dynamic(() => import('../components/ThreePortfolio'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.h2 
          className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Initializing Matrix...
        </motion.h2>
        <p className="text-gray-400 text-sm">Loading 3D environment</p>
      </div>
    </div>
  )
})

// Enhanced skill data matching your actual tech stack from pages/index.tsx
const techSkills = [
  { name: 'Solidity', level: 95, color: 0x627eea, orbitRadius: 4, orbitSpeed: 0.01 },
  { name: 'React', level: 98, color: 0x61dafb, orbitRadius: 5, orbitSpeed: 0.008 },
  { name: 'Node.js', level: 92, color: 0x68a063, orbitRadius: 6, orbitSpeed: 0.006 },
  { name: 'Web3.js', level: 94, color: 0xf16822, orbitRadius: 4.5, orbitSpeed: 0.009 },
  { name: 'Next.js', level: 96, color: 0x000000, orbitRadius: 5.5, orbitSpeed: 0.007 },
  { name: 'TypeScript', level: 97, color: 0x3178c6, orbitRadius: 3.5, orbitSpeed: 0.012 },
  { name: 'IPFS', level: 88, color: 0x65c2cb, orbitRadius: 7, orbitSpeed: 0.005 },
  { name: 'Ethereum', level: 92, color: 0x627eea, orbitRadius: 6.5, orbitSpeed: 0.004 }
]

// Vision/moodboard items that match your existing moodboard structure
const visionItems = [
  { 
    id: '1', 
    type: 'color' as const, 
    content: '#64ffda', 
    position: [-3, 2, 1] as [number, number, number], 
    size: [1.5, 1] as [number, number] 
  },
  { 
    id: '2', 
    type: 'color' as const, 
    content: '#ff6b6b', 
    position: [3, 1, -2] as [number, number, number], 
    size: [1, 1.2] as [number, number] 
  },
  { 
    id: '3', 
    type: 'text' as const, 
    content: 'Web3 Native', 
    position: [0, -2, 3] as [number, number, number], 
    size: [2.5, 1] as [number, number] 
  },
  { 
    id: '4', 
    type: 'text' as const, 
    content: 'Decentralized', 
    position: [-4, -1, -2] as [number, number, number], 
    size: [2.2, 1.2] as [number, number] 
  },
  { 
    id: '5', 
    type: 'color' as const, 
    content: '#4ecdc4', 
    position: [2, 3, 1] as [number, number, number], 
    size: [1.3, 1] as [number, number] 
  },
  { 
    id: '6', 
    type: 'text' as const, 
    content: 'Innovation', 
    position: [-1, 3, -3] as [number, number, number], 
    size: [2, 1.5] as [number, number] 
  },
  { 
    id: '7', 
    type: 'color' as const, 
    content: '#9d4edd', 
    position: [4, -2, 2] as [number, number, number], 
    size: [1, 1.8] as [number, number] 
  },
  { 
    id: '8', 
    type: 'text' as const, 
    content: 'Future', 
    position: [-3, 0, 4] as [number, number, number], 
    size: [1.8, 1] as [number, number] 
  }
]

export default function Matrix() {
  const [mounted, setMounted] = useState(false)
  const [isWebGLSupported, setIsWebGLSupported] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    setMounted(true)
    
    // Check WebGL support
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      setIsWebGLSupported(false)
    }

    // Hide welcome message after 4 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
      <>
        <Head>
          <title>Matrix - jackfredericksen.eth</title>
          <meta name="description" content="Interactive 3D portfolio showcasing Web3 projects and blockchain development skills" />
        </Head>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className="w-16 h-16 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-cyan-400 text-lg font-medium">Preparing Matrix...</p>
          </div>
        </div>
      </>
    )
  }

  if (!isWebGLSupported) {
    return (
      <>
        <Head>
          <title>Matrix - jackfredericksen.eth</title>
          <meta name="description" content="Interactive 3D portfolio showcasing Web3 projects and blockchain development skills" />
        </Head>
        <div className="min-h-screen bg-black flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <motion.div
              className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5C2.962 18.333 3.924 20 5.464 20z" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-4">WebGL Not Supported</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your browser doesn't support WebGL, which is required for the 3D Matrix experience. 
              Please try updating your browser or enabling hardware acceleration.
            </p>
            <div className="space-y-3">
              <a
                href="/"
                className="block w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 py-3 px-6 rounded-lg transition-colors duration-300 border border-cyan-500/30"
              >
                Return to Genesis
              </a>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Matrix - jackfredericksen.eth</title>
        <meta name="description" content="Interactive 3D portfolio showcasing Web3 projects and blockchain development skills built with Next.js and Three.js" />
        <meta name="keywords" content="Web3, blockchain, 3D portfolio, Three.js, React, jackfredericksen" />
      </Head>
      
      <div className="relative">
        {/* Full-screen 3D experience with real GitHub integration */}
        <ThreePortfolio
          username="jackfredericksen"
          skills={techSkills}
          moodboardItems={visionItems}
          className="fixed inset-0 z-0"
        />

        {/* Welcome overlay (appears briefly on load) */}
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none"
            onAnimationComplete={() => {
              setTimeout(() => setShowWelcome(false), 3000)
            }}
          >
            <div className="text-center max-w-md px-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center"
              >
                <span className="text-black font-bold text-2xl">J</span>
              </motion.div>
              
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-4"
              >
                Welcome to the Matrix
              </motion.h1>
              
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="text-gray-300 text-lg leading-relaxed mb-4"
              >
                Navigate through my 3D portfolio of real GitHub projects, skills, and vision
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 0.5 }}
                className="text-sm text-gray-400"
              >
                <p>• Drag to rotate • Click to explore • Tab to switch modes</p>
                <p className="mt-1 text-xs">Projects are loaded live from GitHub API</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Matrix-style overlay effects */}
        <div className="fixed inset-0 pointer-events-none z-10">
          {/* Scan lines effect */}
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #64ffda 2px, #64ffda 4px)'
            }}
            animate={{ y: [-100, typeof window !== 'undefined' ? window.innerHeight : 800] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Corner elements */}
          <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-cyan-400/50"></div>
          <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-cyan-400/50"></div>
          <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-cyan-400/50"></div>
          <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-cyan-400/50"></div>
        </div>
      </div>
    </>
  )
}