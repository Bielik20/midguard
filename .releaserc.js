module.exports = {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github',
    [
      '@semantic-release/exec',
      {
        prepareCmd:
          'yarn nx affected --base c769805 --target=version --with-deps --pkgVersion ${nextRelease.version}' +
          ' && ' +
          'yarn nx affected --base c769805 --target=build --with-deps --prod --buildLibsFromSource',
        publishCmd: 'yarn nx affected --base c769805 --target=deploy --with-deps',
      },
    ],
  ],
};
