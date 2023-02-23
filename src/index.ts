import "dotenv/config";
import express, { Response, Request} from "express";
import readlineSync from 'readline-sync';
const app = express();
const port = Number(process.env.PORT) || 3000;
import cache from "./cache.js";
import { createRock, saveRockAST, saveRockOutput } from "./lib/rockUtils.js";
createRock();
const ast = cache.interpreter.parse(`Shout "Hello World"!\npapa was a rolling stone\nGive back 1\n`)
saveRockAST(ast);
cache.interpreter.run(ast, readlineSync, saveRockOutput);
//console.log(cache.rocks)
app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})