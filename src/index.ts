#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import inquirer from "inquirer";
// import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import * as shell from "shelljs";
import { createSpinner } from "nanospinner";

interface CliOptions {
  projectName: string;
  templateName: string;
  templatePath: string;
  tartgetPath: string;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CURR_DIR = process.cwd();
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
const SKIP_FILES = ["node_modules", ".template.json"];
const TEMPLATE_CHOICES = fs.readdirSync(path.join(__dirname, "templates"));
const STYLING_CHOICES = fs.readdirSync(
  path.join(__dirname, "templates", "typescript")
);

async function welcome(callback: any) {
  figlet(
    "Create Vanilla Site",
    { font: "Larry 3D" },
    async function (err: any, data: any) {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }

      const introTitle = chalkAnimation.rainbow(data);
      await sleep();
      introTitle.stop();
      console.log(
        chalk.blue.bold("The best way to start a modern vanilla site \n")
      );
      callback();
    }
  );
}

function generateTemplate() {
  const QUESTIONS = [
    {
      name: "name",
      type: "input",
      message: "What will your project be called?:",
    },
    {
      name: "template",
      type: "list",
      message: "Will you be using JavaScript or TypeScript?",
      choices: TEMPLATE_CHOICES,
    },
    {
      name: "styling",
      type: "list",
      message: "How will you style your project?",
      choices: STYLING_CHOICES,
    },
  ];

  inquirer.prompt(QUESTIONS).then((answers) => {
    const projectName = answers["name"];
    const templateChoice = answers["template"];
    const stylingChoice = answers["styling"];
    const templatePath = path.join(
      __dirname,
      "templates",
      templateChoice,
      stylingChoice
    );
    const tartgetPath = path.join(CURR_DIR, projectName);
    const options: CliOptions = {
      projectName,
      templateName: templateChoice,
      templatePath,
      tartgetPath,
    };
    console.log(options);

    if (!createProject(tartgetPath)) {
      return;
    }

    createDirectoryContents(templatePath, projectName);
    postProcess(options);
  });
}

function createProject(projectPath: string) {
  if (fs.existsSync(projectPath)) {
    console.log(
      chalk.red(
        `Folder ${projectPath} already exists. Delete or use another name.`
      )
    );
    return false;
  }
  fs.mkdirSync(projectPath);

  return true;
}

function createDirectoryContents(templatePath: string, projectName: string) {
  // read all files/folders (1 level) from template folder
  const filesToCreate = fs.readdirSync(templatePath);
  // loop each file/folder
  filesToCreate.forEach((file) => {
    const origFilePath = path.join(templatePath, file);

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    // skip files that should not be copied
    if (SKIP_FILES.indexOf(file) > -1) return;

    if (stats.isFile()) {
      // read file content and transform it using template engine
      let contents = fs.readFileSync(origFilePath, "utf8");
      // write file to destination folder
      const writePath = path.join(CURR_DIR, projectName, file);
      fs.writeFileSync(writePath, contents, "utf8");
    } else if (stats.isDirectory()) {
      // create folder in destination folder
      fs.mkdirSync(path.join(CURR_DIR, projectName, file));
      // copy files/folder inside current folder recursively
      createDirectoryContents(
        path.join(templatePath, file),
        path.join(projectName, file)
      );
    }
  });
}

async function postProcess(options: CliOptions) {
  const spinner = createSpinner("Creating project...").start();
  await sleep();

  spinner.success({
    text: `Hooray!!!????????????, type cd ${options.projectName} to start `,
  });
}

console.clear();
await welcome(function () {
  generateTemplate();
});
