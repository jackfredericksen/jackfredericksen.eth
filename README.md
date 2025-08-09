
# ENS Portfolio Website

A modern, decentralized portfolio website built with Next.js and deployed to IPFS, accessible via ENS domains.

## Features

- **Static Site Generation**: Optimized for IPFS hosting with Next.js static export
- **Responsive Design**: Beautiful UI that works on all devices
- **Dark Mode Support**: Automatic dark/light mode based on user preference
- **Blog System**: MDX-powered blog with syntax highlighting
- **Moodboard**: Visual inspiration board with filterable content
- **Contact Form**: Integrated contact system
- **SEO Optimized**: Proper meta tags and structured data
- **Web3 Native**: ENS integration and blockchain-friendly architecture

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Content**: MDX for blog posts
- **Deployment**: IPFS + ENS
- **Package Manager**: npm

## Getting Started

1. **Clone and Install**
   ```bash
   git clone <your-repo>
   cd ens-portfolio
   npm install
   ```

2. **Development**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for Production**
   ```bash
   npm run build
   ```
   This creates a static export in the `out/` directory.

## IPFS Deployment

### Option 1: Manual Upload

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the `out/` directory to IPFS:
   ```bash
   # Using IPFS CLI
   ipfs add -r out/
   
   # Or use a service like Pinata, Web3.Storage
   ```

3. Update your ENS domain's Content Hash record with the IPFS hash.

### Option 2: Automated with Fleek

1. Connect your GitHub repository to [Fleek](https://fleek.co)
2. Set build command: `npm run build`
3. Set publish directory: `out`
4. Fleek will automatically deploy to IPFS and update your ENS record

### Option 3: GitHub Actions (Advanced)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to IPFS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to IPFS
        uses: aquiladev/ipfs-action@v0.3.1
        with:
          path: ./out
          service: pinata
          pinataKey: ${{ secrets.PINATA_KEY }}
          pinataSecret: ${{ secrets.PINATA_SECRET }}
```

## Customization

### 1. Personal Information

Update the following files with your information:
- `pages/index.tsx` - Hero section and about content
- `components/Layout.tsx` - Site title and meta description
- `components/Navigation.tsx` - ENS domain name
- `components/Footer.tsx` - Social links and copyright

### 2. Projects

Edit the `projects` array in `pages/projects.tsx` to showcase your work.

### 3. Blog Posts

Add MDX files to the `content/blog/` directory. Each post should have frontmatter:

```mdx
---
title: "Your Post Title"
date: "2024-03-15"
excerpt: "Brief description"
tags: ["Web3", "Development"]
---

Your content here...
```

### 4. Moodboard

Customize the `sampleItems` array in `pages/moodboard.tsx` with your own inspiration.

### 5. Styling

- Colors: Edit `tailwind.config.js` to change the color scheme
- Fonts: Update font imports in `styles/globals.css`
- Layout: Modify components in the `components/` directory

## Content Management

### Blog Posts

For a full blog system, integrate with a headless CMS:

- **Contentful**: Use the Contentful API
- **Sanity**: Great for structured content
- **Ghost**: Full-featured blogging platform
- **Notion**: Use Notion as a CMS with their API

### Images

For optimal IPFS performance:
- Optimize images before uploading
- Use modern formats (WebP, AVIF)
- Consider using IPFS-native image services

## ENS Configuration

1. **Purchase ENS Domain**: Visit [app.ens.domains](https://app.ens.domains)

2. **Set Content Hash**: Point your domain to your IPFS hash
   - Go to your ENS domain manager
   - Set the "Content Hash" record to `ipfs://your-hash-here`

3. **Additional Records** (optional):
   - Email: Set text record for contact
   - Avatar: Link to your profile image
   - Social: Add Twitter, GitHub handles

## Performance Optimization

### IPFS-Specific Optimizations

- Use relative paths for all internal links
- Optimize bundle size with tree shaking
- Implement efficient caching strategies
- Consider using IPFS gateways for better performance

### SEO for Decentralized Web

- Generate sitemaps
- Use structured data
- Optimize for Web3-native search engines
- Implement proper canonical URLs

## Troubleshooting

### Common Issues

1. **Images not loading**: Ensure images are in the `public/` directory and use relative paths

2. **Routing issues on IPFS**: Make sure `trailingSlash: true` is set in `next.config.js`

3. **CSS not loading**: Verify `assetPrefix` configuration for production builds

4. **ENS not resolving**: Check that your ENS content hash is correctly formatted (`ipfs://hash`)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this template for your own portfolio!

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [IPFS Documentation](https://docs.ipfs.io/)
- [ENS Documentation](https://docs.ens.domains/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

---

Built with ❤️ for the decentralized web