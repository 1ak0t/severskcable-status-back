import {UserServiceInterface} from "./user-service.interface.js";
import {CreateUserDto} from "./dto/create-user.dto.js";
import {UserEntity} from "./user.entity.js";
import {inject, injectable} from "inversify";
import {Component} from "../../types/index.js";
import {LoggerInterface} from "../../libs/logger/index.js";
import {DocumentType} from "@typegoose/typegoose/lib/types.js";
import {types} from "@typegoose/typegoose";

@injectable()
export class DefaultUserService implements UserServiceInterface {
    constructor(
        @inject(Component.Logger) private readonly logger: LoggerInterface,
        @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
    ) {
    }
    public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
        const user = new UserEntity(dto);
        user.setPassword(dto.password, salt);

        const result = await this.userModel.create(user);
        this.logger.info(`New user created: ${user.email}`);

        return result;
    }

    public async find(): Promise<DocumentType<UserEntity>[]> {
        const users = this.userModel.find();
        return users;
    }

    public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
        return this.userModel.findOne({email});
    }

    public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
        const existedUser = await this.findByEmail(dto.email);

        if (existedUser) {
            return existedUser;
        }

        return this.create(dto, salt);
    }
}