import {RepairStage} from "../../../types/break.type.js";

export class CreateBreakDto {
    breakName: string;
    registerPerson: string;
    registerDate: string;
    priority: number;
    status: boolean;
    stages: null | RepairStage;
    machineId: string;
}