# Testing changes of sqlectron-db-core

This is an easy way to test sqlectron-db-core changes on the GUI project.

1. Make the GUI project use the core from `../sqlectron-db-core` directory:

```bash
# from sqlectron-gui directory
./scripts/link-sqlectron-db-core.sh
```

1. Start the auto compile of sqlectron-db-core:

```bash
# from sqlectron-db-core directory
npm run watch
```

1. Then run the GUI project normally:

```shell
# from sqlectron-gui directory
npm run dev
```
