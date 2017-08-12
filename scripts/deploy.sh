#!/bin/sh -e


# When we publish to npm, the published files are available in the root
# directory, which allows for a clean include or require of sub-modules.
#
#    var language = require('apollo-client-rxjs/rxify');
#

# Clear the built output
rm -rf ./build

# Compile new files
npm run build

# Make sure the ./npm directory is empty
rm -rf ./npm
mkdir ./npm

# Copy all files from ./lib/src to /npm
cd ./build/src && cp -r ./ ../../npm/
# Copy also the umd bundle with the source map file
cd ../bundles
cp apollo-rxjs.umd.js ../../npm/ && cp apollo-rxjs.umd.js.map ../../npm/

# Back to the root directory
cd ../../

# Ensure a vanilla package.json before deploying so other tools do not interpret
# The built output as requiring any further transformation.
node -e "var package = require('./package.json'); \
  delete package.scripts; \
  delete package.devDependencies; \
  package.main = 'apollo-rxjs.umd.js'; \
  package.module = 'index.js'; \
  package.typings = 'index.d.ts'; \
  var fs = require('fs'); \
  fs.writeFileSync('./npm/package.json', JSON.stringify(package, null, 2)); \
  "


# Copy few more files to ./npm
cp README.md npm/

echo 'deploying to npm...'
cd npm && npm publish && git push --tags
