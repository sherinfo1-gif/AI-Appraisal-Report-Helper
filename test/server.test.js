import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("GET case is read-only and pilot initialization requires the explicit endpoint", { timeout: 15_000 }, async () => {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), "ai-report-helper-"));
  const databasePath = join(temporaryDirectory, "server-test.sqlite");
  const port = await getAvailablePort();
  const server = spawn(process.execPath, ["src/server.js"], {
    cwd: repositoryRoot,
    env: {
      ...process.env,
      DATABASE_PATH: databasePath,
      HOST: "127.0.0.1",
      PORT: String(port)
    },
    stdio: ["ignore", "pipe", "pipe"]
  });
  let serverError = "";
  server.stderr.setEncoding("utf8");
  server.stderr.on("data", chunk => {
    serverError += chunk;
  });

  try {
    const baseUrl = `http://127.0.0.1:${port}`;
    await waitForServer(baseUrl, server, () => serverError);

    const created = await requestJson(`${baseUrl}/api/cases`, {
      method: "POST",
      body: JSON.stringify(sampleCase())
    });
    assert.equal(created.artifacts.length, 0);

    const observer = new DatabaseSync(databasePath, { readOnly: true });
    try {
      const before = persistenceSnapshot(observer);
      const loaded = await requestJson(`${baseUrl}/api/cases/${created.id}`);
      const after = persistenceSnapshot(observer);

      assert.equal(loaded.id, created.id);
      assert.equal(loaded.artifacts.length, 0);
      assert.deepEqual(after, before);

      const pilot = await requestJson(`${baseUrl}/api/pilots/real-estate`, {
        method: "POST"
      });
      assert.equal(pilot.artifacts.length, 8);
    } finally {
      observer.close();
    }
  } finally {
    await stopServer(server);
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
});

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });
  const body = await response.json();
  assert.equal(response.ok, true, JSON.stringify(body));
  return body;
}

async function waitForServer(baseUrl, server, getServerError) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Server exited before startup: ${getServerError()}`);
    }
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {
      // The child process may still be binding its local port.
    }
    await delay(100);
  }
  throw new Error(`Server did not start: ${getServerError()}`);
}

async function stopServer(server) {
  if (server.exitCode !== null) return;
  const exited = new Promise(resolveExit => server.once("exit", resolveExit));
  server.kill("SIGTERM");
  await exited;
}

async function getAvailablePort() {
  const server = createServer();
  await new Promise((resolveListen, rejectListen) => {
    server.once("error", rejectListen);
    server.listen(0, "127.0.0.1", resolveListen);
  });
  const { port } = server.address();
  await new Promise((resolveClose, rejectClose) => {
    server.close(error => error ? rejectClose(error) : resolveClose());
  });
  return port;
}

function persistenceSnapshot(db) {
  const tables = [
    "valuation_cases",
    "engagements",
    "asset_groups",
    "report_sections",
    "report_section_versions",
    "agent_tasks",
    "artifacts",
    "artifact_versions",
    "artifact_reviews",
    "audit_events"
  ];
  return {
    dataVersion: Number(db.prepare("PRAGMA data_version").get().data_version),
    counts: Object.fromEntries(tables.map(table => [
      table,
      Number(db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count)
    ]))
  };
}

function sampleCase() {
  return {
    title: "Fictional apartment",
    customerName: "Fictional Customer LLC",
    purpose: "Workflow verification",
    valueType: "Market value",
    valuationDate: "2026-06-15",
    deadline: "2026-06-20",
    appraiserId: "user-appraiser",
    reviewerId: "user-reviewer",
    caseMode: "single",
    releaseStrategy: "unified",
    assetGroups: [
      {
        directionCode: "real_estate",
        objectTypeCode: "apartment",
        title: "Fictional apartment"
      }
    ]
  };
}
