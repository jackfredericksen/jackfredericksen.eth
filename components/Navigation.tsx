import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

const AdminInterface = dynamic(() => import('./AdminInterface'), { ssr: false })

const navItems = [
  { href: '/', label: 'Genesis' },
  { href: '/matrix', label: 'Matrix' },
  { href: '/moodboard', label: 'Vision' },
  { href: '/blog', label: 'Logs' },
]

export default function Navigation() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
    setIsAdmin(localStorage.getItem('adminMode') === 'true')
  }, [])

  const isActive = (href: string) => {
    if (href === '/' && router.pathname === '/') return true
    if (href !== '/' && router.pathname.startsWith(href)) return true
    return false
  }

  const handleAdminClick = () => {
    setClickCount(prev => prev + 1)
    if (clickTimer) clearTimeout(clickTimer)
    const timer = setTimeout(() => setClickCount(0), 600)
    setClickTimer(timer)
    
    if (clickCount >= 2) {
      toggleAdminMode()
      setClickCount(0)
      if (clickTimer) clearTimeout(clickTimer)
    }
  }

  const toggleAdminMode = () => {
    const newAdminMode = !isAdmin
    setIsAdmin(newAdminMode)
    setShowAdmin(newAdminMode)
    localStorage.setItem('adminMode', newAdminMode.toString())
  }

  if (!mounted) return null

  return (
    <>
      {/* Clean Floating Sidebar with Always Visible Text */}
      <motion.nav
        className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
      >
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
          <div className="flex flex-col space-y-2">
            
            {/* Logo/Avatar */}
            <Link href="/" className="group mb-4 flex justify-center">
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <span className="text-black font-bold text-lg">J</span>
              </motion.div>
            </Link>

            {/* Navigation Items with Always Visible Text */}
            <div className="space-y-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                >
                  <Link href={item.href}>
                    <motion.div
                      className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
                        isActive(item.href)
                          ? 'bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Indicator Dot */}
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        isActive(item.href)
                          ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                          : 'bg-gray-500'
                      }`} />
                      
                      {/* Label */}
                      <span className="text-sm font-medium tracking-wide">
                        {item.label}
                      </span>

                      {/* Active indicator line */}
                      {isActive(item.href) && (
                        <motion.div
                          className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"
                          layoutId="activeIndicator"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* ENS Domain (Admin Trigger) */}
            <motion.div
              className="mt-6 cursor-pointer select-none"
              onClick={handleAdminClick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              <motion.div 
                className={`px-4 py-3 rounded-xl transition-all duration-300 ${
                  isAdmin 
                    ? 'bg-red-500/20 border border-red-500/40 text-red-400' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-wider mb-1 opacity-60">
                    ENS DOMAIN
                  </div>
                  <div className="text-sm font-mono font-medium">
                    jackfredericksen.eth
                  </div>
                  {isAdmin && (
                    <motion.div 
                      className="text-xs mt-1 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      🔧 ADMIN MODE
                    </motion.div>
                  )}
                  {clickCount > 0 && !isAdmin && (
                    <div className="text-yellow-400 text-xs mt-1">
                      {'●'.repeat(clickCount)} Click {3 - clickCount} more
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 lg:hidden"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-black/40 backdrop-blur-xl border-b border-white/10">
          <div className="flex justify-between items-center px-4 py-4">
            {/* Mobile Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer select-none"
              onClick={handleAdminClick}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <span className="text-black font-bold text-sm">J</span>
              </div>
              <div>
                <span className="text-white font-medium">jackfredericksen.eth</span>
                {isAdmin && <div className="text-red-400 text-xs">🔧 ADMIN MODE</div>}
                {clickCount > 0 && !isAdmin && (
                  <div className="text-yellow-400 text-xs">
                    {'●'.repeat(clickCount)} ({3 - clickCount} more)
                  </div>
                )}
              </div>
            </div>

            {/* Hamburger Menu */}
            <motion.button
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-5 h-5 relative">
                <motion.span
                  className="absolute w-5 h-0.5 bg-white rounded-full"
                  animate={{
                    rotate: isOpen ? 45 : 0,
                    y: isOpen ? 0 : -6,
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute w-5 h-0.5 bg-white rounded-full top-1/2 -translate-y-1/2"
                  animate={{ opacity: isOpen ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute w-5 h-0.5 bg-white rounded-full"
                  animate={{
                    rotate: isOpen ? -45 : 0,
                    y: isOpen ? 0 : 6,
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-4 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        isActive(item.href) ? 'bg-cyan-400' : 'bg-gray-500'
                      }`} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Connection Status */}
      <motion.div
        className="fixed bottom-6 left-6 z-40 hidden lg:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full border border-green-500/30">
          <motion.div
            className="w-2 h-2 bg-green-400 rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs text-green-400 font-mono">IPFS CONNECTED</span>
        </div>
      </motion.div>

      {/* Admin Panel Button */}
      {isAdmin && (
        <motion.div
          className="fixed top-4 right-4 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center space-x-3 bg-red-500/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-500/40">
            <button
              onClick={() => setShowAdmin(true)}
              className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
            >
              🔧 OPEN ADMIN PANEL
            </button>
            <button
              onClick={toggleAdminMode}
              className="text-red-400 hover:text-red-300 p-1"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* Admin Interface */}
      <AnimatePresence>
        {showAdmin && (
          <AdminInterface 
            isVisible={showAdmin} 
            onClose={() => setShowAdmin(false)} 
          />
        )}
      </AnimatePresence>
    </>
  )
}