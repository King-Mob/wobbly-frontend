#!/bin/sh
set -e

if [ -z ${EXPO_LOGIN+x} ]; then
  echo "EXPO_LOGIN is unset";
  exit 1
fi
if [ -z ${EXPO_PASSWORD+x} ]; then
  echo "EXPO_PASSWORD is unset";
  exit 1
fi
if [ -z ${SENTRY_AUTH_TOKEN+x} ]; then
  echo "SENTRY_AUTH_TOKEN is unset";
  exit 1
fi

# fail if jq is not installed
jq --help > /dev/null

# verify that git describe works
version=$(git describe --tags)
echo "If deployed, this commit would have version "$version""

# update the version in app.json
cp config/app.development.json app.template.json
jq '.expo.slug = "wobbly"' < app.template.json > app.json
rm app.template.json

# login to expo
expo login -u $(echo "$EXPO_LOGIN") -p $(echo "$EXPO_PASSWORD")

# verify that expo works
echo "Most recent Expo release:"
expo publish:history --count 1
