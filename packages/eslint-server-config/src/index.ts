module.exports = {
    plugins: ['@typescript-eslint/eslint-plugin', 'unused-imports', 'import'],
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    env: {
      node: true,
      jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'unused-imports/no-unused-imports-ts': 2,
      'import/order': [
        'error',
        {
          'groups': [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always'
        }
      ]
    },
}