import Layout from '../../components/Layout'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { GetStaticProps } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  readTime: string
}

interface BlogIndexProps {
  posts: BlogPost[]
}

export default function BlogIndex({ posts }: BlogIndexProps) {
  const featuredPost = posts[0]
  const recentPosts = posts.slice(1, 4)

  return (
    <Layout title="Blog - Your Name" description="Thoughts on Web3, blockchain technology, and decentralized development">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <section className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
              Insights and thoughts on Web3 development, blockchain technology, and the future of the decentralized web.
            </p>
          </section>

          {/* Featured Post */}
          {featuredPost && (
            <motion.section
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link href={`/blog/${featuredPost.slug}`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="md:flex">
                    <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold">
                      Featured
                    </div>
                    <div className="md:w-1/2 p-8">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span>{featuredPost.date}</span>
                        <span>•</span>
                        <span>{featuredPost.readTime}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {featuredPost.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {featuredPost.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.section>
          )}

          {/* Recent Posts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Recent Posts
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full">
                      <div className="h-48 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xl font-bold">
                        {post.title.split(' ').slice(0, 2).join(' ')}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // This is a placeholder - you'll replace this with actual blog post reading logic
  const posts: BlogPost[] = [
    {
      slug: 'building-on-ipfs',
      title: 'Building Decentralized Applications on IPFS',
      date: 'March 15, 2024',
      excerpt: 'A comprehensive guide to building and deploying applications on the InterPlanetary File System for true decentralization.',
      tags: ['IPFS', 'Web3', 'Decentralization'],
      readTime: '8 min read'
    },
    {
      slug: 'smart-contract-security',
      title: 'Smart Contract Security Best Practices',
      date: 'March 8, 2024',
      excerpt: 'Essential security considerations and patterns for writing secure smart contracts in Solidity.',
      tags: ['Solidity', 'Security', 'Smart Contracts'],
      readTime: '12 min read'
    },
    {
      slug: 'dao-governance-patterns',
      title: 'DAO Governance Patterns and Implementation',
      date: 'February 28, 2024',
      excerpt: 'Exploring different governance models for DAOs and how to implement them effectively.',
      tags: ['DAO', 'Governance', 'Web3'],
      readTime: '10 min read'
    },
    {
      slug: 'web3-ux-challenges',
      title: 'UX Challenges in Web3 and How to Solve Them',
      date: 'February 20, 2024',
      excerpt: 'Addressing common user experience challenges in decentralized applications and practical solutions.',
      tags: ['UX', 'Web3', 'Design'],
      readTime: '6 min read'
    }
  ]

  return {
    props: {
      posts
    }
  }
}