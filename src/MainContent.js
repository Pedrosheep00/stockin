// src/components/MainComponent.js
import React, { useState, useEffect } from 'react';
import { auth, firestore, storage } from './firebase';
import { collection, query, where, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './CSSs/MainContent.css';

const MainComponent = () => {
  const [cards, setCards] = useState([]);
  const [newCardData, setNewCardData] = useState({ imageUrl: '', name: '', amount: '' });
  const [showAddItemOverlay, setShowAddItemOverlay] = useState(false);
  const [showCardInfoOverlay, setShowCardInfoOverlay] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      if (user) {
        fetchData(user.uid);
      }
    });

    return unsubscribe;
  }, []);

  const fetchData = async (userId) => {
    const userCardsCollection = collection(firestore, `cards`);
    const q = query(userCardsCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    setCards(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
      imageUrl: downloadURL,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCardData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddCard = async (event) => {
    event.preventDefault();
    if (!newCardData.name || !newCardData.amount || !newCardData.imageUrl || !user) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const docRef = await addDoc(collection(firestore, 'cards'), {
      name: newCardData.name,
      amount: Number(newCardData.amount),
      imageUrl: newCardData.imageUrl,
      userId: user.uid,
    });
    setCards(prevCards => [...prevCards, { id: docRef.id, ...newCardData }]);
    setNewCardData({ imageUrl: '', name: '', amount: '' });
    setShowAddItemOverlay(false);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowCardInfoOverlay(true);
  };

  const closeCardInfoOverlay = () => {
    setShowCardInfoOverlay(false);
    setSelectedCard(null);
  };

  return (
    <div className="main-container">
      <div className="pagination-buttons">
        <button className="add-item-button" onClick={() => setShowAddItemOverlay(true)}>Add Item</button>
      </div>

      <div className="card-container">
        {cards.map((card) => (
          <div className="card" key={card.id} onClick={() => handleCardClick(card)}>
            <div className="image-placeholder">
              {card.imageUrl && <img src={card.imageUrl} alt={`Card ${card.name}`} />}
            </div>
            <div className="card-content">
              <span className="item-name">{card.name}</span>
              <span className="item-number">{card.amount}</span>
            </div>
          </div>
        ))}
      </div>

      {showAddItemOverlay && (
        <div className="mainOverlay">
          <div className="add-item-overlay">
            <form onSubmit={handleAddCard}>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <input type="text" placeholder="Name" name="name" value={newCardData.name} onChange={handleInputChange} />
              <input type="number" placeholder="Amount" name="amount" value={newCardData.amount} onChange={handleInputChange} />
              <button type='submit'>SUBMIT</button>
                <button onClick={() => setShowAddItemOverlay(false)}>CANCEL</button>
            </form>
              </div>
            </div>
        )}

        {showCardInfoOverlay && selectedCard && (
        <div className="overlayCardInfo">
            <div className="card-info-content">
            <div className="card-info-header">
                <h3>Name: {selectedCard.name}</h3>
                <button onClick={closeCardInfoOverlay} className="close-overlay">X</button>
            </div>
            <img src={selectedCard.imageUrl} alt={selectedCard.name} className="card-info-image" />
            <div className="card-info-details">
                <p><strong>Minimum:</strong> {selectedCard.minimum}</p>
                <p><strong>Quantity:</strong> {selectedCard.quantity}</p>
                <p><strong>Category:</strong> {selectedCard.category}</p>
                <p><strong>Item ID:</strong> {selectedCard.id}</p>
            </div>
            <div className="card-info-actions">
                <button className="info-action-button">Supplier</button>
                <button className="info-action-button">Dashboard</button>
            </div>
            </div>
        </div>

      
      )};
    </div>
 
    );

};

export default MainComponent;
