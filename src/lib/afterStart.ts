import type { PrismaClient } from '@prisma/client';
import { createRock, saveRockOutput } from './rockUtils';
import cache from '../cache';
import readlineSync from 'readline-sync';
import logger from './logger';

export class afterStart {
	private db: PrismaClient | undefined;
	constructor(db: PrismaClient) {
		this.db = db;
	}
	// Load from cache anything submitted on the same day
	public async initialLoadFromCache() {
		logger.info('INITIAL LOADER', 'Started loading Rocks from today into cache ');
		const dateClass = new Date();
		const date = `${dateClass.getDate()}_${dateClass.getMonth() + 1}_${dateClass.getFullYear()}`;
		const session = await this.db?.session.findFirst({
			where: {
				humanReadableDate: date
			},
			include: {
				Rock: true
			}
		});
		const rock = session?.Rock;
		rock?.map((val, i) => {
			createRock();
			const ast = cache.interpreter.parse(val.code);
			cache.rocks[i].output = [];
			cache.interpreter.run(ast, readlineSync, (output: string) => saveRockOutput(output, i), i);
			cache.rocks[i].code = val.code;
			logger.info('INITIAL LOADER', `Loaded a rock into cache with id: ${i}`);
		});
		logger.info('INITIAL LOADER', 'Finished loading rocks from db');
	}
}
