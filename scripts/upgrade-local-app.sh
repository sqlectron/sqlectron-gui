#!/bin/bash

# Important!
# ----------------------------
# This script only works on Mac

APP_NAME="SQLECTRON.app"

echo " ==> Removing older app"
rm -rf ~/Applications/$APP_NAME

echo " ==> Copying new app"
cp -R releases/SQLECTRON-darwin-x64/SQLECTRON.app ~/Applications

echo " ==> Opening new app"
open ~/Applications/$APP_NAME
