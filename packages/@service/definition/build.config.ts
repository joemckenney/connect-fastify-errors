import path from 'node:path';
import url from 'node:url';
import { defineBuildConfig } from 'unbuild';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  rollup: {
    inlineDependencies: true,
    emitCJS: true,
    esbuild: {
      target: 'ESNext',
      minify: true,
    },
  },
  declaration: true,
});
