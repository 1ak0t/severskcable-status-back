import {inject, injectable} from "inversify";
import {SubscriptionServiceInterface} from "./subscription-service.interface.js";
import {DocumentType} from "@typegoose/typegoose/lib/types.js";
import {SubscriptionEntity} from "./subscription.entity.js";

import {Component} from "../../types/index.js";
import {types} from "@typegoose/typegoose";
import {PushSubscriptionDTO} from "./dto/create-subscription.dto.js";

@injectable()
export class SubscriptionService implements SubscriptionServiceInterface {
    constructor(
        @inject(Component.SubscriptionModel) private readonly subscriptionModel: types.ModelType<SubscriptionEntity>
    ) {}

    public async create(dto: PushSubscriptionDTO): Promise<DocumentType<SubscriptionEntity>> {
        const subsNotExp = {...dto, expirationTime: null};
        const result = await this.subscriptionModel.create(subsNotExp);

        return result;
    }

    public async getAll(): Promise<DocumentType<SubscriptionEntity>[]> {
        const subscriptions = await this.subscriptionModel.find().select("-_id -createdAt -updatedAt -__v").exec();

        return subscriptions;
    }
}