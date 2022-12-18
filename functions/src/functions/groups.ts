
import * as functions from "firebase-functions";
import {GroupInfo} from "../models/group-info.interface";

const db = functions.app.admin.firestore();

export const setGroupQuickInfo = functions.firestore.document("groups/{groupId}")
.onCreate(async (snap) => {
    const value = snap.data();
    const groupInfo:GroupInfo = {
        title:value.title,
        groupId:snap.id,
        memberNames: value.memberNames,
        members:value.members,
        created: value.created
    }

   return db.collection("groupinfo").doc(snap.id).create(groupInfo)
});

export const setGroupId = functions.firestore.document("groups/{groupId}")
.onCreate((snap) => {
    return snap.ref.update({groupId: snap.id});
}); 

