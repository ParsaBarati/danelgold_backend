"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Session", {
    enumerable: true,
    get: function() {
        return Session;
    }
});
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
let Session = class Session {
};
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'int'
    }),
    (0, _typeorm.Generated)('increment'),
    _ts_metadata("design:type", Number)
], Session.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.PrimaryColumn)({
        type: 'varchar'
    }),
    _ts_metadata("design:type", String)
], Session.prototype, "sid", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'json'
    }),
    _ts_metadata("design:type", typeof Record === "undefined" ? Object : Record)
], Session.prototype, "sess", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamp'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Session.prototype, "expire", void 0);
Session = _ts_decorate([
    (0, _typeorm.Entity)('session')
], Session);

//# sourceMappingURL=session.entity.js.map