import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PLUGIN_DIR = path.dirname(__dirname);
const AGENTS_DIR = path.join(PLUGIN_DIR, 'agents');

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

function testAgentFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check frontmatter
  if (!content.startsWith('---')) {
    issues.push('Missing frontmatter');
  } else {
    // Check required fields
    if (!content.match(/^name:\s*.+$/m)) {
      issues.push('Missing "name" field');
    }
    if (!content.match(/^description:\s*.+$/m)) {
      issues.push('Missing "description" field');
    }
    if (!content.match(/^mode:\s*subagent$/m)) {
      issues.push('Missing or invalid "mode" field (should be "subagent")');
    }
    if (!content.match(/^color:\s*['"]?#[0-9A-Fa-f]{6}['"]?$/m)) {
      issues.push('Missing or invalid "color" field');
    }
  }
  
  // Check for body content
  const bodyMatch = content.match(/^---\s*\n[\s\S]*?\n---\s*\n([\s\S]+)$/);
  if (!bodyMatch || !bodyMatch[1].trim()) {
    issues.push('Missing body content');
  }
  
  return issues;
}

function main() {
  log('\\n========================================', 'bold');
  log('  Agency Agents for OpenCode', 'bold');
  log('  Test Script', 'bold');
  log('========================================\\n', 'bold');
  
  // Check if initialized
  if (!fs.existsSync(AGENTS_DIR)) {
    log('❌ Agents directory not found!', 'red');
    log('Please run initialization first:', 'yellow');
    log('  npm run init\\n', 'yellow');
    process.exit(1);
  }
  
  const agentFiles = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md'));
  
  if (agentFiles.length === 0) {
    log('❌ No agent files found!', 'red');
    process.exit(1);
  }
  
  log(`🔍 Testing ${agentFiles.length} agent files...\\n`, 'blue');
  
  let passed = 0;
  let failed = 0;
  const failedAgents = [];
  
  for (const file of agentFiles) {
    const filePath = path.join(AGENTS_DIR, file);
    const issues = testAgentFile(filePath);
    
    if (issues.length === 0) {
      passed++;
      log(`  ✓ ${file}`, 'green');
    } else {
      failed++;
      log(`  ✗ ${file}`, 'red');
      for (const issue of issues) {
        log(`    - ${issue}`, 'yellow');
      }
      failedAgents.push({ file, issues });
    }
  }
  
  log('\\n========================================', 'bold');
  log('  Test Results', 'bold');
  log('========================================', 'bold');
  log(`\\n✅ Passed: ${passed}/${agentFiles.length}`, 'green');
  
  if (failed > 0) {
    log(`❌ Failed: ${failed}/${agentFiles.length}\\n`, 'red');
    
    log('Failed Agents:', 'bold');
    for (const { file, issues } of failedAgents) {
      log(`\\n${file}:`, 'red');
      for (const issue of issues) {
        log(`  - ${issue}`, 'yellow');
      }
    }
    
    log('\\n⚠️  Please fix the failed agents or re-run init/update.', 'yellow');
    process.exit(1);
  } else {
    log(`\\n🎉 All agents passed validation!`, 'green');
    
    // Check version info
    const versionPath = path.join(PLUGIN_DIR, 'version.json');
    if (fs.existsSync(versionPath)) {
      const version = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
      log(`\\n📊 Agent count: ${version.currentAgentCount || version.agentCount || 'unknown'}`, 'blue');
      if (version.convertedAt) {
        log(`🕐 Initialized: ${version.convertedAt}`, 'blue');
      }
      if (version.updatedAt) {
        log(`🕐 Last updated: ${version.updatedAt}`, 'blue');
      }
    }
    
    log('\\n💡 To use agents in OpenCode:', 'reset');
    log('   1. Ensure plugin is in your opencode.json', 'reset');
    log('   2. Restart OpenCode', 'reset');
    log('   3. Use @mention to invoke agents (e.g., @frontend-developer)', 'reset');
    log('\\n✅ Ready to use!\\n', 'green');
  }
}

main();
