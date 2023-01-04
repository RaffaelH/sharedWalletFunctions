import * as functions from "firebase-functions";
import { Token } from "../models/token.interface";
import { UserInfo } from "../models/user-info.interface";

const db = functions.app.admin.firestore();
const USER_INFO_COLLECTION = db.collection("userinfo");
const TOKEN_COLLECTION = db.collection("tokens");
const USER_DOC_PATH = "users/{userId}";

export const setUserInfo = functions.firestore.document(USER_DOC_PATH)
.onCreate((snap) => {
    const value = snap.data();
    const userInfo:UserInfo = {
        userId: snap.id,
        displayName: value.displayName
    }

   return USER_INFO_COLLECTION.doc().create(userInfo)
});

export const setRegistrationToken = functions.firestore.document(USER_DOC_PATH)
.onCreate((snap) => {
    const value = snap.data();
    const token:Token = {
        userId: snap.id,
        token: value.token
    }
   return TOKEN_COLLECTION.doc().create(token)
});

