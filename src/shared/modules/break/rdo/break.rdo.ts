import {RepairStage} from "../../../types/break.type.js";
import {Expose, Type} from "class-transformer";
import {MachineRdo} from "../../machine/rdo/machine.rdo.js";
import {UserRdo} from "../../user/index.js";

export class BreakRdo {
    @Expose()
    public _id: string;
    @Expose()
    public breakName: string;
    @Expose()
    @Type(() => UserRdo)
    public registerPerson: UserRdo;
    @Expose()
    public registerDate: string;
    @Expose()
    @Type(() => UserRdo)
    public successPerson?: UserRdo;
    @Expose()
    public successDate?: string;
    @Expose()
    @Type(() => UserRdo)
    public repairingPerson?: UserRdo;
    @Expose()
    public repairingDate?: string;
    @Expose()
    @Type(() => UserRdo)
    public repairCompletedPerson?: UserRdo;
    @Expose()
    public repairCompletedDate?: string;
    @Expose()
    @Type(() => UserRdo)
    public repairEndPerson?: UserRdo;
    @Expose()
    public repairEndDate?: string;
    @Expose()
    public comment?: string;
    @Expose()
    public priority: number;
    @Expose()
    public status: boolean;
    @Expose()
    public stages: null | RepairStage;

    @Expose()
    @Type(() => MachineRdo)
    public machine: MachineRdo;
}