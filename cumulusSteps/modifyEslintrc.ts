/* eslint-disable no-console */
import * as fs from "fs";

export function modifyEslintConfig(filePath: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const eslintConfig = require(filePath);

    // Add rule to suppress error from airbnb-base requiring extensions for non-js imports
    eslintConfig.rules = {
      ...eslintConfig.rules,
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never",
        },
      ],
    };

    // Add settings to disable airbnb rule about extensions
    eslintConfig.settings = {
      ...eslintConfig.settings,
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    };

    // update plugins to include typescript and remove flowtype
    eslintConfig.plugins = eslintConfig.plugins.filter((plugin: string) => plugin !== "flowtype");
    eslintConfig.plugins.push("@typescript-eslint");

    const updatedContent = `module.exports = ${JSON.stringify(eslintConfig, null, 2)};`;
    fs.writeFileSync(filePath, updatedContent, "utf8");
    console.log(`Modified ${filePath} to include suggested changes.`);
  } catch (error) {
    throw new Error(`Error processing file ${filePath}: ${(error as Error).message}`);
  }
}
