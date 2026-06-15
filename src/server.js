import { createReadStream, existsSync, mkdirSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  changeCaseStatus,
  createAgentTask,
  createCase,
  createTrainingPilot,
  getCase,
  getDashboard,
  getMetadata,
  listCases,
  reviewArtifact,
  updateArtifact,
  updateReportSection,
  ValidationError
} from "./case-service.js";
import { openDatabase } from "./db.js";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const publicRoot = join(root, "public");
const storageRoot = join(root, "data", "storage");
mkdirSync(storageRoot, { recursive: true });

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4173);
const db = openDatabase(process.env.DATABASE_PATH || undefined);

const server = createServer(async (request, response) => {
  try {
    setSecurityHeaders(response);
    const url = new URL(request.url, `http://${request.headers.host || `${host}:${port}`}`);

    if (url.pathname === "/api/health" && request.method === "GET") {
      return sendJson(response, 200, { status: "ok", database: "connected", time: new Date().toISOString() });
    }
    if (url.pathname === "/api/meta" && request.method === "GET") {
      return sendJson(response, 200, getMetadata(db));
    }
    if (url.pathname === "/api/dashboard" && request.method === "GET") {
      return sendJson(response, 200, getDashboard(db));
    }
    if (url.pathname === "/api/cases" && request.method === "GET") {
      return sendJson(response, 200, listCases(db));
    }
    if (url.pathname === "/api/cases" && request.method === "POST") {
      const body = await readJson(request);
      return sendJson(response, 201, createCase(db, body));
    }
    if (url.pathname === "/api/pilots/real-estate" && request.method === "POST") {
      return sendJson(response, 201, createTrainingPilot(db));
    }

    const caseMatch = url.pathname.match(/^\/api\/cases\/([0-9a-f-]+)$/);
    if (caseMatch && request.method === "GET") {
      const valuationCase = getCase(db, caseMatch[1]);
      return valuationCase
        ? sendJson(response, 200, valuationCase)
        : sendJson(response, 404, { error: "Оценочное дело не найдено" });
    }

    const statusMatch = url.pathname.match(/^\/api\/cases\/([0-9a-f-]+)\/status$/);
    if (statusMatch && request.method === "PATCH") {
      const body = await readJson(request);
      const valuationCase = changeCaseStatus(db, statusMatch[1], body.status);
      return valuationCase
        ? sendJson(response, 200, valuationCase)
        : sendJson(response, 404, { error: "Оценочное дело не найдено" });
    }

    const reportSectionMatch = url.pathname.match(/^\/api\/cases\/([0-9a-f-]+)\/report-sections\/([0-9a-f-]+)$/);
    if (reportSectionMatch && request.method === "PATCH") {
      const body = await readJson(request);
      const section = updateReportSection(db, reportSectionMatch[1], reportSectionMatch[2], body);
      return section
        ? sendJson(response, 200, section)
        : sendJson(response, 404, { error: "Раздел отчета не найден" });
    }

    const taskMatch = url.pathname.match(/^\/api\/cases\/([0-9a-f-]+)\/agent-tasks$/);
    if (taskMatch && request.method === "POST") {
      const body = await readJson(request);
      const task = createAgentTask(db, taskMatch[1], body);
      return task
        ? sendJson(response, 201, task)
        : sendJson(response, 404, { error: "Оценочное дело не найдено" });
    }

    const artifactMatch = url.pathname.match(/^\/api\/cases\/([0-9a-f-]+)\/artifacts\/([0-9a-f-]+)$/);
    if (artifactMatch && request.method === "PATCH") {
      const body = await readJson(request);
      const artifact = updateArtifact(db, artifactMatch[1], artifactMatch[2], body);
      return artifact
        ? sendJson(response, 200, artifact)
        : sendJson(response, 404, { error: "Рабочий артефакт не найден" });
    }

    const artifactReviewMatch = url.pathname.match(/^\/api\/cases\/([0-9a-f-]+)\/artifacts\/([0-9a-f-]+)\/review$/);
    if (artifactReviewMatch && request.method === "POST") {
      const body = await readJson(request);
      const artifact = reviewArtifact(db, artifactReviewMatch[1], artifactReviewMatch[2], body);
      return artifact
        ? sendJson(response, 200, artifact)
        : sendJson(response, 404, { error: "Рабочий артефакт не найден" });
    }

    if (url.pathname.startsWith("/api/")) {
      return sendJson(response, 404, { error: "API-маршрут не найден" });
    }

    return serveStatic(url.pathname, response);
  } catch (error) {
    if (error instanceof ValidationError) {
      return sendJson(response, 422, { error: error.message, details: error.details });
    }
    if (error instanceof SyntaxError) {
      return sendJson(response, 400, { error: "Некорректный JSON" });
    }
    console.error(error);
    return sendJson(response, 500, { error: "Внутренняя ошибка сервера" });
  }
});

server.listen(port, host, () => {
  console.log(`AI Report Helper: http://${host}:${port}`);
});

function sendJson(response, status, data) {
  const body = JSON.stringify(data);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  response.end(body);
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1_000_000) throw new ValidationError("Размер запроса превышает 1 МБ");
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function serveStatic(pathname, response) {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const safePath = normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = resolve(publicRoot, `.${safePath}`);
  if (!filePath.startsWith(publicRoot) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    return sendJson(response, 404, { error: "Файл не найден" });
  }

  const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon"
  };
  response.writeHead(200, {
    "Content-Type": contentTypes[extname(filePath)] || "application/octet-stream",
    "Cache-Control": extname(filePath) === ".html" ? "no-store" : "public, max-age=300"
  });
  createReadStream(filePath).pipe(response);
}

function setSecurityHeaders(response) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("Content-Security-Policy", "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; connect-src 'self'");
}

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
