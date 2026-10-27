# LLM工具调用面试题介绍

大家好，我是小林。

做 AI 应用，光让大模型能聊天是远远不够的，你得让它能「干活」，能查数据库、能调 API、能操作文件，这些能力的背后就是工具调用。Function Calling、MCP、A2A 这些概念现在面试里问得越来越多，但我发现很多同学对它们的理解还停留在「都是调工具的」这个层面，一追问就分不清谁是谁了，更别说解释它们之间的层级关系了。

所以我结合收集到的真实面经，整理了 22 道工具调用方向的面试题，帮大家把从 Function Calling 到 MCP 再到 A2A 这条线完整地捋清楚。涵盖 Function Calling 原理与训练、MCP 协议架构与通信、SSE/WebSocket/WebRTC 通信协议对比、A2A 协议、Skill 概念、LLM 网关、Tool Routing、工具调用容错、CLI 封装与选型、代码执行沙箱和 Skill 加载等面试题。

写法跟 Agent 和 RAG 专题一样，每道题开头都是一段「面试翻车现场」，让你先感受一下踩雷是什么体验，然后我再一步步把知识点从根上讲透。不是让你背标准答案，而是让你真正理解这些概念之间的关系，面试官换个角度问你也能自己推出来。

## 题目目录

下面简单介绍一下这 22 道题大概聊了些什么，你可以挑自己不熟的先看。

前三道聊的是 **Function Calling 基础**，Function Calling 到底是什么、模型是怎么学会调工具的、训练过程具体是怎样的。这三道题是整个工具调用体系的地基，很多人只知道「模型能调工具」，但说不清楚模型输出的是什么格式、谁负责决策谁负责执行、训练数据长什么样，面试官一追问就露馅了。

第 4 到第 5 题聊的是 **MCP 协议**，MCP 是什么、由哪几部分组成。MCP 现在是 AI 工具生态最热门的话题，理解了 MCP 的架构和组成，后面的对比和选型才有基础。

第 6 到第 8 题聊的是 **FC 与 MCP 的对比和选型**，两者到底有什么区别、什么场景该用哪个、为什么有些推理模型不支持 MCP。这块是面试里最容易拉开差距的部分，因为大部分人只会单独解释每个概念，但说不清楚它们之间的关系和选型依据。

第 9 到第 11 题聊的是 **Agent Skill**，Skill 是什么、Skill 和 MCP 有什么区别、Function Calling/Skill/MCP 三者到底是什么关系。Skill 是 Anthropic 在 2025 年 10 月推出、12 月开源为跨平台规范的概念，把使用工具完成任务的知识和流程打包成可复用模块，和 MCP 提供的工具能力形成互补。理解了这三层架构（FC 是语言、MCP 是工具箱、Skill 是操作手册），你对整个工具调用体系就有全局视角了。

第 12 题聊的是 **A2A 协议**，A2A 是什么、跟 MCP 有什么区别。A2A 是 Google 在 2025 年 4 月推出的 Agent 间协作协议（后来捐给 Linux 基金会维护），和 MCP 的「Agent 连工具」不同，A2A 解决的是「Agent 连 Agent」的问题，属于进阶内容。

第 13 到第 15 题聊的是 **通信协议**，MCP 用什么通信方式、SSE 和 WebSocket 的区别、WebRTC 和 WebSocket 在 AI 对话场景里的差异。这几道题偏底层实现，面试官有时会从 MCP 架构往下追问到通信协议层，提前准备好能让你接住这条追问链。

第 16 到第 18 题聊的是 **工具调用的生产实践**：LLM 网关统一模型入口，Tool Routing 负责从大量工具中缩小候选集，容错机制处理格式错误、超时、重试、熔断和副作用。这三道题都偏工程实践，做过线上项目的同学答起来会很有优势。

第 19 到第 22 题聊的是**工具接入与执行环境**。工具流程为什么封装成 CLI，什么情况下接入 MCP，代码执行沙箱怎样控制文件、网络和资源权限，以及 Skill 怎样从目录发现走到按需加载，这几道题把工具落地时的关键工程选择展开说明。

- [1. 什么是 Function Calling？原理是什么？](1_function_calling.md)

- [2. LLM 是如何学会调用外部工具的？](2_llm_tool_learning.md)

- [3. 大模型的 Function Call 能力是怎么训练出来的？](3_fc_training.md)

- [4. 什么是 MCP（模型上下文协议）？讲讲它的核心内容？](4_what_is_mcp.md)

- [5. MCP 由哪几部分组成？](5_mcp_components.md)

- [6. MCP 和 Function Calling 有什么区别？有没有实际跑过 MCP？](6_mcp_vs_fc.md)

- [7. Function Calling 也属于工具调用，请问什么场景下使用 Function Calling，什么场景下使用 MCP？](7_fc_vs_mcp_usage.md)

- [8. 为什么有些特定的推理模型不支持 MCP 协议？](8_reasoning_no_mcp.md)

- [9. Skill 是什么？](9_skill.md)

- [10. MCP 和 Agent Skill 的区别是什么？](10_mcp_vs_skill.md)

- [11. Function Calling、Skill、MCP 这三个有什么区别？](11_fc_skill_mcp.md)

- [12. 什么是 A2A 协议？它和 MCP 协议的区别是什么？](12_a2a_protocol.md)

- [13. MCP 协议通常采用什么通信方式？](13_mcp_transport.md)

- [14. 说说 WebSocket 和 SSE 通信的区别及局限性？](14_sse_vs_websocket.md)

- [15. 为什么要用 WebRTC 协议？它和 WebSocket 在 AI 对话流中的核心差异是什么？](15_webrtc_vs_ws.md)

- [16. 有没有用过大模型的网关框架？网关层解决了什么问题？](16_llm_gateway.md)

- [17. 工具很多时，Agent 如何做 Tool Routing，减少 Token 并避免选错工具？](17_tool_routing.md)

- [18. 工具调用格式非法、参数错误、超时或失败时，Agent 如何容错？](18_tool_reliability.md)

- [19. 为什么要把 Agent 的工具执行流程封装成 CLI？](19_cli_packaging.md)

- [20. Agent 接入工具时应该如何选择 CLI 或 MCP？](20_cli_vs_mcp.md)

- [21. Agent 的代码执行沙箱应该如何设计？](21_execution_sandbox.md)

- [22. Agent 的 Skill 加载机制是如何实现的？](22_skill_loading.md)
