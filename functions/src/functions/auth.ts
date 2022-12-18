import * as functions from "firebase-functions";
import {User, UserRole} from "../models/user.interface";

const db = functions.app.admin.firestore();

export const initUserData = functions.auth.user()
.onCreate(async (data) => {
    
    const user: User = {
        balance: 0,
        role: UserRole.User,
        groups: [],
        friends:[],
    }
    await db.collection("users").doc(data.uid).create(user);
})

