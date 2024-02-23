// Categories.js
import React, { useState, useEffect } from 'react';
import './CSSs/Categories.css';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from './firebase'; // Adjust the import path as necessary

const Categories = () => {
  // State to keep track of the categories and overlay visibility
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'Categories'));
      setCategories(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    fetchCategories();
  }, []);

  // Function to toggle the visibility of the overlay
  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  // Function to handle file selection and upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error('No file selected.');
      return;
    }
    const imageRef = ref(storage, `categories/${file.name}`);
    const uploadResult = await uploadBytes(imageRef, file);
    const imageUrl = await getDownloadURL(uploadResult.ref);
    setNewCategoryImage(imageUrl);
  };

  // Function to handle adding a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName || !newCategoryImage) {
      console.error('Name and image are required to add a new category.');
      return;
    }
    const docRef = await addDoc(collection(firestore, 'Categories'), {
      name: newCategoryName,
      imageUrl: newCategoryImage
    });
    setCategories([...categories, { name: newCategoryName, imageUrl: newCategoryImage, id: docRef.id }]);
    setNewCategoryName('');
    setNewCategoryImage('');
    toggleOverlay();
  };

  return (
    <>
      <div className="add-category-container">
        <button onClick={toggleOverlay}>Add Category</button>
      </div>
      {overlayVisible && (
        <div className="overlayAddCategories">
          <div className="overlay-content">
            <form onSubmit={handleAddCategory}>
              <label>
                Category Name:
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </label>
              <label>
                Category Image:
                <input
                  type="file"
                  onChange={handleImageUpload}
                />
              </label>
              {newCategoryImage && <img src={newCategoryImage} alt="New Category Preview" />}
              <button type="submit">Save Category</button>
            </form>
            <button onClick={toggleOverlay}>Close</button>
          </div>
        </div>
      )}
      <div className="categories-container">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <img src={category.imageUrl} alt={category.name} className="category-image" />
            <div className="category-info">
              <h3 className="category-name">{category.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Categories;
