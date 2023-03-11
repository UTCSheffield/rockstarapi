import cache from "../cache";

export function saveRockENV(env: any, id: number) {
        cache.rocks[id].log = env.log;
        //console.log("env from cache", cache.rocks[id].log)
        //void env
        //console.log(env.log)
}
export function saveRockOutput(output: any, id: number) {
        cache.rocks[id].output.push(output);
        //console.log(output)
}
export function createRock() {
        cache.rocks.push({log: null, output: [], code: ""});       
}