"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SupportTicketsService", {
    enumerable: true,
    get: function() {
        return SupportTicketsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _supportticketentity = require("./entity/support-ticket.entity");
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
let SupportTicketsService = class SupportTicketsService {
    create(ticketData) {
        const ticket = this.ticketsRepository.create(ticketData);
        return this.ticketsRepository.save(ticket);
    }
    findAll() {
        return this.ticketsRepository.find({
            relations: [
                'user'
            ]
        });
    }
    findOne(id) {
        return this.ticketsRepository.findOne({
            where: {
                id
            },
            relations: [
                'user'
            ]
        });
    }
    update(id, updateData) {
        return this.ticketsRepository.update(id, updateData);
    }
    remove(id) {
        return this.ticketsRepository.delete(id);
    }
    constructor(ticketsRepository){
        this.ticketsRepository = ticketsRepository;
    }
};
SupportTicketsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_supportticketentity.SupportTicket)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], SupportTicketsService);

//# sourceMappingURL=support-ticket.service.js.map