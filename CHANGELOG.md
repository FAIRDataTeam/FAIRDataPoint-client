# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.8.0]

### Added

- Admin UI to FDP Index

### Changed

- Proxy forwards client IP address in headers to FDP

## [1.7.0]

### Added

- FDP Index (from [FAIRDataPoint-index](https://github.com/FAIRDataTeam/FAIRDataPoint-index))
- Metadata search including RDF types

### Changed

- Updated dependencies

### Fixed

- Fix breadcrumbs
- Fix repository edit

## [1.6.0]

### Added

- API keys
- Metadata drafts

## [1.5.0]

### Added

- Editable resource definitions
- Date formatting for date metadata

### Changed

- Updated logo

### Fixed

- Fix resource definition save on nested url
- Fix save loading button in EntityCreate

## [1.4.0]

### Added

- Suggested prefixes for namespaces
- Re-enabled shapes creation
- "view all" for metadata lists

### Fixed

- Fix nested entities in SHACL form
- Fix RDF preview in SHACL form for nested entities

## [1.3.0]

### Added

- DASH and dynamic shapes configuration
- Shapes administration
- DASH list metadata
- Persistent URL from bootstrap config

### Changed

- Updated dashboard links

### Fixed

- Fix empty entity metadata
- Fix recursive `FormRenderer` in build

## [1.2.1]

### Fixed

- Fix local run on non-default port

## [1.2.0]

### Added

- Support custom metamodel (metadata layers)
- Allow to delete entity by admin
- Form field names
- Use data-cy for SHACL form Save button
- Add API builder and remove specific API for entities
- Metadata create forms
- Human-readable error messages
- Special handling of 404 error
- RDF preview

### Changed

- Switch to GitHub Actions (from Travis CI)
- Move about to footer
- Field blacklist
- Updated form models

### Fixed

- Fix API URL envvar
- Fix entity edit status flash
- Fix entity view if not authenticated
- Fix about icon
- Fix download RDF links

### Removed

- Sending `accessRights` for the distribution

## [1.1.0]

### Added

- Version information

### Changed

- Switched to TypeScript
- Updated dependencies
- Adjustments for [E2E tests](https://github.com/FAIRDataTeam/FAIRDataPoint-E2E-Tests)

## [1.0.0]

Initial version of client application for [FAIR Data Point] providing user interface for browsing and managing the metadata.

### Added

- Browsing and managing the metadata
- Navigation and breadcrumbs
- User login and management, permissions
- Set up CI, building and publishing Docker image
- Nginx as proxy for simple deployment with [FAIR Data Point]
- Support nested route deployment


[FAIR Data Point]: https://github.com/FAIRDataTeam/FAIRDataPoint

[Unreleased]: /../../compare/master...develop
[1.0.0]: /../../tree/v1.0.0
[1.1.0]: /../../tree/v1.1.0
[1.2.0]: /../../tree/v1.2.0
[1.2.1]: /../../tree/v1.2.1
[1.3.0]: /../../tree/v1.3.0
[1.4.0]: /../../tree/v1.4.0
[1.5.0]: /../../tree/v1.5.0
[1.6.0]: /../../tree/v1.6.0
[1.7.0]: /../../tree/v1.7.0
[1.8.0]: /../../tree/v1.8.0
