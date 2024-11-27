import React, { useEffect, useState } from 'react';
import { Box, Text, Select, useColorModeValue } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StaticComponent = ({ transactions }) => {
  const [chartData, setChartData] = useState({});
  const [chartType, setChartType] = useState('profitsLosses'); // Default chart type

  useEffect(() => {
    if (chartType === 'profitsLosses') {
      const profitLossData = transactions.reduce(
        (acc, transaction) => {
          const amount = transaction.amount;
          if (transaction.isApproved) {
            acc.profits.push(amount);
            acc.labels.push(new Date(transaction.createdAt).toLocaleDateString());
          } else if (transaction.isCanceled || transaction.reversed) {
            acc.losses.push(amount);
            acc.labels.push(new Date(transaction.createdAt).toLocaleDateString());
          }
          return acc;
        },
        { profits: [], losses: [], labels: [] }
      );

      setChartData({
        labels: profitLossData.labels,
        datasets: [
          {
            label: 'Profits',
            data: profitLossData.profits,
            borderColor: 'green',
            backgroundColor: 'rgba(0, 255, 0, 0.2)',
            tension: 0.4,
          },
          {
            label: 'Losses',
            data: profitLossData.losses,
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            tension: 0.4,
          },
        ],
      });
    } else if (chartType === 'transactionCount') {
      const dateTransactionCount = transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const labels = Object.keys(dateTransactionCount);
      const data = Object.values(dateTransactionCount);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Transaction Count',
            data,
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
            tension: 0.4,
          },
        ],
      });
    } else if (chartType === 'transactionTypes') {
      const transactionTypesData = transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.createdAt).toLocaleDateString();
        if (!acc.labels.includes(date)) acc.labels.push(date);

        if (transaction.isApproved) acc.approved[date] = (acc.approved[date] || 0) + 1;
        if (transaction.isCanceled) acc.canceled[date] = (acc.canceled[date] || 0) + 1;
        if (transaction.reversed) acc.reversed[date] = (acc.reversed[date] || 0) + 1;

        return acc;
      }, { labels: [], approved: {}, canceled: {}, reversed: {} });

      const labels = transactionTypesData.labels;
      const approvedData = labels.map(date => transactionTypesData.approved[date] || 0);
      const canceledData = labels.map(date => transactionTypesData.canceled[date] || 0);
      const reversedData = labels.map(date => transactionTypesData.reversed[date] || 0);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Approved',
            data: approvedData,
            borderColor: 'green',
            backgroundColor: 'rgba(0, 255, 0, 0.2)',
            tension: 0.4,
          },
          {
            label: 'Canceled',
            data: canceledData,
            borderColor: 'orange',
            backgroundColor: 'rgba(255, 165, 0, 0.2)',
            tension: 0.4,
          },
          {
            label: 'Reversed',
            data: reversedData,
            borderColor: 'purple',
            backgroundColor: 'rgba(128, 0, 128, 0.2)',
            tension: 0.4,
          },
        ],
      });
    } else if (chartType === 'transactionTypeEnum') {
      const transactionTypeData = transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.createdAt).toLocaleDateString();
        if (!acc.labels.includes(date)) acc.labels.push(date);

        const type = transaction.transactionType;
        acc[type][date] = (acc[type][date] || 0) + 1;

        return acc;
      }, {
        labels: [],
        DEPO: {},
        RETRAIT: {},
        ABON: {},
        TELE: {}
      });

      const labels = transactionTypeData.labels;
      const depoData = labels.map(date => transactionTypeData.DEPO[date] || 0);
      const retraitData = labels.map(date => transactionTypeData.RETRAIT[date] || 0);
      const abonData = labels.map(date => transactionTypeData.ABON[date] || 0);
      const teleData = labels.map(date => transactionTypeData.TELE[date] || 0);

      setChartData({
        labels,
        datasets: [
          {
            label: 'DEPO',
            data: depoData,
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
            tension: 0.4,
          },
          {
            label: 'RETRAIT',
            data: retraitData,
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            tension: 0.4,
          },
          {
            label: 'ABON',
            data: abonData,
            borderColor: 'orange',
            backgroundColor: 'rgba(255, 165, 0, 0.2)',
            tension: 0.4,
          },
          {
            label: 'TELE',
            data: teleData,
            borderColor: 'purple',
            backgroundColor: 'rgba(128, 0, 128, 0.2)',
            tension: 0.4,
          },
        ],
      });
    }
  }, [transactions, chartType]);

  const bgColor = useColorModeValue('#ffffff', '#1A202C');

  return (
    <Box bg={bgColor} p={4} borderRadius="md" boxShadow="md">
      <Text fontSize="xl" mb={4} fontWeight="bold">Transaction Analysis</Text>

      <Select
        mb={4}
        value={chartType}
        onChange={(e) => setChartType(e.target.value)}
      >
        <option value="profitsLosses">Profits & Losses Over Time</option>
        <option value="transactionCount">Transaction Count Over Time</option>
        <option value="transactionTypes">Transaction Types Over Time</option>
        <option value="transactionTypeEnum">Transaction Types (DEPO, RETRAIT, ABON, TELE) Over Time</option>
      </Select>

      {chartData.labels && chartData.labels.length > 0 ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text:
                  chartType === 'profitsLosses'
                    ? 'Profits and Losses'
                    : chartType === 'transactionCount'
                    ? 'Transaction Count'
                    : chartType === 'transactionTypes'
                    ? 'Transaction Status Types Over Time'
                    : 'Transaction Types (DEPO, RETRAIT, ABON, TELE) Over Time',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text:
                    chartType === 'profitsLosses'
                      ? 'Amount'
                      : 'Count',
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Date',
                },
              },
            },
          }}
        />
      ) : (
        <Text>No data available for this analysis.</Text>
      )}
    </Box>
  );
};

export default StaticComponent;
