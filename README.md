# Agency Agents for OpenCode

🎭 **60+ specialized AI agents for OpenCode** - From frontend wizards to DevOps automators, from security engineers to AI specialists.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

This plugin brings the full [Agency Agents](https://github.com/msitarzewski/agency-agents) collection to OpenCode, converting them into native OpenCode subagents that can be invoked via `@mention`.

### What You Get

**60+ Specialized Agents** including:
- 🎨 **Frontend Developer** - React/Vue/Angular expert
- 🏗️ **Backend Architect** - API & database design
- 🤖 **AI Engineer** - ML/AI integration specialist
- 🚀 **DevOps Automator** - CI/CD & infrastructure
- 🔒 **Security Engineer** - Threat modeling & audits
- 💻 **And 55+ more...**

## Installation

### 1. Add to OpenCode Configuration

Edit your global OpenCode config:

```bash
# Edit global config
~/.config/opencode/opencode.json
```

Add the plugin:

```json
{
  "plugin": [
    "superpowers@git+https://github.com/obra/superpowers.git",
    "agency-agents@git+https://github.com/YOUR_USERNAME/opencode-agency-agents.git"
  ]
}
```

### 2. Initialize Agents

After OpenCode restarts, run the initialization:

```bash
# Navigate to the plugin directory
cd ~/.config/opencode/plugins/agency-agents

# Or if using a custom location
cd /path/to/opencode-agency-agents

# Initialize (downloads and converts all agents)
npm run init
```

This will:
1. Clone the agency-agents repository
2. Convert all 60+ agents to OpenCode format
3. Save them to the `agents/` directory

### 3. Restart OpenCode

```bash
opencode
```

## Usage

Once initialized, use agents by mentioning them with `@`:

```
@frontend-developer Help me create a React component with TypeScript
```

```
@backend-architect Design an API for user authentication
```

```
@devops-automator Set up CI/CD pipeline for this project
```

### Available Agents

All agents are flattened (no category prefixes). Some popular ones:

**Engineering:**
- `@frontend-developer`
- `@backend-architect`
- `@ai-engineer`
- `@devops-automator`
- `@security-engineer`
- `@database-optimizer`
- `@code-reviewer`

**Design:**
- `@ui-designer`
- `@ux-researcher`
- `@brand-guardian`

**Marketing:**
- `@seo-specialist`
- `@content-creator`
- `@growth-hacker`

**Sales:**
- `@outbound-strategist`
- `@sales-engineer`
- `@deal-strategist`

**Product:**
- `@product-manager`
- `@sprint-prioritizer`

**And 40+ more...**

## Updating Agents

To get the latest agents from the source repository:

```bash
npm run update
```

This will:
1. Fetch the latest agency-agents repository
2. Create a backup of your current agents
3. Convert and update all agents
4. Show you what's new

**Note:** Remember to restart OpenCode after updating!

## Testing

Verify all agents are properly configured:

```bash
npm test
```

This checks:
- All agent files have valid frontmatter
- Required fields are present (name, description, mode, color)
- Body content exists
- OpenCode compatibility

## Scripts

| Command | Description |
|---------|-------------|
| `npm run init` | Initial setup - downloads and converts all agents |
| `npm run update` | Update to latest agents from source repo |
| `npm test` | Test all agents for validity |

## Workflow Example

Combine with Superpowers for a complete workflow:

```
User: "Build a user authentication system"

[Auto-triggered: superpowers/brainstorming]
→ Explores requirements
→ Creates design document

[Auto-triggered: superpowers/writing-plans]
→ Breaks into tasks
→ Creates implementation plan

User: "Go ahead and build it"

[You invoke agents]
→ @backend-architect designs the API
→ @frontend-developer builds the UI
→ @security-engineer audits the implementation
→ @devops-automator sets up deployment

[Auto-triggered: superpowers/subagent-driven-development]
→ Reviews work between tasks
→ Ensures quality
```

## Configuration

### Custom Agent Directory

By default, agents are stored in the plugin's `agents/` directory. To use a custom location, set the `AGENCY_AGENTS_DIR` environment variable:

```bash
export AGENCY_AGENTS_DIR=/path/to/custom/agents
```

### Selecting Specific Agents

To load only specific agents, edit the plugin's `index.js` and modify the agent loading logic.

## Troubleshooting

### "Agents not initialized"

Run `npm run init` in the plugin directory to download and convert agents.

### "No agents found"

Check that the `agents/` directory exists and contains `.md` files. Run `npm test` to verify.

### Agents not appearing in OpenCode

1. Ensure the plugin is in your `opencode.json`
2. Run `npm test` to verify agents are valid
3. Restart OpenCode
4. Check OpenCode logs for errors

### Update failed

If `npm run update` fails:
1. Check your internet connection
2. Ensure you have git installed
3. The script automatically restores from backup if update fails

## Directory Structure

```
opencode-agency-agents/
├── index.js              # Main plugin file
├── package.json          # Package configuration
├── scripts/
│   ├── init.js          # Initialization script
│   ├── update.js        # Update script
│   └── test.js          # Test script
├── agents/              # Converted agents (auto-generated)
│   ├── frontend-developer.md
│   ├── backend-architect.md
│   └── ... (60+ more)
├── version.json         # Version info (auto-generated)
└── README.md            # This file
```

## Credits

- **Agency Agents** by [Michał Sitarzewski](https://github.com/msitarzewski/agency-agents)
- **OpenCode** by [Anomaly](https://opencode.ai)
- Plugin maintained by [YOUR_NAME]

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## Support

- 🐛 Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/opencode-agency-agents/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/YOUR_USERNAME/opencode-agency-agents/discussions)

---

**Happy coding with your AI agency!** 🚀
