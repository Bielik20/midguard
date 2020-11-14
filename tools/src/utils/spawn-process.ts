import { BuilderContext } from '@angular-devkit/architect';
import { SpawnOptions } from 'child_process';
import * as childProcess from 'child_process';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

interface ProcessOutput {
  data: Buffer | string;
  type: 'ERR' | 'OUT';
}

export function spawnProcess(command: string, args?: string[], options?: SpawnOptions): Observable<ProcessOutput> {
  const child = childProcess.spawn(command, args, options);

  return new Observable<ProcessOutput>((observer) => {
    child.stdout.on('data', (data) => {
      observer.next({ type: 'OUT', data });
    });
    child.stderr.on('data', (data) => {
      observer.next({ type: 'ERR', data });
    });
    child.on('close', (code) => {
      if (code === 0) {
        observer.complete();
      } else {
        observer.error();
      }
    });
  });
}

export function log(context: BuilderContext) {
  return (source: Observable<ProcessOutput>): Observable<ProcessOutput> =>
    source.pipe(
      tap(({ type, data }) => {
        if (type === 'OUT') {
          context.logger.info(data.toString());
        } else {
          context.logger.error(data.toString());
        }
      }),
    );
}

export function data() {
  return (source: Observable<ProcessOutput>): Observable<string> =>
    source.pipe(map(({ data }) => data.toString().trim()));
}
