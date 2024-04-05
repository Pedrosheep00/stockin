import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from './firebase'; // Make sure to import your firestore instance correctly

// Create a context
const UserContext = createContext();

// Create a custom hook to use the user context
export const useUser = () => useContext(UserContext);

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Fetch the user profile from Firestore
        const userProfileRef = doc(firestore, 'userProfiles', user.uid);
        const userProfileDoc = await getDoc(userProfileRef);
        if (userProfileDoc.exists()) {
          setUserProfile(userProfileDoc.data());
        } else {
          // Handle case where profile document does not exist
          // This might be the place to create a default profile doc or manage a new user profile setup
          setUserProfile(null);
        }
      } else {
        // User is signed out
        setUserProfile(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, userProfile }}>
      {children}
    </UserContext.Provider>
  );
};
