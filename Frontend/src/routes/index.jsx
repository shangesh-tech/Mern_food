import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Menu from "../pages/Menu";
import Cart from "../pages/Cart";
import Admin_App from "../admin/pages/App";
import Orders from "../admin/pages/Orders";
import Product from "../admin/pages/Products";
import AddProduct from "../admin/pages/Add_products";
import Users from "../admin/pages/Users";
import SignIn from "../pages/SignIn";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/Forgot_Password";
import ResetPassword from "../pages/Reset_Password";
import Dash from "../admin/pages/Dash";
import Settings from "../pages/Settings";
import My_order from "../pages/My_order";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
      },
      {
        path: "/settings",
        element: <Settings/>,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path:"/order",
        element:<My_order/>
      }
    ],
  },
  {
    path: "/admin",
    element: <Admin_App />,
    children: [
      {
        path: "",
        element:(<Dash/>)
      },
      {
        path:"orders",
        element:(<Orders/>)
      },
      {
        path: "products",
        element:(<Product/>)
      },
      {
        path: "new_product",
        element: (<AddProduct />),
      },
      {
        path:"users",
        element:(<Users/>)
      },
      
    ],
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path:"/forgot_password",
    element: (<ForgotPassword />),
  },
  {
    path: "/reset_password",
    element: (<ResetPassword />),
  }
]);

export default router;