#!/usr/bin/env node

const fs = require("fs");
const readline = require("readline");
const yaml = require("js-yaml");
const objectPath = require("object-path");

const YAML_OPTIONS = {
  flowLevel: -1,
  styles: {
    "!!int": "hexadecimaldecimal",
    "!!null": "lowercase"
  }
};

const LINE_SPLIT_LIMIT = 2;
const KEY_VALUE_SEPARATOR = "=";

function convertLineToObject(line, yamlResult) {
  const result = Object.assign({}, yamlResult);
  const separatorIndex = line.indexOf(KEY_VALUE_SEPARATOR);
  const key = line.substring(0, separatorIndex);
  const value = line.substring(separatorIndex + 1);
  const keyParts = key.split(".");

  objectPath.set(result, keyParts, value);

  return result;
}

function main() {
  if (process.argv.length !== 4) {
    console.error("ERROR: You must pass a source file and destination file");
    process.exit(1);
  }

  const sourceFile = process.argv[2];
  const destFile = process.argv[3];
  let yamlResult = {};

  try {
    const fileReader = readline.createInterface({
      input: fs.createReadStream(sourceFile),
      crlfDelay: Infinity
    });

    fileReader
      .on("line", line => {
        if (!line.startsWith("#") && line.length > 0) {
          yamlResult = convertLineToObject(line, yamlResult);
        }
      })
      .on("close", () => {
        console.log("WRITING OUT TO YAML FILE: ", destFile);
        fs.writeFileSync(destFile, yaml.dump(yamlResult, YAML_OPTIONS));
        console.log("FINISHED");
      });
  } catch (e) {
    console.log(e);
  }
}

main();
