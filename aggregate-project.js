const fs = require('fs');
const path = require('path');

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const ignoreDirs = ['node_modules', '.next', '.git', 'out', '.vercel', '.env.local'];

// Create separate files for different parts - adjusted for your structure
const outputs = {
  'project-app.txt': ['src/app'],
  'project-components.txt': ['src/components'],
  'project-config.txt': ['.'], // root files like package.json, next.config.js
  'project-root-scripts.txt': ['aggregate-project.js', 'postcss.config.js', 'tailwind.config.js', 'tsconfig.json']
};

function shouldIgnore(filePath) {
  return ignoreDirs.some(dir => filePath.includes(dir));
}

function aggregateDirectory(dir) {
  let content = '';
  
  if (!fs.existsSync(dir)) {
    return content;
  }
  
  function processDirectory(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !shouldIgnore(filePath)) {
        processDirectory(filePath);
      } else if (stat.isFile() && extensions.includes(path.extname(file)) && !shouldIgnore(filePath)) {
        content += `\n\n=== FILE: ${filePath} ===\n`;
        content += fs.readFileSync(filePath, 'utf8');
      }
    });
  }
  
  processDirectory(dir);
  return content;
}

function aggregateByCategory() {
  Object.entries(outputs).forEach(([outputFile, items]) => {
    let content = '';
    
    items.forEach(item => {
      if (item === '.') {
        // Root config files
        const rootConfigs = ['package.json', 'package-lock.json', 'next.config.js', 'next.config.ts', '.env.local'];
        rootConfigs.forEach(file => {
          if (fs.existsSync(file) && !file.includes('.env.local')) { // Skip .env.local for security
            content += `\n\n=== FILE: ${file} ===\n`;
            content += fs.readFileSync(file, 'utf8');
          }
        });
      } else if (fs.existsSync(item)) {
        if (fs.statSync(item).isDirectory()) {
          content += aggregateDirectory(item);
        } else {
          // It's a file
          content += `\n\n=== FILE: ${item} ===\n`;
          content += fs.readFileSync(item, 'utf8');
        }
      }
    });
    
    if (content.trim()) {
      fs.writeFileSync(outputFile, content);
      const sizeKB = (content.length / 1024).toFixed(2);
      console.log(`Created ${outputFile} (${sizeKB} KB)`);
    } else {
      console.log(`No content found for ${outputFile}`);
    }
  });
}

console.log('Starting aggregation...');
aggregateByCategory();
console.log('\nDone! Check the generated .txt files');