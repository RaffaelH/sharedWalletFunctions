export interface Transaction{
    transactionId:string,
    groupId:string,
    description: string,
    creditorId:string,
    creditor:string,
    debtors:string [],
    amount:number,
    created:number
}