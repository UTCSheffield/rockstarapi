import "dotenv/config";
import express, { Response, Request} from "express";
import readlineSync from 'readline-sync';
import bodyParser from "body-parser";
import { createRock, saveRockOutput } from "./lib/rockUtils.js";
import path from "path";
import cache from "./cache.js";
import { PrismaClient } from "@prisma/client";
import { Octokit } from "@octokit/core";
import type { gistFile } from "./types/github.js";
const octokit = new Octokit()

const DBClient = new PrismaClient();
async function main() {
  const app = express();
  app.use(bodyParser.urlencoded());
  const port = Number(process.env.PORT) || 3000;
  createRock();
  const tempCode = `Shout "Hello World"!\npapa was a rolling stone\npapa was a brand new bag\nx is 2\nShout x\nLet my array at 0 be "foo"\nLet my array at 1 be "bar"\nLet my array at 2 be "baz"\nLet my array at "key" be "value"\nShout my array at 0\nShout my array at 1\nShout my array at 2\nShout my array at "key"\nShout my array\nGive back 1\n`
  const ast = cache.interpreter.parse(tempCode);
  cache.interpreter.run(ast, readlineSync, (output: string) => saveRockOutput(output, cache.numOfRocks), cache.numOfRocks);
  //console.log("env.log", cache.rocks[0].log);
  cache.rocks[cache.numOfRocks].code = tempCode;
  cache.numOfRocks++;
  // IDE
  app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(),"/ide/html.html"))
  })
  app.get('/ide/js.js', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(),"/ide/js.js"))
  })
  app.get('/ide/css.css', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(),"/ide/css.css"))
  })
  // API Documentation
  app.get('/docs/openapi.yaml', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "/openapi.yaml"))
  })
  app.get('/docs/', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "/docs/index.html"))
  })
  // Compile new rock API route
  app.post('/compile/', async (req: Request, res: Response) => {
    const dateClass = new Date();
    const date = `${dateClass.getDate()}_${dateClass.getMonth() + 1}_${dateClass.getFullYear()}`
    const codeEncoded = req.body.code;
    const code = `${decodeURIComponent(codeEncoded).replaceAll('\\n', '\n')}\n`;
    //console.log(code)
    createRock();
    const ast = cache.interpreter.parse(code);
    cache.interpreter.run(ast, readlineSync, (output: string) => saveRockOutput(output, cache.numOfRocks), cache.numOfRocks);
    cache.rocks[cache.numOfRocks].code = code;
    // Save to DB
    const session = await DBClient.session.upsert({
      where: {
        humanReadableDate: date
      },
      update: {},
      create: {
        humanReadableDate: date
      }
    })
    await DBClient.rock.create({
      data: {
        code: code,
        humanReadableId: cache.numOfRocks,
        sessionId: session.id,
        uniqueId: `${date}-${cache.numOfRocks}`
      }
    })
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
  app.put("/compile/", async (req: Request, res: Response) => {
    const dateClass = new Date();
    const date = `${dateClass.getDate()}_${dateClass.getMonth() + 1}_${dateClass.getFullYear()}`
    const id = Number(req.body.id);
    const codeEncoded = req.body.code;
    const code = `${decodeURIComponent(codeEncoded).replaceAll('\\n', '\n')}\n`;
    const ast = cache.interpreter.parse(code)
    cache.rocks[id].output = [];
    cache.interpreter.run(ast, readlineSync,  (output: string) => saveRockOutput(output, id), id);
    cache.rocks[id].code = code;
    console.log("date, id", date, id)
    // Save to DB
    await DBClient.session.upsert({
      where: {
        humanReadableDate: date
      },
      update: {},
      create: {
        humanReadableDate: date
      }
    })
    await DBClient.rock.update({
      where: {
        uniqueId: `${date}-${id}`
      },
      data: {
        code: code,
      }
    })
    const responseData = {
      id: id,
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
  // Historical Rock API route
  app.get('/historical/:date/:id', async (req: Request, res: Response) => {
    const { date, id } = req.params;
    const rock = await DBClient.rock.findFirst({
      where: {
        uniqueId: `${date}-${id}`
      }
    });
    if (!rock) {
      const responseData = {
        id: id,
        status: "error",
        message: "Rock not found"
      }
      res.status(404).send(responseData)
    } else {
      createRock();
      const ast = cache.interpreter.parse(rock.code);
      cache.interpreter.run(ast, readlineSync, (output: string) => saveRockOutput(output, cache.numOfRocks), cache.numOfRocks);
      cache.rocks[cache.numOfRocks].code = rock.code;
      cache.numOfRocks++;
      const responseData = {
        id: cache.numOfRocks,
        status: "success",
        code: rock.code,
        log: cache.rocks[Number(id)].log,
        output: cache.rocks[Number(id)].output   
      }
      res.status(200).send(responseData)
    }
  })
  // Gists
  app.get('/gist/id/:id', async (req: Request, res: Response) => {
    const rocksCreated: any[] = [];
    const gist = await octokit.request('GET /gists/{gist_id}', {
      gist_id: req.params.id,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    const files = gist.data.files;
    if (typeof(files) == "undefined") return res.send({
      status: "error",
      message: "Gist not found"
    })
    const filesArray = Object.values(files);
    if (filesArray == null) return res.send({
      status: "error",
      message: "Gist not found"
    })
    // Filter by .rock extension
    const filteredFiles = filesArray.filter((file: any) => file.filename.endsWith(".rock"));
    // TODO: Add to cache and DB
    // @ts-ignore
    filteredFiles.map((file: gistFile) => {
      createRock();
      const ast = cache.interpreter.parse(file.content);
      cache.interpreter.run(ast, readlineSync, (output: string) => saveRockOutput(output, cache.numOfRocks), cache.numOfRocks);
      cache.rocks[cache.numOfRocks].code = file.content as string;
      rocksCreated.push({
        id: cache.numOfRocks,
        code: file.content,
        log: cache.rocks[cache.numOfRocks].log,
        output: cache.rocks[cache.numOfRocks].output
      })
      cache.numOfRocks++
    })
    res.send({
      status: "success",
      rocks: rocksCreated
    })
    return
  });
  app.get('/heartbeat', async (_req: Request, res: Response) => {
    if (cache.dbConnected) {
      res.status(200).send("OK");
    } else {
      res.status(500).send("DB not connected");
    }
  })
  app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })
}
try {
  (async () => {
    await DBClient.$connect();
    console.log("[DB] Connected!")
    cache.dbConnected = true;
    await main();
  })()
} catch (e) {
  console.log("Fatal Error", e);
  DBClient.$disconnect();
  process.exit(1);
}