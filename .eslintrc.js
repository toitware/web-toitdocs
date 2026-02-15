module.exports = {
  root: true,
  extends: [
    "react-app",
    "react-app/jest"
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/await-thenable": "off",
    "@typescript-eslint/no-non-null-assertion": "off"
  }
};
