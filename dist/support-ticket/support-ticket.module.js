"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SupportTicketModule", {
    enumerable: true,
    get: function() {
        return SupportTicketModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _supportticketentity = require("./entity/support-ticket.entity");
const _supportticketcontroller = require("./support-ticket.controller");
const _supportticketservice = require("./support-ticket.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let SupportTicketModule = class SupportTicketModule {
};
SupportTicketModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _supportticketentity.SupportTicket
            ])
        ],
        controllers: [
            _supportticketcontroller.SupportTicketsController
        ],
        providers: [
            _supportticketservice.SupportTicketsService
        ]
    })
], SupportTicketModule);

//# sourceMappingURL=support-ticket.module.js.map