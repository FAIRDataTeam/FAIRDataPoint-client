#!/bin/sh

set -e


# Files with build info (Vite -> dist/assets, legacy -> dist/js)
BUILD_INFO_FILES="$(
  printf '%s\n' \
    "$(dirname $0)/../dist/assets/index-*.js" \
    "$(dirname $0)/../dist/js/app.*.js"
)"


# Create version based on git tag or branch
branch=`git rev-parse --abbrev-ref HEAD`
commit=`git rev-parse --short HEAD`
version="$branch~$commit"
gittag=`git tag -l --contains HEAD | head -n 1`
if test -n "$gittag"
then
    version="$gittag~$commit"
fi


# Get build timestamp
builtAt=`date -R`


# Replace values
found=false
for file in $BUILD_INFO_FILES; do
  if [ -f "$file" ]; then
    found=true
    sed -i.bak "s#{version}#$version#" "$file" && rm "${file}.bak"
    sed -i.bak "s#{builtAt}#$builtAt#" "$file" && rm "${file}.bak"
  fi
done

if [ "$found" = false ]; then
  echo "No build info files found in dist/assets or dist/js." >&2
  exit 1
fi
