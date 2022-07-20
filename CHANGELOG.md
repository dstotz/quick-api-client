# Changelog

## v1.2.2

- Added support for array query parameters that use square brackets. Ex: `key[]=1&key[]=2`

## v1.2.1

- Added ability to set default query parameters at the client level. Useful for query param auth.
- Updated documentation for Node versions without fetch

## v1.2.0

- Client options can now be retrieved after initialization

### Breaking changes

- Updated exported type names to remove I prefix

## v1.1.0

### Changed

- Add ability to set request init per request, or a default init at the client level

## v1.0.0

- Initial version
