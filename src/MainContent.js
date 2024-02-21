import React, { useState, useEffect } from 'react';
import { auth, firestore, storage } from './firebase';
import { collection, query, where, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './CSSs/MainContent.css';

const MainComponent = () => {
    const [cards, setCards] = useState([]);
    const [newCardData, setNewCardData] = useState({
        imageUrl: '',
        name: '',
        amount: '',
    });
    const [showAddItemOverlay, setShowAddItemOverlay] = useState(false);
    const [user, setUser] = useState(null); // State to keep track of the logged-in user

    useEffect(() => {
        // Listen for changes in authentication state
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
            if (user) {
                fetchData(user.uid); // Fetch data for the logged-in user
            }
        });

        // Cleanup the subscription
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
        try {
            const uploadResult = await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(uploadResult.ref);
            setNewCardData(prevState => ({
                ...prevState,
                imageUrl: downloadURL,
            }));
        } catch (error) {
            console.error("Error uploading file: ", error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewCardData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddCard = async (event) => {
        event.preventDefault(); // Prevent the default form submission
        if (!newCardData.name || !newCardData.amount || !newCardData.imageUrl || !user) {
            alert("Please fill in all fields before submitting.");
            return;
        }

        try {
            const docRef = await addDoc(collection(firestore, 'cards'), {
                name: newCardData.name,
                amount: Number(newCardData.amount),
                imageUrl: newCardData.imageUrl,
                userId: user.uid, // Associate each product with the user's UID
            });
            setCards(prevCards => [...prevCards, { id: docRef.id, ...newCardData }]);
            setNewCardData({ imageUrl: '', name: '', amount: '' });
            setShowAddItemOverlay(false);
        } catch (error) {
            console.error("Error adding card to Firestore: ", error);
        }
    };

    const generateSquares = async () => {
        try {
            const cardsCollection = collection(firestore, 'cards');
            const querySnapshot = await getDocs(cardsCollection);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (error) {
            console.error('Error fetching cards from Firestore:', error);
            return [];
        }
    };

    return (
        
        <div className="main-container">
            <div className="pagination-buttons">
            <button className="add-item-button" onClick={() => setShowAddItemOverlay(true)}>Add Item</button>
            </div>
          <div className="card-container">
            {cards.map((card, index) => (
              <div className="card" key={index}>
                <div className="image-placeholder">
                  {card.imageUrl && (
                    <img src={card.imageUrl} alt={`Card ${card.name}`} />
                  )}
                </div>
                <div className="card-content">
                  <span className="item-name">{card.name}</span>
                  <span className="item-number">{card.amount}</span>
                </div>
              </div>
            ))}
          </div>
      
          {/* Overlay for adding new item */}
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
      
          
        </div>
      );
      
};

export default MainComponent;
