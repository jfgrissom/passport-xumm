"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var express_1 = __importDefault(require("express"));
var express_request_context_1 = __importDefault(require("express-request-context"));
var typeorm_1 = require("typeorm");
var uuid_1 = require("uuid");
require("reflect-metadata");
var express_session_1 = __importDefault(require("express-session"));
var typeorm_store_1 = require("typeorm-store");
var dotenv = __importStar(require("dotenv"));
// Pull in the environment variables and account for them before continuing.
dotenv.config();
if (!process.env.SESSION_SECRET)
    throw Error('Is your session secret in .env?');
var sessionSecret = process.env.SESSION_SECRET;
// Functions that handle the routes.
var route_handlers_1 = require("./route-handlers/");
var session_1 = require("./entities/session");
var constants_1 = require("./constants");
// Configure the service.
var port = 3000;
var service = (0, express_1["default"])();
service.use((0, express_request_context_1["default"])());
service.use(express_1["default"].json());
// Database options.
/*
const options: ConnectionOptions = {
  type: 'sqlite',
  database: `./data/db.sqlite`,
  entities: [User, Token, Session],
  logging: true,
  synchronize: true
}
*/
// Bootstrap the service.
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var database, orm, sessionRepository, sessionConfig;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, typeorm_1.createConnection)()];
            case 1:
                database = _a.sent();
                if (!database)
                    throw Error('Could not connect to the DB.');
                orm = function (req, res, next) {
                    req.context.db = database;
                    next();
                };
                service.use(orm);
                sessionRepository = database.getRepository(session_1.Session);
                sessionConfig = {
                    genid: function (req) {
                        return (0, uuid_1.v4)(); // use UUIDs for session IDs
                    },
                    secret: sessionSecret,
                    name: constants_1.COOKIE_NAME,
                    saveUninitialized: true,
                    store: new typeorm_store_1.TypeormStore({ repository: sessionRepository }),
                    resave: false,
                    cookie: {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production' ? true : false,
                        sameSite: 'strict' // Only send a cookie if the domain matches the browser url.
                        // These options you'll likely want in production but they aren't available from express-session.
                        // ephemeral: true, // Nukes the cookie when the browser closes.
                        // duration: 30 * 60 * 1000,
                        // activeDuration: 5 * 60 * 1000,
                    }
                };
                // Add the session repo to the session.
                service.use((0, express_session_1["default"])(sessionConfig));
                // Local API endpoints.
                service.get('/api/qr', route_handlers_1.qr);
                service.post('/api/xumm', route_handlers_1.xumm);
                // Local Web endpoints.
                service.get('/', route_handlers_1.home);
                service.get('/login', route_handlers_1.login);
                service.get('/logout', route_handlers_1.logout);
                service.get('/user', route_handlers_1.user);
                // Local VIEW endpoints.
                // Start the API as a web service.
                service.listen(port, function () {
                    console.log("Example express app listening at http://localhost:" + port);
                });
                return [2 /*return*/];
        }
    });
}); };
main();
