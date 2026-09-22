# Ubersuggest SEO skills

Official SEO skills and Claude Code plugin marketplace maintained by
[Ubersuggest](https://neilpatel.com). The skills follow the open
[agent skills](https://agentskills.io) standard, so the same files run in Claude
Code, in ChatGPT and Codex, and in any other agent that reads `SKILL.md`.

## Install

### Claude Code (recommended)

```
/plugin marketplace add ubersuggest/seo-skills
/plugin install ubersuggest
```

Then restart Claude Code. Check the connection any time with `/mcp`. This is the
only install that also wires up the MCP server and the `seo-strategist` agent
for you.

### ChatGPT and Codex

Codex reads skills from `.agents/skills`. Install them into your user scope:

```
npx skills add ubersuggest/seo-skills
```

Or copy them by hand — one directory per skill, `SKILL.md` at its root:

```
git clone https://github.com/ubersuggest/seo-skills /tmp/seo-skills
cp -R /tmp/seo-skills/plugins/ubersuggest/skills/* ~/.agents/skills/
```

For a single repository instead of your whole account, copy them into
`.agents/skills/` at the repo root. Each skill ships an `agents/openai.yaml`
declaring its display name and its dependency on the Ubersuggest MCP server, so
hosts that read that file can offer to connect it. Codex picks new skills up
automatically; restart it if one does not appear.

Eight of the nine skills read live data from the Ubersuggest MCP server, so add
the connection too — in Codex, register it as an MCP server at
`https://ubersuggest-mcp.neilpatelapi.com/mcp` over streamable HTTP. It signs in
with your Ubersuggest account over OAuth; there is no API key.

### Any other agent

Installs the skills into Cursor, Copilot, Zed, Warp and ~80 other agents:

```
npx skills add ubersuggest/seo-skills
```

This copies the skill files and nothing else. Eight of the nine skills read
live data from the Ubersuggest MCP server, so add it too:

```
claude mcp add --transport http ubersuggest https://ubersuggest-mcp.neilpatelapi.com/mcp
```

`content-demand-finder` needs no account and no MCP server.

### Portability

The skills are plain [agent skills](https://agentskills.io): a directory with a
`SKILL.md` carrying `name` and `description`. Nothing in the instructions is
tied to one host — tools are named bare (`keyword_overview`, not a prefixed
form) so any connected `ubersuggest` MCP server matches, and the argument
placeholder degrades to the user's own request on hosts that do not expand it.
The Claude-only pieces — `.claude-plugin/`, the bundled `.mcp.json` and the
`seo-strategist` agent — sit outside `skills/` and are simply ignored elsewhere.

## Plugins

| Plugin | What it does |
| --- | --- |
| [`ubersuggest`](plugins/ubersuggest) | Turns Claude into an SEO consultant backed by real Ubersuggest data — keyword research, competitor analysis, site audits, backlinks, content briefs, content planning and AI search visibility. |

## Accounts

The `ubersuggest` plugin connects to the Ubersuggest MCP server, which signs you
in with your own Ubersuggest account over OAuth on the first tool call — no API
key to paste and nothing to configure. Every tool works on a **free** account;
your plan changes how much data comes back, not which tools run.

New to SEO and unsure what to ask for? `/ubersuggest:seo-action-plan <your
site>` looks at the site and tells you the single next thing to do, in plain
language, instead of handing you a list of options.

One skill needs no account and makes no data calls at all:
`/ubersuggest:content-demand-finder`, which turns a business description into 50
content opportunities.

See the [plugin README](plugins/ubersuggest/README.md) for the full command list,
which tools require login, and how quotas work.

## Links

- Tool reference: https://ubersuggest-mcp.neilpatelapi.com/docs
- Machine-readable docs: https://ubersuggest-mcp.neilpatelapi.com/llms.md
- Pricing: https://app.neilpatel.com/en/pricing
- Support: https://ubersuggest.zendesk.com/hc/en-us/requests/new

## Licence

Apache-2.0. See [LICENSE](LICENSE).
