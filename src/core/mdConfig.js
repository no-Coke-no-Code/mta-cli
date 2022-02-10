const path = require('path')

let ConfigFileName = "mdcli.config.js";

if (process.argv.includes("-config")) {
  const index = process.argv.findIndex((item) => item === "-config");
  ConfigFileName = process.argv[index + 1]
}
const mdconfig = require(path.join(process.cwd(), ConfigFileName));

module.exports = mdconfig;