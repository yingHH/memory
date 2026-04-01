# Memory Data Schema

Reference for memory data structure.

## Global Memory Schema

**Location:** `~/.config/opencode/memory.json`

```json
{
  "version": "1.0",
  "userPreferences": {
    "toolHabits": [
      {
        "id": "uuid-v4",
        "category": "search|editor|debug|deploy|other",
        "content": "string - the habit description",
        "confidence": 0.0-1.0,
        "source": "explicit|derived",
        "createdAt": "ISO-8601 datetime",
        "updatedAt": "ISO-8601 datetime"
      }
    ],
    "thinkingPatterns": [
      {
        "id": "uuid-v4",
        "category": "problem-solving|debugging|planning|learning|other",
        "content": "string - the pattern description",
        "confidence": 0.0-1.0,
        "source": "explicit|derived",
        "createdAt": "ISO-8601 datetime"
      }
    ],
    "decisionPatterns": [
      {
        "id": "uuid-v4",
        "category": "autonomy|risk|priority|other",
        "content": "string - when to ask user vs autonomous",
        "confidence": 0.0-1.0,
        "source": "explicit|derived",
        "createdAt": "ISO-8601 datetime"
      }
    ],
    "interactionStyle": {
      "verbosity": "concise|normal|detailed",
      "codeComments": "minimal|normal|extensive",
      "explanations": "only_when_asked|always|minimal",
      "language": "zh|en|mixed"
    }
  },
  "experiences": [
    {
      "id": "uuid-v4",
      "type": "success|failure|lesson",
      "context": "string - the situation",
      "insight": "string - what was learned",
      "derivedPreferenceId": "uuid-v4|null - link to preference",
      "confidence": 0.0-1.0,
      "createdAt": "ISO-8601 datetime"
    }
  ],
  "currentProject": "string|null - current project identifier",
  "lastUpdated": "ISO-8601 datetime"
}
```

## Project Memory Schema

**Location:** `项目/.opencode/project-memory.json`

```json
{
  "version": "1.0",
  "projectInfo": {
    "name": "string - project name",
    "identifier": "string - unique identifier (git root path)",
    "techStack": ["string - technology list"],
    "structure": "string - directory structure description",
    "goals": ["string - project goals"],
    "constraints": ["string - known constraints"],
    "createdAt": "ISO-8601 datetime"
  },
  "progress": {
    "completed": [
      {
        "id": "uuid-v4",
        "description": "string",
        "completedAt": "ISO-8601 datetime"
      }
    ],
    "current": {
      "description": "string - current work",
      "startedAt": "ISO-8601 datetime"
    },
    "nextSteps": [
      {
        "id": "uuid-v4",
        "description": "string",
        "priority": "high|medium|low",
        "status": "planned|in_progress|blocked"
      }
    ]
  },
  "issues": [
    {
      "id": "uuid-v4",
      "type": "blocker|bug|question|improvement",
      "description": "string",
      "status": "open|investigating|resolved|wontfix",
      "createdAt": "ISO-8601 datetime",
      "updatedAt": "ISO-8601 datetime"
    }
  ],
  "decisions": [
    {
      "id": "uuid-v4",
      "decision": "string - the choice made",
      "reason": "string - why this choice",
      "alternatives": ["string - considered options"],
      "createdAt": "ISO-8601 datetime"
    }
  ],
  "lastUpdated": "ISO-8601 datetime"
}
```

## Field Definitions

### Confidence

| Range | Meaning |
|-------|---------|
| 0.9-1.0 | Explicit user statement, very certain |
| 0.7-0.9 | Clear pattern, reliable |
| 0.5-0.7 | Weak signal, may need verification |
| Below 0.5 | Skip during extraction |

### Source

| Value | Meaning |
|-------|---------|
| explicit | User directly stated this |
| derived | Extracted from experience/behavior |
| manual | User added via `/memory add` |

### Type (Experience)

| Value | Meaning |
|-------|---------|
| success | A method that worked well |
| failure | An approach that failed |
| lesson | Insight from debugging/exploration |

### Category (ToolHabits)

| Value | Examples |
|-------|----------|
| search | grep vs find, search patterns |
| editor | vim vs vscode, editing shortcuts |
| debug | print vs debugger, debugging approach |
| deploy | docker vs local, deployment method |
| other | Other tool preferences |

### Category (ThinkingPatterns)

| Value | Examples |
|-------|----------|
| problem-solving | How to approach new problems |
| debugging | Debugging methodology |
| planning | Planning approach |
| learning | Learning patterns |
| other | Other thinking styles |

### Category (DecisionPatterns)

| Value | Examples |
|-------|----------|
| autonomy | When to act vs ask user |
| risk | Risk assessment approach |
| priority | How to prioritize tasks |
| other | Other decision patterns |

## Deduplication Logic

```python
def is_duplicate(new_content: str, existing_entries: list) -> bool:
    """
    Check if new content duplicates existing entry.
    
    Steps:
    1. Trim whitespace from both
    2. Compare content similarity
    3. If >80% similar, it's a duplicate
    """
    new_normalized = new_content.strip().lower()
    
    for entry in existing_entries:
        existing_normalized = entry["content"].strip().lower()
        
        # Simple similarity check
        if new_normalized == existing_normalized:
            return True
        
        # Check if one contains the other
        if new_normalized in existing_normalized or existing_normalized in new_normalized:
            return True
        
        # Word overlap check (>80% same words)
        new_words = set(new_normalized.split())
        existing_words = set(existing_normalized.split())
        overlap = len(new_words & existing_words) / max(len(new_words), len(existing_words))
        if overlap > 0.8:
            return True
    
    return False
```

## Atomic Write Pattern

```python
import json
import tempfile
import os

def write_memory_atomic(filepath: str, data: dict):
    """
    Write memory file atomically to prevent corruption.
    
    Steps:
    1. Write to temp file
    2. Rename temp to target (atomic on same filesystem)
    """
    # Create temp file in same directory
    temp_fd, temp_path = tempfile.mkstemp(
        dir=os.path.dirname(filepath),
        prefix='.memory_temp_'
    )
    
    try:
        # Write to temp
        with os.fdopen(temp_fd, 'w') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        # Atomic rename
        os.replace(temp_path, filepath)
    except Exception:
        # Cleanup temp on failure
        if os.path.exists(temp_path):
            os.unlink(temp_path)
        raise
```