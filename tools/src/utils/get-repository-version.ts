import { data, spawnProcess } from './spawn-process';

export function getRepositoryVersion(): Promise<string> {
  return spawnProcess('git', ['describe', '--tags', '--abbrev=0']).pipe(data()).toPromise();
}
