/* eslint-disable no-console */
import * as fs from "fs";

export function addYarnScript(filePath: string, scriptName: string, scriptCommand: string) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(filePath, "utf8"));
    packageJson.scripts = {
      ...packageJson.scripts,
      [scriptName]: scriptCommand,
    };
    fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2), "utf8");
    console.log(`Added script "${scriptName}" to ${filePath}`);
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${(error as Error).message}`);
  }
}

export function removeYarnScript(filePath: string, scriptName: string) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (packageJson.scripts && packageJson.scripts[scriptName]) {
      delete packageJson.scripts[scriptName];
      fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2), "utf8");
      console.log(`Removed script "${scriptName}" from ${filePath}`);
    } else {
      console.log(`Script "${scriptName}" not found in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${(error as Error).message}`);
  }
}

export function modifyYarnScript(filePath: string, scriptName: string, newScriptCommand: string) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (packageJson.scripts && packageJson.scripts[scriptName]) {
      packageJson.scripts[scriptName] = newScriptCommand;
      fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2), "utf8");
      console.log(`Modified script "${scriptName}" in ${filePath}`);
    } else {
      console.log(`Script "${scriptName}" not found in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${(error as Error).message}`);
  }
}

export function replaceInYarnScript(filePath: string, scriptName: string, searchValue: string, replaceValue: string) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (packageJson.scripts && packageJson.scripts[scriptName]) {
      packageJson.scripts[scriptName] = packageJson.scripts[scriptName].replace(
        new RegExp(searchValue, "g"),
        replaceValue
      );
      fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2), "utf8");
      console.log(`Replaced "${searchValue}" with "${replaceValue}" in script "${scriptName}" in ${filePath}`);
    } else {
      console.log(`Script "${scriptName}" not found in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${(error as Error).message}`);
  }
}

export function modifyJestCollectCoverageFrom(filePath: string) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (packageJson.jest && packageJson.jest.collectCoverageFrom) {
      packageJson.jest.collectCoverageFrom = packageJson.jest.collectCoverageFrom.map((pattern: string) =>
        pattern.replace(/\.js/g, ".ts")
      );
      fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2), "utf8");
      console.log(`Modified jest.collectCoverageFrom in ${filePath}`);
    } else {
      console.log(`jest.collectCoverageFrom not found in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${(error as Error).message}`);
  }
}
