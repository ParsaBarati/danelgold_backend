"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SwaggerHelper", {
    enumerable: true,
    get: function() {
        return SwaggerHelper;
    }
});
const _buffer = require("buffer");
const _swagger = require("@nestjs/swagger");
const _dotenv = require("dotenv");
const _common = require("@nestjs/common");
// import metadata from '@base/metadata';
(0, _dotenv.config)({
    path: '.develop.env'
});
let SwaggerHelper = class SwaggerHelper {
    setup(app) {
        if (!this.basePath || !this.username || !this.password) {
            console.error('Swagger Disabled : configuration missing ...');
            return;
        }
        const config = new _swagger.DocumentBuilder().setTitle(this.title).setDescription(this.description).setVersion('1.0.0').addBearerAuth().addGlobalParameters({
            name: 'Accept-Language',
            in: 'header',
            schema: {
                enum: [
                    'en',
                    'fa'
                ]
            }
        }).build();
        // Use Express middleware instead of Fastify hooks
        const expressApp = app.getHttpAdapter().getInstance();
        expressApp.use((request, reply, next)=>this.basicAuthInterceptor(request, reply, next));
        // SwaggerModule.loadPluginMetadata(metadata);
        const document = _swagger.SwaggerModule.createDocument(app, config);
        _swagger.SwaggerModule.setup(this.basePath, app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                tagsSorter: 'alpha',
                operationsSorter: 'alpha'
            }
        });
    }
    getBasePath() {
        return this.basePath.startsWith('/') ? this.basePath : `/${this.basePath}`;
    }
    setError(reply, next) {
        console.log('Authorization Failed. Check username and password.');
        reply.header('WWW-Authenticate', 'Basic realm="Paraf" charset="UTF-8"');
        next(new _common.UnauthorizedException());
    }
    basicAuthInterceptor(request, reply, next) {
        const url = request.url.split('?').shift().replace(/\/+$/, '');
        if (url !== this.getBasePath() && url !== `${this.getBasePath()}-json`) {
            next();
            return;
        }
        let credentials = request.headers['authorization'];
        if (typeof credentials !== 'string') {
            this.setError(reply, next);
            return;
        }
        credentials = credentials.replace('Basic ', '');
        const credentialsDecoded = _buffer.Buffer.from(credentials, 'base64').toString('utf-8');
        const userPassRE = /^([^:]*):(.*)$/;
        const userPass = userPassRE.exec(credentialsDecoded);
        if (userPass[1] === this.username && userPass[2] === this.password) {
            console.log('Authorization Successful.');
            next();
            return;
        }
        this.setError(reply, next);
    }
    constructor(){
        this.basePath = process.env.SWAGGER_PATH || 'api-docs';
        this.username = process.env.SWAGGER_USERNAME || 'admin';
        this.password = process.env.SWAGGER_PASSWORD || 'admin';
        this.title = process.env.SWAGGER_TITLE || 'API Documentation';
        this.description = process.env.SWAGGER_DESCRIPTION || 'API description';
    }
};

//# sourceMappingURL=swagger.utils.js.map