/**
 * Memory Skill Plugin for OpenCode.ai
 *
 * Injects memory bootstrap context via system prompt transform.
 * Auto-registers skills directory via config hook.
 */

import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Storage locations
const homeDir = os.homedir();
const configDir = path.join(homeDir, '.config/opencode');
const memoryPath = path.join(configDir, 'memory.json');

// Generate memory overview from stored data
const generateMemoryOverview = (memory) => {
  if (!memory || !memory.userPreferences) {
    return '记忆系统已初始化但暂无数据。\n\n使用 `/memory add <内容>` 手动添加，或在对话中表达"加入记忆"触发自动提取。';
  }

  const highConfPrefs = [];

  // Tool habits
  for (const habit of memory.userPreferences.toolHabits || []) {
    if (habit.confidence >= 0.7) {
      highConfPrefs.push(`- 工具习惯: ${habit.content} (置信度: ${habit.confidence.toFixed(2)})`);
    }
  }

  // Thinking patterns
  for (const pattern of memory.userPreferences.thinkingPatterns || []) {
    if (pattern.confidence >= 0.7) {
      highConfPrefs.push(`- 思维方式: ${pattern.content} (置信度: ${pattern.confidence.toFixed(2)})`);
    }
  }

  // Decision patterns
  for (const decision of memory.userPreferences.decisionPatterns || []) {
    if (decision.confidence >= 0.7) {
      highConfPrefs.push(`- 决策模式: ${decision.content} (置信度: ${decision.confidence.toFixed(2)})`);
    }
  }

  const topPrefs = highConfPrefs.slice(0, 5);
  const currentProject = memory.currentProject || '未设置';

  let overview = '';

  if (topPrefs.length > 0) {
    overview += '### 用户偏好 (置信度 > 0.7)\n';
    overview += topPrefs.join('\n') + '\n\n';
  }

  overview += `### 当前项目: ${currentProject}\n`;

  // Add relevant experiences
  const relevantExperiences = (memory.experiences || [])
    .filter(e => e.confidence >= 0.7)
    .slice(0, 3);

  if (relevantExperiences.length > 0) {
    overview += '\n### 相关经验\n';
    for (const exp of relevantExperiences) {
      overview += `- ${exp.type === 'lesson' ? '教训' : exp.type === 'success' ? '成功' : '失败'}: ${exp.insight}\n`;
    }
  }

  return overview;
};

// Generate full bootstrap content
const generateBootstrap = () => {
  let memory = null;

  if (fs.existsSync(memoryPath)) {
    try {
      memory = JSON.parse(fs.readFileSync(memoryPath, 'utf8'));
    } catch (e) {
      // Invalid JSON, treat as empty
      console.error('Failed to parse memory.json:', e.message);
    }
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
};

export const MemoryPlugin = async ({ client, directory }) => {
  const skillsDir = path.resolve(__dirname, '../../skills');

  return {
    // Register skills directory
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir);
      }
    },

    // Inject bootstrap into system prompt
    'experimental.chat.system.transform': async (_input, output) => {
      const bootstrap = generateBootstrap();
      if (bootstrap) {
        (output.system ||= []).push(bootstrap);
      }
    }
  };
};