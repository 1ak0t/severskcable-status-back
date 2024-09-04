import {DocumentType} from "@typegoose/typegoose/lib/types.js";
import {CreateBreakDto} from "./dto/create-break.dto.js";
import {BreakEntity} from "./break.entity.js";

export interface BreakServiceInterface {
    create(dto: CreateBreakDto): Promise<DocumentType<BreakEntity>>;
    find(): Promise<DocumentType<BreakEntity>[]>;
}