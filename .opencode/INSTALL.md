# Installing Memory Skill for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed

## AI Prompt Installation (Recommended)

Tell your AI agent to install Memory Skill:

```
安装 memory skill: 在 ~/.config/opencode/opencode.json 的 plugin 数组中添加 "memory@git+https://github.com/yingHH/memory.git"，然后重启 OpenCode
```

Or in English:
```
Install memory skill: Add "memory@git+https://github.com/yingHH/memory.git" to the plugin array in ~/.config/opencode/opencode.json, then restart OpenCode
```

## Manual Installation

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

告诉 OpenCode：
```
你有哪些技能
```

应该能看到 "memory" 在技能列表中。

## Usage

**重要：** Memory Skill 通过自然语言触发，不是命令行工具。直接表达意图即可。

### 查看记忆
```
查看记忆
显示当前记忆内容
```

### 添加记忆
```
加入记忆：我喜欢用 grep 搜索代码
记住这个：遇到 asyncio 问题先检查嵌套
```

或表达偏好时自动触发：
```
我喜欢用 grep 搜索代码而不是 find
# Agent 会询问：是否将此偏好加入记忆？
```

### 更新记忆
```
更新记忆
同步记忆
记住这个
```

### 删除记忆
```
删除记忆条目 xxx
```

### 项目管理
```
切换项目 my-project
当前项目状态
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

Memory file is created on first successful extraction or when you say "加入记忆".

## Getting Help

- Issues: https://github.com/yingHH/memory/issues
- Documentation: See `docs/` directory in this repository