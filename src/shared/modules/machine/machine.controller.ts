import {inject, injectable} from "inversify";
import {BaseControllerAbstract, HttpMethodEnum} from "../../libs/rest/index.js";
import {Component} from "../../types/index.js";
import {LoggerInterface} from "../../libs/logger/index.js";
import {MachineServiceInterface} from "./machine-service.interface.js";
import {Request, Response} from "express";
import {fillDTO} from "../../helpers/common.js";
import {MachineRdo} from "./rdo/machine.rdo.js";
import {CreateMachineRequestType} from "./create-machine-request.type.js";

@injectable()
export class MachineController extends BaseControllerAbstract {
    constructor(
        @inject(Component.Logger) protected readonly logger: LoggerInterface,
        @inject(Component.MachineService) private readonly machineService: MachineServiceInterface
    ) {
        super(logger);

        this.logger.info('Register routes for MachineController...');

        this.addRoute({path: '/', method: HttpMethodEnum.Get, handler: this.getAll});
        this.addRoute({path: '/create', method: HttpMethodEnum.Post, handler: this.create});
    }

    public async getAll(_req: Request, res: Response): Promise<void> {
        const machines = await this.machineService.find();
        const responseData = fillDTO(MachineRdo, machines);
        this.ok(res, responseData);
    }

    public async create(
        {body} : CreateMachineRequestType,
        res: Response
    ): Promise<void> {
        const result = await this.machineService.create(body);
        this.created(res, fillDTO(MachineRdo, result));
    }
}