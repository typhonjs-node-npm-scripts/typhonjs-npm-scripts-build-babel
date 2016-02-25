'use strict';

/**
 * build -- Initiates the Babel build process. A valid `npm-build.json` configuration file must be located in the
 * root path. This configuration file contains the following options:
 * ```
 * (string)          source - The source directory.
 * (string)          source - The destination directory.
 * (Array<string>)   options - An array of optional parameters which are appended to the invocation of Babel. Please
 *                             run `./node_modules/.bin/babel --help` for all available options.
 * ```
 */

var cp =                require('child_process');
var fs =                require('fs-extra');
var stripJsonComments = require('strip-json-comments');

// Verify that `npm-build.json` exists.
try
{
   if (!fs.statSync('./npm-build.json').isFile())
   {
      throw new Error("'npm-build.json' not found in root path.");
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

// Load `npm-build.json` and strip comments.
var configInfo = JSON.parse(stripJsonComments(fs.readFileSync('./npm-build.json', 'utf-8')));

// Verify that babel entry is an object.
if (typeof configInfo.babel !== 'object')
{
   throw new Error(
    "TyphonJS NPM script (build) error: babel entry is not an object or is missing in 'npm-build.json'.");
}

// Verify that source entry is a string.
if (typeof configInfo.babel.source !== 'string')
{
   throw new Error(
    "TyphonJS NPM script (build) error: source entry is not a string or is missing in 'npm-build.json'.");
}

// Verify that destination entry is a string.
if (typeof configInfo.babel.destination !== 'string')
{
   throw new Error(
    "TyphonJS NPM script (build) error: destination entry is not a string or is missing in 'npm-build.json'.");
}

// Verify that source entry is a directory.
try
{
   if (!fs.statSync(configInfo.babel.source).isDirectory())
   {
      throw new Error("source entry is not a directory: " + configInfo.babel.source);
   }
}
catch(err)
{
   throw new Error("TyphonJS NPM script (build) error: " + err);
}

// Create or empty destination directory.
fs.emptyDirSync(configInfo.babel.destination);

// Verify that destination entry is a directory.
try
{
   if (!fs.statSync(configInfo.babel.destination).isDirectory())
   {
      throw new Error("destination entry is not a directory: " + configInfo.babel.destination);
   }
}
catch(err)
{
   throw new Error("TyphonJS NPM script (build) error: " + err);
}

// Build base execution command.
var exec = './node_modules/.bin/babel ' + configInfo.babel.source + ' -d ' + configInfo.babel.destination;

// Add any optional parameters.
if (typeof configInfo.babel.options !== 'undefined')
{
   if (!Array.isArray(configInfo.babel.options))
   {
      throw new Error(
       "TyphonJS NPM script (build) error: options entry is not an array in 'npm-build.json'.");
   }

   exec += ' ' + configInfo.babel.options.join(' ');
}

// Notify what command is being executed then execute it.
process.stdout.write('Executing: ' + exec + '\n');
cp.execSync(exec, { stdio: 'inherit' });

// Verify that there are files / dirs in destination directory. If the directory is empty then fail.
var files = fs.readdirSync(configInfo.babel.destination);
if (files.length === 0)
{
   throw new Error(
    "TyphonJS NPM script (build) error: empty destination directory: " + configInfo.babel.destination);
}