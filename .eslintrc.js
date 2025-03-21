module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    quotes: [2, 'single', { avoidEscape: true }],
    'object-curly-newline': [
      'error',
      {
        ObjectPattern: 'always',
      },
    ],
    'no-underscore-dangle': [
      'error',
      {
        allow: ['_id'], // Allow _id to be used
      },
    ],
  },
};
