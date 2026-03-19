const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const filesToFix = [
  "src/components/BookmarkButton.vue",
  "src/components/Journals.vue",
  "src/components/Result.vue",
  "src/components/ResultCounter.vue",
  "src/components/Schema.vue",
  "src/components/SchemaNode.vue",
  "src/components/Search.vue",
  "src/store/index.js",
  "src/store/schemacounts.js",
  "src/store/schematize.js",
  "static/lodash.min.js"
];

const eslintFixCommand = "eslint --fix";

function runCommand(command, callback) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    if (callback) callback();
  });
}

function fixFiles() {
  filesToFix.forEach((file, index) => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`Fixing file: ${filePath}`);
      runCommand(`${eslintFixCommand} ${filePath}`, () => {
        if (index === filesToFix.length - 1) {
          console.log("All files processed.");
        }
      });
    } else {
      console.error(`File not found: ${filePath}`);
    }
  });
}

fixFiles();
