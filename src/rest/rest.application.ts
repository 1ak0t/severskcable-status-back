import {LoggerInterface} from "../shared/libs/logger/logger.interface.js";
import {ConfigInterface} from "../shared/libs/config/index.js";
import {RestSchema} from "../shared/libs/config/rest.schema.js";
import {inject, injectable} from "inversify";
import {Component} from "../shared/types/index.js";
import {DatabaseClientInterface} from "../shared/libs/database-client/database-client.interface.js";
import {getMongoURI} from "../shared/helpers/index.js";
import express, {Express} from "express";
import {ControllerInterface, ExceptionFilterInterface} from "../shared/libs/rest/index.js";
import {ParseTokenMiddleware} from "../shared/libs/rest/middleware/parse-token.middleware.js";
import cors from "cors";

@injectable()
export class RestApplication {
    private readonly server: Express;
    constructor(
        @inject(Component.Logger) private readonly logger: LoggerInterface,
        @inject(Component.Config) private readonly config: ConfigInterface<RestSchema>,
        @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClientInterface,
        @inject(Component.UserController) private readonly userController: ControllerInterface,
        @inject(Component.BreakController) private readonly breakController: ControllerInterface,
        @inject(Component.MachineController) private readonly machineController: ControllerInterface,
        @inject(Component.BreakTypeByMachineController) private readonly breakTypeByMachineController: ControllerInterface,
        @inject(Component.ExceptionFilter) private readonly exceptionFilter: ExceptionFilterInterface,
        @inject(Component.AuthExceptionFilter) private readonly authExceptionFilter: ExceptionFilterInterface
    ) {
        this.server = express();
    }

    private async initDb() {
        const mongoUri = getMongoURI(
            this.config.get('DB_USER'),
            this.config.get('DB_PASSWORD'),
            this.config.get('DB_HOST'),
            this.config.get('DB_PORT'),
            this.config.get('DB_NAME'),
        );

        return this.databaseClient.connect(mongoUri);
    }

    private async _initServer() {
        const port = this.config.get('PORT');
        this.server.listen(port);
    }

    private async _initControllers() {
        this.server.use('/users', this.userController.router);
        this.server.use('/breaks', this.breakController.router);
        this.server.use('/machines', this.machineController.router);
        this.server.use('/break-types-by-machine', this.breakTypeByMachineController.router);
    }

    private async _initMiddlewares() {
        const authenticateMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));

        this.server.use(express.json());
        this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
        this.server.use(cors());
    }

    private async _initExceptionFilter() {
        this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
        this.server.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public async init() {
        this.logger.info('Application initialization...');

        this.logger.info('Init database...');
        await this.initDb();
        this.logger.info('Init database completed');

        this.logger.info('Init app-level middleware');
        await this._initMiddlewares();
        this.logger.info('App-level middleware initialization completed');

        this.logger.info('Init controllers');
        await this._initControllers();
        this.logger.info('Controller initialization completed');

        this.logger.info('Init exception filters');
        await this._initExceptionFilter();
        this.logger.info('Exception filters initialization compleated');

        this.logger.info('Try to init server...');
        await this._initServer();
        this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);

    }
}