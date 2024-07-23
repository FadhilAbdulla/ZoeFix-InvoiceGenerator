import React, { useState } from "react";
import { Route, useMatch,Routes } from "react-router-dom";

import LoadingSpinner from "./LoadingSpinner";
import {routerService} from "../../Router";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Dashboard from "../../MainPage/Dashboard";

const DefaultLayout =()=> {

    return (
      <>
        <div className="main-wrapper">
          <Header />
            <div>
            <Routes>
              {routerService &&
                routerService.map((route, key) => (
                  <Route key={key} path={`/${route.path}/*`} element={<route.component/>}/>
                ))}
            </Routes>
            </div>
          <Sidebar />
        </div>
        <div className="sidebar-overlay"></div>
      </>
    );
}
export default DefaultLayout;
