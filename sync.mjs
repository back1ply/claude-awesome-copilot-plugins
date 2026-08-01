#!/usr/bin/env node
// Regenerates the Claude Code port from this fork's own awesome-copilot tree.
// Reads plugins/, skills/, agents/ (upstream's, untouched) and writes
// claude-plugins/ + .claude-plugin/marketplace.json. Idempotent.
//
//   node sync.mjs                    # regenerate from the current tree
//   node sync.mjs --merge-upstream   # git fetch + merge upstream/main first
//
// ponytail: no deps, no YAML lib. Frontmatter is rewritten line-wise with
// block awareness (a top-level `key:` owns every following indented line).

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const UPSTREAM = ROOT; // this repo is a fork — upstream's tree is already here
const OUT_DIR = "claude-plugins"; // upstream already owns ./plugins
const OUT_PLUGINS = path.join(ROOT, OUT_DIR);
const MARKETPLACE = path.join(ROOT, ".claude-plugin", "marketplace.json");

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
node sync.mjs --merge-upstream    # merge upstream/main, then regenerate
node sync.mjs                     # regenerate from the current tree only
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
