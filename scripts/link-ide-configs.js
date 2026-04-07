#!/usr/bin/env node

// Create symlinks from IDE user config directories to repo files.
// Usage: node scripts/link-ide-configs.js [--vscode] [--kiro]

import { readdirSync, lstatSync, symlinkSync, unlinkSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const home = process.env.HOME;

const EDITORS = {
	vscode: {
		flag: "--vscode",
		source: resolve(__dirname, "../ide/vscode"),
		target: `${home}/Library/Application Support/Code/User`,
	},
	kiro: {
		flag: "--kiro",
		source: resolve(__dirname, "../ide/kiro"),
		target: `${home}/Library/Application Support/Kiro/User`,
	},
};

async function promptEditor() {
	const rl = createInterface({ input: process.stdin, output: process.stdout });
	try {
		const answer = await rl.question("Which editor? (1) vscode  (2) kiro: ");
		const choice = answer.trim();
		if (choice === "1") return ["vscode"];
		if (choice === "2") return ["kiro"];
		console.error("Invalid choice.");
		process.exit(1);
	} finally {
		rl.close();
	}
}

function parseArgs() {
	return Object.entries(EDITORS)
		.filter(([, { flag }]) => process.argv.includes(flag))
		.map(([name]) => name);
}

function linkEditor(editor) {
	const { source, target } = EDITORS[editor];
	const LINK_FILES = ["settings.json", "keybindings.json"];
	const files = readdirSync(source).filter((f) => LINK_FILES.includes(f));

	console.log(`\n[${editor}]`);

	for (const file of files) {
		const src = resolve(source, file);
		const dest = resolve(target, file);

		try {
			// Remove existing file or symlink
			const stat = lstatSync(dest);
			if (stat) unlinkSync(dest);
		} catch {
			// dest doesn't exist, that's fine
		}

		try {
			symlinkSync(src, dest);
			console.log(`  ✓ ${file} -> ${src}`);
		} catch (err) {
			console.error(`  ✗ ${file}: ${err.message}`);
		}
	}
}

async function main() {
	let editors = parseArgs();
	if (editors.length === 0) {
		editors = await promptEditor();
	}

	for (const editor of editors) {
		linkEditor(editor);
	}

	console.log("\nDone.");
}

main();
