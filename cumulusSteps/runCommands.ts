/* eslint-disable no-console */
import { exec } from "child_process";
import path from "path";

export function runCommands(targetRepoPath: string, commands: string[]) {
  commands.forEach((command) => {
    exec(command, { cwd: path.resolve(targetRepoPath) }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command "${command}" in "${targetRepoPath}": ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr for command "${command}" in "${targetRepoPath}": ${stderr}`);
        return;
      }
      console.log(`stdout for command "${command}" in "${targetRepoPath}": ${stdout}`);
    });
  });
}
