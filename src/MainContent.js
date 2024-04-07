import React, { useState, useEffect } from 'react';
import { auth, firestore, storage } from './firebase';
import { collection, query, where, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './CSSs/MainContent.css';

const MainComponent = () => {
  const [cards, setCards] = useState([]);
  const [newCardData, setNewCardData] = useState({
    imageUrl: '',
    name: '',
    amount: '',
    minimum: '',
    category: '',
    supplierInfo: {
      name: '',
      contact: '',
      email: '',
      description: '',
      sellingPrice: '',
      buyingPrice: '',
    },
  });
  const [showAddItemOverlay, setShowAddItemOverlay] = useState(false);
  const [showCardInfoOverlay, setShowCardInfoOverlay] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showEditItemOverlay, setShowEditItemOverlay] = useState(false);
  const [editingCard, setEditingCard] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [showSupplierOverlay, setShowSupplierOverlay] = useState(false);
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        await fetchData(user.uid);
        await fetchCategories(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async (userId) => {
    const q = query(collection(firestore, "cards"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    setCards(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchCategories = async (userId) => {
    const q = query(collection(firestore, "Categories"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleAddCard = async (event) => {
    event.preventDefault();
    if (!newCardData.name || !newCardData.amount || !newCardData.imageUrl || !user  || !newCardData.minimum) {
      alert('Please fill in all fields and select a category before submitting.');
      return;
    }

    const userId = auth.currentUser.uid;
    const newItem = {
      ...newCardData,
      userId,
      sellingPrice: parseFloat(newCardData.sellingPrice),
      buyingPrice: parseFloat(newCardData.buyingPrice),
    };

    try {
      const docRef = await addDoc(collection(firestore, 'cards'), newItem);
      setCards([...cards, { id: docRef.id, ...newItem }]);
      setNewCardData({ imageUrl: '', name: '', amount: '', minimum: '', category: '', supplierInfo: { name: '', contact: '', email: '', description: '', sellingPrice: '', buyingPrice: '' } }); // Reset form
      setShowAddItemOverlay(false); // Close overlay
      logActivity('Item Added', `Added ${newItem.amount} units of ${newItem.name}`);

    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleLowStockChange = (e) => setLowStockOnly(e.target.checked);

  const filteredCards = cards.filter(card => {
    const searchMatch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const lowStock = card.amount <= card.minimum;
    return (lowStockOnly ? lowStock : true) && searchMatch;
  });

  const handleDeleteCard = async (cardId) => {
    const cardToDelete = cards.find(card => card.id === cardId);
    if (cardToDelete && window.confirm("Are you sure you want to delete this item?")) {
      try {
        const cardDocRef = doc(firestore, "cards", cardId);
        await deleteDoc(cardDocRef);
        setCards(cards.filter((card) => card.id !== cardId));
        logActivity('Item Deleted', `Deleted ${cardToDelete.amount} units of ${cardToDelete.name}`);
      } catch (error) {
        console.error("Error deleting card: ", error);
        // Optionally, log this error in your activities.
      }
    }
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

  const handleShowSupplier = (cardId) => {
    const foundCard = cards.find(card => card.id === cardId);
    if (foundCard) {
      // Initialize supplierInfo if it doesn't exist
      if (!foundCard.supplierInfo) {
        foundCard.supplierInfo = {
          name: '',
          contact: '',
          email: '',
          description: '',
        };
      }
      setEditingCard(foundCard);
      setShowSupplierOverlay(true);
    } else {
      console.error("Card not found");
    }
  };
  const logActivity = async (action, detail) => {
    if (user) {
      const activity = {
        action: action,
        detail: detail,
        timestamp: new Date(), // Firestore will convert this to a Timestamp
        userId: user.uid,
      };
      try {
        await addDoc(collection(firestore, "activities"), activity);
      } catch (error) {
        console.error("Error logging activity: ", error);
      }
    }
  };

  const handleSaveSupplierInfo = async () => {
    if (!editingCard) return; // Make sure you have a card selected for editing
  
    // Construct the updated supplier info object from your form state or refs
    const updatedSupplierInfo = {
      name: editingCard.supplierInfo.name,
      contact: editingCard.supplierInfo.contact,
      email: editingCard.supplierInfo.email,
      description: editingCard.supplierInfo.description,
    };
  
    try {
      // Update Firestore document
      const cardRef = doc(firestore, 'cards', editingCard.id);
      await updateDoc(cardRef, {
        ...editingCard, // Keep the rest of the card data
        supplierInfo: updatedSupplierInfo, // Set the new supplier info
      });
  
      // Update local state
      setCards(cards.map((card) => (card.id === editingCard.id ? { ...card, supplierInfo: updatedSupplierInfo } : card)));
  
      // Close the supplier info overlay
      setShowSupplierOverlay(false);
    } catch (error) {
      console.error("Error updating supplier info: ", error);
      // Ideally, inform the user of the error
    }
  };
  

  const handleEditCardSubmit = async (event) => {
    event.preventDefault();
    if (!editingCard) return;

    // Ensure supplier info is part of the editing process
    const cardUpdateData = {
      name: editingCard.name,
      amount: editingCard.amount,
      minimum: editingCard.minimum,
      category: editingCard.category,
      imageUrl: editingCard.imageUrl,
      sellingPrice: parseFloat(editingCard.sellingPrice),
      buyingPrice: parseFloat(editingCard.buyingPrice),
      // Ensure supplier info is included in updates
      supplierInfo: editingCard.supplierInfo || {}, // Default to an empty object if not set
    };

    try {
      await updateDoc(doc(firestore, "cards", editingCard.id), cardUpdateData);
      const updatedCards = cards.map(card => card.id === editingCard.id ? { ...card, ...cardUpdateData } : card);
      setCards(updatedCards);
      setShowEditItemOverlay(false); // Close the edit overlay
      // Log the edit action
      logActivity('Item Edited', `Edited ${editingCard.amount} units of ${editingCard.name}`);

    } catch (error) {
      console.error("Error updating card: ", error);
      // Optionally, you could also log this error in your activities with a different message.
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

  <label className="switch">
    <input
      type="checkbox"
      id="low-stock-checkbox"
      checked={lowStockOnly}
      onChange={handleLowStockChange}
    />
    <span className="slider round"></span>
  </label>
  <label htmlFor="low-stock-checkbox" className="low-stock-label">Low Stock</label>
  
  <div className="search-bar-container">
    <input
      type="text"
      placeholder="Search items..."
      value={searchTerm}
      onChange={handleSearchChange}
      className="search-bar"
    />
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
              <input type="number" placeholder="Selling Price"name="sellingPrice" value={newCardData.sellingPrice}onChange={handleInputChange}/>
              <input type="number" placeholder="Buying Price"name="buyingPrice" value={newCardData.buyingPrice}onChange={handleInputChange}/>
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
  
    {showSupplierOverlay && (
      <div className="supplierOverlay">
        {editingCard && editingCard.supplierInfo ? (
          <div className="supplier-content">
            {/* Inputs and buttons for editing supplier info */}
            <input type="text" value={editingCard.supplierInfo.name || ''} onChange={(e) => setEditingCard({ ...editingCard, supplierInfo: { ...editingCard.supplierInfo, name: e.target.value } })} placeholder="Supplier Name" />
            <input type="text" value={editingCard.supplierInfo.contact || ''} onChange={(e) => setEditingCard({ ...editingCard, supplierInfo: { ...editingCard.supplierInfo, contact: e.target.value } })} placeholder="Supplier Contact" />
            <input type="email" value={editingCard.supplierInfo.email || ''} onChange={(e) => setEditingCard({ ...editingCard, supplierInfo: { ...editingCard.supplierInfo, email: e.target.value } })} placeholder="Supplier Email" />
            <textarea value={editingCard.supplierInfo.description || ''} onChange={(e) => setEditingCard({ ...editingCard, supplierInfo: { ...editingCard.supplierInfo, description: e.target.value } })} placeholder="Supplier Description"></textarea>
            <button onClick={handleSaveSupplierInfo}>Save Supplier Info</button>
            <button onClick={() => setShowSupplierOverlay(false)}>Close</button>
          </div>
        ) : <p>Loading...</p>}
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
              <button className="info-action-button" onClick={() => handleShowSupplier(selectedCard.id)}>Supplier</button>
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
                  <input type="number" name="sellingPrice" value={editingCard.sellingPrice} onChange={handleEditInputChange} placeholder="Selling Price" /> 
                  <input type="number" name="buyingPrice" value={editingCard.buyingPrice} onChange={handleEditInputChange} placeholder="Buying Price" />
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
