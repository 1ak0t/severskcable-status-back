import {RepairStage} from "../../../types/break.type.js";

export class UpdateBreakDto {
    successPerson?: string;
    successDate?: string;
    repairingPerson?: string;
    repairingDate?: string;
    repairCompletedPerson?: string;
    repairCompletedDate?: string;
    repairEndPerson?: string;
    repairEndDate?: string;
    comment?: string;
    status?: boolean;
    stages: RepairStage | null;
    machine: string;
}