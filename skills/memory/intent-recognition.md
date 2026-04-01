# Intent Recognition for Memory Skill

Quick reference for identifying when to trigger memory extraction.

## Explicit Trigger Phrases

Execute extraction immediately when user message contains:

### Memory Update
| Phrase | Action |
|--------|--------|
| "更新memory" | Full extraction |
| "更新记忆" | Full extraction |
| "同步记忆" | Full extraction |
| "加入记忆" | Full extraction |
| "添加记忆" | Full extraction |
| "保存到记忆" | Full extraction |
| "记住这个" | Full extraction |
| "记下来" | Full extraction |
| "memory sync" | Full extraction |

### Project Switch
| Phrase | Action |
|--------|--------|
| "切换项目" | Switch current project |
| "设置项目" | Set project manually |
| "switch project" | Switch current project |

## Implicit Trigger Phrases

Ask confirmation when user message contains:

### Preferences
| Pattern | Confirmation Prompt |
|---------|---------------------|
| "我喜欢..." | "是否将此偏好加入记忆？" |
| "我偏好..." | "是否将此偏好加入记忆？" |
| "以后..." | "是否将此习惯加入记忆？" |
| "下次..." | "是否将此习惯加入记忆？" |
| "习惯..." | "是否将此习惯加入记忆？" |
| "我喜欢用..." | "是否将此工具偏好加入记忆？" |

### Experiences
| Pattern | Confirmation Prompt |
|---------|---------------------|
| "经验是..." | "是否将此经验加入记忆？" |
| "教训是..." | "是否将此教训加入记忆？" |
| "这个方法很好..." | "是否将此方法加入记忆？" |
| "避免..." | "是否将此注意事项加入记忆？" |
| "下次注意..." | "是否将此注意事项加入记忆？" |
| "这样不行..." | "是否将此失败经验加入记忆？" |
| "应该..." | "是否将此建议加入记忆？" |

### Project Updates
| Pattern | Action |
|---------|--------|
| "项目进展..." | Update project progress (confirm) |
| "当前状态..." | Update project progress (confirm) |
| "下一步计划..." | Update next steps (confirm) |
| "项目背景是..." | Update project info (confirm) |
| "技术栈是..." | Update tech stack (confirm) |

## Detection Logic

```python
def detect_intent(message: str) -> tuple[str, bool]:
    """
    Returns: (action_type, needs_confirmation)
    
    action_type: "extract" | "switch_project" | "update_project" | None
    needs_confirmation: True for implicit triggers, False for explicit
    """
    
    # Explicit triggers
    explicit_memory = [
        "更新memory", "更新记忆", "同步记忆", 
        "加入记忆", "添加记忆", "保存到记忆",
        "记住这个", "记下来", "memory sync"
    ]
    explicit_project = ["切换项目", "设置项目", "switch project"]
    
    # Implicit triggers
    implicit_preference = ["我喜欢", "我偏好", "以后", "下次", "习惯"]
    implicit_experience = ["经验是", "教训是", "避免", "下次注意", "应该"]
    implicit_project = ["项目进展", "当前状态", "下一步计划", "项目背景"]
    
    message = message.lower().strip()
    
    # Check explicit first
    for phrase in explicit_memory:
        if phrase in message:
            return ("extract", False)
    
    for phrase in explicit_project:
        if phrase in message:
            return ("switch_project", False)
    
    # Check implicit
    for phrase in implicit_preference:
        if phrase in message:
            return ("extract", True)
    
    for phrase in implicit_experience:
        if phrase in message:
            return ("extract", True)
    
    for phrase in implicit_project:
        if phrase in message:
            return ("update_project", True)
    
    return (None, False)
```

## Response Templates

### Implicit Trigger Confirmation

**For preferences:**
> 是否将此偏好加入记忆？(确认后回复"是的"或"加入记忆")

**For experiences:**
> 是否将此经验加入记忆？(确认后回复"是的"或"加入记忆")

**For project updates:**
> 是否更新项目记忆？(确认后回复"是的"或"更新记忆")

### After Extraction

> 记忆已更新。可以说"查看记忆"查看当前记忆内容。

### Project Switch

> 当前项目已设置为: {project_name}
> 项目记忆路径: {project_memory_path}