/* eslint-disable no-console */
/**
 * Script to automate cumulus specific steps
 * Usage: ts-node cumulusStepsRunner.ts <target-repo-path>
 */

import fs from "fs";
import path from "path";
import readline from "readline";
import { CumulusSteps } from "./cumulusSteps";

const targetRepoPath = process.argv[2];
const nonInteractive = process.argv[3] === "--non-interactive";

if (!fs.existsSync(targetRepoPath)) {
  console.error(`Path ${targetRepoPath} does not exist`);
  process.exit(1);
}
const cumulusSteps = new CumulusSteps(path.resolve(targetRepoPath));

const steps = cumulusSteps.getSteps();
console.log("Following steps are added in the list for execution:");
steps.forEach((step, indx) => {
  console.log(`  ${indx + 1}. ${step}`);
});

if (nonInteractive) {
  // cumulusSteps.runSteps();
  console.log("Executing steps in non-interactive mode");
  process.exit(0);
}

// read user input
const readUserInput = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

readUserInput.question("Do you want to execute all steps? (Y/n)", (answer) => {
  // handle yes or enter key
  if (answer.toLowerCase() === "y" || answer === "") {
    // cumulusSteps.runSteps();
    console.log("Exiting after executing");
  } else {
    console.log("Exiting without executing steps");
  }
  readUserInput.close();
});

// cumulusSteps.runSteps();
