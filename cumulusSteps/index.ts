/* eslint-disable no-console */
/**
 * This file packs all the steps to return a list.
 */

import * as path from "path";
import { createTsConfigFile } from "./createTsconfig";
import { modifyEslintConfig } from "./modifyEslintrc";
import { runCommands } from "./runCommands";
import { replaceTextInFile } from "./replaceTextInFile";
import {
  addYarnScript,
  // modifyYarnScript,
  removeYarnScript,
  replaceInYarnScript,
  modifyJestCollectCoverageFrom,
} from "./packageJsonHelper";

export class CumulusSteps {
  private targetRepoPath: string;
  private steps: Array<{ name: string; stepFunction: () => void | Promise<void> }> = [];
  private async addDefaultSteps() {
    const packageJsonFilePath = path.join(this.targetRepoPath, "package.json");
    const tsconfigFilePath = path.join(this.targetRepoPath, "tsconfig.json");
    const eslintrcFilePath = path.join(this.targetRepoPath, ".eslintrc.js");

    this.addStep("Create tsconfig.json", () => {
      createTsConfigFile(tsconfigFilePath);
    });
    this.addStep(
      "Install TypeScript as a dev dependency",
      async () => await runCommands(this.targetRepoPath, ["yarn add typescript --dev"])
    );
    this.addStep(
      "Remove flow artifacts",
      async () => await runCommands(this.targetRepoPath, ["rm -rf flow-typed", "rm -f .flowconfig"])
    );
    this.addStep("Update babel config", () => {
      const babelrcFilePath = path.join(this.targetRepoPath, ".babelrc.js");
      replaceTextInFile(babelrcFilePath, "@babel/preset-flow", "@babel/preset-typescript");
    });
    this.addStep(
      "Remove babel old dependencies",
      async () => await runCommands(this.targetRepoPath, ["yarn remove @babel/preset-flow babel-eslint"])
    );
    this.addStep(
      "Add babel new dependencies",
      async () => await runCommands(this.targetRepoPath, ["yarn add @babel/preset-typescript --dev"])
    );
    this.addStep("Update eslint config", () => {
      replaceTextInFile(eslintrcFilePath, "plugin:flowtype/recommended", "plugin:@typescript-eslint/recommended");
    });
    this.addStep("Modify eslint config rules, settings and plugins", () => {
      modifyEslintConfig(eslintrcFilePath);
    });

    this.addStep(
      "Update eslint to ^8.57.1",
      async () => await runCommands(this.targetRepoPath, ["yarn add eslint@^8.57.1 --dev"])
    );
    this.addStep(
      "Install eslint plugin and parser ",
      async () =>
        await runCommands(this.targetRepoPath, [
          "yarn add @typescript-eslint/eslint-plugin @typescript-eslint/parser --dev",
        ])
    );
    this.addStep(
      "Update prettier to ^3.3.3",
      async () => await runCommands(this.targetRepoPath, ["yarn add prettier@^3.3.3 --dev"])
    );
    this.addStep(
      "Update eslint-config-prettier to ^8.10.0",
      async () => await runCommands(this.targetRepoPath, ["yarn add eslint-config-prettier@^8.10.0 --dev"])
    );
    this.addStep(
      "Update eslint-plugin-prettier to ^5.2.1",
      async () => await runCommands(this.targetRepoPath, ["yarn add eslint-plugin-prettier@^5.2.1 --dev"])
    );
    this.addStep(
      "Add eslint-plugin-import",
      async () => await runCommands(this.targetRepoPath, ["yarn add eslint-plugin-import --dev"])
    );

    // this.addStep("Update build script", () => modifyYarnScript(packageJsonFilePath, "build", "tsc"));
    this.addStep("Update build script", () => replaceInYarnScript(packageJsonFilePath, "build", "^", "tsc && "));

    this.addStep("Add script to generate flowtypes", () =>
      addYarnScript(
        packageJsonFilePath,
        "build:flowtypes",
        "find lib -type f -name '*.d.ts' -exec sh -c 'yarn flowgen --add-flow-header --no-inexact $1 -o ${1%.*.*}.js.flow' _ '{}' \\;"
      )
    );

    // prepack script may not exist
    this.addStep("Remove old prepack script", () => removeYarnScript(packageJsonFilePath, "prepack"));
    this.addStep("Add new prepack script", () =>
      addYarnScript(packageJsonFilePath, "prepack", "yarn run build && yarn run build:flowtypes")
    );

    // flow script may not exist
    this.addStep("Remove old flow script", () => removeYarnScript(packageJsonFilePath, "flow"));
    this.addStep("Add new flow script", () => addYarnScript(packageJsonFilePath, "flow", "echo 'Not a flow project'"));

    this.addStep("Remove old test:flow script", () => removeYarnScript(packageJsonFilePath, "test:flow"));
    this.addStep("Remove old test:flow:coverage-report script", () =>
      removeYarnScript(packageJsonFilePath, "test:flow:coverage-report")
    );
    this.addStep("Remove old test:flow:status script", () => removeYarnScript(packageJsonFilePath, "test:flow:status"));

    this.addStep("Update test:lint script for .ts extensions", () =>
      replaceInYarnScript(packageJsonFilePath, "test:lint", "\\.js", ".ts")
    );

    this.addStep("Update test:prettier script for .ts extensions", () =>
      replaceInYarnScript(packageJsonFilePath, "test:prettier", "\\.js", ".ts")
    );

    this.addStep("Update test:prettier script for .ts extensions", () =>
      replaceInYarnScript(packageJsonFilePath, "test:prettier", "\\.js", ".ts")
    );

    this.addStep("Update Jest Coverage", () => modifyJestCollectCoverageFrom(packageJsonFilePath));

    this.addStep(
      "Remove @cumulusds/flow-aws-sdk",
      async () => await runCommands(this.targetRepoPath, ["yarn @cumulusds/flow-aws-sdk"])
    );
    this.addStep("Remove flow-bin", async () => await runCommands(this.targetRepoPath, ["yarn remove flow-bin"]));
    this.addStep(
      "Remove flow-copy-source",
      async () => await runCommands(this.targetRepoPath, ["yarn remove flow-copy-source"])
    );
    this.addStep("Remove flow-typed", async () => await runCommands(this.targetRepoPath, ["yarn remove flow-typed"]));

    this.addStep(
      "Add @types/aws-lambda",
      async () => await runCommands(this.targetRepoPath, ["yarn add @types/aws-lambda --dev"])
    );
    this.addStep("Add @types/jest", async () => await runCommands(this.targetRepoPath, ["yarn add @types/jest --dev"]));
    this.addStep("Add flowgen", async () => await runCommands(this.targetRepoPath, ["yarn add flowgen --dev"]));
  }
  constructor(targetRepoPath: string) {
    this.targetRepoPath = targetRepoPath;
    this.addDefaultSteps();
  }

  public getSteps() {
    const stepNames = this.steps.map((step) => step.name);
    return stepNames;
  }
  public addStep(name: string, stepFunction: () => void) {
    this.steps.push({ name, stepFunction });
  }
  public async runSteps() {
    for await (const step of this.steps) {
      console.log("\n", `Running step: ${step.name}`);
      try {
        await step.stepFunction();
      } catch (error) {
        console.error(`Error executing step "${step.name}": ${(error as Error).message}`);
      }
      console.log(`Completed step: ${step.name}`);
    }
  }
}
