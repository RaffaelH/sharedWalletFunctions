import * as functions from "firebase-functions";

const TRANSACTION_DOC_PATH:string = "transactions/{transactionId}";
const db:FirebaseFirestore.Firestore = functions.app.admin.firestore();

export const updateCreditorBalance = functions.firestore.document(TRANSACTION_DOC_PATH)
    .onCreate(async(snap) => {
        
        const value = snap.data();
        const debtors = value.debtors;
        
        await db.collection('balance').where('groupId','==',value.groupId)
        .where('userId','==',value.creditorId).get().then( result => {
                result.docs.map( async doc => {
                    const oldAmount:number = doc.data().amount;
                    const newAmount:number = oldAmount + ((debtors.length-1)*value.amount/debtors.length);
                    return doc.ref.update("amount", newAmount);
                })
        });

        for(let i = 0; i < debtors.length; i++){
            await db.collection('balance').where('groupId','==',value.groupId)
            .where('userId','==',debtors[i]).get().then( result => {
                    result.docs.map( async doc => {
                        const oldAmount:number = doc.data().amount;
                        const newAmount:number = oldAmount - value.amount/debtors.length;
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