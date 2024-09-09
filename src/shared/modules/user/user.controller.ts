import {BaseControllerAbstract, HttpError, HttpMethodEnum} from "../../libs/rest/index.js";
import {inject, injectable} from "inversify";
import {Component} from "../../types/index.js";
import {LoggerInterface} from "../../libs/logger/index.js";
import {Request, Response} from "express";
import {CreateUserRequestType} from "../../libs/rest/types/create-user-request.type.js";
import {UserServiceInterface} from "./user-service.interface.js";
import {fillDTO} from "../../helpers/common.js";
import {UserRdo} from "./rdo/user.rdo.js";
import {ConfigInterface} from "../../libs/config/index.js";
import {RestSchema} from "../../libs/config/rest.schema.js";
import {StatusCodes} from "http-status-codes";
import {LoginUserRequest} from "./login-user-request.js";
import {LoggedUserRdo} from "./rdo/logged-user.rdo.js";
import {AuthServiceInterface} from "../auth/auth-service.interface.js";

@injectable()
export class UserController extends BaseControllerAbstract {
    constructor(
        @inject(Component.Logger) protected readonly logger: LoggerInterface,
        @inject(Component.UserService) private readonly userService: UserServiceInterface,
        @inject(Component.Config) private readonly configService: ConfigInterface<RestSchema>,
        @inject(Component.AuthService) private readonly authService: AuthServiceInterface
    ) {
        super(logger);

        this.logger.info('Register routes for UserController...');

        this.addRoute({path: '/register', method: HttpMethodEnum.Post, handler: this.create});
        this.addRoute({path: '/', method: HttpMethodEnum.Get, handler: this.getAll});
        this.addRoute({path: '/login', method: HttpMethodEnum.Post, handler: this.login});
        this.addRoute({path: '/login', method: HttpMethodEnum.Get, handler: this.checkAuthenticate});
    }

    public async create(
        {body} : CreateUserRequestType,
        res: Response,
    ): Promise<void> {
        const existsUser = await this.userService.findByEmail(body.email);

        if (existsUser) {
            throw new HttpError(
                StatusCodes.CONFLICT,
                `User with email «${body.email}» exists.`,
                'UserController'
            );
        }

        const result = await this.userService.create(body, this.configService.get('SALT'));
        this.created(res, fillDTO(UserRdo, result));
    }

    public async getAll(_req: Request, res: Response): Promise<void> {
        const users = await this.userService.find();
        const responseData = fillDTO(UserRdo, users);
        this.ok(res, responseData);
    }

    public async login(
        { body }: LoginUserRequest,
        res: Response,
    ): Promise<void> {
        const user = await this.authService.verify(body);
        const token = await this.authService.authenticate(user);
        const responseData = fillDTO(LoggedUserRdo, {
            surname: user.surname,
            name: user.name,
            middleName: user.middleName,
            email: user.email,
            role: user.role,
            token
        });
        this.ok(res, responseData);
    }

    public async checkAuthenticate({ tokenPayload: { email }}: Request, res: Response) {
        const foundedUser = await this.userService.findByEmail(email);

        if (! foundedUser) {
            throw new HttpError(
                StatusCodes.UNAUTHORIZED,
                'Unauthorized',
                'UserController'
            );
        }

        this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
    }
}