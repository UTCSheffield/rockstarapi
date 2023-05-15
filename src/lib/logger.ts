import { blue, gray, red, yellow } from 'colorette';

enum loglevels {
	'info' = 0,
	'debug' = 1,
	'all' = 2
}

function obtainLogLevel() {
	const { NODE_ENV, RAILWAY_ENVIRONMENT, LOG_LEVEL } = process.env;
	if (LOG_LEVEL == 'debug') return loglevels['debug'];
	if (NODE_ENV == 'development' || RAILWAY_ENVIRONMENT == 'development' || RAILWAY_ENVIRONMENT == 'staging' || LOG_LEVEL == 'all')
		return loglevels['all'];
	if (NODE_ENV == 'production' || RAILWAY_ENVIRONMENT == 'production' || LOG_LEVEL == 'info') return loglevels['info'];
	return loglevels['debug'];
}

class loggerClass {
	public logLevel: loglevels | undefined;
	constructor() {
		this.logLevel = obtainLogLevel();
		this.info('LOG LEVEL', String(this.logLevel));
	}
	public info(title: string, content: string) {
		console.log(blue(`[INFO] [${title}]`), content);
	}
	public warning(title: string, content: string) {
		console.log(yellow(`[WARNING] [${title}]`), content);
	}
	public debug(title: string, content: string) {
		if (this.logLevel == 1 || this.logLevel == 2) console.log(gray(`[DEBUG] [${title}]`), content);
	}
	public error(title: string, content: string) {
		console.log(red(`[ERROR] [${title}]`), content);
	}
}
const logger = new loggerClass();
export default logger;
