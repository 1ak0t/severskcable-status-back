import {inject, injectable} from "inversify";
import {BreakServiceInterface} from "./break-service.interface.js";
import {Component} from "../../types/index.js";
import {LoggerInterface} from "../../libs/logger/index.js";
import {types} from "@typegoose/typegoose";
import {CreateBreakDto} from "./dto/create-break.dto.js";
import {DocumentType} from "@typegoose/typegoose/lib/types.js";
import {BreakEntity} from "./break.entity.js";

@injectable()
export class DefaultBreakService implements BreakServiceInterface {
    constructor(
        @inject(Component.Logger) private readonly logger: LoggerInterface,
        @inject(Component.BreakModel) private readonly breakModel: types.ModelType<BreakEntity>
    ) {
    }

    public async create(dto: CreateBreakDto): Promise<DocumentType<BreakEntity>> {
        const result = await this.breakModel.create(dto);
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
}
