# Run from Source

The Sqlectron developer environment requires Node **(10 or higher)** and NPM.

**Cloning this project:**

```shell
git clone git@github.com:sqlectron/sqlectron-gui.git
cd sqlectron-gui
```

**Installing the dependencies:**

```shell
npm install
```

**Running the application:**

```shell
npm run dev
```

Note: Due to timing issues between starting the webpack-dev-server and electron, it
is probable that on initial start, the electron window will be empty. After waiting
for webpack to finish building the bundle for the first time, you will need to
reload the electron window. This can be accomplished using `Shift+Cmd/Ctrl+R`.
