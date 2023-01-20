#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
// import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";

interface CliOptions {
  projectName: string;
  templateName: string;
  templatePath: string;
  tartgetPath: string;
}

const __dirname = path.resolve();
const CURR_DIR = process.cwd();
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

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
  const CHOICES = fs.readdirSync(path.join(__dirname, "templates"));

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
      choices: CHOICES,
    },
  ];

  inquirer.prompt(QUESTIONS).then((answers) => {
    const templateChoice = answers["template"];
    const projectName = answers["name"];
    const templatePath = path.join(__dirname, "templates", templateChoice);
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

console.clear();
await welcome(function () {
  generateTemplate();
});
