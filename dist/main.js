"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appmodule = require("./app.module");
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _passport = /*#__PURE__*/ _interop_require_default(require("passport"));
const _swaggerutils = require("./common/utils/swagger.utils");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function bootstrap() {
    return _bootstrap.apply(this, arguments);
}
function _bootstrap() {
    _bootstrap = _async_to_generator(function*() {
        const app = yield _core.NestFactory.create(_appmodule.AppModule, {});
        app.enableCors({
            origin: true,
            credentials: true
        });
        app.useGlobalPipes(new _common.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true
        }));
        app.use(_passport.default.initialize());
        const config = new _swagger.DocumentBuilder().setTitle('Danel Gold').setDescription('project danel gold api').setVersion('1.0').addTag('DanelGold').addBearerAuth().build();
        const document = _swagger.SwaggerModule.createDocument(app, config);
        _swagger.SwaggerModule.setup('/api', app, document);
        if (_swaggerutils.SwaggerHelper.prototype.setup) {
            yield new _swaggerutils.SwaggerHelper().setup(app);
        }
        const port = process.env.PORT || 3000;
        yield app.listen(port, '0.0.0.0');
        console.log(`running on port ${port}...`);
        function bytesToMB(bytes) {
            return bytes / (1024 * 1024);
        }
        const memoryUsage = process.memoryUsage();
        const rssMB = bytesToMB(memoryUsage.rss);
        const heapTotalMB = bytesToMB(memoryUsage.heapTotal);
        const heapUsedMB = bytesToMB(memoryUsage.heapUsed);
        const externalMB = bytesToMB(memoryUsage.external);
        const arrayBuffersMB = bytesToMB(memoryUsage.arrayBuffers);
        const totalMemoryMB = rssMB + heapTotalMB + heapUsedMB + externalMB + arrayBuffersMB;
        console.log({
            totalMemory: totalMemoryMB.toFixed(2) + ' MB'
        });
    });
    return _bootstrap.apply(this, arguments);
}
bootstrap();

//# sourceMappingURL=main.js.map