import { exec } from "node:child_process";
import fs from "node:fs/promises";
import { join } from "node:path";
import assert from "node:assert/strict";
import { test } from "node:test";
import { promisify } from "node:util";

const execAsync = promisify(exec);

test("install package", async () => {
  const distDir = join(process.cwd(), "dist");
  const testProjectDir = join(process.cwd(), "test-project");

  // Clean slate
  //   if (await fs.exists(distDir)) {
  await fs.rm(distDir, { recursive: true, force: true });
  //   }s
  await fs.rm(testProjectDir, { recursive: true, force: true });

  // Install dependencies
  await execAsync("npm install");

  // Build the package
  await execAsync("npm run build");

  // Create a tarball
  await execAsync("npm pack");

  // Now create the test project
  //   if (!(await fs.exists(testProjectDir))) {
  await fs.mkdir(testProjectDir);
  //   }

  process.chdir(testProjectDir);

  // Initialize npm and install package
  await execAsync("npm init -y");
  await execAsync("npm install ../*.tgz --prefer-online");

  // Test import
  const testScript = `
        import rehypeSlots from 'rehype-slots';
        console.log(rehypeSlots);
    `;
  await fs.writeFile("index.mjs", testScript);
  const { stdout } = await execAsync("node index.mjs");

  // Assert that rehypeSlots is defined
  assert.ok(stdout, "rehypeSlots is not defined");
});
