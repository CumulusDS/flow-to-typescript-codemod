export const migrationReportFormats = ["json", "csv", "stdout"] as const;
export type MigrationReportFormat = (typeof migrationReportFormats)[number];

export interface SharedCommandCliArgs {
  // The format the migration reporter should use
  format: MigrationReportFormat;
  // Where to save the reporter (if using JSON formatting)
  output: string;
  // Disable logging to stdout
  silent: boolean;
}

export interface SetupCommandCliArgs extends SharedCommandCliArgs {
  // Whether or not to install typescript
  installTS: boolean;
  // Whether or not to setup a TSConfig
  setupTSConfig: boolean;
  // Whether or not we should recommend type definitions to install
  recommendTypeDefinitions: boolean;
  // The source path to run against
  path: string;
}

export interface ConvertCommandCliArgs extends SharedCommandCliArgs {
  // The source path to run against
  path: Array<string>;
  // Should a watermark be added to output typescript files
  watermark: boolean;
  // The topline tag used in the watermark. Only used if watermark is enabled
  tag: string;
  // The message block comment used under the tag. Only used if watermark is enabled.
  message: string;
  // delete old flow files.
  delete: boolean;
  // By default, typescriptify will run against the code and output a report of the  results. Enabling write will actually write ts/tsx files
  write: boolean;
  // Change the output dir of the codemod:
  target: string;
  // Flow has a deprecated 'Object' type that translates to any. This flag will take the semantic meaning of any object when set
  useStrictAnyObjectType: boolean;
  // Flow has a deprecated 'Function' type that translates to any. This flag will take the semantic meaning of any function when set
  useStrictAnyFunctionType: boolean;
  // Remove `.js` and `.jsx` file extensions which will change
  dropImportExtensions: boolean;
  // Add support for spread props on React Components
  handleSpreadReactProps: boolean;
  // Don't replace all $ with .
  keepPrivateTypes: boolean;
  // Array of directories or files to ignore
  ignore: Array<string>;
  // Force all file extensions to end in tsx
  forceTSX: boolean;
  // Skip renaming @noflow annotated files
  skipNoFlow: boolean;
  // Disable Flow inference for performance
  disableFlow: boolean;
  // Strip paths when passing them to ignore to allow relative/parent directories
  stripPathsForIgnore: boolean;
  // Convert flow files with no annotations as no-Flow files
  convertUnannotated: boolean;
}

export interface FixCommandCliArgs extends SharedCommandCliArgs {
  // Check for cases where props were passed to a React component that were not defined'
  tsProps: boolean;
  // Auto suppress any TypeScript errors with a ts-expect-error comment
  autoSuppressErrors: boolean;
  // Auto import missing types using typescript
  autoImport: boolean;
  // Experimental: Fix exported types to use type-only exports.
  fixTypeExports: boolean;
  // Generate a report of TypeScript errors.
  generateReport: boolean;
  // This slug will be appended to the ts-expect-error
  jiraSlug: string;
  // Use ts-ignore instead of ts-expect-error
  useIgnore: boolean;
  // Remove unused ts-expect-error
  removeUnused: boolean;
  // Path to tsconfig to use for report or error suppression
  config: string;
}

export const DEFAULT_WATERMARK_TAG = "@typescriptify";
export const DEFAULT_WATERMARK_MESSAGE = `
THIS FILE IS AUTOMATICALLY GENERATED. Do not edit this file.
If you want to manually write flow types for this file,
remove the @typescriptify annotation and this comment block.
`;
