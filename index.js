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

function convertLineToObject(line, yamlResult) {
  const result = Object.assign({}, yamlResult);

  const [key, value] = line.split("=");
  const keyParts = key.split(".");

  objectPath.set(result, keyParts, value);

  return result;
}

function main() {
  if (process.argv.length !== 4) {
    console.error("You must pass a source file and destination file");
    exit(1);
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
