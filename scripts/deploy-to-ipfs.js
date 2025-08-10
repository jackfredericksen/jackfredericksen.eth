// scripts/deploy-to-ipfs.js
// Automated deployment script for IPFS + ENS updates

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration - Add these to your .env file
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const ENS_DOMAIN = process.env.ENS_DOMAIN || 'jackfredericksen.eth';
const PRIVATE_KEY = process.env.ENS_PRIVATE_KEY; // Your wallet private key
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY';

class IPFSDeployer {
  constructor() {
    this.pinataBaseURL = 'https://api.pinata.cloud';
    this.buildDir = './out';
    this.dataDir = './data';
  }

  // Step 1: Update moodboard data from the content manager
  async updateMoodboardData() {
    console.log('📁 Checking for new moodboard data...');
    
    const moodboardFile = path.join(this.dataDir, 'moodboard.json');
    
    if (fs.existsSync(moodboardFile)) {
      const data = JSON.parse(fs.readFileSync(moodboardFile, 'utf8'));
      console.log(`✅ Found ${data.moodboardItems?.length || 0} moodboard items`);
      return data;
    } else {
      console.log('⚠️  No moodboard.json found in data/ directory');
      return null;
    }
  }

  // Step 2: Build the Next.js project
  async buildProject() {
    console.log('🔨 Building Next.js project...');
    
    try {
      const { stdout, stderr } = await execAsync('npm run build');
      console.log('✅ Build completed successfully');
      
      if (stderr) {
        console.log('Build warnings:', stderr);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      return false;
    }
  }

  // Step 3: Upload to Pinata
  async uploadToPinata() {
    console.log('📤 Uploading to Pinata...');
    
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      throw new Error('Pinata API credentials not found in environment variables');
    }

    try {
      // Create a tar archive of the build directory
      await execAsync(`tar -czf site.tar.gz -C ${this.buildDir} .`);
      
      const formData = new FormData();
      formData.append('file', fs.createReadStream('site.tar.gz'));
      
      const metadata = JSON.stringify({
        name: `${ENS_DOMAIN}-${new Date().toISOString()}`,
        keyvalues: {
          domain: ENS_DOMAIN,
          timestamp: new Date().toISOString(),
          type: 'website'
        }
      });
      formData.append('pinataMetadata', metadata);
      
      const options = JSON.stringify({
        cidVersion: 1,
        wrapWithDirectory: false
      });
      formData.append('pinataOptions', options);

      const response = await axios.post(
        `${this.pinataBaseURL}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_API_KEY
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );

      console.log('✅ Successfully uploaded to IPFS');
      console.log(`📍 IPFS Hash: ${response.data.IpfsHash}`);
      
      // Clean up
      fs.unlinkSync('site.tar.gz');
      
      return response.data.IpfsHash;
    } catch (error) {
      console.error('❌ Upload to Pinata failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // Step 4: Update ENS content hash
  async updateENSContentHash(ipfsHash) {
    console.log('🌐 Updating ENS content hash...');
    
    if (!PRIVATE_KEY) {
      console.log('⚠️  Private key not provided. Manual ENS update required:');
      console.log(`🔗 Update ${ENS_DOMAIN} content hash to: ipfs://${ipfsHash}`);
      console.log('🔗 Visit: https://app.ens.domains/');
      return false;
    }

    try {
      // This would require additional setup with ethers.js and ENS contracts
      // For now, we'll provide instructions
      console.log('📝 ENS Update Instructions:');
      console.log(`1. Go to https://app.ens.domains/${ENS_DOMAIN}`);
      console.log(`2. Connect your wallet`);
      console.log(`3. Go to Records → Content`);
      console.log(`4. Set content hash to: ipfs://${ipfsHash}`);
      console.log(`5. Confirm transaction`);
      
      return true;
    } catch (error) {
      console.error('❌ ENS update failed:', error.message);
      return false;
    }
  }

  // Step 5: Verify deployment
  async verifyDeployment(ipfsHash) {
    console.log('🔍 Verifying deployment...');
    
    try {
      // Test IPFS gateway access
      const testURL = `https://ipfs.io/ipfs/${ipfsHash}`;
      const response = await axios.get(testURL, { timeout: 10000 });
      
      if (response.status === 200) {
        console.log('✅ IPFS deployment verified');
        console.log(`🌐 Your site is live at: ${testURL}`);
        console.log(`🌐 ENS URL: https://${ENS_DOMAIN}.limo`);
        return true;
      }
    } catch (error) {
      console.log('⚠️  IPFS verification failed (may take a few minutes to propagate)');
      return false;
    }
  }

  // Main deployment process
  async deploy() {
    console.log('🚀 Starting IPFS deployment process...\n');
    
    try {
      // Step 1: Check for new content
      const moodboardData = await this.updateMoodboardData();
      
      // Step 2: Build project
      const buildSuccess = await this.buildProject();
      if (!buildSuccess) {
        throw new Error('Build failed');
      }
      
      // Step 3: Upload to IPFS
      const ipfsHash = await this.uploadToPinata();
      
      // Step 4: Update ENS
      await this.updateENSContentHash(ipfsHash);
      
      // Step 5: Verify
      await this.verifyDeployment(ipfsHash);
      
      console.log('\n🎉 Deployment completed successfully!');
      console.log(`📍 IPFS Hash: ${ipfsHash}`);
      console.log(`🌐 Your updated site will be available at ${ENS_DOMAIN} after ENS update`);
      
      // Save deployment info
      const deploymentInfo = {
        timestamp: new Date().toISOString(),
        ipfsHash,
        domain: ENS_DOMAIN,
        moodboardItemCount: moodboardData?.moodboardItems?.length || 0
      };
      
      fs.writeFileSync(
        './deployment-history.json', 
        JSON.stringify(deploymentInfo, null, 2)
      );
      
    } catch (error) {
      console.error('\n❌ Deployment failed:', error.message);
      process.exit(1);
    }
  }
}

// CLI usage
if (require.main === module) {
  const deployer = new IPFSDeployer();
  deployer.deploy();
}

module.exports = IPFSDeployer;