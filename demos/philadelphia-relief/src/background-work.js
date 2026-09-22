/** Yield bounded preparation work so input and rendering can run between batches. */
export const yieldToBrowser = () => globalThis.scheduler?.yield
  ? globalThis.scheduler.yield() : new Promise(resolve => setTimeout(resolve, 0));

export async function prepareInBatches(iterator, { signal, budget = 4,
  now = () => performance.now(), pause = yieldToBrowser } = {}) {
  let deadline = now() + budget;
  try {
    for (;;) {
      signal?.throwIfAborted();
      const step = iterator.next();
      if (step.done) return step.value;
      if (now() >= deadline) {
        await pause();
        deadline = now() + budget;
      }
    }
  } finally { iterator.return?.(); }
}
