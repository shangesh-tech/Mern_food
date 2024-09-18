import { MdOutlineBugReport, MdOutlineDashboard } from "react-icons/md";
import { FaCartArrowDown } from "react-icons/fa";
import { RiStockFill } from "react-icons/ri";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import Sidebar, { SidebarItem } from "../components/Sidebar";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const Admin_App = () => {
  const navigate = useNavigate();
  const checkAdminRole = async () => {
    try {
      const response = await axios.get("https://mern-food-bl34.onrender.com/api/v1/check-admin");
      if (!response.data.success || response.data.role != "admin") {
        navigate("/");
      }
    } catch (error) {
      navigate("/");
    }
  };
  const logout = async () => {
    try {
      const response = await axios.get("https://mern-food-bl34.onrender.com/api/v1/logout");
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    checkAdminRole();
  }, [navigate]);

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarItem
          icon={<MdOutlineDashboard size={22} />}
          text={<Link to="/admin">Dashboard</Link>}
          alert
          active={true}
        />
        <SidebarItem
          icon={<FaCartArrowDown size={22} />}
          text={"Orders"}
          to={"orders"}
        />
        <SidebarItem
          icon={<RiStockFill size={22} />}
          text={"Products"}
          to={"products"}
        />
        <SidebarItem
          icon={<IoMdAddCircleOutline size={22} />}
          text={"Product"}
          to={"new_product"}
        />
        <SidebarItem
          icon={<FaRegUser size={24} />}
          text={"Users"}
          to={"users"}
          alert
          //   components={<h1>Donate</h1>}
        />

        <SidebarItem
          icon={<MdOutlineBugReport size={24} />}
          text={"Report Issues"}
          click={() => (window.location.href = "mailto:shangesh2006@gmail.com")}
        />
        <SidebarItem
          icon={<IoMdLogOut size={24} />}
          text={"Logout"}
          click={()=>{
            logout()
          }}
          className={"text-red-500 hover:text-red-600"}
        />
      </Sidebar>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin_App;
