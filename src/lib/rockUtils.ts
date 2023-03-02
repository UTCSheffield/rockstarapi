import cache from "../cache";

export function saveRockENV(env: any) {
        cache.rocks[cache.numOfRocks].log = env.log;
        console.log("env from cache", cache.rocks[cache.numOfRocks].log)
        console.log("num of rocks in rockUtils", cache.numOfRocks)
        //void env
        console.log(env.log)
}
export function saveRockOutput(output: any) {
        cache.rocks[cache.numOfRocks].output.push(output);
        console.log(output)
}
export function createRock() {
        cache.rocks.push({log: null, output: [], code: ""});
        
}