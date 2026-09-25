"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSecrets = checkSecrets;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function checkSecrets(ctx) {
    const results = [];
    const envFiles = ['.env', '.env.local', '.env.production'];
    let suspiciousTokensFound = [];
    for (const envFile of envFiles) {
        const fullPath = path_1.default.join(ctx.projectRoot, envFile);
        if (fs_1.default.existsSync(fullPath)) {
            try {
                const content = fs_1.default.readFileSync(fullPath, 'utf8');
                const lines = content.split('\n');
                for (const line of lines) {
                    if (line.trim().startsWith('EXPO_PUBLIC_')) {
                        const [key, val] = line.split('=');
                        if (val) {
                            const cleanVal = val.trim();
                            if (cleanVal.startsWith('sk_live_') ||
                                cleanVal.startsWith('ghp_') ||
                                cleanVal.includes('PRIVATE KEY') ||
                                cleanVal.length > 60) {
                                suspiciousTokensFound.push(key.trim());
                            }
                        }
                    }
                }
            }
            catch (e) { }
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
    }
    else {
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
//# sourceMappingURL=secrets.js.map