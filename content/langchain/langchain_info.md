# LangChain 框架面试题介绍

大家好，我是小林。

只要面的是大模型应用开发或者 Python Agent 开发岗位，LangChain 基本都是绕不开的话题。面试官可能先问一句「你用过哪些 Agent 框架」，但只要你回答用过 LangChain，后面往往就会一路追问 Chain、Tools、Memory、LangGraph，甚至继续问到框架选型和版本演进。

这类题最容易踩的坑，就是只会照着教程把 Demo 跑起来，却说不清楚框架为什么这么设计。比如把 Chain 理解成简单的 Prompt 加模型，把记忆理解成保存聊天记录，或者还拿旧版的 AgentExecutor 回答 LangChain v1 的问题。第一问看起来答上了，面试官换个角度一追问，理解上的漏洞马上就暴露出来了。

每道题仍然会从「面试翻车现场」开始。先看看一个听起来像懂了、实际上经不起追问的回答，再顺着面试官的问题一层层拆解。等你理解了为什么这么设计，即使面试官换一种问法，也能沿着自己的思路把答案讲清楚。

## 题目目录

下面简单说一下这 12 道题分别在解决什么问题，第一次看的林友建议按照顺序阅读。

前面三道先打好**基础认知和底层原理**。你会先分清 LangChain、LangGraph、LlamaIndex 这些常见框架各自解决什么问题，再理解 Chain、Runnable 和 LCEL 的关系，最后顺着模型协议、消息、工具调用和 Agent loop，看清 LangChain v1 的底层架构。

第 4 到第 6 题进入**工程实现**。这部分不再停留在「框架有哪些组件」，而是把一个 Agent 怎样从任务边界走到可运行系统讲清楚，包括如何选择和注册工具、如何管理短期状态，以及如何把真正有价值的信息沉淀为长期记忆。

第 7 到第 10 题重点讨论**框架选型和复杂编排**。LangChain 与 LlamaIndex 的设计重心有什么不同，Java 项目为什么会选择 LangChain4j，LangChain 与 LangGraph 到底是什么关系，以及什么情况下值得直接使用 LangGraph，这些都是面试官判断你有没有真实选型经验的高频问题。

最后两道属于**架构演进和高级能力**。一方面要理解 LangChain 为什么从旧式 Chain 和 AgentExecutor 逐步走向 Runnable、LangGraph 与 middleware，另一方面也要看懂 Deep Research 怎样把任务拆分、并行检索、证据核验和报告合成组织成完整研究流程。

- [1. 你了解过哪些 AI Agent 开发框架？](agent_frameworks.md)
- [2. 如何理解 LangChain 中的 Chain？](chain.md)
- [3. LangChain 的底层架构与实现原理是什么？](langchain_architecture.md)
- [4. 使用 LangChain 构建 Agent 的核心步骤是什么？](build_agent.md)
- [5. 在 LangChain 中，如何为 Agent 注册工具？](tool_registration.md)
- [6. LangChain 如何实现短期记忆和长期记忆？](memory.md)
- [7. LangChain 和 LlamaIndex 有什么区别？](langchain_vs_llamaindex.md)
- [8. LangChain4j 主要解决了哪些问题？](langchain4j.md)
- [9. LangChain 和 LangGraph 的核心区别是什么？](langchain_vs_langgraph.md)
- [10. LangGraph 相比于 LangChain 有哪些核心优势？](langgraph_advantages.md)
- [11. LangChain 大版本升级有哪些核心变化？](version_evolution.md)
- [12. Deep Research 的实现逻辑和适用场景是什么？](deep_research.md)
