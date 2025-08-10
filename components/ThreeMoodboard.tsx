// components/ThreeMoodboard.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

interface MoodboardItem {
  id: string
  type: 'image' | 'text' | 'link' | 'quote'
  content: string
  title?: string
  author?: string
  url?: string
  color?: string
  size: 'small' | 'medium' | 'large'
}

interface ThreeMoodboardProps {
  items: MoodboardItem[]
  className?: string
}

const ThreeMoodboard: React.FC<ThreeMoodboardProps> = ({
  items,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const frameRef = useRef<number>()
  
  const [selectedItem, setSelectedItem] = useState<MoodboardItem | null>(null)
  const [isInteracting, setIsInteracting] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [cameraMode, setCameraMode] = useState<'orbit' | 'free'>('free')
  
  const itemMeshes = useRef<THREE.Group[]>([])
  const particleSystem = useRef<THREE.Points>()
  
  const mouse = useRef(new THREE.Vector2())
  const raycaster = useRef(new THREE.Raycaster())
  const isMouseDown = useRef(false)
  const keys = useRef({ w: false, s: false, a: false, d: false, shift: false, space: false })
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())
  const previousMousePosition = useRef({ x: 0, y: 0 })

  // Filter items
  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.type === filter)

  // Get color from the Tailwind color string or hex
  const getColorFromString = (colorString?: string): number => {
    const colorMap: Record<string, number> = {
      'bg-blue-100 dark:bg-blue-900/30': 0x3b82f6,
      'bg-purple-100 dark:bg-purple-900/30': 0x8b5cf6,
      'bg-green-100 dark:bg-green-900/30': 0x10b981,
      'bg-yellow-100 dark:bg-yellow-900/30': 0xf59e0b,
      'bg-pink-100 dark:bg-pink-900/30': 0xec4899,
      'bg-indigo-100 dark:bg-indigo-900/30': 0x6366f1,
      'bg-teal-100 dark:bg-teal-900/30': 0x14b8a6,
      'bg-orange-100 dark:bg-orange-900/30': 0xf97316,
      'bg-red-100 dark:bg-red-900/30': 0xef4444,
      'bg-gray-100 dark:bg-gray-800': 0x6b7280
    }

    if (colorString?.startsWith('#')) {
      return parseInt(colorString.replace('#', ''), 16)
    }
    
    return colorMap[colorString || ''] || 0x64ffda
  }

  // Get size multiplier
  const getSizeMultiplier = (size: string): number => {
    switch (size) {
      case 'small': return 0.8
      case 'medium': return 1.0
      case 'large': return 1.4
      default: return 1.0
    }
  }

  // Position items in 3D space
  const getItemPosition = (index: number, total: number): [number, number, number] => {
    const radius = 15
    const height = 20
    
    // Create a more organic, scattered layout
    const phi = Math.acos(-1 + (2 * index) / total)
    const theta = Math.sqrt(total * Math.PI) * phi
    
    const x = radius * Math.cos(theta) * Math.sin(phi) + (Math.random() - 0.5) * 8
    const y = (Math.random() - 0.5) * height
    const z = radius * Math.sin(theta) * Math.sin(phi) + (Math.random() - 0.5) * 8
    
    return [x, y, z]
  }

  // Initialize Three.js scene
  const initScene = useCallback(() => {
    if (!mountRef.current) return

    // Clean up existing scene
    if (rendererRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
      mountRef.current.removeChild(rendererRef.current.domElement)
    }

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x000000, 20, 100)
    sceneRef.current = scene

    // Camera setup for free movement
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 20)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer

    mountRef.current.appendChild(renderer.domElement)

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(20, 20, 10)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Multiple colored lights for ambiance
    const lights = [
      { color: 0x64ffda, position: [-20, 10, 20], intensity: 0.4 },
      { color: 0xff6b6b, position: [20, -10, -20], intensity: 0.3 },
      { color: 0x4ecdc4, position: [0, 20, 0], intensity: 0.3 },
      { color: 0x9d4edd, position: [-10, -20, 10], intensity: 0.2 }
    ]

    lights.forEach(light => {
      const pointLight = new THREE.PointLight(light.color, light.intensity, 50)
      pointLight.position.set(...light.position)
      scene.add(pointLight)
    })

    createParticleSystem()
    createMoodboardItems()
    animate()
  }, [])

  // Create floating particle system
  const createParticleSystem = () => {
    if (!sceneRef.current) return

    const particleCount = 1200
    const particles = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 120
      positions[i + 1] = (Math.random() - 0.5) * 80
      positions[i + 2] = (Math.random() - 0.5) * 120

      const color = new THREE.Color()
      color.setHSL(Math.random() * 0.4 + 0.5, 0.6, 0.4)
      colors[i] = color.r
      colors[i + 1] = color.g
      colors[i + 2] = color.b
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true
    })

    const particleSystemMesh = new THREE.Points(particles, particleMaterial)
    sceneRef.current.add(particleSystemMesh)
    particleSystem.current = particleSystemMesh
  }

  // Create 3D moodboard items
  const createMoodboardItems = useCallback(() => {
    if (!sceneRef.current) return

    // Clear existing items
    itemMeshes.current.forEach(mesh => {
      sceneRef.current?.remove(mesh)
    })
    itemMeshes.current = []
    
    filteredItems.forEach((item, index) => {
      const group = new THREE.Group()
      group.userData = { type: 'moodboard', data: item }

      const position = getItemPosition(index, filteredItems.length)
      const color = getColorFromString(item.color)
      const sizeMultiplier = getSizeMultiplier(item.size)
      
      // Create different shapes based on type
      let geometry: THREE.BufferGeometry
      let material: THREE.Material

      switch (item.type) {
        case 'quote':
          // Speech bubble shape for quotes
          geometry = new THREE.SphereGeometry(1.2 * sizeMultiplier, 16, 16)
          material = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.8,
            emissive: new THREE.Color(color).multiplyScalar(0.1)
          })
          break
          
        case 'link':
          // Cube with rounded edges for links
          geometry = new THREE.BoxGeometry(
            1.8 * sizeMultiplier, 
            1.2 * sizeMultiplier, 
            0.3 * sizeMultiplier
          )
          material = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.85
          })
          break
          
        case 'image':
          // Plane for images
          geometry = new THREE.PlaneGeometry(
            2 * sizeMultiplier, 
            1.5 * sizeMultiplier
          )
          material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.9
          })
          break
          
        default: // text
          // Cylinder for text notes
          geometry = new THREE.CylinderGeometry(
            0.8 * sizeMultiplier, 
            0.8 * sizeMultiplier, 
            1.5 * sizeMultiplier, 
            8
          )
          material = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
          })
      }

      const mesh = new THREE.Mesh(geometry, material)
      mesh.castShadow = true
      mesh.receiveShadow = true
      group.add(mesh)

      // Add wireframe overlay
      const wireframe = new THREE.WireframeGeometry(geometry)
      const line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2
      }))
      group.add(line)

      // Create text label
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')!
      canvas.width = 512
      canvas.height = 256
      
      // Background
      context.fillStyle = 'rgba(0, 0, 0, 0.8)'
      context.fillRect(0, 0, canvas.width, canvas.height)
      
      // Title
      context.fillStyle = '#ffffff'
      context.font = 'bold 28px Arial'
      context.textAlign = 'center'
      const title = item.title || item.type.charAt(0).toUpperCase() + item.type.slice(1)
      context.fillText(title.substring(0, 25), 256, 80)
      
      // Content preview
      context.fillStyle = '#cccccc'
      context.font = '18px Arial'
      const preview = item.content.substring(0, 60) + (item.content.length > 60 ? '...' : '')
      
      // Word wrap
      const words = preview.split(' ')
      let line = ''
      let y = 120
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' '
        if (context.measureText(testLine).width > 450 && n > 0) {
          context.fillText(line, 256, y)
          line = words[n] + ' '
          y += 25
          if (y > 200) break
        } else {
          line = testLine
        }
      }
      context.fillText(line, 256, y)
      
      // Author (for quotes)
      if (item.type === 'quote' && item.author) {
        context.fillStyle = '#64ffda'
        context.font = 'italic 16px Arial'
        context.fillText(`— ${item.author}`, 256, y + 30)
      }

      const texture = new THREE.CanvasTexture(canvas)
      const labelMaterial = new THREE.SpriteMaterial({ map: texture })
      const label = new THREE.Sprite(labelMaterial)
      label.scale.set(4, 2, 1)
      label.position.set(0, 2.5 * sizeMultiplier, 0)
      group.add(label)

      // Position the group
      group.position.set(...position)
      
      // Add floating animation offset
      group.userData.floatOffset = Math.random() * Math.PI * 2
      group.userData.floatSpeed = 0.5 + Math.random() * 0.5
      group.userData.originalY = position[1]

      sceneRef.current?.add(group)
      itemMeshes.current.push(group)
    })
  }, [filteredItems])

  // Free camera movement
  const updateCamera = useCallback(() => {
    if (!cameraRef.current) return

    const camera = cameraRef.current
    const speed = keys.current.shift ? 0.5 : 0.2

    // Forward/backward
    if (keys.current.w) {
      camera.getWorldDirection(direction.current)
      camera.position.addScaledVector(direction.current, speed)
    }
    if (keys.current.s) {
      camera.getWorldDirection(direction.current)
      camera.position.addScaledVector(direction.current, -speed)
    }

    // Left/right strafe
    if (keys.current.a) {
      camera.getWorldDirection(direction.current)
      const right = new THREE.Vector3().crossVectors(direction.current, camera.up)
      camera.position.addScaledVector(right, -speed)
    }
    if (keys.current.d) {
      camera.getWorldDirection(direction.current)
      const right = new THREE.Vector3().crossVectors(direction.current, camera.up)
      camera.position.addScaledVector(right, speed)
    }

    // Up/down
    if (keys.current.space) {
      camera.position.y += speed
    }
    if (keys.current.shift) {
      camera.position.y -= speed * 0.5
    }
  }, [])

  // Mouse look for free camera
  const onMouseMove = useCallback((event: MouseEvent) => {
    if (!mountRef.current || !cameraRef.current) return

    const rect = mountRef.current.getBoundingClientRect()
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    // Free camera mouse look
    if (cameraMode === 'free' && isMouseDown.current) {
      const deltaX = event.clientX - previousMousePosition.current.x
      const deltaY = event.clientY - previousMousePosition.current.y

      // Rotate camera based on mouse movement
      const euler = new THREE.Euler(0, 0, 0, 'YXZ')
      euler.setFromQuaternion(cameraRef.current.quaternion)
      euler.y -= deltaX * 0.002
      euler.x -= deltaY * 0.002
      euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x))
      cameraRef.current.quaternion.setFromEuler(euler)
    }

    previousMousePosition.current = { x: event.clientX, y: event.clientY }
  }, [cameraMode])

  const onMouseDown = useCallback(() => {
    isMouseDown.current = true
    setIsInteracting(true)
  }, [])

  const onMouseUp = useCallback(() => {
    isMouseDown.current = false
    setIsInteracting(false)
  }, [])

  // Handle clicks for selection
  const onClick = useCallback(() => {
    if (!cameraRef.current || !sceneRef.current || !raycaster.current) return

    raycaster.current.setFromCamera(mouse.current, cameraRef.current)
    
    const intersects = raycaster.current.intersectObjects(
      itemMeshes.current.map(group => group.children).flat()
    )

    if (intersects.length > 0) {
      const object = intersects[0].object
      let parent = object.parent
      while (parent && !parent.userData.data) {
        parent = parent.parent
      }
      if (parent?.userData.data) {
        setSelectedItem(parent.userData.data)
      }
    } else {
      setSelectedItem(null)
    }
  }, [])

  // Keyboard controls
  const onKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case 'KeyW': keys.current.w = true; break
      case 'KeyS': keys.current.s = true; break
      case 'KeyA': keys.current.a = true; break
      case 'KeyD': keys.current.d = true; break
      case 'Space': keys.current.space = true; event.preventDefault(); break
      case 'ShiftLeft': keys.current.shift = true; break
      case 'KeyC': 
        setCameraMode(prev => prev === 'free' ? 'orbit' : 'free')
        break
    }
  }, [])

  const onKeyUp = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case 'KeyW': keys.current.w = false; break
      case 'KeyS': keys.current.s = false; break
      case 'KeyA': keys.current.a = false; break
      case 'KeyD': keys.current.d = false; break
      case 'Space': keys.current.space = false; break
      case 'ShiftLeft': keys.current.shift = false; break
    }
  }, [])

  // Animation loop
  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return

    const time = Date.now() * 0.001

    // Update camera movement
    updateCamera()

    // Animate moodboard items
    itemMeshes.current.forEach((group, index) => {
      // Floating animation
      const floatOffset = group.userData.floatOffset
      const floatSpeed = group.userData.floatSpeed
      const originalY = group.userData.originalY
      
      group.position.y = originalY + Math.sin(time * floatSpeed + floatOffset) * 0.5

      // Gentle rotation
      const mesh = group.children[0]
      if (mesh) {
        mesh.rotation.x = Math.sin(time * 0.3 + index) * 0.1
        mesh.rotation.y = time * 0.2 + index
        mesh.rotation.z = Math.cos(time * 0.4 + index) * 0.05
      }

      // Scale pulsing for selected item
      if (selectedItem && group.userData.data.id === selectedItem.id) {
        const scale = 1 + Math.sin(time * 4) * 0.1
        group.scale.setScalar(scale)
      } else {
        group.scale.setScalar(1)
      }
    })

    // Animate particles
    if (particleSystem.current) {
      const positions = particleSystem.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time * 0.5 + positions[i] * 0.02) * 0.002
        positions[i] += Math.cos(time * 0.3 + positions[i + 2] * 0.02) * 0.001
      }
      particleSystem.current.geometry.attributes.position.needsUpdate = true
      particleSystem.current.rotation.y = time * 0.02
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current)
    frameRef.current = requestAnimationFrame(animate)
  }, [updateCamera, selectedItem])

  // Handle window resize
  const handleResize = useCallback(() => {
    if (!mountRef.current || !cameraRef.current || !rendererRef.current) return

    const width = mountRef.current.clientWidth
    const height = mountRef.current.clientHeight

    cameraRef.current.aspect = width / height
    cameraRef.current.updateProjectionMatrix()
    rendererRef.current.setSize(width, height)
  }, [])

  // Setup and cleanup
  useEffect(() => {
    initScene()
  }, [initScene])

  useEffect(() => {
    createMoodboardItems()
  }, [filteredItems, createMoodboardItems])

  useEffect(() => {
    if (!mountRef.current) return

    const currentMount = mountRef.current

    window.addEventListener('resize', handleResize)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    currentMount.addEventListener('mousemove', onMouseMove)
    currentMount.addEventListener('mousedown', onMouseDown)
    currentMount.addEventListener('mouseup', onMouseUp)
    currentMount.addEventListener('click', onClick)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      currentMount?.removeEventListener('mousemove', onMouseMove)
      currentMount?.removeEventListener('mousedown', onMouseDown)
      currentMount?.removeEventListener('mouseup', onMouseUp)
      currentMount?.removeEventListener('click', onClick)
      
      if (rendererRef.current && currentMount && currentMount.contains(rendererRef.current.domElement)) {
        currentMount.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
    }
  }, [handleResize, onKeyDown, onKeyUp, onMouseMove, onMouseDown, onMouseUp, onClick])

  return (
    <div className={`relative w-full h-screen bg-black ${className}`}>
      {/* 3D Canvas */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-crosshair"
        style={{ background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)' }}
      />
      
      {/* Filter Controls */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex space-x-3 bg-black/30 backdrop-blur-md rounded-full p-2 border border-gray-700/50">
          {[
            { key: 'all', label: 'All', icon: '🎨' },
            { key: 'text', label: 'Ideas', icon: '📝' },
            { key: 'quote', label: 'Quotes', icon: '💭' },
            { key: 'link', label: 'Links', icon: '🔗' },
            { key: 'image', label: 'Images', icon: '🖼️' }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === filterOption.key
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {filterOption.icon} {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Camera Mode Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={() => setCameraMode(prev => prev === 'free' ? 'orbit' : 'free')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-black/30 backdrop-blur-md border border-gray-700/50 ${
            cameraMode === 'free' 
              ? 'text-cyan-400 border-cyan-500/40' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          📹 {cameraMode === 'free' ? 'Free Cam' : 'Orbit Cam'}
        </button>
      </div>

      {/* Selected Item Panel */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute bottom-6 left-6 max-w-md bg-black/80 backdrop-blur-md rounded-lg p-6 border border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-cyan-400">
                {selectedItem.title || selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)}
              </h3>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
                {selectedItem.type}
              </span>
            </div>
            
            <div className="text-gray-300 text-sm mb-4 leading-relaxed max-h-32 overflow-y-auto">
              {selectedItem.type === 'quote' ? (
                <blockquote className="italic">
                  "{selectedItem.content}"
                  {selectedItem.author && (
                    <footer className="text-cyan-400 mt-2">— {selectedItem.author}</footer>
                  )}
                </blockquote>
              ) : (
                <p>{selectedItem.content}</p>
              )}
            </div>

            {selectedItem.url && (
              <a
                href={selectedItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 hover:text-cyan-300 text-sm rounded border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                Open Link
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Instructions */}
      <div className="absolute bottom-6 right-6 bg-black/30 backdrop-blur-md rounded-lg p-4 border border-gray-700/50 max-w-xs">
        <h4 className="text-cyan-400 font-semibold mb-2">Controls</h4>
        {cameraMode === 'free' ? (
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• WASD: Move around</li>
            <li>• Mouse: Look around (hold click)</li>
            <li>• Space: Move up</li>
            <li>• Shift: Move down</li>
            <li>• Click: Select items</li>
            <li>• C: Toggle camera mode</li>
          </ul>
        ) : (
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Drag: Rotate view</li>
            <li>• Click: Select items</li>
            <li>• C: Toggle camera mode</li>
          </ul>
        )}
      </div>

      {/* Stats */}
      <div className="absolute top-20 left-6 bg-black/30 backdrop-blur-md rounded-lg p-3 border border-gray-700/50">
        <div className="text-sm text-gray-400">
          <div className="text-cyan-400 font-medium">{filteredItems.length}</div>
          <div>{filter === 'all' ? 'Total Items' : `${filter} items`}</div>
        </div>
      </div>

      {/* Performance indicator */}
      {isInteracting && (
        <div className="absolute top-20 right-6 bg-black/50 backdrop-blur-md rounded-lg p-2 border border-gray-700/50">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-300 text-xs">Interactive</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ThreeMoodboard