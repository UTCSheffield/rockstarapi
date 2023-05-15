import cache from '#main/cache';
import logger from '#main/lib/logger';
import type { routeData } from '#main/types/routes';
import type { Request, Response } from 'express';

const data: routeData = {
	path: '/rock/:id',
	GET: function (req: Request, res: Response) {
		const rockID = Number(req.params.id);
		const rock = cache.rocks[rockID];
		logger.debug('rock', JSON.stringify(rock));
		const responseData = {
			id: rockID,
			status: 'success',
			code: rock.code,
			log: rock.log,
			output: rock.output
		};
		res.send(responseData);
	}
};
export default data;
