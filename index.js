import { copy } from "fs-extra";
import inquirer from "inquirer";
const { prompt } = inquirer;

import { exec } from "child_process";

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

  exec(`cd ${cwd}/${name}&&npm install`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });

  console.log(
    "\x1b[32m",
    "Files created successfully. Happy Coding!",
    "\x1b[0m"
  );
});
