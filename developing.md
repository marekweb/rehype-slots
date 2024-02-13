## Developing rehype-slots

This is [TypeScript](https://www.typescriptlang.org/) project that is packaged
as an ESM module.

The project is divided into three submodules:

- `hast-util-slots` is the utility that does the actual slot replacement on a
  HAST tree.
- `rehype-slots` is the rehype plugin that uses `hast-util-slots` to replace
  slots in a HAST tree.
- `test` is the submodule with tests for everything.

The submodules use
[TypeScript project references](https://www.typescriptlang.org/docs/handbook/project-references.html).
This means that when you run `npm run build` in the root directory, it will
build the submodules in the correct order.

**To build** and bundle the project, run `npm run build` and the output will be
in the `dist` directory.

**To run the checks** (eslint for linting, prettier for formatting) run
`npm run check`.

**To automatically fix issues with the checks** run `npm run fix` which will run
eslint and prettier in fix mode to attempt to automatically fix all possible
issues.

The project uses esbuild to bundle the code into one file, and it uses the
TypeScript compiler to build the main type definitions file and the type
definitions for all of the files.

Note that because the project uses TypeScript's `tsc --build` mode, it doesn't
have a command to just do type checking without emitting. It needs to emit type
definitions in order to build each submodule independently.

To run the tests, run `npm test`. The test runner is
[node's built-in test runner](https://nodejs.org/api/test.html) and
[built-in assert module](https://nodejs.org/api/assert.html). The tests run
using [tsx](https://github.com/privatenumber/tsx).
