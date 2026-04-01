# Memory

A cross-platform memory system for coding agents that remembers user preferences, experiences, and project progress.

## AI Prompt Installation

Just tell your AI agent to install Memory Skill:

```
Fetch and follow instructions from https://raw.githubusercontent.com/yingHH/memory/main/.opencode/INSTALL.md
```

## Manual Installation

Add to your `~/.config/opencode/opencode.json`:

```json
{
  "plugin": ["memory@git+https://github.com/yingHH/memory.git"]
}
```

Restart OpenCode/OpenClaw. Done!

## Features

- **Three-layer architecture**: User preferences, experience summaries, project memory
- **Intent-based triggering**: Natural language triggers like "更新记忆", "记住这个"
- **Automatic injection**: Memory context injected at conversation start
- **LLM-powered extraction**: Intelligent extraction from conversation
- **Deduplication**: Automatic detection and merging of duplicate entries
- **Confidence weighting**: Only high-confidence entries are injected

## Architecture

```
Layer 1: User Preferences (~/.config/opencode/memory.json)
├── Tool habits: preferred tools and commands
├── Thinking patterns: problem-solving approaches
├── Decision patterns: when to ask vs search
└── Interaction style: verbosity, code style

Layer 2: Experience Summary (embedded in global)
├── Success patterns: what worked
├── Failure lessons: what to avoid
└── Derived preferences: improved habits

Layer 3: Project Memory (项目/.opencode/project-memory.json)
├── Project info: tech stack, structure, goals
├── Progress: completed, current, next steps
├── Issues: blockers, bugs, questions
└── Decisions: key design choices
```

## Quick Start

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

### Project Management
```
/project my-project    # Set current project
/project status        # Show detection status
```

## Natural Language Triggers

Just express your intent naturally:

| User says | Agent action |
|-----------|--------------|
| "更新记忆" / "记住这个" | Direct extraction |
| "我喜欢..." / "我偏好..." | Ask: Add to memory? |
| "项目进展..." / "切换项目..." | Update project memory |
| "经验是..." / "教训是..." | Ask: Add experience? |

## Storage Locations

| Type | Location |
|------|----------|
| Global memory | `~/.config/opencode/memory.json` |
| Project memory | `项目/.opencode/project-memory.json` |

## Platform Support

| Platform | Status | Installation |
|----------|--------|--------------|
| OpenCode | ✅ Ready | Plugin system |
| OpenClaw | ✅ Ready | Plugin system |
| Codex | 🔜 Planned | Symlink method |
| Claude Code | 🔜 Planned | Marketplace |

## Documentation

- [Installation Guide](./.opencode/INSTALL.md)
- [Data Storage](./docs/data-storage.md)
- [Extraction Workflow](./docs/extraction-workflow.md)
- [Intent Recognition](./skills/memory/intent-recognition.md)
- [Example Memory](./docs/example-memory.json)

## License

MIT License - see [LICENSE](./LICENSE) for details.