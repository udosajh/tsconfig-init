#!/usr/bin/env node
import fs = require("fs");
import shelljs = require("shelljs");
import path = require("path");
import jsBeautify = require("js-beautify");
import yargs = require("yargs");

const defaultTsConfigData = {
    "tsconfig.json": {
        "compileOnSave": true,
        "compilerOptions": {
            "target": "es2015",
            "module": "commonjs",
            "lib": ["ESNext", "DOM"],
            "declaration": true,
            "sourceMap": true,
            "removeComments": true,
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
        ]
    }
};

const args = yargs(process.argv).options({
    "indentation": {
        alias: "i",
        description: "indentation of tsconfig file default => 4",
        default: 4,
        type: "number"
    },
    "command": {
        alias: "c",
        description: "adds compile and auto compile commands in package json, beware that it also changes your indentation (indentation default to 4)",
        default: false,
        type: "boolean"
    },
    "save": {
        alias: "s",
        description: "save your ts config file in your system, and use this as your default file. it takes array of file path example -s ./tsconfig.json -s ./tsconfig.src.json",
        type: "array"
    },
    "name": {
        alias: "n",
        description: "identifier (name) of the template",
        type: "string",
        default: null
    },
    "list": {
        alias: "l",
        description: "list of saved tsconfig files template identifiers",
        type: "boolean",
        default: false
    },
    "update-default-template": {
        alias: "u",
        description: "set default tsconfig file, pass the name -n flag to set the identifier",
        type: "string",
        default: false
    },
    "template": {
        alias: "t",
        description: "flag -n indicate template to be written in user directory",
        type: "boolean",
        default: false
    }
}).help("help").argv;

const dataDirName = "data";
const defaultFileName = "default-config";
const defaultTsConfigFileName = "default-tsconfig";
const defaultFileData = { default: defaultTsConfigFileName };
const dataDirPath = __dirname + path.sep + dataDirName;

const defaultTsConfigFilePath = dataDirPath + path.sep + defaultTsConfigFileName + ".json";
const defaultFilePath = dataDirPath + path.sep + defaultFileName + ".json";
const isDefaultFileExists = fs.existsSync(defaultFilePath);
const jsonWriteOptions: jsBeautify.JSBeautifyOptions = {
    wrap_line_length: 1,
    indent_size: args.indentation
};
const userDir = shelljs.pwd().stdout;

const dataDirExists = fs.existsSync(dataDirPath);

if (!dataDirExists) {
    fs.mkdirSync(dataDirPath);
}

// create default file
if (!isDefaultFileExists) {
    fs.writeFileSync(defaultFilePath, beautifyJsonString(defaultFileData));
}

const isDefaultTsConfigFileExist = fs.existsSync(defaultTsConfigFilePath);
// create tsconfig default file
if (!isDefaultTsConfigFileExist) {
    fs.writeFileSync(defaultTsConfigFilePath, beautifyJsonString(defaultTsConfigData));
}

function beautifyJsonString(data: Object) {
    return jsBeautify.js_beautify(JSON.stringify(data), jsonWriteOptions);
}

function updateDefaultFile(name: string) {
    fs.writeFileSync(defaultFilePath, beautifyJsonString({ default: name }));
}

function writeTsFileInDataDir(name: string, data: Object) {
    fs.writeFileSync(dataDirPath + path.sep + name + ".json", beautifyJsonString(data));
}

function raiseNameFlagErr() {
    throw new Error("Name flag '-n' is missing");
}

function readSavedFileInDataDir(name: string) {
    return fs.readFileSync(dataDirPath + path.sep + name + ".json").toString();
}

function getIdentifiers() {
    const files = fs.readdirSync(dataDirPath + path.sep);
    const sanitizedFilesList = files.filter(file => file !== defaultFileName + ".json").map(file => file.replace(".json", ""));
    return sanitizedFilesList;
}

function writeToUserDir(tsconfig: Object) {
    for (const [fileName, tsconfigObj] of Object.entries(tsconfig)) {
        fs.writeFileSync(userDir + path.sep + fileName, beautifyJsonString(tsconfigObj));
    }
    console.log("tsconfig file created");
}


if (args.save?.length) {
    /**
    * check name flag
    * check file exists in user dir
    * update default file
    * save ts files in data dir
    */
    const name = args.name as string | null;
    // key fileName (tsconfig.json) and value is tsconfig.json data
    // to save multiple tsconfig files in a single directory
    // example tsconfig.src.json, tsconfig.test.json etc
    const tsConfigObj: { [k: string]: {} } = {};

    if (name) {
        (args.save as any as string[]).forEach((filePath: string) => {
            filePath.replace(userDir, userDir);
            const sanitizedPath = filePath.replace(/^(\.\/|\/)/, userDir + path.sep);
            const fileExists = fs.existsSync(sanitizedPath);
            if (!fileExists) {
                throw new Error(`file ${sanitizedPath} does not exist`);
            }
            const lastSeparatorIndex = sanitizedPath.lastIndexOf(path.sep);
            const key = sanitizedPath.substring(lastSeparatorIndex + 1);
            if (tsConfigObj.hasOwnProperty(key)) {
                throw new Error("Two or more files have same name");
            }
            const tsFile = fs.readFileSync(sanitizedPath).toString();
            tsConfigObj[key] = JSON.parse(tsFile);
        });
        updateDefaultFile(name);
        writeTsFileInDataDir(name, tsConfigObj);
        console.log("default tsconfig updated to ", name);
    } else {
        raiseNameFlagErr();
    }
} else if (args.list) {
    /**
     * get ids from data directory
     */
    const list = getIdentifiers();
    console.log(list);
} else if (args["update-default-template"]) {
    /**
     * check identifier exist
     * update default file
     */
    const name = args.name;
    if (name) {
        const list = getIdentifiers();
        const defaultFileIndex = list.indexOf(name);
        if (defaultFileIndex === -1) {
            throw new Error(`Did not find any file with this name ${name}, list of tsfiles ${list} `);
        } else {
            updateDefaultFile(name!);
        }
    } else {
        raiseNameFlagErr();
    }
} else if (args.template) {
    /**
     * check name exists
     * check identifier exists
     * write template in user directory
     */
    const name = args.name;
    if (name) {
        const list = getIdentifiers();
        const index = list.indexOf(name);
        if (index === -1) {
            throw new Error(`Did not find any file with this name ${name}, list of tsfiles ${list} `);
        } else {
            const tsconfigObj = JSON.parse(readSavedFileInDataDir(name));
            writeToUserDir(tsconfigObj);
        }
    } else {
        raiseNameFlagErr();
    }
} else {
    /**
     * read default file
     * read ts file from data dir
     * write ts file to user dir
     */
    const dataFileName = JSON.parse(readSavedFileInDataDir(defaultFileName)).default;
    const tsconfig = JSON.parse(readSavedFileInDataDir(dataFileName));
    writeToUserDir(tsconfig);
}

if (args.command) {
    /**
     * read package json file from user dir
     * default file name will be equal to name || name saved in default file
     * read tsObj from data dir
     * update package json file
     */
    const packageJsonPath = userDir + path.sep + "package.json";

    console.log("reading package json.....");

    const packageObj = JSON.parse(fs.readFileSync(packageJsonPath).toString());

    const defaultTsFileName = args.name || JSON.parse(readSavedFileInDataDir(defaultFileName)).default;
    const tsObj = JSON.parse(readSavedFileInDataDir(defaultTsFileName));

    const autoCompiles = [];
    const compiles = [];

    for (const fileName of Object.keys(tsObj)) {
        const autoCompileCommand = `auto-compile-${fileName.replace(".json", "")}`;
        const compileCommand = `compile-${fileName.replace(".json", "")}`;
        packageObj["scripts"][autoCompileCommand] = `tsc -w -p ${fileName}`;
        packageObj["scripts"][compileCommand] = `tsc -p ${fileName}`;
        autoCompiles.push(autoCompileCommand);
        compiles.push(compileCommand);
    }

    // packageObj["scripts"]["auto-compile"] = autoCompiles.join(" && ");
    packageObj["scripts"]["compile"] = "npm run " + compiles.join(" && npm run ");

    fs.writeFileSync(packageJsonPath, jsBeautify.js_beautify(JSON.stringify(packageObj), jsonWriteOptions));

    console.log("compile and auto compile commands added in package json");
}