type BoundedResponseTextOptions = Readonly<{
  label: string;
  maximumBytes: number;
  maximumChunks: number;
  signal?: AbortSignal;
}>;

type ResponseDeadlineOptions = Readonly<{
  label: string;
  maximumMilliseconds: number;
}>;

function declaredContentLength(response: Pick<Response, "headers">) {
  const value = response.headers.get("content-length");
  if (value === null || !/^\d+$/u.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : Number.POSITIVE_INFINITY;
}

function abortReason(signal: AbortSignal, label: string) {
  return signal.reason instanceof Error
    ? signal.reason
    : new Error(`${label} was aborted`);
}

export async function withResponseDeadline<T>(
  { label, maximumMilliseconds }: ResponseDeadlineOptions,
  operation: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
  if (!Number.isSafeInteger(maximumMilliseconds) || maximumMilliseconds < 1) {
    throw new Error(`${label} has an invalid deadline`);
  }
  const signal = AbortSignal.timeout(maximumMilliseconds);
  const deadlineError = new Error(
    `${label} exceeds the ${maximumMilliseconds}-millisecond deadline`,
  );
  let rejectDeadline: (reason: Error) => void = () => undefined;
  const deadline = new Promise<never>((_resolve, reject) => {
    rejectDeadline = reject;
  });
  const handleAbort = () => rejectDeadline(deadlineError);
  signal.addEventListener("abort", handleAbort, { once: true });
  try {
    return await Promise.race([
      Promise.resolve().then(() => operation(signal)),
      deadline,
    ]);
  } finally {
    signal.removeEventListener("abort", handleAbort);
  }
}

export async function readBoundedResponseText(
  response: Pick<Response, "body" | "headers">,
  { label, maximumBytes, maximumChunks, signal }: BoundedResponseTextOptions,
) {
  if (!Number.isSafeInteger(maximumBytes) || maximumBytes < 0) {
    throw new Error(`${label} has an invalid byte limit`);
  }
  if (!Number.isSafeInteger(maximumChunks) || maximumChunks < 1) {
    throw new Error(`${label} has an invalid chunk limit`);
  }
  if (signal?.aborted) {
    const error = abortReason(signal, label);
    if (response.body !== null) void response.body.cancel(error).catch(() => undefined);
    throw error;
  }
  const declaredBytes = declaredContentLength(response);
  if (declaredBytes !== null && declaredBytes > maximumBytes) {
    const error = new Error(`${label} exceeds the ${maximumBytes}-byte limit`);
    if (response.body !== null) void response.body.cancel(error).catch(() => undefined);
    throw error;
  }
  if (response.body === null) return "";

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let receivedBytes = 0;
  let receivedChunks = 0;
  let text = "";
  const cancelForAbort = () => {
    if (signal) void reader.cancel(abortReason(signal, label)).catch(() => undefined);
  };
  signal?.addEventListener("abort", cancelForAbort, { once: true });
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (signal?.aborted) throw abortReason(signal, label);
      if (done) break;
      if (!(value instanceof Uint8Array)) {
        throw new Error(`${label} returned a non-byte stream chunk`);
      }
      if (value.byteLength > maximumBytes - receivedBytes) {
        throw new Error(`${label} exceeds the ${maximumBytes}-byte limit`);
      }
      receivedChunks += 1;
      if (receivedChunks > maximumChunks) {
        throw new Error(`${label} exceeds the ${maximumChunks}-chunk limit`);
      }
      receivedBytes += value.byteLength;
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } catch (error) {
    void reader.cancel(error).catch(() => undefined);
    throw error;
  } finally {
    signal?.removeEventListener("abort", cancelForAbort);
    reader.releaseLock();
  }
}
