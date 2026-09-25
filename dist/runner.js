"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runReleaseGuard = runReleaseGuard;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const appConfig_1 = require("./rules/appConfig");
const easConfig_1 = require("./rules/easConfig");
const secrets_1 = require("./rules/secrets");
const typescript_1 = require("./rules/typescript");
const reporter_1 = require("./reporter");
function runReleaseGuard(targetDir = process.cwd(), options = {}) {
    const ctx = {
        projectRoot: targetDir
    };
    // 1. Resolve app.json
    const appJsonPath = path_1.default.join(targetDir, 'app.json');
    if (fs_1.default.existsSync(appJsonPath)) {
        try {
            ctx.appJsonPath = appJsonPath;
            ctx.appJson = JSON.parse(fs_1.default.readFileSync(appJsonPath, 'utf8'));
        }
        catch (e) { }
    }
    // 2. Resolve package.json
    const pkgJsonPath = path_1.default.join(targetDir, 'package.json');
    if (fs_1.default.existsSync(pkgJsonPath)) {
        try {
            ctx.packageJsonPath = pkgJsonPath;
            ctx.packageJson = JSON.parse(fs_1.default.readFileSync(pkgJsonPath, 'utf8'));
        }
        catch (e) { }
    }
    // 3. Resolve eas.json
    const easJsonPath = path_1.default.join(targetDir, 'eas.json');
    if (fs_1.default.existsSync(easJsonPath)) {
        try {
            ctx.easJsonPath = easJsonPath;
            ctx.easJson = JSON.parse(fs_1.default.readFileSync(easJsonPath, 'utf8'));
        }
        catch (e) { }
    }
    const results = [
        ...(0, appConfig_1.checkAppConfig)(ctx),
        ...(0, easConfig_1.checkEasConfig)(ctx),
        ...(0, secrets_1.checkSecrets)(ctx),
        ...(0, typescript_1.checkTypeScript)(ctx)
    ];
    const fails = results.filter(r => r.severity === 'fail').length;
    const warns = results.filter(r => r.severity === 'warn').length;
    // Calculate score out of 10
    let score = 10;
    score -= fails * 2.5;
    score -= warns * 1.0;
    if (score < 0)
        score = 0;
    score = Math.round(score * 10) / 10;
    const report = {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        projectRoot: targetDir,
        score,
        results,
        hasFailures: fails > 0
    };
    if (options.json) {
        console.log(JSON.stringify(report, null, 2));
    }
    else {
        (0, reporter_1.printTerminalReport)(report);
    }
    // Exit with 1 if critical failures exist (useful for CI/CD gates)
    return report.hasFailures ? 1 : 0;
}
//# sourceMappingURL=runner.js.map