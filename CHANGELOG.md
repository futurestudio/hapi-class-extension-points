# Changelog

## [2.1.0](https://github.com/futurestudio/hapi-class-extension-points/compare/v2.0.0...v2.1.0) - 2020-06-22

### Added
- TypeScript types for the provided `server.extClass` decoration

### Updated
- bump dependencies


## [2.0.0](https://github.com/futurestudio/hapi-class-extension-points/compare/v1.3.0...v2.0.0) - 2020-01-10

### Breaking Changes
- require Node.js v12
  - this change aligns with the hapi ecosystem requiring Node.js v12 with the release of hapi 19


## [1.3.0](https://github.com/futurestudio/hapi-class-extension-points/compare/v1.2.1...v1.3.0) - 2019-10-17

### Added
- basic TypeScript declarations in `lib/index.d.ts`

### Updated
- bump dependencies
- internal refactorings and clean-ups


## [1.2.1](https://github.com/futurestudio/hapi-class-extension-points/compare/v1.2.0...v1.2.1) - 2019-10-12

### Updated
- bump dependencies
- internal refactorings and clean-ups


## [1.2.0](https://github.com/futurestudio/hapi-class-extension-points/compare/v1.1.0...v1.2.0) - 2019-07-30

### Added
- find all class methods, also the inherited ones (from the prototype chain)
- automatically add `h.continue` when missing in an extension point

### Updated
- bump dependencies


## [1.1.0](https://github.com/futurestudio/hapi-class-extension-points/compare/v1.0.0...v1.1.0) - 2019-07-19

### Added
- register multiple class extensions with one call:
  - `server.extClass(Class1, Class2)`
  - or `server.extClass([Class1, Class2])`

### Updated
- bump dependencies


## 1.0.0 - 2018-06-18

### Added
- `1.0.0` release 🚀 🎉
