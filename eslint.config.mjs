export default {
  env: {
    browser: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier", "jsdoc"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "no-unused-vars": "warn",
    "no-undef": "warn",
    camelcase: ["error", { properties: "always" }],
    "prettier/prettier": "error",
    "jsdoc/check-tag-names": "error",
    "jsdoc/require-description": "error",
  },
};
