const path = require('path');
const fs = require('fs');

const PLUGIN_DIR = __dirname;
const AGENTS_DIR = path.join(PLUGIN_DIR, 'agents');

module.exports = {
  name: 'agency-agents',
  version: '1.0.0',
  
  hooks: {
    // Hook into config to register all agents
    'config': (config) => {
      // Check if agents directory exists
      if (!fs.existsSync(AGENTS_DIR)) {
        console.warn('⚠️  Agency Agents: Agents not initialized. Run "npm run init" in the plugin directory.');
        return config;
      }
      
      // Read all agent files
      const agentFiles = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md'));
      
      if (agentFiles.length === 0) {
        console.warn('⚠️  Agency Agents: No agents found. Run "npm run init" to convert agents.');
        return config;
      }
      
      // Build agent configuration
      const agents = {};
      
      for (const file of agentFiles) {
        const agentName = file.replace('.md', '');
        const agentPath = path.join(AGENTS_DIR, file);
        
        agents[agentName] = {
          mode: 'subagent',
          prompt: `{file:${agentPath}}`,
          hidden: false
        };
      }
      
      console.log(`✅ Agency Agents: Loaded ${agentFiles.length} agents`);
      
      // Merge with existing config
      return {
        ...config,
        agent: {
          ...config.agent,
          ...agents
        }
      };
    }
  }
};
