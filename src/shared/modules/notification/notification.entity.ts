import {defaultClasses, getModelForClass, modelOptions, prop} from "@typegoose/typegoose";

export interface NotificationEntity extends defaultClasses.Base {}

@modelOptions({
    schemaOptions: {
        collection: 'notifications',
        timestamps: true
    }
})
export class NotificationEntity extends defaultClasses.TimeStamps {
    @prop({required: true})
    public title: string;
    @prop({required: true})
    public text: string;
}

export const NotificationModel = getModelForClass(NotificationEntity);

