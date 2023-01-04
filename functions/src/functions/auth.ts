import * as functions from "firebase-functions";
import {User} from "../models/user.interface";

const db:FirebaseFirestore.Firestore = functions.app.admin.firestore();

export const initUserData = functions.auth.user().onCreate(async (data) => {
    
    const user: User = {
        userId: data.uid,
        displayName:"",
        token: "",
        friends: []
    }
    await db.collection("users").doc(data.uid).create(user);
})

