// components/ThreePortfolio.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

interface GitHubRepo {
  id: number
  name: string
  description: string
  html_url: string
  homepage: string
  language: string
  languages_url: string
  stargazers_count: number
  forks_count: number
  topics: string[]
  created_at: string
  updated_at: string
  size: number
}

interface SkillData {
  name: string
  level: number
  color: number
  orbitRadius: number
  orbitSpeed: number
}

interface MoodboardItem {
  id: string
  type: 'image' | 'text' | 'color'
  content: string
  position: [number, number, number]
  size: [number, number]
}

interface ThreePortfolioProps {
  username?: string
  skills?: SkillData[]
  moodboardItems?: MoodboardItem[]
  className?: string
}

const defaultSkills: SkillData[] = [
  { name: 'Solidity', level: 95, color: 0x627eea, orbitRadius: 4, orbitSpeed: 0.01 },
  { name: 'React', level: 98, color: 0x61dafb, orbitRadius: 5, orbitSpeed: 0.008 },
  { name: 'Node.js', level: 92, color: 0x68a063, orbitRadius: 6, orbitSpeed: 0.006 },
  { name: 'Web3.js', level: 94, color: 0xf16822, orbitRadius: 4.5, orbitSpeed: 0.009 },
  { name: 'Next.js', level: 96, color: 0x000000, orbitRadius: 5.5, orbitSpeed: 0.007 },
  { name: 'TypeScript', level: 97, color: 0x3178c6, orbitRadius: 3.5, orbitSpeed: 0.012 },
  { name: 'IPFS', level: 88, color: 0x65c2cb, orbitRadius: 7, orbitSpeed: 0.005 },
  { name: 'Ethereum', level: 92, color: 0x627eea, orbitRadius: 6.5, orbitSpeed: 0.004 }
]

type SceneMode = 'projects' | 'skills' | 'moodboard'

const ThreePortfolio: React.FC<ThreePortfolioProps> = ({
  username = 'jackfredericksen',
  skills = defaultSkills,
  moodboardItems = [],
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const frameRef = useRef<number>()
  
  const [mode, setMode] = useState<SceneMode>('projects')
  const [selectedObject, setSelectedObject] = useState<any>(null)
  const [isInteracting, setIsInteracting] = useState(false)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const projectMeshes = useRef<THREE.Group[]>([])
  const skillMeshes = useRef<THREE.Group[]>([])
  const particleSystem = useRef<THREE.Points>()
  const moodboardMeshes = useRef<THREE.Group[]>([])
  
  const mouse = useRef(new THREE.Vector2())
  const raycaster = useRef(new THREE.Raycaster())
  const isMouseDown = useRef(false)
  const previousMousePosition = useRef({ x: 0, y: 0 })
  const rotationVelocity = useRef({ x: 0, y: 0 })
  const cameraDistance = useRef(15)

  const fetchRepositories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=20`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch repositories')
      }

      const allRepos: GitHubRepo[] = await response.json()
      
      const filteredRepos = allRepos
        .filter(repo => !repo.name.includes('.github.io') && repo.size > 0)
        .sort((a, b) => {
          const aScore = a.stargazers_count * 10 + (new Date(a.updated_at).getTime() / 1000000000)
          const bScore = b.stargazers_count * 10 + (new Date(b.updated_at).getTime() / 1000000000)
          return bScore - aScore
        })
        .slice(0, 8)

      setRepos(filteredRepos)
    } catch (error) {
      console.error('Failed to fetch repositories:', error)
      setError('Failed to load GitHub repositories')
    } finally {
      setLoading(false)
    }
  }, [username])

  const getLanguageColor = (language: string): number => {
    const colors: Record<string, number> = {
      'JavaScript': 0xf1e05a,
      'TypeScript': 0x2b7489,
      'Python': 0x3572A5,
      'Solidity': 0xAA6746,
      'Go': 0x00ADD8,
      'Rust': 0xdea584,
      'Java': 0xb07219,
      'C++': 0xf34b7d,
      'HTML': 0xe34c26,
      'CSS': 0x1572B6,
      'Vue': 0x4FC08D,
      'React': 0x61dafb,
      'Shell': 0x89e051
    }
    return colors[language] || 0x64ffda
  }

  const getRepoPosition = (index: number, total: number): [number, number, number] => {
    const radius = 8
    const height = 6
    const angle = (index / total) * Math.PI * 2
    const y = Math.sin(index * 0.5) * height - height / 2
    
    return [
      Math.cos(angle) * radius + (Math.random() - 0.5) * 2,
      y,
      Math.sin(angle) * radius + (Math.random() - 0.5) * 2
    ]
  }

  const initScene = useCallback(() => {
    if (!mountRef.current) return

    if (rendererRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
      mountRef.current.removeChild(rendererRef.current.domElement)
    }

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x000000, 10, 50)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, cameraDistance.current)
    cameraRef.current = camera

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

    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    const pointLight1 = new THREE.PointLight(0x64ffda, 0.5, 50)
    pointLight1.position.set(-10, 5, 10)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xff6b6b, 0.3, 30)
    pointLight2.position.set(10, -5, -10)
    scene.add(pointLight2)

    createParticleSystem()
    createSkillsScene()
    createMoodboardScene()
    animate()
  }, [])

  const createProjectsScene = useCallback(() => {
    if (!sceneRef.current || repos.length === 0) return

    projectMeshes.current.forEach(mesh => {
      sceneRef.current?.remove(mesh)
    })
    projectMeshes.current = []
    
    repos.forEach((repo, index) => {
      const group = new THREE.Group()
      group.userData = { type: 'project', data: repo }

      const position = getRepoPosition(index, repos.length)
      const color = getLanguageColor(repo.language)

      const size = Math.max(1.2, Math.min(2.5, 1.2 + (repo.stargazers_count * 0.1)))
      const geometry = new THREE.BoxGeometry(size, size, size)
      const material = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.8
      })
      const cube = new THREE.Mesh(geometry, material)
      cube.castShadow = true
      cube.receiveShadow = true

      const wireframe = new THREE.WireframeGeometry(geometry)
      const line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
      }))

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')!
      canvas.width = 512
      canvas.height = 128
      context.fillStyle = '#ffffff'
      context.font = 'bold 32px Arial'
      context.textAlign = 'center'
      context.fillText(repo.name.substring(0, 20), 256, 64)

      const texture = new THREE.CanvasTexture(canvas)
      const labelMaterial = new THREE.SpriteMaterial({ map: texture })
      const label = new THREE.Sprite(labelMaterial)
      label.scale.set(3, 0.75, 1)
      label.position.set(0, size + 1, 0)

      group.add(cube)
      group.add(line)
      group.add(label)
      group.position.set(...position)

      const elementCount = Math.min(4, Math.max(1, Math.floor(repo.stargazers_count / 2) + 1))
      for (let i = 0; i < elementCount; i++) {
        const smallGeometry = new THREE.SphereGeometry(0.08, 8, 6)
        const smallMaterial = new THREE.MeshPhongMaterial({ color: color })
        const sphere = new THREE.Mesh(smallGeometry, smallMaterial)
        
        const angle = (i / elementCount) * Math.PI * 2
        sphere.position.set(
          Math.cos(angle) * (size + 0.8),
          Math.sin(angle * 2) * 0.3,
          Math.sin(angle) * (size + 0.8)
        )
        sphere.userData = { orbit: true, angle, radius: size + 0.8 }
        group.add(sphere)
      }

      sceneRef.current?.add(group)
      projectMeshes.current.push(group)
    })
  }, [repos])

  const createParticleSystem = () => {
    if (!sceneRef.current) return

    const particleCount = 800
    const particles = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80
      positions[i + 1] = (Math.random() - 0.5) * 80
      positions[i + 2] = (Math.random() - 0.5) * 80

      const color = new THREE.Color()
      color.setHSL(Math.random() * 0.3 + 0.5, 0.7, 0.5)
      colors[i] = color.r
      colors[i + 1] = color.g
      colors[i + 2] = color.b
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    })

    const particleSystemMesh = new THREE.Points(particles, particleMaterial)
    particleSystemMesh.visible = false
    sceneRef.current.add(particleSystemMesh)
    particleSystem.current = particleSystemMesh
  }

  const createSkillsScene = () => {
    if (!sceneRef.current) return

    skillMeshes.current.forEach(mesh => {
      sceneRef.current?.remove(mesh)
    })
    skillMeshes.current = []
    
    const coreGeometry = new THREE.SphereGeometry(1.2, 32, 32)
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0x64ffda,
      emissive: 0x001122,
      transparent: true,
      opacity: 0.8
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    core.userData = { type: 'core' }
    sceneRef.current.add(core)

    skills.forEach((skill, index) => {
      const group = new THREE.Group()
      group.userData = { type: 'skill', data: skill }

      const radius = 0.3 + (skill.level / 100) * 0.4
      const geometry = new THREE.SphereGeometry(radius, 16, 16)
      const material = new THREE.MeshPhongMaterial({
        color: skill.color,
        transparent: true,
        opacity: 0.9
      })
      const sphere = new THREE.Mesh(geometry, material)

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')!
      canvas.width = 512
      canvas.height = 128
      context.fillStyle = '#ffffff'
      context.font = 'bold 28px Arial'
      context.textAlign = 'center'
      context.fillText(skill.name, 256, 64)
      context.fillStyle = '#64ffda'
      context.font = '20px Arial'
      context.fillText(`${skill.level}%`, 256, 96)

      const texture = new THREE.CanvasTexture(canvas)
      const labelMaterial = new THREE.SpriteMaterial({ map: texture })
      const label = new THREE.Sprite(labelMaterial)
      label.scale.set(2.5, 0.6, 1)
      label.position.set(0, radius + 0.8, 0)

      group.add(sphere)
      group.add(label)
      
      const angle = (index / skills.length) * Math.PI * 2
      group.position.set(
        Math.cos(angle) * skill.orbitRadius,
        Math.sin(angle * 0.5) * 2,
        Math.sin(angle) * skill.orbitRadius
      )
      group.userData.angle = angle
      group.userData.orbitRadius = skill.orbitRadius
      group.userData.orbitSpeed = skill.orbitSpeed

      group.visible = false
      sceneRef.current.add(group)
      skillMeshes.current.push(group)
    })
  }

  const createMoodboardScene = () => {
    if (!sceneRef.current) return

    moodboardMeshes.current.forEach(mesh => {
      sceneRef.current?.remove(mesh)
    })
    moodboardMeshes.current = []
    
    const items = moodboardItems.length > 0 ? moodboardItems : [
      { id: '1', type: 'color', content: '#64ffda', position: [-2, 2, 0], size: [1.5, 1.5] },
      { id: '2', type: 'color', content: '#ff6b6b', position: [2, 1, -1], size: [1.2, 1.8] },
      { id: '3', type: 'color', content: '#4ecdc4', position: [0, -2, 2], size: [1.8, 1.2] },
      { id: '4', type: 'text', content: 'Web3 Native', position: [-3, -1, -2], size: [2.5, 1] },
      { id: '5', type: 'text', content: 'Decentralized', position: [3, 2, 1], size: [2.2, 1.2] },
      { id: '6', type: 'text', content: 'Innovation', position: [-1, 3, -3], size: [2, 1.5] },
      { id: '7', type: 'color', content: '#9d4edd', position: [4, -2, 2], size: [1, 2] },
      { id: '8', type: 'text', content: 'Future', position: [-3, 0, 4], size: [1.8, 1] }
    ]

    items.forEach((item) => {
      const group = new THREE.Group()
      group.userData = { type: 'moodboard', data: item }

      if (item.type === 'color') {
        const geometry = new THREE.PlaneGeometry(item.size[0], item.size[1])
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(item.content),
          transparent: true,
          opacity: 0.8
        })
        const plane = new THREE.Mesh(geometry, material)
        group.add(plane)
      } else if (item.type === 'text') {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.width = 512
        canvas.height = 256
        context.fillStyle = '#ffffff'
        context.font = 'bold 48px Arial'
        context.textAlign = 'center'
        context.fillText(item.content, 256, 128)

        const texture = new THREE.CanvasTexture(canvas)
        const material = new THREE.MeshBasicMaterial({ 
          map: texture, 
          transparent: true 
        })
        const geometry = new THREE.PlaneGeometry(item.size[0], item.size[1])
        const plane = new THREE.Mesh(geometry, material)
        group.add(plane)
      }

      group.position.set(...item.position)
      group.visible = false
      sceneRef.current?.add(group)
      moodboardMeshes.current.push(group)
    })
  }

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (!mountRef.current || !cameraRef.current) return

    const rect = mountRef.current.getBoundingClientRect()
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    if (isMouseDown.current && cameraRef.current) {
      const deltaX = event.clientX - previousMousePosition.current.x
      const deltaY = event.clientY - previousMousePosition.current.y
      
      rotationVelocity.current.x = deltaY * 0.005
      rotationVelocity.current.y = deltaX * 0.005
    }

    previousMousePosition.current = { x: event.clientX, y: event.clientY }
  }, [])

  const onMouseDown = useCallback(() => {
    isMouseDown.current = true
    setIsInteracting(true)
  }, [])

  const onMouseUp = useCallback(() => {
    isMouseDown.current = false
    setIsInteracting(false)
  }, [])

  const onWheel = useCallback((event: WheelEvent) => {
    event.preventDefault()
    if (!cameraRef.current) return

    cameraDistance.current += event.deltaY * 0.01
    cameraDistance.current = Math.max(5, Math.min(30, cameraDistance.current))
    
    const direction = new THREE.Vector3()
    cameraRef.current.getWorldDirection(direction)
    direction.multiplyScalar(-cameraDistance.current)
    cameraRef.current.position.copy(direction)
  }, [])

  const onClick = useCallback(() => {
    if (!cameraRef.current || !sceneRef.current || !raycaster.current) return

    raycaster.current.setFromCamera(mouse.current, cameraRef.current)
    
    let intersects: THREE.Intersection[] = []
    
    if (mode === 'projects') {
      intersects = raycaster.current.intersectObjects(
        projectMeshes.current.map(group => group.children).flat()
      )
    } else if (mode === 'skills') {
      intersects = raycaster.current.intersectObjects(
        skillMeshes.current.map(group => group.children).flat()
      )
    }

    if (intersects.length > 0) {
      const object = intersects[0].object
      let parent = object.parent
      while (parent && !parent.userData.data) {
        parent = parent.parent
      }
      if (parent?.userData.data) {
        setSelectedObject(parent.userData.data)
      }
    } else {
      setSelectedObject(null)
    }
  }, [mode])

  const switchMode = useCallback((newMode: SceneMode) => {
    setMode(newMode)
    setSelectedObject(null)
    
    projectMeshes.current.forEach(mesh => { mesh.visible = false })
    skillMeshes.current.forEach(mesh => { mesh.visible = false })
    moodboardMeshes.current.forEach(mesh => { mesh.visible = false })
    if (particleSystem.current) particleSystem.current.visible = false

    if (newMode === 'projects') {
      projectMeshes.current.forEach(mesh => { mesh.visible = true })
      if (particleSystem.current) particleSystem.current.visible = true
    } else if (newMode === 'skills') {
      skillMeshes.current.forEach(mesh => { mesh.visible = true })
    } else if (newMode === 'moodboard') {
      moodboardMeshes.current.forEach(mesh => { mesh.visible = true })
    }
  }, [])

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return

    const time = Date.now() * 0.001

    if (!isMouseDown.current) {
      rotationVelocity.current.x *= 0.95
      rotationVelocity.current.y *= 0.95
    }

    if (Math.abs(rotationVelocity.current.x) > 0.001 || Math.abs(rotationVelocity.current.y) > 0.001) {
      const spherical = new THREE.Spherical()
      spherical.setFromVector3(cameraRef.current.position)
      spherical.theta += rotationVelocity.current.y
      spherical.phi += rotationVelocity.current.x
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi))
      spherical.radius = cameraDistance.current
      cameraRef.current.position.setFromSpherical(spherical)
      cameraRef.current.lookAt(0, 0, 0)
    }

    if (mode === 'projects') {
      projectMeshes.current.forEach((group, index) => {
        const cube = group.children[0]
        if (cube) {
          cube.rotation.x = time * 0.3 + index
          cube.rotation.y = time * 0.2 + index
        }

        group.children.forEach((child: any) => {
          if (child.userData.orbit) {
            const newAngle = child.userData.angle + time * 0.3
            child.position.x = Math.cos(newAngle) * child.userData.radius
            child.position.z = Math.sin(newAngle) * child.userData.radius
            child.position.y = Math.sin(newAngle * 2) * 0.2
          }
        })

        group.position.y += Math.sin(time + index) * 0.005
      })
    }

    if (mode === 'skills') {
      skillMeshes.current.forEach((group, index) => {
        const skill = group.userData.data
        const angle = group.userData.angle + time * skill.orbitSpeed
        group.position.x = Math.cos(angle) * skill.orbitRadius
        group.position.z = Math.sin(angle) * skill.orbitRadius
        group.position.y = Math.sin(angle * 2) * 1.5

        const sphere = group.children[0]
        if (sphere) {
          sphere.rotation.x = time * 0.2
          sphere.rotation.y = time * 0.1
        }

        group.userData.angle = angle
      })
    }

    if (mode === 'moodboard') {
      moodboardMeshes.current.forEach((group, index) => {
        group.rotation.y = Math.sin(time + index) * 0.05
        group.position.y += Math.sin(time * 2 + index) * 0.003
      })
    }

    if (particleSystem.current && particleSystem.current.visible) {
      const positions = particleSystem.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + positions[i] * 0.1) * 0.005
      }
      particleSystem.current.geometry.attributes.position.needsUpdate = true
      particleSystem.current.rotation.y = time * 0.02
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current)
    frameRef.current = requestAnimationFrame(animate)
  }, [mode])

  const handleResize = useCallback(() => {
    if (!mountRef.current || !cameraRef.current || !rendererRef.current) return

    const width = mountRef.current.clientWidth
    const height = mountRef.current.clientHeight

    cameraRef.current.aspect = width / height
    cameraRef.current.updateProjectionMatrix()
    rendererRef.current.setSize(width, height)
  }, [])

  useEffect(() => {
    fetchRepositories()
  }, [fetchRepositories])

  useEffect(() => {
    if (repos.length > 0) {
      initScene()
    }
  }, [repos, initScene])

  useEffect(() => {
    if (repos.length > 0) {
      createProjectsScene()
    }
  }, [repos, createProjectsScene])

  useEffect(() => {
    if (!mountRef.current) return

    const currentMount = mountRef.current

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault()
        const modes: SceneMode[] = ['projects', 'skills', 'moodboard']
        const currentIndex = modes.indexOf(mode)
        const nextIndex = (currentIndex + 1) % modes.length
        switchMode(modes[nextIndex])
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('keydown', handleKeyPress)
    currentMount.addEventListener('mousemove', onMouseMove)
    currentMount.addEventListener('mousedown', onMouseDown)
    currentMount.addEventListener('mouseup', onMouseUp)
    currentMount.addEventListener('click', onClick)
    currentMount.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeyPress)
      currentMount?.removeEventListener('mousemove', onMouseMove)
      currentMount?.removeEventListener('mousedown', onMouseDown)
      currentMount?.removeEventListener('mouseup', onMouseUp)
      currentMount?.removeEventListener('click', onClick)
      currentMount?.removeEventListener('wheel', onWheel)
      
      if (rendererRef.current && currentMount && currentMount.contains(rendererRef.current.domElement)) {
        currentMount.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
    }
  }, [handleResize, onMouseMove, onMouseDown, onMouseUp, onClick, onWheel, mode, switchMode])

  useEffect(() => {
    switchMode(mode)
  }, [mode, switchMode])

  if (error) {
    return (
      <div className={`relative w-full h-screen bg-black flex items-center justify-center ${className}`}>
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Portfolio</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchRepositories}
            className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 px-4 py-2 rounded-lg transition-colors border border-cyan-500/30"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-screen bg-black ${className}`}>
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)' }}
      />
      
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex space-x-4 bg-black/30 backdrop-blur-md rounded-full p-2 border border-gray-700/50">
          {(['projects', 'skills', 'moodboard'] as SceneMode[]).map((sceneMode) => (
            <button
              key={sceneMode}
              onClick={() => switchMode(sceneMode)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                mode === sceneMode
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {sceneMode === 'projects' && `Projects (${repos.length})`}
              {sceneMode === 'skills' && 'Skill Galaxy'}
              {sceneMode === 'moodboard' && 'Vision Board'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedObject && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute bottom-6 left-6 max-w-md bg-black/80 backdrop-blur-md rounded-lg p-6 border border-gray-700/50"
          >
            <h3 className="text-xl font-bold text-cyan-400 mb-2">
              {selectedObject.name?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || selectedObject.title}
            </h3>
            {selectedObject.description && (
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {selectedObject.description}
              </p>
            )}
            {selectedObject.language && (
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-gray-400 text-sm">Language:</span>
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded border border-cyan-500/30">
                  {selectedObject.language}
                </span>
              </div>
            )}
            {selectedObject.topics && selectedObject.topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedObject.topics.slice(0, 5).map((topic: string) => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
            {selectedObject.level && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Proficiency</span>
                  <span className="text-cyan-400">{selectedObject.level}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedObject.level}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            )}
            {(selectedObject.html_url || selectedObject.homepage) && (
              <div className="flex space-x-3">
                {selectedObject.html_url && (
                  <a
                    href={selectedObject.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white text-sm rounded border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.19.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View Code
                  </a>
                )}
                {selectedObject.homepage && (
                  <a
                    href={selectedObject.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 hover:text-cyan-300 text-sm rounded border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                    Live Demo
                  </a>
                )}
              </div>
            )}
            {(selectedObject.stargazers_count !== undefined || selectedObject.forks_count !== undefined) && (
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-400">
                {selectedObject.stargazers_count !== undefined && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{selectedObject.stargazers_count} stars</span>
                  </div>
                )}
                {selectedObject.forks_count !== undefined && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                    <span>{selectedObject.forks_count} forks</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-md rounded-lg p-4 border border-gray-700/50 max-w-xs">
        <h4 className="text-cyan-400 font-semibold mb-2">Controls</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Drag: Rotate camera</li>
          <li>• Scroll: Zoom in/out</li>
          <li>• Click: Select projects</li>
          <li>• Tab: Switch modes</li>
          {loading && <li>• Loading GitHub repos...</li>}
        </ul>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-cyan-400 font-medium">Loading GitHub repositories...</p>
            <p className="text-gray-400 text-sm mt-1">Fetching real project data</p>
          </div>
        </div>
      )}

      {isInteracting && (
        <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-md rounded-lg p-2 border border-gray-700/50">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-300 text-xs">Interactive Mode</span>
          </div>
        </div>
      )}

      {!loading && mode === 'projects' && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/30 backdrop-blur-md rounded-lg p-3 border border-gray-700/50">
          <div className="text-center text-sm text-gray-400">
            <span className="text-cyan-400 font-medium">{repos.length}</span> repositories loaded from GitHub
          </div>
        </div>
      )}
    </div>
  )
}

export default ThreePortfolio