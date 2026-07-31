import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const gameUrl =
  process.argv[2] ??
  "https://jez237.com/games/2026-07-14/pinball-dreams-ii/?smoke=1";
const chromePath = process.env.CHROME_PATH ?? "/usr/bin/google-chrome";
const port = Number(process.env.CDP_PORT ?? 19351);
const fastTimers = process.env.FAST_TIMERS !== "0";
const tableKeys = (process.env.TABLE_KEYS ?? "F1,F2,F3,F4")
  .split(",")
  .map((key) => key.trim())
  .filter(Boolean);
const profile = await mkdtemp(join(tmpdir(), "pinball-dreams-smoke-"));
const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "pipe"] },
);

let chromeErrors = "";
chrome.stderr.on("data", (chunk) => {
  chromeErrors += chunk.toString();
});

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitForDebugger() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (response.ok) {
        const targets = await response.json();
        const page = targets.find((target) => target.type === "page");
        if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
      }
    } catch {
      // Chrome is still starting.
    }
    await delay(100);
  }
  throw new Error(`Chrome debugger did not start.\n${chromeErrors}`);
}

const websocketUrl = await waitForDebugger();
const socket = new WebSocket(websocketUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let commandId = 0;
const pending = new Map();
const failedRequests = [];
const exceptions = [];
const physicsRequests = [];
const consoleMessages = [];

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const command = pending.get(message.id);
    if (!command) return;
    pending.delete(message.id);
    if (message.error) command.reject(new Error(message.error.message));
    else command.resolve(message.result);
    return;
  }
  if (message.method === "Runtime.exceptionThrown") {
    exceptions.push(
      message.params.exceptionDetails.exception?.description ??
        message.params.exceptionDetails.text,
    );
  }
  if (message.method === "Runtime.consoleAPICalled") {
    consoleMessages.push({
      type: message.params.type,
      values: message.params.args.map(
        (argument) =>
          argument.value ??
          argument.unserializableValue ??
          argument.description ??
          argument.type,
      ),
    });
  }
  if (message.method === "Log.entryAdded") {
    consoleMessages.push({
      type: message.params.entry.level,
      values: [message.params.entry.text],
    });
  }
  if (message.method === "Network.responseReceived") {
    const { response } = message.params;
    if (response.url.includes("/generated/physics/")) {
      physicsRequests.push({ status: response.status, url: response.url });
    }
    if (response.status >= 400) {
      failedRequests.push({ status: response.status, url: response.url });
    }
  }
});

function command(method, params = {}) {
  const id = ++commandId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
  });
}

async function evaluate(expression) {
  const result = await command("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(
      result.exceptionDetails.exception?.description ??
        result.exceptionDetails.text,
    );
  }
  return result.result.value;
}

async function waitForTable() {
  for (let attempt = 0; attempt < (fastTimers ? 80 : 240); attempt += 1) {
    const state = await evaluate(`(() => ({
      game: document.querySelector(".game-screen.is-visible") !== null,
      error: document.querySelector(".loading-screen.is-visible .loading-error") !== null,
      canvasLabel: document.querySelector(".game-screen.is-visible canvas")?.getAttribute("aria-label") ??
        document.querySelector(".playfield-viewport canvas")?.getAttribute("aria-label") ?? "",
      phase: document.querySelector(".game-screen.is-visible canvas")?.dataset.phase ?? "",
      hdStatus: document.querySelector(".game-screen.is-visible canvas")?.dataset.hdStatus ?? "",
      stage: document.querySelector("main.arcade-stage")?.className ?? ""
    }))()`);
    if (state.game || state.error) return state;
    await delay(125);
  }
  return {
    game: false,
    error: false,
    canvasLabel: "",
    phase: "",
    hdStatus: "",
    stage: "",
  };
}

let results;
try {
  await command("Runtime.enable");
  await command("Log.enable");
  await command("Network.enable");
  await command("Page.enable");
  await command("Page.addScriptToEvaluateOnNewDocument", {
    source: `{
      window.__pinballHandledRejections = [];
      window.__pinballConsoleErrors = [];
      const nativeConsoleError = console.error.bind(console);
      console.error = (...args) => {
        window.__pinballConsoleErrors.push(
          args.map((value) => String(value?.stack ?? value?.message ?? value))
        );
        nativeConsoleError(...args);
      };
      const nativeThen = Promise.prototype.then;
      Promise.prototype.then = function (onFulfilled, onRejected) {
        const wrappedRejected =
          typeof onRejected === "function"
            ? function (error) {
                window.__pinballHandledRejections.push(
                  String(error?.stack ?? error?.message ?? error)
                );
                return onRejected.call(this, error);
              }
            : onRejected;
        return nativeThen.call(this, onFulfilled, wrappedRejected);
      };
      ${
        fastTimers
          ? `const nativeSetTimeout = window.setTimeout.bind(window);
      window.setTimeout = (callback, delay, ...args) =>
        nativeSetTimeout(callback, delay > 5000 ? 750 : delay, ...args);`
          : ""
      }
    }`,
  });
  await command("Page.navigate", { url: gameUrl });
  await delay(2500);
  await evaluate(`document.querySelector(".modern-boot-button")?.click()`);
  await delay(250);
  await evaluate(`document.querySelector(".skip-intro")?.click()`);
  await delay(500);

  results = [];
  for (const key of tableKeys) {
    await evaluate(
      `Array.from(document.querySelectorAll(".selector-hotspots button")).find((button) => button.getAttribute("aria-label")?.startsWith("${key}:"))?.click()`,
    );
    await delay(250);
    results.push({ key, ...(await waitForTable()) });
  }

  const scriptResources = await evaluate(
    `performance.getEntriesByType("resource")
      .map(({ name }) => name)
      .filter((name) => name.includes("/assets-"))`,
  );
  const releaseLoaded = scriptResources.some((name) =>
    name.includes("/assets-a102c7e31f4b/PinballDreams-"),
  );
  const effectiveUrl = await evaluate(`window.location.href`);
  const handledRejections = await evaluate(
    `window.__pinballHandledRejections ?? []`,
  );
  const capturedConsoleErrors = await evaluate(
    `window.__pinballConsoleErrors ?? []`,
  );
  const versionedPhysicsRequests = physicsRequests.filter(
    ({ url }) => url.includes(".u8?v=") || url.includes(".png?v="),
  );
  const report = {
    gameUrl,
    effectiveUrl,
    results,
    releaseLoaded,
    scriptResources,
    physicsRequestCount: physicsRequests.length,
    versionedPhysicsRequestCount: versionedPhysicsRequests.length,
    physicsRequests,
    failedRequests,
    exceptions,
    consoleMessages,
    capturedConsoleErrors,
    handledRejections,
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

  const failed =
    results.some((result) => !result.game || result.error) ||
    !effectiveUrl.includes("release=1.0.2") ||
    !releaseLoaded ||
    versionedPhysicsRequests.length === 0 ||
    failedRequests.some(({ url }) => url.includes("/generated/physics/")) ||
    exceptions.length > 0;
  if (failed) process.exitCode = 1;
} finally {
  socket.close();
  chrome.kill("SIGTERM");
  await delay(250);
  await rm(profile, { recursive: true, force: true });
}
