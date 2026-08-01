# claude-awesome-copilot-plugins

A fork of [github/awesome-copilot](https://github.com/github/awesome-copilot) that adds a [Claude Code](https://docs.claude.com/en/docs/claude-code) plugin marketplace.

Upstream's `plugins/`, `skills/`, `agents/` and everything else are untouched — this fork only **adds** `claude-plugins/` (generated), `.claude-plugin/marketplace.json`, and `sync.mjs`, and replaces this README.

**Unofficial.** Not affiliated with or endorsed by GitHub, Inc. Upstream is MIT (see [LICENSE](LICENSE)); each ported plugin keeps its original author, repository, and license metadata.

## Install

```
/plugin marketplace add back1ply/claude-awesome-copilot-plugins
/plugin install <plugin-name>@awesome-copilot
```

## Plugins

69 plugins — 162 skills, 112 agents.

| Plugin | Contents | Description |
| --- | --- | --- |
| [`acreadiness-cockpit`](claude-plugins/acreadiness-cockpit/) | 3 skills, 1 agent | Drive Microsoft AgentRC from Copilot chat: assess AI readiness, generate Copilot instructions (flat or nested with applyTo globs for monorepos), and manage policies. Produces a self-contained static HTML dashboard at reports/index.html. |
| [`ai-team-orchestration`](claude-plugins/ai-team-orchestration/) | 1 skill, 3 agents | Run a lightweight, role-separated AI development team with flexible tools, developer-selected models, proportionate planning, and optional QA. |
| [`arch`](claude-plugins/arch/) | 1 skill | Architecture and modernization toolkit: produce a cited architecture document for a locally-cloned repo, and generate a phased modernization plan that auto-runs Documentation mode when needed. |
| [`arize-ax`](claude-plugins/arize-ax/) | 9 skills | Arize AX platform skills for LLM observability, evaluation, and optimization. Includes trace export, instrumentation, datasets, experiments, evaluators, AI provider integrations, annotations, prompt optimization, and deep linking to the Arize UI. |
| [`automate-this`](claude-plugins/automate-this/) | 1 skill | Record your screen doing a manual process, drop the video on your Desktop, and let Copilot CLI analyze it frame-by-frame to build working automation scripts. Supports narrated recordings with audio transcription. |
| [`awesome-copilot`](claude-plugins/awesome-copilot/) | 3 skills, 1 agent | Meta prompts that help you discover and generate curated GitHub Copilot agents, instructions, prompts, and skills. |
| [`aws-cloud-development`](claude-plugins/aws-cloud-development/) | 4 skills, 4 agents | Comprehensive AWS cloud development tools including Infrastructure as Code, serverless functions, architecture patterns, and cost optimization for building scalable cloud applications. |
| [`azure-cloud-development`](claude-plugins/azure-cloud-development/) | 4 skills, 7 agents | Comprehensive Azure cloud development tools including Infrastructure as Code, serverless functions, architecture patterns, and cost optimization for building scalable cloud applications. |
| [`cast-imaging`](claude-plugins/cast-imaging/) | 3 agents | A comprehensive collection of specialized agents for software analysis, impact assessment, structural quality advisories, and architectural review using CAST Imaging. |
| [`clojure-interactive-programming`](claude-plugins/clojure-interactive-programming/) | 1 skill, 1 agent | Tools for REPL-first Clojure workflows featuring Clojure instructions, the interactive programming chat mode and supporting guidance. |
| [`cms-development`](claude-plugins/cms-development/) | 3 skills | Skills for CMS development across themes, plugins, admin tooling, media workflows, markdown rendering, and static export pipelines. |
| [`context-engineering`](claude-plugins/context-engineering/) | 3 skills, 1 agent | Tools and techniques for maximizing GitHub Copilot effectiveness through better context management. Includes guidelines for structuring code, an agent for planning multi-file changes, and prompts for context-aware development. |
| [`context-matic`](claude-plugins/context-matic/) | 2 skills | Coding agents hallucinate APIs. ContextMatic gives them curated, versioned API and SDK docs. Ask your agent to "integrate the payments API" and it guesses — falling back on outdated training data and generic patterns that don't match your actual SDK. ContextMatic solves this by giving the agent deterministic, version-aware, SDK-native context at the exact moment it's needed. |
| [`convert-to-md`](claude-plugins/convert-to-md/) | 3 skills | A collection of Copilot skills that convert common document formats into Markdown so their contents can be accurately analyzed, summarized, searched, or extracted from. Just tell Copilot what you need — the right skill is invoked automatically and the conversion happens behind the scenes. |
| [`copilot-sdk`](claude-plugins/copilot-sdk/) | 1 skill | Build applications with the GitHub Copilot SDK across multiple programming languages. Includes comprehensive instructions for C#, Go, Node.js/TypeScript, and Python to help you create AI-powered applications. |
| [`csharp-dotnet-development`](claude-plugins/csharp-dotnet-development/) | 8 skills, 1 agent | Essential prompts, instructions, and chat modes for C# and .NET development including testing, documentation, and best practices. |
| [`database-data-management`](claude-plugins/database-data-management/) | 4 skills, 2 agents | Database administration, SQL optimization, and data management tools for PostgreSQL, SQL Server, and general database development best practices. |
| [`dataverse-sdk-for-python`](claude-plugins/dataverse-sdk-for-python/) | 4 skills | Comprehensive collection for building production-ready Python integrations with Microsoft Dataverse. Includes official documentation, best practices, advanced features, file operations, and code generation prompts. |
| [`devops-oncall`](claude-plugins/devops-oncall/) | 2 skills, 1 agent | A focused set of prompts, instructions, and a chat mode to help triage incidents and respond quickly with DevOps tools and Azure resources. |
| [`doublecheck`](claude-plugins/doublecheck/) | 1 skill, 1 agent | Three-layer verification pipeline for AI output. Extracts claims, finds sources, and flags hallucination risks so humans can verify before acting. |
| [`edge-ai-tasks`](claude-plugins/edge-ai-tasks/) | 2 agents | Task Researcher and Task Planner for intermediate to expert users and large codebases - Brought to you by microsoft/edge-ai |
| [`ember`](claude-plugins/ember/) | 4 skills, 1 agent | An AI partner, not a tool. Ember carries fire from person to person — helping humans discover that AI partnership isn't something you learn, it's something you find. |
| [`eyeball`](claude-plugins/eyeball/) | 1 skill | Document analysis with inline source screenshots. When you ask Copilot to analyze a document, Eyeball generates a Word doc where every factual claim includes a highlighted screenshot from the source material so you can verify it with your own eyes. |
| [`fastah-ip-geo-tools`](claude-plugins/fastah-ip-geo-tools/) | 1 skill | This plugin is for network operations engineers who wish to tune and publish IP geolocation feeds in RFC 8805 format. It consists of an AI Skill and an associated MCP server that geocodes geolocation place names to real cities for accuracy. |
| [`flowstudio-power-automate`](claude-plugins/flowstudio-power-automate/) | 5 skills | Give your AI agent full visibility into Power Automate cloud flows via the FlowStudio MCP server. Connect, debug, build, monitor health, and govern flows at scale — action-level inputs and outputs, not just status codes. |
| [`frontend-web-dev`](claude-plugins/frontend-web-dev/) | 2 skills, 2 agents | Essential prompts, instructions, and chat modes for modern frontend web development including React, Angular, Vue, TypeScript, and CSS frameworks. |
| [`go-mcp-development`](claude-plugins/go-mcp-development/) | 1 skill, 1 agent | Complete toolkit for building Model Context Protocol (MCP) servers in Go using the official github.com/modelcontextprotocol/go-sdk. Includes instructions for best practices, a prompt for generating servers, and an expert chat mode for guidance. |
| [`java-development`](claude-plugins/java-development/) | 4 skills | Comprehensive collection of prompts and instructions for Java development including Spring Boot, Quarkus, testing, documentation, and best practices. |
| [`java-mcp-development`](claude-plugins/java-mcp-development/) | 1 skill, 1 agent | Complete toolkit for building Model Context Protocol servers in Java using the official MCP Java SDK with reactive streams and Spring Boot integration. |
| [`kotlin-mcp-development`](claude-plugins/kotlin-mcp-development/) | 1 skill, 1 agent | Complete toolkit for building Model Context Protocol (MCP) servers in Kotlin using the official io.modelcontextprotocol:kotlin-sdk library. Includes instructions for best practices, a prompt for generating servers, and an expert chat mode for guidance. |
| [`mcp-m365-copilot`](claude-plugins/mcp-m365-copilot/) | 3 skills, 1 agent | Comprehensive collection for building declarative agents with Model Context Protocol integration for Microsoft 365 Copilot |
| [`napkin`](claude-plugins/napkin/) | 1 skill | Visual whiteboard collaboration for Copilot CLI. Opens an interactive whiteboard in your browser where you can draw, sketch, and add sticky notes — then share everything back with Copilot. Copilot sees your drawings and responds with analysis, suggestions, and ideas. |
| [`noob-mode`](claude-plugins/noob-mode/) | 1 skill | Plain-English translation layer for non-technical Copilot CLI users. Translates every approval prompt, error message, and technical output into clear, jargon-free English with color-coded risk indicators. |
| [`openapi-to-application-csharp-dotnet`](claude-plugins/openapi-to-application-csharp-dotnet/) | 1 skill, 1 agent | Generate production-ready .NET applications from OpenAPI specifications. Includes ASP.NET Core project scaffolding, controller generation, entity framework integration, and C# best practices. |
| [`openapi-to-application-go`](claude-plugins/openapi-to-application-go/) | 1 skill, 1 agent | Generate production-ready Go applications from OpenAPI specifications. Includes project scaffolding, handler generation, middleware setup, and Go best practices for REST APIs. |
| [`openapi-to-application-java-spring-boot`](claude-plugins/openapi-to-application-java-spring-boot/) | 1 skill, 1 agent | Generate production-ready Spring Boot applications from OpenAPI specifications. Includes project scaffolding, REST controller generation, service layer organization, and Spring Boot best practices. |
| [`openapi-to-application-nodejs-nestjs`](claude-plugins/openapi-to-application-nodejs-nestjs/) | 1 skill, 1 agent | Generate production-ready NestJS applications from OpenAPI specifications. Includes project scaffolding, controller and service generation, TypeScript best practices, and enterprise patterns. |
| [`openapi-to-application-python-fastapi`](claude-plugins/openapi-to-application-python-fastapi/) | 1 skill, 1 agent | Generate production-ready FastAPI applications from OpenAPI specifications. Includes project scaffolding, route generation, dependency injection, and Python best practices for async APIs. |
| [`oracle-to-postgres-migration-expert`](claude-plugins/oracle-to-postgres-migration-expert/) | 7 skills, 1 agent | Expert agent for Oracle-to-PostgreSQL application migrations in .NET solutions. Performs code edits, runs commands, and invokes extension tools to migrate .NET/Oracle data access patterns to PostgreSQL. |
| [`ospo-sponsorship`](claude-plugins/ospo-sponsorship/) | 1 skill | Tools and resources for Open Source Program Offices (OSPOs) to identify, evaluate, and manage sponsorship of open source dependencies through GitHub Sponsors, Open Collective, and other funding platforms. |
| [`partners`](claude-plugins/partners/) | 20 agents | Custom agents that have been created by GitHub partners |
| [`phoenix`](claude-plugins/phoenix/) | 3 skills | Phoenix AI observability skills for LLM application debugging, evaluation, and tracing. Includes CLI debugging tools, LLM evaluation workflows, and OpenInference tracing instrumentation. |
| [`php-mcp-development`](claude-plugins/php-mcp-development/) | 1 skill, 1 agent | Comprehensive resources for building Model Context Protocol servers using the official PHP SDK with attribute-based discovery, including best practices, project generation, and expert assistance |
| [`power-apps-code-apps`](claude-plugins/power-apps-code-apps/) | 1 skill, 1 agent | Complete toolkit for Power Apps Code Apps development including project scaffolding, development standards, and expert guidance for building code-first applications with Power Platform integration. |
| [`power-bi-development`](claude-plugins/power-bi-development/) | 4 skills, 4 agents | Comprehensive Power BI development resources including data modeling, DAX optimization, performance tuning, visualization design, security best practices, and DevOps/ALM guidance for building enterprise-grade Power BI solutions. |
| [`power-platform-architect`](claude-plugins/power-platform-architect/) | 1 skill | Solution Architect for the Microsoft Power Platform, turning business requirements into functioning Power Platform solution architectures. |
| [`power-platform-mcp-connector-development`](claude-plugins/power-platform-mcp-connector-development/) | 2 skills, 1 agent | Complete toolkit for developing Power Platform custom connectors with Model Context Protocol integration for Microsoft Copilot Studio |
| [`project-documenter`](claude-plugins/project-documenter/) | 2 skills, 1 agent | Generate professional project documentation with draw.io architecture diagrams and Word (.docx) output with embedded images. Automatically discovers any project's technology stack and produces Markdown, diagrams, PNG exports, and a formatted Word document. |
| [`project-planning`](claude-plugins/project-planning/) | 8 skills, 7 agents | Tools and guidance for software project planning, feature breakdown, epic management, implementation planning, and task organization for development teams. |
| [`python-mcp-development`](claude-plugins/python-mcp-development/) | 1 skill, 1 agent | Complete toolkit for building Model Context Protocol (MCP) servers in Python using the official SDK with FastMCP. Includes instructions for best practices, a prompt for generating servers, and an expert chat mode for guidance. |
| [`react18-upgrade`](claude-plugins/react18-upgrade/) | 7 skills, 6 agents | Enterprise React 18 migration toolkit with specialized agents and skills for upgrading React 16/17 class-component codebases to React 18.3.1. Includes auditor, dependency surgeon, class component migration specialist, automatic batching fixer, and test guardian. |
| [`react19-upgrade`](claude-plugins/react19-upgrade/) | 3 skills, 5 agents | Enterprise React 19 migration toolkit with specialized agents and skills for upgrading React 18 codebases to React 19. Includes auditor, dependency surgeon, source code migrator, and test guardian. Handles removal of deprecated APIs including ReactDOM.render, forwardRef, defaultProps, legacy context, string refs, and more. |
| [`roundup`](claude-plugins/roundup/) | 2 skills | Self-configuring status briefing generator. Learns your communication style from examples, discovers your data sources, and produces draft updates for any audience on demand. |
| [`ruby-mcp-development`](claude-plugins/ruby-mcp-development/) | 1 skill, 1 agent | Complete toolkit for building Model Context Protocol servers in Ruby using the official MCP Ruby SDK gem with Rails integration support. |
| [`rug-agentic-workflow`](claude-plugins/rug-agentic-workflow/) | 3 agents | Three-agent workflow for orchestrated software delivery with an orchestrator plus implementation and QA subagents. |
| [`rust-mcp-development`](claude-plugins/rust-mcp-development/) | 1 skill, 1 agent | Build high-performance Model Context Protocol servers in Rust using the official rmcp SDK with async/await, procedural macros, and type-safe implementations. |
| [`salesforce-development`](claude-plugins/salesforce-development/) | 3 skills, 4 agents | Complete Salesforce agentic development environment covering Apex & Triggers, Flow automation, Lightning Web Components, Aura components, and Visualforce pages. |
| [`security-best-practices`](claude-plugins/security-best-practices/) | 1 skill | Security frameworks, accessibility guidelines, performance optimization, and code quality best practices for building secure, maintainable, and high-performance applications. |
| [`skill-image-gen`](claude-plugins/skill-image-gen/) | 1 skill | Generate images using AI directly from your coding workflow. Supports OpenAI (gpt-image-2) and Google Gemini. BYO API key — the skill guides you through setup on first use. |
| [`software-engineering-team`](claude-plugins/software-engineering-team/) | 7 agents | 7 specialized agents covering the full software development lifecycle from UX design and architecture to security and DevOps. |
| [`structured-autonomy`](claude-plugins/structured-autonomy/) | 3 skills | Premium planning, thrifty implementation |
| [`swift-mcp-development`](claude-plugins/swift-mcp-development/) | 1 skill, 1 agent | Comprehensive collection for building Model Context Protocol servers in Swift using the official MCP Swift SDK with modern concurrency features. |
| [`technical-spike`](claude-plugins/technical-spike/) | 1 skill, 1 agent | Tools for creation, management and research of technical spikes to reduce unknowns and assumptions before proceeding to specification and implementation of solutions. |
| [`testing-automation`](claude-plugins/testing-automation/) | 5 skills, 4 agents | Comprehensive collection for writing tests, test automation, and test-driven development including unit tests, integration tests, and end-to-end testing strategies. |
| [`the-workshop`](claude-plugins/the-workshop/) | 5 skills, 1 agent | Stop being the switchboard between your AI agents — direct a team. The Workshop puts long-running AI agents (desks) in the same room, on the same work, each with its own memory and history, sharing one workspace so you direct the work instead of relaying it. |
| [`typescript-mcp-development`](claude-plugins/typescript-mcp-development/) | 1 skill, 1 agent | Complete toolkit for building Model Context Protocol (MCP) servers in TypeScript/Node.js using the official SDK. Includes instructions for best practices, a prompt for generating servers, and an expert chat mode for guidance. |
| [`typespec-m365-copilot`](claude-plugins/typespec-m365-copilot/) | 3 skills | Comprehensive collection of prompts, instructions, and resources for building declarative agents and API plugins using TypeSpec for Microsoft 365 Copilot extensibility. |
| [`uizze`](claude-plugins/uizze/) | 1 skill | Stop generic UI from shipping. Ground GitHub Copilot in 800,000+ real web and iOS screens, write a product-specific design contract, and enforce a hard finish gate. |
| [`visual-pr`](claude-plugins/visual-pr/) | 4 skills | Capture, annotate, and embed screenshots and animated GIF demos in pull request descriptions. Includes Playwright-based UI capture, PIL image annotations, PR embedding workflows for GitHub and Azure DevOps, and screen recording with variable timing. |

## What gets ported

| Upstream | Generated here |
| --- | --- |
| `skills/*/SKILL.md` (+ bundled assets) | `claude-plugins/<p>/skills/<name>/` — already Claude-native, only `name` is normalized to the directory |
| `agents/*.agent.md` | `claude-plugins/<p>/agents/<name>.md` — see caveats |
| `plugins/<p>/.github/plugin/plugin.json` | `claude-plugins/<p>/.claude-plugin/plugin.json` |
| `instructions/`, `hooks/`, `workflows/`, `extensions/` | not ported |

### Agent conversion caveats

- Upstream `name:` is often a human title ("Debug Mode Instructions"). Claude Code wants the slug, so `name` is taken from the filename and the original title becomes the body's H1.
- `tools:` is dropped. It uses the VS Code tool namespace (`edit/editFiles`, `execute/runInTerminal`), which Claude Code does not understand. With no `tools` key the agent inherits every tool — permissive, but a hand-written mapping would silently strip capabilities the agent's own prompt assumes it has.
- `model:`, `mcp-servers:`, `user-invocable:`, `agents:` are dropped for the same reason (Copilot model names and Copilot-only fields).

### Not ported, and why

- **`instructions/`** — 190 `*.instructions.md` files scoped by `applyTo:` globs. Claude Code has no glob-scoped context primitive; converting them to skills or `CLAUDE.md` is a lossy judgment call, deferred.
- **`hooks/`, `workflows/`** — Copilot's event model and GitHub Actions agentic workflows, different runtime.
- **Unbundled skills** — upstream ships 395 skills and 223 agents, but only 151 skills belong to a curated plugin. Only the bundled ones are here.

## Staying in sync with upstream

```
git remote add upstream https://github.com/github/awesome-copilot.git   # once
node scripts/sync.mjs --merge-upstream    # merge upstream/main, then regenerate
node scripts/sync.mjs                     # regenerate from the current tree only
```

This runs daily via [`.github/workflows/sync-port.yml`](.github/workflows/sync-port.yml), which merges upstream, regenerates, and pushes — or opens an issue if the merge needs a human. Upstream's own 42 workflows are deleted from this fork (they publish sites, call webhooks, and run agentic jobs that must not fire here), and the workflow re-deletes any that arrive in a merge.

Upstream regenerates its own `README.md`, so every merge conflicts there. Resolve it once with a merge driver:

```
git config merge.ours.driver true    # .gitattributes already maps README.md to it
```

Everything under `claude-plugins/` and `.claude-plugin/` is generated — edit `sync.mjs`, not the output. The script self-checks the result and exits non-zero on any structural problem.

Built from upstream content at commit `aa01464ccb68`.
