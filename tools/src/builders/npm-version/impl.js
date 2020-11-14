'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var tslib_1 = require('tslib');
var architect_1 = require('@angular-devkit/architect');
var rxjs_1 = require('rxjs');
var get_repository_version_1 = require('../../utils/get-repository-version');
var print_builder_result_1 = require('../../utils/print-builder-result');
var spawn_process_1 = require('../../utils/spawn-process');
exports.default = architect_1.createBuilder(function (options, context) {
  context.logger.info('Executing "npm-version" for ' + context.target.project);
  return rxjs_1
    .from(npmVersionBuilder(options, context))
    .pipe(print_builder_result_1.printBuilderResult(context, 'npm-version'));
});
function npmVersionBuilder(options, context) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    var root, version, _a;
    return tslib_1.__generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4, getRoot(context)];
        case 1:
          root = _b.sent();
          _a = options.pkgVersion;
          if (_a) return [3, 3];
          return [4, get_repository_version_1.getRepositoryVersion()];
        case 2:
          _a = _b.sent();
          _b.label = 3;
        case 3:
          version = _a;
          return [
            4,
            spawn_process_1
              .spawnProcess('npm', ['version', version], { cwd: root })
              .pipe(spawn_process_1.log(context))
              .toPromise(),
          ];
        case 4:
          _b.sent();
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
function getRoot(context) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    var metadata;
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4, context.getProjectMetadata(context.target.project)];
        case 1:
          metadata = _a.sent();
          return [2, metadata.root];
      }
    });
  });
}
