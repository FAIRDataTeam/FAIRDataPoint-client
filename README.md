# FAIR Data Point Client

> Client application for the [FAIR Data Point](https://github.com/FAIRDataTeam/FAIRDataPoint) providing a user interface for browsing the metadata and administration.

[![Build Status](https://travis-ci.org/FAIRDataTeam/FAIRDataPoint-client.svg?branch=master)](https://travis-ci.org/FAIRDataTeam/FAIRDataPoint-client.svg?branch=master)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)


You can run FAIR Data Point without the client if you need the API only. If you want a user interface for browsing the metadata and administration of the FAIR Data Point metadata and users, you can deploy FAIR Data Point together with this client.

FDP Client works as a proxy before the FAIR Data Point itself. It decides which request should pass through to the FDP (e.g., API calls) and which should be handled by the client (requests from browsers). Therefore, you no longer need to have FAIR Data Point exposed publicly.


## Deployment

FAIR Data Point Client is distributed as a Docker image. It runs together with the FAIR Data Point.

**Configuration**

| ENV Variable | Description |
| ---- | --- |
| FDP_HOST | A hostname of the FAIR Data Point (within the Docker network). |
| PUBLIC_PATH | Use only if FDP is not running at the root, you need to specify the URL. For example, if you run FDP at https://example.com/fairdatapoint, PUBLIC_PATH should be `/fairdatapoint`. |

**Example**

Here is an example [Docker Compose](https://docs.docker.com/compose/) configuration to run FDP and FDP client together:

```yaml
version: '3'
services:
    server:
        image: fairdata/fairdatapoint
        # ... FDP configuration

    client:
        image: fairdata/fairdatapoint-client
        ports:
            - 80:80
        environment:
            - FDP_HOST=server  # using hostname within the Docker network
```

> Tip: It is recommended to run FDP and FDP client behind a reverse proxy with SSL certificates. See further in the docs examples how to do that.

## Customizations

You can customize the look and feel of FDP Client using [SCSS](https://sass-lang.com). There are three files you can mount to `/src/scss/custom`. If there are any changes in these files, the styles will be regenerated when FDP Client starts.

**_variables.scss**

A lot of values related to styles are defined as variables. The easiest way to customize the FDP Client is to define new values for these variables. To do so, you create a file called `_variables.scss` where you define the values that you want to change.

Here is an example of changing the primary color.

```scss
// _variables.scss

$color-primary: #087d63;
```

Have a look in [src/scss/_variables.scss](src/scss/_variables.scss) to see all the variables you can change.

**_extra.scss**

This file is loaded before all other styles. You can use it, for example, to define new styles or import fonts.

**_overrides.scss**

This file is loaded after all other styles. You can use it to override existing styles.


### Example of setting a custom logo

To change the logo, you need to do three steps:

1. Create `_variables.scss` with correct logo file name and dimensions
1. Mount the new logo to the assets folder
1. Mount `_variables.scss` to SCSS custom folder


```scss
// _variables.scss

$header-logo-url: '/assets/my-logo.png';  // new logo file
$header-logo-width: 80px;  // width of the new logo 
$header-logo-height: 40px;  // height of the new logo
```

```yaml
# docker-compose.yml
version: '3'
services:
    server:
        # ... FDP configuration

    client:
        # ... FDP Client configuration
        volumes:
          # Mount new logo file to assets in the container
          - ./my-logo.png:/usr/share/nginx/html/assets/my-logo.png:ro
          
          # Mount _variables.scss so that styles are regenerated
          - ./_variables.scss:/src/scss/custom/_variables.scss:ro
```

## Setting up a reverse proxy

If you want to run publicly available FDP, you should use HTTPS protocol with valid certificates. It is easy to configure FDP to run behind a reverse proxy which takes care of the certificates. Here are some examples of how to configure nginx as a reverse proxy for FDP in different cases.

When setting `proxy_pass`, there is a `<client_host>` placeholder. Use the name of the Docker container in your deployment instead. Also, you need to set up Docker DNS resolver somewhere in the configuration.

```
resolver 127.0.0.11 valid=10s;
```

### Running FDP on domain root

This is an example of running FDP as the root application on domain `fairdatapoint.example.com`.

```
server {
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/fairdatapoint.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fairdatapoint.example.com/privkey.pem;

    server_name fairdatapoint.example.com;

    location / {
        proxy_pass http://<client_host>;
        proxy_set_header Host $host;
        proxy_pass_request_headers on;
    }
}

# Redirect to https
server {
    listen 80;
    server_name fairdatapoint.example.com;
    return 301 https://$host$request_uri;
}
```

### Running FDP on a nested route

Sometimes, you might want to run FDP alongside other applications on the same domain. Here is an example of running FDP on `example.com/faidatapoint`. If you run FDP in this configuration, you **have to set PUBLIC_PATH ENV variable**, in this example to `/fairdatapoint`.

```
server {
    # Configruation for the server, certificates, etc.

    # Define the location FDP runs on
    location ~ /fairdatapoint(/.*)?$ {
        rewrite /fairdatapoint(/.*) $1 break;
        rewrite /fairdatapoint / break;
        proxy_pass http://<client_host>;
        proxy_set_header Host $host;
        proxy_pass_request_headers on;
    }
}
```

When running on nested route, you also need to change paths to all assets referenced in SCSS files. By default, this is only the logo.

```scss
// _variables.scss

$header-logo-url: '/fairdatapoint/assets/logo.png';
```

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
