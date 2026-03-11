# FAIR Data Point Client

> Client application for the [FAIR Data Point](https://github.com/FAIRDataTeam/FAIRDataPoint) providing an HTML-based user interface for browsing the metadata and administration.

[![Build Status](https://travis-ci.org/FAIRDataTeam/FAIRDataPoint-client.svg?branch=master)](https://travis-ci.org/FAIRDataTeam/FAIRDataPoint-client.svg?branch=master)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)


[Documentation](https://fairdatapoint.readthedocs.io/) explains how to install, configure and use the FAIR Data Point.


## Development

Install dependencies using:

```
$ npm install
```

### Local development (no Docker)

1) Start the FDP server (default `http://localhost:8080`).
2) Create `public/config.js` and set `apiURL` to the FDP server:

```js
// public/config.js
window.config = {
  apiURL: 'http://localhost:8080',
}
```

3) Run the dev server:

```
$ npm run serve
```

The client will be available at `http://localhost:8081`.

> **Tip:** If you run both, the server and the client locally, start the server first, because it needs to run on port 8080. The client will then be automatically started on port 8081.

Compile and hot-reload for development:

```
$ npm run serve
```

Compile and minify for production:

```
$ npm run build
```

## Docker

The nginx container can be configured at runtime using environment variables:

- `API_URL` (optional): browser-facing API base URL. For Docker, use `/` to call same-origin and avoid CORS/internal DNS issues.
- `FDP_HOST` (required for Docker proxy): backend `host:port` used by nginx inside the container network. Do not include `http://` or `https://`.
- `FDP_SCHEME` (optional): `http` or `https` for the proxy (`http` default).
- `PUBLIC_PATH` (optional): base path if serving under a subpath (e.g. `/app`).
- `REBUILD_STYLES` (optional): set to any value to force rebuilding SCSS at container start.

Example: backend is another container on the same network (`fdp` service):

```
docker run --rm -p 8081:80 \
  --network fdppv1_default \
  -e FDP_HOST=fdp:8080 \
  -e API_URL=/ \
  fdp-client
```

Example: backend is on host machine:

```
docker run --rm -p 8081:80 \
  -e FDP_HOST=host.docker.internal:8080 \
  -e API_URL=/ \
  fdp-client
```

If the backend is HTTPS-only, set `FDP_SCHEME=https` and ensure the API URL is `https://...`.

Run tests or linter:

```
$ npm run test
$ npm run lint
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for more details.
