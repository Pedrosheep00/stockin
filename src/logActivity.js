
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from './firebase'; 
import { auth } from './firebase'; 
export async function logActivity(actionType, detail) {
    const user = auth.currentUser;
    if (!user) return;

    // Create a new document reference with a generated id in the "activities" collection
    const activityRef = doc(collection(firestore, "activities"));

    // Set the document with the activity data
    await setDoc(activityRef, {
        userId: user.uid,
        actionType,
        detail,
        timestamp: serverTimestamp() // Uses the server's timestamp
    });
}
