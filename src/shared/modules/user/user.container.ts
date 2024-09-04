import {Container} from "inversify";
import {UserServiceInterface} from "./user-service.interface.js";
import {Component} from "../../types/index.js";
import {DefaultUserService} from "./default-user.service.js";
import {types} from "@typegoose/typegoose";
import {UserEntity, UserModel} from "./user.entity.js";
import {ControllerInterface} from "../../libs/rest/index.js";
import {UserController} from "./user.controller.js";

export function createUserContainer() {
    const userContainer = new Container();
    userContainer.bind<UserServiceInterface>(Component.UserService).to(DefaultUserService).inSingletonScope();
    userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
    userContainer.bind<ControllerInterface>(Component.UserController).to(UserController).inSingletonScope();

    return userContainer;
}