import "dotenv/config";
import express, { Response, Request} from "express";
import readlineSync from 'readline-sync';
const app = express();
const port = Number(process.env.PORT) || 3000;
import cache from "./cache.js";
console.log("num of rocks in index", cache.numOfRocks)
import { createRock, saveRockOutput } from "./lib/rockUtils.js";
createRock();
const tempCode = `Shout "Hello World"!\npapa was a rolling stone\npapa was a brand new bag\nx is 2\nShout x\nLet my array at 0 be "foo"\nLet my array at 1 be "bar"\nLet my array at 2 be "baz"\nLet my array at "key" be "value"\nShout my array at 0\nShout my array at 1\nShout my array at 2\nShout my array at "key"\nShout my array\nGive back 1\n`
const ast = cache.interpreter.parse(tempCode);
cache.interpreter.run(ast, readlineSync, saveRockOutput);
console.log("env.log", cache.rocks[0].log);
cache.rocks[cache.numOfRocks].code = tempCode;
cache.numOfRocks++;
app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!')
})
// Compile API route
app.get('/compile/:code', (req: Request, res: Response) => {
  const codeEncoded = req.params.code;
  const code = decodeURIComponent(codeEncoded).replaceAll('\\n', '\n');
  createRock();
  const ast = cache.interpreter.parse(code);
  cache.interpreter.run(ast, readlineSync, saveRockOutput);
  cache.rocks[cache.numOfRocks].code = code;
  const responseData = {
    id: cache.numOfRocks,
    status: "success",
    code: code,
    log: cache.rocks[cache.numOfRocks].log,
    output: cache.rocks[cache.numOfRocks].output
  }
  res.send(responseData);
  cache.numOfRocks++;
})
// /rock/:id API route
app.get('/rock/:id', (req: Request, res: Response) => {
  const rockID = Number(req.params.id);
  const rock = cache.rocks[rockID];
  const responseData = {
    id: rockID,
    status: "success",
    code: rock.code,
    output: rock.log
  }
  res.send(responseData);
})
app.get('/')
app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})