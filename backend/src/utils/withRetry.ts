export interface WithRetryOptions {
  retries?: number;
  label?: string;
}

export async function withRetry<T>(fn: () => Promise<T>, { retries = 2, label = 'task' }: WithRetryOptions = {}): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      console.warn(`[${label}] attempt ${attempt + 1} failed: ${err.message}`);
    }
  }
  throw lastError;
}
