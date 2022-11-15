import util from "util";
import fs from "fs";

const LOG_DIR = 'logs';

if (!fs.existsSync(LOG_DIR)){
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

const log_file = fs.createWriteStream("logs/server.log", { flags: "w" });
const log_stdout = process.stdout;

const logger = function (d) {
  var to_log = `${new Date().toISOString()} -- ${util.format(d)}\n`
  log_file.write(to_log);
  log_stdout.write(to_log);
};

module.exports  = logger