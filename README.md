# FAIR Data Point Client

> This is the client for the [FAIR Data Point](https://github.com/FAIRDataTeam/FAIRDataPoint) providing interface for browsing the data and administration.

[![Build Status](https://travis-ci.org/FAIRDataTeam/FAIRDataPoint-client.svg?branch=master)](https://travis-ci.org/FAIRDataTeam/FAIRDataPoint-client.svg?branch=master)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

## Deployment

FAIR Data Point Client is distributed as a Docker image. The only configuration needed is to provide API url (without the trailing slash) of the FDP server as a `API_URL` ENV variable when running the Docker image.

The application in the image is served on port 80.

```
$ docker run -d -p 8080:80 -e API_URL=http://api.example.com fairdata/fairdatapoint-client
```

Or if you use [Docker Compose](https://docs.docker.com/compose/):

```
version: '3'
services:
    client:
        image: fairdata/fairdatapoint-client
        ports:
            - 8080:80
        environment:
            - API_URL=http://api.example.com
```

> Tip: You can use a single docker-compose file to deploy both, FAIR Data Point and this client.


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
