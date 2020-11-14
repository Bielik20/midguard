'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.readPackageJson = void 0;
var workspace_1 = require('@nrwl/workspace');
var app_root_1 = require('@nrwl/workspace/src/utils/app-root');
function readPackageJson() {
  return workspace_1.readJsonFile(app_root_1.appRootPath + '/package.json');
}
exports.readPackageJson = readPackageJson;
