import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { firestore } from './firebase';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';


const InventoryBarGraph = () => {
  const [user] = useAuthState(auth);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const q = query(collection(firestore, 'cards'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
          name: doc.data().name,
          amount: doc.data().amount,
        }));

        setChartData({
          labels: items.map(item => item.name),
          datasets: [
            {
              label: 'Inventory Levels',
              data: items.map(item => item.amount),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        });
      };

      fetchData();
    }
  }, [user]);

  return (
    <div>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default InventoryBarGraph;
