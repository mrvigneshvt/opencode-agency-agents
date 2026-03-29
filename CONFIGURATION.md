# Complete OpenCode Configuration Guide

## Overview

This guide shows you how to configure OpenCode to use both **Superpowers** and **Agency Agents** together for maximum productivity.

## Full Configuration

Create or edit `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  
  "plugin": [
    "superpowers@git+https://github.com/obra/superpowers.git",
    "agency-agents@git+https://github.com/YOUR_USERNAME/opencode-agency-agents.git"
  ],
  
  "agent": {
    "build": {
      "mode": "primary",
      "model": "anthropic/claude-sonnet-4-20250514",
      "description": "Primary development agent with Superpowers and Agency Agents",
      "skills": ["superpowers/*"],
      "permission": {
        "edit": "allow",
        "bash": "ask",
        "skill": {
          "*": "allow",
          "superpowers/*": "allow"
        }
      }
    },
    
    "plan": {
      "mode": "primary",
      "description": "Planning mode - restricted from making changes",
      "permission": {
        "edit": "ask",
        "bash": "ask",
        "skill": {
          "*": "ask"
        }
      }
    }
  },
  
  "permission": {
    "skill": {
      "*": "allow",
      "superpowers/*": "allow"
    },
    "edit": "ask",
    "bash": {
      "*": "ask",
      "git status": "allow",
      "git diff": "allow",
      "git log": "allow"
    }
  },
  
  "model": "anthropic/claude-sonnet-4-20250514",
  "small_model": "anthropic/claude-haiku-3-20240307",
  "default_agent": "build"
}
```

**Note:** Replace `YOUR_USERNAME` with your actual GitHub username.

## How It Works

### Superpowers (Skills)

**Auto-triggered** based on context:

1. **`superpowers/brainstorming`** - Activates when you start discussing a new feature
2. **`superpowers/writing-plans`** - Creates implementation plans after design approval
3. **`superpowers/subagent-driven-development`** - Manages multi-agent workflows
4. **`superpowers/test-driven-development`** - Enforces RED-GREEN-REFACTOR
5. **`superpowers/requesting-code-review`** - Reviews code between tasks
6. **Plus 10+ more...**

### Agency Agents (Subagents)

**Manually invoked** via `@mention`:

- `@frontend-developer` - React/Vue/Angular expert
- `@backend-architect` - API & database design
- `@devops-automator` - CI/CD & infrastructure
- `@ai-engineer` - ML/AI integration
- `@security-engineer` - Security auditing
- **Plus 55+ more...**

## Usage Examples

### Example 1: Building a Full-Stack Feature

```
User: "Build a user dashboard with real-time notifications"

[Superpowers auto-activates]
→ brainstorming: Explores requirements
→ "What type of notifications? Email, push, in-app?"

User: "In-app notifications with WebSocket"

→ brainstorming: Creates design doc
→ writing-plans: Breaks into tasks

User: "Go ahead"

→ subagent-driven-development: Starts orchestration
→ @backend-architect: Designs WebSocket API
→ @frontend-developer: Builds React components
→ @database-optimizer: Optimizes queries
→ test-driven-development: Ensures tests pass
→ requesting-code-review: Reviews final code
```

### Example 2: Code Review

```
User: "Review this authentication code"

→ @code-reviewer: Deep code review
→ @security-engineer: Security audit
→ superpowers/requesting-code-review: Structured review
```

### Example 3: DevOps Setup

```
User: "Set up CI/CD for this project"

→ @devops-automator: Designs pipeline
→ @backend-architect: Reviews architecture
→ superpowers/writing-plans: Creates rollout plan
```

## Workflow Integration

### Step 1: Planning (Superpowers)

```
User: "I want to add a feature"

[Tab to enter Plan mode]

User: "When users delete a note, flag it as deleted
       Show recently deleted notes screen
       Allow undelete or permanent delete"

→ brainstorming: Asks clarifying questions
→ Presents 2-3 approaches
→ Writes design doc

User: "Looks good"

→ writing-plans: Creates detailed implementation plan
```

### Step 2: Implementation (Agents + Superpowers)

```
[Tab to switch back to Build mode]

User: "Go ahead and build it"

→ subagent-driven-development: Manages workflow
→ Dispatches @frontend-developer for UI
→ Dispatches @backend-architect for API
→ test-driven-development: Enforces TDD
→ requesting-code-review: Reviews between tasks
```

### Step 3: Completion (Superpowers)

```
→ finishing-a-development-branch: Cleanup
→ verification-before-completion: Final checks
```

## Best Practices

### 1. Let Superpowers Guide Process

Don't skip the design phase! Superpowers enforces:
- Design before coding
- Test-driven development
- Code review between tasks

### 2. Use Agents for Specialization

When you need deep expertise:
- Frontend work → `@frontend-developer`
- Database issues → `@database-optimizer`
- Security concerns → `@security-engineer`
- DevOps tasks → `@devops-automator`

### 3. Combine Both

Agents can use Superpowers skills too:

```
@frontend-developer Create a login form following test-driven-development
```

### 4. Start Broad, Go Deep

1. Start with general request (Superpowers handles process)
2. When specific expertise needed, @mention relevant agent
3. Return to general workflow

## Troubleshooting

### Skills Not Auto-Triggering

Make sure:
1. Superpowers plugin is in `opencode.json`
2. OpenCode is restarted
3. You're not in Plan mode (skills trigger in Build mode)

### Agents Not Found

1. Run `npm test` in plugin directory
2. Check `agents/` directory exists
3. Verify agents have valid frontmatter
4. Restart OpenCode

### Permission Errors

If agents can't use tools:

```json
{
  "permission": {
    "skill": {
      "*": "allow"
    }
  }
}
```

## Tips

1. **Use Plan Mode for Design** - Press Tab to switch modes
2. **Trust the Process** - Superpowers enforces quality
3. **Ask for Help** - "What agents are available?"
4. **Iterate** - Design → Plan → Build → Review cycle
5. **Update Regularly** - Run `npm run update` monthly

## Quick Reference

| What You Want | What to Do |
|---------------|------------|
| Design something new | Just describe it, Superpowers handles the rest |
| Frontend expertise | `@frontend-developer` |
| Backend expertise | `@backend-architect` |
| Security audit | `@security-engineer` |
| Database optimization | `@database-optimizer` |
| DevOps setup | `@devops-automator` |
| AI/ML integration | `@ai-engineer` |
| See all agents | "List all available agents" |
| Update agents | `npm run update` in plugin dir |
| Test agents | `npm test` in plugin dir |

## Support

- **Superpowers Issues:** https://github.com/obra/superpowers/issues
- **Agency Agents Issues:** https://github.com/msitarzewski/agency-agents/issues
- **This Plugin Issues:** https://github.com/YOUR_USERNAME/opencode-agency-agents/issues

---

**You're ready to build with your AI agency!** 🚀
