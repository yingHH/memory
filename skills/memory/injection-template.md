# Memory Injection Template

Template for injecting memory context into system prompt.

## Bootstrap Template

Inject at conversation start via plugin hook:

```
<MEMORY_CONTEXT>
你拥有记忆能力，可以记住用户偏好、经验教训和项目进展。

## 关键命令
- `/memory` - 查看所有记忆
- `/memory global` - 查看全局偏好和经验
- `/memory project` - 查看当前项目记忆
- `/memory add <内容>` - 手动添加记忆条目
- `/memory delete <id>` - 删除指定条目
- `/memory search <关键词>` - 搜索记忆内容
- `/memory sync` - 强制从当前对话提取更新
- `/project <名称>` - 设置/切换当前项目
- `/project status` - 显示项目识别状态

## 意图触发
用户表达以下意图时自动触发记忆操作：
- "更新记忆"、"加入记忆"、"记住这个" → 执行提取
- "我喜欢..."、"下次注意..." → 询问是否加入记忆
- "项目进展..."、"切换项目..." → 更新项目记忆

## 当前记忆概览
{MEMORY_OVERVIEW}

## 使用提示
完成复杂任务或做出重要决策后，建议用户执行 `/memory sync` 或表达"更新记忆"以保存经验。
</MEMORY_CONTEXT>
```

## Memory Overview Template

Generate `{MEMORY_OVERVIEW}` based on current memory state:

### When Memory Exists

```
### 用户偏好 (置信度 > 0.7)
{列出 top 5 高置信度偏好}

### 当前项目: {project_name}
- 进展: {current work}
- 下一步: {next steps}
- 待解决: {open issues}

### 相关经验
{列出与当前任务相关的经验条目}
```

### When Memory Empty

```
记忆系统已初始化但暂无数据。

使用 `/memory add <内容>` 手动添加，或在对话中表达"加入记忆"触发自动提取。
```

## Injection Logic

```javascript
function generateMemoryOverview(memory) {
  if (!memory || !memory.userPreferences) {
    return "记忆系统已初始化但暂无数据。\n\n使用 `/memory add <内容>` 手动添加，或在对话中表达\"加入记忆\"触发自动提取。";
  }
  
  // Get high confidence preferences
  const highConfPrefs = [];
  
  for (const habit of memory.userPreferences.toolHabits || []) {
    if (habit.confidence >= 0.7) {
      highConfPrefs.push(`- 工具习惯: ${habit.content} (置信度: ${habit.confidence.toFixed(2)})`);
    }
  }
  
  for (const pattern of memory.userPreferences.thinkingPatterns || []) {
    if (pattern.confidence >= 0.7) {
      highConfPrefs.push(`- 思维方式: ${pattern.content} (置信度: ${pattern.confidence.toFixed(2)})`);
    }
  }
  
  for (const decision of memory.userPreferences.decisionPatterns || []) {
    if (decision.confidence >= 0.7) {
      highConfPrefs.push(`- 决策模式: ${decision.content} (置信度: ${decision.confidence.toFixed(2)})`);
    }
  }
  
  // Limit to top 5
  const topPrefs = highConfPrefs.slice(0, 5);
  
  // Get current project info
  const currentProject = memory.currentProject || "未设置";
  
  // Build overview
  let overview = "";
  
  if (topPrefs.length > 0) {
    overview += "### 用户偏好 (置信度 > 0.7)\n";
    overview += topPrefs.join("\n") + "\n\n";
  }
  
  overview += `### 当前项目: ${currentProject}\n`;
  
  // Add project memory if available
  // (Would need to load project memory file separately)
  
  return overview;
}
```

## Full Bootstrap Generation

```javascript
function generateBootstrap(memoryPath) {
  const fs = require('fs');
  
  let memory = null;
  if (fs.existsSync(memoryPath)) {
    memory = JSON.parse(fs.readFileSync(memoryPath, 'utf8'));
  }
  
  const overview = generateMemoryOverview(memory);
  
  return `<MEMORY_CONTEXT>
你拥有记忆能力，可以记住用户偏好、经验教训和项目进展。

## 关键命令
- \`/memory\` - 查看所有记忆
- \`/memory global\` - 查看全局偏好和经验
- \`/memory project\` - 查看当前项目记忆
- \`/memory add <内容>\` - 手动添加记忆条目
- \`/memory delete <id>\` - 删除指定条目
- \`/memory search <关键词>\` - 搜索记忆内容
- \`/memory sync\` - 强制从当前对话提取更新
- \`/project <名称>\` - 设置/切换当前项目
- \`/project status\` - 显示项目识别状态

## 意图触发
用户表达以下意图时自动触发记忆操作：
- "更新记忆"、"加入记忆"、"记住这个" → 执行提取
- "我喜欢..."、"下次注意..." → 询问是否加入记忆
- "项目进展..."、"切换项目..." → 更新项目记忆

## 当前记忆概览
${overview}

## 使用提示
完成复杂任务或做出重要决策后，建议用户执行 \`/memory sync\` 或表达"更新记忆"以保存经验。
</MEMORY_CONTEXT>`;
}
```

## Token Budget

Keep bootstrap under 500 tokens for efficiency:

- Command list: ~100 tokens
- Intent triggers: ~100 tokens
- Memory overview: ~200-300 tokens (depending on content)
- Usage tips: ~50 tokens

If memory is large, truncate overview to essential items only.