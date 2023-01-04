import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { UserInfo } from "firebase-admin/lib/auth/user-record";

const INVITE_DOC_PATH:string = "invites/{inviteId}";
const db:FirebaseFirestore.Firestore = functions.app.admin.firestore();

export const setRequestId = functions.firestore.document(INVITE_DOC_PATH)
.onCreate((snap) => {
    return snap.ref.update({requestId: snap.id});
});

export const sendFriendRequestMessage = functions.firestore.document(INVITE_DOC_PATH)
.onCreate(async(snap) => {
    const value = snap.data();
    await db.collection('tokens').where('userId','==',value.invitedId).get().then(result => {
       result.docs.map(doc =>{
        const payload = {
            notification: {
              title: 'Neue Freundschaftsanfrage!',
              body: `${value.inviterName} hat dir eine Freundschaftsanfrage gesendet.`
            }
          } 
          const options = {
            priority: 'high',
            contentAvailable: true,
            timeToLive: 60*60*24
        };

          const token:string = doc.data().token;
            functions.logger.log(token);

          return admin.messaging().sendToDevice(token,payload,options).then((response:any)=>{
            functions.logger.log('Nachricht wurde gesendet',response);
                return response;
                }).catch((error:any)=>{
                    functions.logger.log("Error beim versenden der Nachricht", error);
                });
        });
    });
});


export const addFriend = functions.firestore.document(INVITE_DOC_PATH)
.onUpdate(async (changes) =>{
  const valueAfter = changes.after.data();

  if(!valueAfter.declined){

     


  }else{
        return;
  }

});
