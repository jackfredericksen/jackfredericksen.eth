import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import GitHubProjects from '../components/GitHubProjects'
import GlassEffects, { glassClasses } from '../components/GlassEffects'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  
  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <GlassEffects />
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Enhanced Animated Grid Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.08)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(6,182,212,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.15)_0%,transparent_50%),radial-gradient(circle_at_40%_40%,rgba(236,72,153,0.1)_0%,transparent_50%)]" />
        </div>

        <div className="relative z-10">
          {/* Hero Section with Glass Effects */}
          <section className="min-h-screen flex items-center justify-center px-4">
            <motion.div 
              style={{ y: y1, opacity }} 
              className="text-center max-w-4xl mx-auto parallax-layer parallax-slow"
            >
              {/* Glass Container for Hero Content */}
              <div className={`${glassClasses.glassPanel} p-12 mb-8`}>
                {/* Animated Avatar with Glass Effect */}
                <motion.div
                  className="relative mx-auto mb-8"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <div className="w-32 h-32 mx-auto relative">
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 ${glassClasses.glassRefraction} animate-spin-slow`} />
                    <div className="absolute inset-2 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        JF
                      </span>
                    </div>
                  </div>
                  
                  {/* Enhanced Floating Particles */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${i % 3 === 0 ? 'rgba(6,182,212,0.8)' : i % 3 === 1 ? 'rgba(139,92,246,0.8)' : 'rgba(236,72,153,0.8)'} 0%, transparent 70%)`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        backdropFilter: 'blur(1px)'
                      }}
                      animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                      }}
                    />
                  ))}
                </motion.div>

                {/* Enhanced Main Title with Glass Text Effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="parallax-layer parallax-medium"
                >
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 relative">
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent filter drop-shadow-lg">
                      Jack Fredericksen
                    </span>
                    {/* Glass reflection effect */}
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent bg-clip-text text-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut"
                      }}
                    >
                      Jack Fredericksen
                    </motion.span>
                  </h1>
                  
                  <motion.h2 
                    className="text-2xl md:text-3xl text-gray-300 mb-8 parallax-layer parallax-fast"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    Web3 Architect & Blockchain Developer
                  </motion.h2>
                </motion.div>

                {/* Enhanced Typewriter Effect */}
                <motion.div
                  className="h-12 mb-12 parallax-layer parallax-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <TypewriterText 
                    texts={[
                      "Building the decentralized future",
                      "Crafting immutable experiences", 
                      "Deploying trustless protocols",
                      "jackfredericksen.eth"
                    ]}
                  />
                </motion.div>

                {/* Glass Social Links */}
                <motion.div
                  className="flex justify-center space-x-6 mb-8"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  {[
                    { href: 'https://github.com/jackfredericksen', icon: 'github', label: 'GitHub' },
                    { href: 'https://twitter.com/', icon: 'twitter', label: 'Twitter' },
                    { href: 'mailto:jackfredericksen.eth@ethermail.io', icon: 'email', label: 'Email' },
                  ].map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-14 h-14 rounded-full ${glassClasses.morphCard} flex items-center justify-center group interactive`}
                      whileHover={{ scale: 1.1, y: -8 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.2 + index * 0.1 }}
                    >
                      <SocialIcon type={social.icon} />
                      
                      {/* Enhanced Tooltip with Glass Effect */}
                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                        <div className={`${glassClasses.glass} px-3 py-2 text-xs whitespace-nowrap`}>
                          {social.label}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-white/10 border-r border-b border-white/10" />
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </motion.div>

                {/* Enhanced Contact Info with Glass Effect */}
                <motion.div
                  className="text-gray-400 text-sm parallax-layer parallax-slow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                >
                  <p className="mb-2">Available for Web3 consulting & development projects</p>
                  <motion.a
                    href="mailto:jack@jackfredericksen.eth"
                    className={`${glassClasses.liquidButton} text-cyan-400 hover:text-cyan-300 transition-colors px-4 py-2 rounded-full inline-block interactive`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    jackfredericksen.eth@ethermail.io
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Scroll Indicator with Glass Effect */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 parallax-layer parallax-fast"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className={`w-8 h-12 ${glassClasses.glass} rounded-full p-2`}>
                <motion.div
                  className="w-2 h-3 bg-gradient-to-b from-cyan-400 to-purple-600 rounded-full mx-auto"
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </section>

          {/* Enhanced Projects Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center mb-16 parallax-layer parallax-medium"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className={`${glassClasses.glassPanel} p-8 inline-block`}>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                      Latest Projects
                    </span>
                  </h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Open-source projects and contributions from my GitHub repositories
                  </p>
                </div>
              </motion.div>

              <div className="parallax-layer parallax-slow">
                <GitHubProjects username="jackfredericksen" />
              </div>
            </div>
          </section>

          {/* Enhanced Skills & Technologies */}
          <section className="py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="parallax-layer parallax-medium"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className={`${glassClasses.glassPanel} p-8 mb-16 text-center`}>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    Technology Stack
                  </h2>
                </div>
              </motion.div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 parallax-layer parallax-fast">
                {[
                  { name: 'Solidity', level: 95, color: 'from-blue-400 to-blue-600' },
                  { name: 'React', level: 98, color: 'from-cyan-400 to-cyan-600' },
                  { name: 'Node.js', level: 92, color: 'from-green-400 to-green-600' },
                  { name: 'Web3.js', level: 94, color: 'from-purple-400 to-purple-600' },
                  { name: 'Next.js', level: 96, color: 'from-gray-400 to-gray-600' },
                  { name: 'TypeScript', level: 97, color: 'from-blue-500 to-blue-700' },
                  { name: 'IPFS', level: 88, color: 'from-indigo-400 to-indigo-600' },
                  { name: 'Ethereum', level: 92, color: 'from-yellow-400 to-yellow-600' },
                ].map((skill, index) => (
                  <SkillCard key={skill.name} skill={skill} index={index} />
                ))}
              </div>
            </div>
          </section>

          {/* Enhanced Footer */}
          <footer className="py-12 border-t border-white/10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                className="parallax-layer parallax-slow"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className={`${glassClasses.neomorphic} p-8`}>
                  <p className="text-gray-400 mb-4">
                    Built with Next.js • Hosted on IPFS • Powered by Web3
                  </p>
                  <p className="text-sm text-gray-500">
                    © 2024 Jack Fredericksen. Open source on GitHub.
                  </p>
                </div>
              </motion.div>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}

// Enhanced Typewriter Component with Glass Effects
function TypewriterText({ texts }: { texts: string[] }) {
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [textIndex, setTextIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < texts[textIndex].length) {
        setCurrentText(texts[textIndex].slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      } else {
        setTimeout(() => {
          setCurrentIndex(0)
          setTextIndex((textIndex + 1) % texts.length)
        }, 2000)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [currentIndex, textIndex, texts])

  return (
    <div className={`text-lg md:text-xl font-mono text-cyan-300 ${glassClasses.glass} px-6 py-3 rounded-full inline-block`}>
      {currentText}
      <motion.span
        className="inline-block w-3 h-6 bg-gradient-to-b from-cyan-400 to-purple-600 ml-1 rounded-sm"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </div>
  )
}

// Enhanced Social Icon Component
function SocialIcon({ type }: { type: string }) {
  const iconClass = "w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors filter drop-shadow-lg"
  
  switch (type) {
    case 'github':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      )
    case 'twitter':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    case 'email':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    default:
      return null
  }
}

// Enhanced Skill Card Component with Glass Effects
function SkillCard({ skill, index }: { skill: any, index: number }) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10, rotateY: 10 }}
    >
      <div className={`${glassClasses.morphCard} p-6 interactive`}>
        <h3 className="font-semibold text-white mb-4 filter drop-shadow-sm">{skill.name}</h3>
        <div className={`w-full ${glassClasses.neomorphic} rounded-full h-3 mb-2 p-1`}>
          <motion.div
            className={`h-1 rounded-full bg-gradient-to-r ${skill.color} shadow-lg`}
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: index * 0.1 }}
          />
        </div>
        <span className="text-sm text-gray-400 filter drop-shadow-sm">{skill.level}%</span>
      </div>
    </motion.div>
  )
}