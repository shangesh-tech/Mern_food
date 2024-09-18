import { AnimatePresence, motion } from "framer-motion";
import { IoFastFood } from "react-icons/io5";
import { FaShare, FaStar } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const SpringModal = ({ isOpen, setIsOpen, product }) => {
  const navigate = useNavigate();
  // Add to cart and update localStorage
  const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex(
      (product) => product._id === item._id
    );

    if (existingItemIndex >= 0) {
      // If item exists, increment the quantity
      cart[existingItemIndex].quantity += 1;
    } else {
      // If item doesn't exist, add to cart with quantity 1
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${item.name} added to cart`);
  };

  const handleBuy = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex(
      (product) => product._id === item._id
    );

    if (existingItemIndex >= 0) {
      // If item exists, increment the quantity
      cart[existingItemIndex].quantity += 1;
    } else {
      // If item doesn't exist, add to cart with quantity 1
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${item.name} added to cart`);
    navigate("/cart");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: window.location.href,
        });
        console.log("Successfully shared");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            className="bg-gradient-to-br from-orange-400 to-red-300 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <IoFastFood className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <p className="text-xl font-mono text-white">Product Details</p>
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-orange-600 grid place-items-center mx-auto">
                <IoFastFood />
              </div>
              <div className="flex items-center p-4 mb-8 mt-6 max-w-md mx-auto">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-40 h-40 object-cover rounded-md"
                />
                <div className="ml-4">
                  <h2 className="font-semibold text-white text-2xl">
                    {product.name}
                  </h2>
                  <div className="flex items-center">
                    <div className="text-yellow-400">
                      <FaStar />
                    </div>
                    <span className="ml-2 text-gray-600">
                      {product.ratings}{" "}
                      <span className="text-white">• {product.category}</span>
                    </span>
                  </div>
                  <div className="text-red-500 text-lg font-semibold mt-2">
                    ₹{product.price}
                  </div>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => {
                        handleBuy(product);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-md mr-2 flex justify-center items-center gap-2  hover:scale-105"
                    >
                      Buy <BiSolidPurchaseTagAlt />
                    </button>
                    <button
                      onClick={() => {
                        handleAddToCart(product);
                      }}
                      className="bg-white border border-gray-300 text-orange-600 px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:scale-105"
                    >
                      Add to Cart <FaCartPlus />
                    </button>
                  </div>
                  <div className="mt-2">
                    <span className="font-semibold text-gray-700">
                      Descriptions :
                    </span>
                    <p className="text-white">{product.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded">
                  <Link to={"/menu"}>Close</Link>
                </button>

                <button
                  onClick={() => {
                    handleShare();
                  }}
                  className="bg-white hover:opacity-90 transition-opacity text-red-600 font-semibold w-full py-2 rounded flex justify-center items-center gap-2 hover:scale-105"
                >
                  Share
                  <FaShare size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
