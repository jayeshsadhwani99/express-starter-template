import { copy } from "fs-extra";
import { readFile, writeFile } from "fs";
import inquirer from "inquirer";
import { spawn } from "child_process";
const { prompt } = inquirer;

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
    source = "./src/TypeScript";
  } else if (language == "Javascript") {
    source = "./src/Javascript";
  } else {
    console.log("Invalid language");
  }

  if (!name) {
    console.log("Please Enter a name");
    return;
  }

  // Get the current directory
  const cwd = process.cwd();
  await copy(source, `${cwd}/${name}`).catch((e) => console.log(e));

  // Change package.json package name
  const packageJson = `${cwd}\\${name}\\package.json`;
  readFile(packageJson, (err, d) => {
    if (err) {
      console.log(err);
    } else {
      let data = JSON.parse(d);
      data.name = name;
      writeFile(packageJson, JSON.stringify(data), (err) => {
        if (err) console.log(err);
      });
    }
  });

  console.log("\x1b[32m", "Files created successfully.", "\x1b[0m");

  // Install node modules
  // prompt([
  //   {
  //     type: "confirm",
  //     message: "Install node modules?",
  //     name: "install",
  //   },
  // ]).then(({ install }) => {
  //   if (install) {
  //     npmInstall = spawn(`cd ${cwd}\\${name}&&npm install`);

  //     npmInstall.stdout.on("data", function (data) {
  //       console.log(data.toString());
  //     });

  //     npmInstall.stderr.on("data", function (data) {
  //       console.log(data.toString());
  //     });

  //     npmInstall.on("exit", function (code) {
  //       console.log("child process exited with code " + code.toString());
  //     });
  //   }
  // });
});
