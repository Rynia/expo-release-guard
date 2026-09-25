# 🛡️ expo-release-guard
### *Pre-flight store safety, privacy manifest & release readiness CLI for Expo & React Native apps.*

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT License" />
  <img src="https://img.shields.io/badge/Expo-SDK_50%2B-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo SDK" />
  <img src="https://img.shields.io/badge/Apple_Store_Compliance-Audited-0284C7?style=for-the-badge&logo=apple&logoColor=white" alt="Apple Store" />
  <img src="https://img.shields.io/badge/Google_Play_Compliance-Audited-34D399?style=for-the-badge&logo=googleplay&logoColor=white" alt="Google Play" />
  <img src="https://img.shields.io/badge/Dependencies-0-success?style=for-the-badge" alt="Zero Dependencies" />
</p>

---

```text
🛡️  EXPO RELEASE GUARD — Pre-Flight Store Audit v1.0.0
Target Project: /Users/developer/my-expo-app
────────────────────────────────────────────────────────────────────
✓ PASS  [STORE COMPLIANCE] Android Package Name
       └─ Valid package defined: com.company.app
✓ PASS  [STORE COMPLIANCE] Android Version Code
       └─ Valid versionCode: 3 (v1.0.0)
✓ PASS  [APPLE AUDIT]      Apple Privacy Manifest
       └─ Official Apple Privacy Manifest declared (UserDefaults CA92.1)
✓ PASS  [PERMISSION AUDIT] Permission Hygiene
       └─ No unmapped or suspicious high-risk permissions detected
✓ PASS  [EAS BUILD]        EAS Production Profile
       └─ Verified "production" build profile configured in eas.json
✓ PASS  [SECURITY HYGIENE] Secret Hygiene
       └─ No private API keys or tokens leaked in EXPO_PUBLIC_*
✓ PASS  [CODE QUALITY]     TypeScript Typecheck
       └─ Strict typecheck passed with 0 compile errors

────────────────────────────────────────────────────────────────────
🎉 STORE READINESS SCORE:  10/10  — READY FOR APP STORE & GOOGLE PLAY!
────────────────────────────────────────────────────────────────────
```

---

## ⚡ The Problem: Avoid Store Rejection Traps

Submitting an Expo build to EAS takes **30–45 minutes in cloud queues**, only to be hit by frustrating store rejections or failed pipeline uploads:

* 🚨 **Apple May 2024 Privacy Manifest Mandate:** Missing `NSPrivacyAccessedAPITypes` (e.g. for `AsyncStorage` / `UserDefaults` `CA92.1`) causes instant App Store review rejections.
* 🚨 **Unused Permission Traps:** Declaring native permissions like `CAMERA` without active UI usage violates App Store Guideline 5.1.1.
* 🚨 **Forgotten `versionCode` Bumps:** Reusing the previous Android `versionCode` results in an immediate fatal rejection on Google Play Console.
* 🚨 **Exposed Secrets in Public Bundles:** Accidentally declaring private API keys under `EXPO_PUBLIC_*` leaks credentials in client APK/IPA binaries.

**`expo-release-guard` audits all of this locally in less than 3 seconds before you push to EAS.**

---

## 🚀 Quick Run (Zero Install Required)

Run directly in the root of your Expo project:

```bash
npx expo-release-guard
```

To audit a specific project directory:
```bash
npx expo-release-guard ./path/to/expo-app
```

For automated CI/CD pipelines (exits with code `1` on critical failures):
```bash
npx expo-release-guard --json
```

---

## 🔍 Audits & Rules Included

| Category | What it Checks | Severity |
|:---|:---|:---|
| **Apple Privacy Manifest** | Ensures `ios.privacyManifests` exists and covers `AsyncStorage` / `UserDefaults` APIs. | 🚨 High |
| **Android Version Code** | Confirms `android.versionCode` is a valid positive integer. | 🚨 High |
| **Package & Bundle Identifiers** | Flags default placeholder identifiers (`com.example.*`). | 🚨 High |
| **Permission Hygiene** | Scans for sensitive permissions (`CAMERA`, `LOCATION`) without proper plist disclosures. | ⚠️ Warning |
| **EAS Build Configuration** | Verifies `eas.json` has a designated `production` build profile. | 🚨 High |
| **Secret Hygiene** | Scans `.env` files for high-entropy secrets and private keys prefixed with `EXPO_PUBLIC_`. | 🚨 Critical |
| **Strict Typecheck** | Runs `tsc --noEmit` and checks for zero compile errors. | ⚠️ Warning |

---

## 🛠️ GitHub Actions CI Gate

Block pull requests or failed releases automatically before EAS builds trigger:

```yaml
name: Pre-Flight Store Audit

on:
  push:
    branches: [main]
  pull_request:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - name: Run Expo Release Guard
        run: npx expo-release-guard
```

---

## 📄 License & Studio

* **License:** MIT © 2026 [Muharrem Özmen (@Rynia)](https://github.com/Rynia)
* **Architected by:** [Rynia Studios](https://ryniastudios.netlify.app)
* *Part of the Rynia Local-First & Ambient Systems initiative.*
