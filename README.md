[![Slack Status](https://sqlectron.herokuapp.com/badge.svg)](https://sqlectron.herokuapp.com)
[![Build Status](https://travis-ci.org/sqlectron/sqlectron-gui.svg?branch=master)](https://travis-ci.org/sqlectron/sqlectron-gui)
[![Build status](https://ci.appveyor.com/api/projects/status/ajxvrvwqyrc8yr23/branch/master?svg=true)](https://ci.appveyor.com/project/maxcnunes/sqlectron-gui/branch/master)

<p align="center">
  <img src="https://sqlectron.github.io/logos/logo-512.png">
  <br />
  A simple and lightweight SQL client with cross database and platform support.
</p>

#### Demo (version 1.0.0)
![demo](https://sqlectron.github.io/demos/sqlectron-demo-gui-v1.0.0-small.gif)

* [Databases](https://github.com/sqlectron/sqlectron-core#current-supported-databases) - List of current supported databases.
* [Download](https://github.com/sqlectron/sqlectron-gui/releases) - Installers, binaries and source.
* [Configuration](https://github.com/sqlectron/sqlectron-core#configuration) - List of saved servers and custom configurations.
* [Keyboard Shortcuts](https://github.com/sqlectron/sqlectron-gui/wiki/Keyboard-Shortcuts) - List of shortcuts.
* [Wiki](https://github.com/sqlectron/sqlectron-gui/wiki) - Other docs.
* [Terminal](https://github.com/sqlectron/sqlectron-term) - A terminal-based interface of SQLECTRON.

## Development

* Requires node 4 or higher.

Installing the dependencies:

```shell
npm install
```

Running the application:

```shell
npm run dev
```

### Testing changes of sqlectron-core

This is an easy way to test sqlectron-core changes on the GUI project.

1. Make the GUI project use the core from `../sqlectron-core` directory:

  ```bash
  # from sqlectron-gui directory
  ./scripts/link-sqlectron-core.sh
  ```

1. Start the auto compile of sqlectron-core:

  ```bash
  # from sqlectron-core directory
  npm run watch
  ```

1. Then run the GUI project normally:

  ```shell
  # from sqlectron-gui directory
  npm run dev
  ```

### Set up databases

You can test it using your own database or use a [docker-compose](https://github.com/sqlectron/sqlectron-databases) built for us to bring up several different databases.

## Build

1. `npm install`
1. `npm run dist`
1. The installer will be placed at `dist` folder.
