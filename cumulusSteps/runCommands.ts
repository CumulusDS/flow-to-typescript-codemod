/* eslint-disable no-console */
import { spawn } from "child_process";
import path from "path";

export async function runCommands(targetRepoPath: string, commands: string[]) {
  for (const command of commands) {
    await new Promise<void>((resolve, reject) => {
      const [cmd, ...args] = command.split(" ");
      const child = spawn(cmd, args, {
        cwd: path.resolve(targetRepoPath),
        shell: true,
        stdio: "inherit", // Inherit stdio to capture output in real-time
      });

      child.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Command "${command}" failed with exit code ${code}`));
        } else {
          resolve();
        }
      });

      child.on("error", (error) => {
        reject(new Error(`Error executing command "${command}": ${error.message}`));
      });
    });
  }
}
