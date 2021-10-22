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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var express_request_context_1 = __importDefault(require("express-request-context"));
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var qr_1 = require("./route-handlers/qr");
var xumm_1 = require("./route-handlers/xumm");
// Configure the service.
var port = 3000;
var api = (0, express_1["default"])();
// Apply middlware to the service.
api.use(express_1["default"].json());
api.use((0, express_request_context_1["default"])());
// Local routes here.
api.get('/qr', qr_1.qr);
api.post('/xumm', xumm_1.xumm);
// Start the API as a web service.
api.listen(port, function () {
    console.log("Example express app listening at http://localhost:" + port);
});
