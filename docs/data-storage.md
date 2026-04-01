# Data Storage Locations

Memory skill stores data in two locations.

## Global Memory

**Location:** `~/.config/opencode/memory.json`

**Purpose:** User preferences, experiences, interaction style

**Structure:**
```
~/.config/opencode/
└── memory.json          # Global user memory
```

**Contents:**
- `userPreferences.toolHabits` - Tool and command preferences
- `userPreferences.thinkingPatterns` - Problem-solving patterns
- `userPreferences.decisionPatterns` - Decision-making rules
- `userPreferences.interactionStyle` - Communication preferences
- `experiences` - Success/failure/lesson entries
- `currentProject` - Current project identifier

## Project Memory

**Location:** `项目/.opencode/project-memory.json`

**Purpose:** Project-specific progress, issues, decisions

**Structure:**
```
项目根目录/
└── .opencode/
    └── project-memory.json
```

**Contents:**
- `projectInfo` - Name, tech stack, structure, goals
- `progress` - Completed items, current work, next steps
- `issues` - Blockers, bugs, questions
- `decisions` - Key design choices and reasons

## Project Identification

Memory skill identifies projects using:

1. **Git repository root** - Primary method
   ```bash
   git rev-parse --show-toplevel
   ```

2. **Current directory** - Fallback if not in git repo

3. **Manual override** - User can set via "切换项目 xxx"

## Detection Logic

```javascript
function detectProject(directory) {
  // Try git root first
  try {
    const gitRoot = execSync('git rev-parse --show-toplevel', {
      cwd: directory,
      encoding: 'utf8'
    }).trim();
    return gitRoot;
  } catch (e) {
    // Not in git repo, use current directory
    return directory;
  }
}

function getProjectMemoryPath(projectDir) {
  return path.join(projectDir, '.opencode', 'project-memory.json');
}
```

## File Creation

Files are created automatically when:

- First successful extraction
- User says "加入记忆" or "记住这个"
- User sets project via "切换项目 xxx"

## Backup Recommendation

Consider backing up:

```bash
# Backup global memory
cp ~/.config/opencode/memory.json ~/.config/opencode/memory.json.bak

# Backup project memory (per project)
cp 项目/.opencode/project-memory.json 项目/.opencode/project-memory.json.bak
```

## Cross-Platform Paths

| Platform | Global | Project |
|----------|--------|---------|
| OpenCode | `~/.config/opencode/memory.json` | `项目/.opencode/project-memory.json` |
| OpenClaw | `~/.config/openclaw/memory.json` | `项目/.openclaw/project-memory.json` |
| Codex | `~/.codex/memory.json` | `项目/.codex/project-memory.json` |
| Claude Code | `~/.claude/memory.json` | `项目/.claude/project-memory.json` |

The skill auto-detects platform based on config directory existence.