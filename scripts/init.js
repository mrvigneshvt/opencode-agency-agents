const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const AGENCY_REPO = 'https://github.com/msitarzewski/agency-agents.git';
const PLUGIN_DIR = path.dirname(__dirname);
const AGENTS_DIR = path.join(PLUGIN_DIR, 'agents');
const TEMP_DIR = path.join(os.tmpdir(), 'agency-agents-temp');

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function cleanDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  ensureDirectory(dir);
}

function getField(content, field) {
  const regex = new RegExp(`^${field}:\\s*(.+)$`, 'm');
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

function getBody(content) {
  // Remove frontmatter
  const match = content.match(/^---\\s*\\n[\\s\\S]*?\\n---\\s*\\n(.*)$/);
  return match ? match[1] : content;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function resolveColor(color) {
  const colorMap = {
    'cyan': '#00FFFF',
    'blue': '#3498DB',
    'green': '#2ECC71',
    'red': '#E74C3C',
    'purple': '#9B59B6',
    'orange': '#F39C12',
    'teal': '#008080',
    'indigo': '#6366F1',
    'pink': '#E84393',
    'gold': '#EAB308',
    'amber': '#F59E0B',
    'neon-green': '#10B981',
    'neon-cyan': '#06B6D4',
    'metallic-blue': '#3B82F6',
    'yellow': '#EAB308',
    'violet': '#8B5CF6',
    'rose': '#F43F5E',
    'lime': '#84CC16',
    'gray': '#6B7280',
    'fuchsia': '#D946EF'
  };
  
  const normalized = color ? color.toLowerCase().trim() : 'gray';
  const mapped = colorMap[normalized] || color;
  
  if (mapped && mapped.match(/^#[0-9A-Fa-f]{6}$/)) {
    return mapped.toUpperCase();
  }
  
  return '#6B7280';
}

function convertAgent(sourceFile) {
  const content = fs.readFileSync(sourceFile, 'utf8');
  
  // Check if it has frontmatter
  if (!content.startsWith('---')) {
    return null;
  }
  
  const name = getField(content, 'name');
  const description = getField(content, 'description');
  const color = resolveColor(getField(content, 'color'));
  const body = getBody(content);
  
  if (!name || !description) {
    return null;
  }
  
  const slug = slugify(name);
  
  const opencodeFormat = `---
name: ${name}
description: ${description}
mode: subagent
color: '${color}'
---
${body}`;
  
  return { slug, content: opencodeFormat };
}

function convertAllAgents() {
  log('\\n🚀 Converting Agency Agents to OpenCode format...', 'bold');
  
  const agentDirs = [
    'academic', 'design', 'engineering', 'game-development', 
    'marketing', 'paid-media', 'sales', 'product', 
    'project-management', 'testing', 'support', 
    'spatial-computing', 'specialized', 'strategy'
  ];
  
  let converted = 0;
  let failed = 0;
  
  for (const dir of agentDirs) {
    const dirPath = path.join(TEMP_DIR, dir);
    
    if (!fs.existsSync(dirPath)) {
      continue;
    }
    
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const sourcePath = path.join(dirPath, file);
      const result = convertAgent(sourcePath);
      
      if (result) {
        const targetPath = path.join(AGENTS_DIR, `${result.slug}.md`);
        fs.writeFileSync(targetPath, result.content);
        converted++;
        log(`  ✓ ${result.slug}`, 'green');
      } else {
        failed++;
        log(`  ✗ ${file} (skipped - no frontmatter)`, 'yellow');
      }
    }
  }
  
  log(`\\n📊 Conversion complete: ${converted} agents converted, ${failed} skipped`, 'blue');
  return converted;
}

function main() {
  log('\\n========================================', 'bold');
  log('  Agency Agents for OpenCode', 'bold');
  log('  Initialization Script', 'bold');
  log('========================================\\n', 'bold');
  
  // Clean up temp directory
  cleanDirectory(TEMP_DIR);
  ensureDirectory(AGENTS_DIR);
  
  // Clone agency-agents repo
  log('📦 Cloning agency-agents repository...', 'blue');
  try {
    execSync(`git clone --depth 1 ${AGENCY_REPO} ${TEMP_DIR}`, { 
      stdio: 'pipe',
      timeout: 60000 
    });
    log('  ✓ Repository cloned successfully', 'green');
  } catch (error) {
    log('  ✗ Failed to clone repository', 'red');
    log(`  Error: ${error.message}`, 'red');
    process.exit(1);
  }
  
  // Convert agents
  const count = convertAllAgents();
  
  // Clean up temp directory
  cleanDirectory(TEMP_DIR);
  
  // Create version file
  const versionInfo = {
    convertedAt: new Date().toISOString(),
    agentCount: count,
    sourceRepo: AGENCY_REPO
  };
  fs.writeFileSync(
    path.join(PLUGIN_DIR, 'version.json'),
    JSON.stringify(versionInfo, null, 2)
  );
  
  log('\\n✅ Initialization complete!', 'green');
  log(`\\n📁 Agents saved to: ${AGENTS_DIR}`, 'blue');
  log(`📝 Version info: ${path.join(PLUGIN_DIR, 'version.json')}`, 'blue');
  log('\\n💡 Next steps:', 'bold');
  log('   1. Add this plugin to your opencode.json:', 'reset');
  log('      "plugin": ["agency-agents@git+https://github.com/YOUR_USERNAME/opencode-agency-agents.git"]', 'yellow');
  log('   2. Restart OpenCode', 'reset');
  log('   3. Use agents with @mention (e.g., @frontend-developer)', 'reset');
  log('\\n🔄 To update agents later, run: npm run update\\n', 'blue');
}

main();
