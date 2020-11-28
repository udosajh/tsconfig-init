import fs = require("fs");
import shelljs = require("shelljs");
import path = require("path");
import jsBeautify = require("js-beautify");
const currentDirPath = shelljs.pwd().stdout;

const tsconfigBase = {
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
            "*": [
                "node_modules/*"
            ]
        },
        "rootDirs": [
            "."
        ]
    }
};

const tsconfigSrc = {
    "extends": "./tsconfig.base.json",
    "compilerOptions": {
        "outDir": "./dist",
    },
    "include": [
        "src/**/*",
    ]
};

const tsconfigTest = {
    "extends": "./tsconfig.base.json",
    "compilerOptions": {
        "outDir": "./dist",
    },
    "include": [
        "test/**/*"
    ]
};

const tsconfigBaseFilePath = currentDirPath + path.sep + "tsconfig.base.json";
const tsconfigSrcFilePath = currentDirPath + path.sep + "tsconfig.src.json";
const tsconfigTestFilePath =       currentDirPath + path.sep + "tsconfig.test.json";


fs.writeFileSync(tsconfigBaseFilePath, jsBeautify.js_beautify(JSON.stringify(tsconfigBase)));
fs.writeFileSync(tsconfigSrcFilePath, jsBeautify.js_beautify(JSON.stringify(tsconfigSrc)));
fs.writeFileSync(tsconfigTestFilePath, jsBeautify.js_beautify(JSON.stringify(tsconfigTest)));