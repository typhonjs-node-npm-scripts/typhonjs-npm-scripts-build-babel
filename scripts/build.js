'use strict';

/**
 * build -- Initiates the Babel build process. A valid `npm-scripts.json` configuration file must be located in the
 * root path. This configuration file must contain a `build` hash with a `babel` hash entry that contains the
 * following options:
 * ```
 * (string)          source - The source directory.
 * (string)          destination - The destination directory.
 * (Array<string>)   options - An array of optional parameters which are appended to the invocation of Babel. Please
 *                             run `./node_modules/.bin/babel --help` for all available options.
 * ```
 */

var cp =                require('child_process');
var fs =                require('fs-extra');
var stripJsonComments = require('strip-json-comments');

// Verify that `npm-scripts.json` exists.
try
{
   if (!fs.statSync('./npm-scripts.json').isFile())
   {
      throw new Error("'npm-scripts.json' not found in root path.");
   }
}
catch(err)
{
   throw new Error("TyphonJS NPM script (build) error: " + err);
}

// Verify that `Babel` exists.
try
{
   if (!fs.statSync('./node_modules/.bin/babel').isFile())
   {
      throw new Error("could not locate Babel at './node_modules/.bin/babel'.");
   }
}
catch(err)
{
   throw new Error("TyphonJS NPM script (build) error: " + err);
}

// Load `npm-scripts.json` and strip comments.
var configInfo = JSON.parse(stripJsonComments(fs.readFileSync('./npm-scripts.json', 'utf-8')));

// Verify that `build` entry is an object.
if (typeof configInfo.build !== 'object')
{
   throw new Error(
    "TyphonJS NPM script (build) error: build entry is not an object or is missing in 'npm-scripts.json'.");
}


// Verify that `build.babel` entry is an object.
if (typeof configInfo.build.babel !== 'object')
{
   throw new Error(
    "TyphonJS NPM script (build) error: build.babel entry is not an object or is missing in 'npm-scripts.json'.");
}

var babelConfig = configInfo.build.babel;

// Verify that source entry is a string.
if (typeof babelConfig.source !== 'string')
{
   throw new Error(
    "TyphonJS NPM script (build) error: build.babel.source entry is not a string or is missing in 'npm-scripts.json'.");
}

// Verify that destination entry is a string.
if (typeof babelConfig.destination !== 'string')
{
   throw new Error(
    "TyphonJS NPM script (build) error: build.babel.destination entry is not a string or is missing in "
     + "'npm-scripts.json'.");
}

// Verify that source entry is a directory.
try
{
   if (!fs.statSync(babelConfig.source).isDirectory())
   {
      throw new Error("build.babel.source entry is not a directory: " + babelConfig.source);
   }
}
catch(err)
{
   throw new Error("TyphonJS NPM script (build) error: " + err);
}

// Create or empty destination directory.
fs.emptyDirSync(babelConfig.destination);

// Verify that destination entry is a directory.
try
{
   if (!fs.statSync(babelConfig.destination).isDirectory())
   {
      throw new Error("build.babel.destination entry is not a directory: " + babelConfig.destination);
   }
}
catch(err)
{
   throw new Error("TyphonJS NPM script (build) error: " + err);
}

// Build base execution command.
var exec = './node_modules/.bin/babel ' + babelConfig.source + ' -d ' + babelConfig.destination;

// Add any optional parameters.
if (typeof babelConfig.options !== 'undefined')
{
   if (!Array.isArray(babelConfig.options))
   {
      throw new Error(
       "TyphonJS NPM script (build) error: build.babel.options entry is not an array in 'npm-scripts.json'.");
   }

   exec += ' ' + babelConfig.options.join(' ');
}

// Notify what command is being executed then execute it.
process.stdout.write('Executing: ' + exec + '\n');
cp.execSync(exec, { stdio: 'inherit' });

// Verify that there are files / dirs in destination directory. If the directory is empty then fail.
var files = fs.readdirSync(babelConfig.destination);
if (files.length === 0)
{
   throw new Error(
    "TyphonJS NPM script (build) error: empty destination directory: " + babelConfig.destination);
}