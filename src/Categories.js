// Categories.js
import React, { useState, useEffect } from 'react';
import { firestore } from './firebase'; // Ensure this import points to your Firebase config file
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth'; // Ensure this hook is properly implemented
import './CSSs/Categories.css'; // Ensure the CSS file path is correct

// CategoryCard component
const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/categories/${category.id}`); // Adjust if you have a different route for category detail
  };

  return (
    <div className="category-card" onClick={handleCategoryClick}>
      <img src={category.imageUrl} alt={category.name} className="category-image" />
      <h3 className="category-name">{category.name}</h3>
    </div>
  );
};

// CategoriesPage component
const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImageUrl, setNewCategoryImageUrl] = useState('');
  const { currentUser } = useAuth(); // Hook to get the current user
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      fetchCategories();
    }
  }, [currentUser, navigate]);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'categories'));
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName || !newCategoryImageUrl) {
      alert('Please fill in both the category name and image URL.');
      return;
    }

    try {
      await addDoc(collection(firestore, 'categories'), {
        name: newCategoryName,
        imageUrl: newCategoryImageUrl
      });
      setNewCategoryName('');
      setNewCategoryImageUrl('');
      fetchCategories(); // Refresh the categories list
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  // Render the category cards and add new category form
  return (
    <div className="categories-container">
      <div className="add-category-form">
        <input
          type="text"
          placeholder="Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newCategoryImageUrl}
          onChange={(e) => setNewCategoryImageUrl(e.target.value)}
        />
        <button onClick={handleAddCategory}>Add New Category</button>
      </div>
      {categories.length > 0 ? (
        categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))
      ) : (
        <div>No categories found</div>
      )}
    </div>
  );
};

export default CategoriesPage;