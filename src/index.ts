import 'dotenv/config';
import readlineSync from 'readline-sync';
import bodyParser from 'body-parser';
import { createRock, saveRockOutput } from './lib/rockUtils.js';
import cache from './cache.js';
import { PrismaClient } from '@prisma/client';
import { afterStart } from './lib/afterStart.js';
import logger from './lib/logger.js';
import { router } from './lib/routes.js';
import express from 'express';
export const app = express();
export const DBClient = new PrismaClient();
async function main() {
	app.use(bodyParser.urlencoded());
	const port = Number(process.env.PORT) || 3000;
	createRock();
	const tempCode = `Shout "Hello World"!\npapa was a rolling stone\npapa was a brand new bag\nx is 2\nShout x\nLet my array at 0 be "foo"\nLet my array at 1 be "bar"\nLet my array at 2 be "baz"\nLet my array at "key" be "value"\nShout my array at 0\nShout my array at 1\nShout my array at 2\nShout my array at "key"\nShout my array\nGive back 1\n`;
	const ast = cache.interpreter.parse(tempCode);
	cache.interpreter.run(ast, readlineSync, (output: string) => saveRockOutput(output, cache.numOfRocks), cache.numOfRocks);
	cache.rocks[cache.numOfRocks].code = tempCode;
	cache.numOfRocks++;
	// Load certain rocks from cache
	const afterStartClass = new afterStart(DBClient);
	await afterStartClass.initialLoadFromCache();

	const routerManager = new router();
	routerManager.load();
	routerManager.register();
	app.listen(port, () => {
		logger.info('WEBSERVER', `listening on ${port}`);
	});
}
try {
	(async () => {
		await DBClient.$connect();
		logger.info('DB', 'Connected!');
		cache.dbConnected = true;
		await main();
	})();
} catch (e) {
	logger.error(`FATAL`, String(e));
	DBClient.$disconnect();
	process.exit(1);
}
