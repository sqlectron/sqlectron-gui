#!/bin/bash
set -e

rm -rf node_modules/sqlectron-db-core
npm link ../sqlectron-db-core
npm run postinstall # rebuild native deps
