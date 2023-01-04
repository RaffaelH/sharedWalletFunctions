export interface Transaction{
    transactionId:string,
    groupId:string,
    creditorId:string,
    creditor:string,
    debtors:Map<string,number>,
    amount:number,
    created:number
}