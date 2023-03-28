import "dotenv/config";
import express, { Response, Request} from "express";
import readlineSync from 'readline-sync';
import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.urlencoded());
const port = Number(process.env.PORT) || 3000;
import cache from "./cache.js";
//console.log("num of rocks in index", cache.numOfRocks)
import { createRock, saveRockOutput } from "./lib/rockUtils.js";
import path from "path";
createRock();
const tempCode = `Shout "Hello World"!\npapa was a rolling stone\npapa was a brand new bag\nx is 2\nShout x\nLet my array at 0 be "foo"\nLet my array at 1 be "bar"\nLet my array at 2 be "baz"\nLet my array at "key" be "value"\nShout my array at 0\nShout my array at 1\nShout my array at 2\nShout my array at "key"\nShout my array\nGive back 1\n`
const ast = cache.interpreter.parse(tempCode);
cache.interpreter.run(ast, readlineSync, (output: string) => saveRockOutput(output, cache.numOfRocks), cache.numOfRocks);
//console.log("env.log", cache.rocks[0].log);
cache.rocks[cache.numOfRocks].code = tempCode;
cache.numOfRocks++;
app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(),"/ide/ide.html"))
})
// Compile new rock API route
app.post('/compile/', (req: Request, res: Response) => {
  const codeEncoded = req.body.code;
  const code = `${decodeURIComponent(codeEncoded).replaceAll('\\n', '\n')}\n`;
  //console.log(code)
  createRock();
  const ast = cache.interpreter.parse(code);
  cache.interpreter.run(ast, readlineSync, (output: string) => saveRockOutput(output, cache.numOfRocks), cache.numOfRocks);
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
// Update rock API Route
app.put("/compile/", (req: Request, res: Response) => {
  const id = Number(req.body.id);
  const codeEncoded = req.body.code;
  const code = `${decodeURIComponent(codeEncoded).replaceAll('\\n', '\n')}\n`;
  const ast = cache.interpreter.parse(code)
  cache.rocks[id].output = [];
  cache.interpreter.run(ast, readlineSync,  (output: string) => saveRockOutput(output, id), id);
  cache.rocks[id].code = code;
  const responseData = {
    id: cache.numOfRocks,
    status: "success",
    code: code,
    log: cache.rocks[id].log,
    output: cache.rocks[id].output
  }
  res.send(responseData);
})
// /rock/:id API route
app.get('/rock/:id', (req: Request, res: Response) => {
  const rockID = Number(req.params.id);
  const rock = cache.rocks[rockID];
  console.log("rock", rock)
  const responseData = {
    id: rockID,
    status: "success",
    code: rock.code,
    log: rock.log,
    output: rock.output
  }
  res.send(responseData);
})
app.get('/heartbeat', (_req: Request, res: Response) => {
  res.status(200).send("OK");
})
app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})