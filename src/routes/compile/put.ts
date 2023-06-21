import cache from '#main/cache';
import { DBClient } from '#main/index';
import logger from '#main/lib/logger';
import { saveRockOutput } from '#main/lib/rockUtils';
import type { routeData } from '#main/types/routes';
import type { Request, Response } from 'express';
import readlineSync from 'readline-sync';

const data: routeData = {
	path: '/compile/',
	PUT: async function (req: Request, res: Response) {
		try {
			const dateClass = new Date();
			const date = `${dateClass.getDate()}_${dateClass.getMonth() + 1}_${dateClass.getFullYear()}`;
			const id = Number(req.body.id);
			const codeEncoded = req.body.code;
			const code = `${decodeURIComponent(codeEncoded).replaceAll('\\n', '\n')}\n`;
			const ast = cache.interpreter.parse(code);
			cache.rocks[id].output = [];
			cache.interpreter.run(ast, readlineSync, (output: string) => saveRockOutput(output, id), id);
			cache.rocks[id].code = code;
			logger.debug('date, id', `${date}, ${id}`);
			// Save to DB
			await DBClient.session.upsert({
				where: {
					humanReadableDate: date
				},
				update: {},
				create: {
					humanReadableDate: date
				}
			});
			await DBClient.rock.update({
				where: {
					uniqueId: `${date}-${id}`
				},
				data: {
					code: code
				}
			});
			const responseData = {
				id: id,
				status: 'success',
				code: code,
				log: cache.rocks[id].log,
				output: cache.rocks[id].output
			};
			res.send(responseData);
		} catch (e) {
			const responseData = {
				status: 'error',
				message: e
			};
			logger.warning('ERROR_HANDLER', `[COMPILE] Hit PUT error handler with error ${e}`);
			res.status(500).send(responseData);
		}
	}
};
export default data;
/*

*/
