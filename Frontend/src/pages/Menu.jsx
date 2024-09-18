import { useEffect, useState } from "react";
import { FaSearch, FaCartPlus, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { SpringModal } from "../components/Food_modal";
import axios from "axios";

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [filteredProductsCount, setFilteredProductsCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(12);

  const categories = ["All", "Juices", "Veg", "Non-Veg", "Pizza" , "Burger" ];

  // Fetch products from API
  const fetchProducts = async (page = 1) => {
    try {
      const { data } = await axios.get(`https://mern-food-bl34.onrender.com/api/v1/products`, {
        params: {
          page,
          keyword: searchKeyword,
          category: selectedCategory === "All" ? "" : selectedCategory,
        },
      });
      console.log(data)
      setProducts(data.products);
      setFilteredProductsCount(data.filteredProductsCount);
      setResultPerPage(data.resultPerPage);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value;
    if (value.length > 3 || value === "") {
      setCurrentPage(1);
      setSearchKeyword(value);
    }
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset page when category changes
  };

  // Handle pagination page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle product item click to open modal
  const handleItemClick = (item) => {
    setIsOpenModal(true);
    setSelectedItem(item);
  };


   // Add to cart and update localStorage
   const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex((product) => product._id === item._id);

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

  useEffect(() => {
    fetchProducts(currentPage);
  }, [searchKeyword, selectedCategory, currentPage]);

  return (
    <div className="p-4 my-10 mx-20">
      {/* Search and filter */}
      <div className="flex justify-center mb-4 mx-48">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="e.g. Papaya Juices"
            onChange={handleSearch}
            className="border rounded-full px-4 py-2 w-full pl-10"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 ml-2 text-red-500 rounded-full p-2">
            <FaSearch />
          </div>
        </div>

        <div className="ml-3">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border border-orange-600 rounded-full py-2 w-full text-orange-600"
          >
            {categories.map((category) => (
              <option key={category} value={category} className="font-mono text-center text-orange-600">
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products list */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10">
        {products.map((item, index) => (
          <div
            onClick={() => handleItemClick(item)}
            key={index}
            className="border rounded-lg p-4 flex flex-col items-center hover:scale-105 text-center justify-center"
          >
            <img src={item.image_url} alt={item.name} className="w-24 h-24 mb-2 rounded-lg" />
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-gray-500">{item.category}</p>

            {/* Star rating system */}
            <div className="flex items-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                  {star <= Math.floor(item.ratings) ? (
                    <FaStar className="text-yellow-300 w-6 h-6" />
                  ) : star === Math.ceil(item.ratings) && item.ratings % 1 !== 0 ? (
                    <FaStarHalfAlt className="text-yellow-300 w-6 h-6" />
                  ) : (
                    <FaStar className="text-gray-300 w-6 h-6" />
                  )}
                </span>
              ))}
            </div>
            <p className="text-red-500 font-bold">₹{item.price}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(item);
              }}
              className="mt-2 text-red-600 hover:scale-110 self-end text-xl"
            >
              <FaCartPlus />
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {Array.from({ length: Math.ceil(filteredProductsCount / resultPerPage) }, (_, index) => (
          <button
            key={index}
            className={`px-4 py-2 mx-2 border ${currentPage === index + 1 ? "bg-orange-600 text-white" : ""}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {isOpenModal && selectedItem && (
        <SpringModal isOpen={isOpenModal} setIsOpen={setIsOpenModal} product={selectedItem} />
      )}
    </div>
  );
};

export default Menu;
