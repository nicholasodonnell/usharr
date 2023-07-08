module.exports = {
  root: true,
  extends: [
    '@usharr/custom/base',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: [
    'react',
    'react-hooks',
  ],
  rules: {
    'prettier/prettier': ['error'],
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 0,
    'react/display-name': 'off',
    'react/jsx-curly-spacing': [ 'error', { 'children': true } ],
    'react/jsx-no-undef': 'error',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/no-unescaped-entities': [ 'error', { 'forbid': [ '>', '"', '}' ] } ],
    'react/prop-types': 'off',
    'react/self-closing-comp': [ 'error', { 'component': true, 'html': true } ]
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    es6: true,
    browser: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
