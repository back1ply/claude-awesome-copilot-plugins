#!/usr/bin/env node
// Regenerates the Claude Code port from this fork's own awesome-copilot tree.
// Reads plugins/, skills/, agents/ (upstream's, untouched) and writes
// claude-plugins/ + .claude-plugin/marketplace.json. Idempotent.
//
//   node scripts/sync.mjs                    # regenerate from the current tree
//   node scripts/sync.mjs --merge-upstream   # git fetch + merge upstream/main first
//
// ponytail: no deps, no YAML lib. Frontmatter is rewritten line-wise with
// block awareness (a top-level `key:` owns every following indented line).

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const UPSTREAM = ROOT; // this repo is a fork — upstream's tree is already here
const OUT_DIR = "claude-plugins"; // upstream already owns ./plugins
const OUT_PLUGINS = path.join(ROOT, OUT_DIR);
const MARKETPLACE = path.join(ROOT, ".claude-plugin", "marketplace.json");
const GROUPS = path.join(ROOT, "scripts", "groups.json");

const MARKETPLACE_OWNER = { name: "Shehab", url: "https://github.com/back1ply" };
const REPO_URL = "https://github.com/back1ply/claude-awesome-copilot-plugins";

// Frontmatter keys that survive the port. Everything else is Copilot/VS Code
// specific: `tools` uses the VS Code tool namespace (edit/editFiles), `model`
// names models Claude Code does not know, `mcp-servers`/`user-invocable`/
// `agents` have no Claude equivalent. Dropping `tools` means the agent
// inherits all tools — permissive, but a lossy hand-mapping would silently
// remove capabilities the agent's own prompt assumes it has.
const AGENT_KEEP = new Set(["description"]);

const log = (...a) => console.log(...a);

const git = (...args) => execFileSync("git", ["-C", ROOT, ...args], { stdio: "inherit" });

function mergeUpstream() {
  log("Merging upstream/main...");
  git("fetch", "upstream", "main");
  git("merge", "upstream/main");
}

/** Last commit that touched an upstream source dir — what the port was built from. */
function upstreamSha() {
  try {
    return execFileSync("git", ["-C", ROOT, "log", "-1", "--format=%H", "--", "plugins", "skills", "agents"], {
      encoding: "utf8",
    }).trim();
  } catch {
    return "unknown";
  }
}

const unquote = (s) => s.trim().replace(/^['"]|['"]$/g, "");

/** Split a markdown file into [frontmatterLines, body]. */
function splitFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return [null, text];
  return [m[1].split(/\r?\n/), text.slice(m[0].length)];
}

/**
 * Walk frontmatter lines, calling fn(key, line, isKeyLine) for each.
 * A line starting with whitespace (or `- `) belongs to the last top-level key.
 */
function eachFrontmatterLine(lines, fn) {
  let key = null;
  for (const line of lines) {
    const m = line.match(/^([A-Za-z0-9_-]+):(.*)$/);
    if (m) {
      key = m[1];
      fn(key, line, m[2]);
    } else {
      fn(key, line, null);
    }
  }
}

function rewriteAgent(text, slug) {
  const [fmLines, body] = splitFrontmatter(text);
  const kept = [];
  let title = null;
  if (fmLines) {
    eachFrontmatterLine(fmLines, (key, line, value) => {
      if (key === "name" && value !== null) title = unquote(value);
      if (key && AGENT_KEEP.has(key)) kept.push(line);
    });
  }
  // Upstream `name:` is often a human title ("Debug Mode Instructions"), not a
  // slug. Claude wants the slug; the title moves into the body as an H1.
  // Claude Code selects subagents by description, so an agent without one is
  // unusable — fall back to its title (one upstream agent ships without it).
  if (!kept.some((l) => l.startsWith("description:"))) {
    kept.push(`description: ${title ?? slug.replace(/-/g, " ")}`);
  }
  const fm = ["---", `name: ${slug}`, ...kept, "---"].join("\n");
  let out = body.replace(/^\s+/, "");
  if (title && title !== slug && !out.startsWith("#")) out = `# ${title}\n\n${out}`;
  return `${fm}\n\n${out.trimEnd()}\n`;
}

/** Skills are already Claude-native; only force `name` to match the directory. */
function rewriteSkill(text, slug) {
  const [fmLines, body] = splitFrontmatter(text);
  if (!fmLines) return `---\nname: ${slug}\n---\n\n${text.trimStart()}`;
  let seenName = false;
  const out = [];
  eachFrontmatterLine(fmLines, (key, line, value) => {
    if (key === "name" && value !== null) {
      seenName = true;
      out.push(`name: ${slug}`);
      return;
    }
    if (key === "name" && value === null) return; // continuation of a name block
    out.push(line);
  });
  if (!seenName) out.unshift(`name: ${slug}`);
  return `---\n${out.join("\n")}\n---\n\n${body.replace(/^\s+/, "")}`;
}

// Upstream ships far more skills and agents than its curated plugins reference.
// The strays get grouped into `extras-*` plugins by name. Assignments live in
// scripts/groups.json so they can be corrected by hand; these rules only decide
// where an item lands the first time it appears upstream.
const BUCKETS = [
  ["gem-team", /^gem-/, "The gem-team multi-agent suite: planning, implementation, review, testing and design agents"],
  ["power-platform", /power-?(bi|apps|platform|pages)|dataverse|pcf-|\bdax\b|flowstudio|fabric-|canvas-app/, "Power BI, Power Apps, Power Platform and Dataverse"],
  ["azure", /^azure|azure|bicep|entra|avm|appinsights|kusto|defender|arm-migration|aspire|winui3-migration/, "Azure architecture, IaC, diagnostics and platform services"],
  ["aws", /^aws-|cloudwatch|^terraform-aws/, "AWS architecture, cost and diagnostics"],
  ["dotnet", /dotnet|csharp|blazor|maui|winui|wpf|nuget|mvvm|efcore|ef-core|fluentui|vsix|winmd|delphi|semantic-kernel|msstore|vscode-ext/, ".NET, C# and Windows desktop development"],
  ["java-jvm", /^java|spring|kotlin|graalvm|quarkus|helidon|javax/, "Java, Kotlin and Spring development"],
  ["python", /python|pytest|ruff|pypi|freecad|rhino3d|shuffle-json/, "Python development, packaging and tooling"],
  ["web-frontend", /^react|vue|angular|svelte|nextjs|next-intl|tailwind|frontend|gsap|penpot|premium-|anti-ui|web-design|a11y|accessib|shopify|drupal|aem-|pimcore|wordpress|moodle|nuxt|ember|electron|laravel|uizze|slang-shader|game-engine|minecraft/, "Frontend frameworks, UI design, accessibility and CMS platforms"],
  ["data-sql", /sql|postgres|mongo|snowflake|bigquery|cosmos|neo4j|neon|qdrant|pinecone|spark|ssma|credit-risk|powerbi-modeling|oracle/, "SQL, NoSQL, vector databases and data modelling"],
  ["security", /security|owasp|threat|secret|vulnerab|gdpr|jfrog|stackhawk|sast|codeql|dependabot|attester|trojan|breach|supply-chain|audit-integrity|resemble-detect/, "Security review, threat modelling, compliance and supply-chain checks"],
  ["devops-ci", /github-actions|terraform|kubernetes|docker|containeriz|deploy|incident|sre|oncall|pagerduty|dynatrace|elasticsearch|new-relic|octopus|launchdarkly|devops|gitops|codespaces|dependency|vcpkg|cmake|namecheap|publish-to-pages|sandbox-npm|import-infrastructure/, "CI/CD, infrastructure, observability and incident response"],
  ["linux-systems", /linux|batch-files|\bshell\b|cli-mastery|tldr|lsp-setup|chrome-devtools|screen-recording|pdftk|image-manipulation|editorconfig/, "Linux administration, shell tooling and local developer utilities"],
  ["copilot-github", /^copilot-|^github-|^gh-|issue-fields|make-repo-contribution|workiq|setup-my-iq|first-ask|noob-mode|quasi-coder/, "GitHub and Copilot platform workflows"],
  ["codebase-analysis", /codebase|code-tour|memory|agentsmd|context-map|mini-context|what-context|bench-read|acquire-|folder-structure|technology-stack|project-workflow|repo-story|architecture-blueprint|code-exemplars|exemplars/, "Understanding an unfamiliar codebase: blueprints, tours and context maps"],
  ["learning-teaching", /exam-ready|mentoring|workshop|tutorial|educational|study|interview-prep|desk-|daily-prep|brag|performance-review|technical-job|career/, "Learning, mentoring, interview prep and career workflows"],
  ["content-media", /adobe|illustrator|image|screenshot|latchshot|markstream|md-to-|convert-|markdown-to|nano-banana|generate-image|linkedin|email|x-twitter|steno|humaniz|em-dash|finnish|from-the-other-side|legacy-circuit/, "Document conversion, image generation and writing-style tools"],
  ["research-analysis", /autoresearch|competitor|scientific-paper|ad-campaign|last30|research|intelligence|eyeball|vardoger|geofeed|sponsor|ospo/, "Research, competitive analysis and reporting"],
  ["ai-agents", /^agent-|^mcp-|prompt|^ai-|llm|arize|phoenix|opik|comet|declarative-agent|skill-|meta-agentic|context7|copilot-sdk|apify|transloadit|webmcp|foundry|entra-agent|harness-engineering|microsoft-agent|semantic|eval/, "Building agents: MCP servers, prompt engineering, evals and observability"],
  ["docs-writing", /readme|documentation|docs$|^docs|markdown|llms|technical-writ|blueprint|spec|adr|architectur|diagram|plantuml|comment|create-tldr|tldr-prompt|oo-component|self-explanatory|update-markdown/, "Documentation, specifications and diagrams"],
  ["project-planning", /^create-github|issue|\bprd\b|^plan|planner|breakdown|epic|backlog|impediment|postmortem|meeting|refine|task-|estimat|roundup|structured-autonomy|tiny-stepping|quality-playbook|devops-rollout|technical-spike|one-shot/, "Requirements, planning, breakdowns and retrospectives"],
  ["testing", /test|tdd|coverage|playwright|junit|pester|^qa-|diffblue|scoutqa|terratest/, "Test authoring, migration and coverage"],
  ["gtm-business", /^gtm-|marketing|campaign|pricing|apple-appstore/, "Go-to-market, positioning, pricing and launch playbooks"],
  ["git-workflow", /^git-|commit|branch|gitmoji|^refactor|review|janitor|address-comments|modernization|upgrade|migrat|release|conventional/, "Commits, branches, code review and refactoring workflows"],
  // Everything else: general-purpose engineering agents and personas.
  ["coding-agents", /.*/, "General-purpose engineering agents, reviewer personas and assorted skills"],
];

/** item name -> bucket, honouring hand-edits in groups.json and recording new items. */
function loadGroups(names) {
  const stored = fs.existsSync(GROUPS) ? JSON.parse(fs.readFileSync(GROUPS, "utf8")) : {};
  const assignments = { ...(stored.assignments ?? {}) };
  const valid = new Set(BUCKETS.map(([n]) => n));
  let added = 0;
  for (const name of names) {
    if (assignments[name] && valid.has(assignments[name])) continue;
    assignments[name] = BUCKETS.find(([, re]) => re.test(name))[0];
    added++;
  }
  // Drop assignments for items upstream has removed, keep the file sorted.
  const live = new Set(names);
  const sorted = Object.fromEntries(
    Object.entries(assignments)
      .filter(([n]) => live.has(n))
      .sort(([a], [b]) => a.localeCompare(b)),
  );
  fs.writeFileSync(
    GROUPS,
    `${JSON.stringify(
      {
        $comment:
          "Maps each skill/agent that no upstream plugin references to an extras-* plugin. Hand-edit any value to move an item; sync.mjs preserves your choice and only auto-assigns names it has not seen. Valid targets are the bucket names in scripts/sync.mjs.",
        assignments: sorted,
      },
      null,
      2,
    )}\n`,
  );
  return { assignments: sorted, added };
}

/** Bundles every skill/agent no curated plugin references into extras-* plugins. */
function generateExtras(entries, stats) {
  const claimedSkills = new Set();
  const claimedAgents = new Set();
  for (const dir of fs.readdirSync(OUT_PLUGINS)) {
    for (const d of ["skills", "agents"]) {
      const p = path.join(OUT_PLUGINS, dir, d);
      if (!fs.existsSync(p)) continue;
      for (const n of fs.readdirSync(p)) (d === "skills" ? claimedSkills : claimedAgents).add(n.replace(/\.md$/, ""));
    }
  }

  const strays = [];
  for (const n of fs.readdirSync(path.join(UPSTREAM, "skills")))
    if (!claimedSkills.has(n) && fs.existsSync(path.join(UPSTREAM, "skills", n, "SKILL.md"))) strays.push([n, "skill"]);
  for (const f of fs.readdirSync(path.join(UPSTREAM, "agents"))) {
    const n = f.replace(/\.agent\.md$/, "");
    if (!claimedAgents.has(n)) strays.push([n, "agent"]);
  }

  const { assignments, added } = loadGroups(strays.map(([n]) => n));
  stats.newlyGrouped = added;

  for (const [bucket, , description] of BUCKETS) {
    const members = strays.filter(([n]) => assignments[n] === bucket);
    if (!members.length) continue;
    const name = `extras-${bucket}`;
    const dest = path.join(OUT_PLUGINS, name);
    let skills = 0;
    let agents = 0;

    for (const [item, kind] of members) {
      if (kind === "skill") {
        const to = path.join(dest, "skills", item);
        fs.cpSync(path.join(UPSTREAM, "skills", item), to, { recursive: true });
        const f = path.join(to, "SKILL.md");
        fs.writeFileSync(f, rewriteSkill(fs.readFileSync(f, "utf8"), item));
        skills++;
      } else {
        fs.mkdirSync(path.join(dest, "agents"), { recursive: true });
        const from = path.join(UPSTREAM, "agents", `${item}.agent.md`);
        fs.writeFileSync(path.join(dest, "agents", `${item}.md`), rewriteAgent(fs.readFileSync(from, "utf8"), item));
        agents++;
      }
    }

    const manifest = {
      name,
      description: `${description}. Community skills and agents from github/awesome-copilot that no upstream plugin bundles.`,
      version: "1.0.0",
      author: { name: "Awesome Copilot Community" },
      repository: REPO_URL,
      license: "MIT",
      keywords: [bucket, "awesome-copilot", "extras"],
    };
    fs.mkdirSync(path.join(dest, ".claude-plugin"), { recursive: true });
    fs.writeFileSync(path.join(dest, ".claude-plugin", "plugin.json"), `${JSON.stringify(manifest, null, 2)}\n`);

    entries.push({
      name,
      source: `./${OUT_DIR}/${name}`,
      description: manifest.description,
      version: manifest.version,
      author: manifest.author,
      keywords: manifest.keywords,
    });
    stats.plugins++;
    stats.skills += skills;
    stats.agents += agents;
    stats.extras = (stats.extras ?? 0) + 1;
  }
}

function generate() {
  fs.rmSync(OUT_PLUGINS, { recursive: true, force: true });
  fs.mkdirSync(OUT_PLUGINS, { recursive: true });

  const srcPlugins = path.join(UPSTREAM, "plugins");
  const entries = [];
  const stats = { plugins: 0, skills: 0, agents: 0, mcp: 0, skipped: [] };

  for (const dir of fs.readdirSync(srcPlugins).sort()) {
    const manifestPath = path.join(srcPlugins, dir, ".github", "plugin", "plugin.json");
    if (!fs.existsSync(manifestPath)) continue;
    const src = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    const dest = path.join(OUT_PLUGINS, dir);
    let skills = 0;
    let agents = 0;

    for (const ref of src.skills ?? []) {
      const slug = path.basename(ref.replace(/\/+$/, ""));
      const from = path.join(UPSTREAM, "skills", slug);
      if (!fs.existsSync(path.join(from, "SKILL.md"))) {
        stats.skipped.push(`${dir}: missing skill ${slug}`);
        continue;
      }
      const to = path.join(dest, "skills", slug);
      fs.cpSync(from, to, { recursive: true }); // brings bundled assets along
      const skillFile = path.join(to, "SKILL.md");
      fs.writeFileSync(skillFile, rewriteSkill(fs.readFileSync(skillFile, "utf8"), slug));
      skills++;
    }

    for (const ref of src.agents ?? []) {
      const slug = path.basename(ref, ".md");
      const from = path.join(UPSTREAM, "agents", `${slug}.agent.md`);
      if (!fs.existsSync(from)) {
        stats.skipped.push(`${dir}: missing agent ${slug}`);
        continue;
      }
      fs.mkdirSync(path.join(dest, "agents"), { recursive: true });
      fs.writeFileSync(
        path.join(dest, "agents", `${slug}.md`),
        rewriteAgent(fs.readFileSync(from, "utf8"), slug),
      );
      agents++;
    }

    if (skills + agents === 0) {
      fs.rmSync(dest, { recursive: true, force: true });
      stats.skipped.push(`${dir}: nothing portable`);
      continue;
    }

    // `mcpServers` is a path to an .mcp.json relative to the plugin dir.
    if (typeof src.mcpServers === "string") {
      for (const base of [path.join(srcPlugins, dir), path.join(srcPlugins, dir, ".github", "plugin")]) {
        const from = path.resolve(base, src.mcpServers);
        if (fs.existsSync(from)) {
          fs.copyFileSync(from, path.join(dest, ".mcp.json"));
          stats.mcp++;
          break;
        }
      }
    }

    const manifest = {
      name: src.name ?? dir,
      description: src.description,
      version: src.version ?? "1.0.0",
      author: src.author,
      homepage: src.homepage,
      // Keep upstream's own repo pointer — several plugins are third-party
      // (own author, own license) and must not be attributed to this fork.
      repository: src.repository ?? REPO_URL,
      license: src.license ?? "MIT",
      keywords: src.keywords,
    };
    for (const k of Object.keys(manifest)) if (manifest[k] === undefined) delete manifest[k];

    fs.mkdirSync(path.join(dest, ".claude-plugin"), { recursive: true });
    fs.writeFileSync(
      path.join(dest, ".claude-plugin", "plugin.json"),
      `${JSON.stringify(manifest, null, 2)}\n`,
    );

    const readme = path.join(srcPlugins, dir, "README.md");
    if (fs.existsSync(readme)) fs.copyFileSync(readme, path.join(dest, "README.md"));

    entries.push({
      name: manifest.name,
      source: `./${OUT_DIR}/${dir}`,
      description: manifest.description,
      version: manifest.version,
      author: manifest.author,
      keywords: manifest.keywords,
    });
    stats.plugins++;
    stats.skills += skills;
    stats.agents += agents;
  }

  generateExtras(entries, stats);

  const marketplace = {
    $schema: "https://anthropic.com/claude-code/marketplace.schema.json",
    name: "awesome-copilot",
    description:
      "Unofficial Claude Code port of github/awesome-copilot — community skills and agents bundled as installable plugins. Not affiliated with GitHub, Inc.",
    owner: MARKETPLACE_OWNER,
    plugins: entries,
  };
  fs.mkdirSync(path.dirname(MARKETPLACE), { recursive: true });
  fs.writeFileSync(MARKETPLACE, `${JSON.stringify(marketplace, null, 2)}\n`);

  return stats; // upstream LICENSE is already at the repo root — this is a fork
}

function writeReadme(stats) {
  const marketplace = JSON.parse(fs.readFileSync(MARKETPLACE, "utf8"));
  const countUpstream = (d) => (fs.existsSync(path.join(UPSTREAM, d)) ? fs.readdirSync(path.join(UPSTREAM, d)).length : 0);
  const up = { skills: countUpstream("skills"), agents: countUpstream("agents"), instructions: countUpstream("instructions") };
  const uniqueSkills = new Set();
  for (const dir of fs.readdirSync(OUT_PLUGINS)) {
    const s = path.join(OUT_PLUGINS, dir, "skills");
    if (fs.existsSync(s)) for (const n of fs.readdirSync(s)) uniqueSkills.add(n);
  }
  const rows = marketplace.plugins
    .map((p) => {
      const dir = p.source.replace(/^\.\//, "");
      const counts = [];
      const skills = fs.existsSync(path.join(ROOT, dir, "skills")) ? fs.readdirSync(path.join(ROOT, dir, "skills")).length : 0;
      const agents = fs.existsSync(path.join(ROOT, dir, "agents")) ? fs.readdirSync(path.join(ROOT, dir, "agents")).length : 0;
      if (skills) counts.push(`${skills} skill${skills > 1 ? "s" : ""}`);
      if (agents) counts.push(`${agents} agent${agents > 1 ? "s" : ""}`);
      const desc = p.description.replace(/\|/g, "\\|").replace(/\s+/g, " ");
      return `| [\`${p.name}\`](${dir}/) | ${counts.join(", ")} | ${desc} |`;
    })
    .join("\n");

  const readme = `# claude-awesome-copilot-plugins

A fork of [github/awesome-copilot](https://github.com/github/awesome-copilot) that adds a [Claude Code](https://docs.claude.com/en/docs/claude-code) plugin marketplace.

Upstream's \`plugins/\`, \`skills/\`, \`agents/\` and everything else are untouched — this fork only **adds** \`claude-plugins/\` (generated), \`.claude-plugin/marketplace.json\`, and \`sync.mjs\`, and replaces this README.

**Unofficial.** Not affiliated with or endorsed by GitHub, Inc. Upstream is MIT (see [LICENSE](LICENSE)); each ported plugin keeps its original author, repository, and license metadata.

## Install

\`\`\`
/plugin marketplace add ${REPO_URL.replace("https://github.com/", "")}
/plugin install <plugin-name>@awesome-copilot
\`\`\`

## Plugins

${stats.plugins} plugins — ${stats.skills} skills, ${stats.agents} agents.

| Plugin | Contents | Description |
| --- | --- | --- |
${rows}

## What gets ported

| Upstream | Generated here |
| --- | --- |
| \`skills/*/SKILL.md\` (+ bundled assets) | \`${OUT_DIR}/<p>/skills/<name>/\` — already Claude-native, only \`name\` is normalized to the directory |
| \`agents/*.agent.md\` | \`${OUT_DIR}/<p>/agents/<name>.md\` — see caveats |
| \`plugins/<p>/.github/plugin/plugin.json\` | \`${OUT_DIR}/<p>/.claude-plugin/plugin.json\` |
| \`instructions/\`, \`hooks/\`, \`workflows/\`, \`extensions/\` | not ported |

### Agent conversion caveats

- Upstream \`name:\` is often a human title ("Debug Mode Instructions"). Claude Code wants the slug, so \`name\` is taken from the filename and the original title becomes the body's H1.
- \`tools:\` is dropped. It uses the VS Code tool namespace (\`edit/editFiles\`, \`execute/runInTerminal\`), which Claude Code does not understand. With no \`tools\` key the agent inherits every tool — permissive, but a hand-written mapping would silently strip capabilities the agent's own prompt assumes it has.
- \`model:\`, \`mcp-servers:\`, \`user-invocable:\`, \`agents:\` are dropped for the same reason (Copilot model names and Copilot-only fields).

### Not ported, and why

- **\`instructions/\`** — ${up.instructions} \`*.instructions.md\` files scoped by \`applyTo:\` globs. Claude Code has no glob-scoped context primitive; converting them to skills or \`CLAUDE.md\` is a lossy judgment call, deferred.
- **\`hooks/\`, \`workflows/\`** — Copilot's event model and GitHub Actions agentic workflows, different runtime.
- **Unbundled skills** — upstream ships ${up.skills} skills and ${up.agents} agents, but only ${uniqueSkills.size} skills belong to a curated plugin. Only the bundled ones are here.

## Staying in sync with upstream

\`\`\`
git remote add upstream https://github.com/github/awesome-copilot.git   # once
node scripts/sync.mjs --merge-upstream    # merge upstream/main, then regenerate
node scripts/sync.mjs                     # regenerate from the current tree only
\`\`\`

This runs daily via [\`.github/workflows/sync-port.yml\`](.github/workflows/sync-port.yml), which merges upstream, regenerates, and pushes — or opens an issue if the merge needs a human. Upstream's own 42 workflows are deleted from this fork (they publish sites, call webhooks, and run agentic jobs that must not fire here), and the workflow re-deletes any that arrive in a merge.

Upstream regenerates its own \`README.md\`, so every merge conflicts there. Resolve it once with a merge driver:

\`\`\`
git config merge.ours.driver true    # .gitattributes already maps README.md to it
\`\`\`

Everything under \`${OUT_DIR}/\` and \`.claude-plugin/\` is generated — edit \`sync.mjs\`, not the output. The script self-checks the result and exits non-zero on any structural problem.

Built from upstream content at commit \`${upstreamSha().slice(0, 12)}\`.
`;
  fs.writeFileSync(path.join(ROOT, "README.md"), readme);
}

/** Fails loudly if the conversion produced anything Claude Code would reject. */
function check() {
  const problems = [];
  const marketplace = JSON.parse(fs.readFileSync(MARKETPLACE, "utf8"));
  const seen = new Set();

  for (const entry of marketplace.plugins) {
    const dir = path.join(ROOT, entry.source);
    if (!fs.existsSync(path.join(dir, ".claude-plugin", "plugin.json"))) problems.push(`${entry.name}: no plugin.json`);
    if (seen.has(entry.name)) problems.push(`${entry.name}: duplicate marketplace entry`);
    seen.add(entry.name);
    if (!entry.description) problems.push(`${entry.name}: no description`);
  }

  const walk = (dir, kind) => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).map((n) => (kind === "skill" ? path.join(dir, n, "SKILL.md") : path.join(dir, n)));
  };

  for (const dir of fs.readdirSync(OUT_PLUGINS)) {
    const base = path.join(OUT_PLUGINS, dir);
    JSON.parse(fs.readFileSync(path.join(base, ".claude-plugin", "plugin.json"), "utf8"));

    for (const file of walk(path.join(base, "skills"), "skill")) {
      const slug = path.basename(path.dirname(file));
      const [fm] = splitFrontmatter(fs.readFileSync(file, "utf8"));
      if (!fm) problems.push(`${dir}/${slug}: SKILL.md has no frontmatter`);
      else {
        const name = fm.find((l) => l.startsWith("name:"));
        if (unquote((name ?? "").slice(5)) !== slug) problems.push(`${dir}/${slug}: SKILL.md name != directory`);
        if (!fm.some((l) => l.startsWith("description:"))) problems.push(`${dir}/${slug}: SKILL.md has no description`);
      }
    }

    for (const file of walk(path.join(base, "agents"), "agent")) {
      const slug = path.basename(file, ".md");
      const [fm] = splitFrontmatter(fs.readFileSync(file, "utf8"));
      if (!fm) {
        problems.push(`${dir}/${slug}: agent has no frontmatter`);
        continue;
      }
      if (unquote((fm.find((l) => l.startsWith("name:")) ?? "").slice(5)) !== slug)
        problems.push(`${dir}/${slug}: agent name != filename`);
      if (!fm.some((l) => l.startsWith("description:"))) problems.push(`${dir}/${slug}: agent has no description`);
      for (const banned of ["tools:", "model:", "mcp-servers:", "user-invocable:"])
        if (fm.some((l) => l.startsWith(banned))) problems.push(`${dir}/${slug}: leftover ${banned}`);
    }
  }
  return problems;
}

if (process.argv.includes("--merge-upstream")) mergeUpstream();
const stats = generate();
writeReadme(stats);
log(`\nGenerated ${stats.plugins} plugins — ${stats.skills} skills, ${stats.agents} agents, ${stats.mcp} mcp configs.`);
if (stats.skipped.length) log(`Skipped: ${stats.skipped.length}\n  ${stats.skipped.join("\n  ")}`);

const problems = check();
if (problems.length) {
  console.error(`\nFAILED ${problems.length} checks:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
log("All checks passed.");
