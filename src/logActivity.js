// In a new file, e.g., logActivity.js
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from './firebase'; // adjust the import path as needed
import { auth } from './firebase'; // adjust the import path as needed
export async function logActivity(actionType, detail) {
    const user = auth.currentUser; // get the current user
    if (!user) return;

    // Create a new document reference with a generated id in the "activities" collection
    const activityRef = doc(collection(firestore, "activities"));

    // Set the document with your activity data
    await setDoc(activityRef, {
        userId: user.uid,
        actionType,
        detail,
        timestamp: serverTimestamp() // Uses the server's timestamp
    });
}
