/* eslint-disable no-console */
import * as fs from "fs";

export function replaceTextInFile(filePath: string, searchValue: string, replaceValue: string) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const updatedContent = fileContent.replace(new RegExp(searchValue, "g"), replaceValue);
    fs.writeFileSync(filePath, updatedContent, "utf8");
    console.log(`Replaced "${searchValue}" with "${replaceValue}" in ${filePath}`);
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${(error as Error).message}`);
  }
}
