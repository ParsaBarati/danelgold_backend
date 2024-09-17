"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SupportTicketsController", {
    enumerable: true,
    get: function() {
        return SupportTicketsController;
    }
});
const _common = require("@nestjs/common");
const _supportticketservice = require("./support-ticket.service");
const _swagger = require("@nestjs/swagger");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let SupportTicketsController = class SupportTicketsController {
    create(createTicketDto) {
        return this.supportTicketsService.create(createTicketDto);
    }
    findAll() {
        return this.supportTicketsService.findAll();
    }
    findOne(id) {
        return this.supportTicketsService.findOne(id);
    }
    update(id, updateTicketDto) {
        return this.supportTicketsService.update(id, updateTicketDto);
    }
    remove(id) {
        return this.supportTicketsService.remove(id);
    }
    constructor(supportTicketsService){
        this.supportTicketsService = supportTicketsService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Partial === "undefined" ? Object : Partial
    ]),
    _ts_metadata("design:returntype", void 0)
], SupportTicketsController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], SupportTicketsController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", void 0)
], SupportTicketsController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Put)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof Partial === "undefined" ? Object : Partial
    ]),
    _ts_metadata("design:returntype", void 0)
], SupportTicketsController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", void 0)
], SupportTicketsController.prototype, "remove", null);
SupportTicketsController = _ts_decorate([
    (0, _swagger.ApiTags)('Support_Ticket'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Controller)('support-tickets'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _supportticketservice.SupportTicketsService === "undefined" ? Object : _supportticketservice.SupportTicketsService
    ])
], SupportTicketsController);

//# sourceMappingURL=support-ticket.controller.js.map