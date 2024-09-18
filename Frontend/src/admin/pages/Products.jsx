import { useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../app/slices/productSlice";
import axios from "axios";

const Product = () => {
  const dispatch = useDispatch();

  const { productsList, isLoading, error } = useSelector(
    (state) => state.products
  );
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleDelete = async (_id) => {
    const response = await axios.delete(`https://mern-food-bl34.onrender.com/api/v1/admin/product/${_id}`);
    console.log(response.data);
    if (response.data.message == "Product Deleted Successfully") {
      dispatch(getProducts());
      alert("product Delete successfully...");
    }
  };

  return (
    <div className="p-4 my-5 mx-20">
      <h1 className="font-mono text-2xl -mx-10 text-orange-600">
        Product Lists
      </h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          {productsList?.products?.length ? (
            productsList.products.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 flex flex-col items-center hover:scale-105 text-center justify-center"
              >
                <Link to={`/info/${item.name}`}>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-24 h-24 mb-2 rounded-lg"
                  />
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-500">{item.category}</p>
                </Link>

                <p className="text-red-500 font-bold">{item.price}</p>
                <div className="flex justify-end mt-2">
                  
                  <button
                    className="text-red-600 hover:scale-110"
                    onClick={() => handleDelete(item._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Product;
