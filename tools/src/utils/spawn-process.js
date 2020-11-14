'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.data = exports.log = exports.spawnProcess = void 0;
var childProcess = require('child_process');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
function spawnProcess(command, args, options) {
  var child = childProcess.spawn(command, args, options);
  return new rxjs_1.Observable(function (observer) {
    child.stdout.on('data', function (data) {
      observer.next({ type: 'OUT', data: data });
    });
    child.stderr.on('data', function (data) {
      observer.next({ type: 'ERR', data: data });
    });
    child.on('close', function (code) {
      if (code === 0) {
        observer.complete();
      } else {
        observer.error();
      }
    });
  });
}
exports.spawnProcess = spawnProcess;
function log(context) {
  return function (source) {
    return source.pipe(
      operators_1.tap(function (_a) {
        var type = _a.type,
          data = _a.data;
        if (type === 'OUT') {
          context.logger.info(data.toString());
        } else {
          context.logger.error(data.toString());
        }
      }),
    );
  };
}
exports.log = log;
function data() {
  return function (source) {
    return source.pipe(
      operators_1.map(function (_a) {
        var data = _a.data;
        return data.toString().trim();
      }),
    );
  };
}
exports.data = data;
