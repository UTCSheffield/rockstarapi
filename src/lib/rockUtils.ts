import cache from '../cache';
import logger from './logger';

export function saveRockENV(env: any, id: number) {
	cache.rocks[id].log = env.log;
	logger.debug('env from cache', JSON.stringify(cache.rocks[id].log));
	//void env
}
export function saveRockOutput(output: any, id: number) {
	cache.rocks[id].output.push(output);
	logger.debug('output', output);
}
export function createRock() {
	cache.rocks.push({ log: null, output: [], code: '' });
}
