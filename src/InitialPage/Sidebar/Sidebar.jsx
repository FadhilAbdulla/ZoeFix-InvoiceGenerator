import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Dashboard,
  Expense,
  People,
  Places,
  Product,
  Time,
  Users1,
  settings,
  Purchase,
  Quotation,
  Return,
  Transfer,
  Sales1,
} from "../../EntryFile/imagePath";
import { Scrollbars } from "react-custom-scrollbars-2";
import FeatherIcon from "feather-icons-react";
import { ApplicationAttributes } from "../App";
import { WorkFlowSpecificNameChanger } from "../../MainPage/Functions/CommonFunctions";

const Sidebar = (props) => {
  const [isSideMenu, setSideMenu] = useState("");
  const navigate = useNavigate()

  const toggleSidebar = (value) => {
    setSideMenu(value);
  };
  const expandMenu = () => {
    document.body.classList.remove("expand-menu");
  };
  const expandMenuOpen = () => {
    document.body.classList.add("expand-menu");
  };

  let pathname = window.location.pathname;
  useEffect(() => {
    document.querySelector(".main-wrapper").classList.remove("slide-nav");
    document.querySelector(".sidebar-overlay").classList.remove("opened");
    document.querySelector(".sidebar-overlay").onclick = function () {
      this.classList.remove("opened");
      document.querySelector(".main-wrapper").classList.remove("slide-nav");
    };
  }, [pathname]);
  return (
    <div className="sidebar" id="sidebar">
      <Scrollbars>
        <div className="sidebar-inner slimscroll">
          <div
            id="sidebar-menu"
            className="sidebar-menu"
            onMouseLeave={expandMenu}
            onMouseOver={expandMenuOpen}
          >
            <ul>
              <li className={pathname.includes("dashboard") ? "active" : ""}>
                <Link
                  to="/zoefix/dashboard"
                  onClick={() => toggleSidebar(isSideMenu == "" ? "" : "")}
                >
                  <img src={Dashboard} alt="img" />
                  <span>Dashboard</span>
                </Link>
              </li>

              {/* <li className={pathname.includes("session") ? "active" : ""}>
                  <Link
                    to="/dream-pos/session"
                    onClick={() => toggleSidebar(isSideMenu == "" ? "" : "")}
                  >
                    <img src={People} alt="img" />
                    <span>Session</span>
                  </Link>
                </li>*/}

              {/* <li className="submenu">
                <a
                  href="#"
                  className={
                    pathname.includes("/dream-pos/session")
                      ? "active subdrop"
                      : "" || isSideMenu == "session"
                        ? "subdrop active"
                        : ""
                  }

                  onClick={() => { toggleSidebar(isSideMenu == "session" ? "" : "session") }}
                >
                  <img src={Sales1} alt="img" />
                  <span> Bill </span> <span className="menu-arrow" />
                </a>

                <ul>

                  <li>
                    <Link
                      className={
                        pathname.includes("addnewbill") 
                      }
                      to="/zoefix/bill/addnewbill"
                      
                    >
                      Add New Bill
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        pathname.includes("listbill") 
                      }
                      to="/zoefix/bill/listbill"
                      
                    >
                      List Bills
                    </Link>
                  </li>


                </ul>

              </li> */}
              <li className={pathname.includes("bill") ? "active" : ""}>
                <Link
                  to="/zoefix/bill"
                  onClick={() => toggleSidebar(isSideMenu == "" ? "" : "")}
                >
                  <img src={Sales1} alt="img" />
                  <span>Bill</span>
                </Link>
              </li>
              <li className={pathname.includes("clients") ? "active" : ""}>
                <Link
                  to="/zoefix/clients"
                  onClick={() => toggleSidebar(isSideMenu == "" ? "" : "")}
                >
                  <img src={People} alt="img" />
                  <span>Client</span>
                </Link>
              </li>
              <li className={pathname.includes("item") ? "active" : ""}>
                <Link
                  to="/zoefix/item"
                  onClick={() => toggleSidebar(isSideMenu == "" ? "" : "")}
                >
                  <img src={Product} alt="img" />
                  <span>Item</span>
                </Link>
              </li>
              <li className={pathname.includes("report") ? "active" : ""}>
                <Link
                  to="/zoefix/report"
                  onClick={() => toggleSidebar(isSideMenu == "" ? "" : "")}
                >
                  <img src={Transfer} alt="img" />
                  <span>Report</span>
                </Link>
              </li>
              <li className={pathname.includes("settings") ? "active" : ""}>
                <Link
                  to="/zoefix/settings"
                  onClick={() => toggleSidebar(isSideMenu == "" ? "" : "")}
                >
                  <img src={settings} alt="img" />
                  <span>Settings</span>
                </Link>
              </li>

            </ul>
          </div>
        </div>
      </Scrollbars>
    </div>
  );
};

export default Sidebar;
