import { readJsonFile } from '@nrwl/workspace';
import { appRootPath } from '@nrwl/workspace/src/utils/app-root';

export function readPackageJson(): any {
  return readJsonFile(`${appRootPath}/package.json`);
}
