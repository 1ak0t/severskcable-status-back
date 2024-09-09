import {inject, injectable} from "inversify";
import {BreakServiceInterface} from "./break-service.interface.js";
import {Component} from "../../types/index.js";
import {LoggerInterface} from "../../libs/logger/index.js";
import {types} from "@typegoose/typegoose";
import {CreateBreakDto} from "./dto/create-break.dto.js";
import {DocumentType} from "@typegoose/typegoose/lib/types.js";
import {BreakEntity} from "./break.entity.js";
import {UpdateBreakDto} from "./dto/update-break.dto.js";
import {MachinesStatus} from "../../types/machine.type.js";
import {MachineServiceInterface} from "../machine/machine-service.interface.js";

@injectable()
export class DefaultBreakService implements BreakServiceInterface {
    constructor(
        @inject(Component.Logger) private readonly logger: LoggerInterface,
        @inject(Component.BreakModel) private readonly breakModel: types.ModelType<BreakEntity>,
        @inject(Component.MachineService) private readonly machineService: MachineServiceInterface,
    ) {
    }

    public async create(dto: CreateBreakDto): Promise<DocumentType<BreakEntity>> {
        const result = (await this.breakModel.create(dto)).populate([
            'machine',
            'registerPerson',
            'successPerson',
            'repairingPerson',
            'repairCompletedPerson'
        ]);
        this.logger.info(`New break register: ${dto.breakName}, ${dto.registerPerson}`);

        return result;
    }

    public async find(): Promise<DocumentType<BreakEntity>[]> {
        return this.breakModel.find()
            .populate([
                'machine',
                'registerPerson',
                'successPerson',
                'repairingPerson',
                'repairCompletedPerson'
            ])
            .exec();
    }

    public async updateById(breakId: string, dto: UpdateBreakDto): Promise<DocumentType<BreakEntity> | null> {
        const breaksByMachine = await this.breakModel.find({machine: dto.machine, status: false}).countDocuments();

        if (dto.status && (breaksByMachine - 1) === 0) {
            await this.machineService.updateById(dto.machine, {status: MachinesStatus.Work});
        }

        return this.breakModel
            .findByIdAndUpdate(breakId, dto, {new: true})
            .populate([
                'machine',
                'registerPerson',
                'successPerson',
                'repairingPerson',
                'repairCompletedPerson'
            ])
            .exec();
    }

    public deleteById(breakId: string): Promise<DocumentType<BreakEntity> | null> {

        return this.breakModel
            .findByIdAndDelete(breakId)
            .exec()
    }
}
