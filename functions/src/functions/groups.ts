import * as functions from "firebase-functions";
import { Balance } from "../models/balance.interface";

const GROUP_DOC_PATH:string = "groups/{groupId}";
const db:FirebaseFirestore.Firestore = functions.app.admin.firestore();

export const setGroupId = functions.firestore.document(GROUP_DOC_PATH)
    .onCreate((snap) => {
        return snap.ref.update({groupId: snap.id});
    }); 

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


