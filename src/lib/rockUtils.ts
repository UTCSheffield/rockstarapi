import cache from "../cache";

export function saveRockAST(ast: any) {
        cache.rocks[cache.numOfRocks].ast = ast;
        console.log(ast)
}
export function saveRockOutput(output: any) {
        cache.rocks[cache.numOfRocks].output = output;
        console.log(output)
}
export function createRock() {
        cache.rocks.push({ast: null, output: null});
}