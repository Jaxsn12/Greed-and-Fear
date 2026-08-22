import assert from 'assert';

interface TestResult {
  name: string;
  ok: boolean;
  error?: string;
}

const results: TestResult[] = [];

export function test(name: string, fn: () => void): void {
  try {
    fn();
    results.push({ name, ok: true });
  } catch (err: any) {
    results.push({ name, ok: false, error: err.message });
  }
}

export function report(): void {
  const failed = results.filter((r) => !r.ok);
  for (const r of results) {
    console.log(`${r.ok ? 'PASS' : 'FAIL'} - ${r.name}${r.ok ? '' : ` :: ${r.error}`}`);
  }
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length > 0) process.exit(1);
}

export { assert };
