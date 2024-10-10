import {Expose} from "class-transformer";

export class NotificationRdo {
    @Expose()
    public id: string;
    @Expose()
    public title: string;
    @Expose()
    public text: string;
    @Expose()
    public createdAt: string;
}