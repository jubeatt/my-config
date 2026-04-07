#!/usr/bin/env node

// Generate .vscode/extensions.json from installed extensions.
// Usage: node scripts/gen-vscode-extensions.js [--vscode] [--kiro] [--dryrun]

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXTENSIONS_PATH = resolve(__dirname, "../.vscode/extensions.json");

const EDITORS = {
	vscode: { flag: "--vscode", cmd: "code --list-extensions" },
	kiro: { flag: "--kiro", cmd: "kiro --list-extensions" },
};

function getInstalledExtensions(cmd) {
	return execSync(cmd, { encoding: "utf-8" })
		.trim()
		.split("\n")
		.map((id) => id.toLowerCase())
		.filter(Boolean);
}

async function promptEditor() {
	const rl = createInterface({ input: process.stdin, output: process.stdout });
	try {
		const answer = await rl.question(
			"Which editor? (1) vscode  (2) kiro  (3) both: ",
		);
		const choice = answer.trim();
		if (choice === "1") return ["vscode"];
		if (choice === "2") return ["kiro"];
		if (choice === "3") return ["vscode", "kiro"];
		console.error("Invalid choice.");
		process.exit(1);
	} finally {
		rl.close();
	}
}

function parseArgs() {
	const args = process.argv.slice(2);
	const editors = Object.entries(EDITORS)
		.filter(([, { flag }]) => args.includes(flag))
		.map(([name]) => name);
	return editors;
}

async function main() {
	let editors = parseArgs();
	if (editors.length === 0) {
		editors = await promptEditor();
	}

	// Collect extensions from selected editors
	const allExtensions = new Set();
	for (const editor of editors) {
		const { cmd } = EDITORS[editor];
		console.log(`Fetching extensions from ${editor}...`);
		const extensions = getInstalledExtensions(cmd);
		for (const ext of extensions) allExtensions.add(ext);
		console.log(`  Found ${extensions.length} extensions.`);
	}

	// Read existing file
	let existing = [];
	try {
		const json = JSON.parse(readFileSync(EXTENSIONS_PATH, "utf-8"));
		existing = (json.recommendations ?? []).map((id) => id.toLowerCase());
	} catch {
		// File doesn't exist yet
	}

	// Use IDE as source of truth
	const result = [...allExtensions].sort();
	const added = result.filter((ext) => !existing.includes(ext));
	const removed = existing.filter((ext) => !allExtensions.has(ext));
	const dryrun = process.argv.includes("--dryrun");

	if (added.length > 0) {
		console.log(`\nAdded (${added.length}):`);
		for (const ext of added) console.log(`  + ${ext}`);
	}
	if (removed.length > 0) {
		console.log(`\nRemoved (${removed.length}):`);
		for (const ext of removed) console.log(`  - ${ext}`);
	}

	if (dryrun) {
		console.log(`\n[dryrun] No files written.`);
	} else {
		const output = JSON.stringify({ recommendations: result }, null, "\t");
		writeFileSync(EXTENSIONS_PATH, `${output}\n`);
		console.log(`\nDone. ${result.length} total extensions.`);
	}
}

main();
