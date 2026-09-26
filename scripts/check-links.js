const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      getFiles(full, files);
    } else {
      files.push(full);
    }
  }
  return files;
}

const checkDirs = [
  path.join(rootDir, 'pages'),
  path.join(rootDir, 'shared'),
  path.join(rootDir, 'assets')
];

let allFiles = [path.join(rootDir, 'index.html')];
checkDirs.forEach(d => {
  allFiles = allFiles.concat(getFiles(d));
});

const htmlFiles = allFiles.filter(f => f.endsWith('.html'));
const jsFiles = allFiles.filter(f => f.endsWith('.js'));
const cssFiles = allFiles.filter(f => f.endsWith('.css'));

console.log('=== TravelGenesis Project Audit ===');
console.log(`Auditing: ${htmlFiles.length} HTML files, ${jsFiles.length} JS files, ${cssFiles.length} CSS files`);

let issuesFound = 0;

// 1. Check HTML references (src, href)
for (const h of htmlFiles) {
  const content = fs.readFileSync(h, 'utf8');
  const dir = path.dirname(h);
  const regex = /(?:src|href)=["']([^"'#:]+?)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const ref = match[1].trim();
    if (ref.startsWith('http') || ref.startsWith('//') || ref.startsWith('mailto:') || ref.startsWith('tel:') || ref.startsWith('javascript:') || ref.startsWith('data:')) continue;
    const cleanRef = ref.split('?')[0].split('#')[0];
    if (!cleanRef) continue;
    
    let resolved;
    if (cleanRef.startsWith('/')) {
      resolved = path.join(rootDir, cleanRef.replace(/^\//, ''));
    } else {
      resolved = path.resolve(dir, cleanRef);
    }

    if (!fs.existsSync(resolved)) {
      issuesFound++;
      console.error(`[Missing in HTML] ${path.relative(rootDir, h)}: "${ref}" -> ${path.relative(rootDir, resolved)} not found`);
    }
  }
}

// 2. Check JS navigation references (location.href) and asset changes
for (const j of jsFiles) {
  const content = fs.readFileSync(j, 'utf8');
  const dir = path.dirname(j);
  const regex = /(?:window\.location(?:\.href)?|location\.href)\s*=\s*["']([^"'#:]+?)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const ref = match[1].trim();
    if (ref.startsWith('http') || ref.startsWith('//') || ref.startsWith('javascript:')) continue;
    const cleanRef = ref.split('?')[0].split('#')[0];
    if (!cleanRef) continue;
    
    let resolved;
    if (cleanRef.startsWith('/')) {
      resolved = path.join(rootDir, cleanRef.replace(/^\//, ''));
    } else if (j.includes('shared-nav.js')) {
      // shared-nav.js executes from pages at pages/<cat>/<page>/
      resolved = path.resolve(path.join(rootDir, 'pages/booking/home'), cleanRef);
    } else {
      resolved = path.resolve(dir, cleanRef);
    }

    if (!fs.existsSync(resolved)) {
      issuesFound++;
      console.error(`[Missing in JS Navigation] ${path.relative(rootDir, j)}: "${ref}" -> ${path.relative(rootDir, resolved)} not found`);
    }
  }

  // Check for dynamic image src in JS
  const imgRegex = /\.src\s*=\s*["']([^"'#:]+?)["']/g;
  while ((match = imgRegex.exec(content)) !== null) {
    const ref = match[1].trim();
    if (ref.startsWith('http') || ref.startsWith('//') || ref.startsWith('data:')) continue;
    const cleanRef = ref.split('?')[0].split('#')[0];
    if (!cleanRef) continue;

    let resolved = path.resolve(dir, cleanRef);
    if (!fs.existsSync(resolved)) {
      issuesFound++;
      console.error(`[Missing in JS Asset] ${path.relative(rootDir, j)}: "${ref}" -> ${path.relative(rootDir, resolved)} not found`);
    }
  }

  // Check JavaScript syntax
  try {
    new Function(content);
  } catch (err) {
    issuesFound++;
    console.error(`[JS Syntax Error] in ${path.relative(rootDir, j)}: ${err.message}`);
  }
}

if (issuesFound === 0) {
  console.log('✅ All asset references, scripts, stylesheets, and navigation links passed verification!');
  process.exit(0);
} else {
  console.error(`❌ Found ${issuesFound} issues to resolve.`);
  process.exit(1);
}
