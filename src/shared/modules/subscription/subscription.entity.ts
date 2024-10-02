import {defaultClasses, getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
// import {UserEntity} from "../user/index.js";

export interface SubscriptionEntity extends defaultClasses.Base {}

@modelOptions({
    schemaOptions: {
        collection: 'subscriptions',
        timestamps: true
    }
})
export class SubscriptionEntity extends defaultClasses.TimeStamps{
    @prop({unique: true, required: true})
    public endpoint: string;
    @prop({required: false})
    public expirationTime: number;
    @prop()
    public keys: {
        auth: string,
        p256dh: string,
    };
    // @prop({
    //     ref: UserEntity,
    // })
    // public user?: Ref<UserEntity>;
}

export const SubscriptionModel = getModelForClass(SubscriptionEntity);