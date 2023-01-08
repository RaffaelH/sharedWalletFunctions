import { UserInfo } from "./user-info.interface";

export interface Group{
    groupId: string,
    title: string,
    members: UserInfo[],
    owner:string,
    created: Date,
}