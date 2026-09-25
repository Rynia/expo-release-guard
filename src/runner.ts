import fs from 'fs';
import path from 'path';
import { ProjectContext, ReleaseReport, CheckResult } from './types';
import { checkAppConfig } from './rules/appConfig';
import { checkEasConfig } from './rules/easConfig';
import { checkSecrets } from './rules/secrets';
import { checkTypeScript } from './rules/typescript';
import { printTerminalReport } from './reporter';

export function runReleaseGuard(targetDir: string = process.cwd(), options: { json?: boolean } = {}): number {
  const ctx: ProjectContext = {
    projectRoot: targetDir
  };

  // 1. Resolve app.json
  const appJsonPath = path.join(targetDir, 'app.json');
  if (fs.existsSync(appJsonPath)) {
    try {
      ctx.appJsonPath = appJsonPath;
      ctx.appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    } catch (e) {}
  }

  // 2. Resolve package.json
  const pkgJsonPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    try {
      ctx.packageJsonPath = pkgJsonPath;
      ctx.packageJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    } catch (e) {}
  }

  // 3. Resolve eas.json
  const easJsonPath = path.join(targetDir, 'eas.json');
  if (fs.existsSync(easJsonPath)) {
    try {
      ctx.easJsonPath = easJsonPath;
      ctx.easJson = JSON.parse(fs.readFileSync(easJsonPath, 'utf8'));
    } catch (e) {}
  }

  const results: CheckResult[] = [
    ...checkAppConfig(ctx),
    ...checkEasConfig(ctx),
    ...checkSecrets(ctx),
    ...checkTypeScript(ctx)
  ];

  const fails = results.filter(r => r.severity === 'fail').length;
  const warns = results.filter(r => r.severity === 'warn').length;

  // Calculate score out of 10
  let score = 10;
  score -= fails * 2.5;
  score -= warns * 1.0;
  if (score < 0) score = 0;
  score = Math.round(score * 10) / 10;

  const report: ReleaseReport = {
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    projectRoot: targetDir,
    score,
    results,
    hasFailures: fails > 0
  };

  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printTerminalReport(report);
  }

  // Exit with 1 if critical failures exist (useful for CI/CD gates)
  return report.hasFailures ? 1 : 0;
}
