import { Interpreter } from '#satriani/satriani';

const cache: ICache = {
	interpreter: new Interpreter(),
	rocks: [],
	numOfRocks: 0,
	dbConnected: false
};

//cache.numOfRocks = 12

export default cache;
interface ICache {
	interpreter: Interpreter;
	rocks: rock[];
	numOfRocks: number;
	dbConnected: boolean;
}
interface rock {
	log: any;
	output: string[];
	code: string;
}
