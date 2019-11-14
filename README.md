# FAIR Data Point Client

> This is the client for the [FAIR Data Point](https://github.com/FAIRDataTeam/FAIRDataPoint) providing interface for browsing the data and administration.

[![Build Status](https://travis-ci.org/FAIRDataTeam/FAIRDataPoint-client.svg?branch=master)](https://travis-ci.org/FAIRDataTeam/FAIRDataPoint-client.svg?branch=master)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

## Deployment

FAIR Data Point Client is distributed as a Docker image. It is meant to be run together with the FAIR Data Point. The configuration needed is API url (without the trailing slash) of the FDP server as a `API_URL` ENV variable and host name of FDP server for proxying requests when running the Docker image.


You can use [Docker Compose](https://docs.docker.com/compose/) to run FDP and FDP client together:

```yaml
version: '3'
services:
    server:
        image: faridata/fairdatapoint
        # ... server configuration

    client:
        image: fairdata/fairdatapoint-client
        ports:
            - 80:80
        environment:
            - API_URL=http://api.example.com
            - FDP_HOST=server  # using hostname within the Docker network
```

> Tip: It is a good idea to run FDP and FDP client behind a reverse proxy with SSL certificates.


## Development

Install dependencies using:

```
$ npm install
```

Compile and hot-reload for development:

```
npm run serve
```

Compile and minify for production:

```
$ npm run build
```

Run tests or linter:

```
$ npm run test
$ npm run lint
```
