// scripts/setup.js
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

console.log('🚀 MapleKaede Setup Script');
console.log('========================\n');

// Function to get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

// Function to get public IP
async function getPublicIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.log('Could not fetch public IP');
    return null;
  }
}

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
const envExamplePath = path.join(__dirname, '..', '.env.local.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  
  // Create example env file
  const envExample = `# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=your_maplestory_database

# JWT Secret (generate a random one)
JWT_SECRET=${require('crypto').randomBytes(32).toString('hex')}

# Vote System
GTOP100_PINGBACK_KEY=maple_sd_vote_2025

# Server Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_HOSTNAME=localhost
ALLOWED_ORIGINS=http://localhost:3000

# Discord (optional)
DISCORD_WEBHOOK_URL=

# Environment
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
`;
  
  fs.writeFileSync(envPath, envExample);
  fs.writeFileSync(envExamplePath, envExample);
  console.log('✅ Created .env.local and .env.local.example\n');
}

async function setup() {
  const localIP = getLocalIP();
  const publicIP = await getPublicIP();
  
  console.log('🌐 Network Information:');
  console.log(`   Local IP: ${localIP}`);
  console.log(`   Public IP: ${publicIP || 'Unable to detect'}`);
  console.log('');
  
  console.log('📋 Quick Setup Commands:\n');
  
  console.log('1. For LOCAL development (localhost only):');
  console.log('   npm run dev:local\n');
  
  console.log('2. For LOCAL NETWORK access (other devices on same network):');
  console.log(`   - Update .env.local:`);
  console.log(`     NEXT_PUBLIC_API_URL=http://${localIP}:3000`);
  console.log(`     NEXT_PUBLIC_HOSTNAME=${localIP}`);
  console.log(`     ALLOWED_ORIGINS=http://localhost:3000,http://${localIP}:3000`);
  console.log('   - Run: npm run dev\n');
  
  if (publicIP) {
    console.log('3. For PUBLIC INTERNET access:');
    console.log(`   - Update .env.local:`);
    console.log(`     NEXT_PUBLIC_API_URL=http://${publicIP}:3000`);
    console.log(`     NEXT_PUBLIC_HOSTNAME=${publicIP}`);
    console.log(`     ALLOWED_ORIGINS=http://localhost:3000,http://${localIP}:3000,http://${publicIP}:3000`);
    console.log('   - Ensure port 3000 is forwarded on your router');
    console.log('   - Run: npm run dev\n');
  }
  
  console.log('4. For PRODUCTION deployment:');
  console.log('   - Set NODE_ENV=production in .env.local');
  console.log('   - Run: npm run build && npm run start\n');
  
  console.log('⚠️  Important Security Notes:');
  console.log('   - Change the default JWT_SECRET in .env.local');
  console.log('   - Update database credentials');
  console.log('   - Use HTTPS in production');
  console.log('   - Configure firewall rules appropriately\n');
  
  console.log('📚 Documentation:');
  console.log('   - API Routes: /api/*');
  console.log('   - Static Assets: /assets/*');
  console.log('   - Character Renderer: /api/character/:id/image\n');
  
  // Check if dependencies are installed
  try {
    require.resolve('next');
  } catch (e) {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }
  
  console.log('✅ Setup complete! Run "npm run dev" to start the server.\n');
}

setup().catch(console.error);