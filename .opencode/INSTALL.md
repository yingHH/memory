# Installing Memory Skill for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed

## Installation

Add memory skill to the `plugin` array in your `opencode.json`:

**Global installation** (`~/.config/opencode/opencode.json`):
```json
{
  "plugin": [
    "memory@git+https://github.com/yingHH/memory.git"
  ]
}
```

**Project-level installation** (项目/opencode.json):
```json
{
  "plugin": [
    "memory@git+https://github.com/yingHH/memory.git"
  ]
}
```

Restart OpenCode. The plugin auto-installs and registers all skills.

## Verify Installation

Ask OpenCode:
```
告诉我关于记忆功能
```

Or check commands:
```
/memory
```

## Usage

### View Memory
```
/memory              # Show all memory overview
/memory global       # Show global preferences + experiences
/memory project      # Show current project memory
```

### Add Memory
```
/memory add 用户偏好使用简洁的回答风格
```

Or trigger via conversation:
```
我喜欢用 grep 搜索代码而不是 find
# Agent will ask: 是否将此偏好加入记忆？
```

### Update Memory
```
更新记忆
# 或
加入记忆
# 或
记住这个
```

### Delete Memory
```
/memory delete <id>
```

### Project Management
```
/project my-project    # Set current project
/project status        # Show detection status
```

## Storage Locations

| Type | Location |
|------|----------|
| Global memory | `~/.config/opencode/memory.json` |
| Project memory | `项目/.opencode/project-memory.json` |

## Updating

Memory skill updates automatically when you restart OpenCode.

To pin a specific version:
```json
{
  "plugin": ["memory@git+https://github.com/yingHH/memory.git#v1.0.0"]
}
```

## Manual Installation (Alternative)

If plugin system unavailable, use symlink method:

```bash
# Clone the repository
git clone https://github.com/yingHH/memory.git ~/.config/opencode/memory

# Create skills symlink
mkdir -p ~/.config/opencode/skills
ln -s ~/.config/opencode/memory/skills/memory ~/.config/opencode/skills/memory

# Restart OpenCode
```

## Troubleshooting

### Plugin not loading

1. Check logs: `opencode run --print-logs "hello" 2>&1 | grep -i memory`
2. Verify the plugin line in `opencode.json`
3. Make sure you're running a recent version of OpenCode

### Skills not found

1. Use `skill` tool to list available skills
2. Check that `SKILL.md` files exist with valid frontmatter

### Memory file not created

Memory file is created on first `/memory add` or successful extraction.

## Getting Help

- Issues: https://github.com/yingHH/memory/issues
- Documentation: See `docs/` directory in this repository