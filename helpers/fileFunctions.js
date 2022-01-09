import {
  existsSync,
  lstatSync,
  writeFileSync,
  readFileSync,
  mkdirSync,
  readdirSync,
} from "fs";
import { join, basename } from "path";

export const copyFileSync = (source, target) => {
  var targetFile = target;

  // If target is a directory, a new file with the same name will be created
  if (existsSync(target)) {
    if (lstatSync(target).isDirectory()) {
      targetFile = join(target, basename(source));
    }
  }

  writeFileSync(targetFile, readFileSync(source));
};

export const copyFolderRecursiveSync = (source, target) => {
  var files = [];

  // Check if folder needs to be created or integrated
  var targetFolder = join(target, basename(source));
  if (!existsSync(targetFolder)) {
    mkdirSync(targetFolder);
  }

  // Copy
  if (lstatSync(source).isDirectory()) {
    files = readdirSync(source);
    files.forEach(function (file) {
      var curSource = join(source, file);
      if (lstatSync(curSource).isDirectory()) {
        let array = curSource.split("\\");
        if (array[array.length - 1] != "node_modules") {
          copyFolderRecursiveSync(curSource, targetFolder);
        }
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
};
