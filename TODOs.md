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
5. [&cross;] __mocks__ folders are not handled in conversion by default. For jest, sometimes there are mock files sitting in the src folder 
6. [&cross;] following changes to tsconfig.json could help in some deeper type resolutions from cumulus packages
    ```json
    "module": "NodeNext", // Specify module code generation
    "moduleResolution": "nodenext",
    ```
7. [&cross;] serverless support
    - Add plugin "serverless-esbuild": "^1.54.6",
    - If monorepo add "serverless-plugin-monorepo": "^0.11.0",
    - remove serverless-webpack
    - In serverless.yml
      - add serverless-esbuild, serverless-plugin-monorepo to plugins
      - remove serverless-webpack from plugins
      - under package add aws-sdk v2 node_modules
        ```
        package:
          individually: true
        include:
          - node_modules/aws-sdk/**
          - node_modules/xml/**
          - node_modules/xml2js/**
          - node_modules/xmlbuilder/**
        ```
      - under custom add esbuild config
        ```
        esbuild:
          platform: "node"
          concurrency: 10
          keepOutputDirectory: false # set to true for debugging
        ```