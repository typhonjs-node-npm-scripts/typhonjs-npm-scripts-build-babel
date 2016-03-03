![typhonjs-npm-scripts-build-babel](http://i.imgur.com/g6jTz6E.png)

[![NPM](https://img.shields.io/npm/v/typhonjs-npm-scripts-build-babel.svg?label=npm)](https://www.npmjs.com/package/typhonjs-npm-scripts-build-babel)
[![Code Style](https://img.shields.io/badge/code%20style-allman-yellowgreen.svg?style=flat)](https://en.wikipedia.org/wiki/Indent_style#Allman_style)
[![License](https://img.shields.io/badge/license-MPLv2-yellowgreen.svg?style=flat)](https://github.com/typhonjs-node-npm/typhonjs-npm-scripts-build-babel/blob/master/LICENSE)
[![Gitter](https://img.shields.io/gitter/room/typhonjs/TyphonJS.svg)](https://gitter.im/typhonjs/TyphonJS)

[![Build Status](https://travis-ci.org/typhonjs-node-npm/typhonjs-npm-scripts-build-babel.svg?branch=master)](https://travis-ci.org/typhonjs-node-npm/typhonjs-npm-scripts-build-babel)
[![Dependency Status](https://www.versioneye.com/user/projects/56cea7226b21e5003d4742ac/badge.svg?style=flat)](https://www.versioneye.com/user/projects/56cea7226b21e5003d4742ac)

Provides NPM scripts for building ES6 projects using Babel for all TyphonJS NPM modules and beyond.

This NPM module uses entries defined in the `build.babel` entry located in `.npmscriptrc` in the root path of a project. 

For a comprehensive ES6 build / testing / publishing NPM module please see [typhonjs-npm-build-test](https://www.npmjs.com/package/typhonjs-npm-build-test) as it combines this module for transpiling with Babel along with pre-publish detection via [typhonjs-npm-scripts-publish](https://www.npmjs.com/package/typhonjs-npm-scripts-publish) and [typhonjs-npm-scripts-test-mocha](https://www.npmjs.com/package/typhonjs-npm-scripts-test-mocha). For a full listing of all TyphonJS NPM script modules available please see [typhonjs-node-npm](https://github.com/typhonjs-node-npm) organization on GitHub.

------

To configure the build script provide this entry in `package.json` scripts entry:

```
  "devDependencies": {
    "typhonjs-npm-scripts-build-babel": "^0.0.7"
  },
  "scripts": {
    "build": "babel-node ./node_modules/typhonjs-npm-scripts-build-babel/scripts/build.js"
  },
```

`.npmscriptrc` must be defined in the root path and contain a JSON formatted object hash `build` with a `babel` hash
with the following options:
```
(string)          source - The source directory.
(string)          destination - The destination directory.
(Array<string>)   options - An array of optional parameters which are appended to the invocation of Babel. Please
                            run `./node_modules/.bin/babel --help` for all available options.
```

Please note that you need a [.babelrc](https://babeljs.io/docs/usage/babelrc/) file in the root path for Babel configurations. Or you can provide any of these runtime options in the options entry. 

A basic configuration for transpiling ES6 NPM modules is designating the source directory and the destination directory.  An example of defining these parameters in `.npmscriptrc` follows:
```
{
   "build":
   {
      "babel": { "source": "src", "destination": "dist" }
   }
}
```

Please note that you can add comments to `.npmscriptrc`. Also please note that the build script performs a final sanity check to ensure that there are files / directories in the destination directory otherwise an exception is thrown. 
