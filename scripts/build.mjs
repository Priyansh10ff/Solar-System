import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const nextDir = path.join(projectRoot, ".next");

const env = { ...process.env, NODE_ENV: "production" };

try {
  await rm(nextDir, { recursive: true, force: true });
} catch {
  // Ignore cleanup errors; next build can still attempt a fresh build.
}

const child = spawn(process.execPath, [nextBin, "build"], { stdio: "inherit", env });
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
