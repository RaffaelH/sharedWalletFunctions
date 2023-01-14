import * as functions from "firebase-functions";
import { Balance } from "../models/balance.interface";
import * as admin from "firebase-admin";

const GROUP_DOC_PATH:string = "groups/{groupId}";
const db:FirebaseFirestore.Firestore = functions.app.admin.firestore();

export const setNewMemberBalance = functions.firestore.document(GROUP_DOC_PATH)
    .onUpdate(async (snap) => {
        
        const value = snap.after.data();

        const memberIds:Array<string> = value.memberIds;
        const lastIndex:number = memberIds.length -1;

        const balance:Balance = {
            groupId: value.groupId,
            userId: value.memberIds[lastIndex],
            amount: 0.0
        }
        await db.collection("balance").doc().create(balance);

    });

export const sendNewMemberMessage = functions.firestore.document(GROUP_DOC_PATH)
    .onUpdate(async (snap)=>{
        const value = snap.after.data();

        const memberIds:Array<string> = value.memberIds;
        const lastIndex:number = memberIds.length -1;
        
        await db.collection('tokens').where('userId','==',memberIds[lastIndex]).get().then(result => {
            result.docs.map(doc =>{
                const payload = {
                    notification: {
                      title: `Neue Gruppe!`,
                      body: `Du wurdest zu einer neuen Gruppe hinzugefügt.`
                    }
                  } 
                  const options = {
                    priority: 'high',
                    contentAvailable: true,
                    timeToLive: 60*60*24
                };
                const token:string = doc.data().token; 
                functions.logger.log("Group",token);

                return admin.messaging().sendToDevice(token,payload,options).then((response:any)=>{
                    functions.logger.log('Nachricht wurde gesendet',response);
                        return response;
                        }).catch((error:any)=>{
                            functions.logger.log("Error beim versenden der Nachricht", error);
                        });
            });
    
        });


    });


