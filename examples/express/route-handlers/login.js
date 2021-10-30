"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.login = void 0;
var menu_1 = require("./menu");
var passport_xumm_1 = require("../../../lib/passport-xumm");
var uuid_1 = require("uuid");
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authenticated, pubKey, pvtKey, props, xumm, identifier, qr;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                authenticated = false;
                if (!!authenticated) return [3 /*break*/, 2];
                pubKey = process.env.XUMM_PUB_KEY;
                pvtKey = process.env.XUMM_PVT_KEY;
                props = { pubKey: pubKey, pvtKey: pvtKey };
                xumm = new passport_xumm_1.XummStrategy(props);
                identifier = (0, uuid_1.v4)();
                return [4 /*yield*/, xumm.fetchQrCode({
                        web: 'http://localhost:3000/',
                        identifier: identifier
                    })
                    // Present the QR to the user.
                ];
            case 1:
                qr = _a.sent();
                // Present the QR to the user.
                res.send("\n      <h1>Login with Xumm!</h1>\n      " + (0, menu_1.menu)() + "\n      <p><a href=\"" + qr.next.always + "\">Click Here</a> to login with Xumm</p>\n      <p>OR Scan this with Xumm Wallet App</p>\n      <img src=" + qr.refs.qr_png + " />\n      <p>\n        Note: If you have the user scan directly here you'll need to \n        setup a poller or socket to react when Xumm sends a message after \n        the user has authenticated.\n      </p>\n    ");
                return [2 /*return*/];
            case 2:
                res.send("\n    <h1>Logged in already</h1>\n    " + (0, menu_1.menu)() + "\n    Session: " + req.sessionID + "\n    <p>Click Logout to end your session.!</p>\n  ");
                return [2 /*return*/];
        }
    });
}); };
exports.login = login;
