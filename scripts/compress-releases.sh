PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

echo "Version: $PACKAGE_VERSION"

echo "==> Compressing for darwin-x64"
tar zcvf "releases/SQLECTRON-darwin-x64-v$PACKAGE_VERSION.tar.gz" releases/SQLECTRON-darwin-x64

echo "==> Compressing for linux-x64"
tar zcvf "releases/SQLECTRON-linux-x64-v$PACKAGE_VERSION.tar.gz" releases/SQLECTRON-linux-x64

echo "==> Compressing for win32-x64"
tar zcvf "releases/SQLECTRON-win32-x64-v$PACKAGE_VERSION.tar.gz" releases/SQLECTRON-win32-x64