module.exports = {
  extends: ['.eslintrc'],
  parserOptions: {
    // disable rules that depend on type information - these would slow down git committing too much, rather rely on PR branch builds for these
    project: null,
  },
  rules: {
    '@typescript-eslint/tslint/config': 'off',
  },
};
