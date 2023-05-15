import cache from "#main/cache";
import type { routeData } from "#main/types/routes";
import type { Request, Response } from "express";

const data: routeData = {
    path: "/ide/css.css",
    GET: function (_req: Request, res: Response) {
        if (cache.dbConnected) {
            res.status(200).send("OK");
          } else {
            res.status(500).send("DB not connected");
          }    if (cache.dbConnected) {
            res.status(200).send("OK");
          } else {
            res.status(500).send("DB not connected");
          }
    }
}
export default data