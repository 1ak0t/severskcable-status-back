import {UserRoles, UserType} from "../../types/user.type.js";
import {defaultClasses, getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import {createSHA256} from "../../helpers/index.js";

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
    schemaOptions: {
        collection: 'users',
        timestamps: true
    }
})
export class UserEntity extends defaultClasses.TimeStamps implements UserType {
    @prop({required: true})
    public surname: string;

    @prop({required: true})
    public name: string;

    @prop({required: true})
    public middleName: string;

    @prop({type: String,
        unique: true,
        match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
        required: true})
    public email: string;

    @prop({
        required: true,
        type: String,
        enum: UserRoles,
    })
    public role: UserRoles[];

    @prop({required: true})
    public password?: string;

    constructor(userData: UserType) {
        super();

        this.email = userData.email;
        this.surname = userData.surname;
        this.name = userData.name;
        this.middleName = userData.middleName;
        this.role = userData.role;
    }

    public setPassword(password: string, salt: string) {
        this.password = createSHA256(password, salt);
    }

    public getPassword() {
        return this.password;
    }
}

export const UserModel = getModelForClass(UserEntity);