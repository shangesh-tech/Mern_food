import React, { useEffect, useState } from 'react';
import axios from 'axios';

const My_order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders using Axios
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('https://mern-food-bl34.onrender.com/api/v1/orders/me');

      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  console.log(orders)
  return (
    <section className='container mx-auto px-4'>
      <div className='my-6'>
        <h3 className='font-mono text-orange-600 text-3xl'>My Orders</h3>
        <div className="border-b-2 border-orange-500 w-20 mb-4"></div>
      </div>

      
      {loading ? (
        <p className="text-center text-lg text-gray-500">Loading your orders...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders List */}
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 rounded-lg shadow-md p-6 bg-white">
           
              <p className="text-gray-600"><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-600"><strong>Total Price:</strong> ₹{order.totalPrice}</p>
              <p className="text-gray-600"><strong>Payment Status:</strong> {order.paymentInfo.status}</p>
              <p className="text-gray-600 mt-4"><strong>Order Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-white ${
                  order.orderStatus === 'Delivered' ? 'bg-green-500' : 
                  order.orderStatus === 'Processing' ? 'bg-yellow-500' : 
                  'bg-red-500'}`}>
                  {order.orderStatus}
                </span>
              </p>

              {/* Shipping Info */}
              <div className="mt-4">
                <h5 className="font-semibold text-lg mb-1">Shipping Info</h5>
                <p className="text-gray-600">{order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state}, {order.shippingInfo.country}, {order.shippingInfo.pincode}</p>
                <p className="text-gray-600"><strong>Phone:</strong> {order.shippingInfo.phoneNo}</p>
              </div>

              {/* Order Items */}
              <div className="mt-4">
                <h5 className="font-semibold text-lg mb-1">Items Ordered</h5>
                <ul className="list-disc list-inside text-gray-600">
                  {order.orderItems.map((item, index) => (
                    <li key={index}>
                      {item.name} - {item.quantity} pcs (₹{item.price} each)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default My_order;
