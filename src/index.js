import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter} from 'react-router-dom';
import App from "./InitialPage/App";
import { GoogleOAuthProvider} from '@react-oauth/google';
import { CookiesProvider } from "react-cookie";


import './assets/plugins/fontawesome/css/fontawesome.min.css'
import './assets/plugins/fontawesome/css/all.min.css'
import './assets/css/bootstrap.min.css';
//import "./assets/js/bootstrap.bundle.min.js";
import './assets/css/font-awesome.min.css';
import './assets/css/line-awesome.min.css'; 
import './assets/css/style.css';


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <GoogleOAuthProvider clientId="994924790924-rbd162a0n5h0h9bb7gbng7tb4hho9sc3.apps.googleusercontent.com">
      <CookiesProvider>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </CookiesProvider>
    </GoogleOAuthProvider>

);
