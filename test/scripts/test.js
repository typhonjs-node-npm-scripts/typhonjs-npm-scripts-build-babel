'use strict';

/**
 * build (test) -- Runs the build script with the npm-build.json which transpiles `./test/src` to `./test/dist`. Loads
 * TestDummy from `./test/dist` and verifies that the build worked.
 */

var cp = require('child_process');
var fs = require('fs-extra');

// Build base execution command.
var exec = 'node ./scripts/build.js';

// Notify what command is being executed then execute it.
process.stdout.write('Executing: ' + exec + '\n');
cp.execSync(exec, { stdio: 'inherit' });

// Attempt to load transpiled test.
var TestDummy = require('../dist/TestDummy').default;

// Verify results
if ('Test Success' !== new TestDummy().test())
{
   throw new Error("TyphonJS NPM script (build / test) error: transpiling failed.");
}

// Verify that source maps file was generated.
try
{
   if (!fs.statSync('./test/dist/TestDummy.js.map').isFile())
   {
      throw new Error("'./test/dist/TestDummy.js.map' not found.");
   }
}
catch(err)
{
   throw new Error("TyphonJS NPM script (build) error: " + err);
}

// Empty './test/dist'; comment out to view transpiled result.
fs.emptyDirSync('./test/dist');