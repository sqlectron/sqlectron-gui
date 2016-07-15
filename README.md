[![Slack Status](https://sqlectron.herokuapp.com/badge.svg)](https://sqlectron.herokuapp.com)
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

Do you want to support another SQL database? Please send a pull request to [sqlectron-core](https://github.com/sqlectron/sqlectron-core).

## Download

All available versions are at the [release page](https://github.com/sqlectron/sqlectron-gui/releases).

## Terminal

SQLECTRON also has a terminal-based interface called [sqlectron-term](https://github.com/sqlectron/sqlectron-term).

## Configuration

See the available configuration [here](https://github.com/sqlectron/sqlectron-core#configuration).

## Development

* Requires node 4 or higher.

Running the application:

```shell
# first shell window
npm run dev:webpack

# second shell window
npm run dev:electron
```

### Set up databases

You can test it using your own database or use a [docker-compose](https://github.com/sqlectron/sqlectron-databases) built for us to bring up several different databases.

### Testing changes of sqlectron-core

This is an easy way to test sqlectron-core changes from the GUI. But please do not forget including some unit tests on sqlectron-core before applying a pull request.

Link the dependency to the original project:

```bash
# from sqlectron-gui folder
./scripts/link-sqlectron-core.sh
```

Auto compile the sqlectron-core every time a change is done:

```bash
# from sqlectron-core folder
npm run watch
```

Then follow the steps to run the GUI application.

## Build

1. `npm install`
1. `npm run dist`
1. The installer will be placed at `dist` folder.

### Building windows apps from non-windows platforms

You will need follow [it](https://github.com/maxogden/electron-packager#building-windows-apps-from-non-windows-platforms) or build through the docker:

```shell
docker-compose run dist
```
