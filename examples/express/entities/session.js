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
exports.Session = void 0;
var typeorm_1 = require("typeorm");
var user_1 = require("./user");
var Session = /** @class */ (function () {
    function Session() {
        this.expiredAt = Date.now();
        this.id = '';
        this.json = '';
    }
    __decorate([
        (0, typeorm_1.Index)(),
        (0, typeorm_1.Column)('bigint'),
        __metadata("design:type", Object)
    ], Session.prototype, "expiredAt");
    __decorate([
        (0, typeorm_1.PrimaryColumn)('varchar', { length: 255 }),
        __metadata("design:type", Object)
    ], Session.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)('text'),
        __metadata("design:type", Object)
    ], Session.prototype, "json");
    __decorate([
        (0, typeorm_1.Column)({ type: 'time', "default": function () { return 'CURRENT_TIMESTAMP'; } }),
        __metadata("design:type", String)
    ], Session.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.Column)({ type: 'time', "default": function () { return 'CURRENT_TIMESTAMP'; } }),
        __metadata("design:type", String)
    ], Session.prototype, "updatedAt");
    __decorate([
        (0, typeorm_1.Column)({ type: 'time' }),
        __metadata("design:type", String)
    ], Session.prototype, "expiresAt");
    __decorate([
        (0, typeorm_1.ManyToOne)(function (type) { return user_1.User; }),
        (0, typeorm_1.JoinColumn)({ name: 'id' }),
        __metadata("design:type", user_1.User)
    ], Session.prototype, "user");
    Session = __decorate([
        (0, typeorm_1.Entity)('Session')
    ], Session);
    return Session;
}());
exports.Session = Session;
