# Testing changes of sqlectron-core

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
