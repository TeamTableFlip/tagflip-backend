![release](https://github.com/fhswf/tagflip-backend/workflows/release/badge.svg)

# Installation

## Using docker-compose

### Create a `config/local.json` configuration file like this
 ```
{
  "name": "TagFlip",
  "version": "0.0.1",
  "serverPort": 5000,
  "allowedOrigins": [
    "http://localhost:8080",
    "http://jupiter.fh-swf.de/tagflip"
  ],
  "delayResponse": 0,
  "sequelize": {
    "connection": null,
    "saltBytes": 16
  },
  "db": {
    "name": "tagflip",
    "host": "mysql",
    "dialect": "mysql",
    "password": "tagflip",
    "user": "root"
  },
  "files": {
    "prefix": "/opt/tagflip/data",
    "temp": "/opt/tagflip/temp",
    "unzipBuffer": "/opt/tagflip/temp/unzipBuffer"
  }
}
 ```

### Adapt storage directory in `docker-compose.yml` according to your needs
```
volumes:
      - /opt/tagflip/db:/var/lib/mysql
```

### Build docker images

 `docker-compose build`

### Start image

 `docker-compose start` 

### Set up a reverse proxy
You probably want to route all external requests through a reverse proxy. This is our nginx config stanza:
```
location /tagflip/api/v1
	{
		#ssi on;
		rewrite ^/tagflip/api/v1/(.*) /$1  break;
		proxy_pass http://localhost:5000;
		proxy_set_header Host $host;
    	proxy_set_header X-Forwarded-For $remote_addr;
	}
```
