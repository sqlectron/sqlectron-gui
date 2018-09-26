## Configuration File

SQLECTRON keeps a configuration file in the directory:

* **macOS:** `~/Library/Preferences/Sqlectron`
* **Linux:** (`$XDG_CONFIG_HOME` or `~/.config`) + `/Sqlectron`
* **Windows:** (`$LOCALAPPDATA` or `%USERPROFILE%\AppData\Local`) + `\Sqlectron\Config`

> For older versions it was stored as `.sqlectron.json` at the user's home directory:
> * **macOS:** `~/`
> * **Linux:** `~/`
> * **Windows:** `%USERPROFILE%`

Although it is possible to change this file manually, it is usually better to just use the UI since it allows you to change any of these settings from there.

```js
{
  // Change the zoom factor to the specified factor.
  // Zoom factor is zoom percent divided by 100, so 300% = 3.0.
  // https://github.com/electron/electron/blob/master/docs/api/web-frame.md#webframesetzoomfactorfactor
  "zoomFactor": 1,

  // Change the limit used in the default select
  // "100" by default in production
  "limitQueryDefaultSelectTop": 100,

  // Enable/Disable auto complete for the query box
  // "true" by default in production
  "enabledAutoComplete": false,

  // Enable/Disable live auto complete for the query box
  // "true" by default in production
  "enabledLiveAutoComplete": false,

  // Manage logging
  // It is disabled by default in production
  // More details: https://github.com/sqlectron/sqlectron-gui/blob/master/docs/app/logging.md
  "log": {
    // Show logs in the dev tools panel
    // "false" by default in production
    "console": true,

    // Save logs into a file
    // "false" by default in production
    "file": true,

    // Level logging: debug, info, warn, error
    // "error" by default in production
    "level": "debug",

    // Log file path
    // "~/.sqlectron.log" by default in production
    "path": "~/.sqlectron.log"
  },

  // List of servers
  "servers": [
    {
      // It's possible add a filter property that will load only
      // the data is useful in the sidebar.
      // It's only possible to filter "database" and "schema".
      // It accepts the filter types: "only" and "ignore".
      "filter": {
        "database": {
          "only": [
            "company"
          ]
        },
        "schema": {
          "ignore": [
            "pg_catalog",
            "pg_temp_1"
          ]
        }
      },
      "id": "651abe80-ed50-44a1-b778-1bdfe97b0bec",
      "name": "sqlectron-localhost",
      "client": "postgresql",
      ...
    }
  ]
}

```

[Configuration doc from Sqlectron Core](https://github.com/sqlectron/sqlectron-core#configuration)
