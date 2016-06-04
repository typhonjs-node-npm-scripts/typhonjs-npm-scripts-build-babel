'use strict';

/**
 * build (test) -- Runs the build script with the npm-build.json which transpiles `./test/src` to `./test/dist`. Loads
 * TestDummy from `./test/dist` and verifies that the build worked.
 */

var cp =    require('child_process');
var fs =    require('fs-extra');
var util =  require('util');

// Empty './test/dist'.
fs.emptyDirSync('./test/dist');

// Build base execution command.
var exec = 'node ./scripts/build.js';

// Notify what command is being executed then execute it.
process.stdout.write('typhonjs-npm-scripts-build-babel executing: ' + exec + '\n');
cp.execSync(exec, { stdio: 'inherit' });

// Attempt to load transpiled test.
var TestDummy = require('../dist/TestDummy').default;

// Verify results
if ('Test Success' !== new TestDummy().test())
{
   throw new Error("typhonjs-npm-scripts-build-babel test error: transpiling failed.");
}

// Verify that source maps file was generated. ----------------------------------------------------------------------
try
{
   if (!fs.statSync('./test/dist/TestDummy.js.map').isFile())
   {
      throw new Error("'./test/dist/TestDummy.js.map' not found.");
   }
}
catch(err)
{
   throw new Error("typhonjs-npm-scripts-build-babel test error: " + err);
}

// Verify that copy directory was executed. -------------------------------------------------------------------------
try
{
   if (!fs.statSync('./test/dist/subdir/test2.json').isFile())
   {
      throw new Error("'./test/dist/subdir/test2.json' not found. (copy failed)");
   }
}
catch(err)
{
   throw new Error("typhonjs-npm-scripts-build-babel test error: " + err);
}

// Verify that script (copy) was executed ---------------------------------------------------------------------------
try
{
   if (!fs.statSync('./test/dist/test.json').isFile())
   {
      throw new Error("'./test/dist/test.json' not found. (script failed)");
   }
}
catch(err)
{
   throw new Error("typhonjs-npm-scripts-build-babel test error: " + err);
}

// Verify that chmod was executed -----------------------------------------------------------------------------------
try
{
   var utilResult = util.inspect(fs.statSync('./test/dist/TestDummy.js'));

   if (utilResult.indexOf('mode: 33261') < 0)
   {
      throw new Error('./test/dist/TestDummy.js chmod failed.');
   }
}
catch(err)
{
   throw new Error("typhonjs-npm-scripts-build-babel test error: " + err);
}

// Empty './test/dist'; comment out to view transpiled result.
//fs.emptyDirSync('./test/dist');