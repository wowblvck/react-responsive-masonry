module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
    "jest/globals": true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  parser: "@typescript-eslint/parser",
  plugins: ["jest", "@typescript-eslint"],
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "no-control-regex": 0,
    "react/prop-types": "off",
    "react/display-name": "off",
  },
}
