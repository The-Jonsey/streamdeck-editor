#!/usr/bin/env node
const path = require("path");
require('child_process').exec("node " + path.join(__dirname, "node_modules/.bin/electron") + " " + __dirname);