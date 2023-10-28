module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    '@kovsu/eslint-config-ts',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  overrides: [
    {
      files: ['**/*.json'],
      extends: ['@kovsu/eslint-config-ts'],
      rules: {
        "quote-props": "off",
        "@typescript-eslint/comma-dangle": "off",
        "@typescript-eslint/semi": "off",
      }
    },
    {
      files: ['**/*.yml'],
      extends: ['@kovsu/eslint-config-ts'],
    }
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
