import { CheckResult, ProjectContext } from '../types';

export function checkEasConfig(ctx: ProjectContext): CheckResult[] {
  const results: CheckResult[] = [];

  if (!ctx.easJson) {
    results.push({
      id: 'eas-config-missing',
      category: 'EAS BUILD',
      title: 'EAS Configuration (eas.json)',
      severity: 'warn',
      message: 'No eas.json found in project root.',
      fixRecommendation: 'Run "npx eas build:configure" to setup cloud build profiles for Google Play & TestFlight.'
    });
    return results;
  }

  const build = ctx.easJson.build || {};
  if (!build.production) {
    results.push({
      id: 'eas-production-profile',
      category: 'EAS BUILD',
      title: 'EAS Production Profile',
      severity: 'fail',
      message: 'Missing "production" profile in eas.json under build.',
      fixRecommendation: 'Add a "production" profile with channel/release configurations in eas.json.'
    });
  } else {
    results.push({
      id: 'eas-production-profile',
      category: 'EAS BUILD',
      title: 'EAS Production Profile',
      severity: 'pass',
      message: 'Verified "production" build profile configured in eas.json.'
    });
  }

  return results;
}
