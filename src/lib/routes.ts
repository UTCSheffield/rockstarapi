import type { routeData } from "#main/types/routes";
import { app } from "..";
import logger from "./logger";
import fs from "fs"

export class router {
    private routes = new Map<string, routeData>();
    private routeDirectory = `${process.cwd()}/dist/src/routes`
    
    public load() {
        // Load routes into memory
        logger.info("router", "Started loading routes")
        for (const folder of fs.readdirSync(this.routeDirectory)) {
            const commandFiles = fs.readdirSync(`${this.routeDirectory}/${folder}`).filter((file: any) => file.endsWith('.js'));
            for (const file of commandFiles) {
                const route = require(`${this.routeDirectory}/${folder}/${file}`).default;
                this.routes.set(`${route.path}-${Date.now()}`, route)
                logger.debug("router", `Loaded route: ${route.path}`)
            }
        }
        logger.info("router", "Finished loading routes")
    }

    public async register() {
        // Register routes for express
        logger.info("router", "Started registering routes")
        this.routes.forEach((val: routeData, _key: string) => {
            if (typeof(val.GET) != "undefined") {
                // GET route
                app.get(val.path, val.GET)
                logger.debug("router", `[${val.path}] Registered GET route`)
            }
            if (typeof(val.POST) != "undefined") {
                // POST route
                app.post(val.path, val.POST)
                logger.debug("router", `[${val.path}] Registered POST route`)
            }
            if (typeof(val.PUT) != "undefined") {
                // PUT route
                app.put(val.path, val.PUT)
                logger.debug("router", `[${val.path}] Registered PUT route`)
            }
            if (typeof(val.DELETE) != "undefined") {
                // DELETE route
                app.delete(val.path, val.DELETE)
                logger.debug("router", `[${val.path}] Registered DELETE route`)
            }
        })
        logger.info("router", "Finished loading routes")
    }
}