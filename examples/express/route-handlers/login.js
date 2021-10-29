"use strict";
exports.__esModule = true;
exports.login = void 0;
var menu_1 = require("./menu");
var login = function (req, res) {
    res.send("\n    <h1>Login with Xumm!</h1>\n    " + (0, menu_1.menu)() + "\n    Session: " + req.sessionID + "\n    <p>Xumm here!</p>\n  ");
};
exports.login = login;
