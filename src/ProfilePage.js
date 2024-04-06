import React, { useState, useEffect } from 'react';
import { auth, firestore, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './CSSs/ProfilePage.css';
import defaultProfileImage from './assets/profile_image.jpg'; // Make sure this path is correct

const ProfilePage = () => {
    // State for managing form data and upload state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(defaultProfileImage);
    const [uploading, setUploading] = useState(false);
    const [editable, setEditable] = useState(false);

    // Load profile information
    useEffect(() => {
        const loadProfile = async () => {
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                const profileRef = doc(firestore, 'userProfiles', userId);
                const profileSnap = await getDoc(profileRef);

                if (profileSnap.exists()) {
                    const profileData = profileSnap.data();
                    setName(profileData.name);
                    setDescription(profileData.description);
                    setLocation(profileData.location);
                    setImagePreview(profileData.imageUrl);
                }
            }
        };

        loadProfile();
    }, []);
    // Handle image file selection
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setImagePreview(fileReader.result);
            };
            fileReader.readAsDataURL(e.target.files[0]);
            setImage(e.target.files[0]);
        }
    };

    // Handle profile submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add additional validation as needed
        if (!image || !name || !description || !location) return;

        const userId = auth.currentUser.uid;
        const imageRef = ref(storage, `profileImages/${userId}/profile.jpg`);
        setUploading(true);

        try {
            const snapshot = await uploadBytes(imageRef, image);
            const imageUrl = await getDownloadURL(snapshot.ref);

            await setDoc(doc(firestore, 'userProfiles', userId), {
                name,
                description,
                location,
                imageUrl
            });
            
            // Set the image preview with the uploaded image URL
            setImagePreview(imageUrl);
            // After successful submission, set editable to false
            setEditable(false);
        } catch (error) {
            console.error("Error uploading the profile information: ", error);
        }

        setUploading(false);
    };

    return (
      
        <div className="profile-container">
  {editable ? (
    <form className="profile-form" onSubmit={handleSubmit}>
      <input
        className="profile-input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        className="profile-input"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        className="profile-input"
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Details"
      />
      <div className="profile-file-input-container">
        <input
          className="profile-file-input"
          type="file"
          onChange={handleImageChange}
        />
      </div>
      <button className="profile-submit" type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Submit'}
      </button>
    </form>
  ) : (
    <>
      <div className="profile-image-placeholder">
            <img src={imagePreview || defaultProfileImage} alt="Profile" />
        </div>
        <h3>{name || 'Company Name'}</h3>
        <div className="profile-detail">
            <h4>Description</h4>
            {description || 'Description'}
        </div>
        <div className="profile-detail">
            <h4>Details</h4>
            {location || 'Details'}
        </div>
        <button className="profile-edit-button" onClick={() => setEditable(true)}>Edit Profile</button>
    </>
  )}
</div>

    );
};

export default ProfilePage;
