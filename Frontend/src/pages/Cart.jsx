import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  FaMapMarkerAlt,
  FaCity,
  FaSearchLocation,
  FaLock,
  FaLocationArrow,
} from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";

// Initialize Stripe
const stripePromise = loadStripe(
  "pk_test_51Pze38CY5tP6eCWPoHIQvranCYH54086K1fxAblcABwQRQXW1JQ3tv2RPJVkwiHfe9LuFE3cYZWHMpVFZWaJzqiy00BOMsVYDi"
);

// Component to handle the payment form
const CheckoutForm = ({
  totalAmount,
  cartItems,
  shippingInfo,
  setShippingInfo,
  setCartItems,
  setTotalAmount,
  setShowCheckout,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Create Payment Intent on the backend
      const response = await axios.post("https://mern-food-bl34.onrender.com/api/create-payment-intent", {
        amount: totalAmount,
        orderItems: cartItems,
        shippingInfo: shippingInfo,
      });
      console.log(response.data)
      if (response.data.message === "Payment successful") {
        alert("Payment successful!");
        // Handle successful payment

        localStorage.removeItem("cart"); // Clear cart from localStorage
        setCartItems([]); // Clear cart items from state
        setTotalAmount(0); // Reset total amount
        setShowCheckout(false); // Hide checkout form
        alert("Payment successful!");
      }
    } catch (error) {
      console.log("Error in payment...", error);
    }
  };

  // Handle changes in shipping info inputs
  const handleShippingInfoChange = (event) => {
    const { name, value } = event.target;
    setShippingInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto p-4 mb-4 bg-white">
        <h4 className="text-lg font-bold mb-2">Shipping Address:</h4>
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <FaLocationArrow className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="country"
              value={shippingInfo.country}
              onChange={handleShippingInfoChange}
              placeholder="Enter your country"
              required
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
            />
          </div>
          <div className="relative">
            <FaMapMarkerAlt className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="address"
              value={shippingInfo.address}
              onChange={handleShippingInfoChange}
              placeholder="Enter your address"
              required
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
            />
          </div>
          <div className="relative">
            <FaCity className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="city"
              value={shippingInfo.city}
              onChange={handleShippingInfoChange}
              placeholder="Enter your city"
              required
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
            />
          </div>
          <div className="relative">
            <FaSearchLocation className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="state"
              value={shippingInfo.state}
              onChange={handleShippingInfoChange}
              placeholder="Enter your state"
              required
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
            />
          </div>
          <div className="relative">
            <FaPhone className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="tel"
              name="phoneNo"
              value={shippingInfo.phoneNo}
              onChange={handleShippingInfoChange}
              placeholder="Enter your phone number"
              required
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="number"
              name="pincode"
              value={shippingInfo.pincode}
              onChange={handleShippingInfoChange}
              placeholder="Enter your pincode"
              required
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
      <div className="mb-6 mx-4">
        <CardElement />
      </div>

      <button
        className="bg-blue-500 text-white w-52 py-2 rounded-lg hover:scale-105"
        type="submit"
        disabled={!stripe}
      >
        Pay Now
      </button>
    </form>
  );
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    country: "",
    address: "",
    city: "",
    state: "",
    phoneNo: "",
    pincode: "",
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const response = await axios.get("https://mern-food-bl34.onrender.com/api/v1/check-auth");
      return response.data.success;
    } catch (error) {
      navigate("/signin");
      return false;
    }
  };

  // Fetch cart items from localStorage
  const fetchCartItems = () => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);
    calculateTotal(items);
  };

  // Calculate total price
  const calculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalAmount(total);
  };

  // Increment item quantity
  const incrementQuantity = (index) => {
    const updatedItems = [...cartItems];
    updatedItems[index].quantity += 1;
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  // Decrement item quantity
  const decrementQuantity = (index) => {
    const updatedItems = [...cartItems];
    if (updatedItems[index].quantity > 1) {
      updatedItems[index].quantity -= 1;
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
      localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
  };

  // Remove item from cart
  const removeItem = (index) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  // Trigger checkout
  const startCheckout = async () => {
    const isAuthenticated = await checkAuth();
    if (isAuthenticated) {
      setShowCheckout(true);
    } else {
      alert("Authentication required. Redirecting to sign-in.");
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div className="flex justify-center p-10">
      <div className="w-2/3">
        <h1 className="text-2xl font-bold mb-2">Your Shopping Cart</h1>
        <div className="border-b-2 border-red-500 w-24 mb-4"></div>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
              >
                <div className="flex items-center">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg mr-4"
                  />
                  <div>
                    <h2 className="text-lg font-bold">{item.name}</h2>
                    <p className="text-red-500">₹{item.price}</p>
                    <div className="flex items-center mt-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded-l"
                        onClick={() => decrementQuantity(index)}
                      >
                        -
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded-r"
                        onClick={() => incrementQuantity(index)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p>Total : ₹{item.price * item.quantity}</p>
                  <button
                    className="text-red-500 underline"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="w-1/3 ml-10">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="bg-red-500 text-white p-2 rounded-t-lg">
            <h2 className="text-lg font-bold">Price Summary</h2>
          </div>
          <div className="p-4">
            <div className="flex justify-between mb-2">
              <span>Cart Total</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Delivery Charge</span>
              <span>₹0</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          {!showCheckout ? (
            <button
              className="bg-blue-500 text-white w-full py-2 rounded-b-lg"
              onClick={startCheckout}
            >
              Payment
            </button>
          ) : (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                totalAmount={totalAmount}
                cartItems={cartItems}
                shippingInfo={shippingInfo}
                setShippingInfo={setShippingInfo}
                setCartItems={setCartItems}
                setTotalAmount={setTotalAmount}
                setShowCheckout={setShowCheckout}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
