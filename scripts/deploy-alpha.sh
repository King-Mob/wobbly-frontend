#!/bin/sh
set -e

# fail if jq is not installed
jq --help > /dev/null

# make sure we're on the develop branch
branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$branch" != "develop" ]]; then
  echo "Attempted to deploy to alpha channel, yet not on develop branch. Stopping.";
  exit 1;
fi

# update the version in app.json
cp config/app.development.json app.template.json
jq '.expo.slug = "wobbly"' < app.template.json > app.template2.json
jq '.expo.version = $version' --arg version $(git describe --tags) < app.template2.json > app.template3.json
jq '.expo.hooks.postPublish[0].config.authToken = $token' --arg token $(echo $SENTRY_AUTH_TOKEN) < app.template3.json > app.json
rm app.template.json
rm app.template2.json
rm app.template3.json

# publish
expo publish --non-interactive --release-channel alpha
