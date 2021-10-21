"use strict";
exports.__esModule = true;
exports.version = exports.name = exports.XummStrategy = void 0;
/**
 * Module dependencies.
 */
var strategy_1 = require("./strategy");
exports.XummStrategy = strategy_1.XummStrategy;
/**
 * Pull package.json into the distributable package.
 */
var package_json_1 = require("../../package.json");
exports.name = package_json_1.name;
exports.version = package_json_1.version;
