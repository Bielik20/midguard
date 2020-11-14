'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.printBuilderResult = void 0;
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
function printBuilderResult(context, jobName) {
  return function (source) {
    return source.pipe(
      operators_1.catchError(function (error) {
        return rxjs_1.of({
          success: false,
          error:
            'Error executing "' +
            jobName +
            '": ' +
            ((error === null || error === void 0 ? void 0 : error.message) || 'Unknown Error.'),
        });
      }),
      operators_1.tap(function (_a) {
        var success = _a.success,
          error = _a.error;
        if (success !== true) {
          context.logger.error(error);
        } else {
          context.logger.info('Finished "' + jobName + '" for ' + context.target.project);
        }
      }),
    );
  };
}
exports.printBuilderResult = printBuilderResult;
