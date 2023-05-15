import type { routeData } from '#main/types/routes';
import type { Request, Response } from 'express';
import path from 'path';

const data: routeData = {
	path: '/',
	GET: function (_req: Request, res: Response) {
		res.sendFile(path.join(process.cwd(), '/ide/html.html'));
	}
};
export default data;
