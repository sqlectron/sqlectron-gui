#!/bin/bash
set -e

release_file() {
  NAME="$1.zip"
  FILE="$2"
  TYPE="$3"

  echo "==> Releasing file $NAME"

  if [[ "$TYPE" == "installer" ]]; then
    zip -qj9 "installers/compressed/$NAME" "installers/$FILE"
  else
    cd releases
    zip -qr9 "../installers/compressed/$NAME" "$FILE"
    cd -
  fi

  # github-release (https://github.com/aktau/github-release)
  github-release upload \
      --user "sqlectron" \
      --repo "sqlectron-gui" \
      --tag "$PACKAGE_VERSION" \
      --name "$NAME" \
      --file "installers/compressed/$NAME"
}

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

if [[ -z "$GITHUB_TOKEN" ]]; then
  echo "Missing GitHub Token"
  exit 1
fi

echo "==> Publishing release $PACKAGE_VERSION"
rm -rf installers/compressed
mkdir -p installers/compressed

release_file "Sqlectron-darwin-x64" "osx/Sqlectron.dmg" "installer"
release_file "Sqlectron-win32-ia32" "win/32/Sqlectron Setup.exe" "installer"
release_file "Sqlectron-win32-x64" "win/64/Sqlectron Setup.exe" "installer"
release_file "Sqlectron-linux-ia32" "Sqlectron-linux-ia32"
release_file "Sqlectron-linux-x64" "Sqlectron-linux-x64"
