import cache from '#main/cache';
import { DBClient } from '#main/index';
import logger from '#main/lib/logger';
import { createRock, saveRockOutput } from '#main/lib/rockUtils';
import type { routeData } from '#main/types/routes';
import type { Request, Response } from 'express';
import readlineSync from 'readline-sync';

const data: routeData = {
	path: '/compile/',
	POST: async function (req: Request, res: Response) {
		try {
			const dateClass = new Date();
			const date = `${dateClass.getDate()}_${dateClass.getMonth() + 1}_${dateClass.getFullYear()}`;
			const codeEncoded = req.body.code;
			const code = `${decodeURIComponent(codeEncoded).replaceAll('\\n', '\n')}\n`;
			createRock();
			const ast = cache.interpreter.parse(code);
			cache.interpreter.run(ast, readlineSync, (output: string) => saveRockOutput(output, cache.numOfRocks), cache.numOfRocks);
			cache.rocks[cache.numOfRocks].code = code;
			// Save to DB
			const session = await DBClient.session.upsert({
				where: {
					humanReadableDate: date
				},
				update: {},
				create: {
					humanReadableDate: date
				}
			});
			await DBClient.rock.create({
				data: {
					code: code,
					humanReadableId: cache.numOfRocks,
					sessionId: session.id,
					uniqueId: `${date}-${cache.numOfRocks}`
				}
			});
			const responseData = {
				id: cache.numOfRocks,
				status: 'success',
				code: code,
				log: cache.rocks[cache.numOfRocks].log,
				output: cache.rocks[cache.numOfRocks].output
			};
			res.send(responseData);
			cache.numOfRocks++;
		} catch (e) {
			const responseData = {
				status: 'error',
				message: e
			};
			logger.warning('[ERROR_HANDLER]', `[COMPILE] Hit POST error handler with error ${e}`);
			res.status(500).send(responseData);
		}
	}
};
export default data;
