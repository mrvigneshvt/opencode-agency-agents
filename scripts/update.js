const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const AGENCY_REPO = 'https://github.com/msitarzewski/agency-agents.git';
const PLUGIN_DIR = path.dirname(__dirname);
const AGENTS_DIR = path.join(PLUGIN_DIR, 'agents');
const TEMP_DIR = path.join(os.tmpdir(), 'agency-agents-update-temp');

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
    'cyan': '#00FFFF', 'blue': '#3498DB', 'green': '#2ECC71',
    'red': '#E74C3C', 'purple': '#9B59B6', 'orange': '#F39C12',
    'teal': '#008080', 'indigo': '#6366F1', 'pink': '#E84393',
    'gold': '#EAB308', 'amber': '#F59E0B', 'neon-green': '#10B981',
    'neon-cyan': '#06B6D4', 'metallic-blue': '#3B82F6',
    'yellow': '#EAB308', 'violet': '#8B5CF6', 'rose': '#F43F5E',
    'lime': '#84CC16', 'gray': '#6B7280', 'fuchsia': '#D946EF'
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

function main() {
  log('\\n========================================', 'bold');
  log('  Agency Agents for OpenCode', 'bold');
  log('  Update Script', 'bold');
  log('========================================\\n', 'bold');
  
  // Check if initialized
  if (!fs.existsSync(AGENTS_DIR)) {
    log('❌ Agents directory not found!', 'red');
    log('Please run initialization first:', 'yellow');
    log('  npm run init\\n', 'yellow');
    process.exit(1);
  }
  
  // Backup existing agents
  const backupDir = path.join(PLUGIN_DIR, 'agents-backup');
  log('💾 Creating backup of existing agents...', 'blue');
  cleanDirectory(backupDir);
  
  const existingAgents = fs.readdirSync(AGENTS_DIR);
  for (const agent of existingAgents) {
    fs.copyFileSync(
      path.join(AGENTS_DIR, agent),
      path.join(backupDir, agent)
    );
  }
  log(`  ✓ Backed up ${existingAgents.length} agents`, 'green');
  
  // Clean and prepare
  cleanDirectory(TEMP_DIR);
  ensureDirectory(AGENTS_DIR);
  
  // Clone latest repo
  log('\\n📦 Fetching latest agency-agents repository...', 'blue');
  try {
    execSync(`git clone --depth 1 ${AGENCY_REPO} ${TEMP_DIR}`, { 
      stdio: 'pipe',
      timeout: 60000 
    });
    log('  ✓ Latest repository fetched', 'green');
  } catch (error) {
    log('  ✗ Failed to fetch repository', 'red');
    // Restore backup
    log('  Restoring from backup...', 'yellow');
    cleanDirectory(AGENTS_DIR);
    for (const agent of existingAgents) {
      fs.copyFileSync(
        path.join(backupDir, agent),
        path.join(AGENTS_DIR, agent)
      );
    }
    process.exit(1);
  }
  
  // Convert agents
  log('\\n🔄 Converting agents...', 'blue');
  
  const agentDirs = [
    'academic', 'design', 'engineering', 'game-development', 
    'marketing', 'paid-media', 'sales', 'product', 
    'project-management', 'testing', 'support', 
    'spatial-computing', 'specialized', 'strategy'
  ];
  
  let newAgents = 0;
  let updatedAgents = 0;
  const currentAgents = new Set(existingAgents.map(a => a.replace('.md', '')));
  
  for (const dir of agentDirs) {
    const dirPath = path.join(TEMP_DIR, dir);
    if (!fs.existsSync(dirPath)) continue;
    
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const sourcePath = path.join(dirPath, file);
      const result = convertAgent(sourcePath);
      
      if (result) {
        const targetPath = path.join(AGENTS_DIR, `${result.slug}.md`);
        const isNew = !currentAgents.has(result.slug);
        
        fs.writeFileSync(targetPath, result.content);
        
        if (isNew) {
          newAgents++;
          log(`  + ${result.slug} (new)`, 'green');
        } else {
          updatedAgents++;
          log(`  ~ ${result.slug}`, 'blue');
        }
      }
    }
  }
  
  // Clean up
  cleanDirectory(TEMP_DIR);
  cleanDirectory(backupDir);
  
  // Update version file
  const versionInfo = {
    updatedAt: new Date().toISOString(),
    previousAgentCount: existingAgents.length,
    currentAgentCount: fs.readdirSync(AGENTS_DIR).length,
    newAgents: newAgents,
    updatedAgents: updatedAgents,
    sourceRepo: AGENCY_REPO
  };
  fs.writeFileSync(
    path.join(PLUGIN_DIR, 'version.json'),
    JSON.stringify(versionInfo, null, 2)
  );
  
  log('\\n✅ Update complete!', 'green');
  log(`\\n📊 Summary:`, 'bold');
  log(`   • New agents: ${newAgents}`, 'green');
  log(`   • Updated agents: ${updatedAgents}`, 'blue');
  log(`   • Total agents: ${versionInfo.currentAgentCount}`, 'reset');
  log(`\\n📝 Updated: ${versionInfo.updatedAt}`, 'blue');
  log('\\n⚠️  Remember to restart OpenCode to load new agents\\n', 'yellow');
}

main();
