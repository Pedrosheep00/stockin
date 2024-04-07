import React, { useState, useEffect } from 'react';
import './CSSs/Categories.css';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage, auth } from './firebase';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch categories on component mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchCategories(user.uid);
      } else {
        setCategories([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch categories from Firestore
  const fetchCategories = async (userId) => {
    const q = query(collection(firestore, 'Categories'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    setCategories(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  const toggleOverlay = () => setOverlayVisible(!overlayVisible);

  
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error('No file selected.');
      return;
    }
    const imageRef = ref(storage, `categories/${Date.now()}-${file.name}`);
    const uploadResult = await uploadBytes(imageRef, file);
    const imageUrl = await getDownloadURL(uploadResult.ref);
    setNewCategoryImage(imageUrl);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const userId = auth.currentUser.uid;
    if (!newCategoryName || !newCategoryImage) {
      console.error('Name and image are required to add a new category.');
      return;
    }
    await addDoc(collection(firestore, 'Categories'), {
      name: newCategoryName,
      imageUrl: newCategoryImage,
      userId: userId
    });
    setNewCategoryName('');
    setNewCategoryImage('');
    toggleOverlay();
    fetchCategories(userId);
  };

  const handleDeleteCategory = async (e, categoryId) => {
    e.stopPropagation(); // Prevent navigation

    const confirmation = window.confirm('Are you sure you want to delete this category?');
    if (confirmation) {
      await deleteDoc(doc(firestore, 'Categories', categoryId));
      fetchCategories(auth.currentUser.uid);
    }
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
              <label>Category Name:
                <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
              </label>
              <label>Category Image:
                <input type="file" onChange={handleImageUpload} />
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
          <div key={category.id} className="category-card" onClick={() => navigate(`/categories/${category.name}`)}>
            <img src={category.imageUrl} alt={category.name} className="category-image" />
            <div className="category-info">
              <h3 className="category-name">{category.name}</h3>
              <button className="delete-category-button" onClick={(e) => handleDeleteCategory(e, category.id)}>Delete Category</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Categories;
