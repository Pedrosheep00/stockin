import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

// Helper function to transform cards data into chart data
const transformCardsToChartData = (cards) => {
    const labels = cards.map(card => card.name);
    const data = cards.map(card => (parseFloat(card.sellingPrice) - parseFloat(card.buyingPrice)) * parseFloat(card.amount));
    const backgroundColors = data.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`);

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

const ProfitabilityGraph = ({ cards }) => {
    // Check if cards prop is an array and has items
    if (!Array.isArray(cards) || cards.length === 0) {
        return <p>No data available</p>;
    }

    const chartData = transformCardsToChartData(cards);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Profitability per Item',
            },
        },
    };

    return (
        <div>
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default ProfitabilityGraph;
