#!/usr/bin/env node
/**
 * Starts both the Node.js Backend API (port 4000) and the React Vite Dev Server (port 5173)
 * in a single terminal and forwards SIGINT/SIGTERM cleanly.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

function spawnService(label, prefixColor, cwd, command, args) {
  const child = spawn(command, args, {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, FORCE_COLOR: "1" },
  });

  const prefix = `\x1b[${prefixColor}m[${label}]\x1b[0m `;
  child.stdout.on("data", (chunk) => {
    for (const line of chunk.toString().split(/\r?\n/)) {
      if (line.trim()) process.stdout.write(`${prefix}${line}\n`);
    }
  });
  child.stderr.on("data", (chunk) => {
    for (const line of chunk.toString().split(/\r?\n/)) {
      if (line.trim()) process.stderr.write(`${prefix}${line}\n`);
    }
  });

  return child;
}

console.log("Starting BistroNode API (:4000) and React Web Client (:5173)...\n");

const apiProc = spawnService(
  "api:4000",
  "36",
  path.join(rootDir, "apps/api"),
  "node",
  ["src/server.js"]
);

const webProc = spawnService(
  "web:5173",
  "32",
  path.join(rootDir, "apps/web"),
  "npm",
  ["run", "dev"]
);

function shutdown() {
  apiProc.kill("SIGTERM");
  webProc.kill("SIGTERM");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
