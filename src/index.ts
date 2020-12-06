#!/usr/bin/env node
import fs = require("fs");
import shelljs = require("shelljs");
import path = require("path");
import jsBeautify = require("js-beautify");
import yargs = require("yargs");

const args = yargs(process.argv).options({
    "indentation": {
        alias: "i",
        description: "indentation of tsconfig file default => 4",
        default: 4,
        type: "number"
    }
}).help("help").argv;


const currentDirPath = shelljs.pwd().stdout;

const tsconfig = {
    "compileOnSave": true,
    "compilerOptions": {
        "target": "es2015",
        "module": "commonjs",
        "lib": ["ES2015", "DOM"],
        "declaration": true,
        "sourceMap": true,
        "removeComments": true,
        "downlevelIteration": true,
        "strict": true,
        "noImplicitAny": true,
        "strictNullChecks": true,
        "noImplicitThis": true,
        "alwaysStrict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noImplicitReturns": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "noFallthroughCasesInSwitch": true,
        "moduleResolution": "node",
        "baseUrl": ".",
        "paths": {
            "*": ["node_modules/*"]
        },
        "rootDirs": ["."],
        "outDir": "./dist",
    },
    "include": [
        "src/**/*",
        "test/**/*"
    ],
    "exclude": [
        "node_modules",
        "dist"
    ],
};

const tsconfigPath = currentDirPath + path.sep + "tsconfig.json";

const options: jsBeautify.JSBeautifyOptions = {
    wrap_line_length: 1,
    indent_size: args.indentation
};

fs.writeFileSync(tsconfigPath, jsBeautify.js_beautify(JSON.stringify(tsconfig), options));