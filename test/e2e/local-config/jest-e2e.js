const common = require('../common-config/common-jest-config');

module.exports = {
  ...common,
  "testTimeout": 30000,
  "preset": "ts-jest",
  "rootDir": "../../..",
  "testRegex": ".e2e-spec.ts$",
  "setupFiles": [
    "./test/e2e/local-config/setupEnv.js"
  ],
  "globals": {
    "ts-jest": {
      "diagnostics": false,
      "compiler": "ttypescript"
    }
  }
}
