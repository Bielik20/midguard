'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var tslib_1 = require('tslib');
var architect_1 = require('@angular-devkit/architect');
var rxjs_1 = require('rxjs');
var print_builder_result_1 = require('../../utils/print-builder-result');
exports.default = architect_1.createBuilder(function (options, context) {
  context.logger.info('Executing "npm-publish" for ' + context.target.project);
  return rxjs_1
    .from(npmPublishBuilder(options, context))
    .pipe(print_builder_result_1.printBuilderResult(context, 'npm-publish'));
});
function npmPublishBuilder(options, context) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    var outputPath;
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4, getOutputPath(context)];
        case 1:
          outputPath = _a.sent();
          console.log(options);
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
