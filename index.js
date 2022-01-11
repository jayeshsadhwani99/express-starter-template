#!/usr/bin/env node
import { copy } from "fs-extra";
import { readFile, writeFile } from "fs/promises";
import inquirer from "inquirer";
import { exec, spawn } from "child_process";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
const { prompt } = inquirer;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const srcFolder = resolve(__dirname, "src");

// Ask for language
prompt([
  {
    type: "list",
    message: "Pick the language you are using",
    name: "language",
    choices: ["Typescript", "Javascript"],
  },
  {
    type: "input",
    message: "Enter project name",
    name: "name",
  },
]).then(async ({ language, name }) => {
  let source = "";
  //   Check for language
  if (language == "Typescript") {
    source = `${srcFolder}\\Typescript`;
  } else if (language == "Javascript") {
    source = `${srcFolder}\\Javascript`;
  } else {
    console.log("Invalid language");
  }

  if (!name) {
    console.log("Please Enter a name");
    return;
  }

  // Get the current directory
  const cwd = process.cwd();
  await copy(source, `${cwd}\\${name}`).catch((e) => console.log(e));

  // Change package.json package name
  const packageJson = `${cwd}\\${name}\\package.json`;
  await readFile(packageJson, (err, d) => {
    if (err) {
      console.log(err);
    } else {
      let data = JSON.parse(d);
      data.name = name;
      writeFile(packageJson, JSON.stringify(data), (err) => {
        if (err) console.log(err);
      });
    }
  }).catch((e) => console.log(e));

  console.log("\x1b[32m", "Files created successfully.", "\x1b[0m");

  // Install node modules
  prompt([
    {
      type: "confirm",
      message: "Install node modules?",
      name: "install",
    },
  ]).then(({ install }) => {
    if (install) {
      var npmInstall = exec(`cd ${cwd}\\${name}&&npm install`);

      var twirlTimer = (function () {
        var P = ["\\", "|", "/", "-"];
        var x = 0;
        return setInterval(function () {
          process.stdout.write("\r" + P[x++]);
          x &= 3;
        }, 250);
      })();

      npmInstall.on("exit", function (code) {
        console.log("child process exited with code " + code.toString());
        process.exit();
      });
    }
  });
});
