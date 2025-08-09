import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

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
  default_branch: string
}

interface GitHubProjectsProps {
  username: string
  maxRepos?: number
}

export default function GitHubProjects({ username, maxRepos = 6 }: GitHubProjectsProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [languageData, setLanguageData] = useState<Record<string, Record<string, number>>>({})

  useEffect(() => {
    fetchRepositories()
  }, [username])

  const fetchRepositories = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch repositories
      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=50`
      )
      
      if (!reposResponse.ok) {
        throw new Error('Failed to fetch repositories')
      }

      const allRepos: GitHubRepo[] = await reposResponse.json()
      
      // Filter out forks and select most interesting repos
      const filteredRepos = allRepos
        .filter(repo => !repo.name.includes('.github.io') && repo.size > 0)
        .sort((a, b) => {
          // Sort by stars, then by recent activity
          const aScore = a.stargazers_count * 10 + (new Date(a.updated_at).getTime() / 1000000000)
          const bScore = b.stargazers_count * 10 + (new Date(b.updated_at).getTime() / 1000000000)
          return bScore - aScore
        })
        .slice(0, maxRepos)

      setRepos(filteredRepos)

      // Fetch language data for each repo
      const languagePromises = filteredRepos.map(async (repo) => {
        try {
          const langResponse = await fetch(repo.languages_url)
          if (langResponse.ok) {
            const languages = await langResponse.json()
            return { [repo.id]: languages }
          }
        } catch (error) {
          console.error(`Failed to fetch languages for ${repo.name}:`, error)
        }
        return { [repo.id]: {} }
      })

      const languageResults = await Promise.all(languagePromises)
      const languageMap = languageResults.reduce((acc, curr) => ({ ...acc, ...curr }), {})
      setLanguageData(languageMap)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch repositories')
    } finally {
      setLoading(false)
    }
  }

  const getTopLanguages = (repoId: number) => {
    const languages = languageData[repoId] || {}
    const total = Object.values(languages).reduce((sum: number, bytes: number) => sum + bytes, 0)
    
    return Object.entries(languages)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([lang, bytes]) => ({
        name: lang,
        percentage: Math.round(((bytes as number) / total) * 100)
      }))
  }

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'C': '#555555',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Swift': '#ffac45',
      'Kotlin': '#F18E33',
      'Dart': '#00B4AB',
      'HTML': '#e34c26',
      'CSS': '#1572B6',
      'Vue': '#2c3e50',
      'Solidity': '#AA6746',
      'Shell': '#89e051',
      'Dockerfile': '#384d54'
    }
    return colors[language] || '#8b949e'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div 
            key={index}
            className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 animate-pulse"
          >
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-2/3 mb-4"></div>
            <div className="flex space-x-2 mb-4">
              <div className="h-6 bg-gray-700 rounded w-16"></div>
              <div className="h-6 bg-gray-700 rounded w-12"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-8 bg-gray-700 rounded w-20"></div>
              <div className="h-8 bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-400 font-semibold mb-2">Error Loading Projects</h3>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={fetchRepositories}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {repos.map((repo, index) => {
        const topLanguages = getTopLanguages(repo.id)
        
        return (
          <motion.div
            key={repo.id}
            className="group relative bg-gray-900/50 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-500"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            {/* Holographic Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              animate={{ 
                background: [
                  'linear-gradient(45deg, rgba(6,182,212,0.05), rgba(139,92,246,0.05), rgba(236,72,153,0.05))',
                  'linear-gradient(45deg, rgba(139,92,246,0.05), rgba(236,72,153,0.05), rgba(6,182,212,0.05))',
                  'linear-gradient(45deg, rgba(236,72,153,0.05), rgba(6,182,212,0.05), rgba(139,92,246,0.05))'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="relative p-6">
              {/* Repository Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                    {repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {repo.description || 'No description available'}
                  </p>
                </div>
                
                {/* GitHub Icon */}
                <motion.a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </motion.a>
              </div>

              {/* Topics */}
              {repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {repo.topics.slice(0, 3).map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs border border-cyan-500/20"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}

              {/* Languages */}
              {topLanguages.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    {topLanguages.map((lang) => (
                      <div key={lang.name} className="flex items-center space-x-1">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getLanguageColor(lang.name) }}
                        />
                        <span className="text-xs text-gray-400">
                          {lang.name} {lang.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                    <span>{repo.forks_count}</span>
                  </div>
                </div>
                <span className="text-xs">{formatDate(repo.updated_at)}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <motion.a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-400 px-4 py-2 rounded-lg text-sm font-medium text-center transition-all duration-300 border border-cyan-500/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Code
                </motion.a>
                {repo.homepage && (
                  <motion.a
                    href={repo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-4 py-2 rounded-lg text-sm font-medium text-center transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Live Demo
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}