"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
exports.__esModule = true;
exports.User = void 0;
var typeorm_1 = require("typeorm");
var session_1 = require("./session");
var token_1 = require("./token");
var User = /** @class */ (function () {
    function User() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], User.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], User.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)({ type: 'time', "default": function () { return 'CURRENT_TIMESTAMP'; } }),
        __metadata("design:type", String)
    ], User.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.Column)({ type: 'time', "default": function () { return 'CURRENT_TIMESTAMP'; } }),
        __metadata("design:type", String)
    ], User.prototype, "updatedAt");
    __decorate([
        (0, typeorm_1.OneToMany)(function (type) { return token_1.Token; }, function (Token) { return Token.id; }),
        (0, typeorm_1.JoinColumn)({ name: 'id' }),
        __metadata("design:type", Array)
    ], User.prototype, "tokens");
    __decorate([
        (0, typeorm_1.OneToMany)(function (type) { return session_1.Session; }, function (Session) { return Session.id; }),
        (0, typeorm_1.JoinColumn)({ name: 'id' }),
        __metadata("design:type", Array)
    ], User.prototype, "sessions");
    User = __decorate([
        (0, typeorm_1.Entity)('User')
    ], User);
    return User;
}());
exports.User = User;
