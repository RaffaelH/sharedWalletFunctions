import { Transaction } from "./transaction.interface"

export interface Group{
    groupId: string,
    title: string,
    memberNames: Array<string>,
    memberId: Array<string>,
    owner:string,
    created: Date,
    transactions: Array<Transaction>
}