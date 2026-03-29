# Quick Setup Guide

## Step 1: Create Your GitHub Repository

1. Go to https://github.com/new
2. Name it `opencode-agency-agents`
3. Make it public or private (your choice)
4. **Don't initialize with README** (we already have one)
5. Click "Create repository"

## Step 2: Push the Plugin Code

After creating the repo, run these commands in your terminal:

```bash
# Navigate to the plugin directory
cd /home/vixyz/opencode-agency-agents-plugin

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Agency Agents plugin for OpenCode"

# Add your GitHub repo as remote
git remote add origin https://github.com/YOUR_USERNAME/opencode-agency-agents.git

# Push to GitHub
git push -u origin main
```

**Note:** Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Configure OpenCode

Edit your OpenCode configuration file:

```bash
# Edit global config
nano ~/.config/opencode/opencode.json
```

Add this configuration:

```json
{
  "plugin": [
    "superpowers@git+https://github.com/obra/superpowers.git",
    "agency-agents@git+https://github.com/YOUR_USERNAME/opencode-agency-agents.git"
  ],
  "agent": {
    "build": {
      "mode": "primary",
      "skills": ["superpowers/*"]
    }
  }
}
```

## Step 4: Initialize the Plugin

The plugin needs to download and convert agents. You have two options:

### Option A: Manual Initialization (Recommended First Time)

```bash
# Install the plugin globally (OpenCode will do this automatically)
# Then navigate to the plugin directory
cd ~/.config/opencode/plugins/opencode-agency-agents

# Or if using a different location, find where OpenCode installed it:
# find ~ -name "opencode-agency-agents" -type d 2>/dev/null

# Run initialization
npm run init
```

### Option B: Let OpenCode Handle It

Just restart OpenCode:

```bash
opencode
```

Then tell OpenCode to initialize:

```
Please run the initialization script for the agency-agents plugin
```

OpenCode should run `npm run init` automatically.

## Step 5: Test Everything

Run the test script:

```bash
cd ~/.config/opencode/plugins/opencode-agency-agents
npm test
```

You should see output like:

```
✅ Passed: 60/60
🎉 All agents passed validation!
```

## Step 6: Use Your Agents

Restart OpenCode and start using agents:

```bash
opencode
```

Then try:

```
@frontend-developer Help me create a React component
```

Or:

```
List all available agents
```

## Updating Agents

When you want to get the latest agents from the source:

```bash
cd ~/.config/opencode/plugins/opencode-agency-agents
npm run update
```

Then restart OpenCode.

## Troubleshooting

### "Command not found: npm"

Make sure Node.js and npm are installed:

```bash
# Check if installed
node --version
npm --version

# If not installed, install Node.js:
# macOS
brew install node

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install nodejs npm

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
```

### "Permission denied"

You might need to change permissions:

```bash
chmod +x scripts/*.js
```

### "Agents directory not found"

The plugin hasn't been initialized yet. Run:

```bash
npm run init
```

### "Plugin not loading in OpenCode"

1. Check your `opencode.json` syntax is valid JSON
2. Verify the GitHub URL is correct
3. Check OpenCode logs for errors
4. Make sure you can access GitHub (no network issues)

### "Some agents are missing"

Not all files in the agency-agents repo are valid agents. Some are documentation or examples. The converter skips files without proper frontmatter. This is expected behavior.

## Next Steps

✅ **You're all set!** You now have:
- Superpowers skills (auto-triggered workflows)
- 60+ Agency Agents (manual @mention)
- Update command for easy maintenance
- Test suite for validation

**Enjoy your AI agency!** 🚀
