"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printTerminalReport = printTerminalReport;
const colors_1 = require("./colors");
function printTerminalReport(report) {
    const line = '─'.repeat(68);
    console.log('\n' + (0, colors_1.bold)((0, colors_1.cyan)('🛡️  EXPO RELEASE GUARD — Pre-Flight Store Audit v1.0.0')));
    console.log((0, colors_1.dim)(`Target Project: ${report.projectRoot}`));
    console.log((0, colors_1.dim)(`Audited At:     ${report.timestamp}`));
    console.log(line);
    for (const res of report.results) {
        let icon = '';
        let statusText = '';
        switch (res.severity) {
            case 'pass':
                icon = (0, colors_1.green)('✓ PASS');
                statusText = res.message;
                break;
            case 'warn':
                icon = (0, colors_1.yellow)('⚠ WARN');
                statusText = (0, colors_1.yellow)(res.message);
                break;
            case 'fail':
                icon = (0, colors_1.red)('✗ FAIL');
                statusText = (0, colors_1.red)(res.message);
                break;
            case 'info':
                icon = (0, colors_1.cyan)('ℹ INFO');
                statusText = res.message;
                break;
        }
        const categoryTag = (0, colors_1.bold)(`[${res.category}]`).padEnd(22, ' ');
        console.log(`${icon}  ${categoryTag} ${(0, colors_1.bold)(res.title)}`);
        console.log(`       ${(0, colors_1.dim)('└─')} ${statusText}`);
        if (res.fixRecommendation && res.severity !== 'pass') {
            console.log(`          ${(0, colors_1.cyan)('Action:')} ${res.fixRecommendation}`);
        }
        console.log('');
    }
    console.log(line);
    // Score Banner
    const scoreColor = report.score >= 9 ? colors_1.green : report.score >= 7 ? colors_1.yellow : colors_1.red;
    const scoreBadge = scoreColor((0, colors_1.bold)(` ${report.score}/10 `));
    if (!report.hasFailures) {
        console.log(`🎉 ${(0, colors_1.bold)('STORE READINESS SCORE:')} ${scoreBadge} — ${(0, colors_1.green)('READY FOR APP STORE & GOOGLE PLAY!')}`);
    }
    else {
        console.log(`🚨 ${(0, colors_1.bold)('STORE READINESS SCORE:')} ${scoreBadge} — ${(0, colors_1.red)('CRITICAL REJECTION RISKS DETECTED!')}`);
        console.log((0, colors_1.dim)('Resolve all failing checks above before submitting builds to EAS.'));
    }
    console.log(line + '\n');
}
//# sourceMappingURL=reporter.js.map