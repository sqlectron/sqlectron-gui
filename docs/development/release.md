# Release

We use [electron-builder](https://github.com/electron-userland/electron-builder) to package and distribute the application. Which makes really easy doing that.

1. Change the app version on [app/package.json](https://github.com/sqlectron/sqlectron-gui/blob/master/app/package.json#L3) based on [SemVer](http://semver.org/).
1. Create a new **DRAFT** [release](https://github.com/sqlectron/sqlectron-gui/releases) with the same version of the previous step.
1. On the next CI build it will upload the installers to this release. This allows testing the installers before release.
1. Once the [release](https://github.com/sqlectron/sqlectron-gui/releases) is ready just publish it.
1. Update [Homebrew Cask](https://github.com/caskroom/homebrew-cask/blob/master/CONTRIBUTING.md#updating-a-cask).
