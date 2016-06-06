#!/bin/bash
set -e

cd $(dirname $0)

cd ../app
rm -rf node_modules/sqlectron-core
npm link ../../sqlectron-core
