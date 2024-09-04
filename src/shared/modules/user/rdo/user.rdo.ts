import {Expose} from "class-transformer";

export class UserRdo {
    @Expose()
    public surname: string;

    @Expose()
    public name: string;

    @Expose()
    public middleName: string;

    @Expose()
    public email: string;

    @Expose()
    public role: string;
}