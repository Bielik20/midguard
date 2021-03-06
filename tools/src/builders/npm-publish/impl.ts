import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { from } from 'rxjs';
import { printBuilderResult } from '../../utils/print-builder-result';
import { log, spawnProcess } from '../../utils/spawn-process';
import { json } from '@angular-devkit/core';

interface Options extends json.JsonObject {
  npmToken: string;
}

export default createBuilder((options: Options, context: BuilderContext) => {
  context.logger.info(`Executing "npm-publish" for ${context.target.project}`);

  return from(npmPublishBuilder(options, context)).pipe(printBuilderResult(context, 'npm-publish'));
});

async function npmPublishBuilder(options: Options, context: BuilderContext): Promise<BuilderOutput> {
  const token = getNpmToken(options);
  const outputPath = await getOutputPath(context);
  const npmrc = generateNpmrc(token);

  await spawnProcess('rm', ['-f', '.npmrc'], { cwd: outputPath }).toPromise();
  await spawnProcess('echo', [`"${npmrc}" >> .npmrc`], {
    cwd: outputPath,
    shell: true,
  }).toPromise();
  await spawnProcess('npm', ['publish', '--access public'], { cwd: outputPath }).pipe(log(context)).toPromise();

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

function getNpmToken(options: Options): string {
  const token = options.npmToken || process.env.NPM_TOKEN;

  if (!token) {
    throw new Error('npmToken was not provided as an arg nor is it present in env.');
  }

  return token;
}

function generateNpmrc(npmToken: string): string {
  return `
registry=http://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${npmToken}
@midguard:registry=https://registry.npmjs.org/
`.trim();
}
