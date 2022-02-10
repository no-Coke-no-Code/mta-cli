var Spinner = require("cli-spinner").Spinner;
var spinner = new Spinner("正在部署.. %s");
spinner.setSpinnerString("|/-\\");

global.spinner = spinner;