import {DocumentType} from "@typegoose/typegoose/lib/types.js";
import {SubscriptionEntity} from "./subscription.entity.js";
import {PushSubscription} from "web-push";

export interface SubscriptionServiceInterface {
    create(dto: PushSubscription): Promise<DocumentType<SubscriptionEntity>>;
    getAll(): Promise<DocumentType<SubscriptionEntity>[]>;
}