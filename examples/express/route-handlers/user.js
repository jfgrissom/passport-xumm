"use strict";
exports.__esModule = true;
exports.user = void 0;
var menu_1 = require("./menu");
var user = function (req, res) {
    res.send("\n    <h1>User Dashboard</h1>\n    " + (0, menu_1.menu)() + "\n    Session: " + req.sessionID + "<br/>\n    External: " + req.session.externalId + "\n    <p>User's Details from the DB.</p>\n  ");
};
exports.user = user;
