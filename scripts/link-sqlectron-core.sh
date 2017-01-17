#!/bin/bash
set -e

rm -rf node_modules/sqlectron-core
npm link ../sqlectron-core
npm run postinstall # rebuild native deps
