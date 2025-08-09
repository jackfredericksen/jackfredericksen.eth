import Layout from '../components/Layout'
import { motion } from 'framer-motion'
import { useState } from 'react'

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

const sampleItems: MoodboardItem[] = [
  {
    id: '1',
    type: 'quote',
    content: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
    size: 'medium',
    color: 'bg-blue-100 dark:bg-blue-900/30'
  },
  {
    id: '2',
    type: 'text',
    content: 'Web3 represents the next evolution of the internet - decentralized, user-owned, and built on trustless protocols.',
    title: 'Web3 Vision',
    size: 'large',
    color: 'bg-purple-100 dark:bg-purple-900/30'
  },
  {
    id: '3',
    type: 'link',
    content: 'An incredible deep dive into the technical architecture of Ethereum 2.0 and its implications for scalability.',
    title: 'Ethereum 2.0 Architecture',
    url: 'https://ethereum.org/en/eth2/',
    size: 'medium',
    color: 'bg-green-100 dark:bg-green-900/30'
  },
  {
    id: '4',
    type: 'text',
    content: 'Design Inspiration',
    title: 'Brutalist web design meets Web3 aesthetics',
    size: 'small',
    color: 'bg-yellow-100 dark:bg-yellow-900/30'
  },
  {
    id: '5',
    type: 'quote',
    content: 'Code is poetry.',
    author: 'WordPress Philosophy',
    size: 'small',
    color: 'bg-pink-100 dark:bg-pink-900/30'
  },
  {
    id: '6',
    type: 'text',
    content: 'Exploring the intersection of art and technology through generative algorithms and blockchain-based ownership models.',
    title: 'Generative Art & NFTs',
    size: 'large',
    color: 'bg-indigo-100 dark:bg-indigo-900/30'
  },
  {
    id: '7',
    type: 'link',
    content: 'Amazing collection of Web3 design patterns and UI components that prioritize user experience in decentralized applications.',
    title: 'Web3 Design Systems',
    url: 'https://web3.design',
    size: 'medium',
    color: 'bg-teal-100 dark:bg-teal-900/30'
  },
  {
    id: '8',
    type: 'text',
    content: '🌍 → 🌐 → 🕸️',
    title: 'Evolution of the Web',
    size: 'small',
    color: 'bg-orange-100 dark:bg-orange-900/30'
  }
]

export default function Moodboard() {
  const [items] = useState<MoodboardItem[]>(sampleItems)
  const [filter, setFilter] = useState<string>('all')

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.type === filter)

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'col-span-1 row-span-1'
      case 'medium':
        return 'col-span-1 md:col-span-2 row-span-2'
      case 'large':
        return 'col-span-1 md:col-span-2 lg:col-span-3 row-span-2 md:row-span-3'
      default:
        return 'col-span-1 row-span-1'
    }
  }

  const renderItem = (item: MoodboardItem) => {
    const baseClasses = `${item.color || 'bg-gray-100 dark:bg-gray-800'} rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer`
    
    switch (item.type) {
      case 'quote':
        return (
          <div className={baseClasses}>
            <blockquote className="text-gray-800 dark:text-gray-200 italic mb-3">
              "{item.content}"
            </blockquote>
            {item.author && (
              <cite className="text-sm text-gray-600 dark:text-gray-400 not-italic">
                — {item.author}
              </cite>
            )}
          </div>
        )
      
      case 'link':
        return (
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${baseClasses} block hover:scale-105`}
          >
            {item.title && (
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
                {item.title}
              </h3>
            )}
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
              {item.content}
            </p>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              External Link
            </div>
          </a>
        )
      
      case 'text':
      default:
        return (
          <div className={baseClasses}>
            {item.title && (
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
                {item.title}
              </h3>
            )}
            <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
              {item.content}
            </p>
          </div>
        )
    }
  }

  return (
    <Layout title="Moodboard - Your Name" description="A collection of inspiration, ideas, and interesting finds">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <section className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Moodboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mb-8">
              A curated collection of inspiration, ideas, quotes, and interesting finds that shape my thinking 
              about technology, design, and the future of the web.
            </p>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'text', label: 'Ideas' },
                { key: 'quote', label: 'Quotes' },
                { key: 'link', label: 'Links' }
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === filterOption.key
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </section>

          {/* Moodboard Grid */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[120px]">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className={getSizeClasses(item.size)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {renderItem(item)}
                </motion.div>
              ))}
            </div>
          </section>

          {/* Add Item CTA */}
          <motion.section
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            
          </motion.section>
        </motion.div>
      </div>
    </Layout>
  )
}