import * as functions from "firebase-functions";

const TRANSACTION_DOC_PATH:string = "transactions/{transactionId}";
const db:FirebaseFirestore.Firestore = functions.app.admin.firestore();

export const updateCreditorBalance = functions.firestore.document(TRANSACTION_DOC_PATH)
    .onCreate(async(snap) => {
        
        const value = snap.data();
        const debtors = value.debtors;
        const groupSize = value.debtors.length +1;
        
        await db.collection('balance').where('groupId','==',value.groupId)
        .where('userId','==',value.creditorId).get().then( result => {
                result.docs.map( async doc => {
                    functions.logger.log(doc);
                    const oldAmount:number = doc.data().amount;
                    const toPay:number = value.amount/groupSize
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
            await db.collection('balance').where('groupId','==',value.groupId)
            .where('userId','==',debtors[i]).get().then( result => {
                    result.docs.map( async doc => {
                        const oldAmount:number = doc.data().amount;
                        const toPay:number = value.amount/groupSize
                        const newAmount:number = oldAmount - toPay;
                        const roundedAmount = Math.round(newAmount*100)/100;
                   
                        return doc.ref.update("amount", roundedAmount);
                    })
            });
        }
});

export const sendNewTransactionMessage = functions.firestore.document(TRANSACTION_DOC_PATH)
    .onCreate(async (snap) => {
        const value = snap.data();
        const debtors = value.debtors;
        
        for(let i = 0; i < debtors.length; i++){
            await db.collection('tokens').where('userId','==',debtors).get().then(result => {

                result.docs.map(doc =>{
                    const payload = {
                        notification: {
                          title: 'Neue Transaktion!',
                          body: `${value.creditorName} hat eine Transaktion getätigt.`
                        }
                      } 
                      const options = {
                        priority: 'high',
                        contentAvailable: true,
                        timeToLive: 60*60*24
                    };
                    const token:string = doc.data().token;

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