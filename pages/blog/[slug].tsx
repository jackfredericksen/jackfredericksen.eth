import Layout from '../../components/Layout'
import { GetStaticPaths, GetStaticProps } from 'next'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface BlogPostProps {
  post: {
    slug: string
    title: string
    date: string
    content: string
    tags: string[]
    readTime: string
    excerpt: string
  }
}

export default function BlogPost({ post }: BlogPostProps) {
  return (
    <Layout title={`${post.title} - Your Name`} description={post.excerpt}>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Link */}
          <Link href="/blog" className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-8">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          {/* Post Header */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </header>

          {/* Post Content */}
          <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Post Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Enjoyed this post? Share it with others:
                </p>
                <div className="flex gap-4">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://yourname.eth/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Twitter
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://yourname.eth/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
              
              <Link href="/blog" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                More Posts
              </Link>
            </div>
          </footer>
        </motion.div>
      </article>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // In a real implementation, you'd read from your content directory
  const slugs = ['building-on-ipfs', 'smart-contract-security', 'dao-governance-patterns', 'web3-ux-challenges']
  
  const paths = slugs.map((slug) => ({
    params: { slug }
  }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  
  // In a real implementation, you'd read the MDX file and process it
  // This is placeholder content
  const posts: Record<string, any> = {
    'building-on-ipfs': {
      slug: 'building-on-ipfs',
      title: 'Building Decentralized Applications on IPFS',
      date: 'March 15, 2024',
      excerpt: 'A comprehensive guide to building and deploying applications on the InterPlanetary File System for true decentralization.',
      tags: ['IPFS', 'Web3', 'Decentralization'],
      readTime: '8 min read',
      content: `
        <p>The InterPlanetary File System (IPFS) represents a paradigm shift in how we think about data storage and distribution on the web. Unlike traditional web hosting where files are stored on centralized servers, IPFS creates a distributed network where content is addressed by its cryptographic hash rather than its location.</p>
        
        <h2>Why IPFS Matters for Web3</h2>
        
        <p>Traditional web infrastructure relies heavily on centralized servers and DNS systems. This creates several problems:</p>
        
        <ul>
          <li><strong>Single points of failure</strong> - If a server goes down, content becomes unavailable</li>
          <li><strong>Censorship vulnerability</strong> - Content can be easily removed or blocked</li>
          <li><strong>Performance issues</strong> - Users far from servers experience slower load times</li>
        </ul>
        
        <p>IPFS solves these issues by distributing content across a network of nodes, making it more resilient, censorship-resistant, and performant.</p>
        
        <h2>Getting Started with IPFS</h2>
        
        <p>To start building on IPFS, you'll need to understand a few core concepts:</p>
        
        <h3>Content Addressing</h3>
        
        <p>Instead of asking "where is this file?" IPFS asks "what is this file?" Each piece of content gets a unique hash based on its contents. This means:</p>
        
        <ul>
          <li>Identical files always have the same hash</li>
          <li>Changed files get new hashes</li>
          <li>Content integrity is built-in</li>
        </ul>
        
        <h3>Distributed Storage</h3>
        
        <p>When you add content to IPFS, it gets broken into blocks and distributed across the network. Other nodes can pin (store) copies of your content, ensuring availability even if your original node goes offline.</p>
        
        <h2>Building Your First IPFS Application</h2>
        
        <p>Let's walk through creating a simple static website and hosting it on IPFS:</p>
        
        <pre><code>// Install IPFS
npm install -g ipfs
        
// Initialize IPFS node
ipfs init
        
// Start the daemon
ipfs daemon</code></pre>
        
        <p>Now you can add your website files to IPFS:</p>
        
        <pre><code>// Add your website directory
ipfs add -r ./my-website
        
// The output will give you a hash like:
// QmYourHashHere...
        
// Access your site at:
// https://ipfs.io/ipfs/QmYourHashHere</code></pre>
        
        <h2>Integrating with ENS</h2>
        
        <p>Once your content is on IPFS, you can point your ENS domain to it:</p>
        
        <ol>
          <li>Go to the ENS Manager</li>
          <li>Set the Content Hash record to your IPFS hash</li>
          <li>Your site is now accessible at yourname.eth</li>
        </ol>
        
        <h2>Best Practices</h2>
        
        <p>When building for IPFS, keep these considerations in mind:</p>
        
        <ul>
          <li><strong>Static content works best</strong> - Dynamic server-side functionality isn't available</li>
          <li><strong>Use relative paths</strong> - Absolute paths won't work in the distributed environment</li>
          <li><strong>Optimize for performance</strong> - Large files should be chunked appropriately</li>
          <li><strong>Plan for updates</strong> - Consider using IPNS for mutable content</li>
        </ul>
        
        <h2>Advanced Patterns</h2>
        
        <p>As you get more comfortable with IPFS, explore these advanced concepts:</p>
        
        <h3>IPNS (InterPlanetary Name System)</h3>
        
        <p>IPNS allows you to create mutable pointers to IPFS content, making it easier to update your applications without changing the access URL.</p>
        
        <h3>Pinning Services</h3>
        
        <p>Services like Pinata, Web3.Storage, and Fleek can ensure your content stays available by pinning it across multiple nodes.</p>
        
        <h3>Integration with Blockchain</h3>
        
        <p>Store IPFS hashes on-chain to create immutable references to off-chain data, perfect for NFT metadata or decentralized storage solutions.</p>
        
        <h2>Conclusion</h2>
        
        <p>IPFS opens up new possibilities for truly decentralized applications. By understanding its core concepts and best practices, you can build resilient, censorship-resistant applications that embody the principles of Web3.</p>
        
        <p>Start experimenting with IPFS today, and join the movement toward a more distributed and user-controlled internet.</p>
      `
    },
    'smart-contract-security': {
      slug: 'smart-contract-security',
      title: 'Smart Contract Security Best Practices',
      date: 'March 8, 2024',
      excerpt: 'Essential security considerations and patterns for writing secure smart contracts in Solidity.',
      tags: ['Solidity', 'Security', 'Smart Contracts'],
      readTime: '12 min read',
      content: `
        <p>Smart contract security is paramount in blockchain development. Unlike traditional applications, smart contracts are immutable once deployed, making security bugs extremely costly. This guide covers essential security practices every Solidity developer should know.</p>
        
        <h2>Common Vulnerabilities</h2>
        
        <h3>Reentrancy Attacks</h3>
        
        <p>One of the most famous smart contract vulnerabilities, reentrancy occurs when a contract calls an external contract before updating its own state.</p>
        
        <pre><code>// Vulnerable code
function withdraw(uint amount) external {
    require(balances[msg.sender] >= amount);
    (bool success,) = msg.sender.call{value: amount}("");
    require(success);
    balances[msg.sender] -= amount; // State updated after external call
}</code></pre>
        
        <p>The fix is to follow the checks-effects-interactions pattern:</p>
        
        <pre><code>// Secure code
function withdraw(uint amount) external {
    require(balances[msg.sender] >= amount);
    balances[msg.sender] -= amount; // Update state first
    (bool success,) = msg.sender.call{value: amount}("");
    require(success);
}</code></pre>
        
        <h2>Security Patterns</h2>
        
        <h3>Access Control</h3>
        
        <p>Implement proper access control using modifiers and role-based permissions:</p>
        
        <pre><code>contract SecureContract {
    address public owner;
    mapping(address => bool) public authorized;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyAuthorized() {
        require(authorized[msg.sender], "Not authorized");
        _;
    }
}</code></pre>
        
        <p>Remember to implement proper testing and use established libraries like OpenZeppelin for battle-tested security patterns.</p>
      `
    }
  }
  
  const post = posts[slug]
  
  if (!post) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      post
    }
  }
}