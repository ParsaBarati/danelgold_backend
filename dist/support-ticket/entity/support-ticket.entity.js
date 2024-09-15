"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    SupportTicket: function() {
        return SupportTicket;
    },
    TicketStatus: function() {
        return TicketStatus;
    }
});
const _userentity = require("../../user/entity/user.entity");
const _typeorm = require("typeorm");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
var TicketStatus;
(function(TicketStatus) {
    TicketStatus["OPEN"] = "open";
    TicketStatus["IN_PROGRESS"] = "in_progress";
    TicketStatus["CLOSED"] = "closed";
})(TicketStatus || (TicketStatus = {}));
let SupportTicket = class SupportTicket {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], SupportTicket.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], SupportTicket.prototype, "title", void 0);
_ts_decorate([
    (0, _typeorm.Column)('text'),
    _ts_metadata("design:type", String)
], SupportTicket.prototype, "description", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: TicketStatus,
        default: "open"
    }),
    _ts_metadata("design:type", String)
], SupportTicket.prototype, "status", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], SupportTicket.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User, (user)=>user.supportTickets),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], SupportTicket.prototype, "user", void 0);
SupportTicket = _ts_decorate([
    (0, _typeorm.Entity)()
], SupportTicket);

//# sourceMappingURL=support-ticket.entity.js.map