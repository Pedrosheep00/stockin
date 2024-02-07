import React, { useState, useEffect } from 'react';
import { firestore, storage } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './CSSs/MainContent.css';

const MainComponent = () => {
    const [cards, setCards] = useState([]);
    const [newCardData, setNewCardData] = useState({
        imageUrl: '',
        name: '',
        amount: '',
    });
    const [showAddItem, setShowAddItem] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await generateSquares();
            setCards(data);
        };
        fetchData();
    }, []);

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

    const handleAddCard = async () => {
        if (!newCardData.name || !newCardData.amount || !newCardData.imageUrl) {
            alert("Please fill in all fields before submitting.");
            return;
        }
        try {
            const docRef = await addDoc(collection(firestore, 'cards'), {
                name: newCardData.name,
                amount: Number(newCardData.amount),
                imageUrl: newCardData.imageUrl,
            });
            const newCard = { id: docRef.id, ...newCardData };
            setCards(prevCards => [...prevCards, newCard]);
            setNewCardData({ imageUrl: '', name: '', amount: '' });
            setShowAddItem(false);
        } catch (error) {
            console.error("Error adding card to Firestore: ", error);
        }
    };

    const handleAddItemClick = () => {
        setShowAddItem(true);
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
            {showAddItem && (
                <div className="add-item-form">
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <input type="text" placeholder="Name" name="name" value={newCardData.name} onChange={handleInputChange} />
                    <input type="number" placeholder="Amount" name="amount" value={newCardData.amount} onChange={handleInputChange} />
                    <button onClick={handleAddCard}>Submit</button>
                </div>
            )}
            <div className="pagination-buttons">
                <button className="add-item-button" onClick={handleAddItemClick}>add item</button>
            </div>
        </div>
    );
};

export default MainComponent;
