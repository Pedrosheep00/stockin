import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { firestore } from './firebase';
import './CSSs/Dashboard.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import { logActivity } from './logActivity';
import { format } from 'date-fns';
import { serverTimestamp } from 'firebase/firestore';
import { addDoc } from 'firebase/firestore'; // Remove the import for 'collection'
import InventoryBarGraph from './InventoryBarGraph';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ProfitabilityGraph from './ProfitabilityGraph';  

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [cards, setCards] = useState([]);
  const [totalInventoryValue, setTotalInventoryValue] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [grossProfitMargin, setGrossProfitMargin] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [inputValue, setInputValue] = useState();
  const transformCardsToChartData = (cards) => {
    const labels = cards.map(card => card.name);
    const data = cards.map(card => parseFloat(card.sellingPrice) - parseFloat(card.buyingPrice));
    const backgroundColors = cards.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`);

    return {
      labels,
      datasets: [{
        label: 'Profitability per Item',
        data,
        backgroundColor: backgroundColors,
        hoverOffset: 4
      }]
    };
  };
  useEffect(() => {
    // Fetch recent activities
    const fetchRecentActivities = async () => {
      if (!user) return;
      
      const activitiesQuery = query(
        collection(firestore, "activities"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(4) // Get the last 4 activities
      );
  
      try {
        const activitiesSnapshot = await getDocs(activitiesQuery);
        const activities = activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentActivities(activities);
      } catch (error) {
        console.error('Error fetching recent activities: ', error);
      }
    };
  
    // Define the fetchCardsAndCalculate function inside useEffect if it's only used here
    const fetchCardsAndCalculate = async () => {
      if (!user) return;
      
      const q = query(collection(firestore, "cards"), where("userId", "==", user.uid));
      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCards(items);
          
          // Rest of your calculations and state updates
        } else {
          console.log("No cards found for the user.");
          setCards([]);
        }
      } catch (error) {
        console.error('Error fetching cards: ', error);
      }
    };
  
    if (user) {
      fetchCardsAndCalculate();
      fetchRecentActivities();
    }
  }, [user]); // Dependency array to ensure these functions are called when 'user' changes
  

return (
    <div className="dashboard-container">
        <div className="summary-stats">
            <div className="stat-box">Total Inventory Value: ${totalInventoryValue.toFixed(2)}</div>
            <div className="stat-box">Total Items: {totalItems}</div>
            <div className="stat-box">Gross Profit Margin: {grossProfitMargin.toFixed(2)}%</div>
        </div>
        <div className="recent-activity">
      <h3>Recent Activity</h3>
      <ul>
      {recentActivities.map((activity, index) => (
        <li key={index}>
          <div><strong>Action:</strong> {activity.action}</div>
          <div><strong>Date:</strong> {format(new Date(activity.timestamp.seconds * 1000), 'PPPpp')}</div>
          <div><strong>Details:</strong> {activity.detail}</div> 
          {activity.itemId && <a href={`/items/${activity.itemId}`}>View Item</a>}
  </li>
))}

      </ul>
    </div>

        <div className="graphs-section">
          <div className="graph-box"> <InventoryBarGraph cards /> </div>
          <div className="graph-box"> <ProfitabilityGraph cards={cards} /> </div>
        </div>

        <div className="data-table-section">
            {/* Placeholder for detailed tables */}
            <div className="table-box">
                <h3>Item Details</h3>
                {/* Table of items will go here */}
            </div>
            <div className="table-box">
                <h3>Stock Movements</h3>
                {/* Table of stock movements will go here */}
            </div>
        </div>
    </div>
);
};

export default Dashboard;
