import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { from } from 'rxjs';
import { printBuilderResult } from '../../utils/print-builder-result';
import { log, spawnProcess } from '../../utils/spawn-process';

export default createBuilder((options: unknown, context: BuilderContext) => {
  context.logger.info(`Executing "npm-publish" for ${context.target.project}`);

  return from(npmPublishBuilder(options, context)).pipe(printBuilderResult(context, 'npm-publish'));
});

async function npmPublishBuilder(options: unknown, context: BuilderContext): Promise<BuilderOutput> {
  const outputPath = await getOutputPath(context);

  await spawnProcess('npm', ['publish'], { cwd: outputPath }).pipe(log(context)).toPromise();

  return {
    success: true,
  };
}

async function getOutputPath(context: BuilderContext): Promise<string> {
  const options = await context.getTargetOptions({
    project: context.target.project,
    target: 'build',
  });

  return options.outputPath as string;
}
