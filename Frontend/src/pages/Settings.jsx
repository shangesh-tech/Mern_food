import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SpringModal } from "../components/Update_profile";

const Settings = () => {
  const [userData, setUserData] = useState({});
  const [isOpenModal, setIsOpenModal] = useState(false);

  // Fetch user data
  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/v1/me");
      if (response.data.success) {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleClick = () => {
    setIsOpenModal(true);
  };

  return (
    <section className="flex flex-col justify-center items-center mt-20">
      <div className="mx-64 p-4 md:p-6 lg:p-8 bg-white border border-orange-600 rounded-xl">
        <h1 className="text-2xl font-bold mb-4 text-orange-600 font-mono underline underline-offset-4">
          My Profile
        </h1>
        <div className="flex flex-col md:flex-row justify-center items-center mb-4">
          <img
            id="avatarButton"
            className="w-32 h-32 rounded-full cursor-pointer"
            src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
            alt="User Avatar"
          />
          <div className="flex flex-col font-mono">
            <p className="text-lg font-bold mb-2">
              <span className="text-orange-600">Name:</span> {userData.name}
            </p>
            <p className="text-lg font-bold mb-2">
              <span className="text-orange-600">Email:</span> {userData.email}
            </p>
            <p className="text-lg font-bold mb-2">
              <span className="text-orange-600">Gender:</span> {userData.gender}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-8 mt-6">
        <button
          onClick={handleClick}
          className="border-2 border-orange-600 bg-orange-600 p-2 rounded-lg hover:scale-105 text-white font-mono"
        >
          Update Profile
        </button>
        <Link
          to={"/change-password"}
          className="border-2 border-orange-600 bg-orange-600 p-2 rounded-lg hover:scale-105 text-white font-mono"
        >
          Change Password
        </Link>
      </div>
      {/* Modal */}
      {isOpenModal ? (
        <SpringModal
          isOpen={isOpenModal}
          setIsOpen={setIsOpenModal}
          userData={userData}
          setUserData={setUserData}
        />
      ) : (
        ""
      )}
    </section>
  );
};

export default Settings;
