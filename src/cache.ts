import { Interpreter } from "#satriani/satriani";

const cache: ICache = {
    interpreter: new Interpreter(),
    rocks: [],
    numOfRocks: 0
}
export default cache;
interface ICache {
    interpreter: Interpreter;
    rocks: rock[];
    numOfRocks: number
}
interface rock {
    ast: any;
    output: any;
}