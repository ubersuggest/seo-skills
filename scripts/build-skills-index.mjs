#!/usr/bin/env node
// Generates skills.json at the repo root: a flat index of every skill so apps
// can list them without walking the tree. Run after adding or editing a skill:
//
//   node scripts/build-skills-index.mjs          # write skills.json
//   node scripts/build-skills-index.mjs --check  # exit 1 if skills.json is stale

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = join(root, "skills.json");

const marketplace = readJson(join(root, ".claude-plugin/marketplace.json"));

const plugins = marketplace.plugins.map((entry) => {
	const pluginDir = join(root, entry.source);
	const manifest = readJson(join(pluginDir, ".claude-plugin/plugin.json"));
	const skillsDir = join(pluginDir, "skills");

	const skills = readdirSync(skillsDir, { withFileTypes: true })
		.filter((d) => d.isDirectory() && existsSync(join(skillsDir, d.name, "SKILL.md")))
		.map((d) => d.name)
		.sort()
		.map((dir) => buildSkill(manifest.name, join(skillsDir, dir)));

	return {
		name: manifest.name,
		displayName: manifest.displayName ?? manifest.name,
		description: manifest.description,
		version: manifest.version,
		skills,
	};
});

const index = {
	name: marketplace.name,
	description: marketplace.description,
	plugins,
};

const output = `${JSON.stringify(index, null, "\t")}\n`;

if (process.argv.includes("--check")) {
	const current = existsSync(outFile) ? readFileSync(outFile, "utf8") : "";
	if (current !== output) {
		console.error("skills.json is out of date. Run: node scripts/build-skills-index.mjs");
		process.exit(1);
	}
	console.log("skills.json is up to date.");
} else {
	writeFileSync(outFile, output);
	const count = plugins.reduce((n, p) => n + p.skills.length, 0);
	console.log(`Wrote ${relative(root, outFile)} with ${count} skills.`);
}

function buildSkill(pluginName, skillDir) {
	const skillFile = join(skillDir, "SKILL.md");
	const meta = parseFrontmatter(readFileSync(skillFile, "utf8"), skillFile);
	const ui = readOpenAiInterface(join(skillDir, "agents/openai.yaml"));

	return {
		name: meta.name,
		command: `/${pluginName}:${meta.name}`,
		displayName: ui.display_name ?? meta.name,
		shortDescription: ui.short_description ?? null,
		description: meta.description,
		argumentHint: meta["argument-hint"] ?? null,
		path: relative(root, skillFile),
	};
}

// Minimal YAML frontmatter reader: handles `key: value`, quoted values and
// folded/literal block scalars (`key: >` / `key: |`), which is all SKILL.md uses.
function parseFrontmatter(text, file) {
	const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) throw new Error(`${file}: missing frontmatter`);

	const lines = match[1].split(/\r?\n/);
	const meta = {};
	for (let i = 0; i < lines.length; i++) {
		const kv = lines[i].match(/^([\w-]+):\s*(.*)$/);
		if (!kv) continue;
		const [, key, raw] = kv;

		if (/^[>|][+-]?$/.test(raw)) {
			const block = [];
			while (i + 1 < lines.length && (/^\s/.test(lines[i + 1]) || lines[i + 1] === "")) {
				block.push(lines[++i].trim());
			}
			meta[key] = raw.startsWith(">") ? block.join(" ").replace(/\s+/g, " ").trim() : block.join("\n");
		} else {
			meta[key] = unquote(raw.trim());
		}
	}

	for (const required of ["name", "description"]) {
		if (!meta[required]) throw new Error(`${file}: frontmatter is missing "${required}"`);
	}
	return meta;
}

function readOpenAiInterface(file) {
	if (!existsSync(file)) return {};
	const ui = {};
	for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
		const kv = line.match(/^\s+(display_name|short_description):\s*(.+)$/);
		if (kv) ui[kv[1]] = unquote(kv[2].trim());
	}
	return ui;
}

function unquote(value) {
	const q = value.match(/^(["'])(.*)\1$/);
	return q ? q[2] : value;
}

function readJson(file) {
	return JSON.parse(readFileSync(file, "utf8"));
}
