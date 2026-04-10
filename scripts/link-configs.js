#!/usr/bin/env node

// Create symlinks from config files in this repo to their expected locations.
// Usage: node scripts/link-configs.js [--vscode] [--kiro] [--vim]

import { lstatSync, readdirSync, symlinkSync, unlinkSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const home = process.env.HOME;

const IDE_LINK_FILES = ["settings.json", "keybindings.json"];

const EDITORS = {
	vscode: {
		flag: "--vscode",
		source: resolve(__dirname, "../ide/vscode"),
		target: `${home}/Library/Application Support/Code/User`,
		files: IDE_LINK_FILES,
	},
	kiro: {
		flag: "--kiro",
		source: resolve(__dirname, "../ide/kiro"),
		target: `${home}/Library/Application Support/Kiro/User`,
		files: IDE_LINK_FILES,
	},
	vim: {
		flag: "--vim",
		source: resolve(__dirname, ".."),
		target: home,
		files: [".vimrc"],
	},
};

async function promptEditor() {
	const rl = createInterface({ input: process.stdin, output: process.stdout });
	try {
		const answer = await rl.question(
			"Which editor? (1) vscode  (2) kiro  (3) vim: ",
		);
		const choice = answer.trim();
		if (choice === "1") return ["vscode"];
		if (choice === "2") return ["kiro"];
		if (choice === "3") return ["vim"];
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
	const { source, target, files } = EDITORS[editor];
	const available = readdirSync(source).filter((f) => files.includes(f));

	console.log(`\n[${editor}]`);

	for (const file of available) {
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
