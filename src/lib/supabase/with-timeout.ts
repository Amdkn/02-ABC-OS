/**
 * Wraps a Supabase query promise with an AbortController timeout.
 * If the query doesn't settle within `ms`, rejects with a TimeoutError.
 * The caller should catch and fall back to mockData.
 *
 * NOTE: PostgREST does not yet support AbortSignal propagation through the
 * supabase-js client, so this is a wall-clock guard. The real value is
 * unblocking the page render, not cancelling the in-flight request.
 */
export class QueryTimeoutError extends Error {
  constructor(ms: number) {
    super(`Supabase query exceeded ${ms}ms timeout`);
    this.name = 'QueryTimeoutError';
  }
}

export async function withTimeout<T>(
  promise: PromiseLike<T>,
  ms: number,
  externalSignal?: AbortSignal
): Promise<T> {
  const controller = new AbortController();
  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener('abort', onExternalAbort);
  }
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
  const timeoutPromise = new Promise<never>((_resolve, reject) => {
    timeoutHandle = setTimeout(() => {
      controller.abort();
      reject(new QueryTimeoutError(ms));
    }, ms);
  });
  try {
    const result = await Promise.race([Promise.resolve(promise), timeoutPromise]);
    return result as T;
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
    if (externalSignal) externalSignal.removeEventListener('abort', onExternalAbort);
  }
}
