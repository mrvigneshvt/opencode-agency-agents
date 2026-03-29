import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN_DIR = __dirname;
const AGENTS_DIR = path.join(PLUGIN_DIR, 'agents');

export const AgencyAgentsPlugin = async ({ client, directory }) => {
  return {
    config: async (config) => {
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
  };
};
