import {CreateMachineDto} from "./dto/create-machine.dto.js";
import {DocumentType} from "@typegoose/typegoose/lib/types.js";
import {MachineEntity} from "./machine.entity.js";

export interface MachineServiceInterface {
    create(dto: CreateMachineDto): Promise<DocumentType<MachineEntity>>;
    find(): Promise<DocumentType<MachineEntity>[]>;
}