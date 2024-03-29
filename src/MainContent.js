import React, { useState, useEffect } from 'react';
import { auth, firestore, storage } from './firebase';
import { collection, query, where, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './CSSs/MainContent.css';

export const MainComponent = () => {
  const [cards, setCards] = useState([]);
  const [newCardData, setNewCardData] = useState({ imageUrl: '', name: '', amount: '', minimum: '', category: '' });
  const [showAddItemOverlay, setShowAddItemOverlay] = useState(false);
  const [showCardInfoOverlay, setShowCardInfoOverlay] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]); // Changed to categories and initialized as an array
  const [showEditItemOverlay, setShowEditItemOverlay] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        setUser(user);
        if (user) {
          await fetchData(user.uid);
          await fetchCategories();
        }
      });

      return () => unsubscribe();
    }, []);

    const fetchData = async (userId) => {
      const userCardsCollection = collection(firestore, 'cards');
      const q = query(userCardsCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      setCards(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleLowStockChange = (e) => setLowStockOnly(e.target.checked);

  const filteredCards = cards.filter(card => {
    const searchMatch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const lowStock = card.amount <= card.minimum;
    return (lowStockOnly ? lowStock : true) && searchMatch;
  });

  const handleDeleteCard = async (cardId) => {
      if (window.confirm("Are you sure you want to delete this item?")) {
        const cardDocRef = doc(firestore, "cards", cardId);
        await deleteDoc(cardDocRef);
        setCards(cards.filter((card) => card.id !== cardId));
      }
  };

  const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'Categories'));
      setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const uniqueFileName = `${Date.now()}-${file.name}`;
    const fileRef = ref(storage, `images/${uniqueFileName}`);
    const uploadResult = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);
    setNewCardData(prevState => ({
      ...prevState,
      imageUrl: downloadURL
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCardData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditingCard(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const uniqueFileName = `${Date.now()}-${file.name}`;
    const fileRef = ref(storage, `images/${uniqueFileName}`);
    const uploadResult = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);
    setEditingCard(prevState => ({
      ...prevState,
      imageUrl: downloadURL
    }));
  };

 

  const handleAddCard = async (event) => {
    event.preventDefault();
    if (!newCardData.name || !newCardData.amount || !newCardData.imageUrl || !user || !newCardData.category || !newCardData.minimum) {
      alert('Please fill in all fields and select a category before submitting.');
      return;
    }

    const docRef = await addDoc(collection(firestore, 'cards'), {
      name: newCardData.name,
      amount: Number(newCardData.amount),
      imageUrl: newCardData.imageUrl,
      category: newCardData.category,
      minimum: Number(newCardData.minimum),
      userId: user.uid
    });

    setCards(prevCards => [...prevCards, { id: docRef.id, ...newCardData }]);
    setNewCardData({ imageUrl: '', name: '', amount: '', category: '', minimum:'' }); // Reset the form
    setShowAddItemOverlay(false);
  };

  const handleEditCardSubmit = async (event) => {
    event.preventDefault();
    if (editingCard) {
      try {
        const cardRef = doc(firestore, "cards", editingCard.id);
        await updateDoc(cardRef, {
          name: editingCard.name,
          amount: Number(editingCard.amount),
          minimum: Number(editingCard.minimum),
          category: editingCard.category,
          imageUrl: editingCard.imageUrl,
        });
        const updatedCards = cards.map(card => card.id === editingCard.id ? {...editingCard} : card);
        setCards(updatedCards);
        setShowEditItemOverlay(false);
        setEditingCard(null); // Reset editing card
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  const getCardClass = (amount, minimum) => {
    if (amount < minimum) return 'card card-danger';
    if (amount === minimum || amount === minimum + 1) return 'card card-warning';
    return 'card'; // default class if stock is adequate
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowCardInfoOverlay(true);
  };

  const closeCardInfoOverlay = () => {
    setShowCardInfoOverlay(false);
    setSelectedCard(null);
  };

  
  const handleEditClick = (event, card) => {
    event.preventDefault(); // This is the correct usage of event.preventDefault
    event.stopPropagation(); // Stops the click from reaching higher elements
    setEditingCard(card);
    setShowEditItemOverlay(true);
  
    // Proceed to set the state to display the edit overlay
    setEditingCard(card);
    setShowEditItemOverlay(true);
    // Make sure to hide the card info overlay if it's open
    setShowCardInfoOverlay(false);
  };
  return (
    <div className="main-container">
      
      <div className="control-panel">
        <button className="add-item-button" onClick={() => setShowAddItemOverlay(true)}>Add Item</button>

        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-bar"
          />
        </div>

        <div className="low-stock-checkbox">
          <input
            type="checkbox"
            id="low-stock-checkbox"
            checked={lowStockOnly}
            onChange={handleLowStockChange}
          />
          <label htmlFor="low-stock-checkbox">Low Stock</label>
        </div>
      </div>

    
      <div className="card-container">
  {filteredCards.map((card) => {
    // Now use the getCardClass function to determine the class for each card
    const cardClass = getCardClass(card.amount, card.minimum);

    return (
      <div className={cardClass} key={card.id} onClick={() => handleCardClick(card)}>
        <div className="image-placeholder">
          {card.imageUrl ? <img src={card.imageUrl} alt={`Card ${card.name}`} /> : 'No Image'}
        </div>
        <div className="card-content">
          <span className="item-name">{card.name}</span>
          <br></br>
          <span className="item-number">{card.amount}</span>
        </div>
        <div className="card-actions">
          <button onClick={(e) => handleEditClick(e, card)}>Edit</button>
          <button onClick={(e) => { e.stopPropagation(); handleDeleteCard(card.id); }} className="delete-button">Delete</button>
        </div>
      </div>
    );
  })}
</div>
  
      {showAddItemOverlay && (
        <div className="mainOverlay">
          <div className="add-item-overlay">
            <form onSubmit={handleAddCard}>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <input type="text" placeholder="Name" name="name" value={newCardData.name} onChange={handleInputChange} />
              <input type="number" placeholder="Amount" name="amount" value={newCardData.amount} onChange={handleInputChange} />
              <input type="number" placeholder="Minimum Amount" name="minimum" value={newCardData.minimum} onChange={handleInputChange} />
              <select name="category" value={newCardData.category} onChange={handleInputChange}>
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <button type="submit">SUBMIT</button>
              <button type="button" onClick={() => setShowAddItemOverlay(false)}>CANCEL</button>
            </form>
          </div>
        </div>
      )}
  
      
  
      {showCardInfoOverlay && selectedCard && (
        <div className="overlayCardInfo">
          <div className="card-info-content">
            <div className="card-info-header">
              <h3>{selectedCard.name}</h3>
              <button onClick={closeCardInfoOverlay} className="close-overlay">X</button>
            </div>
            <img src={selectedCard.imageUrl} alt={selectedCard.name} className="card-info-image" />
            <div className="card-info-details">
              <p><strong>Minimum Amount:</strong> {selectedCard.minimum}</p>
              <p><strong>Quantity:</strong> {selectedCard.amount}</p>
              <p><strong>Category:</strong> {selectedCard.category}</p>
              <p><strong>Item ID:</strong> {selectedCard.id}</p>
            </div>
            <div className="card-info-actions">
              <button className="info-action-button">Supplier</button>
              <button className="info-action-button">Dashboard</button>
            </div>
          </div>
        </div>
      )}

      {showEditItemOverlay && editingCard && (
              <div className="edit-item-overlay">
                <form onSubmit={handleEditCardSubmit}>
                  <input type="file" accept="image/*" onChange={handleEditFileChange} />
                  <input type="text" name="name" value={editingCard.name} onChange={handleEditInputChange} placeholder="Name" />
                  <input type="number" name="amount" value={editingCard.amount} onChange={handleEditInputChange} placeholder="Amount" />
                  <input type="number" name="minimum" value={editingCard.minimum} onChange={handleEditInputChange} placeholder="Minimum Amount" />
                  <br></br>
                  <select name="category" value={editingCard.category} onChange={handleEditInputChange}>
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <br></br>
                  <button type="submit">Update Item</button>
                  <br></br>
                  <button type="button" onClick={() => setShowEditItemOverlay(false)}>Cancel</button>
                </form>
              </div>
            )}
    </div>
  );
  
};

export default MainComponent;
