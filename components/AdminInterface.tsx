import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  tags: string[]
  date: string
  published: boolean
}

interface MoodboardItem {
  id: string
  type: 'text' | 'quote' | 'link' | 'image'
  content: string
  title?: string
  author?: string
  url?: string
  color?: string
  size: 'small' | 'medium' | 'large'
}

interface AdminInterfaceProps {
  isVisible: boolean
  onClose: () => void
}

export default function AdminInterface({ isVisible, onClose }: AdminInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'blog' | 'moodboard'>('blog')
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [moodboardItems, setMoodboardItems] = useState<MoodboardItem[]>([])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>({})

  // Load data from localStorage on mount
  useEffect(() => {
    if (isVisible) {
      loadData()
    }
  }, [isVisible])

  const loadData = () => {
    const savedBlogPosts = localStorage.getItem('blogPosts')
    const savedMoodboardItems = localStorage.getItem('moodboardItems')
    
    if (savedBlogPosts) {
      setBlogPosts(JSON.parse(savedBlogPosts))
    }
    
    if (savedMoodboardItems) {
      setMoodboardItems(JSON.parse(savedMoodboardItems))
    }
  }

  const saveData = (type: 'blog' | 'moodboard', data: any[]) => {
    if (type === 'blog') {
      localStorage.setItem('blogPosts', JSON.stringify(data))
      setBlogPosts(data)
    } else {
      localStorage.setItem('moodboardItems', JSON.stringify(data))
      setMoodboardItems(data)
    }
  }

  // Blog Post Management
  const createBlogPost = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: 'New Blog Post',
      content: '# New Post\n\nStart writing your post here...',
      excerpt: 'A brief description of your post',
      tags: [],
      date: new Date().toISOString().split('T')[0],
      published: false
    }
    
    const updatedPosts = [newPost, ...blogPosts]
    saveData('blog', updatedPosts)
    setIsEditing(newPost.id)
    setFormData(newPost)
  }

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    const updatedPosts = blogPosts.map(post => 
      post.id === id ? { ...post, ...updates } : post
    )
    saveData('blog', updatedPosts)
  }

  const deleteBlogPost = (id: string) => {
    const updatedPosts = blogPosts.filter(post => post.id !== id)
    saveData('blog', updatedPosts)
    if (isEditing === id) {
      setIsEditing(null)
      setFormData({})
    }
  }

  // Moodboard Management
  const createMoodboardItem = () => {
    const newItem: MoodboardItem = {
      id: Date.now().toString(),
      type: 'text',
      content: 'New inspiration',
      title: 'New Item',
      size: 'medium',
      color: 'bg-blue-100 dark:bg-blue-900/30'
    }
    
    const updatedItems = [newItem, ...moodboardItems]
    saveData('moodboard', updatedItems)
    setIsEditing(newItem.id)
    setFormData(newItem)
  }

  const updateMoodboardItem = (id: string, updates: Partial<MoodboardItem>) => {
    const updatedItems = moodboardItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
    saveData('moodboard', updatedItems)
  }

  const deleteMoodboardItem = (id: string) => {
    const updatedItems = moodboardItems.filter(item => item.id !== id)
    saveData('moodboard', updatedItems)
    if (isEditing === id) {
      setIsEditing(null)
      setFormData({})
    }
  }

  const handleSave = () => {
    if (activeTab === 'blog') {
      updateBlogPost(formData.id, formData)
    } else {
      updateMoodboardItem(formData.id, formData)
    }
    setIsEditing(null)
    setFormData({})
  }

  const handleEdit = (item: BlogPost | MoodboardItem) => {
    setIsEditing(item.id)
    setFormData({ ...item })
  }

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-6xl bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-cyan-500/30 overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-cyan-500/30 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">🔧 Admin Interface</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => setActiveTab('blog')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'blog'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Blog Posts ({blogPosts.length})
              </button>
              <button
                onClick={() => setActiveTab('moodboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'moodboard'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Moodboard ({moodboardItems.length})
              </button>
            </div>
          </div>

          <div className="flex h-96">
            {/* Content List */}
            <div className="w-1/3 border-r border-gray-700 p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {activeTab === 'blog' ? 'Blog Posts' : 'Moodboard Items'}
                </h3>
                <button
                  onClick={activeTab === 'blog' ? createBlogPost : createMoodboardItem}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  + Add New
                </button>
              </div>

              <div className="space-y-2">
                {activeTab === 'blog' ? (
                  blogPosts.map((post) => (
                    <div
                      key={post.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        isEditing === post.id
                          ? 'bg-cyan-500/10 border-cyan-500/30'
                          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => handleEdit(post)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm truncate">{post.title}</h4>
                          <p className="text-gray-400 text-xs mt-1">{post.date}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`w-2 h-2 rounded-full ${
                              post.published ? 'bg-green-400' : 'bg-gray-500'
                            }`} />
                            <span className="text-xs text-gray-400">
                              {post.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteBlogPost(post.id)
                          }}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  moodboardItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        isEditing === item.id
                          ? 'bg-cyan-500/10 border-cyan-500/30'
                          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => handleEdit(item)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300">
                              {item.type}
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300">
                              {item.size}
                            </span>
                          </div>
                          <h4 className="text-white font-medium text-sm truncate">
                            {item.title || item.content.slice(0, 30) + '...'}
                          </h4>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteMoodboardItem(item.id)
                          }}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 p-6 overflow-y-auto">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">
                      {activeTab === 'blog' ? 'Edit Blog Post' : 'Edit Moodboard Item'}
                    </h3>
                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          setIsEditing(null)
                          setFormData({})
                        }}
                        className="px-3 py-1 text-gray-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-1 rounded-lg transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  {activeTab === 'blog' ? (
                    // Blog Editor
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                        <input
                          type="text"
                          value={formData.title || ''}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
                        <textarea
                          value={formData.excerpt || ''}
                          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                          rows={2}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={formData.tags?.join(', ') || ''}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500"
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.published || false}
                            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-300">Published</span>
                        </label>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                          <input
                            type="date"
                            value={formData.date || ''}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Content (Markdown)</label>
                        <textarea
                          value={formData.content || ''}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          rows={10}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-cyan-500"
                          placeholder="Write your blog post in Markdown..."
                        />
                      </div>
                    </div>
                  ) : (
                    // Moodboard Editor
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                          <select
                            value={formData.type || 'text'}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500"
                          >
                            <option value="text">Text</option>
                            <option value="quote">Quote</option>
                            <option value="link">Link</option>
                            <option value="image">Image</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Size</label>
                          <select
                            value={formData.size || 'medium'}
                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500"
                          >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                        <input
                          type="text"
                          value={formData.title || ''}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                        <textarea
                          value={formData.content || ''}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          rows={4}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500"
                        />
                      </div>

                      {formData.type === 'quote' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Author</label>
                          <input
                            type="text"
                            value={formData.author || ''}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500"
                          />
                        </div>
                      )}

                      {formData.type === 'link' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                          <input
                            type="url"
                            value={formData.url || ''}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Color Theme</label>
                        <select
                          value={formData.color || 'bg-blue-100 dark:bg-blue-900/30'}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500"
                        >
                          <option value="bg-blue-100 dark:bg-blue-900/30">Blue</option>
                          <option value="bg-purple-100 dark:bg-purple-900/30">Purple</option>
                          <option value="bg-green-100 dark:bg-green-900/30">Green</option>
                          <option value="bg-yellow-100 dark:bg-yellow-900/30">Yellow</option>
                          <option value="bg-pink-100 dark:bg-pink-900/30">Pink</option>
                          <option value="bg-indigo-100 dark:bg-indigo-900/30">Indigo</option>
                          <option value="bg-teal-100 dark:bg-teal-900/30">Teal</option>
                          <option value="bg-orange-100 dark:bg-orange-900/30">Orange</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-20">
                  <p>Select an item to edit, or create a new one</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-800/50 border-t border-gray-700 p-4">
            <div className="flex justify-between items-center text-sm text-gray-400">
              <p>Data is stored locally in your browser</p>
              <div className="space-x-4">
                <button
                  onClick={() => {
                    const data = {
                      blogPosts,
                      moodboardItems,
                      exportDate: new Date().toISOString()
                    }
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'portfolio-backup.json'
                    a.click()
                  }}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Export Data
                </button>
                <label className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer">
                  Import Data
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string)
                            if (data.blogPosts) setBlogPosts(data.blogPosts)
                            if (data.moodboardItems) setMoodboardItems(data.moodboardItems)
                            localStorage.setItem('blogPosts', JSON.stringify(data.blogPosts || []))
                            localStorage.setItem('moodboardItems', JSON.stringify(data.moodboardItems || []))
                          } catch (error) {
                            alert('Invalid file format')
                          }
                        }
                        reader.readAsText(file)
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}