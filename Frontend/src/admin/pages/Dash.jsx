import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { getProducts } from '../app/slices/productSlice';
import { getOrders } from '../app/slices/orderSlice';
import { fetchUsers } from '../app/slices/userSlice'; 

// Register Chart.js components, including Tooltips and Legend
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Dash = () => {
  const dispatch = useDispatch();
  const [timeframe, setTimeframe] = useState('7days');
  const orderChartRef = useRef(null);
  const revenueChartRef = useRef(null);

  const { productsList, isLoading: productsLoading } = useSelector((state) => state.products);
  const { ordersList, totalAmount, isLoading: ordersLoading } = useSelector((state) => state.orders);
  const { users, isLoading: usersLoading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getOrders(timeframe)); // Fetch orders based on selected timeframe
    dispatch(fetchUsers());
  }, [dispatch, timeframe]);

  useEffect(() => {
    if (orderChartRef.current) {
      const chart = orderChartRef.current.chartInstance;
      if (chart) {
        chart.update();
      }
    }
    if (revenueChartRef.current) {
      const chart = revenueChartRef.current.chartInstance;
      if (chart) {
        chart.update();
      }
    }
  }, [ordersList]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    dispatch(getOrders(newTimeframe)); // Fetch orders again based on the new timeframe
  };

  // Data for line chart based on order history
  const orderData = {
    labels: ordersList.map((order) => new Date(order.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Number of Orders',
        data: ordersList.map((order) => 
          order.orderItems.reduce((total, item) => total + item.quantity, 0) // Sum the quantity of all items in the order
        ),
        fill: false,
        backgroundColor: '#ff6384',
        borderColor: '#ff6384',
      },
    ],
  };

  // Data for revenue graph
  const revenueData = {
    labels: ordersList.map((order) => new Date(order.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Revenue',
        data: ordersList.map((order) => order.totalPrice),
        fill: false,
        backgroundColor: '#36a2eb',
        borderColor: '#36a2eb',
      },
    ],
  };

  // Chart options for tooltips
  const chartOptions = {
    plugins: {
      tooltip: {
        enabled: true, 
        mode: 'index', 
        intersect: false, 
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
      },
      legend: {
        display: true,
      },
    },
    responsive: false,
    maintainAspectRatio: false,
  };

  return (
    <div className="p-6">
      {/* Loading Indicators */}
      {(productsLoading || ordersLoading || usersLoading) && <p>Loading...</p>}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-2xl font-bold">{ordersList.length}</p>
        </div>
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl font-bold">{users?.users?.length || 0}</p>
        </div>
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Total Products</h3>
          <p className="text-2xl font-bold">{productsList?.products?.length || 0}</p>
        </div>
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold">₹{totalAmount || 0}</p>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-end mb-4">
        <select
          value={timeframe}
          onChange={(e) => handleTimeframeChange(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="7days">Last 7 Days</option>
          <option value="1month">Last 1 Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last 1 Year</option>
        </select>
      </div>

      {/* Order Graph */}
      <div className="bg-white shadow-lg p-6 rounded-lg mb-6 w-8/12 flex justify-center items-center flex-col">
        <h2 className="text-xl font-semibold mb-4 self-start">Order Trends</h2>
        <Line ref={orderChartRef} data={orderData} options={chartOptions} />
      </div>

      {/* Revenue Graph */}
      <div className="bg-white shadow-lg p-6 rounded-lg w-8/12 flex justify-center items-center flex-col">
        <h2 className="text-xl font-semibold mb-4 self-start">Revenue Timeline</h2>
        <Line ref={revenueChartRef} data={revenueData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dash;
