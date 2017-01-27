## Configuration File

SQLECTRON keeps a hidden configuration file called `.sqlectron.json` at the user's home directory (`~/` osx and linux; `%userprofile%` windows ).

This configuration is automatically handled by the app. Using default values when is possible. And saving automatically changes made to servers through the app. But you can override the default configurations by manually changing these values:

```js
{
  // Change the zoom factor to the specified factor.
  // Zoom factor is zoom percent divided by 100, so 300% = 3.0.
  // https://github.com/electron/electron/blob/master/docs/api/web-frame.md#webframesetzoomfactorfactor
  "zoomFactor": 1,

  // Change the limit used in the default select
  // "100" by default in production
  "limitQueryDefaultSelectTop": 100,

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
      // Is possible add a filter property that will load only
      // the data is useful in the sidebar.
      // Is only possible to filter "database" and "schema".
      // It accept the filter types: "only" and "ignore".
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

> [Configuration doc from Sqlectron Core](https://github.com/sqlectron/sqlectron-core#configuration)
