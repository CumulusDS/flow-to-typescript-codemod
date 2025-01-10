/* eslint-disable no-console */
/**
 * Script to automate cumulus specific steps
 * Usage: ts-node cumulusStepsRunner.ts <target-repo-path>
 */

import fs from "fs";
import path from "path";
import readline from "readline";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { CumulusSteps } from "./cumulusSteps";

const { argv } = yargs(hideBin(process.argv))
  .usage("Usage: ts-node cumulusStepsRunner.ts [options]")
  .version("1.0.0")
  .option("targetRepoPath", {
    alias: "t",
    type: "string",
    description: "Path to the target repository",
    demandOption: true,
  })
  .option("nonInteractive", {
    alias: "n",
    type: "boolean",
    description: "Run in non-interactive mode",
    default: false,
    demandOption: true,
  })
  .demandOption("targetRepoPath", "Please provide the path to the target repository")
  .help();

const { targetRepoPath, nonInteractive } = argv as { targetRepoPath: string; nonInteractive: boolean };

console.log({ targetRepoPath, nonInteractive });

if (!fs.existsSync(targetRepoPath)) {
  console.error(`Path ${targetRepoPath} does not exist`);
  process.exit(1);
}
const cumulusSteps = new CumulusSteps(path.resolve(targetRepoPath));

const steps = cumulusSteps.getSteps();
console.log("Following steps are added in the list for execution:");
steps.forEach((step, indx) => {
  console.log(`  ${(indx + 1).toString().padStart(2, " ")}. ${step}`);
});

if (nonInteractive) {
  console.log("Executing steps in non-interactive mode...");
  cumulusSteps.runSteps().then(() => {
    console.log("Exiting after executing steps");
  });
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
    console.log("Executing steps...");
    cumulusSteps.runSteps();
    console.log("Exiting after executing steps");
  } else {
    console.log("Exiting without executing steps");
  }
  readUserInput.close();
});
