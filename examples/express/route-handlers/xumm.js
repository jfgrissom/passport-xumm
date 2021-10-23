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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.xumm = void 0;
var axios_1 = __importDefault(require("axios"));
var typeorm_1 = require("typeorm");
var user_1 = require("../entity/user");
var token_1 = require("../entity/token");
// Once a request comes in check with Xumm to be sure the payload is real.
var xumm = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userRepository, tokenRepository, userId, url, options, response, user, token, savedToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Request From Xumm: " + JSON.stringify(req.body));
                return [4 /*yield*/, (0, typeorm_1.getConnection)().getRepository(user_1.User)];
            case 1:
                userRepository = _a.sent();
                return [4 /*yield*/, (0, typeorm_1.getConnection)().getRepository(token_1.Token)
                    // This userID should be something your application passed
                    // to Xumm when you requested the QR code.
                ];
            case 2:
                tokenRepository = _a.sent();
                userId = req.body.custom_meta.identifier;
                if (!userId) return [3 /*break*/, 6];
                url = "https://xumm.app/api/v1/platform/payload/ci/" + userId;
                options = {
                    headers: {
                        'X-API-Key': process.env.XUMM_PUB_KEY,
                        'X-API-Secret': process.env.XUMM_PVT_KEY
                    }
                };
                return [4 /*yield*/, axios_1["default"].get(url, options)];
            case 3:
                response = _a.sent();
                if (!(response.data.meta.exists === true &&
                    response.data.meta.resolved === true)) return [3 /*break*/, 6];
                console.log('Payload received is authentic: ');
                console.log('Creating new session and attaching public wallet data.');
                return [4 /*yield*/, userRepository.findOne({ id: userId })
                    // Create a token.
                ];
            case 4:
                user = _a.sent();
                token = new token_1.Token();
                token.hashedToken = req.body.userToken.user_token;
                token.createdAt = req.body.userToken.token_issued;
                token.expiresAt = req.body.userToken.token_expiration;
                token.user = user;
                return [4 /*yield*/, tokenRepository.save(token)];
            case 5:
                savedToken = _a.sent();
                console.log("Token Saved: " + JSON.stringify(savedToken));
                _a.label = 6;
            case 6:
                // This is what gets returned to the caller (Xumm Service)
                // because we received their payload.
                res.sendStatus(200);
                return [2 /*return*/];
        }
    });
}); };
exports.xumm = xumm;
