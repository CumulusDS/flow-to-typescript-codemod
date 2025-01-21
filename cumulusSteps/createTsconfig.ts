/* eslint-disable no-console */
import * as fs from "fs";

export const tsConfigContent = {
  compilerOptions: {
    target: "ES2022",
    declaration: true,
    module: "commonjs",
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    outDir: "lib",
    jsx: "react",
  },
  include: ["src"],
};

export function createTsConfigFile(filePath: string) {
  const jsonContent = JSON.stringify(tsConfigContent, null, 2);
  fs.writeFileSync(filePath, jsonContent, "utf8");
  console.log(`tsconfig.json has been created at ${filePath}`);
}
