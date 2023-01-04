import { UserInfo } from "./user-info.interface";

export interface User {
    userId:string,
    token:string,
    displayName:string,
    friends: UserInfo[]
  }

