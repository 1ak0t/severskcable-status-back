import {inject, injectable} from "inversify";
import {MachineServiceInterface} from "./machine-service.interface.js";
import {Component} from "../../types/index.js";
import {LoggerInterface} from "../../libs/logger/index.js";
import {types} from "@typegoose/typegoose";
import {MachineEntity} from "./machine.entity.js";
import {CreateMachineDto} from "./dto/create-machine.dto.js";
import {DocumentType} from "@typegoose/typegoose/lib/types.js";

@injectable()
export class DefaultMachineService implements MachineServiceInterface {
    constructor(
        @inject(Component.Logger) private readonly logger: LoggerInterface,
        @inject(Component.MachineModel) private readonly machineModel: types.ModelType<MachineEntity>
    ) {
    }

    public async create(dto: CreateMachineDto): Promise<DocumentType<MachineEntity>> {
        const result = await this.machineModel.create(dto);
        this.logger.info(`New machine register: ${dto.name}`);

        return result;
    }

    public async find(): Promise<DocumentType<MachineEntity>[]> {
        return this.machineModel.find();
    }
}