import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export function printBuilderResult(context: BuilderContext, jobName: string) {
  return (source: Observable<BuilderOutput>): Observable<BuilderOutput> =>
    source.pipe(
      catchError((error) => {
        return of({
          success: false,
          error: `Error executing "${jobName}": ${error?.message || 'Unknown Error.'}`,
        });
      }),
      tap(({ success, error }) => {
        if (success !== true) {
          context.logger.error(error);
        } else {
          context.logger.info(`Finished "${jobName}" for ${context.target.project}`);
        }
      }),
    );
}
