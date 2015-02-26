#!/usr/bin/env bash

# load dev env vars
if [ -f .myenvvars ]; then
  source .myenvvars
fi

# move our node_modules into place, since we are in dev mode,
# the project folder was mounted as a volume, so it probably wiped out
# the copy of node_modules that the Dockerfile build performed
cp -a /tmp/app/node_modules $PROJECT_ROOT

if [ "$DEBUGGER" = true ]; then
  # start app (with debugging)
  echo "Starting app with debugging"
  if [ "$DEBUG_BRK" = false ]; then
    nodemon -V --web-host 0.0.0.0 --debug-port <%= debuggerPort %> --web-port <%= debugUIPort %> --debug-brk false --exec node-debug index.js
  else
    nodemon -V --web-host 0.0.0.0 --debug-port <%= debuggerPort %> --web-port <%= debugUIPort %> --exec node-debug index.js
  fi
else
  # start app (no debugging)
  echo "Starting app"
  nodemon -V index.js
fi
