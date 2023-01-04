
import * as functions from "firebase-functions";

const GROUP_DOC_PATH:string = "groups/{groupId}";

export const setGroupId = functions.firestore.document(GROUP_DOC_PATH)
.onCreate((snap) => {
    return snap.ref.update({groupId: snap.id});
}); 

