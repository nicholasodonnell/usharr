module.exports = {
  root: true,
  extends: [
    '@usharr/custom/base'
  ],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  ignorePatterns: [
    'node_modules/*',
    'dist/*',
    'prettier.config.js',
  ]
}
