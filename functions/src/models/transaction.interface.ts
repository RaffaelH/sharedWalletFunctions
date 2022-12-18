export interface Transaction{

    creditorId:string,
    creditor:string,
    debtors:Map<string,number>,
    amount:number,
    created:Date
}