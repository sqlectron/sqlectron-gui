[![Build Status](https://travis-ci.org/sqlectron/sqlectron-gui.svg?branch=master)](https://travis-ci.org/sqlectron/sqlectron-gui)
[![Build status](https://ci.appveyor.com/api/projects/status/ajxvrvwqyrc8yr23/branch/master?svg=true)](https://ci.appveyor.com/project/maxcnunes/sqlectron-gui/branch/master)

<p align="center">
  <img src="https://sqlectron.github.io/logos/logo-512.png">
  <br />
  A simple and lightweight SQL client with cross database and platform support.
</p>

#### Demo (version 1.0.0)
![demo](https://sqlectron.github.io/demos/sqlectron-demo-gui-v1.0.0.gif)

#### Current supported databases
* [PostgreSQL](http://www.postgresql.org/)
* [MySQL](https://www.mysql.com/)
* [Microsoft SQL Server](http://www.microsoft.com/en-us/server-cloud/products/sql-server/)

Do you wanna support for another SQL database? Please send a pull request to [sqlectron-core](https://github.com/sqlectron/sqlectron-core).

## Download

All versions available are at the [release page](https://github.com/sqlectron/sqlectron-gui/releases).

## Terminal

SQLECTRON has also a terminal-based interface called [sqlectron-term](https://github.com/sqlectron/sqlectron-term).

## Configuration

See the available configuration at [here](https://github.com/sqlectron/sqlectron-core#configuration).

## Development

* Required node 4 or higher.

Running the application:

```shell
# first shell window
npm run dev:webpack

# second shell window
npm run dev:electron
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
docker-compose dist
```
