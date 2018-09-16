#!/usr/bin/env bash

THIS_DIR="$(realpath "$(dirname "${BASH_SOURCE[0]}")")"
PROJECT_ROOT="$(realpath "$THIS_DIR/..")"
PLAT="$(uname -s)"

if [[ "$PLAT" == "Darwin" ]]; then
    set -x
    /usr/bin/open \
        --new \
        "$PROJECT_ROOT/dist/mac/unified-dataloader.app/" \
        --args \
        "--remote-debugging-port=9229"
    set +x
else
    echo "No handler set for $PLAT"
    exit 1
fi

echo "Done."
exit 0
