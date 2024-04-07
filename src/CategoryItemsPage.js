import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from './firebase';
import './CSSs/CategoryItemsPage.css';

const CategoryItemsPage = () => {
  const { categoryName } = useParams();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // selected item

  useEffect(() => {
    fetchItems();
  }, [categoryName]);

  const fetchItems = async () => {
    const itemsQuery = query(collection(firestore, 'cards'), where('category', '==', categoryName));
    const querySnapshot = await getDocs(itemsQuery);
    setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const showItemDetails = (item) => {
    setSelectedItem(item);
  };

  const closeItemDetailsOverlay = () => {
    setSelectedItem(null); // Close the overlay by setting selectedItem to null
  };

  const deleteItem = async (itemId) => {
    await deleteDoc(doc(firestore, 'cards', itemId));
    fetchItems(); // Refresh the items list after deletion
    setSelectedItem(null); // Close the overlay after deleting the item
  };

  const getCardClass = (amount, minimum) => {
    if (amount < minimum) return 'card card-danger';
    if (amount <= minimum + 1) return 'card card-warning';
    return 'card card-normal';
  };

  return (
    <div>
      <h2>{categoryName}</h2>
      <div className="cards-container">
        {items.map(item => (
          <div
            key={item.id}
            className={getCardClass(item.amount, item.minimum)}
            onClick={() => showItemDetails(item)}
          >
            <div className="image-placeholder">
              <img src={item.imageUrl || 'defaultImagePathHere'} alt={item.name} />
            </div>
            <div className="card-content">
              <h4>{item.name}</h4>
              <p>Quantity: {item.amount}</p>
              <p>Minimum Required: {item.minimum}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="category-overlay">
          <div className="category-card-info-content">
            <button onClick={closeItemDetailsOverlay}>Close</button>
            <img src={selectedItem.imageUrl} alt="Item" />
            <h3>{selectedItem.name}</h3>
            <p>Quantity: {selectedItem.amount}</p>
            <p>Minimum Required: {selectedItem.minimum}</p>
            <button onClick={() => deleteItem(selectedItem.id)}>Delete Item</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryItemsPage;
