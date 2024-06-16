module.exports = {
  rules: {
    'no-unused-expressions': 'error',
    'no-unused-vars': 'error',
    'callback-return': 0,
    'complexity': ['warn', 6],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: ['export', 'return', 'function'],
      },
    ],
  },
};
