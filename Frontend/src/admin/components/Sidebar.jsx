import { LuChevronLast, LuChevronFirst } from "react-icons/lu";
import { CgMoreVertical } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { useContext, createContext, useState, useEffect, useRef } from "react";

import { Link } from "react-router-dom";
import { IoFastFoodOutline } from "react-icons/io5";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col   border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center mb-4">
          <Link to={"/admin"}
            className={`overflow-hidden transition-all  italic ${
              expanded ? "w-32" : "w-0"
            }`}
          >
            <div className="flex items-center text-3xl text-orange-600">
              <IoFastFoodOutline />
              <span className="font-mono text-xl font-semibold">Food</span>{" "}
              <span className="text-xs text-red-600 ml-2 border p-1 rounded-lg border-red-600">
                Admin
              </span>
            </div>
          </Link>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg "
          >
            {expanded ? <LuChevronFirst /> : <LuChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

export function SidebarItem({
  icon,
  text,
  active,
  alert,
  to,
  components,
  click,
  className,
}) {
  const { expanded } = useContext(SidebarContext);

  const content = (
    <>
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {components ? components : text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-red-500 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}
      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-orange-100 text-orange-600 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </>
  );

  return to ? (
    <Link
      to={to}
      className={`
      ${className} hover:scale-105
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-white  hover:text-slate-600"
        }
      `}
      onClick={click}
    >
      {content}
    </Link>
  ) : (
    <div
      className={`
      ${className} hover:scale-105
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-orange-400 to-red-300 text-white"
            : "hover:bg-white  hover:text-slate-600"
        }
      `}
      onClick={click}
    >
      {content}
    </div>
  );
}
