import inquirer from "inquirer";
const { prompt } = inquirer;
import { copyFolderRecursiveSync } from "./helpers/fileFunctions.js";

// Ask for language
prompt([
  {
    type: "list",
    message: "Pick the language you are using",
    name: "language",
    choices: ["Typescript", "Javascript"],
  },
]).then(({ language }) => {
  let source = "";
  //   Check for language
  if (language == "Typescript") {
    source = "./src/TypeScript";
  } else if (language == "Javascript") {
    source = "./src/Javascript";
  } else {
    console.log("Invalid language");
  }

  // Get the current directory
  const cwd = process.cwd();
  copyFolderRecursiveSync(source, cwd);
  console.log(
    "\x1b[32m",
    "Files created successfully. Happy Coding!",
    "\x1b[0m"
  );
});
