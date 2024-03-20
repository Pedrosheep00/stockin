import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from './firebase'; // Adjust the import path as necessary
import Card from './Card';
import './CSSs/CategoryItemsPage.css'; // Make sure to create this CSS file

const CategoryItemsPage = () => {
  const { categoryName } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const itemsQuery = query(
        collection(firestore, 'cards'), 
        where('category', '==', categoryName)
      );
  
      const querySnapshot = await getDocs(itemsQuery);
      setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
  
    fetchItems();
  }, [categoryName]);

  // Render the items using the Card component
  return (
    <div>
      <h2>{categoryName}</h2>
      <div className="cards-container"> {/* Add a container for styling */}
        {items.map(item => (
          <Card key={item.id} item={item} /> // Render a Card for each item
        ))}
      </div>
    </div>
  );
};

export default CategoryItemsPage;
