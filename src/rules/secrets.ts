import fs from 'fs';
import path from 'path';
import { CheckResult, ProjectContext } from '../types';

export function checkSecrets(ctx: ProjectContext): CheckResult[] {
  const results: CheckResult[] = [];
  const envFiles = ['.env', '.env.local', '.env.production'];

  let suspiciousTokensFound: string[] = [];

  for (const envFile of envFiles) {
    const fullPath = path.join(ctx.projectRoot, envFile);
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');
        for (const line of lines) {
          if (line.trim().startsWith('EXPO_PUBLIC_')) {
            const [key, val] = line.split('=');
            if (val) {
              const cleanVal = val.trim();
              if (
                cleanVal.startsWith('sk_live_') ||
                cleanVal.startsWith('ghp_') ||
                cleanVal.includes('PRIVATE KEY') ||
                cleanVal.length > 60
              ) {
                suspiciousTokensFound.push(key.trim());
              }
            }
          }
        }
      } catch (e) {}
    }
  }

  if (suspiciousTokensFound.length > 0) {
    results.push({
      id: 'secret-leak-expo-public',
      category: 'SECURITY HYGIENE',
      title: 'Leaked Secrets in EXPO_PUBLIC_*',
      severity: 'fail',
      message: `Suspicious secret keys bundled into public client build: ${suspiciousTokensFound.join(', ')}`,
      fixRecommendation: 'Move private keys out of EXPO_PUBLIC_* into secure EAS secrets or backend proxies.'
    });
  } else {
    results.push({
      id: 'secret-leak-expo-public',
      category: 'SECURITY HYGIENE',
      title: 'Secret Hygiene',
      severity: 'pass',
      message: 'No private credentials or high-entropy secrets exposed in EXPO_PUBLIC_* variables.'
    });
  }

  return results;
}
