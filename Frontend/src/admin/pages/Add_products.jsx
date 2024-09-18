import { useState } from "react";
import { FaUser, FaList, FaMoneyBill, FaImage, FaStar, FaAlignLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../app/slices/productSlice"; // Import the action

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [star, setStar] = useState(0);

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.products); // Access state from the slice

  const handleSubmit = (event) => {
    event.preventDefault();
    const newItem = {
      name,
      description,
      price,
      image_url,
      category,
      star,
    };

    // Dispatch action to add new product
    console.log(newItem);
    dispatch(addProduct(newItem));

    // Optionally reset the form fields after submission
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setImageUrl("");
    setStar(1);
  };

  return (
    <div className="p-4 my-5 mx-20">
      <h1 className="font-mono text-2xl -mx-10 mb-6 text-orange-600">Add New Product</h1>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="flex flex-col mb-4">
          <label className="text-lg font-mono font-semibold">Name:</label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-orange-600 rounded-lg"
              placeholder="ABC Juices"
              required
            />
            <FaUser className="absolute top-1/2 transform -translate-y-1/2 left-3 text-orange-600" />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col mb-4">
          <label className="text-lg font-mono font-semibold">Description:</label>
          <div className="relative">
            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-orange-600 rounded-lg"
              placeholder="Fresh juices made from apple, beetroot, and carrot"
              required
            />
            <FaAlignLeft className="absolute top-1/2 transform -translate-y-1/2 left-3 text-orange-600" />
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col mb-4">
          <label className="text-lg font-mono font-semibold">Category:</label>
          <div className="relative">
            <input
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-orange-600 rounded-lg"
              placeholder="Juices"
              required
            />
            <FaList className="absolute top-1/2 transform -translate-y-1/2 left-3 text-orange-600" />
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col mb-4">
          <label className="text-lg font-mono font-semibold">Price:</label>
          <div className="relative">
            <input
              type="number"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-orange-600 rounded-lg"
              placeholder="40"
              required
            />
            <FaMoneyBill className="absolute top-1/2 transform -translate-y-1/2 left-3 text-orange-600" />
          </div>
        </div>

        {/* Image URL */}
        <div className="flex flex-col mb-4">
          <label className="text-lg font-mono font-semibold">Image URL:</label>
          <div className="relative">
            <input
              type="text"
              value={image_url}
              onChange={(event) => setImageUrl(event.target.value)}
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-orange-600 rounded-lg"
              placeholder="https://example.com/image.jpg"
              required
            />
            <FaImage className="absolute top-1/2 transform -translate-y-1/2 left-3 text-orange-600" />
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex flex-col mb-4">
          <label className="text-lg font-mono font-semibold">Star Rating:</label>
          <div className="relative">
            <input
              type="number"
              value={star}
              onChange={(event) => setStar(Number(event.target.value))}
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-orange-600 rounded-lg"
              placeholder="5"
              min="1"
              max="5"
              required
            />
            <FaStar className="absolute top-1/2 transform -translate-y-1/2 left-3 text-orange-600" />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4  border border-orange-600 rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? "Adding Product..." : "Add Product"}
        </button>
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default AddProduct;
