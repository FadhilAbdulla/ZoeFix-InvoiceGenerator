import React, { useState,useContext } from "react";
import {
  Logo,
  SmallLogo,
  Closes,
  HeaderSearch,
  FlagIn1,
  Notification,
  Avatar2,
  Avatar3,
  Avatar6,
  Avatar17,
  Avatar13,
  Logout,
  NoImage,
} from "../../EntryFile/imagePath";
import { Link } from "react-router-dom";
import { ApplicationAttributes } from "../App"; 
import { ApplicationLogout,FetchOutletImage } from "../../MainPage/Functions/CommonFunctions";
import { CircleSpinner } from "react-spinners-kit";
import { CloudFrontDistributionForOutletDataFetch } from "../../api/Aws-api";

const Header = (props) => {
  const [searchBar, SetSearchBar] = useState(false);
  const [toggle, SetToggle] = useState(false);
  const {B2BName,B2BUser,HeaderLoading} = useContext(ApplicationAttributes)
  const UserImage = NoImage
  const OutletHeaderImage = FetchOutletImage()
  const handlesidebar = () => {
    document.body.classList.toggle("mini-sidebar");
    SetToggle((current) => !current);
  };
  const expandMenu = () => {
    document.body.classList.remove("expand-menu");
  };
  const expandMenuOpen = () => {
    document.body.classList.add("expand-menu");
  };
  const sidebarOverlay = () => {
    document.querySelector(".main-wrapper").classList.toggle("slide-nav");
    document.querySelector(".sidebar-overlay").classList.toggle("opened");
    document.querySelector("html").classList.toggle("menu-opened");
  };

  let pathname = window.location.pathname;

  return (
    <>
      <div className="header">
        {/* Logo */}
        <div
          className={`header-left ${toggle ? "" : "active"}`}
          onMouseLeave={expandMenu}
          onMouseOver={expandMenuOpen}
        >
          <Link to="/dream-pos/dashboard" className="logo rounded-6">
            {OutletHeaderImage ? 
              <img src={CloudFrontDistributionForOutletDataFetch+"SP-OU-1/MainOutletHeaderImage1.png"} alt="" />
            :
            <img src={Logo} alt="" />
            }
            
          </Link>
          <Link to="/dream-pos/dashboard" className="logo-small rounded-6">
            {OutletHeaderImage ? 
              <img src={CloudFrontDistributionForOutletDataFetch+OutletHeaderImage} alt="" />
            :
              <img src={SmallLogo} alt="" />
            }
          </Link>
          <Link
            id="toggle_btn"
            to="#"
            style={{
              display: pathname.includes("tasks")
                ? "none"
                : pathname.includes("compose")
                ? "none"
                : "",
            }}
            onClick={handlesidebar}
          ></Link>{" "}
        </div>
        {/* /Logo */}
        <Link
          id="mobile_btn"
          className="mobile_btn"
          to="#"
          onClick={sidebarOverlay}
        >
          <span className="bar-icon">
            <span />
            <span />
            <span />
          </span>
        </Link>
        {/* Header Menu */}
        <ul className="nav user-menu">
        {HeaderLoading ?
        <li className="nav-item">
          <div className="header-refresh">
            {/*<iconify-icon icon="ic:baseline-refresh" style={{ color: 'orange', fontSize: '24px' }} ></iconify-icon>*/}
            <CircleSpinner  size={23} color ="orange" />
          </div>
        </li>
        :
          
          <li className="nav-item">
            <div className="top-nav-search">
              <Link to="#" className="responsive-search">
                <i className="fa fa-search" />
              </Link>
              <form action="#">
                <div className={`searchinputs ${searchBar ? "show" : ""}`}>
                  <input type="text" placeholder="Search Here ..." />
                  <div
                    className="search-addon"
                    onClick={() => SetSearchBar(false)}
                  >
                    <span>
                      <img src={Closes} alt="img" />
                    </span>
                  </div>
                </div>
                <Link
                  to="#"
                  className="btn"
                  id="searchdiv"
                  onClick={() => SetSearchBar(true)}
                >
                  <img src={HeaderSearch} alt="img" />
                </Link>
              </form>
            </div>
          </li>
          }
          {/* /Search */}
          {/* Flag */}
          <li className="nav-item dropdown has-arrow flag-nav">
            <Link
              to="#"
              className="nav-link dropdown-toggle"
              role="button"
            >
              <img src={FlagIn1} alt="" height={20} />
            </Link>
            {/*<div className="dropdown-menu dropdown-menu-right">
              <Link to="#" className="dropdown-item">
                <img src={FlagUS} alt="" height={16} /> English
              </Link>
              <Link to="#" className="dropdown-item">
                <img src={FlagFR} alt="" height={16} /> French
              </Link>
              <Link to="#" className="dropdown-item">
                <img src={FlagES} alt="" height={16} /> Spanish
              </Link>
              <Link to="#" className="dropdown-item">
                <img src={FlagDE} alt="" height={16} /> German
              </Link>
      </div>*/}
          </li>
          {/* /Flag */}
          {/* Notifications */}
          <li className="nav-item dropdown">
            <Link
              to="#"
              className="dropdown-toggle nav-link"
              data-bs-toggle="dropdown"
            >
              <img src={Notification} alt="img" className="noti-image" />
              <span className="badge rounded-pill">4</span>
            </Link>
            <div className="dropdown-menu notifications">
              <div className="topnav-dropdown-header">
                <span className="notification-title">Notifications</span>
                <Link to="#" className="clear-noti">
                  {" "}
                  Clear All{" "}
                </Link>
              </div>
              <div className="noti-content">
                <ul className="notification-list">
                  <li className="notification-message">
                    <Link to="/dream-pos/dashboard">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <img alt="" src={Avatar2} />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">John Doe</span> added
                            new task{" "}
                            <span className="noti-title">
                              Patient appointment booking
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              4 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link to="/dream-pos/dashboard">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <img alt="" src={Avatar3} />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Tarah Shropshire</span>{" "}
                            changed the task name{" "}
                            <span className="noti-title">
                              Appointment booking with payment gateway
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              6 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link to="/dream-pos/dashboard">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <img alt="" src={Avatar6} />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Misty Tison</span>{" "}
                            added{" "}
                            <span className="noti-title">Domenic Houston</span>{" "}
                            and <span className="noti-title">Claire Mapes</span>{" "}
                            to project{" "}
                            <span className="noti-title">
                              Doctor available module
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              8 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link to="/dream-pos/dashboard">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <img alt="" src={Avatar17} />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Rolland Webber</span>{" "}
                            completed task{" "}
                            <span className="noti-title">
                              Patient and Doctor video conferencing
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              12 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link to="/dream-pos/dashboard">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <img alt="" src={Avatar13} />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Bernardo Galaviz</span>{" "}
                            added new task{" "}
                            <span className="noti-title">
                              Private chat module
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              2 days ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="topnav-dropdown-footer">
                <Link to="/dream-pos/activities">View all Notifications</Link>
              </div>
            </div>
          </li>
          {/* /Notifications */}
          <li className="nav-item dropdown has-arrow main-drop">
            <Link
              to="#"
              className="dropdown-toggle nav-link userset"
              data-bs-toggle="dropdown"
            >
              <span className="user-img">
                <img src={UserImage} alt="" />
                <span className="status online" />
              </span>
            </Link>
            <div className="dropdown-menu menu-drop-user">
              <div className="profilename">
                <div className="profileset">
                  <span className="user-img">
                    <img src={UserImage} alt="" />
                    <span className="status online" />
                  </span>
                  <div className="profilesets">
                    <h6>{B2BName}</h6>
                    <h5>{B2BUser ? "SuperAdmin" : "Agent"}</h5>
                  </div>
                </div>
                <hr className="m-0" />
                <Link className="dropdown-item" to="/dream-pos/dashboard">
                  <i className="me-2" data-feather="user" /> My Profile
                </Link>
                <Link
                  className="dropdown-item"
                  to="/dream-pos/settings"
                >
                  <i className="me-2" data-feather="settings" />
                  Settings
                </Link>
                <hr className="m-0" />
                <Link className="dropdown-item logout pb-0" to="/signIn" onClick={()=>ApplicationLogout(props.history)}>
                  <img src={Logout} className="me-2" alt="img" />
                  Logout
                </Link>
              </div>
            </div>
          </li>
        </ul>
        {/* /Header Menu */}
        {/* Mobile Menu */}
        <div className="dropdown mobile-user-menu">
          <Link
            to="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to="/dream-pos/dashboard">
              My Profile
            </Link>
            <Link className="dropdown-item" to="/dream-pos/settings">
              Settings
            </Link>
            <Link className="dropdown-item" to="/signIn" onClick={()=>ApplicationLogout(props.history)}>
              Logout
            </Link>
          </div>
        </div>
        {/* /Mobile Menu */}
      </div>
    </>
  );
};

export default Header;
