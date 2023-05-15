import cache from '#main/cache';
import { createRock, saveRockOutput } from '#main/lib/rockUtils';
import type { routeData } from '#main/types/routes';
import { Octokit } from '@octokit/core';
import type { Request, Response } from 'express';
import readlineSync from 'readline-sync';
const octokit = new Octokit();

const data: routeData = {
	path: '/gist/id/:id',
	GET: async function (req: Request, res: Response) {
		const rocksCreated: any[] = [];
		const gist = await octokit.request('GET /gists/{gist_id}', {
			gist_id: req.params.id,
			headers: {
				'X-GitHub-Api-Version': '2022-11-28'
			}
		});
		const files = gist.data.files;
		if (typeof files == 'undefined')
			return res.status(404).send({
				status: 'error',
				message: 'Gist not found'
			});
		const filesArray = Object.values(files);
		if (filesArray == null)
			return res.status(404).send({
				status: 'error',
				message: 'Gist not found'
			});
		// Filter by .rock extension
		const filteredFiles = filesArray.filter((file: any) => file.filename.endsWith('.rock'));
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
			});
			cache.numOfRocks++;
		});
		res.status(200).send({
			status: 'success',
			rocks: rocksCreated
		});
		return;
	}
};
export default data;
