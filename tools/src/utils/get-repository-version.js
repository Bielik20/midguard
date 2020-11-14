'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getRepositoryVersion = void 0;
var spawn_process_1 = require('./spawn-process');
function getRepositoryVersion() {
  return spawn_process_1
    .spawnProcess('git', ['describe', '--tags', '--abbrev=0'])
    .pipe(spawn_process_1.data())
    .toPromise();
}
exports.getRepositoryVersion = getRepositoryVersion;
