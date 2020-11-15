'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var tslib_1 = require('tslib');
var architect_1 = require('@angular-devkit/architect');
var rxjs_1 = require('rxjs');
var print_builder_result_1 = require('../../utils/print-builder-result');
var spawn_process_1 = require('../../utils/spawn-process');
exports.default = architect_1.createBuilder(function (options, context) {
  context.logger.info('Executing "npm-publish" for ' + context.target.project);
  return rxjs_1
    .from(npmPublishBuilder(options, context))
    .pipe(print_builder_result_1.printBuilderResult(context, 'npm-publish'));
});
function npmPublishBuilder(options, context) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    var token, outputPath, npmrc;
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          token = getNpmToken(options);
          return [4, getOutputPath(context)];
        case 1:
          outputPath = _a.sent();
          npmrc = generateNpmrc(token);
          return [4, spawn_process_1.spawnProcess('rm', ['-f', '.npmrc'], { cwd: outputPath }).toPromise()];
        case 2:
          _a.sent();
          return [
            4,
            spawn_process_1
              .spawnProcess('echo', ['"' + npmrc + '" >> .npmrc'], {
                cwd: outputPath,
                shell: true,
              })
              .toPromise(),
          ];
        case 3:
          _a.sent();
          return [
            4,
            spawn_process_1
              .spawnProcess('npm', ['publish', '--access public'], { cwd: outputPath })
              .pipe(spawn_process_1.log(context))
              .toPromise(),
          ];
        case 4:
          _a.sent();
          return [
            2,
            {
              success: true,
            },
          ];
      }
    });
  });
}
function getOutputPath(context) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    var options;
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4,
            context.getTargetOptions({
              project: context.target.project,
              target: 'build',
            }),
          ];
        case 1:
          options = _a.sent();
          return [2, options.outputPath];
      }
    });
  });
}
function getNpmToken(options) {
  var token = options.npmToken || process.env.NPM_TOKEN;
  if (!token) {
    throw new Error('npmToken was not provided as an arg nor is it present in env.');
  }
  return token;
}
function generateNpmrc(npmToken) {
  return (
    '\nregistry=http://registry.npmjs.org/\n//registry.npmjs.org/:_authToken=' +
    npmToken +
    '\n@midguard:registry=https://registry.npmjs.org/\n'
  ).trim();
}
