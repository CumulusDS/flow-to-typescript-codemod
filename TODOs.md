## Notes: TODOs

1. [&cross;] Handle yarn script test 
    ```bash
    "test": "yarn build && yarn test:flow && yarn test:flow:coverage-report && yarn test:flow:status && yarn test:jest",
    ```
2. [&check;] tsconfig require "jsx": "react" compiler option to support import from .tsx extensions
3. [-] replace .js with .ts in package.json
    ```json
    "coveragePathIgnorePatterns": [
      "<rootDir>/src/index.ts"
    ],
    "verbose": true,
    "testEnvironment": "node",
    "setupFiles": [
      "<rootDir>/test/setup.ts"
    ],
    ```
4. [&check;] Skip generated types to be included in the build prepack step to avoid duplication
    ```bash
    "build:flowtypes": "find lib -type f -name '*.d.ts' ! -path 'lib/src/types/generated/*' -exec sh -c 'yarn flowgen --add-flow-header --no-inexact $1 -o ${1%.*.*}.js.flow' _ '{}' \\;"
    ```
5. [ ] 