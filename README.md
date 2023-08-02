## Steps to repro

```
git clone git@github.com:joemckenney/connect-fastify-errors.git;
cd connect-fastify-errors;
fnm use;
pnpm i;
pnpm build;
cd packages/@service/api;
pnpm run dev;


## In a separate terminal/tab from top of repo

cd packages/@service/api;
pnpm run test;
```
