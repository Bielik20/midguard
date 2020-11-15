module.exports = {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github',
    [
      '@semantic-release/exec',
      {
        prepareCmd:
          'yarn nx affected --parallel --base ${lastRelease.gitHead} --target=version --with-deps --pkgVersion ${nextRelease.version}' +
          ' && ' +
          'yarn nx affected --parallel --base ${lastRelease.gitHead} --target=build --with-deps --prod --buildLibsFromSource',
        publishCmd: 'yarn nx affected --parallel --base ${lastRelease.gitHead} --target=deploy --with-deps',
      },
    ],
  ],
  branches: [
    { name: 'master' },
    { name: 'beta/*', prerelease: '${name.replace(/^beta\\//g, "")}' },
    { name: 'develop', prerelease: 'dev' },
    { name: 'testing', prerelease: 'rc' },
  ],
};
