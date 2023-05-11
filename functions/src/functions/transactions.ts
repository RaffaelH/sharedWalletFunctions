import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const TRANSACTION_DOC_PATH:string = "transactions/{transactionId}";
const db:FirebaseFirestore.Firestore = functions.app.admin.firestore();

export const updateBalance = functions.firestore.document(TRANSACTION_DOC_PATH)
    .onCreate(async(snap) => {
        
        const value = snap.data();
        const debtors:string[] = value.debtors;
        const creditorId:string = value.creditorId;
        const groupId:string = value.groupId;
        const groupSize:number = debtors.length +1;

        await db.collection('balance').where('userId','==',creditorId)
        .where('groupId','==',groupId).get().then( result => {
                result.docs.map( async doc => {
                    functions.logger.log(doc.data());
                    const oldAmount:number = doc.data().amount;
                    const toPay:number = Math.round(value.amount/groupSize* 100) / 100 
                    functions.logger.log("GroupSize",groupSize);
                    functions.logger.log("toPay",toPay);
                    functions.logger.log("oldAmount",oldAmount);
                    const newAmount:number = oldAmount + value.amount - toPay;
                    const roundedAmount = Math.round(newAmount*100)/100;
                    functions.logger.log("oldAmount: ",oldAmount);
      
                    functions.logger.log("toPay: ",toPay);
                    functions.logger.log("newAmount: ",newAmount);
                    functions.logger.log("roundedAmount: ",roundedAmount);
                    return doc.ref.update("amount", roundedAmount);
                })
        });

        for(let i = 0; i < debtors.length; i++){
            await db.collection('balance').where('userId','==',debtors[i])
            .where('groupId','==',groupId).get().then( result => {
                    result.docs.map( async doc => {
                        const oldAmount:number = doc.data().amount;

                        const newAmount:number = oldAmount - value.amount/groupSize;
                        return doc.ref.update("amount", newAmount);
                    })
            });
        }
});

export const sendNewTransactionMessage = functions.firestore.document(TRANSACTION_DOC_PATH)
    .onCreate(async (snap) => {
        const value = snap.data();
        const debtors = value.debtors;
        
        for(let i = 0; i < debtors.length; i++){
            await db.collection('tokens').where('userId','==',debtors[i]).get().then(result => {
                result.docs.map(doc =>{
                    const payload = {
                        notification: {
                          title: 'Neue Transaktion!',
                          body: `${value.creditor} hat eine Transaktion getätigt.`
                        }
                      } 
                      const options = {
                        priority: 'high',
                        contentAvailable: true,
                        timeToLive: 60*60*24
                    };
                    const token:string = doc.data().token;
                    functions.logger.log("Transaction",token);

                    return admin.messaging().sendToDevice(token,payload,options).then((response:any)=>{
                        functions.logger.log('Nachricht wurde gesendet',response);
                            return response;
                            }).catch((error:any)=>{
                                functions.logger.log("Error beim versenden der Nachricht", error);
                            });
                });
        
            });
        }    
    }); 