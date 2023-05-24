module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {
        jest: true,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    semi: 0,
    'no-param-reassign': [2, { props: false }],
    'max-classes-per-file': 0,
    'no-param-reassign': 0,
    'import/no-cycle': 0,
    'operator-linebreak': 0,
    curly: [2, 'multi-or-nest', 'consistent'],
    'max-len': [2, { code: 100 }],
    'nonblock-statement-body-position': [2, 'any'],
  },
}
