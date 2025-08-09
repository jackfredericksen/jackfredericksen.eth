import { motion, useScroll, useTransform } from 'framer-motion'
import { useState } from 'react'

const projects = [
  {
    id: 1,
    title: 'DeFi Nexus Protocol',
    description: 'Multi-chain yield aggregation protocol with autonomous rebalancing and MEV protection. Built on Ethereum, Polygon, and Arbitrum with cross-chain bridge integration.',
    technologies: ['Solidity', 'Hardhat', 'React', 'Web3.js', 'Chainlink'],
    githubUrl: 'https://github.com/yourusername/defi-nexus',
    liveUrl: 'https://nexus.yourname.eth',
    category: 'DeFi',
    status: 'Live',
    tvl: '$2.4M',
    network: 'Ethereum',
    gradient: 'from-blue-400 via-purple-500 to-pink-500',
    icon: '⬡',
    metrics: { users: '1.2K', transactions: '45.7K', apr: '12.4%' }
  },
  {
    id: 2,
    title: 'Quantum NFT Marketplace',
    description: 'Next-generation NFT marketplace with AI-powered discovery, fractional ownership, and dynamic royalty distribution. Features gasless transactions via meta-transactions.',
    technologies: ['Next.js', 'Ethers.js', 'IPFS', 'The Graph', 'Polygon'],
    githubUrl: 'https://github.com/yourusername/quantum-nft',
    liveUrl: 'https://quantum.yourname.eth',
    category: 'NFT',
    status: 'Beta',
    tvl: '$890K',
    network: 'Polygon',
    gradient: 'from-green-400 via-cyan-500 to-blue-500',
    icon: '◈',
    metrics: { users: '3.8K', transactions: '12.1K', volume: '$890K' }
  },
  {
    id: 3,
    title: 'Synapse DAO Governance',
    description: 'Modular governance framework for DAOs with quadratic voting, proposal templates, and automated execution. Includes reputation-based delegation and treasury management.',
    technologies: ['Solidity', 'TypeScript', 'React', 'Snapshot', 'Ceramic'],
    githubUrl: 'https://github.com/yourusername/synapse-dao',
    liveUrl: 'https://synapse.yourname.eth',
    category: 'DAO',
    status: 'Live',
    tvl: '$5.2M',
    network: 'Ethereum',
    gradient: 'from-purple-400 via-pink-500 to-red-500',
    icon: '⬢',
    metrics: { users: '892', proposals: '156', treasury: '$5.2M' }
  },
  {
    id: 4,
    title: 'HyperBridge Protocol',
    description: 'Zero-knowledge cross-chain bridge with instant finality and minimal trust assumptions. Supports 12+ chains with sub-second confirmations and MEV resistance.',
    technologies: ['Solidity', 'Circom', 'Rust', 'Go', 'React'],
    githubUrl: 'https://github.com/yourusername/hyperbridge',
    liveUrl: 'https://bridge.yourname.eth',
    category: 'Infrastructure',
    status: 'Live',
    tvl: '$12.8M',
    network: 'Multi-chain',
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    icon: '⧨',
    metrics: { users: '5.4K', volume: '$12.8M', chains: '12' }
  },
  {
    id: 5,
    title: 'Identity Matrix dApp',
    description: 'Self-sovereign identity solution using zero-knowledge proofs for privacy-preserving authentication. Integrates with major Web3 applications and social platforms.',
    technologies: ['Solidity', 'Circom', 'IPFS', 'Ceramic', 'React'],
    githubUrl: 'https://github.com/yourusername/identity-matrix',
    liveUrl: 'https://identity.yourname.eth',
    category: 'Identity',
    status: 'Alpha',
    tvl: 'N/A',
    network: 'Ethereum',
    gradient: 'from-indigo-400 via-purple-500 to-pink-500',
    icon: '◉',
    metrics: { users: '2.1K', verifications: '8.9K', privacy: '100%' }
  },
  {
    id: 6,
    title: 'ChainScope Analytics',
    description: 'Real-time blockchain analytics platform with ML-powered insights, whale tracking, and DeFi protocol monitoring. Features custom dashboard creation and API access.',
    technologies: ['Python', 'React', 'PostgreSQL', 'Redis', 'Docker'],
    githubUrl: 'https://github.com/yourusername/chainscope',
    liveUrl: 'https://analytics.yourname.eth',
    category: 'Analytics',
    status: 'Live',
    tvl: 'N/A',
    network: 'Multi-chain',
    gradient: 'from-teal-400 via-green-500 to-blue-500',
    icon: '◬',
    metrics: { users: '7.2K', queries: '2.1M', uptime: '99.9%' }
  }
]

const categories = [
  { key: 'all', label: 'All Deployments', icon: '◎' },
  { key: 'DeFi', label: 'DeFi Protocols', icon: '⬡' },
  { key: 'NFT', label: 'NFT Platforms', icon: '◈' },
  { key: 'DAO', label: 'DAO Tools', icon: '⬢' },
  { key: 'Infrastructure', label: 'Infrastructure', icon: '⧨' },
  { key: 'Identity', label: 'Identity', icon: '◉' },
  { key: 'Analytics', label: 'Analytics', icon: '◬' }
]

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px] animate-pulse" />
      </div>

      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-6"
              style={{ y }}
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Deployments
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Production-ready Web3 applications and smart contract protocols deployed 
              across multiple blockchain networks. Each project represents innovation in 
              decentralized technology.
            </motion.p>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { label: 'Total TVL', value: '$21.3M', icon: '💎' },
                { label: 'Active Users', value: '20.7K', icon: '👥' },
                { label: 'Transactions', value: '2.1M+', icon: '⚡' },
                { label: 'Networks', value: '12+', icon: '🌐' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-cyan-500/20"
                  whileHover={{ scale: 1.05, borderColor: 'rgba(6,182,212,0.5)' }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-cyan-400">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 backdrop-blur-xl border ${
                    selectedCategory === category.key
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/50 text-cyan-400 shadow-lg shadow-cyan-500/25'
                      : 'bg-gray-900/30 border-gray-700/50 text-gray-400 hover:text-white hover:border-gray-600/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isHovered={hoveredProject === project.id}
                onHover={() => setHoveredProject(project.id)}
                onLeave={() => setHoveredProject(null)}
              />
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-12 border border-cyan-500/20">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Ready to Build the Future?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Interested in collaborating on cutting-edge Web3 projects? Let's create 
                the next generation of decentralized applications together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/contact"
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Initialize Connection
                </motion.a>
                <motion.a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 border border-purple-500 rounded-lg font-semibold hover:bg-purple-500/10 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Source Code
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, index, isHovered, onHover, onLeave }: {
  project: any
  index: number
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}) {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={onHover}
      onHoverEnd={onLeave}
    >
      <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-500">
        {/* Holographic Effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
          animate={isHovered ? { opacity: [0.05, 0.15, 0.05] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Project Header */}
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <motion.div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center text-black font-bold text-xl`}
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {project.icon}
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                <div className="flex items-center space-x-3 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'Live' ? 'bg-green-500/20 text-green-400' :
                    project.status === 'Beta' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-gray-400 text-sm">{project.network}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Description */}
          <p className="text-gray-300 mb-6 leading-relaxed">
            {project.description}
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {Object.entries(project.metrics).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-lg font-bold text-cyan-400">{value as string}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">{key}</div>
              </div>
            ))}
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech: string) => (
              <span
                key={tech}
                className="px-3 py-1 bg-gray-800/50 border border-gray-600/50 rounded-full text-sm text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium text-center hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Launch dApp
            </motion.a>
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-6 py-3 rounded-lg font-medium text-center transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Source Code
            </motion.a>
          </div>
        </div>

        {/* Animated Border */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${project.gradient.split(' ')[1]}, transparent, transparent)`
          }}
          animate={isHovered ? { rotate: 360 } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.3 }}
        />
      </div>
    </motion.div>
  )
}