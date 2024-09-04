import {Expose} from "class-transformer";
import {MachinesStatus} from "../../../types/machine.type.js";

export class MachineRdo {
    @Expose()
    public _id: string;
    @Expose()
    public name: boolean;
    @Expose()
    public status: MachinesStatus;
}