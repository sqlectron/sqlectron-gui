#!/bin/bash
set -e

# Version key/value should be on his own line
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[ ",]//g')


PACKAGE_VERSION="v$PACKAGE_VERSION"
LATEST_LOCAL_GIT_TAG=$(git describe --abbrev=0 --tags)

if [ ! "$PACKAGE_VERSION" == "$LATEST_LOCAL_GIT_TAG" ]; then
  echo "==> Skipping publish"
  echo "    The git tag must be the same of the package.json"
  echo "==> Version:"
  echo "    package.json:   $PACKAGE_VERSION"
  echo "    git local tag:  $LATEST_LOCAL_GIT_TAG"
  exit 1
fi

echo "==> Ensure the git tag is pushed"
git push origin $PACKAGE_VERSION

if [[ -z "$GITHUBKEY" ]]; then
  echo "Missing GitHub Key"
  exit 1
fi


echo "==> Publishing release $PACKAGE_VERSION"
electron-release \
    --token $GITHUBKEY \
    --repo "sqlectron/sqlectron-gui" \
    --app "installers/osx" \
    --output ".tmp/publish/Sqlectron-darwin-x64" \
    --app "installers/win/32" \
    --output ".tmp/publish/Sqlectron-win32-ia32" \
    --app "installers/win/64" \
    --output ".tmp/publish/Sqlectron-win32-x64" \
    --app "releases/Sqlectron-linux-ia32" \
    --output ".tmp/publish/Sqlectron-linux-ia32" \
    --app "releases/Sqlectron-linux-x64" \
    --output ".tmp/publish/Sqlectron-linux-x64"
