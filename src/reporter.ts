import { ReleaseReport, CheckResult } from './types';
import { green, red, yellow, cyan, bold, dim } from './colors';

export function printTerminalReport(report: ReleaseReport): void {
  const line = '─'.repeat(68);

  console.log('\n' + bold(cyan('🛡️  EXPO RELEASE GUARD — Pre-Flight Store Audit v1.0.0')));
  console.log(dim(`Target Project: ${report.projectRoot}`));
  console.log(dim(`Audited At:     ${report.timestamp}`));
  console.log(line);

  for (const res of report.results) {
    let icon = '';
    let statusText = '';

    switch (res.severity) {
      case 'pass':
        icon = green('✓ PASS');
        statusText = res.message;
        break;
      case 'warn':
        icon = yellow('⚠ WARN');
        statusText = yellow(res.message);
        break;
      case 'fail':
        icon = red('✗ FAIL');
        statusText = red(res.message);
        break;
      case 'info':
        icon = cyan('ℹ INFO');
        statusText = res.message;
        break;
    }

    const categoryTag = bold(`[${res.category}]`).padEnd(22, ' ');
    console.log(`${icon}  ${categoryTag} ${bold(res.title)}`);
    console.log(`       ${dim('└─')} ${statusText}`);

    if (res.fixRecommendation && res.severity !== 'pass') {
      console.log(`          ${cyan('Action:')} ${res.fixRecommendation}`);
    }
    console.log('');
  }

  console.log(line);

  // Score Banner
  const scoreColor = report.score >= 9 ? green : report.score >= 7 ? yellow : red;
  const scoreBadge = scoreColor(bold(` ${report.score}/10 `));

  if (!report.hasFailures) {
    console.log(`🎉 ${bold('STORE READINESS SCORE:')} ${scoreBadge} — ${green('READY FOR APP STORE & GOOGLE PLAY!')}`);
    console.log(dim('\n⭐ Saved an EAS build cycle? Star the repo on GitHub:'));
    console.log(cyan('   https://github.com/Rynia/expo-release-guard\n'));
  } else {
    console.log(`🚨 ${bold('STORE READINESS SCORE:')} ${scoreBadge} — ${red('CRITICAL REJECTION RISKS DETECTED!')}`);
    console.log(dim('Resolve all failing checks above before submitting builds to EAS.\n'));
  }
  console.log(line + '\n');
}
