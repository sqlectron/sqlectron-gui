![SQLECTRON Logo](https://www.dropbox.com/s/dt06tif4xo1khbf/SQLECTRON-400px.png?raw=1)

A simple and lightweight SQL client with cross database and platform support.

## Configuration

Example configuration file `~/.sqlectron.json`
```json
{
  "servers": [
    {
      "name": "postgres",
      "client": "postgresql",
      "host": "10.10.10.10",
      "port": 5432,
      "database": "postgres",
      "user": "user",
      "password": "password"
    },
    {
      "name": "mysql",
      "client": "mysql",
      "host": "10.10.10.10",
      "port": 3306,
      "database": "authentication",
      "user": "root",
      "password": "password"
    }
  ]
}
```

## Development

Running the application:

```shell
# first shell window
npm run start-webpack

# second shell window
npm run start-electron
```

### Setup databases

You can test it using your own database or a [docker-compose](https://github.com/sqlectron/sqlectron-databases) built for us to bring up several different databases.


## Build

Package the application using [electron-packager](https://github.com/maxogden/electron-packager) and [webpack](https://webpack.github.io/).

```shell
npm run build
```

### Building windows apps from non-windows platforms

You will need follow [it](https://github.com/maxogden/electron-packager#building-windows-apps-from-non-windows-platforms) or build through the docker:

```shell
docker-compose build
```

### Running the local release

```shell
npm run run-local-release
```
