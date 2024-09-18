import React from "react";
import { RiMotorbikeLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { GrLinkNext } from "react-icons/gr";
import Carousel from "../components/Carousel";
const Home = () => {
  return (
    <section className="mx-14 md:mx-32 mt-14">
      <div className="lg:flex justify-between">
        <div className="lg:w-1/2 mt-28">
          <span className="bg-red-100 text-red-500 mx-14 md:mx-0 px-2 py-1 rounded-full flex items-center font-mono md:mr-64 justify-center">
            Bike Delivery
            <span className="bg-white rounded-full p-1 ml-2">
              <RiMotorbikeLine />
            </span>
          </span>
          <div className="mt-6">
            <h2 className="font-mono font-bold text-3xl">
              Foodily <span className="text-red-600">Enjoy cravings</span>
            </h2>
            <p className="mr-10 mt-3 text-gray-600">
              Satisfy your cravings with our wide range of food options,
              delivered fresh and fast, with minimal delivery charges!
            </p>
            <div className="mt-8 hover:scale-110">
              <Link
                to={"/menu"}
                className="bg-orange-600 rounded-lg p-2  font-mono text-white flex justify-center items-center gap-2 w-1/2 md:w-1/4"
              >
                Order now <GrLinkNext />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex-col justify-center items-center lg:w-1/2 mt-10 md:mt-0">
          <div className="flex justify-center items-center gap-10">
            <div className="border border-black p-6  rounded-lg bg-blue-50 text-center h-72 ">
              <img
                className="rounded-lg "
                src="https://img.freepik.com/free-photo/chocolate-ice-cream-dessert_144627-8364.jpg?w=740&t=st=1725636309~exp=1725636909~hmac=80778be8d6654edebee37c749aa928e79cf1905408d78615b478b2824800973b"
              />
              <h5 className="font-mono mt-2">Ice Cream</h5>
              <p className="text-xs">Chocolate & Vanilla</p>
              <p className="mt-2 text-red-600">₹60</p>
            </div>
            <div className="border border-black p-6  rounded-lg bg-blue-50 text-center h-72 pt-14 mt-10">
              <img
                className="rounded-lg"
                src="https://img.freepik.com/free-photo/pizza-pizza-filled-with-tomatoes-salami-olives_140725-1200.jpg?t=st=1725638063~exp=1725641663~hmac=751dc66e186be8f3c7ef72cacd574813a4cfd1d771f35470e92d5ee83107e242&w=826"
              />
              <h5 className="font-mono mt-2">Pizza</h5>
              <p className="text-xs">Veg with olives and cheese</p>
              <p className="mt-2 text-red-600">₹260</p>
            </div>
            <div className="border border-black p-6  rounded-lg bg-blue-50 text-center h-72 pt-16 -mt-20">
              <img
                className="rounded-lg"
                src="https://img.freepik.com/free-photo/variety-fruit-juices-black-background_23-2148227516.jpg?t=st=1725638272~exp=1725641872~hmac=137bb8f21f6a1212dce2a938baef778f2195adab962b36f63fbfd6fb0e6059e3&w=1060"
              />
              <h5 className="font-mono mt-2">Fresh Juices</h5>
              <p className="text-xs">Mixed Fruit juices</p>
              <p className="mt-2 text-red-600">₹80</p>
            </div>
          </div>
          <div className=" flex border border-black p-6  rounded-lg bg-blue-50 text-center mt-6 justify-center items-center gap-10">
            <img
              className="rounded-lg w-1/2"
              src="https://img.freepik.com/free-photo/top-view-delicious-food-table_23-2150857996.jpg?t=st=1725639230~exp=1725642830~hmac=70bdbd562d72439f9cf3b5520d3ae5b34d798dc26b57d8ed6b552e6ea6253b89&w=1380"
            />
            <div>
              <h5 className="font-mono mt-2">Veg Panner</h5>
              <p className="text-xs">Mixed vegies!!</p>
              <p className="mt-2 text-red-600">₹320</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border mt-10 border-gray-300"></div>
      <Carousel />
    </section>
  );
};

export default Home;
