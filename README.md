## Steps to repro

```
git clone git@github.com:joemckenney/fern-node-esm-bug-reproduction.git;
pnpm i;
cd packages/@dopt/blocks/javascript-node-client;
pnpm build;
cd ../../../../;
pnpm run build;
pnpm run run;
```
