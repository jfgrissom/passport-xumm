"use strict";
exports.__esModule = true;
exports.logout = void 0;
var menu_1 = require("./menu");
var constants_1 = require("../constants");
var logout = function (req, res) {
    res.clearCookie(constants_1.COOKIE_NAME, { path: '/' });
    req.session.destroy(function () { });
    res.send("\n    <h1>You're Logged Out!</h1>\n    " + (0, menu_1.menu)() + "\n    <p>Check your cookies you're logged out!</p>\n  ");
};
exports.logout = logout;
