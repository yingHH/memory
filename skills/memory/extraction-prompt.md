# Memory Extraction Prompt Template

Use this prompt to extract memory updates from conversation.

## Prompt Template

```
You are a memory extraction assistant. Analyze the conversation and current memory state, then output updates in JSON format.

## Input

**Conversation History:**
{conversation_history}

**Current Memory State:**
{current_memory}

## Task

1. Identify new user preferences expressed in this conversation
2. Extract experiences (success patterns, failure lessons, insights)
3. Update project progress if relevant
4. Derive preferences from experiences where applicable

## Output Format

Return a JSON object with the following structure:

```json
{
  "newPreferences": [
    {
      "layer": "toolHabits|thinkingPatterns|decisionPatterns|interactionStyle",
      "content": "string - the preference content",
      "confidence": 0.0-1.0,
      "source": "explicit|derived",
      "reason": "string - why this preference was identified"
    }
  ],
  "newExperiences": [
    {
      "type": "success|failure|lesson",
      "context": "string - the situation context",
      "insight": "string - what was learned",
      "derivedPreference": "string - optional preference derived from this",
      "confidence": 0.0-1.0
    }
  ],
  "projectUpdates": {
    "progress": {
      "completed": ["string - completed items"],
      "current": "string - current work",
      "nextSteps": ["string - planned next steps"]
    },
    "issues": [
      {
        "type": "blocker|bug|question",
        "description": "string",
        "status": "open|resolved"
      }
    ],
    "decisions": [
      {
        "decision": "string - the choice made",
        "reason": "string - why this choice"
      }
    ]
  }
}
```

## Deduplication Rules

1. Trim leading/trailing whitespace before comparing content
2. If content is 80%+ similar to existing entry, skip it
3. For derived preferences, check if similar preference already exists

## Confidence Guidelines

- **0.9-1.0:** Explicit user statement ("我喜欢...")
- **0.7-0.9:** Clear pattern from conversation
- **0.5-0.7:** Weak signal, may need confirmation
- **Below 0.5:** Skip, too uncertain

## Examples

**Input conversation:**
User: "帮我调试这个 asyncio 问题"
... [debugging process] ...
User: "原来是嵌套 async 函数导致的，下次遇到 asyncio 问题要先检查有没有嵌套"

**Output:**
```json
{
  "newExperiences": [
    {
      "type": "lesson",
      "context": "调试 Python asyncio 问题",
      "insight": "嵌套 async 函数会导致 asyncio.run() 失败",
      "derivedPreference": "遇到 asyncio 问题时先检查是否有嵌套 async 函数",
      "confidence": 0.85
    }
  ],
  "newPreferences": [
    {
      "layer": "thinkingPatterns",
      "content": "遇到 asyncio 问题时先检查是否有嵌套 async 函数",
      "confidence": 0.85,
      "source": "derived",
      "reason": "Derived from debugging experience"
    }
  ],
  "projectUpdates": null
}
```

## Output ONLY the JSON

Do not include any explanation. Output the JSON object directly.
```

## Usage

When triggering extraction:

1. Replace `{conversation_history}` with recent messages (user + AI responses)
2. Replace `{current_memory}` with JSON of existing memory
3. Send to LLM
4. Parse JSON response
5. Merge into memory files with deduplication