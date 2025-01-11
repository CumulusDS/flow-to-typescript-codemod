## Steps for migrating an existing flow repo to typescript

### :bell: verify the target repo's build is clean

Avoid touching projects with failing builds. 

### :bell: merge or close any open PR's

The PR's will likely have a significant number of conflicts post conversion so it's best to merge them or close them if they are over a year old.

### :bell: confirm that the package is still used

There's a lot of GitHub repos here that are no longer used or are planned for imminent retirement. Avoid doing any work in repos that will just be deleted anyway.

### :bell: clone the codemod tool and build the project

Clone this [repo](https://github.com/cumulusds/flow-to-typescript-codemod) and run yarn install.

### :bell: Clone the target repo and create a branch off of master

### :bell: Run the typescriptify script

Note that this is run from the flow-to-typescript-codemod project and assumes that the target repo is a sibling directory.

```bash
yarn typescriptify convert -p ../<target-repo-path> --write --delete
```

### :bell: Add the newly created .ts files to Git so they're part of the commit

### :bell: Run cumulus specific steps
```bash
yarn cumulusify -t ../cerebro
``` 

## Manual Steps for reference
<details>
  <summary>Click to expand</summary>

### :bell: add a tsconfig.json file to the target repo

we don't have a standard tsconfig.json checked in anywhere. This one is a reasonable start:

```json
{
  "compilerOptions": {
    "target": "ES2022", // Specify ECMAScript target version
    "declaration": true,
    "module": "commonjs", // Specify module code generation
    "strict": true, // Enable all strict type-checking options
    "esModuleInterop": true, // Emit additional JavaScript to ease importing CommonJS modules
    "skipLibCheck": true, // Skip type checking of declaration files
    "forceConsistentCasingInFileNames": true, // Ensure consistent casing in file names
    "outDir": "lib",
  },
  "include": ["src"]
}
```

### :bell: add the `typescript` dependency to the target repo

```bash
yarn add typescript --dev
```

### :bell: remove flow artifacts

```bash
rm -rf flow-typed
rm -f .flowconfig
```

### :bell: update babel config

- replace `@babel/preset-flow` with `@babel/preset-typescript` in .babelrc.js
- remove babel old dependencies
```bash
yarn remove @babel/preset-flow babel-eslint
```
- add new dependencies
```bash
yarn add @babel/preset-typescript --dev
```

### :bell: update eslint config
- bump eslint version to `^8.57.1`
```bash
yarn add @typescript-eslint/eslint-plugin @typescript-eslint/parser --dev
```
- replace `plugin:flowtype/recommended`with `plugin:@typescript-eslint/recommended` in .eslintrc.js
- add rule to suppress error from airbnb-base requiring extensions for non-js imports
```javascript
   rules: {
    // .... other rules
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
   }
```
- add settings to disable airbnb rule about extensions
```javascript
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
```
- replace `flowtype` with `@typescript-eslint` in `plugins`

### :bell: Update Scripts
- add or update `build` script to include `tsc` and remove any mention of `flow`
- add a new build script for flow gen to generate flow types from .d.ts files
```json
    "build:flowtypes": "find lib -type f -name '*.d.ts' -exec sh -c 'yarn flowgen --add-flow-header --no-inexact $1 -o ${1%.*.*}.js.flow' _ '{}' \\;",
```
- add or update `prepack` to run the build and the new `build:flowtypes`. I've opted to not build the flow types as part of the regular build since it's slow. The build is deferred until we're cutting a release for the package.
```json
    "prepack": "yarn run build && yarn run build:flowtypes",
```
- add dummy "flow" script like so (necessary until GitHub workflows are updated)
```json
    "flow": "echo \"not a flow project\"",
```
- remove test:flow
- remove test:flow:coverage-report
- remove test:flow:status
- update test:lint to target `*.ts` files (not sure why we don't just run with `.` and let the config decide what gets listed
- update test:prettier to include checks on `.ts` and `.tsx` files

### :bell: Jest Coverage
- update collectCoverageFrom to target "src/**/*.ts" files

### :bell: Dev Dependencies

```bash
yarn remove @cumulusds/flow-aws-sdk
```
```bash
yarn remove flow-bin
```
```bash
yarn remove flow-copy-source
```
```bash
yarn remove flow-typed
```
- add `@types/aws-lambda` if necessary
```bash
yarn add @types/jest --dev
```
```bash
yarn add flowgen --dev
```
```bash
yarn add eslint-plugin-import --dev
```
- update `prettier` to `^3.3.3`
- update `eslint-config-prettier` to ^8.10.0
- update `eslint-plugin-prettier` to ^5.2.1

</details>

## Verification
### :bell: Review each source file for error/warning markers
- some projects may need additional dependencies added for types

### :bell: Run the build and tests before committing and creating a PR
- `yarn build`
- `yarn test`
- `yarn prepack`

### :bell: Confirm that you see `.flow` files in the `lib` folder

### :checkered_flag: Commit / Push / Create a PR