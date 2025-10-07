#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration
const config = {
  wpJsonDir: path.join(projectRoot, 'wp-json'),
  dataOutputFile: path.join(projectRoot, 'src/data/wpData.js'),
  publicUploadsDir: path.join(projectRoot, 'public/uploads'),
  
  // Path transformations
  oldPaths: {
    domain: 'https://evansanchez.info',
    wpUploads: '/wp-content/uploads/',
    wpThemes: '/wp-content/themes/csskiller_wp',
    wpApi: '/wp-json/wp/v2/'
  },
  newPaths: {
    domain: '',
    uploads: '/public/uploads/',
    themes: '',
    api: '/wp-json/wp/v2/'
  }
};

/**
 * Recursively find all HTML files in wp-json directory
 */
function findWpJsonFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.html')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * Clean and parse JSON content from HTML files
 */
function extractJsonFromHtml(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8').trim();
    
    // Skip empty files
    if (!content) {
      console.warn(`⚠️  Empty file: ${filePath}`);
      return null;
    }
    
    // Try to parse as JSON directly
    const parsed = JSON.parse(content);
    return parsed;
  } catch (error) {
    console.error(`❌ Failed to parse ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Sanitize paths in JSON data
 */
function sanitizePaths(data) {
  if (!data) return data;
  
  let jsonString = JSON.stringify(data);
  
  // Replace all WordPress-specific paths
  jsonString = jsonString
    .replaceAll(config.oldPaths.domain, config.newPaths.domain)
    .replaceAll(config.oldPaths.wpUploads, config.newPaths.uploads)
    .replaceAll(config.oldPaths.wpThemes, config.newPaths.themes)
    // Fix any remaining WordPress references
    .replaceAll('https://api.w.org/', '')
    .replaceAll('evansanchez.info', '')
    .replaceAll('\\/', '/'); // Fix escaped slashes
  
  return JSON.parse(jsonString);
}

/**
 * Process wp-json files and generate data structure
 */
function processWpJsonFiles() {
  console.log('🔍 Scanning wp-json directory...');
  
  const files = findWpJsonFiles(config.wpJsonDir);
  console.log(`📁 Found ${files.length} files`);
  
  const data = {
    pages: {},
    projects: {},
    options: {}
  };
  
  for (const filePath of files) {
    const relativePath = path.relative(config.wpJsonDir, filePath);
    console.log(`📄 Processing: ${relativePath}`);
    
    const rawData = extractJsonFromHtml(filePath);
    if (!rawData) continue;
    
    const sanitizedData = sanitizePaths(rawData);
    
    // Categorize by file path
    if (relativePath.includes('wp/v2/pages/')) {
      const id = path.basename(filePath, '.html');
      data.pages[id] = sanitizedData;
    } else if (relativePath.includes('wp/v2/project/')) {
      const id = path.basename(filePath, '.html');
      data.projects[id] = sanitizedData;
    } else if (relativePath.includes('csskiller/v1/options')) {
      data.options = sanitizedData;
    }
  }
  
  console.log(`✅ Processed ${Object.keys(data.pages).length} pages`);
  console.log(`✅ Processed ${Object.keys(data.projects).length} projects`);
  console.log(`✅ Processed options: ${data.options ? 'Yes' : 'No'}`);
  
  return data;
}

/**
 * Generate wpData.js file
 */
function generateDataFile(data) {
  console.log('📝 Generating wpData.js...');
  
  const content = `// Auto-generated from wp-json files - do not edit manually
// Generated on: ${new Date().toISOString()}

export const pages = ${JSON.stringify(data.pages, null, 2)};

export const projects = ${JSON.stringify(data.projects, null, 2)};

export const options = ${JSON.stringify(data.options || {}, null, 2)};

// Default export for convenience
export default {
  pages,
  projects,
  options
};
`;

  fs.writeFileSync(config.dataOutputFile, content, 'utf8');
  console.log(`✅ Generated: ${config.dataOutputFile}`);
}

/**
 * Validate asset paths exist
 */
function validateAssets(data) {
  console.log('🔍 Validating asset paths...');
  
  const missingAssets = [];
  
  function checkPaths(obj, parentKey = '') {
    if (typeof obj === 'string' && obj.includes('/public/uploads/')) {
      const assetPath = path.join(projectRoot, obj.replace(/^\//, ''));
      if (!fs.existsSync(assetPath)) {
        missingAssets.push({
          path: obj,
          fullPath: assetPath,
          context: parentKey
        });
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        checkPaths(value, `${parentKey}.${key}`);
      }
    }
  }
  
  checkPaths(data);
  
  if (missingAssets.length > 0) {
    console.warn(`⚠️  Found ${missingAssets.length} missing assets:`);
    missingAssets.slice(0, 10).forEach(asset => {
      console.warn(`   - ${asset.path}`);
    });
    if (missingAssets.length > 10) {
      console.warn(`   ... and ${missingAssets.length - 10} more`);
    }
  } else {
    console.log('✅ All asset paths validated');
  }
  
  return missingAssets;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting WordPress data sanitization...\n');
  
  try {
    // Process wp-json files
    const data = processWpJsonFiles();
    
    // Validate assets
    const missingAssets = validateAssets(data);
    
    // Generate data file
    generateDataFile(data);
    
    console.log('\n✅ Sanitization complete!');
    
    if (missingAssets.length > 0) {
      console.log('\n⚠️  Note: Some assets are missing. You may need to:');
      console.log('1. Copy missing files from your WordPress uploads directory');
      console.log('2. Update paths in wp-json files');
      console.log('3. Remove references to missing assets');
    }
    
  } catch (error) {
    console.error('❌ Sanitization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default { main, processWpJsonFiles, sanitizePaths, validateAssets };