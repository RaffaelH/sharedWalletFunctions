export interface User {
    balance:number,
    role: UserRole,
    groups: string[],
    friends: string[]
  }

export enum UserRole{
    Admin = "admin",
    User = "user",
}