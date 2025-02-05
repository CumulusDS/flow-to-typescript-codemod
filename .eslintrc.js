module.exports = {
  root: true,
  extends: ["plugin:@typescript-eslint/eslint-recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  plugins: ["jest", "@typescript-eslint", "prettier"],
  env: {
    jest: true,
  },
  rules: {
    "no-console": "error",
    "no-plusplus": "off",
    "default-case": "off",
    "no-inner-declarations": "off",
    "no-restricted-syntax": "off",
    "no-shadow": "off",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "no-param-reassign": "off",
    "no-continue": "off",
    "no-nested-ternary": "off",
    "prettier/prettier": ["error", { printWidth: 120 }],
    "prefer-destructuring": [
      "error",
      {
        array: false,
        object: true,
      },
    ],
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
  },
  ignorePatterns: [
    "src/fix/fix-type-exports/__test__/test-input.ts",
    "src/test/test-files/*",
    "src/fix/suppressions/__test__/test-input.ts",
  ],
  overrides: [
    {
      files: ["cumulusSteps/**/*.ts"],
      rules: {
        "no-unused-vars": "off",
        "no-use-before-define": "off",
        "no-shadow": "off",
      },
    },
  ],
};
