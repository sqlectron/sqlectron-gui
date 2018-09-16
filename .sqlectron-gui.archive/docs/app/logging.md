## Logging

> **IMPORTANT!** Replace any sensitive data (e.g. password) before including the log data in an issue.
>
> **IMPORTANT!** Disable the log if you are not investigating an issue. It makes the app slower. And with log to file enabled it may saves data to file that you don't want to be saved every time you are using the app.

Is possible to enable logging by adding the configuration below to your `~/.sqlectron.json`:

```js
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
```

The log file is pretty easy to understand by just opening it in a text editor. But if you want an even better way to see that. Is possible to use [bunyan](https://github.com/trentm/node-bunyan) CLI:

> Requires to have Node and NPM installed

Install bunyan CLI globally

```
npm install -g bunyan
```

See the logs with a better output through bunyan CLI

```
tail -f ~/.sqlectron.log | bunyan -o short
```
or

```
cat ~/.sqlectron.log | bunyan -o short
```
