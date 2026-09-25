"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTypeScript = checkTypeScript;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
function checkTypeScript(ctx) {
    const results = [];
    const tsconfigPath = path_1.default.join(ctx.projectRoot, 'tsconfig.json');
    if (!fs_1.default.existsSync(tsconfigPath)) {
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
        (0, child_process_1.execSync)('npx --no-install tsc --noEmit', {
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
    }
    catch (error) {
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
//# sourceMappingURL=typescript.js.map