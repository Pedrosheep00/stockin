import React, { useState } from 'react';
import { auth, firestore, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import './CSSs/ProfilePage.css';

const ProfilePage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) return;

        const userId = auth.currentUser.uid;
        const imageRef = ref(storage, `profileImages/${userId}/profile.jpg`);
        setUploading(true);

        // Upload the image to Firebase Storage
        const snapshot = await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(snapshot.ref);

        // Save the profile information along with the image URL in Firestore
        await setDoc(doc(firestore, 'userProfiles', userId), {
            name,
            description,
            location,
            imageUrl
        });

        setUploading(false);
        // Redirect or inform the user of success
    };

    return (
        <div className="profile-container">
            <div className="profile-image-placeholder">
                {/* If you want to show the selected image before uploading */}
                {image && <img src={URL.createObjectURL(image)} alt="Profile preview" />}
            </div>
            <form className="profile-form" onSubmit={handleSubmit}>
                <input
                    className="profile-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`Name: ${name}`}
                />
                <input
                    className="profile-input"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={`Description: ${description}`}
                />
                <input
                    className="profile-input"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={`Details: ${location}`}
                />
                <input
                    className="profile-file-input"
                    type="file"
                    onChange={handleImageChange}
                />
                <button className="profile-submit" type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;
