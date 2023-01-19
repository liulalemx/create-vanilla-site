#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
// import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";

const __dirname = path.resolve();
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome(callback: any) {
  figlet(
    "Create Static Site",
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
        chalk.blue.bold("The best way to start a modern static site \n")
      );
      callback();
    }
  );
}

function generateTemplate() {
  const CHOICES = fs.readdirSync(path.join(__dirname, "templates"));

  const QUESTIONS = [
    {
      name: "template",
      type: "list",
      message: "What project template would you like to generate?",
      choices: CHOICES,
    },
    {
      name: "name",
      type: "input",
      message: "Project name:",
    },
  ];

  inquirer.prompt(QUESTIONS).then((answers) => {
    console.log(answers);
  });
}

console.clear();
await welcome(function () {
  generateTemplate();
});
