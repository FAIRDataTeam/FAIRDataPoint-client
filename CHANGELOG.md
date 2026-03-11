# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.17.0]

### Added

- Add support for integer and decimal datetypes
## [v1.0.0] - 2026-02-13

### Fixed
- I did a patch of the index.html by @Hans-christian in e894c10


- Add boolean editor
- Add option to show the validation report when request fails
- Add datatypes in serialized RDF

### Changed

- Redesign entity detail page
- Redesign RDF metadata for machines download links
- Update reset to defaults text

## [1.16.3]

- Fix EnumSelectEditor

## [1.16.2]

- Fix custom logo on public path

## [1.16.1]

- Fix failed login handling
- Fix app title in the footer

## [1.16.0]

### Added

- Add app title and ping endpoints from config to the settings
- Add support for sh:order
- Add support for sh:description
- Add support for sh:minLength and sh:maxLength
- Add support for sh:in
- Add support for sh:group
- Add support for dash:DateTimePickerEditor
- Add support for dash:EnumSelectEditor
- Add groups and order to entity metadata
- Add form preview to resource definition and metadata schema
- Add autocomplete widget
- Add settings for autocomplete
- Add extra class statement for fields with class

### Changed

- Rename search param from q to query
- Remove hardcoded metadata timestamps

### Fixes

- Fix search filters with too many values
- Fix nested NodeShapes in form previews
- Fix value validation for multiple values

## [1.15.0]

### Added

- Extended search functionality
- Add saved search queries

## [1.14.0]

### Changed

- Rework metadata schemas

## [1.13.0]

### Added

- Add form preview to shape edit

## [1.12.0]

### Added

- FDP settings
- SHACL default values

### Fixed

- Multiple children with the same child relation
- Multiple conformsTo

## [1.11.0]

### Added

- Metadata profiles
- Shapes in resource definitions
- Metadata lables resolving

### Fixed

- Metadata with empty keywords
- Pagination in index

## [1.10.0]

### Added

- Reset to defaults
- Metadata children separated by type
- Default shapes changing allowed


## [1.9.0]

### Added

- Importing shapes from other FDPs
- Pagination for child resources

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
[1.9.0]: /../../tree/v1.9.0
[1.10.0]: /../../tree/v1.10.0
[1.11.0]: /../../tree/v1.11.0
[1.12.0]: /../../tree/v1.12.0
[1.13.0]: /../../tree/v1.13.0
[1.14.0]: /../../tree/v1.14.0
[1.15.0]: /../../tree/v1.15.0
[1.16.0]: /../../tree/v1.16.0
[1.16.1]: /../../tree/v1.16.1
[1.16.2]: /../../tree/v1.16.2
[1.16.3]: /../../tree/v1.16.3
[1.17.0]: /../../tree/v1.17.0
