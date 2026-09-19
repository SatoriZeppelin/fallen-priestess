原始 SillyTavern 正则「主脚本」备份。网页已拆到上级目录，不必再导入 `regex-主脚本.json`。

多 LLM 角色短预设（与 `interface/llm-orchestrator.js` 内置提示一致）：

- `role-world.md`：地点 / 同行
- `role-story.md`：正文（禁止 `_.set`）
- `role-stats.md`：数值增量
- `role-meta.md`：分支 + 快照
