# 使用 Claude Code 做数据分析

## 实现原理

1. 使用 Claude Code 写了一个用 HTML 模拟幻灯片的“脚手架”，在`/report/slides`文件夹内添加网页，即可增加一页“幻灯片”
2.使用`CLAUDE.md`约束了一个“数据分析Planner”，分析任务、分配任务，考虑到大量数据、Python 代码和网页生成肯定很快塞满上下文，所以捏了两个 Agents
3. 在`.claude/agent`中，一个是写代码分析数据的，一个是根据分析结果构建可视化呈现的
4. 调度还有很大的优化空间，此刻只有 K2 能扎扎实实的按计划分配、执行、反馈、审视。

## 使用方法
1. 把要分析的表格放在`/data`文件下
2. 打开 Claude Code，说需求就好了
3. 待到 Claude Code 干完，进入`/report`文件，运行`start-server.sh`(Mac)或`start-server.bat`(win)即可在浏览器展示最终报告
4. 如有特殊分析需求，可以在`CLAUDE.md`增删提示词

## PS
- ~~应该是跨域问题，Pages 不能正常加载 slides 中的网页文件，遗憾~~好了，可能是网络问题……
- 感兴趣可以 clone 到本地，起个服务感受一下~
