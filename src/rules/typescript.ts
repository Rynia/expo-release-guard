import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { CheckResult, ProjectContext } from '../types';

export function checkTypeScript(ctx: ProjectContext): CheckResult[] {
  const results: CheckResult[] = [];
  const tsconfigPath = path.join(ctx.projectRoot, 'tsconfig.json');

  if (!fs.existsSync(tsconfigPath)) {
    results.push({
      id: 'typescript-check',
      category: 'CODE QUALITY',
      title: 'TypeScript Typecheck',
      severity: 'info',
      message: 'No tsconfig.json found; skipping strict type checking.'
    });
    return results;
  }

  try {
    // Attempt local npx tsc --noEmit
    execSync('npx --no-install tsc --noEmit', {
      cwd: ctx.projectRoot,
      stdio: 'pipe',
      timeout: 20000
    });
    results.push({
      id: 'typescript-check',
      category: 'CODE QUALITY',
      title: 'TypeScript Typecheck',
      severity: 'pass',
      message: 'Strict typecheck passed with 0 compile errors.'
    });
  } catch (error: any) {
    const output = error.stdout ? error.stdout.toString() : '';
    const errCount = (output.match(/error TS/g) || []).length;
    results.push({
      id: 'typescript-check',
      category: 'CODE QUALITY',
      title: 'TypeScript Typecheck',
      severity: 'warn',
      message: `TypeScript errors found (${errCount || 'several'}). Ensure tsc exits with 0 before shipping.`,
      fixRecommendation: 'Run "npx tsc --noEmit" to inspect and fix type errors.'
    });
  }

  return results;
}
