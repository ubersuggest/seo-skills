# Ubersuggest SEO — Claude Code plugin

Turns Claude into an SEO consultant backed by real Ubersuggest data. Installing
the plugin connects the Ubersuggest MCP server (58 tools) and adds the SEO
know-how to use it — so you can ask "why is my competitor outranking me?"
instead of picking tools by hand.

This directory is the Claude Code packaging. The skills under `skills/` are
plain [agent skills](https://agentskills.io) and also run in ChatGPT, Codex and
other agents — see the [repository README](../../README.md) for those installs.

## Install

```
/plugin marketplace add ubersuggest/seo-skills
/plugin install ubersuggest
```

On your first Ubersuggest tool call, Claude Code opens your browser to sign in
with your Ubersuggest account (OAuth 2.0). There's nothing to configure and no
API key to paste. Check the connection any time with `/mcp`.

## Commands

Skills are namespaced as `/ubersuggest:<skill>`; the short form (`/site-audit`)
also works when no other installed skill claims that name. You can equally just
describe what you want in plain language — Claude picks the right workflow.
If you don't know which of these you need, run `/ubersuggest:seo-action-plan`
with your domain and it will decide for you.

| Command | What it does | Needs login |
| --- | --- | --- |
| `/ubersuggest:seo-action-plan <website>` | **Start here.** Diagnoses your site and tells you the one thing to do next, in plain language | no (more with login) |
| `/ubersuggest:project-setup <website>` | Sets a site up from scratch: project, business summary, competitors, AI-answer topics and prompts, tracked keywords | **yes** |
| `/ubersuggest:keyword-research <topic> [location]` | Prioritised keyword list with volume, difficulty, intent, grouped into clusters | no |
| `/ubersuggest:competitor-analysis <domain>` | Domain comparison plus keyword and content gaps vs. competitors | no |
| `/ubersuggest:site-audit <domain>` | Technical crawl, prioritised fixes, Core Web Vitals | **yes** |
| `/ubersuggest:content-demand-finder <website>` | 50 content opportunities from your business, customers and offer — problem clusters, questions, formats, ten to validate | no (no data calls at all) |
| `/ubersuggest:content-brief <keyword>` | Data-backed brief: angle, outline, secondary keywords, entities | no |
| `/ubersuggest:ai-visibility [project]` | Brand visibility in ChatGPT, Perplexity and AI Overviews | **yes** + configured project |
| `/ubersuggest:seo-foundations` | The shared methodology and the goal → tool map (loads automatically) | no |

There's also a `seo-strategist` subagent for heavy multi-step analyses — a full
audit, or several competitors at once — which runs in the background and returns
just the report.

## Accounts and limits

Every tool works on a **free** Ubersuggest account; your plan changes how much
data comes back, not which tools run. Two exceptions worth knowing:

- **Login required (19 tools):** site audits, projects and rank tracking, AI
  Search Visibility, and Content Studio. `pagespeed_audit` is *not* gated, so
  Core Web Vitals work without an account.
- **Costs credits:** generating an article spends 100 monthly credits and needs
  a paid plan. Claude always asks before spending it.

MCP calls draw on the same quotas as the Ubersuggest web app — daily reports and
monthly credits, no separate MCP allowance. Current usage lives in Account &
Billing → Usage at [app.neilpatel.com](https://app.neilpatel.com).

## Links

- Tool reference and docs: https://ubersuggest-mcp.neilpatelapi.com/docs
- Machine-readable docs: https://ubersuggest-mcp.neilpatelapi.com/llms.md
- Pricing: https://app.neilpatel.com/en/pricing
- Support: https://ubersuggest.zendesk.com/hc/en-us/requests/new
