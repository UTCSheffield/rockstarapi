import { blue, gray, red, yellow } from "colorette";

class loggerClass {
    public info(title: string, content: string) {
        console.log(blue(`[INFO] [${title}]`), content)
    }
    public warning(title: string, content: string) {
        console.log(yellow(`[WARNING] [${title}]`), content)
    }
    public debug(title: string, content: string) {
        console.log(gray(`[DEBUG] [${title}]`), content)
    }
    public error(title: string, content: string) {
        console.log(red(`[ERROR] [${title}]`), content)
    }
}
const logger = new loggerClass();
export default logger