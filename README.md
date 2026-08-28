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

49 plugins — 607 skills, 221 agents.

| Plugin | Contents | Description |
| --- | --- | --- |
| [`extras-gem-team`](claude-plugins/extras-gem-team/) | 1 skill, 13 agents | The gem-team multi-agent suite: planning, implementation, review, testing and design agents. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-salesforce`](claude-plugins/extras-salesforce/) | 3 skills, 5 agents | Salesforce: Apex, Lightning Web Components and Flow. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-power-platform`](claude-plugins/extras-power-platform/) | 18 skills, 6 agents | Power BI, Power Apps, Power Platform and Dataverse. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-azure`](claude-plugins/extras-azure/) | 20 skills, 17 agents | Azure architecture, IaC, diagnostics and platform services. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-aws`](claude-plugins/extras-aws/) | 6 skills, 6 agents | AWS architecture, cost and diagnostics. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-dotnet`](claude-plugins/extras-dotnet/) | 23 skills, 8 agents | .NET, C# and Windows desktop development. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-java-jvm`](claude-plugins/extras-java-jvm/) | 15 skills, 2 agents | Java, Kotlin and Spring development. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-python`](claude-plugins/extras-python/) | 7 skills, 3 agents | Python development, packaging and tooling. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-web-frontend`](claude-plugins/extras-web-frontend/) | 24 skills, 27 agents | Frontend frameworks, UI design, accessibility and CMS platforms. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-data-sql`](claude-plugins/extras-data-sql/) | 27 skills, 8 agents | SQL, NoSQL, vector databases and data modelling. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-security`](claude-plugins/extras-security/) | 14 skills, 5 agents | Security review, threat modelling, compliance and supply-chain checks. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-devops-ci`](claude-plugins/extras-devops-ci/) | 15 skills, 13 agents | CI/CD, infrastructure, observability and incident response. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-other-languages`](claude-plugins/extras-other-languages/) | 5 skills, 7 agents | Go, Rust, Ruby, PHP, Scala, Clojure, Dart, Swift and C++. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-linux-systems`](claude-plugins/extras-linux-systems/) | 14 skills, 4 agents | Linux and PowerShell administration, shell tooling and local developer utilities. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-copilot-github`](claude-plugins/extras-copilot-github/) | 17 skills | GitHub and Copilot platform workflows. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-codebase-analysis`](claude-plugins/extras-codebase-analysis/) | 16 skills, 1 agent | Understanding an unfamiliar codebase: blueprints, tours and context maps. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-learning-teaching`](claude-plugins/extras-learning-teaching/) | 11 skills, 4 agents | Learning, mentoring, interview prep and career workflows. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-content-media`](claude-plugins/extras-content-media/) | 25 skills, 2 agents | Document conversion, image generation and writing-style tools. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-research-analysis`](claude-plugins/extras-research-analysis/) | 7 skills, 3 agents | Research, competitive analysis and reporting. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-ai-agents`](claude-plugins/extras-ai-agents/) | 37 skills, 15 agents | Building agents: MCP servers, prompt engineering, evals and observability. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-docs-writing`](claude-plugins/extras-docs-writing/) | 21 skills, 8 agents | Documentation, specifications and diagrams. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-project-planning`](claude-plugins/extras-project-planning/) | 18 skills, 7 agents | Requirements, planning, breakdowns and retrospectives. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-testing`](claude-plugins/extras-testing/) | 7 skills, 7 agents | Test authoring, migration and coverage. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-gtm-business`](claude-plugins/extras-gtm-business/) | 11 skills | Go-to-market, positioning, pricing and launch playbooks. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-git-workflow`](claude-plugins/extras-git-workflow/) | 11 skills, 3 agents | Commits, branches, code review and refactoring workflows. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`extras-coding-agents`](claude-plugins/extras-coding-agents/) | 42 skills, 47 agents | General-purpose engineering agents, reviewer personas and assorted skills. Community skills and agents from github/awesome-copilot that no upstream plugin bundles. |
| [`instructions-pcf`](claude-plugins/instructions-pcf/) | 17 skills | Coding conventions and best-practice guidance for power Apps Component Framework (PCF) code components. Ported from github/awesome-copilot custom instructions. |
| [`instructions-salesforce`](claude-plugins/instructions-salesforce/) | 2 skills | Coding conventions and best-practice guidance for salesforce: Apex, Lightning Web Components and Flow. Ported from github/awesome-copilot custom instructions. |
| [`instructions-power-platform`](claude-plugins/instructions-power-platform/) | 24 skills | Coding conventions and best-practice guidance for power BI, Power Apps, Power Platform and Dataverse. Ported from github/awesome-copilot custom instructions. |
| [`instructions-azure`](claude-plugins/instructions-azure/) | 13 skills | Coding conventions and best-practice guidance for azure architecture, IaC, diagnostics and platform services. Ported from github/awesome-copilot custom instructions. |
| [`instructions-aws`](claude-plugins/instructions-aws/) | 1 skill | Coding conventions and best-practice guidance for aWS architecture, cost and diagnostics. Ported from github/awesome-copilot custom instructions. |
| [`instructions-dotnet`](claude-plugins/instructions-dotnet/) | 17 skills | Coding conventions and best-practice guidance for .NET, C# and Windows desktop development. Ported from github/awesome-copilot custom instructions. |
| [`instructions-java-jvm`](claude-plugins/instructions-java-jvm/) | 12 skills | Coding conventions and best-practice guidance for java, Kotlin and Spring development. Ported from github/awesome-copilot custom instructions. |
| [`instructions-python`](claude-plugins/instructions-python/) | 4 skills | Coding conventions and best-practice guidance for python development, packaging and tooling. Ported from github/awesome-copilot custom instructions. |
| [`instructions-web-frontend`](claude-plugins/instructions-web-frontend/) | 14 skills | Coding conventions and best-practice guidance for frontend frameworks, UI design, accessibility and CMS platforms. Ported from github/awesome-copilot custom instructions. |
| [`instructions-data-sql`](claude-plugins/instructions-data-sql/) | 4 skills | Coding conventions and best-practice guidance for sQL, NoSQL, vector databases and data modelling. Ported from github/awesome-copilot custom instructions. |
| [`instructions-security`](claude-plugins/instructions-security/) | 2 skills | Coding conventions and best-practice guidance for security review, threat modelling, compliance and supply-chain checks. Ported from github/awesome-copilot custom instructions. |
| [`instructions-devops-ci`](claude-plugins/instructions-devops-ci/) | 8 skills | Coding conventions and best-practice guidance for cI/CD, infrastructure, observability and incident response. Ported from github/awesome-copilot custom instructions. |
| [`instructions-other-languages`](claude-plugins/instructions-other-languages/) | 20 skills | Coding conventions and best-practice guidance for go, Rust, Ruby, PHP, Scala, Clojure, Dart, Swift and C++. Ported from github/awesome-copilot custom instructions. |
| [`instructions-linux-systems`](claude-plugins/instructions-linux-systems/) | 8 skills | Coding conventions and best-practice guidance for linux and PowerShell administration, shell tooling and local developer utilities. Ported from github/awesome-copilot custom instructions. |
| [`instructions-copilot-github`](claude-plugins/instructions-copilot-github/) | 4 skills | Coding conventions and best-practice guidance for gitHub and Copilot platform workflows. Ported from github/awesome-copilot custom instructions. |
| [`instructions-codebase-analysis`](claude-plugins/instructions-codebase-analysis/) | 1 skill | Coding conventions and best-practice guidance for understanding an unfamiliar codebase: blueprints, tours and context maps. Ported from github/awesome-copilot custom instructions. |
| [`instructions-content-media`](claude-plugins/instructions-content-media/) | 1 skill | Coding conventions and best-practice guidance for document conversion, image generation and writing-style tools. Ported from github/awesome-copilot custom instructions. |
| [`instructions-ai-agents`](claude-plugins/instructions-ai-agents/) | 9 skills | Coding conventions and best-practice guidance for building agents: MCP servers, prompt engineering, evals and observability. Ported from github/awesome-copilot custom instructions. |
| [`instructions-docs-writing`](claude-plugins/instructions-docs-writing/) | 6 skills | Coding conventions and best-practice guidance for documentation, specifications and diagrams. Ported from github/awesome-copilot custom instructions. |
| [`instructions-project-planning`](claude-plugins/instructions-project-planning/) | 1 skill | Coding conventions and best-practice guidance for requirements, planning, breakdowns and retrospectives. Ported from github/awesome-copilot custom instructions. |
| [`instructions-testing`](claude-plugins/instructions-testing/) | 3 skills | Coding conventions and best-practice guidance for test authoring, migration and coverage. Ported from github/awesome-copilot custom instructions. |
| [`instructions-git-workflow`](claude-plugins/instructions-git-workflow/) | 2 skills | Coding conventions and best-practice guidance for commits, branches, code review and refactoring workflows. Ported from github/awesome-copilot custom instructions. |
| [`instructions-coding-agents`](claude-plugins/instructions-coding-agents/) | 19 skills | Coding conventions and best-practice guidance for general-purpose engineering agents, reviewer personas and assorted skills. Ported from github/awesome-copilot custom instructions. |

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

- **`instructions/`** — 192 `*.instructions.md` files scoped by `applyTo:` globs. Claude Code has no glob-scoped context primitive; converting them to skills or `CLAUDE.md` is a lossy judgment call, deferred.
- **`hooks/`, `workflows/`** — Copilot's event model and GitHub Actions agentic workflows, different runtime.
- **Unbundled skills** — upstream ships 415 skills and 221 agents, but only 607 skills belong to a curated plugin. Only the bundled ones are here.

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

Built from upstream content at commit `f11a4e441c5f`.
