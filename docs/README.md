# Memory Skill

A cross-platform memory system for coding agents that remembers user preferences, experiences, and project progress.

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

### Installation (OpenCode)

```json
// ~/.config/opencode/opencode.json
{
  "plugin": ["memory@git+https://github.com/yingHH/memory.git"]
}
```

### Basic Commands

| Command | Description |
|---------|-------------|
| `/memory` | View memory overview |
| `/memory add <content>` | Manually add entry |
| `/memory sync` | Force extraction |
| `/project <name>` | Set current project |

### Natural Language Triggers

Just express your intent naturally:

```
"我喜欢用 grep 搜索"     → Agent asks: 是否将此偏好加入记忆？
"记住这个方法"           → Direct extraction
"项目进展是..."          → Update project memory
```

## Documentation

- [Data Storage](./data-storage.md) - Storage locations and file structure
- [Intent Recognition](../skills/memory/intent-recognition.md) - Trigger phrases
- [Extraction Workflow](./extraction-workflow.md) - How extraction works
- [Example Memory](./example-memory.json) - Sample data structure

## Platform Support

| Platform | Status | Installation |
|----------|--------|--------------|
| OpenCode | ✅ Ready | Plugin system |
| OpenClaw | ✅ Ready | Plugin system |
| Codex | 🔜 Planned | Symlink method |
| Claude Code | 🔜 Planned | Marketplace |

## License

MIT License - see LICENSE file for details.