"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAppConfig = checkAppConfig;
function checkAppConfig(ctx) {
    const results = [];
    const expo = ctx.appJson?.expo;
    if (!expo) {
        results.push({
            id: 'app-config-missing',
            category: 'CONFIG',
            title: 'app.json Expo Configuration',
            severity: 'fail',
            message: 'No "expo" root object found in app.json.',
            fixRecommendation: 'Ensure app.json contains a valid { "expo": { ... } } configuration.'
        });
        return results;
    }
    // 1. Android Package & VersionCode
    const android = expo.android || {};
    if (!android.package || android.package.includes('com.example')) {
        results.push({
            id: 'android-package',
            category: 'STORE COMPLIANCE',
            title: 'Android Package Name',
            severity: 'fail',
            message: `Invalid or default Android package: "${android.package || 'none'}"`,
            fixRecommendation: 'Set a unique domain-based package in app.json (e.g. com.company.app).'
        });
    }
    else {
        results.push({
            id: 'android-package',
            category: 'STORE COMPLIANCE',
            title: 'Android Package Name',
            severity: 'pass',
            message: `Valid package defined: ${android.package}`
        });
    }
    if (typeof android.versionCode !== 'number' || android.versionCode < 1) {
        results.push({
            id: 'android-version-code',
            category: 'STORE COMPLIANCE',
            title: 'Android Version Code',
            severity: 'fail',
            message: `versionCode must be a positive integer, found: ${android.versionCode}`,
            fixRecommendation: 'Add "versionCode": 1 (or bump for new release) under expo.android in app.json.'
        });
    }
    else {
        results.push({
            id: 'android-version-code',
            category: 'STORE COMPLIANCE',
            title: 'Android Version Code',
            severity: 'pass',
            message: `Valid versionCode: ${android.versionCode} (v${expo.version || '1.0.0'})`
        });
    }
    // 2. iOS BundleIdentifier & BuildNumber
    const ios = expo.ios || {};
    if (!ios.bundleIdentifier || ios.bundleIdentifier.includes('com.example')) {
        results.push({
            id: 'ios-bundle-id',
            category: 'STORE COMPLIANCE',
            title: 'iOS Bundle Identifier',
            severity: 'fail',
            message: `Invalid or default iOS bundleIdentifier: "${ios.bundleIdentifier || 'none'}"`,
            fixRecommendation: 'Set a unique bundleIdentifier under expo.ios in app.json.'
        });
    }
    else {
        results.push({
            id: 'ios-bundle-id',
            category: 'STORE COMPLIANCE',
            title: 'iOS Bundle Identifier',
            severity: 'pass',
            message: `Valid bundleIdentifier: ${ios.bundleIdentifier}`
        });
    }
    // 3. Apple Privacy Manifest (Required by Apple since May 2024!)
    const privacyManifests = ios.privacyManifests;
    if (!privacyManifests || !privacyManifests.NSPrivacyAccessedAPITypes) {
        results.push({
            id: 'apple-privacy-manifest',
            category: 'APPLE AUDIT',
            title: 'Apple Privacy Manifest (NSPrivacyAccessedAPITypes)',
            severity: 'warn',
            message: 'No Apple Privacy Manifest found in expo.ios.privacyManifests.',
            fixRecommendation: 'Add privacyManifests to app.json for AsyncStorage/UserDefaults (e.g. NSPrivacyAccessedAPITypeReasons: ["CA92.1"]) to avoid App Store review rejections.'
        });
    }
    else {
        results.push({
            id: 'apple-privacy-manifest',
            category: 'APPLE AUDIT',
            title: 'Apple Privacy Manifest',
            severity: 'pass',
            message: 'Official Apple Privacy Manifest declared in app.json.'
        });
    }
    // 4. Permission Hygiene (Check for dangerous unmapped permissions)
    const androidPerms = android.permissions || [];
    const dangerousPerms = ['CAMERA', 'RECORD_AUDIO', 'ACCESS_FINE_LOCATION', 'READ_CONTACTS'];
    const infoPlist = ios.infoPlist || {};
    const flagged = androidPerms.filter(p => dangerousPerms.includes(p));
    if (flagged.length > 0) {
        results.push({
            id: 'native-permissions',
            category: 'PERMISSION AUDIT',
            title: 'Sensitive Native Permissions',
            severity: 'warn',
            message: `Sensitive permissions requested: ${flagged.join(', ')}`,
            fixRecommendation: 'Ensure every requested permission is actively used in the app, or remove it to pass App Store review guideline 5.1.1.'
        });
    }
    else {
        results.push({
            id: 'native-permissions',
            category: 'PERMISSION AUDIT',
            title: 'Permission Hygiene',
            severity: 'pass',
            message: 'No suspicious or unused high-risk permissions detected.'
        });
    }
    return results;
}
//# sourceMappingURL=appConfig.js.map