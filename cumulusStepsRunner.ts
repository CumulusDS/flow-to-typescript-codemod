/* eslint-disable no-console */
/**
 * Script to automate cumulus specific steps
 * Usage: ts-node cumulusStepsRunner.ts <target-repo-path>
 */

import fs from "fs";
import path from "path";
import { CumulusSteps } from "./cumulusSteps";

const targetRepoPath = process.argv[2];
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

// cumulusSteps.runSteps();
