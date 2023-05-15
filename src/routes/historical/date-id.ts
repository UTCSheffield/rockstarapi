import cache from "#main/cache";
import { DBClient } from "#main/index";
import { createRock, saveRockOutput } from "#main/lib/rockUtils";
import type { routeData } from "#main/types/routes";
import type { Request, Response } from "express";
import readlineSync from "readline-sync";

const data: routeData = {
    path: "/historical/:date/:id",
    GET: async function (req: Request, res: Response) {
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
    }
}
export default data