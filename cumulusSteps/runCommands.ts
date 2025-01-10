/* eslint-disable no-console */
import { exec } from "child_process";

export function runCommands(commands: string[]) {
  commands.forEach((command) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command "${command}": ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr for command "${command}": ${stderr}`);
        return;
      }
      console.log(`stdout for command "${command}": ${stdout}`);
    });
  });
}
