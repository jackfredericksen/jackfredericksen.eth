import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function GlassEffects() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      // Update CSS custom properties for cursor-based effects
      document.documentElement.style.setProperty('--cursor-x', `${(e.clientX / window.innerWidth) * 100}%`)
      document.documentElement.style.setProperty('--cursor-y', `${(e.clientY / window.innerHeight) * 100}%`)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [role="button"], .interactive')) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    // Add parallax effect to elements
    const handleParallax = (e: MouseEvent) => {
      const parallaxElements = document.querySelectorAll('.parallax-layer')
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      parallaxElements.forEach((element) => {
        const rect = element.getBoundingClientRect()
        const elementCenterX = rect.left + rect.width / 2
        const elementCenterY = rect.top + rect.height / 2
        
        const deltaX = (e.clientX - elementCenterX) * 0.02
        const deltaY = (e.clientY - elementCenterY) * 0.02
        
        if (element.classList.contains('parallax-slow')) {
          (element as HTMLElement).style.transform = `translate3d(${deltaX * 0.5}px, ${deltaY * 0.5}px, 0) rotateX(${deltaY * 0.05}deg) rotateY(${deltaX * 0.05}deg)`
        } else if (element.classList.contains('parallax-medium')) {
          (element as HTMLElement).style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) rotateX(${deltaY * 0.1}deg) rotateY(${deltaX * 0.1}deg)`
        } else if (element.classList.contains('parallax-fast')) {
          (element as HTMLElement).style.transform = `translate3d(${deltaX * 1.5}px, ${deltaY * 1.5}px, 0) rotateX(${deltaY * 0.15}deg) rotateY(${deltaX * 0.15}deg)`
        }
      })
    }

    window.addEventListener('mousemove', updateMousePosition)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mousemove', handleParallax)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mousemove', handleParallax)
    }
  }, [])

  return (
    <>
      {/* Custom Cursor */}
      <motion.div
        className={`custom-cursor ${isHovering ? 'hover' : ''}`}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28
        }}
      />

      {/* Depth of Field Background */}
      <div className="dof-background">
        <div className="dof-layer" />
        <div className="dof-layer" />
        <div className="dof-layer" />
      </div>

      {/* Floating Glass Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, rgba(${i % 2 === 0 ? '6,182,212' : '139,92,246'}, 0.1) 0%, transparent 70%)`,
              backdropFilter: 'blur(2px)',
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </>
  )
}

// Utility function to add glass effect classes to components
export const glassClasses = {
  // Basic glass effect
  glass: "glass",
  
  // Dynamic glass with hover effects
  glassDynamic: "glass-dynamic breathe parallax-layer parallax-medium",
  
  // Neomorphic style
  neomorphic: "neomorphic dynamic-shadow parallax-layer parallax-slow",
  
  // Interactive panel
  glassPanel: "glass-panel morph-card breathe parallax-layer parallax-fast",
  
  // Button with liquid effect
  liquidButton: "liquid-button interactive",
  
  // Card that morphs on hover
  morphCard: "morph-card glass-dynamic dynamic-shadow breathe",
  
  // Glass with refraction
  glassRefraction: "glass glass-refraction parallax-layer parallax-medium",
}

// Higher-order component to add glass effects
export function withGlassEffect<T extends {}>(
  Component: React.ComponentType<T>,
  effectType: keyof typeof glassClasses = 'glassDynamic'
) {
  return function GlassComponent(props: T) {
    return (
      <div className={glassClasses[effectType]}>
        <Component {...props} />
      </div>
    )
  }
}