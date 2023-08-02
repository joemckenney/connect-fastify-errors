SHELL := /bin/bash

dev: export NODE_ENV=development
dev: 
	pnpm exec concurrently -k -p -r \
		"tsup-node src/index.ts --format esm --watch" \
		"dotenv-flow -- node --watch ./dist/index.mjs | pino-pretty -i time,hostname,pid";
 
