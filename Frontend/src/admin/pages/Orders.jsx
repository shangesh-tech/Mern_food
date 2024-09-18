import { useState, useEffect } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("https://mern-food-bl34.onrender.com/api/v1/admin/orders",{ withCredentials: true } );
      setOrders(data.orders);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data.message);
      setLoading(false);
    }
  };

  // Handle order status change
  const handleStatusChange = async (orderId, status) => {
    try {
      console.log(status)
      const response = await axios.put(`https://mern-food-bl34.onrender.com/api/v1/admin/order/${orderId}`,{status},{ withCredentials: true });
      console.log(response.data)
      fetchOrders(); 
    } catch (error) {
      console.error("Error updating order status", error);
      setError("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h2 className="text-2xl font-bold mb-4 font-mono text-orange-600 -mx-6">
        Orders Management
      </h2>
      <table className="table-auto text-center w-full border-collapse border border-slate-400 rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-slate-400">User Name</th>
            <th className="px-4 py-2 border border-slate-400">Phone Number</th>
            <th className="px-4 py-2 border border-slate-400">Shipped Address</th>
            <th className="px-4 py-2 border border-slate-400">Amount</th>
            <th className="px-4 py-2 border border-slate-400">Payment Method</th>
            <th className="px-4 py-2 border border-slate-400">Order Items</th>
            <th className="px-4 py-2 border border-slate-400">Delivery Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="px-4 py-2 border border-slate-400">{order.userID?.name}</td>
              <td className="px-4 py-2 border border-slate-400">{order.shippingInfo.phoneNo}</td>
              <td className="px-4 py-2 border border-slate-400">
                {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state}
              </td>
              <td className="px-4 py-2 border border-slate-400">₹{order.totalPrice}</td>
              <td className="px-4 py-2 border border-slate-400">{order.paymentInfo.status}</td>
              <td className="px-4 py-2 border border-slate-400">
                {order.orderItems.map((item) => (
                  <div key={item._id}>
                    {item.name} x {item.quantity} = ₹{item.price * item.quantity}
                  </div>
                ))}
              </td>
              <td className="px-4 py-2 border border-slate-400">
                <select
                  className="form-select"
                  value={order.orderStatus}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="Pending">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
