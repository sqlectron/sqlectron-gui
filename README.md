![SQLECTRON Logo](https://www.dropbox.com/s/dt06tif4xo1khbf/SQLECTRON-400px.png?raw=1)

A simple and lightweight SQL client with cross database and platform support.

![demo](https://www.dropbox.com/s/lfrdhgk1k2hwmhg/sqlectron-demo-v0.1.0.gif?raw=1)

#### Current supported databases
* PostgreSQL
* MySQL

Do you wanna support for another SQL database? Please send a pull request to [sqlectron-core](https://github.com/sqlectron/sqlectron-core).

## Download

All versions available are at the [release page](https://github.com/sqlectron/sqlectron-gui/releases).

## Terminal

SQLECTRON has also a terminal-based interface called [sqlectron-term](https://github.com/sqlectron/sqlectron-term).

## Configuration

See the available configuration at [here](https://github.com/sqlectron/sqlectron-core#configuration).

## Development

Running the application:

```shell
# first shell window
npm run start-webpack

# second shell window
npm run start-electron
```

### Setup databases

You can test it using your own database or use a [docker-compose](https://github.com/sqlectron/sqlectron-databases) built for us to bring up several different databases.


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
