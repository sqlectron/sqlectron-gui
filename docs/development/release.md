# Release

We use [electron-builder](https://github.com/electron-userland/electron-builder) to package and distribute the application. Which makes really easy doing that.

1. Merge the chagnes to the main branch.
1. On Github open the Build action for the last build and test the app, it will have uploaded the artificats for each OS.
1. Once you confirm the app is working as expected, then it is time to start the release process.
1. Run `npm version <major|minor|patch>` based on the level of the changes being deployed. It will set a new version in the package.json and also create a new git tag for that.
1. Run `git push --follow-tags` to push those changes to the remote git repository.
1. Create a new release for that version at https://github.com/sqlectron/sqlectron-gui/releases. Don't forget to set the release title and the description with all the changes. **DO NOT CREATE A DRAFT RELEASE, PUBLISH IT DIRECTLY**, it won't trigger the Release action to upload the artificats because of [this issue](https://github.community/t/workflow-set-for-on-release-not-triggering-not-showing-up/16286/10).
1. Once the release is created, the Github Realease action will upload the artificats for that build.
1. Once the release artificats have been uploaded, then update [Homebrew Cask](https://github.com/caskroom/homebrew-cask/blob/master/CONTRIBUTING.md#updating-a-cask).
