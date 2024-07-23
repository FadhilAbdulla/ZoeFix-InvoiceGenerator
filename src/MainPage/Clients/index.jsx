import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Clients from './Clients';
import AddNewClients from './AddNewClients';



export const Clients_Index = () =>(
    <Routes>
        <Route path="/" element={<Clients/>} /> 
        <Route path="/addnewclient" element={<AddNewClients/>} /> 
    </Routes>
)





