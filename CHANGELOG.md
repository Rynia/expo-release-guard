# Changelog

All notable changes to `expo-release-guard` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-09-25

### Added
- **Production Stable Release**: Multi-rule pre-flight verification engine for Expo & React Native.
- Apple Privacy Manifest (`NSPrivacyAccessedAPITypes`, ITMS-91053) compliance checker.
- Sensitive Android permissions auditor (`READ_MEDIA_IMAGES`, `RECORD_AUDIO`, `ACCESS_FINE_LOCATION`).
- Production build profile validator for `eas.json` (`autoIncrement: false`, production release channel).
- Secret leak detector scanning for `EXPO_PUBLIC_*` credential exposures in source bundles.
- Zero-external-dependency CLI executable (`npx expo-release-guard`).

### Battle-Tested
- Audited and certified in production against **[KALANLA](https://github.com/Rynia/KALANLA)** (Kiler Kitchen OS).

---

## [0.9.1] - 2026-09-12

### Changed
- Improved error diagnostics for missing `ios.privacyManifests` configuration block in `app.json`.
- Color-coded severity output with ANSI terminal styling.

---

## [0.8.0] - 2026-08-25

### Added
- Initial pre-flight verification prototype.
- TypeScript compiler (`tsc --noEmit`) safety check runner.
