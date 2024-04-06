import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { firestore } from './firebase';
import './CSSs/Dashboard.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import { logActivity } from './logActivity';

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [cards, setCards] = useState([]);
  const [totalInventoryValue, setTotalInventoryValue] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [grossProfitMargin, setGrossProfitMargin] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  

  useEffect(() => {
    const fetchCardsAndCalculate = async () => {
      if (user) {
        const q = query(collection(firestore, "cards"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Calculate total revenue, COGS, and items
        let totalRevenue = 0;
        let totalCOGS = 0;
        let itemCount = 0;

        items.forEach(item => {
          const amount = Number(item.amount) || 0;
          const sellingPrice = Number(item.sellingPrice) || 0;
          const buyingPrice = Number(item.buyingPrice) || 0;
          
          totalRevenue += amount * sellingPrice;
          totalCOGS += amount * buyingPrice;
          itemCount += amount;
        });

        const grossProfit = totalRevenue - totalCOGS;
        const grossProfitMarginPercentage = totalRevenue ? (grossProfit / totalRevenue) * 100 : 0;

        setTotalInventoryValue(totalRevenue);
        setTotalItems(itemCount);
        setGrossProfitMargin(grossProfitMarginPercentage);
      }
    };

    const fetchRecentActivities = async () => {
      if (user) {
        const activitiesQuery = query(
          collection(firestore, "activities"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc"),
          limit(5)
        );
        const activitiesSnapshot = await getDocs(activitiesQuery);
        const activities = activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentActivities(activities);
      }
    };

    if (user) {
      fetchCardsAndCalculate();
      fetchRecentActivities();
      
    }
  }, [user]);

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
                    {/* Example of how you might display the activity details */}
                    <p>Action: {activity.action}</p> {/* Replace with actual property names */}
                    <p>Timestamp: {activity.timestamp?.toDate().toLocaleString()}</p> {/* Format the timestamp */}
                    {/* Include any other relevant activity details */}
                </li>
                ))}
            </ul>
        </div>

        <div className="graphs-section">
            {/* Placeholder for graphs */}
            <div className="graph-box">Sales Over Time Graph</div>
            <div className="graph-box">Inventory Levels Bar Graph</div>
            <div className="graph-box">Profitability per Item Pie Chart</div>
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
