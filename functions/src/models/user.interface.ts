export interface User {
    role: UserRole,
    groups: string[],
  }

export enum UserRole{
    Admin = "admin",
    User = "user",
}