import { cp, mkdir, rm } from "node:fs/promises";

const files = ["index.html", "strike.js", "gas.json", "CONTINUE.md", "README.md", "robots.txt"];
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
for (const file of files) await cp(file, `dist/${file}`);
